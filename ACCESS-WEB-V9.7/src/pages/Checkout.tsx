import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/payments/CheckoutForm';
import { useAuth } from '../hooks/useAuth';
import { axiosInstance } from '../utils/axiosInstance';

// Make sure to call loadStripe outside of a component's render to avoid recreating the Stripe object on every render
// This is your Stripe publishable API key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Checkout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount] = useState(9900); // $99.00 in cents
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login?redirect=/checkout';
      return;
    }

    // Create a PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.post('/api/v1/payments/create-payment-intent', {
          amount,
          currency: 'usd',
        });

        setClientSecret(response.data.clientSecret);
      } catch (err: any) {
        console.error('Error creating payment intent:', err);
        setError(err.response?.data?.error || 'Failed to initialize payment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [isAuthenticated, amount]);

  const handlePaymentSuccess = (paymentIntentId: string) => {
    console.log('Payment successful:', paymentIntentId);
    setPaymentComplete(true);
    // You can redirect the user or update the UI as needed
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    setError('Payment failed. Please try again.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 w-full max-w-md">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Payment Successful!</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
          <div className="flex justify-center mt-6">
            <a
              href="/dashboard"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Complete Your Purchase</h2>
        
        <div className="mb-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Order Summary</h3>
          <div className="flex justify-between text-gray-700 dark:text-gray-300 mb-2">
            <span>Premium Subscription</span>
            <span>${(amount / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-800 dark:text-white pt-2 border-t border-gray-200 dark:border-gray-600">
            <span>Total</span>
            <span>${(amount / 100).toFixed(2)}</span>
          </div>
        </div>

        {clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              amount={amount} 
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default Checkout;