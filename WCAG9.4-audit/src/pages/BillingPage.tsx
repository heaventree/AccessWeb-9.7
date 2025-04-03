import React, { useState } from 'react';
import { CreditCard, RefreshCw, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BillingHistory } from '../components/subscription/BillingHistory';
import { SubscriptionOverview } from '../components/subscription/SubscriptionOverview';
import { UsageAlerts } from '../components/subscription/UsageAlerts';

export function BillingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'alerts'>('overview');
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link to="/my-account" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5 inline-block mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <RefreshCw className="w-5 h-5 inline-block mr-2" />
              Billing History
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
    </div>
  );
}