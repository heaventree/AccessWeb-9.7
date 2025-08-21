import { Router, Request, Response } from 'express';
import { and, eq, gt } from 'drizzle-orm';
import { storage } from '../storage';
import { db } from '../db';
import * as schema from '../../shared/schema';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { authenticate } from '../middleware/authMiddleware';
import { emailService } from '../services/emailService';

export function registerAuthRoutes(app: any, apiPrefix: string): void {
  const router = Router();

  /**
   * @route   POST /api/v1/auth/register
   * @desc    Register a new user
   * @access  Public
   */
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { email, password, username, fullName } = req.body;

      // Check if required fields are provided
      if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, password, and username are required' });
      }

      // Check if user already exists
      const existingUserByEmail = await storage.getUserByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        username,
        fullName: fullName || null,
        role: 'user',
        isActive: true,
        isVerified: false,
      });

      // Generate token
      const token = generateToken(user);

      // Return user data and token
      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  /**
   * @route   POST /api/v1/auth/login
   * @desc    Authenticate user and get token
   * @access  Public
   */
  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Check if required fields are provided
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ error: 'Account is disabled' });
      }

      // Compare passwords
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check if 2FA is enabled
      if (user.isTwoFactorEnabled) {
        // Generate and send 2FA code
        const code = await storage.generateAndStoreTwoFactorCode(user.id);
        
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
          userId: user.id,
          eventType: '2fa_login_attempt',
          description: 'Two-factor authentication required for login',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: { email: user.email }
        });

        return res.json({
          success: false,
          requiresTwoFactor: true,
          userId: user.id,
          message: 'Please check your email for the verification code',
          email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email for security
        });
      }

      // Generate token
      const token = generateToken(user);

      // Create security log entry for successful login
      await db.insert(schema.securityLogs).values({
        userId: user.id,
        eventType: 'login',
        description: 'User logged in successfully',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      // Return user data and token
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          isTwoFactorEnabled: user.isTwoFactorEnabled
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  /**
   * @route   GET /api/v1/auth/me
   * @desc    Get current user
   * @access  Private
   */
  router.get('/me', authenticate, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      res.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          stripeCustomerId: user.stripeCustomerId
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user data' });
    }
  });

  /**
   * @route   POST /api/v1/auth/forgot-password
   * @desc    Request password reset
   * @access  Public
   */
  router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal that the user doesn't exist
        return res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Set token expiration time (1 hour)
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1);

      // Update user with reset token and expiration
      await storage.updateUser(user.id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });

      // TODO: Send email with reset link

      res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Failed to process password reset request' });
    }
  });

  /**
   * @route   POST /api/v1/auth/reset-password
   * @desc    Reset password with token
   * @access  Public
   */
  router.post('/reset-password', async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: 'Token and password are required' });
      }

      // Find user by reset token
      const [user] = await db.select()
        .from(schema.users)
        .where(
          and(
            eq(schema.users.resetPasswordToken, token),
            gt(schema.users.resetPasswordExpires, new Date())
          )
        );

      if (!user) {
        return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
      }

      // Hash new password
      const hashedPassword = await hashPassword(password);

      // Update user password and clear reset token
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });

      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  });

  /**
   * @route   POST /api/v1/auth/verify-2fa
   * @desc    Verify 2FA code and complete login
   * @access  Public
   */
  router.post('/verify-2fa', async (req: Request, res: Response) => {
    try {
      const { userId, code } = req.body;

      if (!userId || !code) {
        return res.status(400).json({ error: 'User ID and verification code are required' });
      }

      // Get user
      const user = await storage.getUser(parseInt(userId));
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify the code
      const isValid = await storage.verifyTwoFactorCode(parseInt(userId), code);
      
      if (!isValid) {
        // Create security log for failed verification
        await db.insert(schema.securityLogs).values({
          userId: parseInt(userId),
          eventType: '2fa_verification_failed',
          description: 'Two-factor authentication verification failed during login',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent'),
          metadata: { providedCode: code }
        });

        return res.status(400).json({ error: 'Invalid or expired verification code' });
      }

      // Generate token after successful 2FA verification
      const token = generateToken(user);

      // Create security log for successful login
      await db.insert(schema.securityLogs).values({
        userId: parseInt(userId),
        eventType: 'login',
        description: 'User logged in successfully with 2FA',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          isTwoFactorEnabled: user.isTwoFactorEnabled
        }
      });
    } catch (error) {
      console.error('2FA verification error:', error);
      res.status(500).json({ error: 'Failed to verify two-factor authentication' });
    }
  });

  /**
   * @route   POST /api/v1/auth/change-password
   * @desc    Change password while logged in
   * @access  Private
   */
  router.post('/change-password', authenticate, async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = (req as any).user;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      // Verify current password
      const isMatch = await comparePassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user password
      await storage.updateUser(user.id, { password: hashedPassword });

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  });

  // Register routes
  app.use(`${apiPrefix}/auth`, router);
}