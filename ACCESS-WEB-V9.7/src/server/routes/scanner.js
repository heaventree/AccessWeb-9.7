import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { logRequest } from '../utils/logger.js';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication middleware to all scanner routes
router.use(authenticateToken);

/**
 * Trigger manual accessibility scan for a specific site connection
 * POST /api/scanner/trigger/:connectionId
 */
router.post('/trigger/:connectionId', logRequest, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user.userId;

    console.log(`🔍 [SCANNER] Manual scan trigger requested for connection ${connectionId} by user ${userId}`);

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
      console.log(`❌ [SCANNER] Connection ${connectionId} not found or not accessible by user ${userId}`);
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

    console.log(`✅ [SCANNER] Manual scan job ${jobId} queued for ${connection.siteName}`);

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
    console.error('❌ [SCANNER] Error triggering manual scan:', error);
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
    const userId = req.user.userId;
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
    console.error('❌ [SCANNER] Error fetching scan history:', error);
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
    const userId = req.user.userId;

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
    console.error('❌ [SCANNER] Error fetching scan status:', error);
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
    
    console.log('🛑 [SCANNER] 15-second testing schedule stopped by user');
    
    res.json({
      success: true,
      message: 'Testing schedule stopped successfully'
    });

  } catch (error) {
    console.error('❌ [SCANNER] Error stopping schedule:', error);
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
    
    console.log('▶️ [SCANNER] 15-second testing schedule started by user');
    
    res.json({
      success: true,
      message: 'Testing schedule started successfully'
    });

  } catch (error) {
    console.error('❌ [SCANNER] Error starting schedule:', error);
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
    console.error('❌ [SCANNER] Error checking schedule status:', error);
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
    const userId = req.user.userId;

    console.log(`🔍 [SCANNER] Manual WCAG scan trigger requested for connection ${connectionId} by user ${userId}`);

    // Verify the connection belongs to the authenticated user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: parseInt(connectionId),
        userId: userId,
        isActive: true
      }
    });

    if (!connection) {
      console.log(`❌ [SCANNER] Connection ${connectionId} not found or not accessible by user ${userId}`);
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

    // Trigger immediate accessibility scan job
    const jobData = {
      connectionId: connection.id,
      userId: userId,
      siteName: connection.siteName,
      siteUrl: connection.siteUrl,
      platform: connection.platform,
      triggerType: 'manual'
    };

    const job = await siteScannerQueue.boss.send('site-accessibility-scan', jobData, {
      retryLimit: 2,
      retryDelay: 30,
      expireInSeconds: 300
    });

    console.log(`✅ [SCANNER] Manual WCAG scan job queued with ID: ${job.id} for ${connection.siteName}`);

    res.json({
      success: true,
      message: 'Manual accessibility scan triggered successfully',
      jobId: job.id,
      connectionId: connection.id,
      siteName: connection.siteName,
      siteUrl: connection.siteUrl
    });

  } catch (error) {
    console.error('❌ [SCANNER] Error triggering manual scan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to trigger manual accessibility scan'
    });
  }
});

export default router;