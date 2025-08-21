import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../lib/apiClient';

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<number | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
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
      
      // Check if 2FA is required
      if (result.requiresTwoFactor) {
        setShowTwoFactor(true);
        setPendingUserId(result.userId);
        setMaskedEmail(result.email);
        return;
      }
      
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
        
        // Navigate to my-account or run callback
        if (onSuccess) {
          onSuccess();
        } else {
          // Get the redirect location from state (if any)
          const state = location.state as any;
          const from = state?.from?.pathname || '/my-account';
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

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!twoFactorCode || !pendingUserId) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await authApi.verify2FA(pendingUserId, twoFactorCode);
      
      if (result.success) {
        // Clear form and redirect
        setEmail('');
        setPassword('');
        setTwoFactorCode('');
        setShowTwoFactor(false);
        setPendingUserId(null);
        
        // Navigate to my-account or run callback
        if (onSuccess) {
          onSuccess();
        } else {
          // Get the redirect location from state (if any)
          const state = location.state as any;
          const from = state?.from?.pathname || '/my-account';
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      console.error('2FA verification error:', err);
      // Handle error display (will be shown in error state)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    setShowTwoFactor(false);
    setPendingUserId(null);
    setTwoFactorCode('');
    setMaskedEmail('');
    clearError();
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Log in to your account
      </h2>
      
      <form onSubmit={showTwoFactor ? handleTwoFactorSubmit : handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {typeof error === 'string' 
              ? error 
              : (error as any)?.message || 'An error occurred during login. Please try again.'}
          </div>
        )}
        
        {showTwoFactor && (
          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-blue-700">
                <strong>Two-factor authentication required</strong><br />
                We've sent a verification code to {maskedEmail}
              </p>
            </div>
          </div>
        )}
        
        {!showTwoFactor ? (
          <>
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
          </>
        ) : (
          <div className="mb-6">
            <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Verification Code
            </label>
            <input
              id="twoFactorCode"
              type="text"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96] text-center text-2xl font-mono tracking-widest"
              placeholder="000000"
              maxLength={6}
              autoComplete="one-time-code"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>
        )}
        
        {!showTwoFactor && (
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
        )}
        
        <div className="space-y-3">
          <button
            type="submit"
            disabled={isSubmitting || (showTwoFactor && twoFactorCode.length !== 6)}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[#0fae96] hover:bg-[#0d9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting 
              ? (showTwoFactor ? 'Verifying...' : 'Logging in...') 
              : (showTwoFactor ? 'Verify Code' : 'Log in')}
          </button>
          
          {showTwoFactor && (
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-slate-600 rounded-full shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] transition-colors"
            >
              Back to Login
            </button>
          )}
        </div>
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