import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function SubscriptionSuccess() {
  const [status, setStatus] = useState<'success' | 'processing' | 'error'>('processing');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the payment_intent and payment_intent_client_secret from the URL
    const query = new URLSearchParams(location.search);
    const paymentIntentId = query.get('payment_intent');
    const paymentIntentClientSecret = query.get('payment_intent_client_secret');
    const redirectStatus = query.get('redirect_status');

    if (redirectStatus === 'succeeded') {
      setStatus('success');
      setMessage('Your subscription was successful! Thank you for subscribing.');
    } else if (redirectStatus === 'processing') {
      setStatus('processing');
      setMessage('Your subscription payment is processing. We\'ll update you when it completes.');
    } else if (redirectStatus === 'requires_payment_method') {
      setStatus('error');
      setMessage('Your subscription payment was not successful, please try again.');
    } else {
      setStatus('error');
      setMessage('Something went wrong. Please contact support if this issue persists.');
    }
  }, [location]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
      <div className="text-center">
        {status === 'success' && (
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        )}
        {status === 'processing' && (
          <div className="animate-spin h-16 w-16 text-primary mx-auto mb-4 border-4 border-t-transparent rounded-full" />
        )}
        {status === 'error' && (
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        )}
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {status === 'success' && 'Subscription Successful'}
          {status === 'processing' && 'Subscription Processing'}
          {status === 'error' && 'Subscription Failed'}
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>

        {status === 'success' && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-700 dark:text-green-300">
              You now have access to all premium features. Your subscription is active and will automatically renew.
            </p>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/my-account/billing')}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
          >
            Manage Subscription
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}