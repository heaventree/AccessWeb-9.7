import jwt from 'jsonwebtoken';
import { db } from '../server/db.js';
import { users } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Middleware to verify user authentication (for any authenticated user)
export async function requireAuth(req, res, next) {
  try {
    // Get token from authorization header or cookies
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;
    
    const token = authHeader?.replace('Bearer ', '') || cookieToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
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

    // Add user info to request for use in route handlers
    req.user = user;
    next();

  } catch (error) {
    console.error('User authentication error:', error);
    
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