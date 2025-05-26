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
        <svg className="h-5 w-auto" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M59.5 12.5c0 3.866-3.134 7-7 7s-7-3.134-7-7 3.134-7 7-7 7 3.134 7 7zM52.5 9.5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm-26-4c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-13-8c0-6.627-5.373-12-12-12S1.5 10.873 1.5 17.5s5.373 12 12 12 12-5.373 12-12zm-12-8c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8z" fill="#6772E5"/>
          <path d="M22.395 16.688L21.477 9.25h-2.054l.918 7.438h2.054zm8.668-7.438h-1.918c-.61 0-1.13.355-1.36.901l-2.427 5.776h2.158l.427-1.183h2.632l.247 1.183h1.904l-1.663-6.677zm-2.136 4.25l1.078-2.981.616 2.981h-1.694zm-4.347-1.77c0-.743-.478-1.195-1.478-1.478l-.8-.227c-.6-.172-.8-.344-.8-.616 0-.355.35-.589.894-.589.506 0 .977.172 1.255.344l.227-1.361c-.322-.156-.822-.289-1.438-.289-1.505 0-2.56.799-2.565 1.944-.005.845.754 1.316 1.329 1.599.594.288.793.473.793.73 0 .394-.472.578-.905.578-.605 0-1.094-.156-1.416-.344l-.25 1.472c.355.16.961.3 1.61.3 1.599 0 2.638-.788 2.644-2.008l-.1-.055zm15.609-2.48h-1.827l.005-1.378-2.054.611-.005 6.422c0 1.239.927 2.154 2.2 2.154.7 0 1.211-.128 1.494-.277l-.005-1.406c-.272.111-.655.189-1.128.189-.5 0-.733-.233-.733-.689v-2.87h1.861l.187-1.756z" fill="#6772E5"/>
        </svg>
      </div>
    </form>
  );
}