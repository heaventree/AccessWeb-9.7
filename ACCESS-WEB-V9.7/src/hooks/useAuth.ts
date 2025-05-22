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
      
      // Get stored role or default to admin
      const storedRole = localStorage.getItem('dev_role') || 'admin';
      
      // Create development user based on role
      const userRole: 'admin' | 'subscriber' = (storedRole === 'admin' ? 'admin' : 'subscriber');
      const devUser: User = {
        id: userRole === 'admin' ? 'dev-admin-1' : 'dev-subscriber-1',
        email: userRole === 'admin' ? 'admin@accessweb.dev' : 'subscriber@accessweb.dev',
        name: userRole === 'admin' ? 'Development Admin' : 'Development Subscriber',
        role: userRole,
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

  const login = useCallback(async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: AuthError; verificationToken?: string; user?: User }> => {
    if (DEVELOPMENT_MODE) {
      // SIMPLIFIED ADMIN LOGIN APPROACH FOR DEVELOPMENT MODE
      console.log("Development mode login attempt with:", email);
      
      // For admin login page, force admin login to work with any credentials
      // This overrides the normal login flow to make admin login easier to test
      const isAdminLoginPage = window.location.pathname.toLowerCase().includes('admin');
      console.log("Is admin login page?", isAdminLoginPage);
      
      // If on admin page, any account with 'admin' should work
      // Otherwise, only allow admin access based on the email containing 'admin'
      const isAdminAccount = email.toLowerCase().includes('admin');
      console.log("Email contains 'admin'?", isAdminAccount);
      
      // Simplified admin check - on admin login page, any credential works
      // On other pages, only email with 'admin' gets admin role
      const shouldHaveAdminRole = isAdminLoginPage || isAdminAccount;
      
      const userRole: 'admin' | 'subscriber' = shouldHaveAdminRole ? 'admin' : 'subscriber';
      console.log("Assigned role:", userRole);
      
      // Create dev user object
      const devUser: User = {
        id: userRole === 'admin' ? 'dev-admin-1' : 'dev-subscriber-1',
        email: email,
        name: userRole === 'admin' ? 'Development Admin' : 'Development Subscriber',
        role: userRole,
        isAdmin: userRole === 'admin',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        subscription: {
          plan: userRole === 'admin' ? 'enterprise' : 'professional',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
      };
      
      // Save user info for development mode
      localStorage.setItem('auth_token', 'dev-mode-token-access-web-v97');
      localStorage.setItem('user', JSON.stringify(devUser));
      localStorage.setItem('dev_role', userRole);
      
      // For admin page logins, if login has admin, it should work
      // For non-admin pages, login should always work
      if (!isAdminLoginPage || (isAdminLoginPage && isAdminAccount)) {
        setIsAuthenticated(true);
        setUser(devUser);
        
        console.log("Login successful in dev mode:", devUser);
        return { 
          success: true,
          user: devUser
        };
      } else {
        // If on admin login page but not using admin email, return error
        console.log("Admin login failed - not admin email");
        return {
          success: false,
          error: {
            message: 'You do not have admin privileges. Please log in with an admin account.',
            code: 'auth/invalid-admin'
          }
        };
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(email, password);
      
      // Save auth token to localStorage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Create a proper User object from the API response
      const userObj: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role as 'admin' | 'subscriber' | 'user',
        isAdmin: response.user.isAdmin || false, // Set isAdmin flag from API response
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

  const logout = useCallback(async () => {
    if (DEVELOPMENT_MODE) {
      // No-op in development mode
      console.info('🔓 Logout attempted, but ignored in development mode');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the logout endpoint to invalidate the token on the server
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up local storage and state regardless of server response
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
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