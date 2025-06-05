import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from '../api/auth.js';
import accessibilityRouter from '../api/accessibility.js';

// Enhanced logging utility
const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`);
    if (error) {
      console.error(`[${timestamp}] [ERROR] Stack:`, error.stack || error);
      console.error(`[${timestamp}] [ERROR] Details:`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
  },
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }
};
import { 
  getAllPricingPlans, 
  getAdminPricingPlans, 
  getPricingPlan, 
  createPricingPlan, 
  updatePricingPlan, 
  deletePricingPlan 
} from '../api/pricing-plans.js';
import {
  createAdminPricingPlan,
  updateAdminPricingPlan,
  deleteAdminPricingPlan
} from '../api/admin-pricing.js';
import {
  getUserSubscription,
  createPaymentIntent,
  getPaymentHistory
} from '../api/subscriptions.js';
// import siteScannerQueue from './jobs/siteScanner.js';
import { PrismaClient } from '@prisma/client';
import { cancelSubscription } from '../api/subscription-cancel.js';
import { handleStripeWebhook } from '../api/webhooks.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { requireAuth } from '../middleware/userAuth.js';
import { startSubscriptionExpiryChecker } from '../utils/subscriptionExpiry.js';

// Create Prisma client
const prisma = new PrismaClient();

// Create Express app
const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Validate critical environment variables
const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logger.error('Missing required environment variables', { missing: missingEnvVars });
  logger.error('Please set these environment variables in production');
}

// More permissive CORS for production debugging
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow all origins temporarily for debugging
    : ['http://localhost:5000', 'http://localhost:3001', 'http://localhost:5001', '*'],
  credentials: true
}));

// Enhanced request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined
  });
  
  // Log response
  const originalSend = res.send;
  res.send = function(body) {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.url} - ${res.statusCode}`, {
      duration: `${duration}ms`,
      statusCode: res.statusCode
    });
    
    if (res.statusCode >= 400) {
      logger.error(`Request failed: ${req.method} ${req.url}`, {
        statusCode: res.statusCode,
        body: body,
        duration: `${duration}ms`
      });
    }
    
    return originalSend.call(this, body);
  };
  
  next();
});

// Stripe webhook endpoint (must be before express.json() middleware)
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection test
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Health check passed - database connected');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    logger.error('Database connection error during health check', error);
    res.status(500).json({ status: 'error', database: 'disconnected', error: String(error) });
  }
});

// Import site connections router at the top
import siteConnectionsRouter from './routes/siteConnections.js';

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/accessibility', accessibilityRouter);
app.use('/api/site-connections', siteConnectionsRouter);

// Pricing Plans Routes
app.get('/api/pricing-plans', getAllPricingPlans); // Public endpoint - no auth needed
app.get('/api/pricing-plans/:id', getPricingPlan); // Public endpoint - no auth needed
app.post('/api/pricing-plans', createAdminPricingPlan); // Admin create endpoint - matches your payload
app.put('/api/pricing-plans/:id', updateAdminPricingPlan); // Admin update endpoint
app.delete('/api/pricing-plans/:id', deleteAdminPricingPlan); // Admin delete endpoint

// Protected Admin-only pricing plan endpoints
app.get('/api/admin/pricing-plans', requireAdmin, getAdminPricingPlans);
app.post('/api/admin/pricing-plans', requireAdmin, createPricingPlan);
app.put('/api/admin/pricing-plans/:id', requireAdmin, updatePricingPlan);
app.delete('/api/admin/pricing-plans/:id', requireAdmin, deletePricingPlan);

// Subscription Routes (protected for authenticated users)
app.get('/api/subscription', requireAuth, getUserSubscription);
app.post('/api/subscription/payment-intent', requireAuth, createPaymentIntent);
app.get('/api/subscription/payment-history', requireAuth, getPaymentHistory);
app.post('/api/subscription/cancel', requireAuth, cancelSubscription);

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

// Global error handler with enhanced logging
app.use((err, req, res, next) => {
  logger.error('Unhandled application error', {
    error: err.message,
    stack: err.stack,
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      headers: req.headers,
      body: req.body,
      params: req.params,
      query: req.query
    }
  });
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Promise Rejection', {
    reason: reason,
    promise: promise,
    stack: reason?.stack
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  
  // Graceful shutdown
  process.exit(1);
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
  logger.info(`API Server running on port ${PORT}`, {
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    host: '0.0.0.0',
    timestamp: new Date().toISOString()
  });
  
  logger.info('Environment configuration', {
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecretPresent: !!process.env.JWT_SECRET,
    databaseUrlPresent: !!process.env.DATABASE_URL,
    stripeKeysPresent: !!(process.env.STRIPE_SECRET_KEY && process.env.VITE_STRIPE_PUBLIC_KEY)
  });
  
  // Start automatic subscription expiry checker
  try {
    startSubscriptionExpiryChecker();
    logger.info('Subscription expiry checker started successfully');
  } catch (error) {
    logger.error('Failed to start subscription expiry checker', error);
  }
  
  // Initialize site scanner job queue (temporarily disabled)
  // try {
  //   await siteScannerQueue.initialize();
  //   logger.info('Site scanner job queue initialized successfully');
  // } catch (error) {
  //   logger.error('Failed to initialize site scanner job queue', error);
  // }
});