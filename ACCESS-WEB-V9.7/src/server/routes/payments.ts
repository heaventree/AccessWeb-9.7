import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';
import { authenticate } from '../middleware/authMiddleware';
import * as stripeUtils from '../utils/stripe';

export function registerPaymentRoutes(app: any, apiPrefix: string, stripe: Stripe | null): void {
  const router = Router();

  /**
   * @route   POST /api/v1/payments/create-payment-intent
   * @desc    Create a payment intent for one-time payments
   * @access  Private
   */
  router.post('/create-payment-intent', authenticate, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment service is currently unavailable' });
      }

      const { amount, currency = 'usd' } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Valid amount is required' });
      }

      const user = (req as any).user;

      // Ensure user has a Stripe customer ID
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        // Create a customer in Stripe
        const customer = await stripeUtils.createCustomer(user.email, user.fullName || user.username);
        
        if (!customer) {
          return res.status(500).json({ error: 'Failed to create customer' });
        }
        
        // Update user with Stripe customer ID
        customerId = customer.id;
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      // Create payment intent
      const paymentIntent = await stripeUtils.createPaymentIntent(
        Math.round(amount * 100), // Convert to cents
        currency,
        customerId
      );

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      });
    } catch (error) {
      console.error('Payment intent error:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
    }
  });

  /**
   * @route   POST /api/v1/payments/create-subscription
   * @desc    Create or retrieve a subscription
   * @access  Private
   */
  router.post('/create-subscription', authenticate, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment service is currently unavailable' });
      }

      const { priceId } = req.body;

      if (!priceId) {
        return res.status(400).json({ error: 'Price ID is required' });
      }

      const user = (req as any).user;

      // Ensure user has a Stripe customer ID
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        // Create a customer in Stripe
        const customer = await stripeUtils.createCustomer(user.email, user.fullName || user.username);
        
        if (!customer) {
          return res.status(500).json({ error: 'Failed to create customer' });
        }
        
        // Update user with Stripe customer ID
        customerId = customer.id;
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      // Create or retrieve subscription
      const subscription = await stripeUtils.createOrRetrieveSubscription(customerId, priceId);

      // Update user with subscription ID if it's a new subscription
      if (!user.stripeSubscriptionId || user.stripeSubscriptionId !== subscription.id) {
        await storage.updateUser(user.id, { 
          stripeSubscriptionId: subscription.id,
          subscriptionStatus: subscription.status
        });
      }

      // Return the client secret for payment if needed
      const clientSecret = subscription.latest_invoice?.payment_intent?.client_secret;

      res.json({
        subscriptionId: subscription.id,
        clientSecret,
        status: subscription.status
      });
    } catch (error) {
      console.error('Subscription error:', error);
      res.status(500).json({ error: 'Failed to create subscription' });
    }
  });

  /**
   * @route   POST /api/v1/payments/cancel-subscription
   * @desc    Cancel a subscription
   * @access  Private
   */
  router.post('/cancel-subscription', authenticate, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment service is currently unavailable' });
      }

      const user = (req as any).user;

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ error: 'No active subscription found' });
      }

      // Cancel subscription
      const canceledSubscription = await stripeUtils.cancelSubscription(user.stripeSubscriptionId);

      // Update user record
      await storage.updateUser(user.id, {
        subscriptionStatus: canceledSubscription.status,
      });

      res.json({
        message: 'Subscription cancelled successfully',
        canceledAt: canceledSubscription.canceled_at
      });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  });

  /**
   * @route   GET /api/v1/payments/subscription-status
   * @desc    Get current subscription status
   * @access  Private
   */
  router.get('/subscription-status', authenticate, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment service is currently unavailable' });
      }

      const user = (req as any).user;

      if (!user.stripeSubscriptionId) {
        return res.json({ status: 'no_subscription' });
      }

      // Get subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

      // Update subscription status if needed
      if (user.subscriptionStatus !== subscription.status) {
        await storage.updateUser(user.id, {
          subscriptionStatus: subscription.status
        });
      }

      res.json({
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      });
    } catch (error) {
      console.error('Subscription status error:', error);
      res.status(500).json({ error: 'Failed to get subscription status' });
    }
  });

  /**
   * @route   GET /api/v1/payments/payment-methods
   * @desc    Get user's payment methods
   * @access  Private
   */
  router.get('/payment-methods', authenticate, async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment service is currently unavailable' });
      }

      const user = (req as any).user;

      if (!user.stripeCustomerId) {
        return res.json({ paymentMethods: [] });
      }

      // Get payment methods from Stripe
      const paymentMethods = await stripeUtils.getPaymentMethods(user.stripeCustomerId);

      res.json({ paymentMethods });
    } catch (error) {
      console.error('Payment methods error:', error);
      res.status(500).json({ error: 'Failed to get payment methods' });
    }
  });

  // Register routes
  app.use(`${apiPrefix}/payments`, router);
}