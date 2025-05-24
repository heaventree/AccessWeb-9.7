import { db } from '../server/db.js';
import { users, pricingPlans, payments } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Get user's current subscription
export async function getUserSubscription(req, res) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const [userWithSubscription] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!userWithSubscription) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // If user has no subscription, assign free plan
    if (!userWithSubscription.subscriptionPlan) {
      await db
        .update(users)
        .set({
          subscriptionPlan: 'free',
          subscriptionStatus: 'active',
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
      
      userWithSubscription.subscriptionPlan = 'free';
      userWithSubscription.subscriptionStatus = 'active';
    }

    res.json({
      success: true,
      data: {
        plan: userWithSubscription.subscriptionPlan,
        status: userWithSubscription.subscriptionStatus,
        stripeCustomerId: userWithSubscription.stripeCustomerId,
        stripeSubscriptionId: userWithSubscription.stripeSubscriptionId,
        currentPeriodEnd: userWithSubscription.currentPeriodEnd
      }
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error.message
    });
  }
}

// Create Stripe payment intent for plan upgrade
export async function createPaymentIntent(req, res) {
  try {
    const { planId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get the plan details from database
    const [plan] = await db
      .select()
      .from(pricingPlans)
      .where(eq(pricingPlans.id, planId));

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Using test keys for development

    // Import Stripe dynamically
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe('sk_test_51RSAoIRftwXmfGNuiNvmy0w53pb928VhlSZfAuuuMvGVvszyu87FBzUAJQDjaxEBD84ZhUD0NdsaYiXBi7SH7qYZ00Me4Zsbp0', {
      apiVersion: '2023-10-16',
    });

    // Get or create Stripe customer
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: userId.toString()
        }
      });
      
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await db
        .update(users)
        .set({
          stripeCustomerId: customerId,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId));
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(plan.price) * 100), // Convert to cents
      currency: plan.currency.toLowerCase(),
      customer: customerId,
      metadata: {
        planId: planId.toString(),
        userId: userId.toString(),
        planName: plan.name
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      plan: plan
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment intent',
      error: error.message
    });
  }
}

// Get payment history
export async function getPaymentHistory(req, res) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const userPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, userId))
      .orderBy(payments.createdAt);

    res.json({
      success: true,
      data: userPayments
    });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
}

// Verify payment after completion
async function verifyPayment(req, res) {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Import Stripe dynamically
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe('sk_test_51RSAoIRftwXmfGNuiNvmy0w53pb928VhlSZfAuuuMvGVvszyu87FBzUAJQDjaxEBD84ZhUD0NdsaYiXBi7SH7qYZ00Me4Zsbp0', {
      apiVersion: '2023-10-16',
    });

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Payment was successful, create subscription record
      const planId = paymentIntent.metadata.planId;
      const planName = paymentIntent.metadata.planName;

      // Get plan details
      const [plan] = await db
        .select()
        .from(pricingPlans)
        .where(eq(pricingPlans.id, parseInt(planId)));

      if (plan) {
        // Create or update subscription
        await db
          .insert(subscriptions)
          .values({
            userId: userId,
            planId: parseInt(planId),
            status: 'active',
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            stripeSubscriptionId: paymentIntent.id,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .onConflictDoUpdate({
            target: subscriptions.userId,
            set: {
              planId: parseInt(planId),
              status: 'active',
              currentPeriodStart: new Date(),
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              stripeSubscriptionId: paymentIntent.id,
              updatedAt: new Date()
            }
          });

        // Record payment in history
        await db
          .insert(payments)
          .values({
            userId: userId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency.toUpperCase(),
            status: 'completed',
            plan: planName || plan.name,
            stripePaymentId: paymentIntent.id,
            createdAt: new Date()
          });
      }

      res.json({
        success: true,
        payment: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          planName: planName || plan?.name
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
}

module.exports = {
  createPaymentIntent,
  getPaymentHistory,
  verifyPayment
};