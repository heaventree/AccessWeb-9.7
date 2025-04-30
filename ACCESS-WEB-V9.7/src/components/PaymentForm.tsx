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
  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
  }
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
}

function PaymentForm({ amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
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
            Amount to pay: ${(amount / 100).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <PaymentElement />
      </div>

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

      <p className="mt-4 text-sm text-gray-600 text-center">
        Your payment is processed securely by Stripe
      </p>
    </form>
  );
}