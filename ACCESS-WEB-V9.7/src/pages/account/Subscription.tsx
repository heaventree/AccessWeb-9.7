import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { axiosInstance } from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

interface SubscriptionData {
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

const AccountSubscription: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate('/login?redirect=/account/subscription');
      return;
    }

    // Fetch subscription status
    fetchSubscription();
  }, [isAuthenticated, navigate]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/api/v1/payments/subscription-status');
      
      if (response.data.status === 'no_subscription') {
        setSubscription(null);
      } else {
        setSubscription({
          status: response.data.status,
          currentPeriodEnd: response.data.currentPeriodEnd,
          cancelAtPeriodEnd: response.data.cancelAtPeriodEnd
        });
      }
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError(err.response?.data?.error || 'Failed to fetch subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }

    try {
      setCancelLoading(true);
      setError(null);

      await axiosInstance.post('/api/v1/payments/cancel-subscription');
      
      // Refresh subscription status
      fetchSubscription();
      
      alert('Your subscription has been cancelled and will end on your next billing date.');
    } catch (err: any) {
      console.error('Error cancelling subscription:', err);
      setError(err.response?.data?.error || 'Failed to cancel subscription');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error</h3>
        <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
        <button
          onClick={fetchSubscription}
          className="mt-4 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-200 px-3 py-1 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subscription</h2>
        
        <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-lg text-center">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            You don't have an active subscription.
          </p>
          <button
            onClick={() => navigate('/subscribe')}
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded"
          >
            View Subscription Plans
          </button>
        </div>
      </div>
    );
  }

  // Format the date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if subscription is active
  const isActive = subscription.status === 'active';
  const isPastDue = subscription.status === 'past_due';
  const isCancelled = subscription.cancelAtPeriodEnd || ['canceled', 'unpaid', 'incomplete_expired'].includes(subscription.status);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subscription</h2>
      
      <div className="p-6 bg-gray-50 dark:bg-slate-700 rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Plan</h3>
            <div className="mt-1 flex items-center">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : isPastDue
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {isActive
                  ? 'Active'
                  : isPastDue
                  ? 'Past Due'
                  : isCancelled
                  ? 'Cancelled'
                  : subscription.status}
              </span>
            </div>
          </div>
          
          {!isCancelled && isActive && (
            <button
              onClick={handleCancelSubscription}
              disabled={cancelLoading}
              className="mt-4 sm:mt-0 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/40 text-red-800 dark:text-red-300 px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLoading ? 'Processing...' : 'Cancel Subscription'}
            </button>
          )}
        </div>
        
        <div className="border-t border-gray-200 dark:border-slate-600 pt-4">
          <dl className="divide-y divide-gray-200 dark:divide-slate-600">
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
              <dd className="text-sm text-gray-900 dark:text-white capitalize">{subscription.status}</dd>
            </div>
            
            <div className="py-4 flex justify-between">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {isCancelled ? 'Access Until' : 'Next Billing Date'}
              </dt>
              <dd className="text-sm text-gray-900 dark:text-white">
                {formatDate(subscription.currentPeriodEnd)}
              </dd>
            </div>
            
            {isCancelled && (
              <div className="py-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your subscription has been cancelled. You will continue to have access to premium features until the end of your current billing period.
                </p>
                
                <button
                  onClick={() => navigate('/subscribe')}
                  className="mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium"
                >
                  Resubscribe
                </button>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default AccountSubscription;