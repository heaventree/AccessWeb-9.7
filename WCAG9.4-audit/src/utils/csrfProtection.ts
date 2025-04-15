/**
 * CSRF Protection Utility
 * 
 * Provides utilities for generating, validating and managing CSRF tokens
 * to protect against Cross-Site Request Forgery attacks.
 */

import { authStorage } from './secureStorage';
import { ErrorType, createError } from './errorHandler';

// Key used to store the CSRF token in secure storage
const CSRF_TOKEN_KEY = 'csrf_token';

// CSRF token expiration time in milliseconds (default: 2 hours)
const TOKEN_EXPIRY_MS = 2 * 60 * 60 * 1000;

// Token timestamp delimiter
const TOKEN_DELIMITER = ':';

/**
 * Generate a cryptographically secure CSRF token with timestamp
 * 
 * @returns CSRF token with embedded timestamp
 */
export function generateCsrfToken(): string {
  // Generate a random token
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  
  // Convert to base64 string
  const token = Array.from(randomBytes, byte => 
    byte.toString(16).padStart(2, '0')
  ).join('');
  
  // Add timestamp to token (used for expiration checking)
  const timestamp = Date.now().toString();
  const tokenWithTimestamp = `${token}${TOKEN_DELIMITER}${timestamp}`;
  
  // Store the token in secure storage
  authStorage.setItem(CSRF_TOKEN_KEY, tokenWithTimestamp);
  
  return tokenWithTimestamp;
}

/**
 * Get the current CSRF token, generating a new one if none exists
 * or if the current one is expired
 * 
 * @returns Current valid CSRF token
 */
export function getCsrfToken(): string {
  const currentToken = authStorage.getItem(CSRF_TOKEN_KEY);
  
  // If no token exists or it can't be parsed, generate a new one
  if (!currentToken || !isValidTokenFormat(currentToken)) {
    return generateCsrfToken();
  }
  
  // Check if token is expired
  const [token, timestampStr] = currentToken.split(TOKEN_DELIMITER);
  const timestamp = parseInt(timestampStr, 10);
  
  if (isNaN(timestamp) || Date.now() > timestamp + TOKEN_EXPIRY_MS) {
    // Token is expired, generate a new one
    return generateCsrfToken();
  }
  
  // Return existing valid token
  return currentToken;
}

/**
 * Validate a CSRF token against the stored token
 * 
 * @param token Token to validate
 * @returns True if token is valid, false otherwise
 */
export function validateCsrfToken(token: string): boolean {
  const storedToken = authStorage.getItem(CSRF_TOKEN_KEY);
  
  // No stored token
  if (!storedToken) {
    return false;
  }
  
  // Check if tokens match (precise comparison)
  if (token === storedToken) {
    return true;
  }
  
  // If token format is wrong or doesn't match, validation fails
  return false;
}

/**
 * Request validation middleware for CSRF protection
 * 
 * @param token CSRF token from request
 * @throws Error if token is invalid
 */
export function requireCsrfToken(token: string): void {
  if (!token) {
    throw createError(
      ErrorType.SECURITY,
      'csrf_token_missing',
      'CSRF token is missing'
    );
  }
  
  if (!validateCsrfToken(token)) {
    throw createError(
      ErrorType.SECURITY,
      'csrf_token_invalid',
      'Invalid or expired CSRF token'
    );
  }
}

/**
 * Check if token has valid format
 */
function isValidTokenFormat(token: string): boolean {
  // Token should be in format: token:timestamp
  const parts = token.split(TOKEN_DELIMITER);
  return parts.length === 2 && parts[0].length >= 32;
}

/**
 * Reset the CSRF token
 */
export function resetCsrfToken(): void {
  authStorage.removeItem(CSRF_TOKEN_KEY);
}

/**
 * Add CSRF token to headers for a fetch request
 * 
 * @param headers Headers object to modify
 */
export function addCsrfToHeaders(headers: Headers): void {
  const token = getCsrfToken();
  headers.set('X-CSRF-Token', token);
}

export default {
  generateCsrfToken,
  getCsrfToken,
  validateCsrfToken,
  requireCsrfToken,
  addCsrfToHeaders,
  resetCsrfToken
};