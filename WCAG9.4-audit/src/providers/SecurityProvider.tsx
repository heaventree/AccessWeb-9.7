/**
 * Security Provider
 * 
 * Centralized component that integrates all security features
 * and provides them to the application.
 */

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { initContentSecurity } from '../utils/contentSecurity';
import { initCsrfProtection } from '../utils/csrfProtection';
import { getEnvBoolean } from '../utils/environment';
import { setupSecureStorage } from '../utils/secureStorage';
import { initSecurityHeaders } from '../utils/securityHeaders';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Get security feature flags from environment
const CSP_ENABLED = getEnvBoolean('VITE_CSP_ENABLED', true);
const CSRF_ENABLED = getEnvBoolean('VITE_CSRF_ENABLED', true);
const SECURITY_HEADERS_ENABLED = getEnvBoolean('VITE_SECURITY_HEADERS_ENABLED', true);

// Security context type
interface SecurityContextType {
  /**
   * Flag indicating if all security features are initialized
   */
  initialized: boolean;
}

// Create context with default values
const SecurityContext = createContext<SecurityContextType>({
  initialized: false,
});

// Security provider props
interface SecurityProviderProps {
  /**
   * Child components
   */
  children: ReactNode;
  
  /**
   * Whether to enable CSP
   */
  enableCSP?: boolean;
  
  /**
   * Whether to enable CSRF protection
   */
  enableCSRF?: boolean;
  
  /**
   * Whether to enable security headers
   */
  enableSecurityHeaders?: boolean;
}

/**
 * Security Provider Component
 * 
 * Provides security features to the application
 */
export function SecurityProvider({
  children,
  enableCSP = CSP_ENABLED,
  enableCSRF = CSRF_ENABLED,
  enableSecurityHeaders = SECURITY_HEADERS_ENABLED,
}: SecurityProviderProps) {
  // Initialize security features
  useEffect(() => {
    // Initialize secure storage
    setupSecureStorage();
    
    // Initialize Content Security Policy
    if (enableCSP) {
      initContentSecurity();
    }
    
    // Initialize CSRF protection
    if (enableCSRF) {
      initCsrfProtection();
    }
    
    // Initialize security headers
    if (enableSecurityHeaders) {
      initSecurityHeaders();
    }
    
    // Log security initialization
    console.info(
      `Security initialized: CSP=${enableCSP}, CSRF=${enableCSRF}, Headers=${enableSecurityHeaders}`
    );
  }, [enableCSP, enableCSRF, enableSecurityHeaders]);
  
  // Context value
  const contextValue: SecurityContextType = {
    initialized: true,
  };
  
  // Provide security context and wrap with error boundary
  return (
    <SecurityContext.Provider value={contextValue}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </SecurityContext.Provider>
  );
}

/**
 * Hook to use security context
 * @returns Security context
 */
export function useSecurity(): SecurityContextType {
  const context = useContext(SecurityContext);
  
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  
  return context;
}

export default SecurityProvider;