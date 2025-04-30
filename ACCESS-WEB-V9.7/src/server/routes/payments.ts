import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import { authenticate } from '../middleware/authMiddleware';
import { storage } from '../storage';
import { errorHandler } from '../utils/errorHandler';

/**
 * Register payment routes for subscription and billing management
 * @param app Express application
 * @param apiPrefix API prefix for all routes
 * @param stripe Stripe instance
 */
export function registerPaymentRoutes(app: any, apiPrefix: string, stripe: Stripe | null): void {
  // Skip registering routes if Stripe is not configured
  if (!stripe) {
    console.warn('Stripe is not configured. Payment routes will not be registered.');
    return;
  }

  const router = express.Router();

  /**
   * @route   POST /api/v1/payments/create-payment-intent
   * @desc    Create a payment intent for one-time payments
   * @access  Private
   */
  router.post('/create-payment-intent', authenticate, async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          userId: req.user?.id?.toString() || '',
        },
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      errorHandler(err, req, res, 'create_payment_intent_error');
    }
  });

  /**
   * @route   POST /api/v1/payments/create-subscription
   * @desc    Create or retrieve a subscription
   * @access  Private
   */
  router.post('/create-subscription', authenticate, async (req: Request, res: Response) => {
    try {
      const { priceId } = req.body;
      
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if user already has a subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        if (subscription.status !== 'canceled') {
          return res.json({
            subscriptionId: subscription.id,
            clientSecret: (subscription.latest_invoice as Stripe.Invoice).payment_intent?.client_secret,
          });
        }
      }

      // Create or get customer
      let customerId = user.stripeCustomerId;
      
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          name: user.username,
          metadata: {
            userId: user.id.toString(),
          },
        });
        
        customerId = customer.id;
        
        // Update user with Stripe customer ID
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId || process.env.STRIPE_DEFAULT_PRICE_ID,
          },
        ],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription ID
      await storage.updateUser(user.id, { stripeSubscriptionId: subscription.id });

      // Return the subscription and client secret
      res.json({
        subscriptionId: subscription.id,
        clientSecret: (subscription.latest_invoice as Stripe.Invoice).payment_intent?.client_secret,
      });
    } catch (err) {
      errorHandler(err, req, res, 'create_subscription_error');
    }
  });

  /**
   * @route   POST /api/v1/payments/cancel-subscription
   * @desc    Cancel a subscription
   * @access  Private
   */
  router.post('/cancel-subscription', authenticate, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ error: 'No active subscription found' });
      }

      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      res.json({
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      });
    } catch (err) {
      errorHandler(err, req, res, 'cancel_subscription_error');
    }
  });

  /**
   * @route   GET /api/v1/payments/subscription-status
   * @desc    Get current subscription status
   * @access  Private
   */
  router.get('/subscription-status', authenticate, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If no subscription ID, return no subscription
      if (!user.stripeSubscriptionId) {
        return res.json({ status: 'no_subscription' });
      }

      // Get subscription details from Stripe
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

      res.json({
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        priceId: subscription.items.data[0]?.price.id,
      });
    } catch (err) {
      errorHandler(err, req, res, 'subscription_status_error');
    }
  });

  /**
   * @route   GET /api/v1/payments/payment-methods
   * @desc    Get user's payment methods
   * @access  Private
   */
  router.get('/payment-methods', authenticate, async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      
      const user = await storage.getUser(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // If no customer ID, return empty list
      if (!user.stripeCustomerId) {
        return res.json({ paymentMethods: [] });
      }

      // Get payment methods from Stripe
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
      });

      res.json({ paymentMethods: paymentMethods.data });
    } catch (err) {
      errorHandler(err, req, res, 'payment_methods_error');
    }
  });

  // Register routes
  app.use(`${apiPrefix}/payments`, router);
}