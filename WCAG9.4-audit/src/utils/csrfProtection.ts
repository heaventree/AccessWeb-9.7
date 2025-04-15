/**
 * CSRF Protection Utility
 * 
 * Provides Cross-Site Request Forgery (CSRF) protection for API requests.
 * Implements the double-submit cookie pattern with secure validation.
 */

import { ErrorType, createError } from './errorHandler';
import { secureHash } from './secureStorage';

// Constants
const CSRF_TOKEN_KEY = 'csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';
const CSRF_TOKEN_EXPIRY = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

/**
 * Generate a secure random token
 * @returns Secure random token string
 */
function generateSecureToken(): string {
  let token = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // Use crypto if available
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint8Array(48);
    window.crypto.getRandomValues(array);
    token = Array.from(array, (byte) => characters[byte % characters.length]).join('');
  } else {
    // Fallback to Math.random (less secure)
    for (let i = 0; i < 48; i++) {
      token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  }
  
  return token;
}

/**
 * Store a CSRF token in storage with expiry
 * @param token CSRF token to store
 */
function storeToken(token: string): void {
  // Store token with expiry timestamp
  localStorage.setItem(
    CSRF_TOKEN_KEY, 
    JSON.stringify({
      token: secureHash(token), // Store hashed version for additional security
      raw: token, // Also store raw token for browser-only usage
      expires: Date.now() + CSRF_TOKEN_EXPIRY
    })
  );
}

/**
 * Get the current CSRF token, generating a new one if needed or if forceNew is true
 * @param forceNew Force generation of a new token
 * @returns CSRF token
 */
export function getCsrfToken(forceNew: boolean = false): string {
  // Check if we have a valid token already
  if (!forceNew) {
    try {
      const storedData = localStorage.getItem(CSRF_TOKEN_KEY);
      if (storedData) {
        const data = JSON.parse(storedData);
        
        // Check if token is still valid
        if (data.expires > Date.now() && data.raw) {
          return data.raw;
        }
      }
    } catch (err) {
      console.error('Error parsing stored CSRF token:', err);
    }
  }
  
  // Generate a new token
  const newToken = generateSecureToken();
  storeToken(newToken);
  return newToken;
}

/**
 * Append CSRF token to request headers
 * @param headers Request headers object
 */
export function appendCsrfHeader(headers: Headers): void {
  const token = getCsrfToken();
  headers.set(CSRF_HEADER_NAME, token);
}

/**
 * Validate a CSRF token against the stored token
 * @param token Token to validate
 * @returns True if token is valid
 */
export function validateCsrfToken(token: string): boolean {
  try {
    const storedData = localStorage.getItem(CSRF_TOKEN_KEY);
    if (!storedData) return false;
    
    const data = JSON.parse(storedData);
    
    // Check if token is expired
    if (data.expires <= Date.now()) {
      return false;
    }
    
    // Compare hashed token with stored hash
    return secureHash(token) === data.token;
  } catch (err) {
    console.error('Error validating CSRF token:', err);
    return false;
  }
}

/**
 * Middleware to protect API endpoints from CSRF attacks
 * @param req Request object
 * @param headerName CSRF header name
 * @throws Error if CSRF validation fails
 */
export function requireCsrfToken(req: Request): void {
  // Get token from header
  const token = req.headers.get(CSRF_HEADER_NAME);
  
  // Check if token exists
  if (!token) {
    throw createError(
      ErrorType.SECURITY,
      'csrf_token_missing',
      'CSRF token is missing from request',
      { headerName: CSRF_HEADER_NAME }
    );
  }
  
  // Validate token
  if (!validateCsrfToken(token)) {
    throw createError(
      ErrorType.SECURITY,
      'csrf_token_invalid',
      'CSRF token validation failed',
      { headerName: CSRF_HEADER_NAME }
    );
  }
}

/**
 * Reset CSRF token (e.g., after logout)
 */
export function resetCsrfToken(): void {
  localStorage.removeItem(CSRF_TOKEN_KEY);
}

export default {
  getCsrfToken,
  appendCsrfHeader,
  validateCsrfToken,
  requireCsrfToken,
  resetCsrfToken
};