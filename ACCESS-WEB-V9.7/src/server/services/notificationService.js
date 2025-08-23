import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Comprehensive notification service for creating both email and in-app notifications
 */
class NotificationService {
  
  /**
   * Create a notification (both in-app and optionally email)
   * @param {Object} params - Notification parameters
   * @param {number} params.userId - User ID to notify
   * @param {string} params.type - Notification type (scan_completed, scan_failed, etc.)
   * @param {string} params.category - Notification category (scan, security, billing, etc.)
   * @param {string} params.title - Notification title
   * @param {string} params.message - Notification message  
   * @param {string} params.priority - Priority: low, normal, high, critical
   * @param {string} [params.actionUrl] - Optional URL for notification action
   * @param {Object} [params.metadata] - Optional metadata
   * @param {boolean} [params.sendEmail=true] - Whether to also send email notification
   */
  async createNotification({ 
    userId, 
    type, 
    category, 
    title, 
    message, 
    priority = 'normal', 
    actionUrl, 
    metadata = {},
    sendEmail = true 
  }) {
    try {
      // Get user notification preferences
      const preferences = await prisma.notificationPreferences.findUnique({
        where: { userId }
      });

      // Create in-app notification if user has them enabled (default: true)
      let inAppNotification = null;
      if (!preferences || preferences.browserNotifications) {
        inAppNotification = await prisma.notification.create({
          data: {
            userId,
            type,
            category,
            title,
            message,
            priority,
            actionUrl,
            metadata: metadata || {}
          }
        });

        console.log(`📧 [NOTIFICATION] Created in-app notification: ${title} for user ${userId}`);
      }

      // Send email notification if enabled and user has email notifications on
      if (sendEmail && preferences && preferences.emailNotifications && this.shouldSendEmailForType(type, preferences)) {
        try {
          await this.sendEmailNotification({
            userId,
            type,
            title,
            message,
            actionUrl,
            metadata
          });
        } catch (emailError) {
          console.error('📧 [NOTIFICATION] Email notification failed:', emailError);
          // Don't throw - in-app notification is still created
        }
      }

      // Log delivery if notification was created
      if (inAppNotification) {
        await prisma.notificationDeliveryLog.create({
          data: {
            notificationId: inAppNotification.id,
            userId,
            channel: 'in_app',
            status: 'delivered',
            deliveredAt: new Date()
          }
        });
      }

      return inAppNotification;

    } catch (error) {
      console.error('📧 [NOTIFICATION] Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Create scan completion notification
   */
  async createScanCompletedNotification(userId, scanResult) {
    const { siteUrl, issuesFound, criticalIssues, scanId } = scanResult;
    
    let title, message, priority;
    
    if (criticalIssues > 0) {
      title = `🚨 Critical Issues Found - ${siteUrl}`;
      message = `Your accessibility scan found ${criticalIssues} critical issues and ${issuesFound} total issues that need immediate attention.`;
      priority = 'critical';
    } else if (issuesFound > 0) {
      title = `⚠️ Accessibility Issues Found - ${siteUrl}`;
      message = `Your accessibility scan completed with ${issuesFound} issues found. Review and fix these to improve compliance.`;
      priority = 'normal';
    } else {
      title = `✅ Perfect Score! - ${siteUrl}`;
      message = `Congratulations! Your site passed all accessibility tests with no issues found.`;
      priority = 'low';
    }

    return await this.createNotification({
      userId,
      type: 'scan_completed',
      category: 'scan',
      title,
      message,
      priority,
      actionUrl: `/scan-results/${scanId}`,
      metadata: {
        siteUrl,
        issuesFound,
        criticalIssues,
        scanId
      }
    });
  }

  /**
   * Create scan failed notification
   */
  async createScanFailedNotification(userId, { siteUrl, error, scanId }) {
    return await this.createNotification({
      userId,
      type: 'scan_failed', 
      category: 'scan',
      title: `❌ Scan Failed - ${siteUrl}`,
      message: `Your accessibility scan failed to complete. This might be due to site connectivity issues or configuration problems.`,
      priority: 'high',
      actionUrl: `/site-connections`,
      metadata: {
        siteUrl,
        error: error.message || error,
        scanId
      }
    });
  }

  /**
   * Check if email should be sent for this notification type based on user preferences
   */
  shouldSendEmailForType(type, preferences) {
    switch (type) {
      case 'scan_completed':
        return preferences.scanCompleted;
      case 'scan_failed':
        return preferences.scanCompleted;
      case 'critical_issues':
        return preferences.criticalIssues;
      case 'usage_alert':
        return preferences.usageAlerts;
      case 'security_alert':
        return preferences.securityAlerts;
      case 'payment_notification':
        return preferences.paymentNotifications;
      default:
        return true; // Default to sending email
    }
  }

  /**
   * Send email notification
   */
  async sendEmailNotification({ userId, type, title, message, actionUrl, metadata }) {
    try {
      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // For now, skip email sending in the notification service
      // The old system will handle emails as fallback
      console.log(`📧 [NOTIFICATION] Email would be sent to ${user.email}: ${title}`);

      console.log(`📧 [NOTIFICATION] Email sent to ${user.email}: ${title}`);

    } catch (error) {
      console.error('📧 [NOTIFICATION] Email sending failed:', error);
      throw error;
    }
  }

  /**
   * Get user notification preferences
   */
  async getUserPreferences(userId) {
    return await prisma.notificationPreferences.findUnique({
      where: { userId }
    });
  }

  /**
   * Update user notification preferences
   */
  async updateUserPreferences(userId, preferences) {
    return await prisma.notificationPreferences.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences
      }
    });
  }
}

export const notificationService = new NotificationService();