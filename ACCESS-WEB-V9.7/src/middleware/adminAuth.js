import jwt from 'jsonwebtoken';
import { db } from '../lib/db.js';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Middleware to verify admin authentication
export async function requireAdmin(req, res, next) {
  try {
    // Get token from authorization header or cookies
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin authentication required.'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database and verify admin status
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        isAdmin: users.isAdmin
      })
      .from(users)
      .where(eq(users.id, decoded.userId));

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Add user info to request for use in route handlers
    req.user = user;
    next();

  } catch (error) {
    console.error('Admin authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication verification failed.'
    });
  }
}