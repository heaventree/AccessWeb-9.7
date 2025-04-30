import React, { useState, useEffect } from 'react';
import { CreditCard, Download, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axiosInstance';
import { useAuth } from '../../hooks/useAuth';

// Subscription and payment method interfaces
interface SubscriptionData {
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  planName?: string;
  price?: number;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

// Plans configuration
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 19.99,
    features: ['Basic accessibility scanning', 'WCAG compliance reports', 'Email support']
  },
  {
    id: 'pro',
    name: 'Professional Plan',
    price: 99.00,
    features: ['Advanced scanning', 'Detailed reports', 'Priority support', 'Team access']
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 299.00,
    features: ['Unlimited scanning', 'Custom reporting', '24/7 support', 'API access', 'Dedicated manager']
  }
];

export function BillingSettings() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    subscription: true,
    paymentMethod: true,
    invoices: true
  });
  const [error, setError] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptionData();
      fetchPaymentMethods();
      // In a real implementation, you would also fetch invoices
      // For now we'll use the static data below
      setLoading(prev => ({ ...prev, invoices: false }));
    }
  }, [isAuthenticated]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(prev => ({ ...prev, subscription: true }));
      const response = await axiosInstance.get('/api/v1/payments/subscription-status');
      
      if (response.data.status === 'no_subscription') {
        setSubscription(null);
      } else {
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === 'pro') || SUBSCRIPTION_PLANS[1]; // Default to Pro plan
        
        setSubscription({
          status: response.data.status,
          currentPeriodEnd: response.data.currentPeriodEnd,
          cancelAtPeriodEnd: response.data.cancelAtPeriodEnd,
          planName: plan.name,
          price: plan.price
        });
      }
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError('Failed to load subscription details.');
    } finally {
      setLoading(prev => ({ ...prev, subscription: false }));
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      setLoading(prev => ({ ...prev, paymentMethod: true }));
      const response = await axiosInstance.get('/api/v1/payments/payment-methods');
      
      if (response.data.paymentMethods && response.data.paymentMethods.length > 0) {
        const method = response.data.paymentMethods[0];
        setPaymentMethod({
          id: method.id,
          brand: method.card.brand,
          last4: method.card.last4,
          expMonth: method.card.exp_month,
          expYear: method.card.exp_year
        });
      } else {
        setPaymentMethod(null);
      }
    } catch (err: any) {
      console.error('Error fetching payment methods:', err);
      // Don't set error for payment methods as it's not critical
    } finally {
      setLoading(prev => ({ ...prev, paymentMethod: false }));
    }
  };

  const handleChangePlan = () => {
    navigate('/subscribe');
  };

  const handleUpdatePaymentMethod = () => {
    navigate('/checkout');
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.')) {
      return;
    }

    try {
      setCancelLoading(true);
      await axiosInstance.post('/api/v1/payments/cancel-subscription');
      
      // Refresh subscription status
      fetchSubscriptionData();
      
      alert('Your subscription has been cancelled and will end on your next billing date.');
    } catch (err: any) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription. Please try again later.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Format the date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Determine subscription status for UI display
  const getStatusDisplay = () => {
    if (!subscription) return { color: 'gray', text: 'No Subscription' };
    
    const isActive = subscription.status === 'active';
    const isPastDue = subscription.status === 'past_due';
    const isCancelled = subscription.cancelAtPeriodEnd || 
                        ['canceled', 'unpaid', 'incomplete_expired'].includes(subscription.status);
    
    if (isActive) return { color: 'green', text: 'Active' };
    if (isPastDue) return { color: 'yellow', text: 'Past Due' };
    if (isCancelled) return { color: 'red', text: 'Cancelled' };
    
    return { color: 'gray', text: subscription.status };
  };

  const statusDisplay = getStatusDisplay();

  // Mock invoice data - in a real implementation, these would come from the API
  const mockInvoices = [
    { id: 'inv_1', date: 'April 1, 2024', amount: subscription?.price || 99.00, status: 'paid' },
    { id: 'inv_2', date: 'March 1, 2024', amount: subscription?.price || 99.00, status: 'paid' },
    { id: 'inv_3', date: 'February 1, 2024', amount: subscription?.price || 99.00, status: 'paid' }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Billing Settings</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your subscription and billing information.</p>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
            <p className="ml-3 text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Current Plan */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Current Plan</h3>
          {loading.subscription ? (
            <div className="animate-pulse mt-2 h-24 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          ) : !subscription ? (
            <div className="mt-2 bg-gray-100 dark:bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">No Active Subscription</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subscribe to access premium features</p>
                </div>
                <button 
                  onClick={handleChangePlan}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-md text-sm"
                >
                  Subscribe Now
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">{subscription.planName || 'Professional Plan'}</p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                    bg-${statusDisplay.color}-100 text-${statusDisplay.color}-800 
                                    dark:bg-${statusDisplay.color}-900/30 dark:text-${statusDisplay.color}-300`}>
                      {statusDisplay.text}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-400">${subscription.price?.toFixed(2) || '99.00'}/month</p>
                  {subscription.cancelAtPeriodEnd && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Access until {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  )}
                </div>
                {subscription.cancelAtPeriodEnd ? (
                  <button 
                    onClick={handleChangePlan}
                    className="text-primary hover:text-primary-dark font-medium text-sm dark:text-primary-300 dark:hover:text-primary-200"
                  >
                    Resubscribe
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button 
                      onClick={handleChangePlan}
                      className="text-primary hover:text-primary-dark font-medium text-sm dark:text-primary-300 dark:hover:text-primary-200"
                    >
                      Change Plan
                    </button>
                    <button 
                      onClick={handleCancelSubscription}
                      disabled={cancelLoading}
                      className="text-red-600 hover:text-red-700 font-medium text-sm dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                    >
                      {cancelLoading ? (
                        <span className="flex items-center">
                          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        'Cancel'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Payment Method</h3>
          {loading.paymentMethod ? (
            <div className="animate-pulse mt-2 h-14 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          ) : !paymentMethod ? (
            <div className="mt-2">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">No payment method on file</div>
                <button 
                  onClick={handleUpdatePaymentMethod}
                  className="text-primary hover:text-primary-dark font-medium text-sm dark:text-primary-300 dark:hover:text-primary-200"
                >
                  Add Method
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {paymentMethod.brand.charAt(0).toUpperCase() + paymentMethod.brand.slice(1)} •••• {paymentMethod.last4}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={handleUpdatePaymentMethod}
                  className="text-primary hover:text-primary-dark font-medium text-sm dark:text-primary-300 dark:hover:text-primary-200"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Billing History */}
        <div className="pt-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Billing History</h3>
            <button className="text-primary hover:text-primary-dark font-medium text-sm dark:text-primary-300 dark:hover:text-primary-200">
              View All
            </button>
          </div>
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg overflow-hidden">
            {mockInvoices.map((invoice) => (
              <div key={invoice.id} className="px-4 py-3 border-b border-gray-200 dark:border-slate-600 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {subscription?.planName || 'Professional Plan'} - Monthly
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.date}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">${invoice.amount.toFixed(2)}</span>
                    <button className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}