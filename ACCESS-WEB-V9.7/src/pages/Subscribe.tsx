import React, { useState, useEffect, useRef } from 'react';
import CheckoutForm from '../components/payments/CheckoutForm';
import { useAuth } from '../hooks/useAuth';
import { axiosInstance } from '../utils/axiosInstance';

// Declare types for the Stripe objects we're using from the global scope
declare global {
  interface Window {
    Stripe?: any;
  }
}

// Create a wrapper for the Stripe object
const getStripe = () => {
  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
  }
  return window.Stripe?.(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
};

// Subscription plans
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 19.99,
    features: [
      'Basic accessibility scanning',
      'WCAG compliance reports',
      'Email support',
      'Up to 5 scans per month'
    ],
    priceId: 'price_basic' // Replace with actual Stripe price ID
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 49.99,
    features: [
      'Advanced accessibility scanning',
      'Detailed WCAG compliance reports',
      'Priority email & chat support',
      'Up to 20 scans per month',
      'PDF export of reports'
    ],
    priceId: 'price_pro' // Replace with actual Stripe price ID
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 99.99,
    features: [
      'Unlimited accessibility scanning',
      'Custom WCAG compliance reports',
      '24/7 priority support',
      'API access',
      'Custom integrations',
      'Dedicated account manager'
    ],
    priceId: 'price_enterprise' // Replace with actual Stripe price ID
  }
];

const Subscribe: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1]); // Default to Pro plan
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionComplete, setSubscriptionComplete] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login?redirect=/subscribe';
      return;
    }
  }, [isAuthenticated]);

  const handlePlanSelect = (plan: typeof SUBSCRIPTION_PLANS[0]) => {
    setSelectedPlan(plan);
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create a subscription intent
      const response = await axiosInstance.post('/api/v1/payments/create-subscription', {
        priceId: selectedPlan.priceId,
      });

      if (response.data.clientSecret) {
        setClientSecret(response.data.clientSecret);
      } else if (response.data.status === 'active') {
        // Subscription is already active, no payment needed
        setSubscriptionComplete(true);
      }
    } catch (err: any) {
      console.error('Error creating subscription:', err);
      setError(err.response?.data?.error || 'Failed to create subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    console.log('Subscription successful');
    setSubscriptionComplete(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (subscriptionComplete) {
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
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">Subscription Activated!</h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Thank you for subscribing to our {selectedPlan.name}. Your subscription is now active.
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

  // Ensure Stripe script is loaded
  useEffect(() => {
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Choose Your Subscription Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Select the plan that best fits your accessibility needs
          </p>
        </div>

        {/* Plan selection */}
        {!clientSecret && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan)}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 cursor-pointer transform transition-transform hover:scale-105 ${
                  selectedPlan.id === plan.id
                    ? 'ring-2 ring-primary'
                    : 'border border-gray-200 dark:border-slate-700'
                }`}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                  <span className="text-3xl font-extrabold tracking-tight">${plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    type="button"
                    className={`w-full py-3 px-4 rounded-md shadow-sm text-white ${
                      selectedPlan.id === plan.id
                        ? 'bg-primary hover:bg-primary-dark'
                        : 'bg-gray-400 hover:bg-gray-500 dark:bg-slate-600 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {selectedPlan.id === plan.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Subscription checkout */}
        <div className="max-w-md mx-auto mt-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <p>{error}</p>
            </div>
          )}

          {clientSecret ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Complete Your Subscription
              </h2>
              {/* We'll use a direct checkout form with the window.Stripe approach */}
              <div id="payment-container">
                <CheckoutForm
                  clientSecret={clientSecret}
                  amount={selectedPlan.price * 100}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => setError(err.message)}
                  buttonText="Subscribe Now"
                />
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleSubscribe}
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md shadow-sm"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Subscribe to ${selectedPlan.name}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Subscribe;