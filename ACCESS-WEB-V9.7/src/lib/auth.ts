import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

// Define types
interface AuthRequest extends Request {
  user?: any;
}

// Middleware to protect routes
export const authenticateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from cookies
    const token = req.cookies.accessToken;
    
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { userId: number };
    
    // Get user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId } 
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Not authenticated' });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};