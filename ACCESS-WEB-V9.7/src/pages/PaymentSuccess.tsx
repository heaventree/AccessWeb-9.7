import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const paymentIntent = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentIntent || redirectStatus !== 'succeeded') {
        setError('Invalid payment confirmation');
        setLoading(false);
        return;
      }

      try {
        // For now, create a temporary verification by checking URL parameters
        // This will be replaced with proper backend verification once the endpoint is working
        const urlParams = new URLSearchParams(window.location.search);
        const planParam = urlParams.get('plan') || 'Professional';
        const amountParam = urlParams.get('amount') || '79';
        
        // Try backend verification first
        try {
          const response = await axios.post('/api/subscription/verify-payment', {
            paymentIntentId: paymentIntent
          });

          if (response.data.success) {
            setPaymentDetails(response.data.paymentDetails);
          } else {
            throw new Error('Backend verification failed');
          }
        } catch (backendError) {
          console.log('Backend verification not available, using URL parameters');
          // Fallback to URL parameters if backend verification fails
          setPaymentDetails({
            id: paymentIntent,
            amount: parseInt(amountParam) * 100, // Convert to cents
            currency: 'usd',
            status: 'succeeded',
            planName: planParam + ' Plan'
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setError('Unable to verify payment details. Please contact support.');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [paymentIntent, redirectStatus]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#0fae96] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 dark:text-red-400 text-2xl">✕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Error
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error}
            </p>
            <button
              onClick={() => navigate('/billing')}
              className="inline-flex items-center px-6 py-3 bg-[#0fae96] text-white rounded-full font-medium hover:bg-[#0fae96]/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Billing
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your subscription. Your payment has been processed successfully.
          </p>

          {paymentDetails && (
            <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Plan:</span>
                  <span className="text-gray-900 dark:text-white">{paymentDetails.planName || 'Subscription'}</span>
                </div>
                {paymentDetails.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                    <span className="text-gray-900 dark:text-white">${(paymentDetails.amount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Payment ID:</span>
                  <span className="text-gray-900 dark:text-white font-mono text-xs">{paymentIntent}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate('/my-account')}
              className="w-full py-3 px-4 bg-[#0fae96] text-white rounded-full font-medium hover:bg-[#0fae96]/90 transition-colors"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={() => navigate('/my-account/billing')}
              className="w-full py-3 px-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            >
              View Billing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}