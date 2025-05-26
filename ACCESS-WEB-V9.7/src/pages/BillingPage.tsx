import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { PaymentFormWrapper } from '../components/PaymentForm';
import CancelSubscriptionModal from '../components/CancelSubscriptionModal';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  cta?: string;
}

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd?: string;
}

interface Payment {
  id: number;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  plan: string;
}

export default function BillingPage() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Fetch user's current subscription
  const fetchSubscription = async () => {
    try {
      const response = await axios.get('/api/subscription');
      setSubscription(response.data.data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Use default free plan for now
      setSubscription({
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null
      });
    }
  };

  // Fetch available plans
  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/pricing-plans');
      setPlans(response.data.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      // Use sample plans for demonstration
      setPlans([
        {
          id: 1,
          name: 'Basic',
          description: 'Perfect for small teams getting started',
          price: 29,
          period: 'month',
          features: [
            'Up to 5 accessibility scans per month',
            'Basic WCAG compliance reports',
            'Email support',
            'Mobile-friendly testing'
          ],
          isPopular: false,
          cta: 'Start Basic Plan'
        },
        {
          id: 2,
          name: 'Professional',
          description: 'Ideal for growing businesses',
          price: 79,
          period: 'month',
          features: [
            'Unlimited accessibility scans',
            'Advanced WCAG compliance reports',
            'Priority support',
            'API access',
            'Custom integrations',
            'Team collaboration tools'
          ],
          isPopular: true,
          cta: 'Start Professional Plan'
        },
        {
          id: 3,
          name: 'Enterprise',
          description: 'For large organizations with advanced needs',
          price: 199,
          period: 'month',
          features: [
            'Everything in Professional',
            'White-label reporting',
            'Dedicated account manager',
            'Custom compliance frameworks',
            'On-premise deployment options',
            'SLA guarantee'
          ],
          isPopular: false,
          cta: 'Contact Sales'
        }
      ]);
    }
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get('/api/subscription/payment-history');
      setPaymentHistory(response.data.data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      // Empty payment history for now
      setPaymentHistory([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchSubscription(),
        fetchPlans(),
        fetchPaymentHistory()
      ]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  const handleUpgradePlan = async (planId: number) => {
    try {
      // Create payment intent with Stripe
      const response = await axios.post('/api/subscription/payment-intent', { planId });
      
      if (response.data.requiresStripeKeys) {
        setError('Stripe integration requires API keys. Please contact support to set up payments.');
        return;
      }

      if (response.data.success && response.data.clientSecret) {
        // Success! Show the actual Stripe payment form
        const plan = response.data.plan;
        setSelectedPlan(plan);
        setClientSecret(response.data.clientSecret);
        setShowPaymentForm(true);
        setError(null); // Clear any previous errors
      }
      
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError('Failed to initiate plan upgrade');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    setClientSecret('');
    setSelectedPlan(null);
    // Refresh subscription data
    fetchSubscription();
  };

  const handlePaymentCancel = () => {
    setShowPaymentForm(false);
    setClientSecret('');
    setSelectedPlan(null);
  };

  const handleCancelSubscription = async (reason?: string) => {
    try {
      const response = await axios.post('/api/subscription/cancel', { reason });
      
      if (response.data.success) {
        // Refresh subscription data to show updated status
        fetchSubscription();
        setError(null);
      } else {
        setError(response.data.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      setError('Failed to cancel subscription. Please try again.');
    }
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-12 h-12 border-4 border-[#0fae96] border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Billing & Subscription" 
        description="Manage your subscription and billing details"
      />
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      {/* Current Subscription Status */}
      {subscription && (
        <div className={`mt-6 rounded-xl shadow-sm border p-6 ${
          subscription.status === 'expired' 
            ? 'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700'
            : subscription.status === 'canceled'
            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
            : subscription.status === 'active'
            ? 'bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-700 shadow-lg'
            : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
        }`}>
          {subscription.status === 'expired' && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                    🚨 Subscription Expired
                  </h3>
                  <p className="text-red-700 dark:text-red-300 mt-1">
                    Your subscription has expired. Upgrade now to continue accessing premium features.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {subscription.status === 'canceled' && (
            <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                    ⚠️ Subscription Cancelled
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                    Your subscription has been cancelled. You can continue to use premium features until your current billing period ends.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {subscription.status === 'active' && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    ✅ Subscription Active
                  </h3>
                  <p className="text-green-700 dark:text-green-300 mt-1">
                    You have full access to all premium features and tools.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Plan</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <p className={`text-2xl font-bold capitalize ${
                  subscription.status === 'expired' 
                    ? 'text-red-600 dark:text-red-400' 
                    : subscription.status === 'canceled'
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : subscription.status === 'active'
                    ? 'text-green-600 dark:text-green-400 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent'
                    : 'text-[#0fae96]'
                }`}>
                  {subscription.plan} Plan
                </p>
                {subscription.status === 'active' && (
                  <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-full border border-green-200 dark:border-green-700 animate-pulse">
                    ACTIVE
                  </span>
                )}
                {subscription.status === 'expired' && (
                  <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded-full border border-red-200 dark:border-red-700">
                    EXPIRED
                  </span>
                )}
                {subscription.status === 'canceled' && (
                  <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 rounded-full border border-yellow-300 dark:border-yellow-700 animate-pulse">
                    CANCELLED
                  </span>
                )}
              </div>
              <p className={`text-sm font-medium ${
                subscription.status === 'expired' 
                  ? 'text-red-600 dark:text-red-400' 
                  : subscription.status === 'canceled'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : subscription.status === 'active'
                  ? 'text-green-600 dark:text-green-400 font-semibold'
                  : 'text-gray-600 dark:text-gray-300'
              }`}>
                Status: {subscription.status === 'active' ? '🟢 Active' : subscription.status}
              </p>
              {subscription.currentPeriodEnd && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {subscription.status === 'expired' 
                    ? 'Expired on: ' 
                    : subscription.status === 'canceled'
                    ? 'Access ends on: '
                    : 'Next billing: '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              {(subscription.plan === 'free' || subscription.status === 'expired') && (
                <button 
                  onClick={() => document.getElementById('available-plans')?.scrollIntoView({ behavior: 'smooth' })}
                  className={`px-6 py-3 rounded-full font-semibold transition-all transform hover:scale-105 ${
                    subscription.status === 'expired'
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg hover:shadow-xl animate-pulse'
                      : 'bg-[#0fae96] text-white hover:bg-[#0fae96]/90'
                  }`}
                >
                  {subscription.status === 'expired' ? '🚀 Reactivate Now!' : 'Upgrade Plan'}
                </button>
              )}
              {subscription.plan !== 'free' && subscription.status === 'active' && (
                <button 
                  onClick={() => setShowCancelModal(true)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors border border-red-200 hover:border-red-300 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Show available plans if user has free plan, no subscription, or expired subscription (but NOT cancelled) */}
      {(subscription?.plan === 'free' || !subscription || subscription?.status === 'expired') && subscription?.status !== 'canceled' ? (
        <div id="available-plans" className="mt-8">
          {subscription?.status === 'expired' && (
            <div className="mb-8 p-6 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-300 dark:border-orange-700 rounded-xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-2">
                  🔥 Reactivate Your Subscription
                </h2>
                <p className="text-orange-700 dark:text-orange-300 text-lg">
                  Choose a plan below to restore full access to all premium features
                </p>
              </div>
            </div>
          )}
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {subscription?.status === 'expired' ? 'Choose Your Plan' : 'Choose Your Plan'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.filter(plan => plan.name !== 'Free').map((plan) => (
              <div key={plan.id} className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border p-6 relative transition-all hover:shadow-lg ${
                plan.isPopular 
                  ? subscription?.status === 'expired'
                    ? 'ring-4 ring-orange-400 shadow-xl transform scale-105 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20'
                    : 'ring-2 ring-[#0fae96] border-[#0fae96]'
                  : 'border-gray-200 dark:border-slate-700'
              }`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      subscription?.status === 'expired'
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg animate-pulse'
                        : 'bg-[#0fae96] text-white'
                    }`}>
                      {subscription?.status === 'expired' ? '⭐ BEST VALUE' : 'Most Popular'}
                    </span>
                  </div>
                )}
                
                {subscription?.status === 'expired' && plan.isPopular && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    URGENT!
                  </div>
                )}
                
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-300">/{plan.period}</span>
                    {subscription?.status === 'expired' && plan.isPopular && (
                      <div className="mt-1">
                        <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                          Limited Time: Reactivate Now!
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <ul className="mt-6 space-y-3">
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="mr-3 text-green-500">✓</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {typeof feature === 'string' ? feature : feature.text || feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleUpgradePlan(plan.id)}
                    className={`mt-6 w-full py-3 px-4 rounded-full font-medium transition-all transform hover:scale-105 ${
                      subscription?.status === 'expired' && plan.isPopular
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:shadow-xl animate-pulse'
                        : plan.isPopular 
                          ? 'bg-[#0fae96] text-white hover:bg-[#0fae96]/90' 
                          : 'border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {subscription?.status === 'expired' && plan.isPopular 
                      ? '🚀 Reactivate Now!' 
                      : subscription?.status === 'expired' 
                        ? 'Choose This Plan' 
                        : plan.cta || 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      
      {/* Message for cancelled subscriptions */}
      {subscription?.status === 'canceled' && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Subscription Management
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              Your subscription is cancelled but still active until {subscription.currentPeriodEnd && new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
              You can choose a new plan after your current access period ends.
            </p>
          </div>
        </div>
      )}
      
      {/* Account Details and Payment History */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Account Details */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Details</h3>
          </div>
          
          {user && (
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.name || 'Not provided'}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{user.email}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                    {user.isAdmin ? 'Administrator' : 'Subscriber'}
                  </dd>
                </div>
              </dl>
            </div>
          )}
        </div>
        
        {/* Payment History */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Payment History</h3>
          </div>
          
          <div className="px-6 py-4">
            {paymentHistory.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No payment history available</p>
            ) : (
              <div className="space-y-3">
                {paymentHistory.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-700 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{payment.plan} Plan</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ${payment.amount} {payment.currency.toUpperCase()}
                      </p>
                      <p className={`text-xs ${payment.status === 'succeeded' ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stripe Payment Form Modal */}
      {showPaymentForm && clientSecret && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden relative">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 rounded-t-xl">
              <div className="text-center flex-1">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Complete Your Subscription
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {selectedPlan.name} - ${selectedPlan.price}/{selectedPlan.period}
                </p>
              </div>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 ml-4"
                aria-label="Close payment form"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="p-6 pb-8">
                <PaymentFormWrapper
                  clientSecret={clientSecret}
                  amount={selectedPlan.price * 100} // Convert dollars to cents for Stripe
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentCancel}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        subscription={subscription || { plan: '', currentPeriodEnd: '' }}
      />
    </div>
  );
}