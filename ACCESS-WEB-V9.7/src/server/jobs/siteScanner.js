import PgBoss from 'pg-boss';
import { PrismaClient } from '@prisma/client';

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
      
      console.log('🚀 [SITE-SCANNER] Job queue initialized successfully');
      
      // Start worker to process scan jobs
      await this.startWorker();
      
      // Initial sync of schedules
      await this.syncSchedules();
      
      // Set up periodic schedule synchronization
      this.syncInterval = setInterval(async () => {
        await this.syncSchedules();
      }, SYNC_INTERVAL_MS);

      console.log(`⏰ [SITE-SCANNER] Schedule sync interval set to ${SYNC_INTERVAL_MS / 1000} seconds`);
      
    } catch (error) {
      console.error('❌ [SITE-SCANNER] Failed to initialize job queue:', error);
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
      
      console.log(`👷 [SITE-SCANNER] Worker started with max concurrency: ${MAX_CONCURRENT_JOBS}`);
    } catch (error) {
      console.error('❌ [SITE-SCANNER] Failed to start worker:', error);
      throw error;
    }
  }

  async processScanJob(job) {
    const { connectionId, userId, siteName, siteUrl, platform } = job.data;
    
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    🔍 ACCESSIBILITY SCAN STARTED               ║
╠════════════════════════════════════════════════════════════════╣
║ Job ID:        ${job.id.padEnd(45)} ║
║ Connection ID: ${String(connectionId).padEnd(45)} ║
║ User ID:       ${String(userId).padEnd(45)} ║
║ Site Name:     ${siteName.padEnd(45)} ║
║ Site URL:      ${siteUrl.padEnd(45)} ║
║ Platform:      ${platform.padEnd(45)} ║
║ Started At:    ${new Date().toISOString().padEnd(45)} ║
╚════════════════════════════════════════════════════════════════╝
    `);

    try {
      // Update last_scan_at timestamp
      await prisma.siteConnection.update({
        where: { id: connectionId },
        data: { lastScanAt: new Date() }
      });

      // Perform accessibility scanning process
      await this.performAccessibilityScan(connectionId, siteUrl, platform);
      
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    ✅ ACCESSIBILITY SCAN COMPLETED             ║
╠════════════════════════════════════════════════════════════════╣
║ Job ID:        ${job.id.padEnd(45)} ║
║ Site:          ${siteName.padEnd(45)} ║
║ Status:        ${'SUCCESS'.padEnd(45)} ║
║ Completed At:  ${new Date().toISOString().padEnd(45)} ║
╚════════════════════════════════════════════════════════════════╝
      `);

    } catch (error) {
      console.error(`
╔════════════════════════════════════════════════════════════════╗
║                    ❌ ACCESSIBILITY SCAN FAILED                ║
╠════════════════════════════════════════════════════════════════╣
║ Job ID:        ${job.id.padEnd(45)} ║
║ Site:          ${siteName.padEnd(45)} ║
║ Error:         ${error.message.padEnd(45)} ║
║ Failed At:     ${new Date().toISOString().padEnd(45)} ║
╚════════════════════════════════════════════════════════════════╝
      `);
      throw error;
    }
  }

  async performAccessibilityScan(connectionId, siteUrl, platform) {
    // Simulate accessibility scanning process with fancy output
    console.log(`🔍 [SCAN-${connectionId}] Fetching page content from: ${siteUrl}`);
    await this.delay(2000); // Simulate network request
    
    console.log(`📊 [SCAN-${connectionId}] Analyzing WCAG compliance for ${platform} platform`);
    await this.delay(3000); // Simulate analysis
    
    console.log(`📝 [SCAN-${connectionId}] Generating accessibility report`);
    await this.delay(1000); // Simulate report generation
    
    console.log(`💾 [SCAN-${connectionId}] Saving scan results to database`);
    await this.delay(500); // Simulate database save
    
    // Display fancy scan results
    const mockResults = {
      totalIssues: Math.floor(Math.random() * 20),
      criticalIssues: Math.floor(Math.random() * 5),
      warningIssues: Math.floor(Math.random() * 10),
      score: Math.floor(Math.random() * 40) + 60 // 60-100 score
    };
    
    console.log(`
╔═══════════════════ SCAN RESULTS ═══════════════════╗
║ Connection ID: ${String(connectionId).padEnd(32)} ║
║ Accessibility Score: ${String(mockResults.score).padEnd(26)} ║
║ Total Issues: ${String(mockResults.totalIssues).padEnd(32)} ║
║ Critical Issues: ${String(mockResults.criticalIssues).padEnd(29)} ║
║ Warning Issues: ${String(mockResults.warningIssues).padEnd(30)} ║
╚════════════════════════════════════════════════════╝
    `);
    
    return mockResults;
  }

  async syncSchedules() {
    try {
      console.log('🔄 [SITE-SCANNER] Syncing schedules with database...');
      
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

      console.log(`📋 [SITE-SCANNER] Found ${activeConnections.length} active connections with auto-scan enabled`);

      // Convert scan frequency to cron expression
      const frequencyToCron = {
        'testing': '*/15 * * * *',    // Every 15 seconds (for testing) - using 5-field format
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
        
        const jobData = {
          connectionId: connection.id,
          userId: connection.userId,
          siteName: connection.siteName,
          siteUrl: connection.siteUrl,
          platform: connection.platform,
          frequency: connection.scanFrequency
        };

        try {
          // Schedule recurring job
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

          console.log(`✅ [SITE-SCANNER] Scheduled job for ${connection.siteName} (${connection.scanFrequency}) - User: ${connection.user.email}`);
          
        } catch (error) {
          console.error(`❌ [SITE-SCANNER] Failed to schedule job for connection ${connection.id}:`, error);
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
          console.log(`🗑️  [SITE-SCANNER] Removed job for deleted connection: ${connectionId}`);
        } catch (error) {
          console.error(`❌ [SITE-SCANNER] Failed to remove job for connection ${connectionId}:`, error);
        }
      }

      console.log(`✅ [SITE-SCANNER] Schedule sync completed - Active jobs: ${this.activeJobs.size}`);
      
    } catch (error) {
      console.error('❌ [SITE-SCANNER] Failed to sync schedules:', error);
    }
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
      console.error('❌ [SITE-SCANNER] Failed to get job stats:', error);
      return null;
    }
  }

  async shutdown() {
    try {
      console.log('🛑 [SITE-SCANNER] Shutting down job queue...');
      
      if (this.syncInterval) {
        clearInterval(this.syncInterval);
      }
      
      if (this.boss) {
        await this.boss.stop();
      }
      
      await prisma.$disconnect();
      
      console.log('✅ [SITE-SCANNER] Job queue shutdown completed');
    } catch (error) {
      console.error('❌ [SITE-SCANNER] Error during shutdown:', error);
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

      console.log(`🚀 [SITE-SCANNER] Manual scan job ${jobId} queued for ${jobData.siteName}`);
      return jobId;

    } catch (error) {
      console.error('❌ [SITE-SCANNER] Failed to trigger manual scan:', error);
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
  console.log('\n🛑 [SITE-SCANNER] Received SIGINT, shutting down gracefully...');
  await siteScannerQueue.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 [SITE-SCANNER] Received SIGTERM, shutting down gracefully...');
  await siteScannerQueue.shutdown();
  process.exit(0);
});

export { SiteScannerJobQueue };
export default siteScannerQueue;