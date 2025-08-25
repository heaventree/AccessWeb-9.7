import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { hashPassword } from '../utils/auth';
import { emailService } from '../services/emailService';
import { prisma } from '../../lib/prisma';
import { storage } from '../storage';
import { db } from '../../lib/db';
import * as schema from '../../shared/schema';
import { eq, and, not } from 'drizzle-orm';
import crypto from 'crypto';

export function registerUserRoutes(app: any, apiPrefix: string): void {
  const router = Router();

  /**
   * @route   GET /api/v1/users
   * @desc    Get all users (admin only)
   * @access  Private/Admin
   */
  router.get('/', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
    try {
      // TODO: Implement pagination and filtering
      const users = await db.select({
        id: schema.users.id,
        email: schema.users.email,
        username: schema.users.username,
        fullName: schema.users.fullName,
        role: schema.users.role,
        isActive: schema.users.isActive,
        isVerified: schema.users.isVerified,
        createdAt: schema.users.createdAt
      })
      .from(schema.users)
      .orderBy(schema.users.createdAt);

      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  });

  /**
   * @route   GET /api/v1/users/:id
   * @desc    Get user by ID
   * @access  Private/Admin or Self
   */
  router.get('/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;

      // Check if user is requesting their own data or is an admin
      if (currentUser.id !== userId && currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't return sensitive data
      const { password, resetPasswordToken, resetPasswordExpires, ...userData } = user;

      res.json({ user: userData });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  /**
   * @route   PUT /api/v1/users/:id
   * @desc    Update user
   * @access  Private/Admin or Self
   */
  router.put('/:id', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;
      
      // Check if user is updating their own data or is an admin
      if (currentUser.id !== userId && currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const { password, email, username, fullName, role, isActive } = req.body;
      
      // Get current user data
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Build update object
      const updateData: any = {};
      
      if (fullName !== undefined) {
        updateData.fullName = fullName;
      }
      
      // Only admin can change these fields
      if (currentUser.role === 'admin') {
        if (role !== undefined) {
          updateData.role = role;
        }
        
        if (isActive !== undefined) {
          updateData.isActive = isActive;
        }
      }
      
      // Email and username changes require special handling to check uniqueness
      if (email && email !== user.email) {
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          return res.status(400).json({ error: 'Email already in use' });
        }
        updateData.email = email;
      }
      
      if (username && username !== user.username) {
        const existingUser = await storage.getUserByUsername(username);
        if (existingUser) {
          return res.status(400).json({ error: 'Username already taken' });
        }
        updateData.username = username;
      }
      
      // Handle password update
      if (password) {
        updateData.password = await hashPassword(password);
      }
      
      // Update user if there are changes
      if (Object.keys(updateData).length > 0) {
        const updatedUser = await storage.updateUser(userId, updateData);
        
        if (!updatedUser) {
          return res.status(500).json({ error: 'Failed to update user' });
        }
        
        // Don't return sensitive data
        const { password, resetPasswordToken, resetPasswordExpires, ...userData } = updatedUser;
        
        res.json({ user: userData, message: 'User updated successfully' });
      } else {
        // Don't return sensitive data
        const { password, resetPasswordToken, resetPasswordExpires, ...userData } = user;
        
        res.json({ user: userData, message: 'No changes were made' });
      }
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Failed to update user' });
    }
  });

  /**
   * @route   DELETE /api/v1/users/:id
   * @desc    Delete user
   * @access  Private/Admin
   */
  router.delete('/:id', authenticate, authorize(['admin']), async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Check if user exists
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Delete user
      const success = await storage.deleteUser(userId);
      
      if (!success) {
        return res.status(500).json({ error: 'Failed to delete user' });
      }
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  });

  /**
   * @route   GET /api/v1/users/:id/profile
   * @desc    Get user profile
   * @access  Public (for public profiles)
   */
  router.get('/:id/profile', async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await storage.getUser(userId);
      
      if (!user || !user.isActive) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return limited public profile data
      const publicProfile = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        // Include any other public fields here
      };
      
      res.json({ profile: publicProfile });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get user profile' });
    }
  });

  /**
   * @route   PUT /api/v1/users/:id/two-factor
   * @desc    Update user's two-factor authentication settings
   * @access  Private (Self only)
   */
  router.put('/:id/two-factor', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;
      const { isTwoFactorEnabled } = req.body;

      // Check if user is updating their own settings
      if (currentUser.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If enabling 2FA, send confirmation email first (don't update database yet)
      if (isTwoFactorEnabled && !user.isTwoFactorEnabled) {
        // Generate and store verification code for 2FA setup
        const code = await storage.generateAndStoreTwoFactorCode(userId);
        
        // Send setup confirmation email
        const emailSent = await emailService.sendTwoFactorSetupCode(
          user.email,
          code,
          user.name || user.firstName || user.email
        );

        if (!emailSent) {
          return res.status(500).json({ error: 'Failed to send verification email' });
        }

        // Return success but don't update 2FA status yet
        return res.json({
          success: true,
          requiresVerification: true,
          message: 'Verification code sent to your email. Please check your inbox and confirm to enable two-factor authentication.',
          email: user.email.replace(/(.{2}).*(@.*)/, '$1***$2') // Mask email for security
        });
      }

      // If disabling 2FA, update directly (no email confirmation needed)
      if (!isTwoFactorEnabled && user.isTwoFactorEnabled) {
        const updatedUser = await storage.updateUserTwoFactorSettings(userId, {
          isTwoFactorEnabled: false,
          twoFactorCode: null,
          twoFactorCodeExpiry: null
        });

        // Create security log entry
        await db.insert(schema.securityLogs).values({
          userId: userId,
          eventType: '2fa_disabled',
          description: 'Two-factor authentication disabled',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: { isTwoFactorEnabled: false }
        });

        return res.json({
          success: true,
          message: 'Two-factor authentication disabled successfully',
          isTwoFactorEnabled: false
        });
      }

      // If trying to enable when already enabled, or disable when already disabled
      res.json({
        success: true,
        message: `Two-factor authentication is already ${isTwoFactorEnabled ? 'enabled' : 'disabled'}`,
        isTwoFactorEnabled: user.isTwoFactorEnabled
      });
    } catch (error) {
      console.error('Update 2FA settings error:', error);
      res.status(500).json({ error: 'Failed to update two-factor authentication settings' });
    }
  });

  /**
   * @route   POST /api/v1/users/:id/two-factor/verify-setup
   * @desc    Verify and complete two-factor authentication setup
   * @access  Private (Self only)
   */
  router.post('/:id/two-factor/verify-setup', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;
      const { code } = req.body;

      // Check if user is verifying their own account
      if (currentUser.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      if (!code) {
        return res.status(400).json({ error: 'Verification code is required' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't allow verification if 2FA is already enabled
      if (user.isTwoFactorEnabled) {
        return res.status(400).json({ error: 'Two-factor authentication is already enabled' });
      }

      // Verify the code
      const isValid = await storage.verifyTwoFactorCode(userId, code);
      if (!isValid) {
        // Create security log for failed verification attempt
        await db.insert(schema.securityLogs).values({
          userId: userId,
          eventType: '2fa_setup_failed',
          description: 'Failed attempt to verify two-factor authentication setup',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: { providedCode: code }
        });

        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }

      // Code is valid, now enable 2FA
      const updatedUser = await storage.updateUserTwoFactorSettings(userId, {
        isTwoFactorEnabled: true,
        twoFactorCode: null,  // Clear the setup code
        twoFactorCodeExpiry: null
      });

      // Create security log entry for successful 2FA enablement
      await db.insert(schema.securityLogs).values({
        userId: userId,
        eventType: '2fa_enabled',
        description: 'Two-factor authentication enabled successfully',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        metadata: { isTwoFactorEnabled: true }
      });

      res.json({
        success: true,
        message: 'Two-factor authentication has been successfully enabled for your account',
        isTwoFactorEnabled: true
      });
    } catch (error) {
      console.error('Verify 2FA setup error:', error);
      res.status(500).json({ error: 'Failed to verify two-factor authentication setup' });
    }
  });

  /**
   * @route   POST /api/v1/users/:id/two-factor/send-code
   * @desc    Send two-factor authentication code via email
   * @access  Private (Self only)
   */
  router.post('/:id/two-factor/send-code', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;

      // Check if user is requesting code for their own account
      if (currentUser.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.isTwoFactorEnabled) {
        return res.status(400).json({ error: 'Two-factor authentication is not enabled for this account' });
      }

      // Generate and store the 2FA code
      const code = await storage.generateAndStoreTwoFactorCode(userId);
      
      // Send the code via email
      const emailSent = await emailService.sendTwoFactorCode(
        user.email,
        code,
        user.fullName || user.username
      );

      if (!emailSent) {
        return res.status(500).json({ error: 'Failed to send verification code' });
      }

      // Create security log entry
      await db.insert(schema.securityLogs).values({
        userId: userId,
        eventType: '2fa_code_sent',
        description: 'Two-factor authentication code sent via email',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        metadata: { email: user.email }
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
  });

  /**
   * @route   POST /api/v1/users/:id/two-factor/verify
   * @desc    Verify two-factor authentication code
   * @access  Private (Self only)
   */
  router.post('/:id/two-factor/verify', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;
      const { code } = req.body;

      // Check if user is verifying code for their own account
      if (currentUser.id !== userId) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      if (!code) {
        return res.status(400).json({ error: 'Verification code is required' });
      }

      // Verify the code
      const isValid = await storage.verifyTwoFactorCode(userId, code);
      
      if (!isValid) {
        // Create security log for failed verification
        await db.insert(schema.securityLogs).values({
          userId: userId,
          eventType: '2fa_verification_failed',
          description: 'Two-factor authentication verification failed',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: { providedCode: code }
        });

        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }

      // Create security log for successful verification
      await db.insert(schema.securityLogs).values({
        userId: userId,
        eventType: '2fa_verification_success',
        description: 'Two-factor authentication verification successful',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        message: 'Verification code confirmed successfully'
      });
    } catch (error) {
      console.error('Verify 2FA code error:', error);
      res.status(500).json({ error: 'Failed to verify code' });
    }
  });

  // Register routes
  /**
   * @route   GET /api/v1/users/:id/notification-preferences
   * @desc    Get user notification preferences
   * @access  Private/Self
   */
  router.get('/:id/notification-preferences', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;

      // Check if user is requesting their own data
      if (currentUser.id !== userId && currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const preferences = await storage.getNotificationPreferences(userId);
      
      // If no preferences exist, return defaults
      if (!preferences) {
        const defaultPreferences = {
          userId,
          emailNotifications: true,
          browserNotifications: true,
          scanCompleted: true,
          criticalIssues: true,
          weeklyDigest: true,
          usageAlerts: true,
          teamUpdates: false,
          marketingEmails: false
        };
        return res.json({ preferences: defaultPreferences });
      }

      res.json({ preferences });
    } catch (error) {
      console.error('Get notification preferences error:', error);
      res.status(500).json({ error: 'Failed to get notification preferences' });
    }
  });

  /**
   * @route   PUT /api/v1/users/:id/notification-preferences
   * @desc    Update user notification preferences
   * @access  Private/Self
   */
  router.put('/:id/notification-preferences', authenticate, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const currentUser = (req as any).user;

      // Check if user is updating their own data
      if (currentUser.id !== userId && currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const {
        emailNotifications,
        browserNotifications,
        scanCompleted,
        criticalIssues,
        weeklyDigest,
        usageAlerts,
        teamUpdates,
        marketingEmails
      } = req.body;

      // Build update object with only defined values
      const updateData: any = {};
      
      if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;
      if (browserNotifications !== undefined) updateData.browserNotifications = browserNotifications;
      if (scanCompleted !== undefined) updateData.scanCompleted = scanCompleted;
      if (criticalIssues !== undefined) updateData.criticalIssues = criticalIssues;
      if (weeklyDigest !== undefined) updateData.weeklyDigest = weeklyDigest;
      if (usageAlerts !== undefined) updateData.usageAlerts = usageAlerts;
      if (teamUpdates !== undefined) updateData.teamUpdates = teamUpdates;
      if (marketingEmails !== undefined) updateData.marketingEmails = marketingEmails;

      const updatedPreferences = await storage.updateNotificationPreferences(userId, updateData);

      res.json({ 
        preferences: updatedPreferences, 
        message: 'Notification preferences updated successfully' 
      });
    } catch (error) {
      console.error('Update notification preferences error:', error);
      res.status(500).json({ error: 'Failed to update notification preferences' });
    }
  });

// In-app notifications endpoints
router.get('/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    const take = parseInt(limit as string);
    
    const where = {
      userId,
      ...(unreadOnly === 'true' ? { isRead: false } : {})
    };
    
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
        select: {
          id: true,
          type: true,
          category: true,
          title: true,
          message: true,
          actionUrl: true,
          actionLabel: true,
          priority: true,
          isRead: true,
          createdAt: true,
          metadata: true
        }
      }),
      prisma.notification.count({ where })
    ]);
    
    res.json({
      success: true,
      notifications,
      pagination: {
        current: parseInt(page as string),
        total: Math.ceil(total / take),
        count: total,
        hasNext: skip + take < total
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
  }
});

router.get('/notifications/unread-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
    
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch unread count' });
  }
});

router.patch('/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = parseInt(req.params.id);
    
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
        userId // Ensure user can only update their own notifications
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
    
    res.json({ success: true, notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
  }
});

router.patch('/notifications/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    });
    
    res.json({ success: true, updatedCount: result.count });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ success: false, error: 'Failed to mark all notifications as read' });
  }
});

router.delete('/notifications/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const notificationId = parseInt(req.params.id);
    
    await prisma.notification.delete({
      where: {
        id: notificationId,
        userId // Ensure user can only delete their own notifications
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, error: 'Failed to delete notification' });
  }
});

  app.use(`${apiPrefix}/users`, router);
}