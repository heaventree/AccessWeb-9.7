import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  validateToken, 
  loginUser,
  registerUser
} from '../utils/auth';
import { User, AuthError, LoginResponse, RegistrationData, RegistrationResponse } from '../types/auth';
import { IS_DEVELOPMENT_MODE } from '../utils/environment';
import { authStorage } from '../utils/secureStorage';
import { validateData, createLoginSchema, createRegistrationSchema } from '../utils/validation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  register: (data: RegistrationData) => Promise<{ success: boolean; error?: AuthError }>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  createPasswordResetToken: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  isDevelopmentMode: boolean;
}

// Create the Auth Context with a default empty value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  verifyEmail: async () => false,
  createPasswordResetToken: async () => false,
  resetPassword: async () => false,
  isDevelopmentMode: IS_DEVELOPMENT_MODE
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isDevelopmentMode = IS_DEVELOPMENT_MODE;

  // Secure token storage function
  const storeAuthToken = useCallback((token: string) => {
    try {
      // Store token using secure storage utility with encryption
      authStorage.setItem('token', token);
      
      // Store token expiry time for proactive token refresh
      const expiresAt = Date.now() + (23 * 60 * 60 * 1000); // 23 hours (1hr before expiry)
      authStorage.setItem('tokenExpiry', expiresAt.toString());
    } catch (error) {
      console.error('Error storing auth token:', error);
    }
  }, []);

  // Secure token removal function
  const removeAuthToken = useCallback(() => {
    try {
      // Clear all auth-related data
      authStorage.removeItem('token');
      authStorage.removeItem('tokenExpiry');
      authStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }, []);

  // Check for existing authentication on mount and implement token refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from secure storage
        const token = authStorage.getItem('token');
        
        if (token) {
          // Check if token is nearing expiry
          const tokenExpiry = authStorage.getItem('tokenExpiry');
          const isExpiringSoon = tokenExpiry && parseInt(tokenExpiry) < Date.now();
          
          // Validate the token (checks signature, expiration, etc.)
          const userData = await validateToken(token);
          
          if (userData) {
            // If valid, set the user state
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.name || '',
              organization: userData.organization || ''
            });
            
            // If token is valid but nearing expiry, refresh it (in production)
            // This would call a token refresh API endpoint
            if (isExpiringSoon && !IS_DEVELOPMENT_MODE) {
              // In a real implementation, we would refresh the token here
              console.log('Token nearing expiry, refresh would be triggered');
            }
          } else {
            // Token is invalid or expired, remove it
            removeAuthToken();
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        removeAuthToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Set up token refresh check at regular intervals
    const refreshInterval = setInterval(() => {
      const tokenExpiry = authStorage.getItem('tokenExpiry');
      if (tokenExpiry && parseInt(tokenExpiry) < Date.now() && user) {
        // Token needs refresh
        console.log('Token refresh interval triggered');
        checkAuth();
      }
    }, 15 * 60 * 1000); // Check every 15 minutes
    
    return () => clearInterval(refreshInterval);
  }, [removeAuthToken, user]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // Call the login API function from auth.ts
      const response = await loginUser(email, password);
      
      if (response.success && response.token && response.user) {
        // Resolve the token if it's a promise
        const resolvedToken = response.token instanceof Promise 
          ? await response.token 
          : response.token;
          
        // Store the token securely
        storeAuthToken(resolvedToken);
        // Set the user state
        setUser(response.user);
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.error || { 
          code: 'auth/unknown-error', 
          message: 'Login failed' 
        } 
      };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: { 
          code: 'auth/unknown-error', 
          message: 'An unexpected error occurred during login.' 
        } 
      };
    }
  };
  
  // Register function
  const register = async (data: RegistrationData) => {
    try {
      // Call the register API function from auth.ts
      const response = await registerUser(data);
      
      if (response.success && response.token && response.user) {
        // Resolve the token if it's a promise
        const resolvedToken = response.token instanceof Promise 
          ? await response.token 
          : response.token;
          
        // Store the token securely
        storeAuthToken(resolvedToken);
        // Set the user state
        setUser(response.user);
        return { success: true };
      }
      
      return { 
        success: false, 
        error: response.error || { 
          code: 'auth/unknown-error', 
          message: 'Registration failed' 
        } 
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: { 
          code: 'auth/unknown-error', 
          message: 'An unexpected error occurred during registration.' 
        } 
      };
    }
  };

  // Logout function
  const logout = useCallback(() => {
    // Clear all auth data using our secure storage utility
    removeAuthToken();
    
    // Reset user state
    setUser(null);
    
    // In a real implementation, you might also want to:
    // 1. Invalidate the token on the server
    // 2. Clear any user-related cache
    // 3. Reset any application state
  }, [removeAuthToken]);
  
  // Verify email function
  const verifyEmail = async (token: string) => {
    try {
      // Mock implementation for development
      if (isDevelopmentMode) {
        // Simulate email verification success
        return true;
      }
      
      // In production, this would call an API
      return false;
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    }
  };
  
  // Create password reset token function
  const createPasswordResetToken = async (email: string) => {
    try {
      // Mock implementation for development
      if (isDevelopmentMode) {
        // Simulate sending reset email
        return true;
      }
      
      // In production, this would call an API
      return false;
    } catch (error) {
      console.error('Password reset token creation failed:', error);
      return false;
    }
  };
  
  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      // Mock implementation for development
      if (isDevelopmentMode) {
        // Simulate password reset
        return true;
      }
      
      // In production, this would call an API
      return false;
    } catch (error) {
      console.error('Password reset failed:', error);
      return false;
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    createPasswordResetToken,
    resetPassword,
    isDevelopmentMode
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};