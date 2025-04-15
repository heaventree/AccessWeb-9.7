/**
 * Security Provider
 * 
 * Provides a centralized security layer that combines multiple security
 * measures including CSP, rate limiting, CSRF protection, and data sanitization.
 */

import { ReactNode, useEffect } from 'react';
import { initCSP, updateCSPNonce, validateCSP } from '../utils/contentSecurity';
import { setupRateLimiting } from '../utils/rateLimiting';
import { initCsrfProtection, generateCsrfToken, validateCsrfToken } from '../utils/csrfProtection';
import { configureSanitizerDefaults } from '../utils/sanitization';
import { setupSecureStorage } from '../utils/secureStorage';
import { loadEnvVariables } from '../utils/environment';

// Security provider props
interface SecurityProviderProps {
  /**
   * Child components
   */
  children: ReactNode;
}

/**
 * Security Provider Component
 * 
 * Configures and applies security measures for the entire application
 */
export function SecurityProvider({ children }: SecurityProviderProps): JSX.Element {
  // Initialize security features on mount
  useEffect(() => {
    // Initialize environment variables
    loadEnvVariables();
    
    // Initialize Content Security Policy
    initCSP();
    
    // Configure sanitizer defaults
    configureSanitizerDefaults();
    
    // Setup CSRF protection
    initCsrfProtection();
    
    // Setup rate limiting
    setupRateLimiting();
    
    // Initialize secure storage
    setupSecureStorage();
    
    // Update CSP nonce on each render for enhanced security
    updateCSPNonce();
    
    // Set up interval to validate CSP
    const validateInterval = setInterval(() => {
      validateCSP();
    }, 60000); // Check every minute
    
    // Cleanup function
    return () => {
      clearInterval(validateInterval);
    };
  }, []);
  
  return (
    <>{children}</>
  );
}

export default SecurityProvider;

// Export security utilities for use in components
export { 
  generateCsrfToken, 
  validateCsrfToken,
};