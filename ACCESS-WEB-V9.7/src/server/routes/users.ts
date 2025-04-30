import { Router, Request, Response } from 'express';
import { storage } from '../storage';
import { db } from '../db';
import * as schema from '../../shared/schema';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { hashPassword } from '../utils/auth';

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

  // Register routes
  app.use(`${apiPrefix}/users`, router);
}