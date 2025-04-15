/**
 * Stripe Service
 * 
 * Provides secure payment processing functionality using Stripe API.
 * All implementation details of the Stripe API are abstracted here.
 */

import paymentsApi, { Plan, CheckoutSession, BillingPortalSession, Subscription, Invoice, SessionStatus } from './paymentsApi';
import { ErrorType, createError, logError } from '../utils/errorHandler';

/**
 * Secure Stripe payment service
 */
class StripeService {
  /**
   * Get available plans
   */
  async getPlans(): Promise<Plan[]> {
    try {
      return await paymentsApi.getPlans();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'plans_fetch_error',
        'Failed to fetch subscription plans',
        { originalError: error }
      );
    }
  }

  /**
   * Create a checkout session
   */
  async createCheckoutSession(
    planId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<CheckoutSession> {
    try {
      return await paymentsApi.createCheckoutSession(planId, successUrl, cancelUrl);
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'checkout_creation_error',
        'Failed to create checkout session',
        { originalError: error, planId }
      );
    }
  }

  /**
   * Create a billing portal session
   */
  async createBillingPortalSession(returnUrl: string): Promise<BillingPortalSession> {
    try {
      return await paymentsApi.createBillingPortalSession(returnUrl);
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'billing_portal_error',
        'Failed to create billing portal session',
        { originalError: error }
      );
    }
  }

  /**
   * Get current subscription
   */
  async getCurrentSubscription(): Promise<Subscription | null> {
    try {
      return await paymentsApi.getCurrentSubscription();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'subscription_fetch_error',
        'Failed to fetch subscription details',
        { originalError: error }
      );
    }
  }

  /**
   * Get invoices
   */
  async getInvoices(): Promise<Invoice[]> {
    try {
      return await paymentsApi.getInvoices();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'invoices_fetch_error',
        'Failed to fetch invoices',
        { originalError: error }
      );
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<Subscription> {
    try {
      return await paymentsApi.cancelSubscription();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'subscription_cancel_error',
        'Failed to cancel subscription',
        { originalError: error }
      );
    }
  }

  /**
   * Reactivate subscription
   */
  async reactivateSubscription(): Promise<Subscription> {
    try {
      return await paymentsApi.reactivateSubscription();
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'subscription_reactivate_error',
        'Failed to reactivate subscription',
        { originalError: error }
      );
    }
  }

  /**
   * Check session status
   */
  async checkSessionStatus(sessionId: string): Promise<SessionStatus> {
    try {
      return await paymentsApi.checkSessionStatus(sessionId);
    } catch (error) {
      logError(error);
      throw createError(
        ErrorType.API,
        'session_status_error',
        'Failed to check session status',
        { originalError: error, sessionId }
      );
    }
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(price / 100); // Stripe uses cents
  }

  /**
   * Get interval display text
   */
  getIntervalDisplay(interval: 'month' | 'year'): string {
    return interval === 'month' ? 'monthly' : 'yearly';
  }
}

export default new StripeService();