import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * Main admin dashboard for managing Strapi CMS content
 */
const AdminDashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState('dashboard');
  const [contentStats, setContentStats] = useState({
    totalPages: 0,
    publishedPages: 0,
    draftPages: 0
  });
  const [recentPages, setRecentPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/admin' || path === '/admin/') {
      setActivePage('dashboard');
    } else if (path.startsWith('/admin/content')) {
      setActivePage('content');
    } else if (path.startsWith('/admin/navigation')) {
      setActivePage('navigation');
    } else if (path.startsWith('/admin/settings')) {
      setActivePage('settings');
    }
  }, [location]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch content stats
        const statsResponse = await axios.get('/api/cms/stats');
        setContentStats(statsResponse.data);
        
        // Fetch recent pages
        const recentPagesResponse = await axios.get('/api/cms/pages/recent');
        setRecentPages(recentPagesResponse.data.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (activePage === 'dashboard') {
      fetchDashboardData();
    }
  }, [activePage]);

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-[#0fae96] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Total Pages</h3>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{contentStats.totalPages}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Published Pages</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{contentStats.publishedPages}</p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Draft Pages</h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{contentStats.draftPages}</p>
          </div>
        </div>
        
        {/* Recent Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700 mb-8">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Content</h2>
            <Link
              to="/admin/content"
              className="text-sm text-[#0fae96] hover:text-[#0c9a85] dark:text-[#5eead4] dark:hover:text-[#4fd0bd]"
            >
              View All
            </Link>
          </div>
          
          {recentPages.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No content created yet.</p>
              <Link
                to="/admin/content/create"
                className="mt-4 inline-block px-4 py-2 bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium rounded-full transition-colors"
              >
                Create Your First Page
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-slate-700">
              {recentPages.map((page) => (
                <div key={page.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">{page.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {page.draftStatus ? 'Draft' : 'Published'} • Last updated: {new Date(page.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/content/edit/${page.id}`}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/admin/content/preview/${page.id}`}
                        className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        Preview
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/content/create')}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-[#0fae96] dark:text-[#5eead4]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">Create New Page</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/content')}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-[#0fae96] dark:text-[#5eead4]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">Manage Content</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/navigation')}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-[#0fae96] dark:text-[#5eead4]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">Manage Navigation</span>
            </button>
            
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex items-center justify-center space-x-2 p-4 border border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-[#0fae96] dark:text-[#5eead4]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span className="font-medium text-gray-700 dark:text-gray-300">Settings</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Admin header */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link to="/" className="font-medium text-gray-900 dark:text-white flex items-center">
              <img src="/logo.svg" alt="AccessWeb" className="h-8 w-auto mr-2" />
              <span>AccessWeb</span>
            </Link>
            <span className="text-gray-400 dark:text-gray-500">/</span>
            <span className="font-medium text-[#0fae96] dark:text-[#5eead4]">Admin</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              aria-label="Toggle dark mode"
              onClick={() => document.documentElement.classList.toggle('dark')}
            >
              <svg className="hidden dark:block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg className="block dark:hidden h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            
            {/* Admin user dropdown - simplified for demo */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#0fae96] flex items-center justify-center text-white font-medium">
                  A
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar navigation */}
          <aside className="md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700 sticky top-24">
              <nav className="p-4 space-y-1">
                <Link
                  to="/admin"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    activePage === 'dashboard'
                      ? 'bg-[#0fae96] bg-opacity-10 text-[#0fae96] dark:text-[#5eead4]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </div>
                </Link>
                
                <Link
                  to="/admin/content"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    activePage === 'content'
                      ? 'bg-[#0fae96] bg-opacity-10 text-[#0fae96] dark:text-[#5eead4]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Content Manager
                  </div>
                </Link>
                
                <Link
                  to="/admin/navigation"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    activePage === 'navigation'
                      ? 'bg-[#0fae96] bg-opacity-10 text-[#0fae96] dark:text-[#5eead4]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Navigation
                  </div>
                </Link>
                
                <Link
                  to="/admin/settings"
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    activePage === 'settings'
                      ? 'bg-[#0fae96] bg-opacity-10 text-[#0fae96] dark:text-[#5eead4]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </div>
                </Link>
                
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-700">
                  <Link
                    to="/"
                    className="block px-4 py-2 rounded-lg transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Site
                    </div>
                  </Link>
                </div>
              </nav>
            </div>
          </aside>
          
          {/* Main content area */}
          <main className="flex-1">
            {location.pathname === '/admin' || location.pathname === '/admin/' ? renderDashboard() : <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;