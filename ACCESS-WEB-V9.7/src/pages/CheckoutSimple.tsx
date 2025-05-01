import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Simple checkout page for development without Stripe dependencies
const CheckoutSimple: React.FC = () => {
  const navigate = useNavigate();
  const [amount] = useState(9900); // $99.00 in cents
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expDate || !cvv) {
      setError('Please fill out all fields');
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    // Mock successful payment after 1.5 seconds
    setTimeout(() => {
      setProcessing(false);
      setPaymentComplete(true);
    }, 1500);
  };
  
  // Payment success screen
  if (paymentComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-slate-900 p-4">
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
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Main checkout form
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-slate-900 p-4">
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={processing}
            className="w-full mt-4 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Pay $${(amount / 100).toFixed(2)}`
            )}
          </button>
          
          <div className="text-gray-600 dark:text-gray-400 text-xs mt-2">
            <p>This is a test mode payment form. No actual payment will be processed.</p>
            <p>You can use any values in the form fields.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutSimple;