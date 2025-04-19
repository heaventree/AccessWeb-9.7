import React from 'react';
import { CreditCard, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { FeatureUsageChart } from './FeatureUsageChart';
import { SubscriptionStatus } from './SubscriptionStatus';

interface SubscriptionOverviewProps {
  subscriptionId: string;
}

export function SubscriptionOverview({ subscriptionId }: SubscriptionOverviewProps) {
  const {
    status,
    loading,
    error,
    getFeatureValue,
    getFeatureLimit,
    getUsage
  } = useSubscription(subscriptionId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error || 'Failed to load subscription details'}
      </div>
    );
  }

  const features = Object.entries(status.features).map(([key, value]) => ({
    key,
    ...value,
    usage: status.usage[key]
  }));

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Plan</p>
              <p className="text-2xl font-semibold text-gray-900">{status.plan}</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <SubscriptionStatus status={status.status} />
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Billing</p>
              <p className="text-2xl font-semibold text-gray-900">Mar 19</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usage Alerts</p>
              <p className="text-2xl font-semibold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Usage */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Feature Usage</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {features.map(feature => (
              <div key={feature.key}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {feature.key.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {feature.current_value} / {feature.max_value || '∞'}
                  </span>
                </div>
                <FeatureUsageChart
                  current={feature.current_value}
                  max={feature.max_value}
                  usage={feature.usage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Usage History</h3>
        </div>
        <div className="p-6">
          {/* Add usage history visualization here */}
        </div>
      </div>
    </div>
  );
}