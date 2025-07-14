import express from 'express';
import rateLimit from 'express-rate-limit';
import validator from 'validator';
import { db } from '../db.js';
import { wcagScans, wcagScanIssues } from '../../shared/schema.js';
import WCAGChecker from '../services/wcagChecker.js';
import ComprehensiveWCAGChecker from '../services/comprehensiveWCAGChecker.js';
import { eq, desc, and } from 'drizzle-orm';
// import PDFDocument from 'pdfkit'; // Temporarily disabled
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Rate limiting for WCAG scans
const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many scan requests, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create WCAG checker instances
const wcagChecker = new WCAGChecker();
const comprehensiveChecker = new ComprehensiveWCAGChecker();

// Helper function to sanitize URL input
function sanitizeUrl(url) {
  // Remove any potentially dangerous characters
  const sanitized = validator.escape(url.trim());
  
  // Validate URL format
  if (!validator.isURL(sanitized, { 
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true
  })) {
    throw new Error('Invalid URL format');
  }
  
  return sanitized;
}

// Helper function to save scan results to database
async function saveScanResults(scanData, userId = null) {
  try {
    // Insert main scan record
    const [scan] = await db.insert(wcagScans).values({
      userId,
      url: scanData.url,
      overallScore: scanData.overallScore,
      totalIssues: scanData.totalIssues,
      criticalIssues: scanData.criticalIssues,
      seriousIssues: scanData.seriousIssues,
      moderateIssues: scanData.moderateIssues,
      minorIssues: scanData.minorIssues,
      scanData: JSON.stringify(scanData),
      status: 'completed',
      scanDuration: scanData.scanDuration,
    }).returning();

    // Insert individual issues
    const issues = [];
    
    // Process axe-core issues
    if (scanData.checks.axeCore?.violations) {
      scanData.checks.axeCore.violations.forEach(violation => {
        violation.nodes.forEach(node => {
          issues.push({
            scanId: scan.id,
            issueType: violation.id,
            severity: violation.impact || 'moderate',
            wcagGuideline: violation.tags.find(tag => tag.startsWith('wcag'))?.replace('wcag', '') || null,
            element: node.html,
            message: violation.description,
            recommendation: violation.help,
            xpath: node.target[0],
            selector: node.target[0],
          });
        });
      });
    }

    // Process pa11y issues
    if (scanData.checks.pa11y?.issues) {
      scanData.checks.pa11y.issues.forEach(issue => {
        issues.push({
          scanId: scan.id,
          issueType: issue.code,
          severity: issue.type === 'error' ? 'serious' : issue.type === 'warning' ? 'moderate' : 'minor',
          wcagGuideline: issue.code.match(/WCAG2AA\.Principle\d\.Guideline\d_\d\.(\d_\d_\d)/)?.[1]?.replace(/_/g, '.') || null,
          element: issue.context,
          message: issue.message,
          recommendation: `Fix ${issue.type}: ${issue.message}`,
          selector: issue.selector,
        });
      });
    }

    // Process custom check issues
    if (scanData.checks.custom?.issues) {
      scanData.checks.custom.issues.forEach(issue => {
        issues.push({
          scanId: scan.id,
          issueType: issue.type,
          severity: issue.severity,
          wcagGuideline: issue.wcagGuideline,
          element: issue.element,
          message: issue.message,
          recommendation: issue.recommendation,
        });
      });
    }

    // Batch insert issues
    if (issues.length > 0) {
      await db.insert(wcagScanIssues).values(issues);
    }

    return scan.id;
  } catch (error) {
    console.error('Error saving scan results:', error);
    throw error;
  }
}

// POST /api/wcag/scan - Start a new WCAG scan
router.post('/scan', scanLimiter, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        error: 'URL is required',
        message: 'Please provide a valid URL to scan'
      });
    }

    // Sanitize and validate URL
    const sanitizedUrl = sanitizeUrl(url);
    
    // Get user ID if authenticated
    const userId = req.user?.id || null;
    
    console.log(`Starting WCAG scan for URL: ${sanitizedUrl}${userId ? ` (User: ${userId})` : ' (Anonymous)'}`);
    
    // Start the scan
    const startTime = Date.now();
    
    // Use comprehensive checker for detailed WCAG analysis
    const scanResult = await comprehensiveChecker.performScan(sanitizedUrl);
    
    // Save results to database
    const scanId = await saveScanResults(scanResult, userId);
    
    const endTime = Date.now();
    console.log(`WCAG scan completed for ${sanitizedUrl} in ${endTime - startTime}ms`);
    
    res.json({
      ...scanResult,
      scanId,
      message: 'Scan completed successfully'
    });

    // Run the scan asynchronously
    try {
      const scanResults = await wcagChecker.runWCAGChecks(sanitizedUrl);
      scanResults.scanDuration = Date.now() - startTime;
      
      // Save results to database
      const scanId = await saveScanResults(scanResults, userId);
      
      console.log(`WCAG scan completed for ${sanitizedUrl}, scan ID: ${scanId}`);
    } catch (scanError) {
      console.error('WCAG scan failed:', scanError);
      
      // Save failed scan to database
      try {
        await db.insert(wcagScans).values({
          userId,
          url: sanitizedUrl,
          status: 'failed',
          errorMessage: scanError.message,
          scanDuration: Date.now() - startTime,
        });
      } catch (dbError) {
        console.error('Failed to save scan error to database:', dbError);
      }
    }
    
  } catch (error) {
    console.error('Error starting WCAG scan:', error);
    res.status(400).json({
      error: 'Scan failed to start',
      message: error.message
    });
  }
});

// GET /api/wcag/scan/:id - Get scan results by ID
router.get('/scan/:id', async (req, res) => {
  try {
    const scanId = parseInt(req.params.id);
    
    if (isNaN(scanId)) {
      return res.status(400).json({
        error: 'Invalid scan ID',
        message: 'Scan ID must be a valid number'
      });
    }

    // Get scan with issues
    const scan = await db.query.wcagScans.findFirst({
      where: eq(wcagScans.id, scanId),
      with: {
        issues: true
      }
    });

    if (!scan) {
      return res.status(404).json({
        error: 'Scan not found',
        message: 'No scan found with the provided ID'
      });
    }

    // Check if user has access to this scan
    const userId = req.user?.id;
    if (scan.userId && scan.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view this scan'
      });
    }

    res.json({
      id: scan.id,
      url: scan.url,
      overallScore: scan.overallScore,
      totalIssues: scan.totalIssues,
      criticalIssues: scan.criticalIssues,
      seriousIssues: scan.seriousIssues,
      moderateIssues: scan.moderateIssues,
      minorIssues: scan.minorIssues,
      status: scan.status,
      errorMessage: scan.errorMessage,
      scanDuration: scan.scanDuration,
      createdAt: scan.createdAt,
      updatedAt: scan.updatedAt,
      issues: scan.issues,
      fullResults: scan.scanData ? JSON.parse(scan.scanData) : null
    });

  } catch (error) {
    console.error('Error retrieving scan results:', error);
    res.status(500).json({
      error: 'Failed to retrieve scan results',
      message: 'An internal error occurred while retrieving the scan results'
    });
  }
});

// GET /api/wcag/scans - Get scan history for authenticated user
router.get('/scans', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please log in to view your scan history'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    // Get user's scans with pagination
    const scans = await db.query.wcagScans.findMany({
      where: eq(wcagScans.userId, userId),
      orderBy: [desc(wcagScans.createdAt)],
      limit,
      offset,
      with: {
        issues: {
          limit: 5 // Only get first 5 issues for the list view
        }
      }
    });

    // Get total count for pagination
    const totalScans = await db.select().from(wcagScans).where(eq(wcagScans.userId, userId));

    res.json({
      scans: scans.map(scan => ({
        id: scan.id,
        url: scan.url,
        overallScore: scan.overallScore,
        totalIssues: scan.totalIssues,
        criticalIssues: scan.criticalIssues,
        seriousIssues: scan.seriousIssues,
        moderateIssues: scan.moderateIssues,
        minorIssues: scan.minorIssues,
        status: scan.status,
        scanDuration: scan.scanDuration,
        createdAt: scan.createdAt,
        topIssues: scan.issues.slice(0, 3) // Show top 3 issues in list
      })),
      pagination: {
        page,
        limit,
        total: totalScans.length,
        totalPages: Math.ceil(totalScans.length / limit)
      }
    });

  } catch (error) {
    console.error('Error retrieving scan history:', error);
    res.status(500).json({
      error: 'Failed to retrieve scan history',
      message: 'An internal error occurred while retrieving your scan history'
    });
  }
});

// POST /api/wcag/scan/:id/rescan - Re-scan a previously scanned URL
router.post('/scan/:id/rescan', scanLimiter, async (req, res) => {
  try {
    const scanId = parseInt(req.params.id);
    
    if (isNaN(scanId)) {
      return res.status(400).json({
        error: 'Invalid scan ID',
        message: 'Scan ID must be a valid number'
      });
    }

    // Get original scan
    const originalScan = await db.query.wcagScans.findFirst({
      where: eq(wcagScans.id, scanId)
    });

    if (!originalScan) {
      return res.status(404).json({
        error: 'Original scan not found',
        message: 'No scan found with the provided ID'
      });
    }

    // Check if user has access to rescan
    const userId = req.user?.id;
    if (originalScan.userId && originalScan.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to rescan this URL'
      });
    }

    const url = originalScan.url;
    console.log(`Starting WCAG re-scan for URL: ${url}${userId ? ` (User: ${userId})` : ' (Anonymous)'}`);
    
    // Start the re-scan
    const startTime = Date.now();
    
    res.status(202).json({
      message: 'Re-scan started successfully',
      url,
      originalScanId: scanId,
      status: 'pending'
    });

    // Run the scan asynchronously
    try {
      const scanResults = await wcagChecker.runWCAGChecks(url);
      scanResults.scanDuration = Date.now() - startTime;
      
      // Save new scan results
      const newScanId = await saveScanResults(scanResults, userId);
      
      console.log(`WCAG re-scan completed for ${url}, new scan ID: ${newScanId}`);
    } catch (scanError) {
      console.error('WCAG re-scan failed:', scanError);
      
      // Save failed scan to database
      try {
        await db.insert(wcagScans).values({
          userId,
          url,
          status: 'failed',
          errorMessage: scanError.message,
          scanDuration: Date.now() - startTime,
        });
      } catch (dbError) {
        console.error('Failed to save re-scan error to database:', dbError);
      }
    }
    
  } catch (error) {
    console.error('Error starting WCAG re-scan:', error);
    res.status(400).json({
      error: 'Re-scan failed to start',
      message: error.message
    });
  }
});

// GET /api/wcag/scan/:id/download/pdf - Download scan results as PDF
router.get('/scan/:id/download/pdf', async (req, res) => {
  try {
    return res.status(501).json({
      error: 'PDF generation temporarily disabled',
      message: 'PDF downloads are currently under maintenance. Please use JSON export instead.'
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({
      error: 'Failed to generate PDF report',
      message: 'An internal error occurred while generating the PDF report'
    });
  }
});

// GET /api/wcag/scan/:id/download/json - Download scan results as JSON
router.get('/scan/:id/download/json', async (req, res) => {
  try {
    const scanId = parseInt(req.params.id);
    
    if (isNaN(scanId)) {
      return res.status(400).json({
        error: 'Invalid scan ID',
        message: 'Scan ID must be a valid number'
      });
    }

    // Get scan with issues
    const scan = await db.query.wcagScans.findFirst({
      where: eq(wcagScans.id, scanId),
      with: {
        issues: true
      }
    });

    if (!scan) {
      return res.status(404).json({
        error: 'Scan not found',
        message: 'No scan found with the provided ID'
      });
    }

    // Check if user has access to this scan
    const userId = req.user?.id;
    if (scan.userId && scan.userId !== userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to download this scan'
      });
    }

    const filename = `wcag-scan-${scan.id}-${new Date().toISOString().split('T')[0]}.json`;
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const exportData = {
      scan: {
        id: scan.id,
        url: scan.url,
        overallScore: scan.overallScore,
        totalIssues: scan.totalIssues,
        criticalIssues: scan.criticalIssues,
        seriousIssues: scan.seriousIssues,
        moderateIssues: scan.moderateIssues,
        minorIssues: scan.minorIssues,
        status: scan.status,
        scanDuration: scan.scanDuration,
        createdAt: scan.createdAt,
        updatedAt: scan.updatedAt
      },
      issues: scan.issues,
      fullResults: scan.scanData ? JSON.parse(scan.scanData) : null,
      exportDate: new Date().toISOString()
    };
    
    res.json(exportData);

  } catch (error) {
    console.error('Error generating JSON export:', error);
    res.status(500).json({
      error: 'Failed to generate JSON export',
      message: 'An internal error occurred while generating the JSON export'
    });
  }
});

// POST /api/wcag-simple/scan - Comprehensive WCAG scan with detailed worldwide guidelines
router.post('/wcag-simple/scan', scanLimiter, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        error: 'URL is required',
        message: 'Please provide a valid URL to scan'
      });
    }

    // Sanitize and validate URL
    const sanitizedUrl = sanitizeUrl(url);
    
    // Get user ID if authenticated
    const userId = req.user?.id || null;
    
    console.log(`Starting comprehensive WCAG scan for URL: ${sanitizedUrl}${userId ? ` (User: ${userId})` : ' (Anonymous)'}`);
    
    try {
      // Perform comprehensive scan using worldwide WCAG guidelines
      const comprehensiveResult = await comprehensiveChecker.performScan(sanitizedUrl);
      
      // Transform data for database storage
      const dbScanData = {
        url: sanitizedUrl,
        overallScore: comprehensiveResult.summary.accessibilityScore,
        totalIssues: comprehensiveResult.summary.totalIssues,
        criticalIssues: comprehensiveResult.summary.criticalIssues,
        seriousIssues: comprehensiveResult.summary.seriousIssues,
        moderateIssues: comprehensiveResult.summary.moderateIssues,
        minorIssues: comprehensiveResult.summary.minorIssues,
        scanDuration: comprehensiveResult.scanDuration,
        checks: {
          comprehensive: comprehensiveResult
        }
      };
      
      // Save to database
      const scanId = await saveScanResults(dbScanData, userId);
      
      console.log(`Comprehensive WCAG scan completed for ${sanitizedUrl} in ${comprehensiveResult.scanDuration}ms`);
      
      // Return structured accessibility report
      res.json({
        success: true,
        scanId,
        
        // Summary Overview
        summary: {
          totalIssues: comprehensiveResult.summary.totalIssues,
          severityBreakdown: {
            critical: comprehensiveResult.summary.criticalIssues,
            serious: comprehensiveResult.summary.seriousIssues,
            moderate: comprehensiveResult.summary.moderateIssues,
            minor: comprehensiveResult.summary.minorIssues
          },
          passedChecks: comprehensiveResult.summary.passedChecks,
          overallScore: comprehensiveResult.summary.accessibilityScore,
          conformanceLevel: comprehensiveResult.summary.conformanceLevel
        },
        
        // Detailed Issue List
        issues: comprehensiveResult.detailedIssues.map(issue => ({
          wcagRule: issue.wcagRule,
          ruleName: issue.ruleName,
          severity: issue.severity,
          principle: issue.principle,
          element: issue.element,
          selector: issue.selector,
          description: issue.description,
          recommendation: issue.recommendation,
          location: issue.location,
          htmlSnippet: issue.html
        })),
        
        // Issues Grouped by WCAG Principle
        issuesByPrinciple: {
          perceivable: {
            count: comprehensiveResult.issuesByPrinciple.perceivable.length,
            issues: comprehensiveResult.issuesByPrinciple.perceivable
          },
          operable: {
            count: comprehensiveResult.issuesByPrinciple.operable.length,
            issues: comprehensiveResult.issuesByPrinciple.operable
          },
          understandable: {
            count: comprehensiveResult.issuesByPrinciple.understandable.length,
            issues: comprehensiveResult.issuesByPrinciple.understandable
          },
          robust: {
            count: comprehensiveResult.issuesByPrinciple.robust.length,
            issues: comprehensiveResult.issuesByPrinciple.robust
          }
        },
        
        // List of Passed Checks
        passedChecks: comprehensiveResult.passedChecks.map(check => ({
          wcagRule: check.wcagRule,
          description: check.description,
          help: check.help
        })),
        
        // Metadata
        scanMetadata: {
          url: sanitizedUrl,
          timestamp: comprehensiveResult.timestamp,
          scanDuration: comprehensiveResult.scanDuration,
          wcagVersion: comprehensiveResult.scanMetadata.wcagVersion,
          toolVersion: comprehensiveResult.scanMetadata.toolVersion,
          conformanceLevel: comprehensiveResult.summary.conformanceLevel,
          accessibilityScore: comprehensiveResult.summary.accessibilityScore
        },
        
        // WCAG Guidelines Reference
        wcagGuidelines: {
          version: '2.2',
          principles: {
            perceivable: 'Information and user interface components must be presentable to users in ways they can perceive.',
            operable: 'User interface components and navigation must be operable.',
            understandable: 'Information and the operation of user interface must be understandable.',
            robust: 'Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.'
          }
        }
      });
      
    } catch (scanError) {
      console.error('Comprehensive scan error:', scanError);
      
      // Fallback to simple scan if comprehensive scan fails
      console.log('Falling back to simple scan...');
      const fallbackResult = await wcagChecker.scanUrl(sanitizedUrl);
      const scanId = await saveScanResults(fallbackResult, userId);
      
      res.json({
        success: true,
        scanId,
        fallback: true,
        message: 'Comprehensive scan failed, using basic scan results',
        summary: {
          totalIssues: fallbackResult.totalIssues || 0,
          severityBreakdown: {
            critical: fallbackResult.criticalIssues || 0,
            serious: fallbackResult.seriousIssues || 0,
            moderate: fallbackResult.moderateIssues || 0,
            minor: fallbackResult.minorIssues || 0
          },
          passedChecks: 0,
          overallScore: fallbackResult.overallScore || 0,
          conformanceLevel: 'Unknown'
        },
        issues: [],
        scanMetadata: {
          url: sanitizedUrl,
          timestamp: new Date().toISOString(),
          fallback: true
        }
      });
    }
    
  } catch (error) {
    console.error('WCAG scan endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Scan failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Cleanup function for graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Cleaning up WCAG checker...');
  await wcagChecker.cleanup();
});

process.on('SIGINT', async () => {
  console.log('Cleaning up WCAG checker...');
  await wcagChecker.cleanup();
});

export default router;