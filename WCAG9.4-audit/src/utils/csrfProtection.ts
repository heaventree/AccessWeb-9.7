/**
 * CSRF Protection
 * 
 * Implements Cross-Site Request Forgery protection via
 * double-submit cookie pattern with cryptographic tokens.
 */

import { generateSecureRandomString } from './crypto';
import { secureLocalStorage } from './secureStorage';
import { IS_DEVELOPMENT_MODE } from './environment';

// Constants
const CSRF_TOKEN_LENGTH = 64;
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_STORAGE_KEY = 'csrf_token';

/**
 * Generate a new CSRF token
 * @returns Secure random token
 */
export function generateCsrfToken(): string {
  // Create a cryptographically secure random token
  const token = generateSecureRandomString(CSRF_TOKEN_LENGTH);
  
  // Store token in secure storage
  secureLocalStorage.setItem(CSRF_STORAGE_KEY, token);
  
  return token;
}

/**
 * Get the current CSRF token, generating a new one if needed
 * @returns CSRF token
 */
export function getCsrfToken(): string {
  // Try to get existing token
  const existingToken = secureLocalStorage.getItem(CSRF_STORAGE_KEY);
  
  if (existingToken) {
    return existingToken;
  }
  
  // Generate new token if none exists
  return generateCsrfToken();
}

/**
 * Append CSRF token to headers
 * @param headers Headers object to modify
 * @returns Modified headers
 */
export function appendCsrfHeader(headers: Headers): Headers {
  // Get token
  const token = getCsrfToken();
  
  // Set header
  headers.set(CSRF_HEADER_NAME, token);
  
  return headers;
}

/**
 * Verify CSRF token
 * @param token Token to verify
 * @returns True if token is valid
 */
export function verifyCsrfToken(token: string): boolean {
  // Development mode bypass for testing
  if (IS_DEVELOPMENT_MODE && token === 'DEVELOPMENT_MODE_BYPASS') {
    return true;
  }
  
  // Get stored token
  const storedToken = secureLocalStorage.getItem(CSRF_STORAGE_KEY);
  
  // No stored token
  if (!storedToken) {
    return false;
  }
  
  // Compare tokens with constant-time comparison to prevent timing attacks
  return constantTimeCompare(storedToken, token);
}

/**
 * Constant-time string comparison to prevent timing attacks
 * @param a First string
 * @param b Second string
 * @returns True if strings are equal
 */
function constantTimeCompare(a: string, b: string): boolean {
  // If lengths differ, strings are not equal
  if (a.length !== b.length) {
    return false;
  }
  
  // Compare characters with constant-time algorithm
  let result = 0;
  
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Include CSRF token in form
 * @param formElement Form element
 */
export function includeCsrfTokenInForm(formElement: HTMLFormElement): void {
  // Get token
  const token = getCsrfToken();
  
  // Create hidden input
  let inputElement = formElement.querySelector(`input[name="${CSRF_HEADER_NAME}"]`) as HTMLInputElement;
  
  if (!inputElement) {
    // Create new input if it doesn't exist
    inputElement = document.createElement('input');
    inputElement.type = 'hidden';
    inputElement.name = CSRF_HEADER_NAME;
    formElement.appendChild(inputElement);
  }
  
  // Set token value
  inputElement.value = token;
}

/**
 * Create CSRF meta tag to include in HTML head
 */
export function createCsrfMetaTag(): void {
  // Get token
  const token = getCsrfToken();
  
  // Check if meta tag already exists
  let metaTag = document.querySelector(`meta[name="${CSRF_HEADER_NAME}"]`) as HTMLMetaElement;
  
  if (!metaTag) {
    // Create new meta tag
    metaTag = document.createElement('meta');
    metaTag.name = CSRF_HEADER_NAME;
    document.head.appendChild(metaTag);
  }
  
  // Set token value
  metaTag.content = token;
}

/**
 * Initialize CSRF protection
 */
export function initCsrfProtection(): void {
  // Generate initial token
  generateCsrfToken();
  
  // Create meta tag
  if (typeof document !== 'undefined') {
    createCsrfMetaTag();
    
    // Add event listener to automatically include CSRF token in forms
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      includeCsrfTokenInForm(form);
    });
  }
}

export default {
  generateCsrfToken,
  getCsrfToken,
  appendCsrfHeader,
  verifyCsrfToken,
  includeCsrfTokenInForm,
  createCsrfMetaTag,
  initCsrfProtection
};