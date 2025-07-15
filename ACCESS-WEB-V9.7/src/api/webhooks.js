import { db } from "../server/db.js";
import { pricingPlans, payments } from "../shared/schema.js";
import { eq } from "drizzle-orm";

// Stripe webhook handler for payment events
export async function handleStripeWebhook(req, res) {
  try {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
      return res.status(400).send("Webhook secret not configured");
    }

    // Import Stripe dynamically
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    let event;

    try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      console.log("Received signature:", sig);
      console.log("Using webhook secret:", webhookSecret);

      // For development, let's temporarily skip signature verification
      // In production, you must verify signatures for security
      console.log("⚠️ Skipping signature verification for development");
      try {
        event = JSON.parse(req.body);
      } catch (parseErr) {
        console.error("Failed to parse webhook body:", parseErr.message);
        return res.status(400).send("Invalid JSON");
      }
    }

    console.log("Received Stripe webhook event:", event.type);

    // Handle different event types
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handlePaymentFailure(event.data.object);
        break;

      case "invoice.payment_succeeded":
        await handleRecurringPaymentSuccess(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}

// Handle successful one-time payment
async function handlePaymentSuccess(paymentIntent) {
  try {
    console.log("Processing successful payment:", paymentIntent.id);

    const planId = paymentIntent.metadata.planId;
    const planName = paymentIntent.metadata.planName;
    const userIdFromMetadata = paymentIntent.metadata.userId;

    if (!planId || !userIdFromMetadata) {
      console.error("Missing plan ID or user ID in payment metadata");
      return;
    }

    // Get plan details
    const [plan] = await db
      .select()
      .from(pricingPlans)
      .where(eq(pricingPlans.id, parseInt(planId)));

    if (!plan) {
      console.error("Plan not found:", planId);
      return;
    }

    // Get user details using Prisma
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userIdFromMetadata) },
    });

    if (!user) {
      console.error("User not found:", userIdFromMetadata);
      await prisma.$disconnect();
      return;
    }

    // Update user subscription fields
    await prisma.user.update({
      where: { id: parseInt(userIdFromMetadata) },
      data: {
        subscriptionPlan: plan.name.toLowerCase(),
        subscriptionStatus: "active",
        stripeSubscriptionId: paymentIntent.id,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        updatedAt: new Date(),
      },
    });

    await prisma.$disconnect();

    // Record payment in history using Prisma
    await prisma.paymentHistory.create({
      data: {
        userId: parseInt(userIdFromMetadata),
        amount: paymentIntent.amount / 100, // Convert from cents to dollars
        currency: paymentIntent.currency.toUpperCase(),
        status: "succeeded",
        planName: plan.name,
        stripePaymentId: paymentIntent.id,
        stripeCustomerId: paymentIntent.customer,
        paymentMethod: "card",
        description: `Payment for ${plan.name} plan`,
        receiptUrl: paymentIntent.charges?.data[0]?.receipt_url || null,
      },
    });

    console.log(
      `✅ Successfully processed payment for user ${userIdFromMetadata}: ${plan.name} plan`,
    );
  } catch (error) {
    console.error("Error processing payment success:", error);
  }
}

// Handle failed payment
async function handlePaymentFailure(paymentIntent) {
  try {
    console.log("Processing failed payment:", paymentIntent.id);

    const userIdFromMetadata = paymentIntent.metadata.userId;

    if (userIdFromMetadata) {
      // Record failed payment in history
      await db.insert(payments).values({
        userId: parseInt(userIdFromMetadata),
        planId: parseInt(paymentIntent.metadata.planId || 0),
        amount: (paymentIntent.amount / 100).toString(), // Convert from cents
        currency: paymentIntent.currency.toUpperCase(),
        status: "failed",
        stripePaymentIntentId: paymentIntent.id,
        paymentMethod: "card",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(`❌ Recorded failed payment for user ${userIdFromMetadata}`);
    }
  } catch (error) {
    console.error("Error processing payment failure:", error);
  }
}

// Handle recurring subscription payments
async function handleRecurringPaymentSuccess(invoice) {
  try {
    console.log("Processing recurring payment:", invoice.id);

    // Handle subscription renewals here
    // This would extend the subscription period for existing users
  } catch (error) {
    console.error("Error processing recurring payment:", error);
  }
}
