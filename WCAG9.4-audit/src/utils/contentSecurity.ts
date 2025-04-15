/**
 * Content Security Policy Utility
 * 
 * Implements a robust Content Security Policy (CSP) to protect against
 * XSS attacks and other code injection vulnerabilities.
 */

// CSP nonce storage
let currentNonce: string | null = null;

/**
 * Generate a random nonce (number used once) for CSP
 * @returns Random nonce string
 */
export function generateNonce(): string {
  // Generate a random string with crypto API if available
  let nonce = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    nonce = Array.from(array, (byte) => characters[byte % characters.length]).join('');
  } else {
    // Fallback (less secure) for older browsers
    for (let i = 0; i < 16; i++) {
      nonce += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }
  
  // Store for later use
  currentNonce = nonce;
  return nonce;
}

/**
 * Get the current CSP nonce
 * @returns Current nonce or null if not set
 */
export function getCurrentNonce(): string | null {
  return currentNonce;
}

/**
 * Build a Content Security Policy string
 * @param config CSP configuration options
 * @param nonce Optional nonce for script-src
 * @returns CSP string
 */
export function buildCspString(config?: Partial<ContentSecurityPolicyConfig>, nonce?: string): string {
  // Default CSP directives
  const defaultConfig: ContentSecurityPolicyConfig = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'strict-dynamic'", `'nonce-${nonce || currentNonce || ''}'`],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'connect-src': ["'self'", 'https://api.example.com'],
    'frame-src': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': true,
    'block-all-mixed-content': true
  };
  
  // Merge with provided config
  const mergedConfig: ContentSecurityPolicyConfig = { ...defaultConfig };
  
  if (config) {
    Object.entries(config).forEach(([key, value]) => {
      if (value === null) {
        // Remove this directive
        delete (mergedConfig as any)[key];
      } else {
        // Update directive
        (mergedConfig as any)[key] = value;
      }
    });
  }
  
  // Build CSP string
  const directives: string[] = [];
  
  Object.entries(mergedConfig).forEach(([key, value]) => {
    // Handle boolean directives
    if (typeof value === 'boolean') {
      if (value) directives.push(key);
      return;
    }
    
    // Handle array directives
    if (Array.isArray(value) && value.length > 0) {
      directives.push(`${key} ${value.join(' ')}`);
    }
  });
  
  return directives.join('; ');
}

/**
 * Install CSP meta tag in document head
 * @param config CSP configuration
 * @param nonce Optional nonce
 */
export function installCsp(config?: Partial<ContentSecurityPolicyConfig>, nonce?: string): void {
  // Generate nonce if not provided
  const nonceValue = nonce || generateNonce();
  
  // Build CSP string
  const cspString = buildCspString(config, nonceValue);
  
  // Create meta tag
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = cspString;
  
  // Insert into document head
  const firstChild = document.head.firstChild;
  document.head.insertBefore(meta, firstChild);
  
  // Store nonce for later use
  currentNonce = nonceValue;
}

/**
 * Create CSP header object for fetch requests
 * @param config CSP configuration
 * @param nonce Optional nonce
 * @returns Headers object with CSP
 */
export function createCspHeaders(config?: Partial<ContentSecurityPolicyConfig>, nonce?: string): Record<string, string> {
  return {
    'Content-Security-Policy': buildCspString(config, nonce || currentNonce || undefined)
  };
}

// Type definition for CSP configuration
interface ContentSecurityPolicyConfig {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'font-src': string[];
  'connect-src': string[];
  'frame-src': string[];
  'object-src': string[];
  'base-uri': string[];
  'form-action': string[];
  'frame-ancestors': string[];
  'upgrade-insecure-requests': boolean;
  'block-all-mixed-content': boolean;
  [key: string]: string[] | boolean | undefined;
}

export default {
  generateNonce,
  getCurrentNonce,
  buildCspString,
  installCsp,
  createCspHeaders
};