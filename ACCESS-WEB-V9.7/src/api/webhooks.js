import { db } from '../server/db.js';
import { users, pricingPlans, payments, subscriptions } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

// Stripe webhook handler for payment events
export async function handleStripeWebhook(req, res) {
  try {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return res.status(400).send('Webhook secret not configured');
    }

    // Import Stripe dynamically
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe('sk_test_51RSAoIRftwXmfGNuiNvmy0w53pb928VhlSZfAuuuMvGVvszyu87FBzUAJQDjaxEBD84ZhUD0NdsaYiXBi7SH7qYZ00Me4Zsbp0', {
      apiVersion: '2023-10-16',
    });

    let event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Received Stripe webhook event:', event.type);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handleRecurringPaymentSuccess(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

// Handle successful one-time payment
async function handlePaymentSuccess(paymentIntent) {
  try {
    console.log('Processing successful payment:', paymentIntent.id);
    
    const planId = paymentIntent.metadata.planId;
    const planName = paymentIntent.metadata.planName;
    const userIdFromMetadata = paymentIntent.metadata.userId;
    
    if (!planId || !userIdFromMetadata) {
      console.error('Missing plan ID or user ID in payment metadata');
      return;
    }

    // Get plan details
    const [plan] = await db
      .select()
      .from(pricingPlans)
      .where(eq(pricingPlans.id, parseInt(planId)));

    if (!plan) {
      console.error('Plan not found:', planId);
      return;
    }

    // Get user details
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parseInt(userIdFromMetadata)));

    if (!user) {
      console.error('User not found:', userIdFromMetadata);
      return;
    }

    // Create or update subscription
    const subscriptionData = {
      userId: parseInt(userIdFromMetadata),
      planId: parseInt(planId),
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      stripeSubscriptionId: paymentIntent.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db
      .insert(subscriptions)
      .values(subscriptionData)
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
        userId: parseInt(userIdFromMetadata),
        amount: paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'completed',
        plan: planName || plan.name,
        stripePaymentId: paymentIntent.id,
        createdAt: new Date()
      });

    console.log(`✅ Successfully processed payment for user ${userIdFromMetadata}: ${plan.name} plan`);
    
  } catch (error) {
    console.error('Error processing payment success:', error);
  }
}

// Handle failed payment
async function handlePaymentFailure(paymentIntent) {
  try {
    console.log('Processing failed payment:', paymentIntent.id);
    
    const userIdFromMetadata = paymentIntent.metadata.userId;
    
    if (userIdFromMetadata) {
      // Record failed payment in history
      await db
        .insert(payments)
        .values({
          userId: parseInt(userIdFromMetadata),
          amount: paymentIntent.amount,
          currency: paymentIntent.currency.toUpperCase(),
          status: 'failed',
          plan: paymentIntent.metadata.planName || 'Unknown Plan',
          stripePaymentId: paymentIntent.id,
          createdAt: new Date()
        });
      
      console.log(`❌ Recorded failed payment for user ${userIdFromMetadata}`);
    }
    
  } catch (error) {
    console.error('Error processing payment failure:', error);
  }
}

// Handle recurring subscription payments
async function handleRecurringPaymentSuccess(invoice) {
  try {
    console.log('Processing recurring payment:', invoice.id);
    
    // Handle subscription renewals here
    // This would extend the subscription period for existing users
    
  } catch (error) {
    console.error('Error processing recurring payment:', error);
  }
}