import Stripe from 'stripe';

/**
 * Initialize and configure Stripe API client
 * @returns Stripe instance or null if not configured
 */
export function initializeStripe(): Stripe | null {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    console.warn('STRIPE_SECRET_KEY environment variable is not set. Stripe functionality will be disabled.');
    return null;
  }

  return new Stripe(stripeSecretKey, {
    apiVersion: '2023-10-16', // Use the latest stable API version
    appInfo: {
      name: 'ACCESS-WEB Accessibility Platform',
      version: '9.7',
    },
  });
}

/**
 * Utility function to format amount from cents to dollars
 * @param amount Amount in cents
 * @returns Formatted amount in dollars (e.g., 1999 → 19.99)
 */
export function formatAmount(amount: number): string {
  return (amount / 100).toFixed(2);
}

/**
 * Utility function to convert dollars to cents for Stripe API
 * @param amount Amount in dollars
 * @returns Amount in cents (e.g., 19.99 → 1999)
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Utility function to create a readable subscription status 
 * @param status Raw Stripe subscription status
 * @param cancelAtPeriodEnd Whether subscription is set to cancel at period end
 * @returns Human-readable status
 */
export function formatSubscriptionStatus(status: string, cancelAtPeriodEnd: boolean): string {
  if (cancelAtPeriodEnd) {
    return 'Cancelling';
  }
  
  switch (status) {
    case 'active':
      return 'Active';
    case 'trialing':
      return 'Trial';
    case 'past_due':
      return 'Past Due';
    case 'unpaid':
      return 'Unpaid';
    case 'canceled':
      return 'Cancelled';
    case 'incomplete':
      return 'Incomplete';
    case 'incomplete_expired':
      return 'Expired';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

/**
 * Format a timestamp (in seconds) to a human-readable date
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string
 */
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}