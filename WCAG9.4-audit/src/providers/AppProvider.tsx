import React from 'react';
// import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '../contexts/AuthContext';

// Create a mock HelmetProvider for now since it's causing compatibility issues
const MockHelmetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * AppProvider component that wraps the application with all necessary context providers
 * This component serves as the root provider for all application-wide contexts
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    // Add new providers here as needed
    <AuthProvider>
      <MockHelmetProvider>
        {children}
      </MockHelmetProvider>
    </AuthProvider>
  );
};