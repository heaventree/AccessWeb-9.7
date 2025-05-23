// Define our own PaymentIntent type instead of importing from @stripe/stripe-js
interface PaymentIntent {
  id: string;
  amount: number;
  status: string;
  client_secret: string;
  // Add other properties as needed
}

interface CreatePaymentIntentResponse {
  clientSecret: string;
}

export async function createPaymentIntent(amount: number): Promise<CreatePaymentIntentResponse> {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
}