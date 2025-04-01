import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthError {
  message: string;
  code: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated authentication check
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: AuthError }> => {
    try {
      // Simulated login - replace with actual API call
      if (username === 'admin' && password === 'admin123') {
        const adminUser = {
          id: 'admin-1',
          email: username,
          role: 'admin' as const
        };
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
        setIsAuthenticated(true);
        return { success: true };
      }

      // Return specific error for invalid credentials
      return {
        success: false,
        error: {
          code: 'auth/invalid-credentials',
          message: 'Invalid username or password. Please try again.'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'auth/unexpected-error',
          message: 'An unexpected error occurred. Please try again.'
        }
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
}