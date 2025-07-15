import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../middleware/userAuth.js';
import { logRequest } from '../utils/logger.js';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication middleware to all scanner routes
router.use(requireAuth);

/**
 * Trigger manual accessibility scan for a specific site connection
 * POST /api/scanner/trigger/:connectionId
 */
router.post('/trigger/:connectionId', logRequest, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    // Production logging: `🔍 [SCANNER] Manual scan trigger requested for connection ${connectionId} by user ${userId};

    // Verify the connection belongs to the authenticated user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: parseInt(connectionId),
        userId: userId,
        isActive: true,
        apiToken: { not: null }
      }
    });

    if (!connection) {
      // Production logging: `❌ [SCANNER] Connection ${connectionId} not found or not accessible by user ${userId};
      return res.status(404).json({
        success: false,
        error: 'Site connection not found or not accessible'
      });
    }

    // Import the job queue singleton
    const siteScannerQueue = (await import('../jobs/siteScanner.js')).default;
    
    // Ensure job queue is initialized
    if (!siteScannerQueue.boss) {
      await siteScannerQueue.initialize();
    }

    // Trigger immediate scan job
    const jobData = {
      connectionId: connection.id,
      userId: connection.userId,
      siteName: connection.siteName,
      siteUrl: connection.siteUrl,
      platform: connection.platform,
      frequency: 'manual',
      triggeredBy: 'user'
    };

    const jobId = await siteScannerQueue.triggerManualScan(jobData);

    // Production logging: `✅ [SCANNER] Manual scan job ${jobId} queued for ${connection.siteName};

    res.json({
      success: true,
      message: 'Accessibility scan started successfully',
      jobId: jobId,
      connection: {
        id: connection.id,
        siteName: connection.siteName,
        siteUrl: connection.siteUrl,
        platform: connection.platform
      }
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error triggering manual scan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger accessibility scan',
      details: error.message
    });
  }
});

/**
 * Get scan history for a specific site connection
 * GET /api/scanner/history/:connectionId
 */
router.get('/history/:connectionId', logRequest, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;
    const { limit = 10, offset = 0 } = req.query;

    // Verify the connection belongs to the authenticated user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: parseInt(connectionId),
        userId: userId
      }
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Site connection not found or not accessible'
      });
    }

    // For now, return mock scan history until we implement scan results storage
    const scanHistory = [
      {
        id: 1,
        connectionId: connection.id,
        scanType: 'automated',
        status: 'completed',
        totalIssues: 5,
        criticalIssues: 1,
        warningIssues: 4,
        startedAt: new Date(Date.now() - 86400000), // 1 day ago
        completedAt: new Date(Date.now() - 86400000 + 30000) // 30 seconds later
      }
    ];

    res.json({
      success: true,
      history: scanHistory,
      total: scanHistory.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error fetching scan history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan history'
    });
  }
});

/**
 * Get current scan status for a site connection
 * GET /api/scanner/status/:connectionId
 */
router.get('/status/:connectionId', logRequest, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.id;

    // Verify the connection belongs to the authenticated user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: parseInt(connectionId),
        userId: userId
      }
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Site connection not found or not accessible'
      });
    }

    // Check if there's an active scan job for this connection
    // This would integrate with pg-boss to check job status
    const scanStatus = {
      connectionId: connection.id,
      isScanning: false,
      lastScan: connection.lastScanAt,
      nextScheduledScan: null, // This would be calculated based on scan frequency
      scanFrequency: connection.scanFrequency,
      autoScanEnabled: connection.autoScanEnabled
    };

    res.json({
      success: true,
      status: scanStatus
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error fetching scan status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan status'
    });
  }
});

/**
 * Stop the 15-second testing schedule
 * POST /api/scanner/schedule/stop
 */
router.post('/schedule/stop', logRequest, async (req, res) => {
  try {
    const siteScannerQueue = (await import('../jobs/siteScanner.js')).default;
    
    if (!siteScannerQueue.boss) {
      await siteScannerQueue.initialize();
    }

    siteScannerQueue.stopTestingSchedule();
    
    // Production logging: '🛑 [SCANNER] 15-second testing schedule stopped by user');
    
    res.json({
      success: true,
      message: 'Testing schedule stopped successfully'
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error stopping schedule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to stop testing schedule'
    });
  }
});

/**
 * Start the 15-second testing schedule
 * POST /api/scanner/schedule/start
 */
router.post('/schedule/start', logRequest, async (req, res) => {
  try {
    const siteScannerQueue = (await import('../jobs/siteScanner.js')).default;
    
    if (!siteScannerQueue.boss) {
      await siteScannerQueue.initialize();
    }

    siteScannerQueue.startTestingSchedule();
    
    // Production logging: '▶️ [SCANNER] 15-second testing schedule started by user');
    
    res.json({
      success: true,
      message: 'Testing schedule started successfully'
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error starting schedule:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start testing schedule'
    });
  }
});

/**
 * Get testing schedule status
 * GET /api/scanner/schedule/status
 */
router.get('/schedule/status', logRequest, async (req, res) => {
  try {
    const siteScannerQueue = (await import('../jobs/siteScanner.js')).default;
    
    if (!siteScannerQueue.boss) {
      await siteScannerQueue.initialize();
    }

    const isRunning = siteScannerQueue.isTestingScheduleRunning();
    
    res.json({
      success: true,
      running: isRunning,
      interval: '15 seconds'
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error checking schedule status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check schedule status'
    });
  }
});

/**
 * Trigger manual accessibility scan
 * POST /api/scanner/trigger-manual-scan
 */
router.post('/trigger-manual-scan', logRequest, async (req, res) => {
  try {
    const { connectionId } = req.body;
    const userId = req.user.id;

    // Production logging: `🔍 [SCANNER] Manual WCAG scan trigger requested for connection ${connectionId} by user ${userId};

    // Verify the connection belongs to the authenticated user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: parseInt(connectionId),
        userId: userId
      }
    });

    if (!connection) {
      // Production logging: `❌ [SCANNER] Connection ${connectionId} not found or not accessible by user ${userId};
      return res.status(404).json({
        success: false,
        error: 'Site connection not found or not accessible'
      });
    }

    // Trigger immediate accessibility scan using the scanner directly
    // Production logging: `🚀 [SCANNER] Triggering immediate WCAG scan for: ${connection.siteUrl};
    
    // Perform the scan directly instead of queuing
    const { accessibilityScanner } = await import('../services/accessibilityScanner.js');
    
    const scanResult = await accessibilityScanner.scanUrl(connection.siteUrl, connection.id);
    
    // Production logging: `✅ [SCANNER] Manual WCAG scan completed for ${connection.siteName} - Score: ${scanResult.score}%;

    res.json({
      success: true,
      message: 'Manual accessibility scan completed successfully',
      scanResult: {
        id: scanResult.id,
        score: scanResult.score,
        errorCount: scanResult.errorCount,
        warningCount: scanResult.warningCount,
        noticeCount: scanResult.noticeCount,
        scanStatus: scanResult.scanStatus,
        scanDuration: scanResult.scanDuration
      },
      connectionId: connection.id,
      siteName: connection.siteName,
      siteUrl: connection.siteUrl
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error triggering manual scan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger manual accessibility scan'
    });
  }
});

/**
 * Get scanner statistics
 * GET /api/scanner/stats
 */
router.get('/stats', logRequest, async (req, res) => {
  try {
    const userId = req.user.id;

    // Production logging: `📊 [SCANNER] Fetching scanner statistics for user ${userId};

    // Get current month start
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Get statistics
    const [scansThisMonth, totalScans, pagesScanned, teamMembers] = await Promise.all([
      // Scans this month
      prisma.scanResult.count({
        where: {
          siteConnection: {
            userId: userId
          },
          createdAt: {
            gte: currentMonth
          }
        }
      }),
      // Total scans
      prisma.scanResult.count({
        where: {
          siteConnection: {
            userId: userId
          }
        }
      }),
      // Pages scanned (total scan results)
      prisma.scanResult.count({
        where: {
          siteConnection: {
            userId: userId
          }
        }
      }),
      // Team members (for now, just return 1 for the user)
      Promise.resolve(1)
    ]);

    const stats = {
      scansThisMonth,
      totalScans,
      pagesScanned,
      teamMembers
    };

    // Production logging: `✅ [SCANNER] Statistics for user ${userId}:`, stats);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error fetching scanner statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scanner statistics'
    });
  }
});

/**
 * Get recent scan results with pagination
 * GET /api/scanner/recent-scans
 */
router.get('/recent-scans', logRequest, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filter = req.query.filter || 'all';
    const sort = req.query.sort || 'timestamp';
    
    const skip = (page - 1) * limit;
    
    // Build where clause based on filter
    let whereClause = {
      siteConnection: {
        userId: userId
      }
    };
    
    if (filter === 'failed') {
      whereClause.scanStatus = 'failed';
    } else if (filter === 'issues') {
      whereClause.OR = [
        { errorCount: { gt: 0 } },
        { warningCount: { gt: 0 } }
      ];
    } else if (filter === 'passed') {
      whereClause.AND = [
        { errorCount: 0 },
        { warningCount: 0 },
        { scanStatus: 'completed' }
      ];
    }
    
    // Build orderBy clause based on sort
    let orderBy = { createdAt: 'desc' };
    if (sort === 'score') {
      orderBy = { score: 'desc' };
    } else if (sort === 'issues') {
      orderBy = [{ errorCount: 'desc' }, { warningCount: 'desc' }];
    }

    // Get total count for pagination
    const totalCount = await prisma.scanResult.count({
      where: whereClause
    });
    
    const totalPages = Math.ceil(totalCount / limit);

    const recentScans = await prisma.scanResult.findMany({
      where: whereClause,
      include: {
        siteConnection: {
          select: {
            siteName: true,
            siteUrl: true,
            platform: true
          }
        }
      },
      orderBy: orderBy,
      skip: skip,
      take: limit
    });

    const formattedScans = recentScans.map(scan => ({
      id: scan.id,
      url: scan.scanUrl,
      siteName: scan.siteConnection.siteName,
      score: scan.score,
      errorCount: scan.errorCount,
      warningCount: scan.warningCount,
      noticeCount: scan.noticeCount,
      scanStatus: scan.scanStatus,
      scanDuration: scan.scanDuration,
      createdAt: scan.createdAt,
      platform: scan.siteConnection.platform,
      issues: scan.errorCount + scan.warningCount,
      scanReason: scan.scanReason
    }));

    res.json({
      success: true,
      data: formattedScans,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        total: totalCount,
        limit: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error fetching recent scans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent scans'
    });
  }
});

/**
 * Get detailed scan result
 * GET /api/scanner/scan-details/:scanId
 */
router.get('/scan-details/:scanId', logRequest, async (req, res) => {
  try {
    const userId = req.user.id;
    const scanId = parseInt(req.params.scanId);

    const scanResult = await prisma.scanResult.findFirst({
      where: {
        id: scanId,
        siteConnection: {
          userId: userId
        }
      },
      include: {
        siteConnection: {
          select: {
            siteName: true,
            siteUrl: true,
            platform: true
          }
        }
      }
    });

    if (!scanResult) {
      return res.status(404).json({
        success: false,
        error: 'Scan result not found or not accessible'
      });
    }

    res.json({
      success: true,
      data: scanResult
    });

  } catch (error) {
    // console.error('❌ [SCANNER] Error fetching scan details:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scan details'
    });
  }
});

export default router;