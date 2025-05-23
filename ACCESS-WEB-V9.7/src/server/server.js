import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from '../api/auth.js';
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
import { handleStripeWebhook } from '../api/webhooks.js';
import { requireAdmin } from '../middleware/adminAuth.js';
import { requireAuth } from '../middleware/userAuth.js';
import { PrismaClient } from '@prisma/client';

// Create Prisma client
const prisma = new PrismaClient();

// Create Express app
const app = express();
const PORT = process.env.SERVER_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-app-domain.com'] 
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

// API Routes
app.use('/api/auth', authRouter);

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

// Start server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});