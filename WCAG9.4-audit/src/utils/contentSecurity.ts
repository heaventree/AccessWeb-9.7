/**
 * Content Security Policy
 * 
 * Implements CSP to protect against XSS and other code injection attacks
 * by restricting what resources can be loaded and executed.
 */

import { logError } from './errorHandler';
import { IS_DEVELOPMENT_MODE, CSP_REPORT_URI } from './environment';

// CSP directives
const CSP_DIRECTIVES = {
  // Restrict base URIs
  'base-uri': ["'self'"],
  
  // Restrict forms to same origin
  'form-action': ["'self'"],
  
  // Restrict which resources can be embedded in frames
  'frame-ancestors': ["'self'"],
  
  // Restrict sources for JavaScript
  'script-src': [
    "'self'",
    // Allow Vite HMR in development
    ...(IS_DEVELOPMENT_MODE ? ["'unsafe-eval'", "'unsafe-inline'"] : []),
    // Add CDNs here if needed
    'https://cdn.jsdelivr.net',
    // Add nonce placeholder to allow specific scripts
    "'nonce-{{nonce}}'"
  ],
  
  // Restrict sources for styles
  'style-src': [
    "'self'",
    // Allow inline styles for development/Tailwind
    ...(IS_DEVELOPMENT_MODE ? ["'unsafe-inline'"] : []),
    // Add CDNs here if needed
    'https://cdn.jsdelivr.net',
    'https://fonts.googleapis.com'
  ],
  
  // Restrict sources for images
  'img-src': [
    "'self'",
    'data:',
    'https:',
    'blob:'
  ],
  
  // Restrict sources for fonts
  'font-src': [
    "'self'",
    'https://fonts.gstatic.com',
    'data:'
  ],
  
  // Restrict sources for connections
  'connect-src': [
    "'self'",
    // Allow WebSocket for Vite HMR in development
    ...(IS_DEVELOPMENT_MODE ? ['ws:', 'wss:'] : []),
    // Add API endpoints here
    'https://api.accessibility.example.com'
  ],
  
  // Restrict object sources
  'object-src': ["'none'"],
  
  // Report violations to the specified URI
  ...(CSP_REPORT_URI ? { 'report-uri': [CSP_REPORT_URI] } : {})
};

// Generate a random nonce for inline scripts
let currentNonce = '';

/**
 * Generate a random nonce
 * @returns Random nonce string
 */
export function generateNonce(): string {
  // Create a random string for the nonce
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const nonce = Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  // Store current nonce
  currentNonce = nonce;
  
  return nonce;
}

/**
 * Get the current nonce
 * @returns Current nonce
 */
export function getNonce(): string {
  return currentNonce || generateNonce();
}

/**
 * Build the CSP header value
 * @returns CSP header string
 */
export function buildCspHeader(): string {
  // Replace nonce placeholder with actual nonce
  const nonce = getNonce();
  
  // Build CSP header value
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => {
      // Replace nonce placeholder with actual nonce
      const processedSources = sources.map(source => 
        source.replace('{{nonce}}', nonce)
      );
      
      return `${directive} ${processedSources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Add CSP meta tag to document head
 */
export function addCspMetaTag(): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  try {
    // Build CSP header
    const cspContent = buildCspHeader();
    
    // Create meta tag
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = 'Content-Security-Policy';
    metaTag.content = cspContent;
    
    // Add to head
    document.head.appendChild(metaTag);
  } catch (error) {
    logError(error, { context: 'contentSecurity.addCspMetaTag' });
  }
}

/**
 * Add nonce to script element
 * @param script Script element
 * @returns Script element with nonce
 */
export function addNonceToScript(script: HTMLScriptElement): HTMLScriptElement {
  try {
    script.nonce = getNonce();
  } catch (error) {
    logError(error, { context: 'contentSecurity.addNonceToScript' });
  }
  
  return script;
}

/**
 * Initialize Content Security Policy
 */
export function initContentSecurity(): void {
  try {
    // Generate nonce
    generateNonce();
    
    // Add CSP meta tag
    addCspMetaTag();
    
    // Set up listener for dynamic script additions
    if (typeof document !== 'undefined' && typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeName === 'SCRIPT') {
                addNonceToScript(node as HTMLScriptElement);
              }
            });
          }
        });
      });
      
      // Start observing
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
    
    // Log initialization in development
    if (IS_DEVELOPMENT_MODE) {
      console.info('Content Security Policy initialized');
    }
  } catch (error) {
    logError(error, { context: 'contentSecurity.initContentSecurity' });
  }
}

export default {
  generateNonce,
  getNonce,
  buildCspHeader,
  addCspMetaTag,
  addNonceToScript,
  initContentSecurity
};