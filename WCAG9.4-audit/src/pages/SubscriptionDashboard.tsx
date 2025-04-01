import React from 'react';
import { format } from 'date-fns';
import {
  CreditCard,
  Settings,
  FileText,
  Bell,
  Users,
  Activity,
  Download,
  Calendar
} from 'lucide-react';

export function SubscriptionDashboard() {
  const subscription = {
    plan: 'Professional',
    status: 'active',
    nextBilling: new Date(2024, 2, 15),
    paymentMethod: '**** **** **** 4242',
    usageStats: {
      scansThisMonth: 45,
      totalScans: 156,
      pagesScanned: 225,
      teamMembers: 3
    },
    recentScans: [
      {
        id: 1,
        url: 'https://example.com',
        date: new Date(2024, 1, 28),
        issues: 12
      },
      {
        id: 2,
        url: 'https://test.com',
        date: new Date(2024, 1, 27),
        issues: 5
      }
    ]
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Subscription Dashboard</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Upgrade Plan
          </button>
        </div>

        {/* Subscription Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
              <p className="text-3xl font-bold text-blue-600 mt-2">{subscription.plan}</p>
              <p className="text-sm text-gray-600 mt-1">
                Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              <div className="flex items-center mt-2">
                <CreditCard className="w-6 h-6 text-gray-400 mr-2" />
                <p className="text-gray-600">{subscription.paymentMethod}</p>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Status</h2>
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {subscription.usageStats.teamMembers}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
            <Settings className="w-5 h-5 text-gray-600 mr-2" />
            <span>Settings</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
            <FileText className="w-5 h-5 text-gray-600 mr-2" />
            <span>Billing History</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
            <Bell className="w-5 h-5 text-gray-600 mr-2" />
            <span>Notifications</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
            <Users className="w-5 h-5 text-gray-600 mr-2" />
            <span>Team</span>
          </button>
        </div>

        {/* Usage Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Activity className="w-6 h-6 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Scans This Month</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {subscription.usageStats.scansThisMonth}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Calendar className="w-6 h-6 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Total Scans</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {subscription.usageStats.totalScans}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Download className="w-6 h-6 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Pages Scanned</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {subscription.usageStats.pagesScanned}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <Users className="w-6 h-6 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {subscription.usageStats.teamMembers}
            </p>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Scans</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {subscription.recentScans.map((scan) => (
              <div key={scan.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{scan.url}</p>
                    <p className="text-sm text-gray-500">
                      {format(scan.date, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {scan.issues} issues
                    </span>
                    <button className="ml-4 text-blue-600 hover:text-blue-700">
                      View Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}