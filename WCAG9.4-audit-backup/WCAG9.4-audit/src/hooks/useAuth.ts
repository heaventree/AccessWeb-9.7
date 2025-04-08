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

// Create a constant for easier toggling in development
export const DEVELOPMENT_MODE = true;

export function useAuth() {
  // For development - always authenticate as admin
  const [isAuthenticated, setIsAuthenticated] = useState(DEVELOPMENT_MODE ? true : false);
  const [user, setUser] = useState<User | null>(DEVELOPMENT_MODE ? {
    id: 'dev-admin-1',
    email: 'admin@accessweb.dev',
    role: 'admin'
  } : null);
  const [loading, setLoading] = useState(false);
  
  // No authentication check needed for development
  useEffect(() => {
    // If in development mode, announce to console for clarity
    if (DEVELOPMENT_MODE) {
      console.info('🔓 Running in DEVELOPMENT MODE - Authentication is disabled');
    }
    
    // Create a notification in the UI that we're in dev mode
    if (DEVELOPMENT_MODE) {
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
    }

    return () => {
      // Clean up notification if component unmounts
      const notification = document.getElementById('dev-mode-notification');
      if (notification) {
        notification.remove();
      }
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (username: string, password: string): Promise<{ success: boolean; error?: AuthError }> => {
    if (DEVELOPMENT_MODE) {
      // Always succeed in development mode
      return { success: true };
    }
    
    // In production, this would have real authentication logic
    setLoading(true);
    try {
      // Fake delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      // This is where real authentication would happen
      // Use the username/password here in production
      setIsAuthenticated(true);
      setUser({
        id: 'dev-admin-1',
        email: username || 'admin@accessweb.dev',
        role: 'admin'
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: { 
          message: 'Failed to authenticate', 
          code: 'auth/failed' 
        }
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (DEVELOPMENT_MODE) {
      // No-op in development mode
      console.info('🔓 Logout attempted, but ignored in development mode');
      return;
    }
    
    // In production, this would have real logout logic
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    isDevelopmentMode: DEVELOPMENT_MODE
  };
}