import { useState } from 'react';
import { CreditCard, RefreshCw, Download } from 'lucide-react';
import { BillingHistory } from '../components/subscription/BillingHistory';
import { SubscriptionOverview } from '../components/subscription/SubscriptionOverview';
import { UsageAlerts } from '../components/subscription/UsageAlerts';

export function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'alerts'>('overview');
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Billing & Subscription
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage your billing information and subscription details
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-5 h-5 inline-block mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <RefreshCw className="w-5 h-5 inline-block mr-2" />
            Billing History
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'alerts'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400 dark:border-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Download className="w-5 h-5 inline-block mr-2" />
            Usage & Alerts
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <SubscriptionOverview subscriptionId="current" />
        )}
        
        {activeTab === 'history' && (
          <BillingHistory />
        )}
        
        {activeTab === 'alerts' && (
          <UsageAlerts />
        )}
      </div>
    </div>
  );
}