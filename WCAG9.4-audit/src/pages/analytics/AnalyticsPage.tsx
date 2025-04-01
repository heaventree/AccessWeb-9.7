import React from 'react';
import { BarChart2, TrendingUp, Users, Activity } from 'lucide-react';
import { AnalyticsDashboard } from '../../components/analytics/AnalyticsDashboard';

export function AnalyticsPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Accessibility Analytics
          </h1>
          <p className="text-lg text-gray-600">
            Track and analyze your website's accessibility metrics
          </p>
        </div>

        <AnalyticsDashboard />
      </div>
    </div>
  );
}