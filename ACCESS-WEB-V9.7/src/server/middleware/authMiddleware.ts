import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromRequest } from '../utils/auth';
import { storage } from '../storage';

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from request
    const token = extractTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Check if user exists
    const user = await storage.getUser(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ error: 'User account is disabled' });
    }
    
    // Attach user to request object
    (req as any).user = user;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Authorization middleware to check user roles
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};