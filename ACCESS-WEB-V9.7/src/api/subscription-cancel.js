// Cancel subscription functionality
import { requireAuth } from '../middleware/userAuth.js';
import { notificationService } from '../server/services/notificationService.js';

// Cancel subscription
async function cancelSubscription(req, res) {
  try {
    const userId = req.user?.id;
    const { reason } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get user from database
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Import Stripe dynamically
    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Cancel the subscription in Stripe if it exists
    if (user.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.update(user.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
      } catch (stripeError) {
        console.error('Error canceling Stripe subscription:', stripeError);
        // Continue with local cancellation even if Stripe fails
      }
    }

    // Update user subscription status in database and store cancellation reason
    const updateData = {
      subscriptionStatus: 'canceled',
      updatedAt: new Date()
    };

    // Add cancellation reason if provided
    if (reason) {
      updateData.cancellationReason = reason;
      updateData.cancelledAt = new Date();
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Send cancellation notification
    try {
      await notificationService.createSubscriptionCancellationNotification(userId, {
        plan: user.subscriptionPlan,
        currentPeriodEnd: updatedUser.currentPeriodEnd,
        reason: reason
      });
      console.log(`📧 [SUBSCRIPTION] Cancellation notification sent for user ${userId}`);
    } catch (notificationError) {
      console.error('📧 [SUBSCRIPTION] Failed to send cancellation notification:', notificationError);
      // Don't fail the cancellation if notification fails
    }

    await prisma.$disconnect();

    res.json({
      success: true,
      message: 'Subscription cancelled successfully. Your access will continue until the end of the current billing period.',
      data: {
        subscriptionStatus: 'canceled',
        currentPeriodEnd: updatedUser.currentPeriodEnd
      }
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message
    });
  }
}

export { cancelSubscription };