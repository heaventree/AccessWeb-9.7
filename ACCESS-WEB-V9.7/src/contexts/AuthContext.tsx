import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../lib/apiClient';

// User type from our auth system
interface User {
  id: number;
  email: string;
  name?: string;
  profileImageUrl?: string;
  isAdmin: boolean;
}

// Login options interface
interface LoginOptions {
  isAdminLogin?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, options?: LoginOptions) => Promise<any>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: (redirectPath?: string) => Promise<void>;
  clearError: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  clearError: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const data = await authApi.getCurrentUser();
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // User is not authenticated - that's fine
        console.log('Not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function with options
  const login = async (email: string, password: string, options?: LoginOptions) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authApi.login(email, password, options);

      if (data && data.user) {
        setUser(data.user);
      }
      
      return data; // Return the full response for additional handling
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred during login');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authApi.register(email, password, name);

      if (data && data.user) {
        // Auto login after registration
        await login(email, password);
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred during registration');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function with optional redirect path
  const logout = async (redirectPath?: string) => {
    try {
      setLoading(true);
      await authApi.logout();
      setUser(null);
      
      // If a redirect path is provided, navigate to it after logout
      if (redirectPath && typeof window !== 'undefined') {
        window.location.href = redirectPath;
      }
    } catch (err: any) {
      console.error('Logout error:', err);
      setError('An error occurred during logout');
    } finally {
      setLoading(false);
    }
  };

  // Clear any auth errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;