import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';
import {
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search
} from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

interface DashboardLayoutProps {
  menuItems: MenuItem[];
  title: string;
  showBackToHome?: boolean;
  notifications?: number;
  userAvatar?: string;
  userName?: string;
}

export function DashboardLayout({
  menuItems,
  title,
  showBackToHome = false,
  notifications = 0,
  userAvatar = '',
  userName = 'User'
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-white dark:bg-gray-800 p-2 m-2 text-primary-600 dark:text-primary-400">
        Skip to main content
      </a>

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Left section: Logo and hamburger */}
          <div className="flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="mr-2 text-gray-500 dark:text-gray-400 md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <button 
              onClick={toggleSidebar}
              className="mr-4 text-gray-500 dark:text-gray-400 hidden md:flex hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-2 transition-colors"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4]"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">AccessWeb<span className="text-[#0fae96] dark:text-[#5eead4]">Pro</span></span>
              </Link>
              <span className="text-xl font-medium text-gray-600 dark:text-gray-400 ml-2 border-l border-gray-200 dark:border-gray-700 pl-2">
                {title}
              </span>
            </div>
          </div>

          {/* Right section: Search, Notifications, Settings, Theme, Avatar */}
          <div className="flex items-center space-x-3">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="search" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:ring-[#0fae96] focus:border-[#0fae96] transition-colors"
                placeholder="Search..." 
              />
            </div>

            <button 
              className="p-2 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-[#0fae96] dark:bg-[#5eead4] rounded-full"></span>
              )}
            </button>

            <button 
              className="p-2 text-gray-500 rounded-full hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <ThemeToggle />

            {/* User Avatar/Info */}
            <div className="relative hidden md:block">
              <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={`${userName}'s avatar`} 
                    className="w-8 h-8 rounded-full border-2 border-[#0fae96]/20" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center text-[#0fae96] dark:text-[#5eead4] text-sm font-medium">
                    {userName.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium">{userName}</span>
              </button>
            </div>

            <div className="relative ml-1">
              <button 
                className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden md:inline ml-2">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out pt-16 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
        }`}
      >
        <div className="h-full px-3 py-6 overflow-y-auto">
          <nav className="space-y-1 mt-2">
            {showBackToHome && (
              <>
                <NavLink
                  to="/"
                  className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[#e0f5f1] dark:hover:bg-[#0fae96]/20 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors"
                >
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {sidebarOpen && <span>Back to Home</span>}
                  </span>
                </NavLink>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              </>
            )}

            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? 'bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-[#e0f5f1] dark:hover:bg-[#0fae96]/20 hover:text-[#0fae96] dark:hover:text-[#5eead4]'
                  }`
                }
                title={!sidebarOpen ? item.label : undefined}
              >
                {({ isActive }) => (
                  <span className="flex items-center">
                    <span className={`${sidebarOpen ? 'mr-3' : ''} ${isActive ? 'text-[#0fae96] dark:text-[#5eead4]' : 'text-gray-500 dark:text-gray-400'}`}>
                      {item.icon}
                    </span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 overflow-y-auto rounded-r-2xl shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-xl bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4 text-[#0fae96] dark:text-[#5eead4]"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">AccessWeb<span className="text-[#0fae96] dark:text-[#5eead4]">Pro</span></h2>
              </div>
              <button 
                onClick={toggleMobileMenu}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {showBackToHome && (
                <>
                  <NavLink
                    to="/"
                    className="flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 hover:bg-[#e0f5f1] dark:hover:bg-[#0fae96]/20 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span>Back to Home</span>
                    </span>
                  </NavLink>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                </>
              )}

              {menuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                      isActive
                        ? 'bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4]'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-[#e0f5f1] dark:hover:bg-[#0fae96]/20 hover:text-[#0fae96] dark:hover:text-[#5eead4]'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <span className="flex items-center">
                      <span className={`mr-3 ${isActive ? 'text-[#0fae96] dark:text-[#5eead4]' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </span>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main 
        id="main-content" 
        className={`pt-[130px] min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? 'md:pl-64' 
            : 'md:pl-20'
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}