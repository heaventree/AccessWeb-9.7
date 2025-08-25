import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

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
    console.log(`[NOTIFICATION-SERVICE] Creating notification for user ${userId}:`, {
      type, category, title, sendEmail
    });
    try {
      // Get user notification preferences
      const preferences = await prisma.notificationPreferences.findUnique({
        where: { userId }
      });
      console.log(`[NOTIFICATION-SERVICE] User ${userId} preferences:`, preferences);

      // Create in-app notification if user has them enabled (default: true)
      let inAppNotification = null;
      const shouldCreateInApp = !preferences || preferences.browserNotifications;
      console.log(`[NOTIFICATION-SERVICE] Should create in-app for user ${userId}: ${shouldCreateInApp}`);
      
      if (shouldCreateInApp) {
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

        console.log(`📧 [NOTIFICATION-SERVICE] ✅ Created in-app notification ID ${inAppNotification.id}: ${title} for user ${userId}`);
      } else {
        console.log(`📧 [NOTIFICATION-SERVICE] ❌ Skipped in-app notification for user ${userId} - browser notifications disabled`);
      }

      // Send email notification if enabled and user has email notifications on
      const shouldSendEmail = sendEmail && preferences && preferences.emailNotifications && this.shouldSendEmailForType(type, preferences);
      console.log(`[NOTIFICATION-SERVICE] Should send email for user ${userId}:`, {
        sendEmail,
        hasPreferences: !!preferences,
        emailNotifications: preferences?.emailNotifications,
        shouldSendEmailForType: this.shouldSendEmailForType(type, preferences),
        finalDecision: shouldSendEmail
      });
      
      if (shouldSendEmail) {
        try {
          console.log(`📧 [NOTIFICATION-SERVICE] 📨 Attempting to send email for user ${userId}...`);
          await this.sendEmailNotification({
            userId,
            type,
            title,
            message,
            actionUrl,
            metadata
          });
          console.log(`📧 [NOTIFICATION-SERVICE] ✅ Email sent successfully for user ${userId}`);
        } catch (emailError) {
          console.error(`📧 [NOTIFICATION-SERVICE] ❌ Email notification failed for user ${userId}:`, emailError);
          // Don't throw - in-app notification is still created
        }
      } else {
        console.log(`📧 [NOTIFICATION-SERVICE] ❌ Skipped email notification for user ${userId}`);
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
   * Create subscription upgrade notification
   */
  async createSubscriptionUpgradeNotification(userId, { fromPlan, toPlan, currentPeriodEnd }) {
    const title = `🎉 Subscription Upgraded to ${toPlan}`;
    const message = `Congratulations! Your subscription has been successfully upgraded from ${fromPlan} to ${toPlan}. You now have access to all the enhanced features of your new plan.`;
    
    return await this.createNotification({
      userId,
      type: 'subscription_upgrade',
      category: 'billing',
      title,
      message,
      priority: 'normal',
      actionUrl: `/subscription-dashboard`,
      metadata: {
        fromPlan,
        toPlan,
        currentPeriodEnd,
        upgradeDate: new Date().toISOString()
      }
    });
  }

  /**
   * Create subscription cancellation notification
   */
  async createSubscriptionCancellationNotification(userId, { plan, currentPeriodEnd, reason }) {
    const title = `📋 Subscription Cancelled`;
    const message = `Your ${plan} subscription has been cancelled. Your access will continue until ${new Date(currentPeriodEnd).toLocaleDateString()}, and you can reactivate anytime before then.`;
    
    return await this.createNotification({
      userId,
      type: 'subscription_cancelled',
      category: 'billing',
      title,
      message,
      priority: 'normal',
      actionUrl: `/subscription-dashboard`,
      metadata: {
        plan,
        currentPeriodEnd,
        cancellationDate: new Date().toISOString(),
        reason: reason || 'No reason provided'
      }
    });
  }

  /**
   * Create subscription expiration warning notification
   */
  async createSubscriptionExpirationWarningNotification(userId, { plan, daysUntilExpiration, currentPeriodEnd }) {
    const title = `⚠️ Subscription Expiring Soon`;
    const message = `Your ${plan} subscription will expire in ${daysUntilExpiration} day${daysUntilExpiration === 1 ? '' : 's'} (${new Date(currentPeriodEnd).toLocaleDateString()}). Renew now to continue enjoying premium features.`;
    
    return await this.createNotification({
      userId,
      type: 'subscription_expiring',
      category: 'billing',
      title,
      message,
      priority: 'high',
      actionUrl: `/subscription-dashboard`,
      metadata: {
        plan,
        daysUntilExpiration,
        currentPeriodEnd,
        warningDate: new Date().toISOString()
      }
    });
  }

  /**
   * Create subscription expired notification
   */
  async createSubscriptionExpiredNotification(userId, { plan, expiredDate }) {
    const title = `❌ Subscription Expired`;
    const message = `Your ${plan} subscription expired on ${new Date(expiredDate).toLocaleDateString()}. You've been moved to the free plan. Upgrade anytime to restore premium features.`;
    
    return await this.createNotification({
      userId,
      type: 'subscription_expired',
      category: 'billing',
      title,
      message,
      priority: 'high',
      actionUrl: `/subscription-dashboard`,
      metadata: {
        plan,
        expiredDate,
        notificationDate: new Date().toISOString()
      }
    });
  }

  /**
   * Create payment failed notification
   */
  async createPaymentFailedNotification(userId, { plan, amount, currency = 'USD', retryDate }) {
    const title = `💳 Payment Failed`;
    const message = `We couldn't process your payment of $${amount} ${currency} for your ${plan} subscription. Please update your payment method to avoid service interruption.`;
    
    return await this.createNotification({
      userId,
      type: 'payment_failed',
      category: 'billing',
      title,
      message,
      priority: 'critical',
      actionUrl: `/subscription-dashboard`,
      metadata: {
        plan,
        amount,
        currency,
        retryDate,
        failureDate: new Date().toISOString()
      }
    });
  }

  /**
   * Check if email should be sent for this notification type based on user preferences
   */
  shouldSendEmailForType(type, preferences) {
    console.log(`[NOTIFICATION-SERVICE] Checking if should send email for type '${type}' with preferences:`, preferences);
    const result = (() => {
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
      case 'payment_failed':
        return preferences.paymentNotifications;
      case 'subscription_upgrade':
      case 'subscription_cancelled':
      case 'subscription_expiring':
      case 'subscription_expired':
        return preferences.subscriptionNotifications || preferences.paymentNotifications;
      default:
        return true; // Default to sending email
    }
    })();
    console.log(`[NOTIFICATION-SERVICE] Should send email for type '${type}': ${result}`);
    return result;
  }

  /**
   * Send email notification
   */
  async sendEmailNotification({ userId, type, title, message, actionUrl, metadata }) {
    console.log(`[NOTIFICATION-SERVICE] 📧 Starting email send process for user ${userId}...`);
    try {
      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true }
      });
      console.log(`[NOTIFICATION-SERVICE] 📧 User details for ${userId}:`, { email: user?.email, name: user?.name });

      if (!user || !user.email) {
        console.error(`[NOTIFICATION-SERVICE] 📧 ❌ User ${userId} not found or email not available`);
        throw new Error('User not found or email not available');
      }

      // Create email transporter
      console.log(`[NOTIFICATION-SERVICE] 📧 Creating email transporter with Gmail config...`);
      console.log(`[NOTIFICATION-SERVICE] 📧 Gmail user configured: ${!!process.env.GMAIL_USER}`);
      console.log(`[NOTIFICATION-SERVICE] 📧 Gmail password configured: ${!!process.env.GMAIL_PASS}`);
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });

      // Determine email content based on notification type
      const emailContent = this.getEmailContent(type, title, message, actionUrl, metadata, user.name);
      
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      };

      console.log(`📧 [NOTIFICATION-SERVICE] 📨 Sending email to ${user.email}: ${title}`);
      console.log(`📧 [NOTIFICATION-SERVICE] 📨 Email options:`, {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      
      await transporter.sendMail(mailOptions);
      
      console.log(`✅ [NOTIFICATION-SERVICE] 📧 Email sent successfully to ${user.email}: ${title}`);

      // Log email delivery
      await prisma.notificationDeliveryLog.create({
        data: {
          userId,
          channel: 'email',
          status: 'delivered',
          deliveredAt: new Date(),
          metadata: {
            type,
            subject: emailContent.subject,
            recipient: user.email
          }
        }
      });

    } catch (error) {
      console.error(`📧 [NOTIFICATION-SERVICE] ❌ Email sending failed for user ${userId}:`, error);
      
      // Log failed delivery
      try {
        await prisma.notificationDeliveryLog.create({
          data: {
            userId,
            channel: 'email',
            status: 'failed',
            deliveredAt: new Date(),
            metadata: {
              type,
              error: error.message
            }
          }
        });
      } catch (logError) {
        console.error('📧 [NOTIFICATION] Failed to log email delivery failure:', logError);
      }
      
      throw error;
    }
  }

  /**
   * Generate email content based on notification type
   */
  getEmailContent(type, title, message, actionUrl, metadata, userName) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    const fullActionUrl = actionUrl ? `${baseUrl}${actionUrl}` : null;
    
    const subject = title.replace(/[📧🚨⚠️❌✅🎉]/g, '').trim();
    
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background-color: #0fae96; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">ACCESS WEB</h1>
        </div>
        
        <div style="padding: 30px 20px;">
          <h2 style="color: #0fae96; margin-bottom: 20px;">${subject}</h2>
          
          <p>Hello ${userName || 'User'},</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">${message}</p>
          </div>
          
          ${fullActionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${fullActionUrl}" 
                 style="background-color: #0fae96; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px; display: inline-block;
                        font-weight: bold;">
                View Details
              </a>
            </div>
          ` : ''}
          
          ${metadata && Object.keys(metadata).length > 0 ? `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <h3 style="color: #666; font-size: 14px; margin-bottom: 10px;">Additional Details:</h3>
              ${Object.entries(metadata).map(([key, value]) => 
                `<p style="margin: 5px 0; color: #666; font-size: 14px;">
                  <strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}
                </p>`
              ).join('')}
            </div>
          ` : ''}
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            This email was sent from your ACCESS WEB account. 
            <a href="${baseUrl}/settings/notifications" style="color: #0fae96;">Manage your notification preferences</a>
          </p>
        </div>
      </div>
    `;
    
    const text = `
${subject}

Hello ${userName || 'User'},

${message}

${fullActionUrl ? `View Details: ${fullActionUrl}` : ''}

${metadata && Object.keys(metadata).length > 0 ? 
  '\nAdditional Details:\n' + 
  Object.entries(metadata).map(([key, value]) => 
    `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: ${value}`
  ).join('\n') : ''}

---
This email was sent from your ACCESS WEB account.
Manage your notification preferences: ${baseUrl}/settings/notifications
    `.trim();

    return { subject, html, text };
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