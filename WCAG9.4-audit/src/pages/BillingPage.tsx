import React from 'react';
import { BillingHistory } from '../components/subscription/BillingHistory';
import { SubscriptionOverview } from '../components/subscription/SubscriptionOverview';
import { UsageAlerts } from '../components/subscription/UsageAlerts';

export function BillingPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Billing & Subscription
          </h1>
          <p className="text-lg text-gray-600">
            Manage your subscription, billing information, and view payment history
          </p>
        </div>

        <div className="space-y-8">
          <SubscriptionOverview subscriptionId="current" />
          <UsageAlerts />
          <BillingHistory />
        </div>
      </div>
    </div>
  );
}