/**
 * Security Headers Utility
 * 
 * Provides HTTP security headers for protecting against various attacks
 * including XSS, clickjacking, MIME sniffing, and cross-origin issues.
 */

import { IS_DEVELOPMENT_MODE } from './environment';

/**
 * Security Headers Configuration
 */
export interface SecurityHeadersConfig {
  /**
   * X-XSS-Protection header value
   */
  xssProtection?: string;
  
  /**
   * X-Content-Type-Options header value
   */
  contentTypeOptions?: string;
  
  /**
   * X-Frame-Options header value
   */
  frameOptions?: string;
  
  /**
   * Referrer-Policy header value
   */
  referrerPolicy?: string;
  
  /**
   * Strict-Transport-Security header value
   */
  strictTransportSecurity?: string;
  
  /**
   * X-Permitted-Cross-Domain-Policies header value
   */
  permittedCrossDomainPolicies?: string;
  
  /**
   * Feature-Policy/Permissions-Policy header value
   */
  permissionsPolicy?: string;
  
  /**
   * Additional custom headers
   */
  customHeaders?: Record<string, string>;
}

/**
 * Default secure HTTP header values
 */
export const DEFAULT_SECURITY_HEADERS: SecurityHeadersConfig = {
  // Prevent XSS attacks
  xssProtection: '1; mode=block',
  
  // Prevent MIME type sniffing
  contentTypeOptions: 'nosniff',
  
  // Prevent clickjacking
  frameOptions: 'DENY',
  
  // Control information sent in referrer header
  referrerPolicy: 'strict-origin-when-cross-origin',
  
  // Enforce HTTPS
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
  
  // Prevent Flash/PDF from accessing data
  permittedCrossDomainPolicies: 'none',
  
  // Restrict browser features
  permissionsPolicy: "camera=(), microphone=(), geolocation=(), interest-cohort=()"
};

/**
 * Create secure HTTP headers to defend against common web vulnerabilities
 * @param config Security headers configuration to override defaults
 * @returns Headers object
 */
export function createSecurityHeaders(config: Partial<SecurityHeadersConfig> = {}): Record<string, string> {
  // Start with defaults
  const defaultConfig = { ...DEFAULT_SECURITY_HEADERS };
  
  // In development mode, adjust some headers for easier testing
  if (IS_DEVELOPMENT_MODE) {
    defaultConfig.frameOptions = 'SAMEORIGIN'; // Allow frames for dev tools
    defaultConfig.strictTransportSecurity = ''; // Don't enforce HTTPS in dev
  }
  
  // Merge with provided config
  const mergedConfig = { ...defaultConfig, ...config };
  const headers: Record<string, string> = {};
  
  // Set standard security headers
  if (mergedConfig.xssProtection) {
    headers['X-XSS-Protection'] = mergedConfig.xssProtection;
  }
  
  if (mergedConfig.contentTypeOptions) {
    headers['X-Content-Type-Options'] = mergedConfig.contentTypeOptions;
  }
  
  if (mergedConfig.frameOptions) {
    headers['X-Frame-Options'] = mergedConfig.frameOptions;
  }
  
  if (mergedConfig.referrerPolicy) {
    headers['Referrer-Policy'] = mergedConfig.referrerPolicy;
  }
  
  if (mergedConfig.strictTransportSecurity) {
    headers['Strict-Transport-Security'] = mergedConfig.strictTransportSecurity;
  }
  
  if (mergedConfig.permittedCrossDomainPolicies) {
    headers['X-Permitted-Cross-Domain-Policies'] = mergedConfig.permittedCrossDomainPolicies;
  }
  
  if (mergedConfig.permissionsPolicy) {
    // Support both old and new header names
    headers['Permissions-Policy'] = mergedConfig.permissionsPolicy;
    headers['Feature-Policy'] = mergedConfig.permissionsPolicy;
  }
  
  // Add any custom headers
  if (mergedConfig.customHeaders) {
    Object.entries(mergedConfig.customHeaders).forEach(([key, value]) => {
      headers[key] = value;
    });
  }
  
  return headers;
}

/**
 * Apply security headers to fetch request options
 * @param requestInit Fetch request init object
 * @param config Security headers configuration
 * @returns Updated request init with security headers
 */
export function applySecurityHeadersToRequest(
  requestInit: RequestInit = {}, 
  config: Partial<SecurityHeadersConfig> = {}
): RequestInit {
  const securityHeaders = createSecurityHeaders(config);
  
  // Create headers object if it doesn't exist
  if (!requestInit.headers) {
    requestInit.headers = new Headers();
  }
  
  // Convert headers to Headers object if it's a plain object
  const headers = requestInit.headers instanceof Headers 
    ? requestInit.headers 
    : new Headers(requestInit.headers as Record<string, string>);
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  });
  
  // Update request headers
  requestInit.headers = headers;
  
  return requestInit;
}

/**
 * Log the security headers for debugging/auditing
 * @param headers Security headers object
 */
export function logSecurityHeaders(headers: Record<string, string>): void {
  console.group('Security Headers');
  Object.entries(headers).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
  });
  console.groupEnd();
}

export default {
  createSecurityHeaders,
  applySecurityHeadersToRequest,
  logSecurityHeaders,
  DEFAULT_SECURITY_HEADERS
};