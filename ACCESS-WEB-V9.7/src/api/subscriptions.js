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

    // For now, we'll need Stripe keys to proceed
    res.json({
      success: false,
      message: 'Stripe integration requires API keys. Please provide your Stripe credentials.',
      requiresStripeKeys: true,
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