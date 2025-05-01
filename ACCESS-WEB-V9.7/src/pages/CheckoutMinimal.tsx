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
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Payment Successful!</h2>
          <p className="mb-4">Thank you for your purchase.</p>
          <a href="/dashboard" className="bg-blue-500 text-white py-2 px-4 rounded">
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Complete Purchase</h2>
      
      <div className="mb-4 p-4 bg-gray-100 rounded-lg">
        <div className="flex justify-between mb-1">
          <span>Premium Plan</span>
          <span>$99.00</span>
        </div>
        <div className="border-t pt-1 font-bold flex justify-between">
          <span>Total</span>
          <span>$99.00</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Card Number</label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1">Expiration</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={expDate}
              onChange={(e) => setExpDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">CVV</label>
            <input
              type="text"
              placeholder="123"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={processing}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {processing ? 'Processing...' : 'Pay $99.00'}
        </button>
        
        <p className="mt-2 text-sm text-gray-500">
          This is a test mode. No actual payment will be processed.
        </p>
      </form>
    </div>
  );
};

export default CheckoutMinimal;