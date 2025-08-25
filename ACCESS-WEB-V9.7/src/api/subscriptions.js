import { PrismaClient } from '@prisma/client';
import { notificationService } from '../server/services/notificationService.js';

const prisma = new PrismaClient();

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

    const userWithSubscription = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        currentPeriodEnd: true
      }
    });

    if (!userWithSubscription) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if subscription has expired automatically
    const now = new Date();
    let needsUpdate = false;
    let updateData = {};

    // Auto-expire subscription if past end date (for both active and canceled subscriptions)
    if (userWithSubscription.currentPeriodEnd && 
        new Date(userWithSubscription.currentPeriodEnd) < now &&
        (userWithSubscription.subscriptionStatus === 'active' || userWithSubscription.subscriptionStatus === 'canceled')) {
      updateData.subscriptionStatus = 'expired';
      needsUpdate = true;
    }

    // If user has no subscription, assign free plan
    if (!userWithSubscription.subscriptionPlan) {
      updateData.subscriptionPlan = 'free';
      updateData.subscriptionStatus = 'active';
      needsUpdate = true;
    }

    // Apply any needed updates
    if (needsUpdate) {
      await prisma.user.update({
        where: { id: userId },
        data: updateData
      });
      
      // Update local object
      Object.assign(userWithSubscription, updateData);
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
    const plan = await prisma.pricingPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found'
      });
    }

    // Using test keys for development

    // Import Stripe dynamically
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true
      }
    });

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
      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId
        }
      });
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

    // Get user's payment history from database
    const paymentHistory = await prisma.paymentHistory.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        planName: true,
        stripePaymentId: true,
        paymentMethod: true,
        description: true,
        receiptUrl: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      data: paymentHistory
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
export async function verifyPayment(req, res) {
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
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Payment was successful, create subscription record
      const planId = paymentIntent.metadata.planId;
      const planName = paymentIntent.metadata.planName;

      // Get plan details from metadata if available
      let plan = null;
      if (planId) {
        try {
          plan = await prisma.pricingPlan.findUnique({
            where: { id: parseInt(planId) }
          });
        } catch (error) {
          console.error('Error fetching plan:', error);
        }
      }

      console.log('Payment completed for user:', userId, 'Amount:', paymentIntent.amount);

      // Get user's current plan before updating
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionPlan: true }
      });

      // Also update user subscription in the database
      const newPlan = planName ? planName.toLowerCase() : plan?.name?.toLowerCase() || 'basic';
      const newPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionPlan: newPlan,
            subscriptionStatus: 'active',
            currentPeriodEnd: newPeriodEnd
          }
        });

        // Send upgrade notification
        try {
          await notificationService.createSubscriptionUpgradeNotification(userId, {
            fromPlan: currentUser?.subscriptionPlan || 'free',
            toPlan: newPlan,
            currentPeriodEnd: newPeriodEnd
          });
          console.log(`📧 [SUBSCRIPTION] Upgrade notification sent for user ${userId}`);
        } catch (notificationError) {
          console.error('📧 [SUBSCRIPTION] Failed to send upgrade notification:', notificationError);
          // Don't fail the upgrade if notification fails
        }
      } catch (updateError) {
        console.error('Error updating user subscription:', updateError);
      }

      res.json({
        success: true,
        paymentDetails: {
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

