import PgBoss from 'pg-boss';
import { PrismaClient } from '@prisma/client';
import { accessibilityScanner } from '../services/accessibilityScanner.js';
import nodemailer from 'nodemailer';

// Inline notification service instead of dynamic loading

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
      // Notification service is now inline - no loading required
      console.log('📧 [NOTIFICATION] Notification service ready (inline)');

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

      // Set up 15-second testing interval for connections with testing frequency
      this.testingInterval = setInterval(async () => {
        await this.triggerTestingScans();
      }, 15000);

      console.log(`⏰ [SITE-SCANNER] Schedule sync interval set to ${SYNC_INTERVAL_MS / 1000} seconds`);
      console.log('⚡ [SITE-SCANNER] Testing interval set to 15 seconds');
      
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
      console.log(`👷 [SITE-SCANNER] Worker listening for jobs on queue: ${JOB_QUEUE_NAME}`);
      
      // Add debugging for job queue activity
      this.boss.on('error', error => {
        console.error('🚨 [SITE-SCANNER] Pg-boss error:', error);
      });
      
      this.boss.on('monitor-states', (states) => {
        if (states && states.queues) {
          const scanQueue = states.queues.find(q => q.name === JOB_QUEUE_NAME);
          if (scanQueue && scanQueue.count > 0) {
            console.log(`📊 [SITE-SCANNER] Queue stats - Active: ${scanQueue.active}, Completed: ${scanQueue.completed}, Failed: ${scanQueue.failed}`);
          }
        }
      });
      
    } catch (error) {
      console.error('❌ [SITE-SCANNER] Failed to start worker:', error);
      throw error;
    }
  }

  async processScanJob(job) {
    // Handle case where job is an array (which it appears to be)
    const actualJob = Array.isArray(job) ? job[0] : job;
    
    console.log('🐛 [DEBUG] Processed job object:', JSON.stringify(actualJob, null, 2));
    
    // Extract job data from the actual job object
    let jobData;
    if (actualJob.data && typeof actualJob.data === 'object') {
      jobData = actualJob.data;
      console.log('✅ [DEBUG] Successfully extracted job data');
    } else {
      console.error('❌ [SITE-SCANNER] Job data is missing or malformed. Job object:', JSON.stringify(actualJob, null, 2));
      throw new Error('Job data is missing or malformed');
    }
    
    const { connectionId, userId, siteName, siteUrl, platform, frequency } = jobData;
    
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    🔍 ACCESSIBILITY SCAN STARTED               ║
╠════════════════════════════════════════════════════════════════╣
║ Job ID:        ${actualJob.id.padEnd(45)} ║
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
      const scanResult = await this.performAccessibilityScan(connectionId, siteUrl, platform, frequency || 'schedule');
      
      console.log(`
╔════════════════════════════════════════════════════════════════╗
║                    ✅ ACCESSIBILITY SCAN COMPLETED             ║
╠════════════════════════════════════════════════════════════════╣
║ Job ID:        ${actualJob.id.padEnd(45)} ║
║ Site:          ${siteName.padEnd(45)} ║
║ Status:        ${'SUCCESS'.padEnd(45)} ║
║ Completed At:  ${new Date().toISOString().padEnd(45)} ║
╚════════════════════════════════════════════════════════════════╝
      `);

      // Send notification when scan is completed successfully
      console.log(`🔍 [DEBUG] Notification check: scanResult=${!!scanResult}, scanResultId=${scanResult?.scanResultId}, notificationService=true`);
      
      if (scanResult && scanResult.scanResultId) {
        try {
          console.log(`📧 [NOTIFICATION] Attempting to send scan completion notification for user ${userId}`);
          
          const siteConnection = await prisma.siteConnection.findUnique({
            where: { id: connectionId }
          });

          if (siteConnection) {
            console.log(`📧 [NOTIFICATION] Found site connection, sending notification for: ${siteConnection.siteName}`);
            
            const result = await this.sendScanCompletionNotification(
              userId, 
              scanResult, 
              siteConnection
            );
            
            if (result) {
              console.log(`✅ [NOTIFICATION] Scan completion notification sent successfully for site: ${siteName}`);
            } else {
              console.log(`❌ [NOTIFICATION] Scan completion notification failed for site: ${siteName}`);
            }
          } else {
            console.log(`❌ [NOTIFICATION] Site connection not found for ID: ${connectionId}`);
          }
        } catch (notificationError) {
          console.error(`❌ [NOTIFICATION] Failed to send scan completion notification:`, notificationError);
          // Don't fail the job if notification fails
        }
      } else {
        console.log(`⚠️ [NOTIFICATION] Skipping notification - missing requirements`);
      }

    } catch (error) {
      console.error(`
╔════════════════════════════════════════════════════════════════╗
║                    ❌ ACCESSIBILITY SCAN FAILED                ║
╠════════════════════════════════════════════════════════════════╣
║ Job ID:        ${actualJob.id.padEnd(45)} ║
║ Site:          ${siteName.padEnd(45)} ║
║ Error:         ${error.message.padEnd(45)} ║
║ Failed At:     ${new Date().toISOString().padEnd(45)} ║
╚════════════════════════════════════════════════════════════════╝
      `);
      throw error;
    }
  }

  async performAccessibilityScan(connectionId, siteUrl, platform, scanReason = 'schedule') {
    try {
      console.log(`🔍 [SCAN-${connectionId}] Starting WCAG accessibility scan for: ${siteUrl} (Reason: ${scanReason})`);
      
      // Perform real accessibility scan using pa11y
      const scanResult = await accessibilityScanner.scanUrl(siteUrl, connectionId, scanReason);
      
      console.log(`
╔═══════════════════ SCAN RESULTS ═══════════════════╗
║ Connection ID: ${String(connectionId).padEnd(32)} ║
║ Accessibility Score: ${String(scanResult.score || 'N/A').padEnd(26)} ║
║ Total Errors: ${String(scanResult.errorCount).padEnd(30)} ║
║ Total Warnings: ${String(scanResult.warningCount).padEnd(28)} ║
║ Total Notices: ${String(scanResult.noticeCount).padEnd(29)} ║
║ Scan Duration: ${String(scanResult.scanDuration + 'ms').padEnd(29)} ║
║ Scan Status: ${String(scanResult.scanStatus).padEnd(31)} ║
╚════════════════════════════════════════════════════╝
      `);
      
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
      console.error(`❌ [SCAN-${connectionId}] Accessibility scan failed:`, error.message);
      
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
          console.log(`⚡ [SITE-SCANNER] Testing frequency detected for ${connection.siteName} - using 15-second interval trigger`);
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
          console.log(`🔍 [SITE-SCANNER] Executing direct scan for ${connection.siteName}`);
          
          // Execute scan immediately instead of queuing
          const scanResult = await this.performAccessibilityScan(connection.id, connection.siteUrl, connection.platform);
          
          console.log(`✅ [SITE-SCANNER] Direct scan completed for ${connection.siteName}`);

          // Send notification for testing scans as well
          if (scanResult && scanResult.scanResultId) {
            try {
              await this.sendScanCompletionNotification(
                connection.userId, 
                scanResult, 
                connection
              );
              console.log(`📧 [NOTIFICATION] Testing scan notification sent for site: ${connection.siteName}`);
            } catch (notificationError) {
              console.error(`❌ [NOTIFICATION] Failed to send testing scan notification:`, notificationError);
            }
          }
          
        } catch (error) {
          console.error(`❌ [SITE-SCANNER] Failed to execute direct scan for connection ${connection.id}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ [SITE-SCANNER] Testing scan trigger failed:', error);
    }
  }

  stopTestingSchedule() {
    if (this.testingIntervalId) {
      clearInterval(this.testingIntervalId);
      this.testingIntervalId = null;
      console.log('🛑 [SITE-SCANNER] 15-second testing schedule stopped');
    }
  }

  startTestingSchedule() {
    if (!this.testingIntervalId) {
      this.testingIntervalId = setInterval(() => {
        this.triggerTestingScans();
      }, 15000); // 15 seconds in milliseconds
      console.log('▶️ [SITE-SCANNER] 15-second testing schedule started');
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
      
      if (this.testingInterval) {
        clearInterval(this.testingInterval);
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

  /**
   * Send scan completion notification email (inline implementation)
   */
  async sendScanCompletionNotification(userId, scanResult, siteConnection) {
    try {
      console.log(`📧 [NOTIFICATION] Attempting to send scan completion notification for user ${userId}`);

      // Check user notification preferences
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          notificationPreferences: true
        }
      });

      if (!user) {
        console.log(`⚠️ [NOTIFICATION] User ${userId} not found, skipping notification`);
        return false;
      }

      if (!user.email) {
        console.log(`⚠️ [NOTIFICATION] User ${userId} has no email address, skipping notification`);
        return false;
      }

      // Check notification preferences - default to enabled if not set
      const preferences = user.notificationPreferences;
      const emailNotificationsEnabled = preferences?.emailNotifications !== false;
      const scanCompletionEnabled = preferences?.scanCompletion !== false;

      console.log(`📧 [NOTIFICATION] User preferences - email: ${emailNotificationsEnabled}, scanCompletion: ${scanCompletionEnabled}`);

      if (!emailNotificationsEnabled || !scanCompletionEnabled) {
        console.log(`🔕 [NOTIFICATION] User ${userId} has disabled notifications, skipping`);
        return false;
      }

      // Send email notification
      const emailSent = await this.sendScanCompletionEmail(
        user.email,
        user.firstName || 'User',
        scanResult,
        siteConnection
      );

      if (emailSent) {
        console.log(`✅ [NOTIFICATION] Scan completion notification sent successfully to ${user.email}`);
        return true;
      } else {
        console.log(`❌ [NOTIFICATION] Failed to send scan completion notification to ${user.email}`);
        return false;
      }

    } catch (error) {
      console.error('❌ [NOTIFICATION] Error in sendScanCompletionNotification:', error);
      return false;
    }
  }

  /**
   * Send scan completion email using Gmail
   */
  async sendScanCompletionEmail(email, userName, scanResult, siteConnection) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error('❌ [NOTIFICATION] Gmail credentials not configured');
      return false;
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      const { errorCount, warningCount, noticeCount, score, scanStatus } = scanResult;
      
      let statusMessage = '';
      if (scanStatus === 'failed') {
        statusMessage = `The accessibility scan for ${siteConnection.siteName} failed to complete. Please check your site configuration and try again.`;
      } else if (errorCount === 0) {
        statusMessage = `🎉 Great news! Your site ${siteConnection.siteName} passed all accessibility tests with a perfect score of ${score}%.`;
      } else if (errorCount <= 5) {
        statusMessage = `Your site ${siteConnection.siteName} scored ${score}% with ${errorCount} accessibility issues found. These are minor issues that can be easily fixed.`;
      } else {
        statusMessage = `Your site ${siteConnection.siteName} scored ${score}% with ${errorCount} accessibility issues found. We recommend addressing these to improve user experience.`;
      }

      const actionUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/dashboard/reports/${scanResult.scanResultId}`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Accessibility Scan Complete</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🔍 Accessibility Scan Complete</h1>
          </div>
          
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0 0 15px 0;">Hello ${userName},</p>
            <p style="font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">${statusMessage}</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="margin: 0 0 10px 0; color: #333;">📊 Scan Results Summary</h3>
              <p><strong>Site:</strong> ${siteConnection.siteName}</p>
              <p><strong>Score:</strong> ${score}%</p>
              <p><strong>Errors:</strong> ${errorCount}</p>
              <p><strong>Warnings:</strong> ${warningCount}</p>
              <p><strong>Notices:</strong> ${noticeCount}</p>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${actionUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                View Detailed Report →
              </a>
            </div>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
            <p>This scan was automatically generated by your Access Checker dashboard.</p>
            <p>To manage your notification preferences, visit your account settings.</p>
          </div>
        </body>
        </html>
      `;

      const textContent = `
Accessibility Scan Complete

Hello ${userName},

${statusMessage}

Scan Results Summary:
- Site: ${siteConnection.siteName}
- Score: ${score}%
- Errors: ${errorCount}
- Warnings: ${warningCount}
- Notices: ${noticeCount}

View your detailed report: ${actionUrl}

This scan was automatically generated by your Access Checker dashboard.
To manage your notification preferences, visit your account settings.
      `;

      const mailOptions = {
        from: `"Access Checker" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: `🔍 Accessibility scan completed for ${siteConnection.siteName}`,
        html: htmlContent,
        text: textContent
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✅ [NOTIFICATION] Email sent successfully via Gmail: ${info.messageId}`);
      return true;

    } catch (error) {
      console.error('❌ [NOTIFICATION] Failed to send email via Gmail:', error);
      return false;
    }
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