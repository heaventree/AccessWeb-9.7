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
  // For development - always authenticate as admin
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<User>({
    id: 'dev-admin-1',
    email: 'admin@accessweb.dev',
    role: 'admin'
  });
  const [loading, setLoading] = useState(false);

  // No authentication check needed for development
  useEffect(() => {
    // No-op for development
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; error?: AuthError }> => {
    // Always succeed in development mode
    return { success: true };
  };

  const logout = () => {
    // No-op in development mode
    // We're always authenticated
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };
}