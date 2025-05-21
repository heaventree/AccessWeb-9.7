import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SuperAdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      // For testing, we'll create a temporary admin user directly
      // In a real application, this would involve proper backend API calls
      if (email === 'admin@accessweb.com' && password === 'admin123') {
        // Mock a successful login and set admin privileges
        // In a real app, this would be handled by your backend
        console.log('Admin login successful');
        
        // Attempt the regular login
        await login(email, password);
        
        // Navigate to admin dashboard
        navigate('/admin');
      } else {
        setError('Invalid admin credentials. Try admin@accessweb.com / admin123');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Super Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Access the administrative dashboard
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-slate-800 py-8 px-4 shadow rounded-xl sm:px-10">
          {error && (
            <div className="mb-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-[#0fae96] focus:border-[#0fae96]"
                  placeholder="admin@accessweb.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-[#0fae96] focus:border-[#0fae96]"
                  placeholder="admin123"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#0fae96] hover:bg-[#0d9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Logging in...' : 'Sign in as Admin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;