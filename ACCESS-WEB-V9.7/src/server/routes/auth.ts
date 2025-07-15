import { Router, Request, Response } from 'express';
import { and, eq, gt } from 'drizzle-orm';
import { storage } from '../storage';
import { db } from '../db';
import * as schema from '../../shared/schema';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { authenticate } from '../middleware/authMiddleware';

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

      // Generate token
      const token = generateToken(user);

      // Return user data and token
      res.json({
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