import jwt from "jsonwebtoken";
import { db } from "../lib/db.js";
// Users are handled by Prisma User model
import { eq } from "drizzle-orm";

// Middleware to verify admin authentication
export async function requireAdmin(req, res, next) {
  try {
    // Get token from authorization header or cookies
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;

    const token = authHeader?.replace("Bearer ", "") || cookieToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Admin authentication required.",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
    );

    // Get user from database using Prisma and verify admin status
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        isAdmin: true
      }
    });
    
    await prisma.$disconnect();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token456. User not found.",
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    // Add user info to request for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication verification failed.",
    });
  }
}
