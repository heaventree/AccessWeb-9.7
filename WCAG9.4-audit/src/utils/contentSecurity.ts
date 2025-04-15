/**
 * Content Security Policy (CSP) Utility
 * 
 * Provides utilities for working with Content Security Policy, including
 * generating nonces, validating sources, and creating CSP headers.
 */

import { createError, ErrorType } from './errorHandler';

/**
 * Default CSP directives
 */
export const defaultCspDirectives = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'strict-dynamic'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https:'],
  'connect-src': ["'self'", 'https:'],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

/**
 * Generate a cryptographically secure nonce for CSP
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validate if a source is allowed by Content Security Policy
 */
export function validateSource(
  source: string,
  directive: keyof typeof defaultCspDirectives
): boolean {
  // Get allowed sources for the directive
  const allowedSources = defaultCspDirectives[directive] || [];
  
  // Check if the source is specifically allowed
  if (allowedSources.includes(source)) {
    return true;
  }
  
  // Check against wildcard patterns (domain*)
  for (const allowedSource of allowedSources) {
    if (allowedSource.endsWith('*') && source.startsWith(allowedSource.slice(0, -1))) {
      return true;
    }
  }
  
  // Check if 'self' is allowed and source is same origin
  if (allowedSources.includes("'self'")) {
    try {
      const sourceUrl = new URL(source, window.location.origin);
      if (sourceUrl.origin === window.location.origin) {
        return true;
      }
    } catch (error) {
      // Invalid URL, not allowed
      return false;
    }
  }
  
  return false;
}

/**
 * Safely load a script with CSP nonce
 */
export function loadScriptWithNonce(
  url: string,
  nonce: string,
  async = true,
  defer = true
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Validate source
    if (!validateSource(url, 'script-src')) {
      reject(
        createError(
          ErrorType.SECURITY,
          'csp_violation',
          'Script source violates Content Security Policy',
          { source: url }
        )
      );
      return;
    }
    
    const script = document.createElement('script');
    script.src = url;
    script.nonce = nonce;
    script.async = async;
    script.defer = defer;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    
    document.head.appendChild(script);
  });
}

/**
 * Generate a CSP header value from directives
 */
export function generateCspHeaderValue(
  directives = defaultCspDirectives,
  nonce?: string
): string {
  let headerValue = '';
  
  Object.entries(directives).forEach(([directive, sources]) => {
    if (sources.length || directive === 'upgrade-insecure-requests') {
      headerValue += directive;
      
      // Add sources if any (except for upgrade-insecure-requests)
      if (sources.length) {
        headerValue += ' ' + sources.join(' ');
        
        // Add nonce for script-src and style-src if provided
        if (nonce && (directive === 'script-src' || directive === 'style-src')) {
          headerValue += ` 'nonce-${nonce}'`;
        }
      }
      
      headerValue += '; ';
    }
  });
  
  return headerValue.trim();
}

/**
 * Create a Content Security Policy meta tag
 */
export function createCspMetaTag(
  directives = defaultCspDirectives,
  nonce?: string
): HTMLMetaElement {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = generateCspHeaderValue(directives, nonce);
  return meta;
}

/**
 * Install a Content Security Policy in the document
 */
export function installCsp(
  directives = defaultCspDirectives,
  nonce?: string
): void {
  // Generate nonce if not provided
  const cspNonce = nonce || generateNonce();
  
  // Create meta tag
  const metaTag = createCspMetaTag(directives, cspNonce);
  
  // Add to document head
  document.head.appendChild(metaTag);
  
  // Mark nonce on window for later use
  (window as any).__CSP_NONCE__ = cspNonce;
}

/**
 * Get the current CSP nonce if available
 */
export function getCurrentNonce(): string | null {
  return (window as any).__CSP_NONCE__ || null;
}

export default {
  defaultCspDirectives,
  generateNonce,
  validateSource,
  loadScriptWithNonce,
  generateCspHeaderValue,
  createCspMetaTag,
  installCsp,
  getCurrentNonce
};