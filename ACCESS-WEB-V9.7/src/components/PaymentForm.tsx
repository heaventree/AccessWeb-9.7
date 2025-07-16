import React, { useState, useEffect, useRef } from 'react';
import { CreditCard, Loader } from 'lucide-react';

// Define types for Stripe global objects
declare global {
  interface Window {
    Stripe?: any;
  }
}

// Create a wrapper for the Stripe object
const getStripe = () => {
  return window.Stripe?.(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
};

interface PaymentFormWrapperProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  planName?: string;
}

export function PaymentFormWrapper({ clientSecret, amount, onSuccess, onError, planName }: PaymentFormWrapperProps) {
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  const paymentElementRef = useRef<HTMLDivElement>(null);
  
  // Ensure Stripe script is loaded
  useEffect(() => {
    // Load Stripe.js script if not already loaded
    if (!window.Stripe) {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Initialize Stripe
    const initStripe = async () => {
      if (window.Stripe) {
        const stripeInstance = getStripe();
        setStripe(stripeInstance);
        
        if (stripeInstance && clientSecret && paymentElementRef.current) {
          const elementsInstance = stripeInstance.elements({
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                colorPrimary: '#2563eb',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorDanger: '#dc2626',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                borderRadius: '8px',
              },
            },
          });
          
          // Mount the payment element
          const paymentElement = elementsInstance.create('payment');
          if (paymentElementRef.current) {
            paymentElement.mount(paymentElementRef.current);
            setElements(elementsInstance);
          }
        }
      } else {
        // If Stripe isn't loaded yet, try again in 100ms
        setTimeout(initStripe, 100);
      }
    };
    
    initStripe();
    
    // Cleanup function
    return () => {
      if (elements) {
        // Unmount elements if needed
      }
    };
  }, [clientSecret]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        ref={paymentElementRef} 
        className="p-4 border border-gray-200 rounded-lg mb-4"
      />
      <PaymentForm 
        amount={amount} 
        onSuccess={onSuccess} 
        onError={onError}
        stripe={stripe}
        elements={elements}
        planName={planName}
      />
    </div>
  );
}

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  stripe?: any;
  elements?: any;
  planName?: string;
}

function PaymentForm({ amount, onSuccess, onError, stripe, elements, planName }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create return URL with plan and amount information
      const returnUrl = new URL(`${window.location.origin}/payment-success`);
      if (planName) {
        returnUrl.searchParams.set('plan', planName);
      }
      if (amount) {
        returnUrl.searchParams.set('amount', (amount / 100).toString());
      }

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl.toString(),
        },
      });

      if (error) {
        setPaymentError(error.message || 'An error occurred during payment');
        onError(error.message || 'Payment failed');
      } else {
        onSuccess();
      }
    } catch (err) {
      setPaymentError('An unexpected error occurred');
      onError('Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Details Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Details</h2>
        </div>
        
        {/* Amount Display */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Amount to pay</div>
          <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            ${amount && !isNaN(amount) ? (amount / 100).toFixed(2) : '0.00'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Element is handled via the ref in PaymentFormWrapper */}

        {paymentError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full"></div>
              </div>
              <p className="text-red-700 dark:text-red-400 text-sm font-medium">{paymentError}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-md"
        >
          {isProcessing ? (
            <>
              <Loader className="w-5 h-5 mr-3 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-3" />
              Pay Now
            </>
          )}
        </button>

        {/* Security Notice with Stripe Logo */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secured by</span>
            </div>
            <svg className="h-4 w-auto opacity-80" viewBox="0 0 468 222.5" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-[#635bff]" fillRule="evenodd" clipRule="evenodd" d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8-23.8 0-38.2 20.2-38.2 45.6 0 30.1 17 45.3 41.4 45.3 11.9 0 20.9-2.7 27.7-6.5v-20c-6.8 3.4-14.6 5.5-24.5 5.5-9.7 0-18.3-3.4-19.4-15.2h48.9c0-1.3.2-6.5.2-8.9zm-49.4-9.5c0-11.3 6.9-16 13.2-16 6.1 0 12.6 4.7 12.6 16h-25.8zM301.1 67.6c-9.8 0-16.1 4.6-19.6 7.8l-1.3-6.2h-22v116.6l25-5.3.1-28.3c3.6 2.6 8.9 6.3 17.7 6.3 17.9 0 34.2-14.4 34.2-46.1-.1-29-16.6-44.8-34.1-44.8zm-6 68.9c-5.9 0-9.4-2.1-11.8-4.7l-.1-37.1c2.6-2.9 6.2-4.9 11.9-4.9 9.1 0 15.4 10.2 15.4 23.3 0 13.4-6.2 23.4-15.4 23.4zM223.8 61.7l25.1-5.4V36l-25.1 5.3zM223.8 69.3h25.1v87.5h-25.1zM196.9 76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7 15.9-6.3 19-5.2v-23c-3.2-1.2-14.9-3.4-20.8 7.4zM146.9 47.6l-24.4 5.2-.1 80.1c0 14.8 11.1 25.7 25.9 25.7 8.2 0 14.2-1.5 17.5-3.3V135c-3.2 1.3-19 5.9-19-8.9V90.6h19V69.3h-19l.1-21.7zM79.3 94.7c0-3.9 3.2-5.4 8.5-5.4 7.6 0 17.2 2.3 24.8 6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5 67.6 54 78.2 54 95.9c0 27.6 38 23.2 38 35.1 0 4.6-4 6.1-9.6 6.1-8.3 0-18.9-3.4-27.3-8v23.8c9.3 4 18.7 5.7 27.3 5.7 20.8 0 35.1-10.3 35.1-28.2-.1-29.8-38.2-24.5-38.2-35.7z"/>
            </svg>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">256-bit SSL encryption</p>
        </div>
      </form>
    </div>
  );
}