/**
 * Security Provider
 * 
 * Centralizes security features and mechanisms into a single provider component
 * that wraps the application to ensure consistent security enforcement.
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { CSP_ENABLED, IS_DEVELOPMENT_MODE } from '../utils/environment';
import { installCsp, getCurrentNonce } from '../utils/contentSecurity';
import ErrorBoundary from '../components/ErrorBoundary';
import { getCsrfToken } from '../utils/csrfProtection';
import { resetRateLimit } from '../utils/rateLimiting';

interface SecurityProviderProps {
  children: ReactNode;
}

/**
 * SecurityProvider wraps the application with various security features
 * including CSP, error boundaries, CSRF protection, and rate limiting.
 */
const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const [securityInitialized, setSecurityInitialized] = useState(false);
  
  // Initialize security features on component mount
  useEffect(() => {
    // Setup Content Security Policy
    if (CSP_ENABLED) {
      try {
        // Configure CSP based on environment
        const cspConfig = IS_DEVELOPMENT_MODE
          ? {
              // More permissive in development
              'script-src': ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
              'connect-src': ["'self'", 'ws:', 'wss:', 'https://api.example.com']
            }
          : {
              // More restrictive in production
              'script-src': ["'self'", "'strict-dynamic'"],
              'connect-src': ["'self'", 'https://api.example.com']
            };
        
        // Install CSP
        installCsp(cspConfig);
        console.log('Content Security Policy installed successfully');
      } catch (error) {
        console.error('Failed to install Content Security Policy:', error);
      }
    }
    
    // Initialize CSRF protection
    try {
      // Generate a new CSRF token if needed
      getCsrfToken();
      console.log('CSRF protection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize CSRF protection:', error);
    }
    
    // Reset rate limits on new session
    try {
      // Reset global API rate limit
      resetRateLimit('global_api');
      console.log('Rate limiting reset successfully');
    } catch (error) {
      console.error('Failed to reset rate limits:', error);
    }
    
    // Mark security as initialized
    setSecurityInitialized(true);
    
    // Cleanup function
    return () => {
      // Any cleanup for security features if needed
    };
  }, []);
  
  // Security-related attributes for the container
  const securityAttrs = {
    // Use nonce for inline scripts if CSP is enabled
    ...(CSP_ENABLED && { 'data-csp-nonce': getCurrentNonce() }),
    // Add security indicator for testing/debugging
    'data-security-initialized': securityInitialized.toString()
  };
  
  return (
    <ErrorBoundary component="SecurityProvider">
      <div 
        className="security-provider"
        {...securityAttrs}
      >
        {/* Only render children once security is initialized */}
        {securityInitialized ? children : (
          <div aria-live="polite" aria-atomic="true" role="status">
            <p>Initializing security features...</p>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default SecurityProvider;