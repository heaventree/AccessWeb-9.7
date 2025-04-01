import React from 'react';
import { MonitoringDashboard } from '../components/MonitoringDashboard';

export function MonitoringPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Accessibility Monitoring
          </h1>
          <p className="text-lg text-gray-600">
            Monitor your website's accessibility compliance in real-time
          </p>
        </div>

        <MonitoringDashboard />
      </div>
    </div>
  );
}