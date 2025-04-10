import { paymentsApi } from './api';
import { DEVELOPMENT_MODE } from '../hooks/useAuth';

// Stripe API client
class StripeService {
  // Get available subscription plans
  async getPlans() {
    try {
      if (DEVELOPMENT_MODE) {
        return this.mockGetPlans();
      }
      return await paymentsApi.getPlans();
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  }
  
  // Create a checkout session for a specific plan
  async createCheckoutSession(planId: string, successUrl: string, cancelUrl: string) {
    try {
      if (DEVELOPMENT_MODE) {
        return this.mockCreateCheckoutSession();
      }
      return await paymentsApi.createCheckoutSession(planId, successUrl, cancelUrl);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
  
  // Create a billing portal session for managing subscriptions
  async createBillingPortalSession(returnUrl: string) {
    try {
      if (DEVELOPMENT_MODE) {
        return {
          url: returnUrl
        };
      }
      return await paymentsApi.createBillingPortalSession(returnUrl);
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw error;
    }
  }
  
  // Get subscription details for the current user
  async getCurrentSubscription() {
    try {
      if (DEVELOPMENT_MODE) {
        return this.mockCurrentSubscription();
      }
      return await paymentsApi.getCurrentSubscription();
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }
  
  // Get invoice history for the current user
  async getInvoices() {
    try {
      if (DEVELOPMENT_MODE) {
        return this.mockInvoices();
      }
      return await paymentsApi.getInvoices();
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }
  
  // Cancel the current subscription
  async cancelSubscription() {
    try {
      if (DEVELOPMENT_MODE) {
        return {
          success: true,
          message: 'Subscription canceled in development mode'
        };
      }
      return await paymentsApi.cancelSubscription();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }
  
  // Reactivate a canceled subscription
  async reactivateSubscription() {
    try {
      if (DEVELOPMENT_MODE) {
        return {
          success: true,
          message: 'Subscription reactivated in development mode'
        };
      }
      return await paymentsApi.reactivateSubscription();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }
  
  // Check session status after checkout
  async checkSessionStatus(sessionId: string) {
    try {
      if (DEVELOPMENT_MODE) {
        return {
          success: true,
          subscription: this.mockCurrentSubscription().subscription
        };
      }
      return await paymentsApi.checkSessionStatus(sessionId);
    } catch (error) {
      console.error('Error checking session status:', error);
      throw error;
    }
  }
  
  // Mock methods for development mode
  mockGetPlans() {
    return {
      plans: [
        {
          id: 'basic',
          name: 'Basic',
          description: 'For small websites and blogs',
          priceMonthly: 29,
          priceYearly: 290, // 10 months price for annual billing
          features: [
            'Single website scanning',
            'Basic WCAG 2.2 compliance reports',
            'Automated issue detection',
            'Email notifications',
            'Monthly scan limit: 5',
          ],
          isPopular: false
        },
        {
          id: 'professional',
          name: 'Professional',
          description: 'For businesses and organizations',
          priceMonthly: 99,
          priceYearly: 990,
          features: [
            'Up to 5 websites',
            'Full WCAG 2.2 compliance reporting',
            'Real-time monitoring',
            'API access',
            'Priority email support',
            'Monthly scan limit: 20',
          ],
          isPopular: true
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          description: 'For large organizations with multiple sites',
          priceMonthly: 299,
          priceYearly: 2990,
          features: [
            'Unlimited websites',
            'Custom compliance profiles',
            'Advanced reporting',
            'Dedicated account manager',
            'Unlimited API access',
            'Phone support',
            'Unlimited scans',
            'Custom integrations',
          ],
          isPopular: false
        }
      ]
    };
  }
  
  mockCreateCheckoutSession() {
    // In development mode, we'll simulate a successful checkout
    return {
      sessionId: 'mock_cs_test_' + Math.random().toString(36).substring(2, 15),
      sessionUrl: 'http://localhost:3000/mock-checkout-success'
    };
  }
  
  mockCurrentSubscription() {
    return {
      subscription: {
        id: 'sub_mock123',
        status: 'active',
        planId: 'professional',
        planName: 'Professional',
        currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        cancelAtPeriodEnd: false,
        paymentMethod: {
          brand: 'visa',
          last4: '4242'
        }
      }
    };
  }
  
  mockInvoices() {
    return {
      invoices: [
        {
          id: 'inv_mock001',
          number: 'INV-001',
          amount: 99,
          currency: 'usd',
          status: 'paid',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          pdfUrl: '#'
        },
        {
          id: 'inv_mock002',
          number: 'INV-002',
          amount: 99,
          currency: 'usd',
          status: 'paid',
          date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          pdfUrl: '#'
        }
      ]
    };
  }
}

export const stripeService = new StripeService();