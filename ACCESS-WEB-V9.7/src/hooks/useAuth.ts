import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'subscriber' | 'user';
  isAdmin?: boolean;  // Flag that determines admin access
  emailVerified: boolean;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
    currentPeriodEnd: string;
  };
}

export interface AuthError {
  message: string;
  code: string;
}

// Create a constant for easier toggling in development
export const DEVELOPMENT_MODE = true;

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AuthError | null>(null);

  // Check if the user is authenticated on initial load
  useEffect(() => {
    // If in development mode, announce to console for clarity
    if (DEVELOPMENT_MODE) {
      console.info('🔓 Running in DEVELOPMENT MODE - Authentication is disabled');
      
      // Set up fake auth token and user in localStorage for persistence
      if (!localStorage.getItem('auth_token')) {
        localStorage.setItem('auth_token', 'dev-mode-token-access-web-v97');
      }
      
      // Get role from localStorage or URL parameter for easy testing
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      
      // If role is specified in URL, store it
      if (roleParam && ['admin', 'subscriber'].includes(roleParam)) {
        localStorage.setItem('dev_role', roleParam);
      }
      
      // Get stored role or default to subscriber
      const storedRole = localStorage.getItem('dev_role') || 'subscriber';
      
      // Create development user based on role
      const userRole: 'admin' | 'subscriber' = (storedRole === 'admin' ? 'admin' : 'subscriber');
      const devUser: User = {
        id: userRole === 'admin' ? 'dev-admin-1' : 'dev-subscriber-1',
        email: userRole === 'admin' ? 'admin@accessweb.dev' : 'subscriber@accessweb.dev',
        name: userRole === 'admin' ? 'Development Admin' : 'Development Subscriber',
        role: userRole,
        isAdmin: userRole === 'admin', // Set isAdmin flag based on role
        emailVerified: true,
        createdAt: new Date().toISOString(),
        subscription: {
          plan: userRole === 'admin' ? 'enterprise' : 'professional',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
      };
      
      // Store user data in localStorage
      if (!localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(devUser));
      }
      
      setIsAuthenticated(true);
      setUser(devUser);
      setLoading(false);
      
      // Create a notification in the UI that we're in dev mode
      const existingNotification = document.getElementById('dev-mode-notification');
      if (!existingNotification) {
        const notification = document.createElement('div');
        notification.id = 'dev-mode-notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '10px';
        notification.style.right = '10px';
        notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        notification.style.color = 'white';
        notification.style.padding = '8px 16px';
        notification.style.borderRadius = '4px';
        notification.style.fontSize = '12px';
        notification.style.zIndex = '9999';
        notification.innerHTML = '🔓 Development Mode - Auth Disabled';
        document.body.appendChild(notification);
      }
      
      return () => {
        // Clean up notification if component unmounts
        const notification = document.getElementById('dev-mode-notification');
        if (notification) {
          notification.remove();
        }
      };
    }

    // Real authentication check for production
    const checkAuth = async () => {
      setLoading(true);
      try {
        // Check for token in localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        // Validate token with the server
        const userResponse = await authApi.me();
        setUser(userResponse.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear invalid tokens
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Define LoginOptions interface for consistency
  interface LoginOptions {
    isAdminLogin?: boolean;
  }

  const login = useCallback(async (
    email: string, 
    password: string,
    options?: LoginOptions
  ): Promise<{ success: boolean; error?: AuthError; verificationToken?: string; user?: User }> => {
    // We will use a simpler approach that works the same in development and production
    // We will check the database's isAdmin flag for determining admin privileges
    // Also adding isAdminLogin parameter to inform the backend of the context
    // This way, the admin login is consistent across environments
    
    setLoading(true);
    setError(null);
    
    try {
      // Pass the isAdminLogin flag to the login API if provided
      const isAdminLogin = options?.isAdminLogin || false;
      const response = await authApi.login(email, password, { isAdminLogin });
      
      // Save auth token to localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Create a proper User object from the API response
      const userObj: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as 'admin' | 'subscriber' | 'user',
        isAdmin: Boolean(response.user.isAdmin), // Ensure the isAdmin flag is properly set as boolean
        emailVerified: true, // Assume verified if they can log in
        createdAt: new Date().toISOString(), // Default to now
        // Add subscription info if available
        subscription: response.user.subscription
      };
      
      setIsAuthenticated(true);
      setUser(userObj);
      
      return { 
        success: true,
        user: userObj
      };
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to authenticate';
      const errorCode = error.response?.data?.code || 'auth/failed';
      
      setError({ message: errorMsg, code: errorCode });
      
      return { 
        success: false, 
        error: { message: errorMsg, code: errorCode }
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (
    userData: { email: string; password: string; name: string }
  ): Promise<{ success: boolean; error?: AuthError; verificationToken?: string }> => {
    if (DEVELOPMENT_MODE) {
      // Always succeed in development mode
      return { success: true, verificationToken: 'dev-verification-token' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register(userData);
      
      // In most cases, registration doesn't immediately log the user in
      // Instead, they need to verify their email first
      return { 
        success: true,
        verificationToken: response.verificationToken 
      };
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Registration failed';
      const errorCode = error.response?.data?.code || 'auth/registration-failed';
      
      setError({ message: errorMsg, code: errorCode });
      
      return { 
        success: false, 
        error: { message: errorMsg, code: errorCode }
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (
    token: string
  ): Promise<{ success: boolean; error?: AuthError }> => {
    if (DEVELOPMENT_MODE) {
      // Always succeed in development mode
      return { success: true };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.verifyEmail(token);
      
      // After email verification, we can log the user in automatically
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setIsAuthenticated(true);
      setUser(response.user);
      
      return { success: true };
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Email verification failed';
      const errorCode = error.response?.data?.code || 'auth/verification-failed';
      
      setError({ message: errorMsg, code: errorCode });
      
      return { 
        success: false, 
        error: { message: errorMsg, code: errorCode }
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const forgotPassword = useCallback(async (
    email: string
  ): Promise<{ success: boolean; error?: AuthError }> => {
    if (DEVELOPMENT_MODE) {
      // Always succeed in development mode
      return { success: true };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await authApi.forgotPassword(email);
      return { success: true };
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to send password reset email';
      const errorCode = error.response?.data?.code || 'auth/reset-password-failed';
      
      setError({ message: errorMsg, code: errorCode });
      
      return { 
        success: false, 
        error: { message: errorMsg, code: errorCode }
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: AuthError }> => {
    if (DEVELOPMENT_MODE) {
      // Always succeed in development mode
      return { success: true };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await authApi.resetPassword(token, newPassword);
      return { success: true };
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to reset password';
      const errorCode = error.response?.data?.code || 'auth/reset-password-failed';
      
      setError({ message: errorMsg, code: errorCode });
      
      return { 
        success: false, 
        error: { message: errorMsg, code: errorCode }
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (redirectPath?: string) => {
    if (DEVELOPMENT_MODE) {
      // In development mode, we still want to clear state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('dev_role');
      sessionStorage.clear(); // Clear any session storage as well
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to specified path or default login
      if (redirectPath) {
        window.location.replace(redirectPath); // Use replace to prevent history issues
      } else {
        window.location.replace('/login');
      }
      
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the logout endpoint to invalidate the token on the server
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Completely clear all storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresAt');
      sessionStorage.clear();
      
      // Clear any cookies via the API endpoint
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Reset state
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      
      // Check if we're in the admin section to determine where to redirect
      const isAdminSection = window.location.pathname.toLowerCase().includes('/admin');
      
      // Use full page redirect to clear any lingering state
      if (redirectPath) {
        window.location.replace(redirectPath); // Use replace to prevent history issues
      } else if (isAdminSection) {
        window.location.replace('/admin/login');
      } else {
        window.location.replace('/login');
      }
    }
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    isDevelopmentMode: DEVELOPMENT_MODE
  };
}