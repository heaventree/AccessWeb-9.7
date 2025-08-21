const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();

// Configure email transporter for 2FA codes
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

/**
 * Update user's two-factor authentication settings
 * @route PUT /api/v1/users/:id/two-factor
 */
async function updateTwoFactorSettings(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.user;
    const { isTwoFactorEnabled } = req.body;

    // Check if user is updating their own settings
    if (currentUser.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Update 2FA settings
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: isTwoFactorEnabled }
    });

    // Create security log entry
    await prisma.securityLog.create({
      data: {
        userId: userId,
        eventType: isTwoFactorEnabled ? '2fa_enabled' : '2fa_disabled',
        description: `Two-factor authentication ${isTwoFactorEnabled ? 'enabled' : 'disabled'}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
        metadata: { isTwoFactorEnabled }
      }
    });

    res.json({
      success: true,
      message: `Two-factor authentication ${isTwoFactorEnabled ? 'enabled' : 'disabled'} successfully`,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled
    });
  } catch (error) {
    console.error('Update 2FA settings error:', error);
    res.status(500).json({ error: 'Failed to update two-factor authentication settings' });
  }
}

/**
 * Send two-factor authentication code via email
 * @route POST /api/v1/users/:id/two-factor/send-code
 */
async function sendTwoFactorCode(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.user;

    // Check if user is requesting code for their own account
    if (currentUser.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.isTwoFactorEnabled) {
      return res.status(400).json({ error: 'Two-factor authentication is not enabled for this account' });
    }

    // Generate and store the 2FA code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorCode: code,
        twoFactorCodeExpiry: expiry
      }
    });
    
    // Send the code via email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: 'Your Verification Code',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2 style="color: #0fae96;">Verification Code</h2>
          <p>Hello ${user.name || user.email},</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #0fae96; letter-spacing: 8px;">${code}</span>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Create security log entry
    await prisma.securityLog.create({
      data: {
        userId: userId,
        eventType: '2fa_code_sent',
        description: 'Two-factor authentication code sent via email',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
        metadata: { email: user.email }
      }
    });

    res.json({
      success: true,
      message: 'Verification code sent to your email address',
      email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email for security
    });
  } catch (error) {
    console.error('Send 2FA code error:', error);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
}

/**
 * Verify two-factor authentication code
 * @route POST /api/v1/users/:id/two-factor/verify
 */
async function verifyTwoFactorCode(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.user;
    const { code } = req.body;

    // Check if user is verifying code for their own account
    if (currentUser.id !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    if (!code) {
      return res.status(400).json({ error: 'Verification code is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the code
    const now = new Date();
    const isValid = user.twoFactorCode === code && 
                   user.twoFactorCodeExpiry && 
                   user.twoFactorCodeExpiry > now;
    
    if (!isValid) {
      // Create security log for failed verification
      await prisma.securityLog.create({
        data: {
          userId: userId,
          eventType: '2fa_verification_failed',
          description: 'Two-factor authentication verification failed',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || '',
          metadata: { providedCode: code }
        }
      });

      return res.status(400).json({ error: 'Invalid or expired verification code' });
    }

    // Clear the 2FA code after successful verification
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorCode: null,
        twoFactorCodeExpiry: null
      }
    });

    // Create security log for successful verification
    await prisma.securityLog.create({
      data: {
        userId: userId,
        eventType: '2fa_verification_success',
        description: 'Two-factor authentication verification successful',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      }
    });

    res.json({
      success: true,
      message: 'Verification code confirmed successfully'
    });
  } catch (error) {
    console.error('Verify 2FA code error:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
}

module.exports = {
  updateTwoFactorSettings,
  sendTwoFactorCode,
  verifyTwoFactorCode
};