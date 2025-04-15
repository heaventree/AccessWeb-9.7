/**
 * Security Headers Utility
 * 
 * Provides utilities for setting secure HTTP headers both on the client-side
 * and for server configurations to enhance application security.
 */

import { getCurrentNonce } from './contentSecurity';

export interface SecurityHeadersConfig {
  // CSP nonce if needed
  nonce?: string;
  
  // Allow reporting to these endpoints
  reportTo?: string[];
  
  // Report-only mode for CSP
  cspReportOnly?: boolean;
}

/**
 * HSTS (HTTP Strict Transport Security) configuration
 * This tells browsers to only use HTTPS for the domain
 */
export function getHSTSHeader(): string {
  return 'max-age=63072000; includeSubDomains; preload';
}

/**
 * X-Content-Type-Options header 
 * Prevents MIME type sniffing
 */
export function getContentTypeOptionsHeader(): string {
  return 'nosniff';
}

/**
 * X-Frame-Options header
 * Prevents clickjacking attacks
 */
export function getFrameOptionsHeader(): string {
  return 'DENY';
}

/**
 * X-XSS-Protection header
 * Enables browser's built-in XSS protection
 */
export function getXSSProtectionHeader(): string {
  return '1; mode=block';
}

/**
 * Referrer-Policy header
 * Controls information sent in the Referer header
 */
export function getReferrerPolicyHeader(): string {
  return 'strict-origin-when-cross-origin';
}

/**
 * Permissions-Policy header
 * Controls which browser features can be used
 */
export function getPermissionsPolicyHeader(): string {
  return (
    'accelerometer=(), camera=(), geolocation=(), gyroscope=(), ' +
    'magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()'
  );
}

/**
 * Generate Content-Security-Policy header
 * Defines approved sources of content
 */
export function getCSPHeader(config: SecurityHeadersConfig = {}): string {
  const nonce = config.nonce || getCurrentNonce() || '';
  
  // Define CSP directives
  const directives = [
    // Default behavior for resources not explicitly listed
    "default-src 'self'",
    
    // Scripts can come from self and specified domains with nonce
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    
    // Styles from self and specified domains, allow inline styles
    "style-src 'self' 'unsafe-inline'",
    
    // Images from self, data URIs, and any HTTPS source
    "img-src 'self' data: https:",
    
    // Fonts from self and specified font providers
    "font-src 'self' https://fonts.gstatic.com",
    
    // Connect to self and specified APIs
    "connect-src 'self' https://api.example.com",
    
    // No frames/iframes allowed
    "frame-src 'none'",
    
    // No plugins allowed
    "object-src 'none'",
    
    // Form submissions only to self
    "form-action 'self'",
    
    // Cannot be embedded in frames
    "frame-ancestors 'none'",
    
    // Upgrade insecure requests
    "upgrade-insecure-requests"
  ];
  
  // Add reporting endpoint if specified
  if (config.reportTo && config.reportTo.length > 0) {
    directives.push(`report-uri ${config.reportTo.join(' ')}`);
    directives.push(`report-to ${config.reportTo.join(' ')}`);
  }
  
  return directives.join('; ');
}

/**
 * Configure security headers for fetch API requests
 */
export function addSecurityHeaders(headers: Headers): Headers {
  headers.set('X-Content-Type-Options', getContentTypeOptionsHeader());
  headers.set('X-XSS-Protection', getXSSProtectionHeader());
  headers.set('X-Frame-Options', getFrameOptionsHeader());
  
  return headers;
}

/**
 * Get all recommended security headers for a server response
 */
export function getAllSecurityHeaders(config: SecurityHeadersConfig = {}): Record<string, string> {
  return {
    'Strict-Transport-Security': getHSTSHeader(),
    'X-Content-Type-Options': getContentTypeOptionsHeader(),
    'X-Frame-Options': getFrameOptionsHeader(),
    'X-XSS-Protection': getXSSProtectionHeader(),
    'Referrer-Policy': getReferrerPolicyHeader(),
    'Permissions-Policy': getPermissionsPolicyHeader(),
    [config.cspReportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy']: getCSPHeader(config)
  };
}

/**
 * Apply security headers to document (useful for SPA applications) 
 * Cannot set some headers as they're server-only, but works for meta tags
 */
export function applySecurityHeadersToDocument(config: SecurityHeadersConfig = {}): void {
  // CSP as meta tag
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = config.cspReportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
  cspMeta.content = getCSPHeader(config);
  document.head.appendChild(cspMeta);
  
  // Referrer Policy as meta tag
  const referrerMeta = document.createElement('meta');
  referrerMeta.name = 'referrer';
  referrerMeta.content = getReferrerPolicyHeader();
  document.head.appendChild(referrerMeta);
}

export default {
  getHSTSHeader,
  getContentTypeOptionsHeader,
  getFrameOptionsHeader,
  getXSSProtectionHeader,
  getReferrerPolicyHeader,
  getPermissionsPolicyHeader,
  getCSPHeader,
  addSecurityHeaders,
  getAllSecurityHeaders,
  applySecurityHeadersToDocument
};