import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  CreditCard,
  Settings,
  FileText,
  Bell,
  Users,
  Activity,
  Download,
  Calendar,
  BarChart2,
  AlertOctagon,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  LineChart,
  Zap,
  RefreshCw,
  Shield,
  PieChart,
  Layers,
  MonitorPlay,
  Gauge
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line
} from 'recharts';

// Mock data for monitoring and analytics
const monitoringData = {
  configs: [
    {
      id: 'mon-1',
      site_id: 'example.com',
      frequency: 'daily',
      enabled: true,
      last_check: new Date().toISOString(),
      notification_email: 'admin@example.com',
      excluded_paths: ['/admin/*']
    },
    {
      id: 'mon-2',
      site_id: 'testsite.org',
      frequency: 'weekly',
      enabled: false,
      last_check: new Date().toISOString(),
      notification_email: 'admin@example.com',
      excluded_paths: []
    }
  ],
  alerts: [
    {
      id: 'alert-1',
      message: 'Missing alt text on images',
      type: 'error',
      created_at: new Date().toISOString(),
      acknowledged_at: null,
      data: { url: 'https://example.com/about', elements: 5, duration: 2200 }
    },
    {
      id: 'alert-2',
      message: 'Low contrast text detected',
      type: 'warning',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      acknowledged_at: null,
      data: { url: 'https://example.com/home', elements: 2, duration: 1800 }
    },
    {
      id: 'alert-3',
      message: 'Site check completed successfully',
      type: 'info',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      acknowledged_at: new Date(Date.now() - 86400000).toISOString(),
      data: { url: 'https://example.com', duration: 2500 }
    }
  ]
};

const analyticsData = {
  chartData: [
    { date: '01/01', issues: 24, fixes: 10, compliance: 65 },
    { date: '01/08', issues: 18, fixes: 14, compliance: 72 },
    { date: '01/15', issues: 15, fixes: 5, compliance: 75 },
    { date: '01/22', issues: 12, fixes: 8, compliance: 80 },
    { date: '01/29', issues: 10, fixes: 6, compliance: 85 },
    { date: '02/05', issues: 8, fixes: 7, compliance: 90 }
  ],
  issuesByType: [
    { name: 'Contrast', value: 32 },
    { name: 'Alt Text', value: 28 },
    { name: 'ARIA', value: 18 },
    { name: 'Keyboard', value: 12 },
    { name: 'Other', value: 10 }
  ]
};

export function SubscriptionDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
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

  // Helper function for alert icons
  const getAlertIcon = (type) => {
    switch (type) {
      case 'info':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Account Dashboard</h1>
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

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Gauge className="w-5 h-5 inline-block mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monitoring'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MonitorPlay className="w-5 h-5 inline-block mr-2" />
              Monitoring
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart2 className="w-5 h-5 inline-block mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell className="w-5 h-5 inline-block mr-2" />
              Alerts
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Link to="/settings" className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
                <Settings className="w-5 h-5 text-gray-600 mr-2" />
                <span>Settings</span>
              </Link>
              <Link to="/billing" className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
                <FileText className="w-5 h-5 text-gray-600 mr-2" />
                <span>Billing History</span>
              </Link>
              <Link to="/my-account/alerts" className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
                <Bell className="w-5 h-5 text-gray-600 mr-2" />
                <span>Notifications</span>
              </Link>
              <Link to="/team" className="flex items-center justify-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50">
                <Users className="w-5 h-5 text-gray-600 mr-2" />
                <span>Team</span>
              </Link>
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
              
              <div className="px-6 py-4 bg-gray-50">
                <Link to="/checker" className="text-blue-600 hover:text-blue-700 font-medium">
                  Run a new scan →
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Monitors</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {monitoringData.configs.filter(c => c.enabled).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {monitoringData.alerts.length ? 
                        `${((monitoringData.alerts.filter(a => a.type === 'info').length / monitoringData.alerts.length) * 100).toFixed(1)}%` 
                        : '0%'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <AlertOctagon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Issues Found</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {monitoringData.alerts.filter(a => a.type === 'error').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {monitoringData.alerts.length ? 
                        `${(monitoringData.alerts.reduce((sum, alert) => sum + (alert.data.duration || 0), 0) / monitoringData.alerts.length / 1000).toFixed(1)}s` 
                        : '0s'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monitoring Configs */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Monitoring Configurations</h3>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Add Monitor
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {monitoringData.configs.map(config => (
                  <div key={config.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Site ID: {config.site_id}</h4>
                        <p className="mt-1 text-sm text-gray-500">
                          Frequency: {config.frequency}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            config.enabled ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span className="sr-only">
                            {config.enabled ? 'Disable monitoring' : 'Enable monitoring'}
                          </span>
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                              config.enabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <button className="text-gray-400 hover:text-gray-500">
                          <Settings className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50">
                <Link to="/my-account/monitoring" className="text-blue-600 hover:text-blue-700 font-medium">
                  View detailed monitoring dashboard →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-indigo-100 rounded-lg">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                    <p className="text-2xl font-semibold text-gray-900">85%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Open Issues</p>
                    <p className="text-2xl font-semibold text-gray-900">24</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <RefreshCw className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Issues Fixed</p>
                    <p className="text-2xl font-semibold text-gray-900">128</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Layers className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pages Scanned</p>
                    <p className="text-2xl font-semibold text-gray-900">342</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Compliance Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="compliance" stroke="#3b82f6" name="Compliance %" />
                      <Line type="monotone" dataKey="issues" stroke="#ef4444" name="Issues" />
                      <Line type="monotone" dataKey="fixes" stroke="#10b981" name="Fixes" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Issues By Type</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.issuesByType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Number of Issues" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <Link to="/my-account/analytics" className="text-blue-600 hover:text-blue-700 font-medium">
                View detailed analytics dashboard →
              </Link>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* Alerts Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Alert Summary</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <Bell className="w-4 h-4 mr-1" />
                  {monitoringData.alerts.filter(a => !a.acknowledged_at).length} unacknowledged
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="font-medium text-red-800">Errors</span>
                  </div>
                  <p className="text-2xl font-bold text-red-700 mt-2">
                    {monitoringData.alerts.filter(a => a.type === 'error').length}
                  </p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="font-medium text-yellow-800">Warnings</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-700 mt-2">
                    {monitoringData.alerts.filter(a => a.type === 'warning').length}
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium text-green-800">Info</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700 mt-2">
                    {monitoringData.alerts.filter(a => a.type === 'info').length}
                  </p>
                </div>
              </div>
            </div>

            {/* Alerts List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
              </div>

              <div className="divide-y divide-gray-200">
                {monitoringData.alerts.map(alert => (
                  <div key={alert.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getAlertIcon(alert.type)}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!alert.acknowledged_at && (
                        <button
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                    {alert.data && Object.keys(alert.data).length > 0 && (
                      <div className="mt-2">
                        <pre className="text-xs bg-gray-50 p-2 rounded-md overflow-x-auto">
                          {JSON.stringify(alert.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-gray-50">
                <Link to="/my-account/alerts" className="text-blue-600 hover:text-blue-700 font-medium">
                  View all alerts →
                </Link>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Alert Notification Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-500">Receive alerts via email</p>
                  </div>
                  <button
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-blue-600"
                  >
                    <span className="sr-only">Enable email notifications</span>
                    <span
                      className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-5"
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Slack Notifications</p>
                    <p className="text-sm text-gray-500">Send alerts to Slack</p>
                  </div>
                  <button
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200"
                  >
                    <span className="sr-only">Enable Slack notifications</span>
                    <span
                      className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-0"
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">WebHook Notifications</p>
                    <p className="text-sm text-gray-500">Send alerts to a custom webhook</p>
                  </div>
                  <button
                    className="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 bg-gray-200"
                  >
                    <span className="sr-only">Enable webhook notifications</span>
                    <span
                      className="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 translate-x-0"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}