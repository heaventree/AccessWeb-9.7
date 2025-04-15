import React, { createContext, useState, useEffect, useCallback } from 'react';
import { 
  generateToken, 
  validateToken, 
  loginUser,
  registerUser
} from '../utils/auth';
import { User, AuthError, LoginResponse, RegistrationData, RegistrationResponse } from '../types/auth';
import { IS_DEVELOPMENT_MODE } from '../utils/environment';

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
      // For better security in production:
      // - Use HttpOnly cookies via server-side auth
      // - Or use more secure client storage methods
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error storing auth token:', error);
    }
  }, []);

  // Secure token removal function
  const removeAuthToken = useCallback(() => {
    try {
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error removing auth token:', error);
    }
  }, []);

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from storage
        const token = localStorage.getItem('token');
        
        if (token) {
          // Validate the token (checks signature, expiration, etc.)
          const userData = validateToken(token);
          
          if (userData) {
            // If valid, set the user state
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.name || '',
              organization: userData.organization || ''
            });
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
  }, [removeAuthToken]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // Call the login API function from auth.ts
      const response = await loginUser(email, password);
      
      if (response.success && response.token && response.user) {
        // Store the token securely
        storeAuthToken(response.token);
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
        // Store the token securely
        storeAuthToken(response.token);
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
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
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