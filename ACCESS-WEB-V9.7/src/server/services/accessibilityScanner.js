import pa11y from 'pa11y';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AccessibilityScanner {
  constructor() {
    this.pa11yConfig = {
      standard: 'WCAG2AA',
      timeout: 30000,
      wait: 2000,
      chromeLaunchConfig: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor'
        ]
      },
      includeNotices: true,
      includeWarnings: true,
      level: 'error'
    };
  }

  async scanUrl(url, siteConnectionId) {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 [ACCESSIBILITY] Starting WCAG scan for: ${url}`);
      
      // Run pa11y accessibility scan
      const results = await pa11y(url, this.pa11yConfig);
      
      const scanDuration = Date.now() - startTime;
      
      // Process and categorize results
      const processedResults = this.processResults(results);
      
      console.log(`✅ [ACCESSIBILITY] Scan completed in ${scanDuration}ms - Errors: ${processedResults.errorCount}, Warnings: ${processedResults.warningCount}, Notices: ${processedResults.noticeCount}`);
      
      // Save results to database
      const savedResult = await this.saveResults({
        siteConnectionId,
        scanUrl: url,
        scanStatus: 'completed',
        errorCount: processedResults.errorCount,
        warningCount: processedResults.warningCount,
        noticeCount: processedResults.noticeCount,
        score: processedResults.score,
        rawResults: processedResults.rawData,
        scanDuration,
        userAgent: 'AccessWeb-Scanner/1.0'
      });
      
      // Update site connection last scan time
      await this.updateSiteConnectionScanTime(siteConnectionId);
      
      return savedResult;
      
    } catch (error) {
      const scanDuration = Date.now() - startTime;
      
      console.error(`❌ [ACCESSIBILITY] Scan failed for ${url}:`, error.message);
      
      // Save error result to database
      const errorResult = await this.saveResults({
        siteConnectionId,
        scanUrl: url,
        scanStatus: 'failed',
        errorCount: 0,
        warningCount: 0,
        noticeCount: 0,
        score: null,
        rawResults: {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        },
        scanDuration,
        userAgent: 'AccessWeb-Scanner/1.0'
      });
      
      throw error;
    }
  }

  processResults(results) {
    if (!Array.isArray(results)) {
      return {
        errorCount: 0,
        warningCount: 0,
        noticeCount: 0,
        score: 100,
        rawData: { issues: [], documentTitle: '', pageUrl: '' }
      };
    }

    const errors = results.filter(issue => issue.type === 'error');
    const warnings = results.filter(issue => issue.type === 'warning');
    const notices = results.filter(issue => issue.type === 'notice');

    // Calculate accessibility score (0-100)
    const totalIssues = errors.length + warnings.length;
    const maxIssues = 100; // Baseline for scoring
    const score = Math.max(0, Math.min(100, 100 - (totalIssues / maxIssues) * 100));

    return {
      errorCount: errors.length,
      warningCount: warnings.length,
      noticeCount: notices.length,
      score: parseFloat(score.toFixed(2)),
      rawData: {
        issues: results,
        summary: {
          total: results.length,
          errors: errors.length,
          warnings: warnings.length,
          notices: notices.length
        },
        scanConfig: this.pa11yConfig,
        timestamp: new Date().toISOString()
      }
    };
  }

  async saveResults(resultData) {
    try {
      const savedResult = await prisma.scanResult.create({
        data: resultData
      });
      
      console.log(`💾 [ACCESSIBILITY] Scan results saved with ID: ${savedResult.id}`);
      return savedResult;
      
    } catch (error) {
      console.error('❌ [ACCESSIBILITY] Failed to save scan results:', error);
      throw error;
    }
  }

  async updateSiteConnectionScanTime(siteConnectionId) {
    try {
      await prisma.siteConnection.update({
        where: { id: siteConnectionId },
        data: { lastScanAt: new Date() }
      });
      
      console.log(`⏰ [ACCESSIBILITY] Updated last scan time for connection ${siteConnectionId}`);
      
    } catch (error) {
      console.error('❌ [ACCESSIBILITY] Failed to update scan time:', error);
    }
  }

  async getRecentResults(siteConnectionId, limit = 10) {
    try {
      const results = await prisma.scanResult.findMany({
        where: { siteConnectionId },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
      
      return results;
      
    } catch (error) {
      console.error('❌ [ACCESSIBILITY] Failed to fetch scan results:', error);
      throw error;
    }
  }

  async getScanHistory(siteConnectionId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    try {
      const results = await prisma.scanResult.findMany({
        where: {
          siteConnectionId,
          createdAt: {
            gte: startDate
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return results;
      
    } catch (error) {
      console.error('❌ [ACCESSIBILITY] Failed to fetch scan history:', error);
      throw error;
    }
  }
}

export const accessibilityScanner = new AccessibilityScanner();