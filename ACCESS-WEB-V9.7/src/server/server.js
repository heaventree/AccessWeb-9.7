import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import authRouter from "../api/auth.js";
import accessibilityRouter from "../api/accessibility.js";
import nodemailer from 'nodemailer';

// Configure email transporter for 2FA codes
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Enhanced logging utility
const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] [INFO] ${message}`,
      data ? JSON.stringify(data, null, 2) : "",
    );
  },
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`);
    if (error) {
      console.error(`[${timestamp}] [ERROR] Stack:`, error.stack || error);
      console.error(
        `[${timestamp}] [ERROR] Details:`,
        JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      );
    }
  },
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(
      `[${timestamp}] [WARN] ${message}`,
      data ? JSON.stringify(data, null, 2) : "",
    );
  },
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      console.log(
        `[${timestamp}] [DEBUG] ${message}`,
        data ? JSON.stringify(data, null, 2) : "",
      );
    }
  },
};
import {
  getAllPricingPlans,
  getAdminPricingPlans,
  getPricingPlan,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
} from "../api/pricing-plans.js";
import {
  createAdminPricingPlan,
  updateAdminPricingPlan,
  deleteAdminPricingPlan,
} from "../api/admin-pricing.js";
import {
  getUserSubscription,
  createPaymentIntent,
  getPaymentHistory,
  verifyPayment,
} from "../api/subscriptions.js";
// import siteScannerQueue from './jobs/siteScanner.js';
import { PrismaClient } from "@prisma/client";
import { cancelSubscription } from "../api/subscription-cancel.js";
import { handleStripeWebhook } from "../api/webhooks.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { requireAuth } from "../middleware/userAuth.js";
import { startSubscriptionExpiryChecker } from "../utils/subscriptionExpiry.js";
import { hashPassword, verifyPassword } from "../utils/passwordUtils.js";

// Create Prisma client
const prisma = new PrismaClient();

// Create Express app
const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Validate critical environment variables
const requiredEnvVars = ["JWT_SECRET", "DATABASE_URL"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  logger.error("Missing required environment variables", {
    missing: missingEnvVars,
  });
  logger.error("Please set these environment variables in production");
}

// More permissive CORS for production debugging
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true // Allow all origins temporarily for debugging
        : [
            `http://localhost:${process.env.PORT || 5000}`,
            "http://localhost:3001",
            "http://localhost:5001",
            "*",
          ],
    credentials: true,
  }),
);

// Enhanced request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();

  // Log incoming request
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    body: req.method === "POST" || req.method === "PUT" ? req.body : undefined,
  });

  // Log response
  const originalSend = res.send;
  res.send = function (body) {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.url} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      statusCode: res.statusCode,
    });

    if (res.statusCode >= 400) {
      logger.error(`Request failed: ${req.method} ${req.url}`, {
        statusCode: res.statusCode,
        body: body,
        duration: `${duration}ms`,
      });
    }

    return originalSend.call(this, body);
  };

  next();
});

// Stripe webhook endpoint (must be before express.json() middleware)
app.post(
  "/api/webhooks/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

// Parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection test
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Health check passed - database connected");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    logger.error("Database connection error during health check", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: String(error),
    });
  }
});

// Import site connections router at the top
import siteConnectionsRouter from "./routes/siteConnections.js";

// Import scanner routes
import scannerRouter from "./routes/scanner.js";

// Import WordPress routes
import wordpressRouter from "./routes/wordpress.js";

// Import and initialize job queue system
import siteScannerQueue from "./jobs/siteScanner.js";

// Import admin routes
import adminRouter from "./routes/admin.js";

// Import API key and public API routes
import apiKeysRouter from "./routes/apiKeys.js";
import publicApiRouter from "./routes/publicApi.js";

// API Routes - Move AI suggestions before accessibility router to avoid conflicts
app.use("/api/auth", authRouter);

// Debug: Add logging to verify accessibility router mounting
console.log("Mounting accessibility router at /api/accessibility");
app.use("/api/accessibility", accessibilityRouter);
console.log("Accessibility router mounted successfully");
app.use("/api/site-connections", siteConnectionsRouter);
app.use("/api/scanner", scannerRouter);
app.use("/api/wordpress", wordpressRouter);
app.use("/api/admin", requireAuth, adminRouter);

// API Key management routes (protected)
app.use("/api/user", requireAuth, apiKeysRouter);

// Public API routes (API key authenticated)
app.use("/api/public", publicApiRouter);

// WordPress Plugin Download Route
app.get("/api/wordpress/plugin/download", (req, res) => {
  const pluginPath = path.join(
    __dirname,
    "../../server/assets/plugins/wordpress-plugin.zip",
  );

  // Check if file exists
  if (!fs.existsSync(pluginPath)) {
    logger.error("WordPress plugin file not found", { path: pluginPath });
    return res.status(404).json({
      success: false,
      error: "Plugin file not found. Please contact support.",
    });
  }

  try {
    // Set appropriate headers for file download
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="wordpress-accessibility-plugin.zip"',
    );
    res.setHeader("Cache-Control", "no-cache");

    // Get file stats for content length
    const stats = fs.statSync(pluginPath);
    res.setHeader("Content-Length", stats.size);

    logger.info("WordPress plugin download initiated", {
      fileSize: stats.size,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });

    // Stream the file
    const fileStream = fs.createReadStream(pluginPath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      logger.error("Error streaming plugin file", error);
      if (!res.headersSent) {
        res
          .status(500)
          .json({ success: false, error: "Error downloading file" });
      }
    });

    fileStream.on("end", () => {
      logger.info("WordPress plugin download completed successfully");
    });
  } catch (error) {
    logger.error("Error serving plugin download", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Pricing Plans Routes
app.get("/api/pricing-plans", getAllPricingPlans); // Public endpoint - no auth needed
app.get("/api/pricing-plans/:id", getPricingPlan); // Public endpoint - no auth needed
app.post("/api/pricing-plans", createAdminPricingPlan); // Admin create endpoint - matches your payload
app.put("/api/pricing-plans/:id", updateAdminPricingPlan); // Admin update endpoint
app.delete("/api/pricing-plans/:id", deleteAdminPricingPlan); // Admin delete endpoint

// Protected Admin-only pricing plan endpoints
app.get("/api/admin/pricing-plans", requireAdmin, getAdminPricingPlans);
app.post("/api/admin/pricing-plans", requireAdmin, createPricingPlan);
app.put("/api/admin/pricing-plans/:id", requireAdmin, updatePricingPlan);
app.delete("/api/admin/pricing-plans/:id", requireAdmin, deletePricingPlan);

// Subscription Routes (protected for authenticated users)
app.get("/api/subscription", requireAuth, getUserSubscription);
app.post("/api/subscription/payment-intent", requireAuth, createPaymentIntent);
app.get("/api/subscription/payment-history", requireAuth, getPaymentHistory);
app.post("/api/subscription/verify-payment", requireAuth, verifyPayment);
app.post("/api/subscription/cancel", requireAuth, cancelSubscription);

// User Profile Routes
app.put("/api/v1/users/:id", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.user;
    console.log(
      "<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>",
    );

    // Check if user is updating their own data or is an admin
    if (currentUser.id !== userId && !currentUser.isAdmin) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { name, email, timezone } = req.body;

    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Build update object
    const updateData = {};

    if (name !== undefined) {
      updateData.name = name; // Use 'name' field that exists in schema
    }

    if (email !== undefined && email !== user.email) {
      // Check if email is already in use
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ error: "Email already in use" });
      }
      updateData.email = email;
    }

    // Handle timezone updates
    if (timezone !== undefined) {
      updateData.timezone = timezone;
    }

    // Update user if there are changes
    if (Object.keys(updateData).length > 0) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      // Don't return sensitive data
      const { password, ...userData } = updatedUser;

      res.json({ user: userData, message: "User updated successfully" });
    } else {
      // Don't return sensitive data
      const { password, ...userData } = user;

      res.json({ user: userData, message: "No changes were made" });
    }
  } catch (error) {
    logger.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Change password endpoint
app.put("/api/v1/users/:id/change-password", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.user;
    
    // Check if user is updating their own password
    if (currentUser.id !== userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: "Current password and new password are required" 
      });
    }

    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password in database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    // Create security log entry
    await prisma.securityLog.create({
      data: {
        userId: userId,
        eventType: "password_change",
        description: "Password changed successfully",
        ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
        userAgent: req.get("User-Agent"),
        metadata: {
          timestamp: new Date().toISOString(),
          success: true
        }
      }
    });

    logger.info(`Password changed successfully for user ${userId}`);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    logger.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Site Scanner Job Queue Routes (temporarily disabled)
// app.get('/api/scanner/stats', requireAuth, async (req, res) => {
//   try {
//     const stats = await siteScannerQueue.getJobStats();
//     res.json({ success: true, data: stats });
//   } catch (error) {
//     logger.error('Failed to get scanner stats', error);
//     res.status(500).json({ success: false, error: 'Failed to get scanner stats' });
//   }
// });

// app.post('/api/scanner/trigger/:connectionId', requireAuth, async (req, res) => {
//   try {
//     const connectionId = parseInt(req.params.connectionId);
//     const userId = req.user.id;

//     // Verify connection belongs to user
//     const connection = await prisma.siteConnection.findFirst({
//       where: { id: connectionId, userId: userId }
//     });

//     if (!connection) {
//       return res.status(404).json({ success: false, error: 'Site connection not found' });
//     }

//     // Trigger immediate scan
//     const jobData = {
//       connectionId: connection.id,
//       userId: connection.userId,
//       siteName: connection.siteName,
//       siteUrl: connection.siteUrl,
//       platform: connection.platform,
//       frequency: 'manual'
//     };

//     await siteScannerQueue.boss.send('site-accessibility-scan', jobData);

//     res.json({
//       success: true,
//       message: 'Manual scan triggered successfully',
//       data: { connectionId, siteName: connection.siteName }
//     });

//   } catch (error) {
//     logger.error('Failed to trigger manual scan', error);
//     res.status(500).json({ success: false, error: 'Failed to trigger scan' });
//   }
// });

// Two-factor authentication endpoints
app.put("/api/v1/users/:id/two-factor", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.user;
    const { isTwoFactorEnabled } = req.body;

    // Check if user is updating their own settings
    if (currentUser.id !== userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If enabling 2FA, send confirmation email first (don't update database yet)
    if (isTwoFactorEnabled && !user.isTwoFactorEnabled) {
      // Generate and store verification code for 2FA setup
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorCode: code,
          twoFactorCodeExpiry: expiry
        }
      });
      
      // Send setup confirmation email
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: 'Verify Two-Factor Authentication Setup',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h2 style="color: #0fae96;">🔒 Two-Factor Authentication Setup</h2>
            <p>Hello ${user.name || user.email},</p>
            <p>You've requested to <strong>enable two-factor authentication</strong> on your Access Checker account. To confirm this action and protect against accidental lockouts, please enter the verification code below:</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #0fae96; letter-spacing: 8px;">${code}</span>
            </div>
            <div style="background: #e0f2fe; border: 1px solid #0369a1; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #0369a1; font-size: 14px;">
                <strong>ℹ️ Important:</strong> Once enabled, you'll need a verification code sent to this email address each time you log in. Make sure you have access to this email account.
              </p>
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this change, please ignore this email and check your account security.</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`2FA Setup email sent successfully to ${user.email}`);
      } catch (emailError) {
        console.error('Failed to send 2FA setup email:', emailError);
        // If email failed to send, clear the code from database and return error
        await prisma.user.update({
          where: { id: userId },
          data: {
            twoFactorCode: null,
            twoFactorCodeExpiry: null
          }
        });
        return res.status(500).json({ error: 'Failed to send verification email. Please try again.' });
      }
      
      // Return success but don't update 2FA status yet
      return res.json({
        success: true,
        requiresVerification: true,
        message: 'Verification code sent to your email. Please check your inbox and confirm to enable two-factor authentication.',
        email: user.email.replace(/(.{2}).*(@.*)/, '$1***$2') // Mask email for security
      });
    }

    // If disabling 2FA, update directly (no email confirmation needed)
    if (!isTwoFactorEnabled && user.isTwoFactorEnabled) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          isTwoFactorEnabled: false,
          twoFactorCode: null,
          twoFactorCodeExpiry: null
        }
      });

      // Create security log entry
      await prisma.securityLog.create({
        data: {
          userId: userId,
          eventType: '2fa_disabled',
          description: 'Two-factor authentication disabled',
          ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
          userAgent: req.get('User-Agent'),
          metadata: { isTwoFactorEnabled: false }
        }
      });

      return res.json({
        success: true,
        message: 'Two-factor authentication disabled successfully',
        isTwoFactorEnabled: false
      });
    }

    // If trying to enable when already enabled, or disable when already disabled
    res.json({
      success: true,
      message: `Two-factor authentication is already ${isTwoFactorEnabled ? 'enabled' : 'disabled'}`,
      isTwoFactorEnabled: user.isTwoFactorEnabled
    });
  } catch (error) {
    logger.error("Update 2FA settings error:", error);
    res.status(500).json({ error: "Failed to update two-factor authentication settings" });
  }
});

app.post("/api/v1/users/:id/two-factor/verify-setup", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.user;
    const { code } = req.body;

    // Check if user is verifying their own account
    if (currentUser.id !== userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    if (!code) {
      return res.status(400).json({ error: "Verification code is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't allow verification if 2FA is already enabled
    if (user.isTwoFactorEnabled) {
      return res.status(400).json({ error: "Two-factor authentication is already enabled" });
    }

    // Verify the code
    const now = new Date();
    const isValid = user.twoFactorCode === code && 
                   user.twoFactorCodeExpiry && 
                   user.twoFactorCodeExpiry > now;
    
    if (!isValid) {
      // Create security log for failed verification attempt
      await prisma.securityLog.create({
        data: {
          userId: userId,
          eventType: '2fa_setup_failed',
          description: 'Failed attempt to verify two-factor authentication setup',
          ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
          userAgent: req.get('User-Agent'),
          metadata: { providedCode: code }
        }
      });

      return res.status(400).json({ error: "Invalid or expired verification code" });
    }

    // Code is valid, now enable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: true,
        twoFactorCode: null,  // Clear the setup code
        twoFactorCodeExpiry: null
      }
    });

    // Create security log entry for successful 2FA enablement
    await prisma.securityLog.create({
      data: {
        userId: userId,
        eventType: '2fa_enabled',
        description: 'Two-factor authentication enabled successfully',
        ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
        userAgent: req.get('User-Agent'),
        metadata: { isTwoFactorEnabled: true }
      }
    });

    res.json({
      success: true,
      message: 'Two-factor authentication has been successfully enabled for your account',
      isTwoFactorEnabled: true
    });
  } catch (error) {
    logger.error("Verify 2FA setup error:", error);
    res.status(500).json({ error: "Failed to verify two-factor authentication setup" });
  }
});

// Get security logs endpoint
app.get("/api/v1/users/:id/security-logs", requireAuth, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const currentUser = req.user;
    
    // Check if user is accessing their own security logs
    if (currentUser.id !== userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Get security logs for the user
    const securityLogs = await prisma.securityLog.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 entries
    });

    logger.info(`Retrieved ${securityLogs.length} security logs for user ${userId}`);
    res.json({ securityLogs });
  } catch (error) {
    logger.error("Get security logs error:", error);
    res.status(500).json({ error: "Failed to retrieve security logs" });
  }
});

// Global error handler with enhanced logging
app.use((err, req, res, next) => {
  logger.error("Unhandled application error", {
    error: err.message,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query,
    },
  });

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
    timestamp: new Date().toISOString(),
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Promise Rejection", {
    reason: reason,
    promise: promise,
    stack: reason?.stack,
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });

  // Graceful shutdown
  process.exit(1);
});

// Start server
app.listen(PORT, "0.0.0.0", async () => {
  logger.info(`API Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV || "development",
    port: PORT,
    host: "0.0.0.0",
    timestamp: new Date().toISOString(),
  });

  logger.info("Environment configuration", {
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecretPresent: !!process.env.JWT_SECRET,
    databaseUrlPresent: !!process.env.DATABASE_URL,
    stripeKeysPresent: !!(
      process.env.STRIPE_SECRET_KEY && process.env.VITE_STRIPE_PUBLIC_KEY
    ),
  });

  // Start automatic subscription expiry checker
  try {
    startSubscriptionExpiryChecker();
    logger.info("Subscription expiry checker started successfully");
  } catch (error) {
    logger.error("Failed to start subscription expiry checker", error);
  }

  // Initialize site scanner job queue
  try {
    await siteScannerQueue.initialize();
    logger.info("Site scanner job queue initialized successfully");
  } catch (error) {
    logger.error("Failed to initialize site scanner job queue", error);
  }
});
