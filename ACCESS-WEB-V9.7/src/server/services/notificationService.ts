import { emailService } from './emailService';
import { prisma } from '../../lib/prisma';
import { storage } from '../storage';

interface NotificationData {
  userId: number;
  type: string;
  category: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  metadata?: any;
  expiresAt?: Date;
}

export class NotificationService {
  /**
   * Main notification function that decides whether to send notifications
   * based on user preferences and notification type
   */
  async sendNotification(notificationData: NotificationData, channels: ('email' | 'inapp')[] = ['email', 'inapp']): Promise<boolean> {
    try {
      const { userId, type, category } = notificationData;

      // Get user notification preferences
      const preferences = await this.getUserNotificationPreferences(userId);
      if (!preferences) {
        console.warn(`[NOTIFICATION] No preferences found for user ${userId}, using defaults`);
      }

      // Check if user has notifications enabled for this type
      const shouldNotify = this.shouldSendNotification(preferences, type, category);
      if (!shouldNotify.email && !shouldNotify.inapp) {
        console.log(`[NOTIFICATION] User ${userId} has disabled notifications for type: ${type}, category: ${category}`);
        return false;
      }

      const results: boolean[] = [];

      // Create in-app notification if enabled
      if (channels.includes('inapp') && shouldNotify.inapp) {
        const inappResult = await this.createInAppNotification(notificationData);
        results.push(!!inappResult);
      }

      // Send email notification if enabled
      if (channels.includes('email') && shouldNotify.email) {
        const emailResult = await this.sendEmailNotification(notificationData);
        results.push(emailResult);
      }

      return results.some(result => result);
    } catch (error) {
      console.error('[NOTIFICATION] Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Send email notification with template support
   */
  async sendEmailNotification(notificationData: NotificationData): Promise<boolean> {
    try {
      const { userId } = notificationData;

      // Get user details
      const user = await storage.getUser(userId);
      if (!user) {
        console.error(`[NOTIFICATION] User ${userId} not found`);
        return false;
      }

      // Try to get email template first
      const template = await this.getEmailTemplate(notificationData.type, notificationData.category);
      
      let emailSubject: string;
      let emailContent: string;

      if (template) {
        // Use template and replace variables
        emailSubject = this.replaceTemplateVariables(template.subject || notificationData.title, {
          user,
          notification: notificationData
        });
        emailContent = this.replaceTemplateVariables(template.content, {
          user,
          notification: notificationData
        });
      } else {
        // Use default email format
        emailSubject = notificationData.title;
        emailContent = this.generateDefaultEmailContent(notificationData, user);
      }

      // Send email
      const emailSent = await this.sendEmail(user.email, emailSubject, emailContent, user.fullName || user.email);

      // Log delivery attempt
      const notificationId = await this.createInAppNotification(notificationData);
      if (notificationId) {
        await this.logDeliveryAttempt(notificationId, userId, 'email', emailSent ? 'delivered' : 'failed', 
          emailSent ? undefined : 'Email service failed');
      }

      return emailSent;
    } catch (error) {
      console.error('[NOTIFICATION] Failed to send email notification:', error);
      return false;
    }
  }

  /**
   * Create in-app notification
   */
  async createInAppNotification(notificationData: NotificationData): Promise<number | null> {
    try {
      const notification = await storage.createNotification({
        userId: notificationData.userId,
        type: notificationData.type,
        category: notificationData.category,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: notificationData.actionUrl,
        actionLabel: notificationData.actionLabel,
        priority: notificationData.priority || 'normal',
        metadata: notificationData.metadata,
        expiresAt: notificationData.expiresAt
      });

      console.log(`[NOTIFICATION] In-app notification created with ID: ${notification.id}`);
      return notification.id;
    } catch (error) {
      console.error('[NOTIFICATION] Failed to create in-app notification:', error);
      return null;
    }
  }

  /**
   * Check user preferences and determine if notification should be sent
   */
  private shouldSendNotification(preferences: any, type: string, category: string): { email: boolean, inapp: boolean } {
    const result = { email: false, inapp: false };

    // Default to true if preferences don't exist
    if (!preferences) {
      return { email: true, inapp: true };
    }

    // Check master notification switches
    const emailEnabled = preferences.emailNotifications !== false;
    const inappEnabled = true; // Always allow in-app notifications unless specifically disabled

    if (!emailEnabled && !inappEnabled) {
      return result;
    }

    // Check specific notification type preferences
    switch (category) {
      case 'scan_completed':
        result.email = emailEnabled && (preferences.scanCompleted !== false);
        result.inapp = inappEnabled && (preferences.scanCompleted !== false);
        break;
      case 'critical_issues':
        result.email = emailEnabled && (preferences.criticalIssues !== false);
        result.inapp = inappEnabled && (preferences.criticalIssues !== false);
        break;
      case 'usage_alerts':
        result.email = emailEnabled && (preferences.usageAlerts !== false);
        result.inapp = inappEnabled && (preferences.usageAlerts !== false);
        break;
      case 'security_alerts':
        result.email = emailEnabled && (preferences.securityAlerts !== false);
        result.inapp = inappEnabled && (preferences.securityAlerts !== false);
        break;
      case 'payment_notifications':
        result.email = emailEnabled && (preferences.paymentNotifications !== false);
        result.inapp = inappEnabled && (preferences.paymentNotifications !== false);
        break;
      default:
        // Default behavior for unknown categories
        result.email = emailEnabled;
        result.inapp = inappEnabled;
    }

    return result;
  }

  /**
   * Get user notification preferences
   */
  private async getUserNotificationPreferences(userId: number) {
    try {
      return await storage.getNotificationPreferences(userId);
    } catch (error) {
      console.error('[NOTIFICATION] Failed to get user preferences:', error);
      return null;
    }
  }

  /**
   * Get email template for notification type and category
   */
  private async getEmailTemplate(type: string, category: string) {
    try {
      // For now, return null as templates are not implemented yet
      // This will be enhanced later when notification templates are fully implemented
      return null;
    } catch (error) {
      console.error('[NOTIFICATION] Failed to get email template:', error);
      return null;
    }
  }

  /**
   * Replace template variables with actual values
   */
  private replaceTemplateVariables(template: string, variables: any): string {
    let result = template;
    
    // Replace user variables
    if (variables.user) {
      result = result.replace(/{{user\.name}}/g, variables.user.fullName || 'User');
      result = result.replace(/{{user\.email}}/g, variables.user.email);
      result = result.replace(/{{user\.fullName}}/g, variables.user.fullName || '');
    }

    // Replace notification variables
    if (variables.notification) {
      result = result.replace(/{{notification\.title}}/g, variables.notification.title);
      result = result.replace(/{{notification\.message}}/g, variables.notification.message);
      result = result.replace(/{{notification\.actionUrl}}/g, variables.notification.actionUrl || '');
      result = result.replace(/{{notification\.actionLabel}}/g, variables.notification.actionLabel || '');
      
      // Replace metadata variables
      if (variables.notification.metadata) {
        Object.keys(variables.notification.metadata).forEach(key => {
          const regex = new RegExp(`{{metadata\\.${key}}}`, 'g');
          result = result.replace(regex, variables.notification.metadata[key]);
        });
      }
    }

    return result;
  }

  /**
   * Generate default email content when no template exists
   */
  private generateDefaultEmailContent(notificationData: NotificationData, user: any): string {
    const userName = user.fullName || 'User';
    
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0fae96 0%, #0d9a85 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Access Checker Notification</h1>
        </div>
        
        <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
            Hi ${userName},
          </p>
          
          <h2 style="color: #0fae96; font-size: 20px; margin-bottom: 15px;">
            ${notificationData.title}
          </h2>
          
          <p style="font-size: 16px; color: #374151; margin-bottom: 30px; line-height: 1.6;">
            ${notificationData.message}
          </p>
          
          ${notificationData.actionUrl ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${notificationData.actionUrl}" 
                 style="background: #0fae96; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                ${notificationData.actionLabel || 'View Details'}
              </a>
            </div>
          ` : ''}
          
          <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              This is an automated message from Access Checker. You can manage your notification preferences in your account settings.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Send email using the email service
   */
  private async sendEmail(to: string, subject: string, htmlContent: string, userName?: string): Promise<boolean> {
    try {
      // For now, we'll use a generic method. You can extend emailService to support custom HTML content
      return await this.sendCustomEmail(to, subject, htmlContent, userName);
    } catch (error) {
      console.error('[NOTIFICATION] Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send custom HTML email (extending the email service)
   */
  private async sendCustomEmail(to: string, subject: string, htmlContent: string, userName?: string): Promise<boolean> {
    const transporter = (emailService as any).transporter;
    
    if (!transporter) {
      console.error('[NOTIFICATION] Email service not configured');
      return false;
    }

    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Access Checker'}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: htmlContent,
        // Generate text version from HTML
        text: this.htmlToText(htmlContent)
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[NOTIFICATION] Email sent successfully: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error('[NOTIFICATION] Failed to send email:', error);
      return false;
    }
  }

  /**
   * Convert HTML to plain text (basic implementation)
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Log delivery attempt in the database
   */
  private async logDeliveryAttempt(
    notificationId: number,
    userId: number,
    channel: string,
    status: string,
    failureReason?: string
  ): Promise<void> {
    try {
      // For now, just log to console. This can be enhanced later with proper delivery logging
      console.log(`[NOTIFICATION] Delivery attempt logged: ${channel} -> ${status} for notification ${notificationId}`);
      if (failureReason) {
        console.log(`[NOTIFICATION] Failure reason: ${failureReason}`);
      }
    } catch (error) {
      console.error('[NOTIFICATION] Failed to log delivery attempt:', error);
    }
  }

  /**
   * Convenience method for scan completion notifications
   */
  async sendScanCompletionNotification(
    userId: number,
    scanResult: any,
    siteConnection: any
  ): Promise<boolean> {
    const actionUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/dashboard/reports/${scanResult.id}`;
    
    // Determine priority based on scan results
    let priority: 'low' | 'normal' | 'high' | 'critical' = 'normal';
    if (scanResult.errorCount > 50) {
      priority = 'critical';
    } else if (scanResult.errorCount > 20) {
      priority = 'high';
    } else if (scanResult.errorCount > 0) {
      priority = 'normal';
    } else {
      priority = 'low';
    }

    const notificationData: NotificationData = {
      userId,
      type: 'accessibility_scan',
      category: 'scan_completed',
      title: `Accessibility scan completed for ${siteConnection.siteName}`,
      message: this.generateScanCompletionMessage(scanResult, siteConnection),
      actionUrl,
      actionLabel: 'View Detailed Report',
      priority,
      metadata: {
        scanId: scanResult.id,
        siteConnectionId: siteConnection.id,
        siteName: siteConnection.siteName,
        siteUrl: siteConnection.siteUrl,
        errorCount: scanResult.errorCount,
        warningCount: scanResult.warningCount,
        noticeCount: scanResult.noticeCount,
        score: scanResult.score,
        scanDuration: scanResult.scanDuration
      }
    };

    return await this.sendNotification(notificationData);
  }

  /**
   * Generate scan completion message
   */
  private generateScanCompletionMessage(scanResult: any, siteConnection: any): string {
    const { errorCount, warningCount, noticeCount, score, scanStatus } = scanResult;
    
    if (scanStatus === 'failed') {
      return `The accessibility scan for ${siteConnection.siteName} failed to complete. Please check your site configuration and try again.`;
    }

    if (errorCount === 0) {
      return `Great news! Your accessibility scan for ${siteConnection.siteName} completed with no critical issues found. ${warningCount > 0 ? `${warningCount} warnings` : 'No warnings'} and ${noticeCount} notices were identified.`;
    } else if (errorCount <= 5) {
      return `Your accessibility scan for ${siteConnection.siteName} found ${errorCount} error${errorCount > 1 ? 's' : ''}, ${warningCount} warning${warningCount > 1 ? 's' : ''}, and ${noticeCount} notice${noticeCount > 1 ? 's' : ''}. These can be addressed to improve accessibility compliance.`;
    } else if (errorCount <= 20) {
      return `Your accessibility scan for ${siteConnection.siteName} found ${errorCount} errors, ${warningCount} warnings, and ${noticeCount} notices. We recommend reviewing these issues to improve accessibility compliance.`;
    } else {
      return `Your accessibility scan for ${siteConnection.siteName} found ${errorCount} errors, ${warningCount} warnings, and ${noticeCount} notices. Multiple accessibility issues were detected that should be addressed for better compliance.`;
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();