// Instead of using the direct import, we'll add script tags to the index.html
// and use the global Stripe object
import { useEffect, useState, useRef } from 'react';
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate } from 'react-router-dom';

// We'll declare types for the Stripe objects we're using from the global scope
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

// Need to ensure the Stripe script is loaded first
useEffect(() => {
  // Check if Stripe is already loaded
  if (!window.Stripe) {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    document.body.appendChild(script);
  }
}, []);

// Define interface for component props
interface CheckoutFormProps {
  clientSecret: string;
}

// CheckoutForm component for Stripe payments
const CheckoutForm = ({ clientSecret }: CheckoutFormProps) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    // Initialize Stripe only when the script is loaded
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
  }, [clientSecret]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || 'An unexpected error occurred.');
      setLoading(false);
    }
    // No need to handle success case as user will be redirected to return_url
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
            'Pay Now'
          )}
        </button>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const amount = Number(new URLSearchParams(window.location.search).get('amount')) || 9900; // Default to $99.00
    
    axiosInstance.post("/api/v1/payments/create-payment-intent", { amount: amount / 100 }) // Convert cents to dollars
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      })
      .catch((err) => {
        console.error("Error creating payment intent:", err);
        setError(err.response?.data?.error?.message || "Failed to initialize payment. Please try again later.");
      });
  }, []);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment Error</h1>
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Complete Your Payment</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Please provide your payment details to complete the transaction.</p>
      
      {/* We now directly use the CheckoutForm with clientSecret */}
      <CheckoutForm clientSecret={clientSecret} />
    </div>
  );
}