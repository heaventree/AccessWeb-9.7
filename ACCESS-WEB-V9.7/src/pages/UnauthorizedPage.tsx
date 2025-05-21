import React from 'react';
import { Link } from 'react-router-dom';
import { LockIcon, HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Navigation } from '../components/Navigation';
import Footer from '../components/landing/footer';

export const UnauthorizedPage: React.FC = () => {
  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-slate-900 pt-20 px-4 flex flex-col items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LockIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You don't have permission to access this page. This area is restricted to authorized users only.
            </p>
            
            <div className="flex flex-col space-y-3">
              <Link to="/">
                <Button className="w-full bg-[#0fae96] hover:bg-[#0fae96]/90 text-white rounded-full flex items-center justify-center">
                  <HomeIcon className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" className="w-full rounded-full border-gray-300 dark:border-slate-600">
                  Sign in with different account
                </Button>
              </Link>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            If you believe you should have access to this page, please contact your administrator or support team.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UnauthorizedPage;