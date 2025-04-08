import React, { createContext, useState, useEffect } from 'react';
import { generateToken, validateToken } from '../utils/auth';
import { User, AuthError } from '../types/auth';
import { IS_DEVELOPMENT_MODE } from '../utils/environment';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
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

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = validateToken(token);
          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              name: userData.name || '',
              organization: userData.organization || ''
            });
          } else {
            // Token is invalid or expired, remove it
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      // Mock login for development
      if (IS_DEVELOPMENT_MODE) {
        const mockUser: User = {
          id: '123',
          name: 'Demo User',
          email: email,
          role: 'user',
          organization: 'Demo Org'
        };
        
        const token = generateToken(mockUser);
        localStorage.setItem('token', token);
        setUser(mockUser);
        
        return { success: true };
      }
      
      // In production, this would call an API
      // const response = await loginUser(email, password);
      // localStorage.setItem('token', response.token);
      // setUser(response.user);
      
      return { success: false, error: { code: 'auth/not-implemented', message: 'Login functionality not implemented yet.' } };
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

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  // Verify email function
  const verifyEmail = async (token: string) => {
    try {
      // Mock implementation for development
      if (IS_DEVELOPMENT_MODE) {
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
      if (IS_DEVELOPMENT_MODE) {
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
      if (IS_DEVELOPMENT_MODE) {
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
    logout,
    verifyEmail,
    createPasswordResetToken,
    resetPassword,
    isDevelopmentMode: IS_DEVELOPMENT_MODE
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};