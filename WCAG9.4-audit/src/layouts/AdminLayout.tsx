import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  CreditCard,
  FileEdit,
  LogOut,
  Settings,
  Bell,
  Wallet,
  Home,
  List,
  Bug
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                AccessWeb Admin
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                <Bell className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400">
                <Settings className="w-6 h-6" />
              </button>
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg pt-16">
        <nav className="mt-5 px-2">
          <NavLink
            to="/"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-lg text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 mb-3"
          >
            <Home className="w-5 h-5 mr-3" />
            Back to Home
          </NavLink>
          <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/packages"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <Package className="w-5 h-5 mr-3" />
            Packages
          </NavLink>
          <NavLink
            to="/admin/clients"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <Users className="w-5 h-5 mr-3" />
            Clients
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <FileText className="w-5 h-5 mr-3" />
            Reports
          </NavLink>
          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <CreditCard className="w-5 h-5 mr-3" />
            Payments
          </NavLink>
          <NavLink
            to="/admin/payment-gateways"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <Wallet className="w-5 h-5 mr-3" />
            Payment Gateways
          </NavLink>
          <NavLink
            to="/admin/cms"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <FileEdit className="w-5 h-5 mr-3" />
            CMS
          </NavLink>
          <NavLink
            to="/admin/roadmap"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <List className="w-5 h-5 mr-3" />
            Roadmap Items
          </NavLink>
          <NavLink
            to="/admin/debug"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                  : 'text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`
            }
          >
            <Bug className="w-5 h-5 mr-3" />
            Debug List
          </NavLink>
        </nav>
      </div>

      {/* Main Content */}
      <main className="pl-64 pt-16">
        <div className="admin-container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}