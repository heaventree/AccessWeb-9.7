import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: Error) => void;
  amount: number;
  buttonText?: string;
  buttonClassName?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onSuccess,
  onError,
  amount,
  buttonText = 'Pay Now',
  buttonClassName = 'bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline',
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe hasn't loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-success',
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
        if (onError) onError(error);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful
        if (onSuccess) onSuccess(paymentIntent.id);
      } else {
        // Handle other potential statuses
        setErrorMessage('Payment processing failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrorMessage('An unexpected error occurred.');
      if (onError) onError(error as Error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`${buttonClassName} ${(!stripe || isProcessing) ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isProcessing ? 'Processing...' : buttonText}
      </button>
      
      <div className="text-gray-600 dark:text-gray-400 text-xs mt-4">
        <p>You will be charged ${(amount / 100).toFixed(2)}</p>
        <p>Your payment information is processed securely by Stripe. We do not store your credit card details.</p>
      </div>
    </form>
  );
};

export default CheckoutForm;