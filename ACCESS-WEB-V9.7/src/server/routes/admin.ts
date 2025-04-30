import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { getStripeInstance } from '../utils/stripe';

export function registerAdminRoutes(app: any, apiPrefix: string): void {
  const router = Router();
  const stripe = getStripeInstance();

  // Check that all admin routes require authentication and admin role
  router.use(authenticate, authorize(['admin']));

  /**
   * @route   GET /api/v1/admin/subscriptions
   * @desc    Get all subscriptions
   * @access  Private/Admin
   */
  router.get('/subscriptions', async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Stripe service is not available' });
      }

      // Get all users with subscriptions
      const usersWithSubscriptions = await storage.getUsersWithSubscriptions();

      // Fetch detailed subscription information from Stripe
      const subscriptionsPromises = usersWithSubscriptions.map(async (user) => {
        if (!user.stripeSubscriptionId) {
          return null;
        }

        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
            expand: ['default_payment_method', 'items.data.price.product']
          });

          // Extract plan information from the subscription
          const plan = subscription.items.data[0]?.price;
          
          return {
            id: subscription.id,
            customerId: subscription.customer,
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            plan: {
              id: plan?.id,
              name: plan?.nickname || 'Standard Plan',
              amount: plan?.unit_amount || 0,
              interval: plan?.recurring?.interval || 'month'
            },
            user: {
              id: user.id,
              email: user.email,
              username: user.username
            }
          };
        } catch (error) {
          console.error(`Error fetching subscription ${user.stripeSubscriptionId}:`, error);
          return null;
        }
      });

      const subscriptionsData = await Promise.all(subscriptionsPromises);
      const subscriptions = subscriptionsData.filter(Boolean);

      res.json({ subscriptions });
    } catch (error) {
      console.error('Admin subscriptions error:', error);
      res.status(500).json({ error: 'Failed to fetch subscriptions' });
    }
  });

  /**
   * @route   GET /api/v1/admin/subscriptions/:id
   * @desc    Get subscription by ID
   * @access  Private/Admin
   */
  router.get('/subscriptions/:id', async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Stripe service is not available' });
      }

      const { id } = req.params;

      // Fetch subscription from Stripe
      const subscription = await stripe.subscriptions.retrieve(id, {
        expand: ['default_payment_method', 'latest_invoice', 'customer', 'items.data.price.product']
      });

      // Find user with this subscription
      const user = await storage.getUserByStripeSubscriptionId(id);

      if (!user) {
        return res.status(404).json({ error: 'No user found with this subscription' });
      }

      // Extract plan information
      const plan = subscription.items.data[0]?.price;

      // Format subscription data
      const subscriptionData = {
        id: subscription.id,
        customer: {
          id: subscription.customer,
          email: (subscription.customer as Stripe.Customer).email,
          name: (subscription.customer as Stripe.Customer).name
        },
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000).toISOString(),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
        plan: {
          id: plan?.id,
          name: plan?.nickname || 'Standard Plan',
          amount: plan?.unit_amount || 0,
          interval: plan?.recurring?.interval || 'month',
          currency: plan?.currency || 'usd'
        },
        latestInvoice: subscription.latest_invoice ? {
          id: (subscription.latest_invoice as Stripe.Invoice).id,
          status: (subscription.latest_invoice as Stripe.Invoice).status,
          amount: (subscription.latest_invoice as Stripe.Invoice).amount_due,
          created: new Date((subscription.latest_invoice as Stripe.Invoice).created * 1000).toISOString(),
          hostedInvoiceUrl: (subscription.latest_invoice as Stripe.Invoice).hosted_invoice_url
        } : null,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      };

      res.json({ subscription: subscriptionData });
    } catch (error) {
      console.error('Admin subscription details error:', error);
      res.status(500).json({ error: 'Failed to fetch subscription details' });
    }
  });

  /**
   * @route   POST /api/v1/admin/subscriptions/:id/cancel
   * @desc    Cancel a subscription
   * @access  Private/Admin
   */
  router.post('/subscriptions/:id/cancel', async (req: Request, res: Response) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Stripe service is not available' });
      }

      const { id } = req.params;
      const { cancelImmediately = false } = req.body;

      // Fetch user with this subscription
      const user = await storage.getUserByStripeSubscriptionId(id);

      if (!user) {
        return res.status(404).json({ error: 'No user found with this subscription' });
      }

      // Cancel the subscription
      const canceledSubscription = await stripe.subscriptions.update(id, {
        cancel_at_period_end: !cancelImmediately,
      });

      if (cancelImmediately) {
        await stripe.subscriptions.cancel(id);
      }

      // Update user record
      await storage.updateUser(user.id, {
        subscriptionStatus: cancelImmediately ? 'canceled' : canceledSubscription.status
      });

      res.json({
        message: cancelImmediately 
          ? 'Subscription canceled immediately'
          : 'Subscription will be canceled at the end of the billing period',
        subscription: {
          id: canceledSubscription.id,
          status: cancelImmediately ? 'canceled' : canceledSubscription.status,
          cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end
        }
      });
    } catch (error) {
      console.error('Admin cancel subscription error:', error);
      res.status(500).json({ error: 'Failed to cancel subscription' });
    }
  });

  /**
   * @route   GET /api/v1/admin/dashboard
   * @desc    Get admin dashboard data
   * @access  Private/Admin
   */
  router.get('/dashboard', async (req: Request, res: Response) => {
    try {
      // Get counts
      const usersCount = await storage.getUsersCount();
      const activeSubscriptionsCount = await storage.getActiveSubscriptionsCount();
      
      // You can add more relevant metrics for the admin dashboard here
      const metrics = {
        users: {
          total: usersCount,
          active: await storage.getActiveUsersCount()
        },
        subscriptions: {
          total: activeSubscriptionsCount,
          monthlyRecurringRevenue: await storage.getMonthlyRecurringRevenue()
        },
        content: {
          total: await storage.getContentCount()
        }
      };

      res.json({ metrics });
    } catch (error) {
      console.error('Admin dashboard error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Register routes
  app.use(`${apiPrefix}/admin`, router);
}