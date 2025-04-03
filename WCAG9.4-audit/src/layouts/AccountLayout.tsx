import { useState } from 'react';
import { format } from 'date-fns';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  CreditCard,
  Settings,
  Bell,
  Users,
  Activity,
  Menu,
  BarChart2,
  MonitorPlay,
  Gauge,
  XCircle
} from 'lucide-react';

// Mock subscription data
const subscription = {
  plan: 'Professional',
  status: 'active',
  nextBilling: new Date(2024, 2, 15),
};

export function AccountLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Navigation items for the account sidebar
  const navigationItems = [
    { name: 'Overview', icon: Gauge, value: 'overview', path: '/my-account' },
    { name: 'Monitoring', icon: MonitorPlay, value: 'monitoring', path: '/my-account/monitoring' },
    { name: 'Analytics', icon: BarChart2, value: 'analytics', path: '/my-account/analytics' },
    { name: 'Alerts', icon: Bell, value: 'alerts', path: '/my-account/alerts' },
    { name: 'Connections', icon: Activity, value: 'connections', path: '/my-account/connections' },
    { name: 'Settings', icon: Settings, value: 'settings', path: '/my-account/settings' },
    { name: 'Billing', icon: CreditCard, value: 'billing', path: '/my-account/billing' },
    { name: 'Team', icon: Users, value: 'team', path: '/my-account/team' }
  ];

  // Helper function to check if the current path is active
  const isActive = (path: string) => {
    // Handle the root account path differently
    if (path === '/my-account' && location.pathname === '/my-account') {
      return true;
    }
    
    // For other paths, check if the current location starts with the path
    return location.pathname !== '/my-account' && location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-full">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-300 md:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <h2 className="text-lg font-medium text-gray-900">Account Dashboard</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-4 px-4">
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.value}
                to={item.path}
                className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.path) ? 'text-blue-500' : 'text-gray-400'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-md bg-blue-50 p-4">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <span className="ml-2 text-sm font-medium text-blue-700">Current Plan</span>
            </div>
            <p className="mt-1 text-lg font-medium text-blue-900">{subscription.plan}</p>
            <p className="text-xs text-blue-600">
              Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <div className="flex flex-col px-6 py-6">
          <h1 className="mb-6 text-lg font-semibold text-gray-900">Account Dashboard</h1>
          <nav className="flex-1 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.value}
                to={item.path}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive(item.path)
                      ? 'text-blue-500'
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="mt-auto">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <span className="ml-2 text-sm font-medium text-blue-700">Current Plan</span>
              </div>
              <p className="mt-1 text-lg font-medium text-blue-900">{subscription.plan}</p>
              <p className="text-xs text-blue-600">
                Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
              </p>
              <button
                className="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-16 items-center border-b border-gray-200 bg-white px-4">
          <button
            type="button"
            className="mr-4 text-gray-500 hover:text-gray-700 md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-medium text-gray-900 md:hidden">
              {navigationItems.find((item) => isActive(item.path))?.name || 'Account'}
            </h1>
            <div className="ml-auto flex items-center">
              <button
                type="button"
                className="rounded-full p-1 text-gray-400 hover:text-gray-500"
              >
                <Bell className="h-6 w-6" />
              </button>
              <div className="ml-3 flex items-center">
                <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <span className="ml-2 hidden text-sm font-medium text-gray-700 md:block">
                  John Doe
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}