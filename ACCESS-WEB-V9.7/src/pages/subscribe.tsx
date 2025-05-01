// Using the CDN approach instead of direct imports
import { useEffect, useState, useRef } from 'react';
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate } from 'react-router-dom';

// Define types for Stripe global objects
declare global {
  interface Window {
    Stripe?: any;
  }
}

// Plans configuration
const SUBSCRIPTION_PLANS = [
  {
    id: 'price_basic',
    name: 'Basic Plan',
    price: 19.99,
    features: ['Basic accessibility scanning', 'WCAG compliance reports', 'Email support']
  },
  {
    id: 'price_pro',
    name: 'Professional Plan',
    price: 99.00,
    features: ['Advanced scanning', 'Detailed reports', 'Priority support', 'Team access']
  },
  {
    id: 'price_enterprise',
    name: 'Enterprise Plan',
    price: 299.00,
    features: ['Unlimited scanning', 'Custom reporting', '24/7 support', 'API access', 'Dedicated manager']
  }
];

// Create a wrapper for the Stripe object
const getStripe = () => {
  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
  }
  return window.Stripe?.(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
};

// Define interface for component props
interface SubscribeFormProps {
  clientSecret: string;
  selectedPlan: any;
}

// The subscription form with development mode support
const SubscribeForm = ({ clientSecret, selectedPlan }: SubscribeFormProps) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  // For development mode
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // Only attempt to initialize Stripe in production
    if (!import.meta.env.DEV && window.Stripe) {
      const checkStripeAndInit = () => {
        if (window.Stripe) {
          const stripe = getStripe();
          setStripe(stripe);
          
          if (stripe && clientSecret) {
            const elements = stripe.elements({
              clientSecret,
              appearance: { theme: 'stripe' }
            });
            
            // Create and mount the Payment Element
            const paymentElement = elements.create('payment');
            const paymentElementMount = document.getElementById('payment-element');
            
            if (paymentElementMount) {
              paymentElement.mount('#payment-element');
              setElements(elements);
            }
          }
        } else {
          // If Stripe isn't loaded yet, try again in 100ms
          setTimeout(checkStripeAndInit, 100);
        }
      };
      
      checkStripeAndInit();
    }
  }, [clientSecret]);
  
  // Production mode submission
  const handleProdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscription-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setLoading(false);
    }
    // No need to handle success case as user will be redirected to return_url
  };
  
  // Development mode submission
  const handleDevSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expDate || !cvv) {
      setErrorMessage('Please fill out all fields');
      return;
    }
    
    setLoading(true);
    setErrorMessage(null);
    
    // Mock successful subscription after 1.5 seconds
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      // Simulate redirect to success page
      navigate('/my-account/billing');
    }, 1500);
  };
  
  // Development mode success view
  if (success) {
    return (
      <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-medium text-green-800 dark:text-green-400 mb-2">Subscription Activated!</h3>
        <p className="text-green-700 dark:text-green-300 mb-4">
          Thank you for subscribing. Your subscription is now active.
        </p>
        <button
          onClick={() => navigate('/my-account/billing')}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
        >
          Go to Billing Dashboard
        </button>
      </div>
    );
  }
  
  // Development mode form
  if (import.meta.env.DEV) {
    return (
      <form ref={formRef} onSubmit={handleDevSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Card Number
            </label>
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expiration Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expDate}
                onChange={(e) => setExpDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Security Code
              </label>
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
          </div>
        </div>
        
        {errorMessage && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Subscribe - $${selectedPlan.price.toFixed(2)}/month`
            )}
          </button>
        </div>
        
        <div className="text-gray-600 dark:text-gray-400 text-xs mt-2">
          <p>This is a test mode payment form. No actual payment will be processed.</p>
          <p>You can use any values in the form fields.</p>
        </div>
      </form>
    );
  }
  
  // Production mode form with Stripe Elements
  return (
    <form ref={formRef} onSubmit={handleProdSubmit} className="space-y-6">
      {/* Mount point for the Stripe Payment Element */}
      <div id="payment-element" className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg"></div>
      
      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Subscribe Now'
          )}
        </button>
      </div>
    </form>
  );
};

// Plan selector component
interface PlanSelectorProps {
  selectedPlan: any;
  onSelectPlan: (plan: any) => void;
}

const PlanSelector = ({ selectedPlan, onSelectPlan }: PlanSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <div 
          key={plan.id}
          className={`border rounded-xl p-6 transition-all cursor-pointer 
            ${selectedPlan?.id === plan.id 
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' 
              : 'border-gray-200 dark:border-gray-700 hover:shadow-md'
            }`}
          onClick={() => onSelectPlan(plan)}
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
          <p className="text-2xl font-bold text-primary mt-2">${plan.price.toFixed(2)}<span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span></p>
          
          <ul className="mt-4 space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
              </li>
            ))}
          </ul>
          
          {selectedPlan?.id === plan.id && (
            <div className="mt-4 flex justify-center">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                Selected
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Main Subscribe page component
export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1]); // Default to Pro plan
  const [step, setStep] = useState<'select-plan' | 'payment'>('select-plan');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  
  // Ensure Stripe script is loaded
  useEffect(() => {
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Function to proceed to payment step
  const handleProceedToPayment = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (import.meta.env.DEV) {
        // In development, use a mock client secret for testing
        console.log('Using mock subscription in development mode');
        // This is a test client secret that does not trigger any real payment
        // In production, you would get this from the server
        setTimeout(() => {
          setClientSecret('sub_mock_client_secret_XXXXXXXXXXXXXX');
          setStep('payment');
          setLoading(false);
        }, 1000);
        return;
      }
      
      // In production, get a real client secret from the server
      const response = await axiosInstance.post("/api/v1/payments/create-subscription", {
        priceId: selectedPlan.id
      });
      
      setClientSecret(response.data.clientSecret);
      setStep('payment');
    } catch (err) {
      console.error("Error creating subscription:", err);
      setError(err.response?.data?.error?.message || "Failed to create subscription. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subscription Error</h1>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
        <button
          onClick={() => navigate('/my-account/billing')}
          className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
        >
          Back to Billing
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        {step === 'select-plan' ? 'Choose a Subscription Plan' : 'Complete Your Subscription'}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {step === 'select-plan' 
          ? 'Select a plan that best fits your needs.' 
          : 'Please provide your payment details to complete your subscription.'}
      </p>
      
      {step === 'select-plan' ? (
        <>
          <PlanSelector selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
          
          <div className="flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="mr-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={loading || !selectedPlan}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Continue to Payment'
              )}
            </button>
          </div>
        </>
      ) : (
        <>
          {!clientSecret ? (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
            </div>
          ) : (
            <div className="mt-4">
              <div className="mb-6">
                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">{selectedPlan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">${selectedPlan.price.toFixed(2)}/month</p>
                </div>
              </div>
              
              <SubscribeForm clientSecret={clientSecret} selectedPlan={selectedPlan} />
            </div>
          )}
        </>
      )}
    </div>
  );
}