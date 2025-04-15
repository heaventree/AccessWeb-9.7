/**
 * Security Headers
 * 
 * Implements HTTP security headers to protect against common web vulnerabilities
 * by restricting how browsers interact with the application.
 */

import { logError } from './errorHandler';
import { isDevelopment } from './environment';
import { buildCspHeader, getNonce } from './contentSecurity';

// Security headers configuration
const SECURITY_HEADERS = {
  // Prevent browsers from incorrectly detecting non-scripts as scripts
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Control how much information is included in referrer header
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Prevent browser features for security reasons
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  
  // HSTS for forcing HTTPS connections (not added in development)
  ...(isDevelopment() ? {} : {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  })
};

/**
 * Apply security headers to a fetch request
 * @param init Fetch request init
 * @returns Modified fetch request init
 */
export function applySecurityHeadersToRequest(init: RequestInit): RequestInit {
  // Clone init to avoid modifying the original
  const secureInit = { ...init };
  
  // Create headers object if it doesn't exist
  if (!secureInit.headers) {
    secureInit.headers = {};
  }
  
  // Convert to Headers object if it's an object
  if (!(secureInit.headers instanceof Headers)) {
    secureInit.headers = new Headers(secureInit.headers as Record<string, string>);
  }
  
  // Add security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    (secureInit.headers as Headers).set(key, value);
  });
  
  return secureInit;
}

/**
 * Create meta tags for security headers
 */
export function createSecurityHeaderMetaTags(): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  try {
    // Add Content-Security-Policy from buildCspHeader function
    const cspValue = buildCspHeader();
    addMetaTag('Content-Security-Policy', cspValue);
    
    // Add other security headers as meta tags
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
      addMetaTag(`http-equiv`, key, value);
    });
    
    // Add nonce meta tag
    addMetaTag('csp-nonce', getNonce());
  } catch (error) {
    logError(error, { context: 'securityHeaders.createSecurityHeaderMetaTags' });
  }
}

/**
 * Add a meta tag to the document head
 * @param name Meta tag name
 * @param content Meta tag content
 */
function addMetaTag(name: string, content: string, httpEquiv?: string): void {
  // Check if meta tag already exists
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  
  if (httpEquiv) {
    meta = document.querySelector(`meta[http-equiv="${httpEquiv}"]`) as HTMLMetaElement;
  }
  
  if (!meta) {
    // Create new meta tag
    meta = document.createElement('meta');
    
    if (httpEquiv) {
      meta.httpEquiv = httpEquiv;
    } else {
      meta.name = name;
    }
    
    document.head.appendChild(meta);
  }
  
  // Set content
  meta.content = content;
}

/**
 * Initialize security headers
 */
export function initSecurityHeaders(): void {
  try {
    // Create meta tags for security headers
    createSecurityHeaderMetaTags();
    
    // Log initialization in development
    if (isDevelopment()) {
      console.info('Security headers initialized');
    }
  } catch (error) {
    logError(error, { context: 'securityHeaders.initSecurityHeaders' });
  }
}

export default {
  SECURITY_HEADERS,
  applySecurityHeadersToRequest,
  createSecurityHeaderMetaTags,
  initSecurityHeaders
};