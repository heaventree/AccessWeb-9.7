import PgBoss from 'pg-boss';
import { PrismaClient } from '@prisma/client';
import { accessibilityScanner } from '../services/accessibilityScanner.js';

const prisma = new PrismaClient();

// Environment configuration
const MAX_CONCURRENT_JOBS = parseInt(process.env.MAX_CONCURRENT_SCAN_JOBS) || 3;
const SYNC_INTERVAL_MS = parseInt(process.env.SCHEDULE_SYNC_INTERVAL_MS) || 5 * 60 * 1000; // 5 minutes
const JOB_QUEUE_NAME = 'site-accessibility-scan';

class SiteScannerJobQueue {
  constructor() {
    this.boss = null;
    this.syncInterval = null;
    this.activeJobs = new Map(); // Track active recurring jobs
  }

  async initialize() {
    try {
      // Initialize pg-boss with database connection
      this.boss = new PgBoss({
        connectionString: process.env.DATABASE_URL,
        retryLimit: 3,
        retryDelay: 5000,
        expireInHours: 1,
        deleteAfterHours: 24,
        archiveCompletedAfterSeconds: 3600,
      });

      await this.boss.start();
      
      // console.log(' [SITE-SCANNER] Job queue initialized successfully');
      
      // Start worker to process scan jobs
      await this.startWorker();
      
      // Initial sync of schedules
      await this.syncSchedules();
      
      // Set up periodic schedule synchronization
      this.syncInterval = setInterval(async () => {
        await this.syncSchedules();
      }, SYNC_INTERVAL_MS);

      // Set up 15-second testing interval for connections with testing frequency
      this.testingInterval = setInterval(async () => {
        await this.triggerTestingScans();
      }, 15000);

      // Logging disabled:  [SITE-SCANNER] Schedule sync interval set to ${SYNC_INTERVAL_MS / 1000} seconds;
      // console.log(' [SITE-SCANNER] Testing interval set to 15 seconds');
      
    } catch (error) {
      // console.error(' [SITE-SCANNER] Failed to initialize job queue:', error);
      throw error;
    }
  }

  async startWorker() {
    try {
      // Start worker with concurrency control
      await this.boss.work(
        JOB_QUEUE_NAME, 
        { teamSize: MAX_CONCURRENT_JOBS },
        this.processScanJob.bind(this)
      );
      
      // Logging disabled: 👷 [SITE-SCANNER] Worker started with max concurrency: ${MAX_CONCURRENT_JOBS};
      // Logging disabled: 👷 [SITE-SCANNER] Worker listening for jobs on queue: ${JOB_QUEUE_NAME};
      
      // Add debugging for job queue activity
      this.boss.on('error', error => {
        // console.error('🚨 [SITE-SCANNER] Pg-boss error:', error);
      });
      
      this.boss.on('monitor-states', (states) => {
        if (states && states.queues) {
          const scanQueue = states.queues.find(q => q.name === JOB_QUEUE_NAME);
          if (scanQueue && scanQueue.count > 0) {
            // Logging disabled:  [SITE-SCANNER] Queue stats - Active: ${scanQueue.active}, Completed: ${scanQueue.completed}, Failed: ${scanQueue.failed};
          }
        }
      });
      
    } catch (error) {
      // console.error(' [SITE-SCANNER] Failed to start worker:', error);
      throw error;
    }
  }

  async processScanJob(job) {
    const { connectionId, userId, siteName, siteUrl, platform } = job.data;
    
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
    // Scan job logging disabled for production
      ;

    } catch (error) {
      // console.error(`
      ;
      throw error;
    }
  }

  async performAccessibilityScan(connectionId, siteUrl, platform, scanReason = 'schedule') {
    try {
      // Logging disabled:  [SCAN-${connectionId}] Starting WCAG accessibility scan for: ${siteUrl} (Reason: ${scanReason});
      
      // Perform real accessibility scan using pa11y
      const scanResult = await accessibilityScanner.scanUrl(siteUrl, connectionId, scanReason);
      
      // Logging disabled: 
      ;
      
      return {
        scanResultId: scanResult.id,
        connectionId: connectionId,
        score: scanResult.score,
        errorCount: scanResult.errorCount,
        warningCount: scanResult.warningCount,
        noticeCount: scanResult.noticeCount,
        scanStatus: scanResult.scanStatus,
        scanDuration: scanResult.scanDuration
      };
      
    } catch (error) {
      // console.error(` [SCAN-${connectionId}] Accessibility scan failed:`, error.message);
      
      // Save failed scan result
      const errorResult = await accessibilityScanner.saveResults({
        siteConnectionId: connectionId,
        scanUrl: siteUrl,
        scanStatus: 'failed',
        errorCount: 0,
        warningCount: 0,
        noticeCount: 0,
        score: null,
        rawResults: {
          error: error.message,
          timestamp: new Date().toISOString()
        },
        scanDuration: 0,
        userAgent: 'AccessWeb-Scanner/1.0',
        scanReason: scanReason
      });
      
      return {
        scanResultId: errorResult.id,
        connectionId: connectionId,
        score: null,
        errorCount: 0,
        warningCount: 0,
        noticeCount: 0,
        scanStatus: 'failed',
        error: error.message
      };
    }
  }

  async syncSchedules() {
    try {
      // console.log(' [SITE-SCANNER] Syncing schedules with database...');
      
      // Fetch all active site connections with auto_scan enabled
      const activeConnections = await prisma.siteConnection.findMany({
        where: {
          isActive: true,
          autoScanEnabled: true,
          apiToken: { not: null }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true
            }
          }
        }
      });

      // Logging disabled:  [SITE-SCANNER] Found ${activeConnections.length} active connections with auto-scan enabled;

      // Convert scan frequency to cron expression
      const frequencyToCron = {
        'testing': '*/1 * * * *',     // Every minute for testing
        'daily': '0 9 * * *',         // Daily at 9 AM
        'weekly': '0 9 * * 1',        // Weekly on Monday at 9 AM  
        'monthly': '0 9 1 * *'        // Monthly on 1st at 9 AM
      };

      // Track current connections for cleanup
      const currentConnectionIds = new Set(activeConnections.map(conn => conn.id));

      // Create or update jobs for active connections
      for (const connection of activeConnections) {
        const cronExpression = frequencyToCron[connection.scanFrequency] || '0 9 * * 1'; // Default to weekly
        const jobKey = `scan-connection-${connection.id}`;
        
        // Special handling for testing frequency - use 15-second intervals only
        if (connection.scanFrequency === 'testing') {
          // Logging disabled:  [SITE-SCANNER] Testing frequency detected for ${connection.siteName} - using 15-second interval trigger;
          // Testing frequency uses interval-based scanning, not cron scheduling
          continue;
        }
        
        const jobData = {
          connectionId: connection.id,
          userId: connection.userId,
          siteName: connection.siteName,
          siteUrl: connection.siteUrl,
          platform: connection.platform,
          frequency: connection.scanFrequency
        };

        try {
          // Schedule recurring job for non-testing frequencies
          await this.boss.schedule(
            JOB_QUEUE_NAME,
            jobData,
            { cron: cronExpression },
            { singletonKey: jobKey }
          );

          this.activeJobs.set(connection.id, {
            jobKey,
            cronExpression,
            lastUpdated: new Date()
          });

          // Logging disabled:  [SITE-SCANNER] Scheduled job for ${connection.siteName} (${connection.scanFrequency}) - User: ${connection.user.email};
          
        } catch (error) {
          // console.error(` [SITE-SCANNER] Failed to schedule job for connection ${connection.id}:`, error);
        }
      }

      // Remove jobs for deleted/inactive connections
      const jobsToRemove = [];
      for (const [connectionId, jobInfo] of this.activeJobs.entries()) {
        if (!currentConnectionIds.has(connectionId)) {
          jobsToRemove.push({ connectionId, jobInfo });
        }
      }

      for (const { connectionId, jobInfo } of jobsToRemove) {
        try {
          await this.boss.cancel(jobInfo.jobKey);
          this.activeJobs.delete(connectionId);
          // Logging disabled: 🗑️  [SITE-SCANNER] Removed job for deleted connection: ${connectionId};
        } catch (error) {
          // console.error(` [SITE-SCANNER] Failed to remove job for connection ${connectionId}:`, error);
        }
      }

      // Logging disabled:  [SITE-SCANNER] Schedule sync completed - Active jobs: ${this.activeJobs.size};
      
    } catch (error) {
      // console.error(' [SITE-SCANNER] Failed to sync schedules:', error);
    }
  }

  async triggerTestingScans() {
    try {
      const activeConnections = await prisma.siteConnection.findMany({
        where: {
          autoScanEnabled: true,
          scanFrequency: 'testing',
          status: 'active'
        },
        include: {
          user: {
            select: {
              email: true
            }
          }
        }
      });

      for (const connection of activeConnections) {
        const jobData = {
          connectionId: connection.id,
          userId: connection.userId,
          siteName: connection.siteName,
          siteUrl: connection.siteUrl,
          platform: connection.platform,
          frequency: 'testing-auto'
        };

        try {
          // Direct scan execution instead of queuing for testing frequency
          // Logging disabled:  [SITE-SCANNER] Executing direct scan for ${connection.siteName};
          
          // Execute scan immediately instead of queuing
          await this.performAccessibilityScan(connection.id, connection.siteUrl, connection.platform);
          
          // Logging disabled:  [SITE-SCANNER] Direct scan completed for ${connection.siteName};
          
        } catch (error) {
          // console.error(` [SITE-SCANNER] Failed to execute direct scan for connection ${connection.id}:`, error);
        }
      }
    } catch (error) {
      // console.error(' [SITE-SCANNER] Testing scan trigger failed:', error);
    }
  }

  stopTestingSchedule() {
    if (this.testingIntervalId) {
      clearInterval(this.testingIntervalId);
      this.testingIntervalId = null;
      // console.log('🛑 [SITE-SCANNER] 15-second testing schedule stopped');
    }
  }

  startTestingSchedule() {
    if (!this.testingIntervalId) {
      this.testingIntervalId = setInterval(() => {
        this.triggerTestingScans();
      }, 15000); // 15 seconds in milliseconds
      // console.log('▶️ [SITE-SCANNER] 15-second testing schedule started');
    }
  }

  isTestingScheduleRunning() {
    return this.testingIntervalId !== null;
  }

  async getJobStats() {
    try {
      if (!this.boss) return null;
      
      const stats = await this.boss.getQueueSize(JOB_QUEUE_NAME);
      return {
        queueName: JOB_QUEUE_NAME,
        queueSize: stats,
        activeJobs: this.activeJobs.size,
        maxConcurrency: MAX_CONCURRENT_JOBS,
        syncInterval: SYNC_INTERVAL_MS / 1000
      };
    } catch (error) {
      // console.error(' [SITE-SCANNER] Failed to get job stats:', error);
      return null;
    }
  }

  async shutdown() {
    try {
      // console.log('🛑 [SITE-SCANNER] Shutting down job queue...');
      
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
      }
      
      if (this.testingInterval) {
        clearInterval(this.testingInterval);
      }
      
      if (this.boss) {
        await this.boss.stop();
      }
      
      await prisma.$disconnect();
      
      // console.log(' [SITE-SCANNER] Job queue shutdown completed');
    } catch (error) {
      // console.error(' [SITE-SCANNER] Error during shutdown:', error);
    }
  }

  // Manual scan trigger method
  async triggerManualScan(jobData) {
    try {
      if (!this.boss) {
        throw new Error('Job queue not initialized');
      }

      // Queue immediate manual scan job with high priority
      const jobId = await this.boss.send(JOB_QUEUE_NAME, jobData, {
        priority: 10, // High priority for manual scans
        retryLimit: 2,
        retryDelay: 5000,
        expireInMinutes: 5
      });

      // Logging disabled:  [SITE-SCANNER] Manual scan job ${jobId} queued for ${jobData.siteName};
      return jobId;

    } catch (error) {
      // console.error(' [SITE-SCANNER] Failed to trigger manual scan:', error);
      throw error;
    }
  }

  // Utility method for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Create singleton instance
const siteScannerQueue = new SiteScannerJobQueue();

// Graceful shutdown handling
process.on('SIGINT', async () => {
  // console.log('\n🛑 [SITE-SCANNER] Received SIGINT, shutting down gracefully...');
  await siteScannerQueue.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  // console.log('\n🛑 [SITE-SCANNER] Received SIGTERM, shutting down gracefully...');
  await siteScannerQueue.shutdown();
  process.exit(0);
});

export { SiteScannerJobQueue };
export default siteScannerQueue;