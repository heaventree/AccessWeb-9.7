import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// User type from our auth system
interface User {
  id: number;
  email: string;
  name?: string;
  profileImageUrl?: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
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
        const response = await axios.get('/api/auth/me', { withCredentials: true });
        if (response.data && response.data.user) {
          setUser(response.data.user);
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

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/api/auth/login', 
        { email, password },
        { withCredentials: true }
      );

      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
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

      const response = await axios.post('/api/auth/register', 
        { email, password, name },
        { withCredentials: true }
      );

      if (response.data && response.data.user) {
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

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
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