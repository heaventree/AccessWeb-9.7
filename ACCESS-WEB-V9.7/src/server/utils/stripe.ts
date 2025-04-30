import Stripe from 'stripe';

// Initialize Stripe with API key
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: Stripe secret key is not set. Payment functionality will be disabled.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

/**
 * Create a Stripe customer
 * @param email Customer email
 * @param name Customer name
 */
export async function createCustomer(email: string, name?: string): Promise<Stripe.Customer | null> {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }
  
  try {
    return await stripe.customers.create({
      email,
      name: name || undefined
    });
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
}

/**
 * Create a payment intent for one-time payments
 * @param amount Amount in cents
 * @param currency Currency code (default: 'usd')
 * @param customer Customer ID
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  customer?: string
): Promise<Stripe.PaymentIntent> {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }
  
  try {
    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount,
      currency,
      automatic_payment_methods: { enabled: true }
    };
    
    if (customer) {
      paymentIntentData.customer = customer;
    }
    
    return await stripe.paymentIntents.create(paymentIntentData);
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Create or retrieve a subscription
 * @param customerId Stripe customer ID
 * @param priceId Stripe price ID
 */
export async function createOrRetrieveSubscription(
  customerId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }
  
  try {
    // List customer's active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.latest_invoice.payment_intent']
    });
    
    // Check if customer already has an active subscription for this price
    for (const subscription of subscriptions.data) {
      for (const item of subscription.items.data) {
        if (item.price.id === priceId) {
          return subscription;
        }
      }
    }
    
    // Create a new subscription if none exists
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent']
    });
  } catch (error) {
    console.error('Error with subscription:', error);
    throw error;
  }
}

/**
 * Cancel a subscription
 * @param subscriptionId Stripe subscription ID
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }
  
  try {
    return await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}

/**
 * Get customer's payment methods
 * @param customerId Stripe customer ID
 */
export async function getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }
  
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });
    
    return paymentMethods.data;
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw error;
  }
}

/**
 * Get instance of Stripe API
 */
export function getStripeInstance(): Stripe | null {
  return stripe;
}