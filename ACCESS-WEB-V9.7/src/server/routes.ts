import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { db } from "./db";
import { storage } from "./storage";
import { registerAuthRoutes } from "./routes/auth";
import { registerUserRoutes } from "./routes/users";
import { registerContentRoutes } from "./routes/content";
import { registerCategoryRoutes } from "./routes/categories";
import { registerMenuRoutes } from "./routes/menus";
import { registerPaymentRoutes } from "./routes/payments";
import { registerScanRoutes } from "./routes/scans";
import { registerSettingRoutes } from "./routes/settings";
import { registerNotificationRoutes } from "./routes/notifications";
import { registerAdminRoutes } from "./routes/admin";

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    })
  : null;

/**
 * Register all API routes
 */
export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // API version prefix
  const apiPrefix = '/api/v1';
  
  // Basic health check route
  app.get('/api/health', (req, res) => {
    res.status(200).json({ 
      status: 'ok', 
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Stripe webhook handling
  if (stripe) {
    app.post('/api/webhooks/stripe', async (req, res) => {
      const sig = req.headers['stripe-signature'];
      
      if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(400).json({ error: 'Missing signature or webhook secret' });
      }
      
      try {
        const event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          process.env.STRIPE_WEBHOOK_SECRET
        );
        
        // Handle the event
        switch (event.type) {
          case 'checkout.session.completed':
            // Payment was successful
            const session = event.data.object;
            // Handle successful checkout
            break;
          case 'invoice.payment_succeeded':
            // Subscription payment succeeded
            const invoice = event.data.object;
            // Handle successful invoice payment
            break;
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
            // Subscription was updated or cancelled
            const subscription = event.data.object;
            // Handle subscription update/cancellation
            break;
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
        
        res.json({ received: true });
      } catch (err) {
        console.error('Error handling Stripe webhook:', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
      }
    });
  }

  // Register feature-specific routes
  registerAuthRoutes(app, apiPrefix);
  registerUserRoutes(app, apiPrefix);
  registerContentRoutes(app, apiPrefix);
  registerPaymentRoutes(app, apiPrefix, stripe);
  registerAdminRoutes(app, apiPrefix);
  
  // These routes will be implemented later as needed
  // registerCategoryRoutes(app, apiPrefix);
  // registerMenuRoutes(app, apiPrefix);
  // registerScanRoutes(app, apiPrefix);
  // registerSettingRoutes(app, apiPrefix);
  // registerNotificationRoutes(app, apiPrefix);

  return httpServer;
}