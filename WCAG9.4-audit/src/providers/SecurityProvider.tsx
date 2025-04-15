import React, { useEffect } from 'react';
import { applySecurityHeadersToDocument } from '../utils/securityHeaders';
import { installCsp, generateNonce } from '../utils/contentSecurity';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface SecurityProviderProps {
  children: React.ReactNode;
}

/**
 * Security Provider Component
 * 
 * Applies various security measures to protect the application:
 * - Content Security Policy
 * - HTTP Security Headers
 * - Error Boundary for catching and handling errors
 */
export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  useEffect(() => {
    // Generate a nonce for CSP
    const nonce = generateNonce();
    
    // Install Content Security Policy
    installCsp(undefined, nonce);
    
    // Apply other security headers as meta tags
    applySecurityHeadersToDocument({ nonce });
    
    // Log security setup
    console.info('[Security] Security measures initialized');
    
    return () => {
      // Clean up could be performed here if needed
    };
  }, []);
  
  return (
    <ErrorBoundary component="SecurityProvider">
      {children}
    </ErrorBoundary>
  );
};

export default SecurityProvider;