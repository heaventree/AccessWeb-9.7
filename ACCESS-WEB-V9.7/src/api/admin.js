import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Middleware to verify admin authentication
const verifyAdminAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    let token = req.headers.authorization;
    
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    token = token.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Get user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId } 
    });

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Admin dashboard endpoint
router.get('/dashboard', verifyAdminAuth, async (req, res) => {
  try {
    // Get basic metrics from database
    const usersCount = await prisma.user.count();
    const activeUsersCount = await prisma.user.count({
      where: {
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    // Mock some additional metrics for now
    const metrics = {
      users: {
        total: usersCount,
        active: activeUsersCount
      },
      subscriptions: {
        total: 45,
        monthlyRecurringRevenue: 8500
      },
      content: {
        total: 156
      }
    };

    res.json({ metrics });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;