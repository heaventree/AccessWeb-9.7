import React, { useState } from 'react';

// Completely stripped-down checkout component with no dependencies
const CheckoutMinimal: React.FC = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cardNumber || !expDate || !cvv) {
      setError('Please fill out all fields');
      return;
    }
    
    setProcessing(true);
    setError('');
    
    // Mock payment completion after 1 second
    setTimeout(() => {
      setProcessing(false);
      setComplete(true);
    }, 1000);
  };
  
  if (complete) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Payment Successful!</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">Thank you for your purchase.</p>
          <a href="/dashboard" className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Complete Purchase</h2>
      
      <div className="mb-4 p-4 bg-gray-100 dark:bg-slate-700 rounded-lg">
        <div className="flex justify-between mb-1">
          <span className="text-gray-700 dark:text-gray-300">Premium Plan</span>
          <span className="text-gray-700 dark:text-gray-300">$99.00</span>
        </div>
        <div className="border-t border-gray-200 dark:border-slate-600 pt-1 font-bold flex justify-between">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-gray-900 dark:text-white">$99.00</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Card Number</label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Expiration</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">CVV</label>
            <input
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={processing}
          className="w-full py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded disabled:opacity-50 transition-colors"
        >
          {processing ? 'Processing...' : 'Pay $99.00'}
        </button>
        
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          This is a test mode. No actual payment will be processed.
        </p>
      </form>
    </div>
  );
};

export default CheckoutMinimal;