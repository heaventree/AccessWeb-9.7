import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call login with isAdminLogin=false to indicate this is a regular user login
      const result = await login(email, password, { isAdminLogin: false });
      
      if (result.success) {
        setEmail('');
        setPassword('');
        
        // Handle admin redirect if needed
        if (result.isAdminRedirect && result.redirectUrl) {
          // Use alert for simplicity instead of toast
          alert('Please use the admin login page');
          
          // Redirect to admin login
          navigate(result.redirectUrl);
          return;
        }
        
        // Navigate to dashboard or run callback
        if (onSuccess) {
          onSuccess();
        } else {
          // Get the redirect location from state (if any)
          const state = location.state as any;
          const from = state?.from?.pathname || '/dashboard';
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      // Error is already handled in auth context
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Log in to your account
      </h2>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <a href="#" className="font-medium text-[#0fae96] hover:text-[#0d9a85]">
              Forgot your password?
            </a>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[#0fae96] hover:bg-[#0d9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a 
            href="/register" 
            className="font-medium text-[#0fae96] hover:text-[#0d9a85]"
            onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;