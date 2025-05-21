import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminDirectAccess: React.FC = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const secretAdminKey = 'AccessWeb2025!';

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === secretAdminKey) {
      // Simulate successful login with admin privileges
      localStorage.setItem('admin_access_token', 'demo_admin_jwt_token');
      localStorage.setItem('admin_user', JSON.stringify({
        id: 1,
        name: 'Admin User',
        email: 'admin@accessweb.com',
        isAdmin: true
      }));
      
      setIsRedirecting(true);
    } else {
      setError('Invalid admin key');
    }
  };
  
  if (isRedirecting) {
    return <Navigate to="/admin" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Direct Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter the admin key to access the admin panel
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleAdminAccess}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="admin-key" className="sr-only">Admin Key</label>
              <input
                id="admin-key"
                type="password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-slate-700 focus:outline-none focus:ring-[#0fae96] focus:border-[#0fae96] focus:z-10 sm:text-sm"
                placeholder="Admin Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-[#0fae96] hover:bg-[#0d9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96]"
            >
              Access Admin Panel
            </button>
          </div>
        </form>
        
        <div className="mt-6">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Hint: The admin key is AccessWeb2025!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDirectAccess;