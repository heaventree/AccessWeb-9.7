import { useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import { PaymentFormWrapper } from '../components/PaymentForm';

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
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Plan</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-[#0fae96] capitalize">{subscription.plan} Plan</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Status: {subscription.status}</p>
              {subscription.currentPeriodEnd && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Next billing: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
            {subscription.plan === 'free' && (
              <button 
                onClick={() => document.getElementById('available-plans')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#0fae96] text-white px-6 py-2 rounded-full hover:bg-[#0fae96]/90 transition-colors"
              >
                Upgrade Plan
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Show available plans if user has free plan or no subscription */}
      {subscription?.plan === 'free' || !subscription ? (
        <div id="available-plans" className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Choose Your Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.filter(plan => plan.name !== 'Free').map((plan) => (
              <div key={plan.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 relative">
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#0fae96] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{plan.description}</p>
                  
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-300">/{plan.period}</span>
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
                    className={`mt-6 w-full py-3 px-4 rounded-full font-medium transition-colors ${
                      plan.isPopular 
                        ? 'bg-[#0fae96] text-white hover:bg-[#0fae96]/90' 
                        : 'border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {plan.cta || 'Get Started'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Complete Your Subscription
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedPlan.name} - ${selectedPlan.price}/{selectedPlan.period}
              </p>
            </div>
            
            <PaymentFormWrapper
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}