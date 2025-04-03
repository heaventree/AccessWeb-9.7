import { useState } from 'react';
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
  RefreshCw,
  Shield,
  Layers,
  MonitorPlay,
  Gauge,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Navigation items
  const navigationItems = [
    { name: 'Overview', icon: Gauge, value: 'overview' },
    { name: 'Monitoring', icon: MonitorPlay, value: 'monitoring' },
    { name: 'Analytics', icon: BarChart2, value: 'analytics' },
    { name: 'Alerts', icon: Bell, value: 'alerts' }
  ];
  
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
  const getAlertIcon = (type: string) => {
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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${mobileSidebarOpen ? 'visible' : 'invisible'}`} role="dialog" aria-modal="true">
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
            mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-hidden="true"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
        
        <div
          className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transition ease-in-out duration-300 transform ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="px-4 pt-5 pb-4 flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">Account</h1>
            </div>
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XCircle className="h-6 w-6 text-gray-400" aria-hidden="true" />
            </button>
          </div>
          
          <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setActiveTab(item.value);
                    setMobileSidebarOpen(false);
                  }}
                  className={`${
                    activeTab === item.value
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md w-full`}
                >
                  <item.icon
                    className={`${
                      activeTab === item.value ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-4 flex-shrink-0 h-6 w-6`}
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 mb-5">
                <h1 className="text-xl font-semibold text-gray-900">Account Dashboard</h1>
              </div>
              
              <nav className="mt-5 flex-1 px-4 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setActiveTab(item.value)}
                    className={`${
                      activeTab === item.value
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full`}
                  >
                    <item.icon
                      className={`${
                        activeTab === item.value ? 'text-gray-800' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </button>
                ))}
              </nav>

              <div className="mt-auto px-4 pb-2">
                <div className="py-3 px-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CreditCard className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-800">Current Plan</span>
                  </div>
                  <p className="text-lg font-semibold text-blue-900">{subscription.plan}</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
                  </p>
                  <button className="mt-3 w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors">
                    Manage Subscription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm">
          <button
            type="button"
            className="px-4 md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6 text-gray-500" aria-hidden="true" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 md:hidden">{navigationItems.find(item => item.value === activeTab)?.name}</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>

              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">John Doe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Content header with action buttons */}
              <div className="md:flex md:items-center md:justify-between pb-4 border-b border-gray-200 mb-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate hidden md:block">
                    {navigationItems.find(item => item.value === activeTab)?.name}
                  </h2>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
                  {activeTab === 'overview' && (
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </button>
                  )}
                  {activeTab === 'monitoring' && (
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Add Monitor
                    </button>
                  )}
                  {activeTab === 'analytics' && (
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </button>
                  )}
                  {activeTab === 'alerts' && (
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Acknowledge All
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                            <Activity className="h-6 w-6 text-blue-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Scans This Month</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {subscription.usageStats.scansThisMonth}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                            <Calendar className="h-6 w-6 text-green-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Total Scans</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {subscription.usageStats.totalScans}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                            <Download className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Pages Scanned</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {subscription.usageStats.pagesScanned}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                            <Users className="h-6 w-6 text-purple-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Team Members</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {subscription.usageStats.teamMembers}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                      <Link to="/settings" className="flex flex-col items-center p-6 hover:bg-gray-50">
                        <Settings className="w-8 h-8 text-gray-500 mb-3" />
                        <span className="text-sm font-medium text-gray-900">Settings</span>
                      </Link>
                      <Link to="/billing" className="flex flex-col items-center p-6 hover:bg-gray-50">
                        <FileText className="w-8 h-8 text-gray-500 mb-3" />
                        <span className="text-sm font-medium text-gray-900">Billing History</span>
                      </Link>
                      <Link to="/my-account/alerts" className="flex flex-col items-center p-6 hover:bg-gray-50">
                        <Bell className="w-8 h-8 text-gray-500 mb-3" />
                        <span className="text-sm font-medium text-gray-900">Notifications</span>
                      </Link>
                      <Link to="/team" className="flex flex-col items-center p-6 hover:bg-gray-50">
                        <Users className="w-8 h-8 text-gray-500 mb-3" />
                        <span className="text-sm font-medium text-gray-900">Team</span>
                      </Link>
                    </div>
                  </div>

                  {/* Recent Scans */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Scans</h3>
                      <Link to="/checker" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        Run a new scan
                      </Link>
                    </div>
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              URL
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Issues
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {subscription.recentScans.map((scan) => (
                            <tr key={scan.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {scan.url}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(scan.date, 'MMM d, yyyy')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {scan.issues} issues
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href="#" className="text-blue-600 hover:text-blue-900">View Report</a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Monitoring Tab */}
              {activeTab === 'monitoring' && (
                <div className="space-y-6">
                  {/* Status Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                            <Activity className="h-6 w-6 text-blue-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Active Monitors</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {monitoringData.configs.filter(c => c.enabled).length}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                            <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {monitoringData.alerts.length ? 
                                    `${((monitoringData.alerts.filter(a => a.type === 'info').length / monitoringData.alerts.length) * 100).toFixed(1)}%` 
                                    : '0%'}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                            <AlertOctagon className="h-6 w-6 text-red-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Issues Found</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {monitoringData.alerts.filter(a => a.type === 'error').length}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                            <Clock className="h-6 w-6 text-purple-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Time</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">
                                  {monitoringData.alerts.length ? 
                                    `${(monitoringData.alerts.reduce((sum, alert) => sum + (alert.data.duration || 0), 0) / monitoringData.alerts.length / 1000).toFixed(1)}s` 
                                    : '0s'}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring Configurations */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Monitoring Configurations</h3>
                    </div>
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Site ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Frequency
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Last Check
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {monitoringData.configs.map((config) => (
                            <tr key={config.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {config.site_id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {config.frequency}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {config.enabled ? 'Active' : 'Disabled'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(config.last_check).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                <button className={`${
                                  config.enabled ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                                }`}>
                                  {config.enabled ? 'Disable' : 'Enable'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
                      <Link to="/my-account/monitoring" className="text-sm font-medium text-blue-600 hover:text-blue-700">
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
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                            <Shield className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Compliance Score</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">85%</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                            <Layers className="h-6 w-6 text-blue-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Issues Fixed</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">42</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                            <RefreshCw className="h-6 w-6 text-yellow-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Issues Remaining</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">18</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                            <Activity className="h-6 w-6 text-green-600" aria-hidden="true" />
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">Weekly Checks</dt>
                              <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">7</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Compliance Trend</h3>
                      </div>
                      <div className="p-6">
                        <div className="h-80">
                          {/* Placeholder for chart */}
                          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <LineChart className="w-10 h-10 mb-2 text-blue-500 mx-auto" />
                              <p className="text-gray-600">Compliance trend chart showing improving metrics over time</p>
                              <p className="text-gray-400 text-sm mt-1">Shows compliance increases from 65% to 90% over 6 weeks</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Issues By Type</h3>
                      </div>
                      <div className="p-6">
                        <div className="h-80">
                          {/* Placeholder for chart */}
                          <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <BarChart2 className="w-10 h-10 mb-2 text-purple-500 mx-auto" />
                              <p className="text-gray-600">Issues breakdown by category</p>
                              <p className="text-gray-400 text-sm mt-1">Contrast: 32, Alt Text: 28, ARIA: 18, Keyboard: 12, Other: 10</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-4 bg-white shadow rounded-lg text-right">
                    <Link to="/my-account/analytics" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      View detailed analytics dashboard →
                    </Link>
                  </div>
                </div>
              )}

              {/* Alerts Tab */}
              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  {/* Alerts Summary */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Alert Summary</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Bell className="w-3 h-3 mr-1" />
                        {monitoringData.alerts.filter(a => !a.acknowledged_at).length} unacknowledged
                      </span>
                    </div>
                    <div className="p-6">
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
                  </div>

                  {/* Alerts List */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Alerts</h3>
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
                    
                    <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
                      <Link to="/my-account/alerts" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View all alerts →
                      </Link>
                    </div>
                  </div>
                  
                  {/* Notification Settings */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Alert Notification Settings</h3>
                    </div>
                    <div className="p-6">
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
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}