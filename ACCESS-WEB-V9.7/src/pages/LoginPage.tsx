/**
 * Login Page Component
 * 
 * Provides secure authentication with accessibility support
 * and comprehensive form validation.
 */

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { z } from 'zod';
import { validateForm } from '../utils/validation';

// Login form schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Page Component
 */
function LoginPage(): JSX.Element {
  // Get authentication context
  const { login } = useAuth();
  
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();
  
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Get redirect URL from query params
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  
  /**
   * Handle form input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear general error
    if (generalError) {
      setGeneralError(null);
    }
  };
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    setGeneralError(null);
    
    try {
      // Loading state
      setIsLoading(true);
      
      // Validate form data
      try {
        const validatedData = validateForm(formData, loginSchema);
        
        // Attempt login
        await login(validatedData.email, validatedData.password, validatedData.rememberMe);
        
        // Redirect on success
        navigate(redirectUrl, { replace: true });
      } catch (validationError: any) {
        // Set validation errors
        if (validationError.validationErrors) {
          setErrors(validationError.validationErrors);
        } else {
          setGeneralError(validationError.message || 'Validation failed. Please check your input.');
        }
      }
    } catch (error: any) {
      // Handle login error
      setGeneralError(error.message || 'Login failed. Please try again.');
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>AccessWeb - Login</title>
        <meta name="description" content="Log in to your AccessWeb account" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AccessWeb
            </h1>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
              The Ultimate Accessibility Platform
            </p>
          </div>
          
          <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 px-6 py-8 hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Log in to your account
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              {/* General error message */}
              {generalError && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/30 p-4" role="alert">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        {generalError}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-2 border ${
                    errors.email ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'
                  } rounded-full text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-[#0fae96] focus:border-[#0fae96] focus:z-10 sm:text-sm`}
                  placeholder="your@email.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="email-error">
                    {errors.email}
                  </p>
                )}
              </div>
              
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-4 py-2 border ${
                    errors.password ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-slate-600'
                  } rounded-full text-gray-900 dark:text-white dark:bg-slate-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-[#0fae96] focus:border-[#0fae96] focus:z-10 sm:text-sm`}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400" id="password-error">
                    {errors.password}
                  </p>
                )}
              </div>
              
              {/* Remember me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 dark:border-slate-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-[#0fae96] hover:text-[#0d9a85] dark:text-[#5eead4] dark:hover:text-[#0fae96]">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              
              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#0fae96] hover:bg-[#0d9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] disabled:bg-[#0fae96]/70 disabled:cursor-not-allowed transition-colors"
                  aria-busy={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Log in'}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-[#0fae96] hover:text-[#0d9a85] dark:text-[#5eead4] dark:hover:text-[#0fae96]">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;