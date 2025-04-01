import React from 'react';
import { Shield, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { ComplianceDashboard } from '../../components/compliance/ComplianceDashboard';

export function CompliancePage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Compliance Monitoring
          </h1>
          <p className="text-lg text-gray-600">
            Monitor and maintain compliance with accessibility standards
          </p>
        </div>

        <ComplianceDashboard />
      </div>
    </div>
  );
}