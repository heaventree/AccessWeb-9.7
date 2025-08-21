import { Router, Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { hashPassword } from '../utils/auth';
import { emailService } from '../services/emailService';
import { prisma } from '../../lib/prisma';
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

      // Update 2FA settings
      const updatedUser = await storage.updateUserTwoFactorSettings(userId, {
        isTwoFactorEnabled: isTwoFactorEnabled
      });

      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create security log entry
      await db.insert(schema.securityLogs).values({
        userId: userId,
        eventType: isTwoFactorEnabled ? '2fa_enabled' : '2fa_disabled',
        description: `Two-factor authentication ${isTwoFactorEnabled ? 'enabled' : 'disabled'}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        metadata: { isTwoFactorEnabled }
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
  app.use(`${apiPrefix}/users`, router);
}