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
import { Navigation } from '../components/Navigation';

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
    <>
      <Navigation />
      <div className="bg-gray-50 flex h-full">
        {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          mobileSidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 flex w-full max-w-xs flex-col bg-white">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Account Dashboard</h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          <div className="overflow-y-auto pt-4">
            <nav className="flex-1 space-y-1 px-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.value}
                  to={item.path}
                  className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-4 h-6 w-6 flex-shrink-0 ${
                      isActive(item.path)
                        ? 'text-gray-900'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-blue-500" />
                <span className="ml-2 text-sm font-medium text-blue-800">Current Plan</span>
              </div>
              <p className="mt-1 text-lg font-semibold text-blue-900">{subscription.plan}</p>
              <p className="mt-1 text-xs text-blue-700">
                Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-col px-4 pt-5">
            <div className="mb-6">
              <h1 className="text-xl font-semibold text-gray-900">Account Dashboard</h1>
            </div>
            <nav className="flex-1 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.value}
                  to={item.path}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    isActive(item.path)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive(item.path)
                        ? 'text-gray-900'
                        : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="mt-auto py-4">
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <span className="ml-2 text-sm font-medium text-blue-800">Current Plan</span>
                </div>
                <p className="mt-1 text-lg font-semibold text-blue-900">{subscription.plan}</p>
                <p className="mt-1 text-xs text-blue-700">
                  Next billing: {format(subscription.nextBilling, 'MMM d, yyyy')}
                </p>
                <button
                  className="mt-3 w-full rounded-md bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top nav */}
        <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 md:hidden"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900 md:hidden">
                {navigationItems.find((item) => isActive(item.path))?.name || 'Account'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="rounded-full p-1 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative ml-3">
                <div className="flex items-center">
                  <span className="inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      className="h-full w-full text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
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
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-gray-50 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  );
}