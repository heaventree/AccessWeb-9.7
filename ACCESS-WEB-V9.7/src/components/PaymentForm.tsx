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
}

export function PaymentFormWrapper({ clientSecret, amount, onSuccess, onError }: PaymentFormWrapperProps) {
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
}

function PaymentForm({ amount, onSuccess, onError, stripe, elements }: PaymentFormProps) {
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
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
          <CreditCard className="w-6 h-6 text-blue-600" />
        </div>
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-blue-800 font-medium">
            Amount to pay: ${amount && !isNaN(amount) ? (amount / 100).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Payment Element is handled via the ref in PaymentFormWrapper */}

      {paymentError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{paymentError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </button>

      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
        <span>Your payment is processed securely by</span>
        <svg className="h-5 w-auto" viewBox="0 0 468 222.5" xmlns="http://www.w3.org/2000/svg">
          <path className="fill-[#635bff]" fillRule="evenodd" clipRule="evenodd" d="M414 113.4c0-25.6-12.4-45.8-36.1-45.8-23.8 0-38.2 20.2-38.2 45.6 0 30.1 17 45.3 41.4 45.3 11.9 0 20.9-2.7 27.7-6.5v-20c-6.8 3.4-14.6 5.5-24.5 5.5-9.7 0-18.3-3.4-19.4-15.2h48.9c0-1.3.2-6.5.2-8.9zm-49.4-9.5c0-11.3 6.9-16 13.2-16 6.1 0 12.6 4.7 12.6 16h-25.8zM301.1 67.6c-9.8 0-16.1 4.6-19.6 7.8l-1.3-6.2h-22v116.6l25-5.3.1-28.3c3.6 2.6 8.9 6.3 17.7 6.3 17.9 0 34.2-14.4 34.2-46.1-.1-29-16.6-44.8-34.1-44.8zm-6 68.9c-5.9 0-9.4-2.1-11.8-4.7l-.1-37.1c2.6-2.9 6.2-4.9 11.9-4.9 9.1 0 15.4 10.2 15.4 23.3 0 13.4-6.2 23.4-15.4 23.4zM223.8 61.7l25.1-5.4V36l-25.1 5.3zM223.8 69.3h25.1v87.5h-25.1zM196.9 76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7 15.9-6.3 19-5.2v-23c-3.2-1.2-14.9-3.4-20.8 7.4zM146.9 47.6l-24.4 5.2-.1 80.1c0 14.8 11.1 25.7 25.9 25.7 8.2 0 14.2-1.5 17.5-3.3V135c-3.2 1.3-19 5.9-19-8.9V90.6h19V69.3h-19l.1-21.7zM79.3 94.7c0-3.9 3.2-5.4 8.5-5.4 7.6 0 17.2 2.3 24.8 6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6C67.5 67.6 54 78.2 54 95.9c0 27.6 38 23.2 38 35.1 0 4.6-4 6.1-9.6 6.1-8.3 0-18.9-3.4-27.3-8v23.8c9.3 4 18.7 5.7 27.3 5.7 20.8 0 35.1-10.3 35.1-28.2-.1-29.8-38.2-24.5-38.2-35.7z"/>
        </svg>
      </div>
    </form>
  );
}