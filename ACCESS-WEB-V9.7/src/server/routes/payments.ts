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

  /**
   * @route   POST /api/v1/payments/webhooks/stripe
   * @desc    Handle Stripe webhook events
   * @access  Public
   */
  router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET is not set. Webhook events cannot be validated.');
      return res.status(400).send('Webhook secret not configured.');
    }

    try {
      // Verify webhook signature to ensure event is from Stripe
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      // Handle specific webhook events
      switch (event.type) {
        case 'payment_intent.succeeded':
          await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
          
        case 'payment_intent.payment_failed':
          await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;
          
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
          
        case 'customer.subscription.deleted':
          await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Return a 200 response to acknowledge receipt of the event
      res.json({ received: true });
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown Error'}`);
    }
  });
  
  // Helper functions for webhook events
  async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const userId = paymentIntent.metadata.userId;
    if (!userId) return;
    
    try {
      // Update user payment status or trigger any necessary actions after successful payment
      console.log(`Payment succeeded for user ${userId}. Payment Intent ID: ${paymentIntent.id}`);
      
      // Optional: Add custom notifications/emails for successful payments
      // Example: await storage.addNotification(userId, 'Payment successful');
    } catch (error) {
      console.error('Error handling payment success:', error);
    }
  }
  
  async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const userId = paymentIntent.metadata.userId;
    if (!userId) return;
    
    try {
      console.log(`Payment failed for user ${userId}. Payment Intent ID: ${paymentIntent.id}`);
      
      // Optional: Add notifications/emails for failed payments
      // Example: await storage.addNotification(userId, 'Payment failed');
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }
  
  async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    // Find user by customer ID
    try {
      const user = await storage.getUserByStripeCustomerId(subscription.customer as string);
      if (!user) return;
      
      // Update user subscription status
      await storage.updateUser(user.id, {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
      
      console.log(`Subscription ${subscription.status} for user ${user.id}`);
    } catch (error) {
      console.error('Error handling subscription update:', error);
    }
  }
  
  async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    try {
      const user = await storage.getUserByStripeCustomerId(subscription.customer as string);
      if (!user) return;
      
      // Update user subscription status
      await storage.updateUser(user.id, {
        subscriptionStatus: 'canceled',
        subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
      });
      
      console.log(`Subscription canceled for user ${user.id}`);
    } catch (error) {
      console.error('Error handling subscription deletion:', error);
    }
  }

  // Register routes
  app.use(`${apiPrefix}/payments`, router);
}