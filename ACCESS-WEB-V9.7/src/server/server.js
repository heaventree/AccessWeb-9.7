import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from '../api/auth.js';
import accessibilityRouter from '../api/accessibility.js';
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
import { cancelSubscription } from '../api/subscription-cancel.js';
import { handleStripeWebhook } from '../api/webhooks.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { requireAuth } from '../middleware/userAuth.js';
import { PrismaClient } from '@prisma/client';
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
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please set these environment variables in production');
}

// More permissive CORS for production debugging
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow all origins temporarily for debugging
    : ['http://localhost:5000', 'http://localhost:3001', 'http://localhost:5001', '*'],
  credentials: true
}));

// Add middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
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
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database connection error:', error);
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

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error('Stack:', err.stack);
  console.error('Request:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body
  });
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('JWT_SECRET present:', !!process.env.JWT_SECRET);
  console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);
  
  // Start automatic subscription expiry checker
  startSubscriptionExpiryChecker();
});