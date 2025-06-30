import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Automatically expire subscriptions that have passed their end date
 * This function should be called periodically (e.g., daily via cron job)
 */
export async function checkAndExpireSubscriptions() {
  try {
    const now = new Date();
    
    // Find all active and canceled subscriptions that have passed their end date
    const expiredSubscriptions = await prisma.user.findMany({
      where: {
        subscriptionStatus: {
          in: ['active', 'canceled']
        },
        currentPeriodEnd: {
          lt: now
        }
      },
      select: {
        id: true,
        email: true,
        subscriptionPlan: true,
        currentPeriodEnd: true
      }
    });

    if (expiredSubscriptions.length === 0) {
      // console.log('No expired subscriptions found');
      return { expiredCount: 0 };
    }

    // Update all expired subscriptions
    const result = await prisma.user.updateMany({
      where: {
        id: {
          in: expiredSubscriptions.map(sub => sub.id)
        }
      },
      data: {
        subscriptionStatus: 'expired'
      }
    });

    // Logging disabled: Automatically expired ${result.count} subscriptions;
    
    // Log expired subscriptions for monitoring
    expiredSubscriptions.forEach(sub => {
      // Logging disabled: Expired subscription for user ${sub.email} (${sub.subscriptionPlan} plan);
    });

    return { 
      expiredCount: result.count, 
      expiredUsers: expiredSubscriptions 
    };

  } catch (error) {
    // console.error('Error checking subscription expiry:', error);
    throw error;
  }
}

/**
 * Set up automatic subscription expiry check
 * Runs every 24 hours (86400000 ms) to check for expired subscriptions
 */
export function startSubscriptionExpiryChecker() {
  // Run immediately on startup
  checkAndExpireSubscriptions();
  
  // Then run every 24 hours
  setInterval(checkAndExpireSubscriptions, 24 * 60 * 60 * 1000);
  
  // console.log('Subscription expiry checker started - running every 24 hours');
}