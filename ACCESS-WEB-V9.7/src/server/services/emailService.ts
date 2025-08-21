import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || ''
      }
    };

    // Only create transporter if credentials are available
    if (emailConfig.auth.user && emailConfig.auth.pass) {
      this.transporter = nodemailer.createTransporter(emailConfig);
    } else {
      console.warn('Email service not configured: Missing SMTP credentials');
    }
  }

  async sendTwoFactorCode(email: string, code: string, userName?: string): Promise<boolean> {
    if (!this.transporter) {
      console.error('Email service not configured');
      return false;
    }

    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Access Checker'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your Two-Factor Authentication Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0fae96 0%, #0d9a85 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Two-Factor Authentication</h1>
            </div>
            
            <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
              <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
                ${userName ? `Hi ${userName},` : 'Hello,'}
              </p>
              
              <p style="font-size: 16px; color: #374151; margin-bottom: 30px;">
                You've requested to log in to your Access Checker account. Please use the verification code below to complete your login:
              </p>
              
              <div style="background: #f9fafb; border: 2px dashed #0fae96; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                <h2 style="font-size: 36px; font-weight: bold; color: #0fae96; margin: 0; letter-spacing: 8px;">
                  ${code}
                </h2>
              </div>
              
              <div style="background: #fef3cd; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 30px 0;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>⚠️ Security Notice:</strong> This code will expire in 5 minutes. If you didn't request this code, please ignore this email.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                For your security, never share this code with anyone. Our team will never ask for your verification code.
              </p>
              
              <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 20px;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  This is an automated message from Access Checker. Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `,
        text: `
Your Two-Factor Authentication Code

Hi ${userName || 'there'},

You've requested to log in to your Access Checker account. Please use the verification code below to complete your login:

Verification Code: ${code}

This code will expire in 5 minutes. If you didn't request this code, please ignore this email.

For your security, never share this code with anyone.

This is an automated message from Access Checker.
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('2FA email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send 2FA email:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      console.log('Email service connection verified');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const emailService = new EmailService();