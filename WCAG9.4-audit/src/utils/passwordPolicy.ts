/**
 * Password Policy Utility
 * 
 * Provides utilities for enforcing strong password policies,
 * validating password strength, and generating secure passwords.
 */

import { ErrorType, createError } from './errorHandler';

export interface PasswordPolicyOptions {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  maxLength?: number;
  disallowCommonPasswords?: boolean;
  passwordHistorySize?: number;
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-100 score of password strength
  errors: string[]; // List of validation errors
  suggestions: string[]; // Suggestions for improvement
}

// Default password policy (NIST 800-63B compliant)
export const defaultPasswordPolicy: PasswordPolicyOptions = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
  disallowCommonPasswords: true,
  passwordHistorySize: 5
};

// List of common passwords to check against
// This is a small subset, in a real implementation this would be much larger
const commonPasswords = [
  'password', 'password123', '123456', 'qwerty', 'admin',
  'welcome', 'letmein', 'abc123', 'monkey', 'football'
];

/**
 * Validate a password against the password policy
 * 
 * @param password Password to validate
 * @param options Password policy options
 * @returns Validation result with score, errors, and suggestions
 */
export function validatePassword(
  password: string,
  options: Partial<PasswordPolicyOptions> = {}
): PasswordValidationResult {
  // Merge options with defaults
  const policy: PasswordPolicyOptions = {
    ...defaultPasswordPolicy,
    ...options
  };
  
  const errors: string[] = [];
  const suggestions: string[] = [];
  
  // Check minimum length
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
    suggestions.push(`Add ${policy.minLength - password.length} more characters`);
  }
  
  // Check maximum length if specified
  if (policy.maxLength && password.length > policy.maxLength) {
    errors.push(`Password cannot exceed ${policy.maxLength} characters`);
  }
  
  // Check character requirements
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter');
    suggestions.push('Add an uppercase letter (A-Z)');
  }
  
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter');
    suggestions.push('Add a lowercase letter (a-z)');
  }
  
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must include at least one number');
    suggestions.push('Add a number (0-9)');
  }
  
  if (policy.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must include at least one special character');
    suggestions.push('Add a special character (e.g., !@#$%^&*)');
  }
  
  // Check against common passwords
  if (policy.disallowCommonPasswords && isCommonPassword(password)) {
    errors.push('Password is too common and easily guessable');
    suggestions.push('Choose a less common password that is not easily guessable');
  }
  
  // Calculate strength score (0-100)
  // This is a simple implementation; a real one might use zxcvbn or similar
  const score = calculatePasswordStrength(password, policy);
  
  return {
    isValid: errors.length === 0,
    score,
    errors,
    suggestions: errors.length > 0 ? suggestions : []
  };
}

/**
 * Check if a password is among common passwords
 * 
 * @param password Password to check
 * @returns True if password is common
 */
function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase();
  
  // Check if password is in our common password list
  if (commonPasswords.includes(lowerPassword)) {
    return true;
  }
  
  // Check for simple variations (adding numbers at the end, etc.)
  for (const common of commonPasswords) {
    if (lowerPassword.startsWith(common) && /^\d+$/.test(lowerPassword.substring(common.length))) {
      return true;
    }
  }
  
  return false;
}

/**
 * Calculate password strength score (0-100)
 * 
 * @param password Password to evaluate
 * @param policy Password policy to check against
 * @returns Numeric score from 0-100
 */
function calculatePasswordStrength(
  password: string,
  policy: PasswordPolicyOptions
): number {
  // Start with 0 score
  let score = 0;
  
  // Length contributes up to 40 points
  const lengthScore = Math.min(40, (password.length / policy.minLength) * 30);
  score += lengthScore;
  
  // Character variety contributes up to 40 points
  let varietyScore = 0;
  
  if (/[A-Z]/.test(password)) varietyScore += 10;
  if (/[a-z]/.test(password)) varietyScore += 10;
  if (/[0-9]/.test(password)) varietyScore += 10;
  if (/[^A-Za-z0-9]/.test(password)) varietyScore += 10;
  
  score += varietyScore;
  
  // Bonus points for mixing character types (up to 20 points)
  const charTypes = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(regex => 
    regex.test(password)
  ).length;
  
  score += charTypes * 5;
  
  // Penalty for common passwords
  if (isCommonPassword(password)) {
    score = Math.max(0, score - 50);
  }
  
  // Cap at 100
  return Math.min(100, score);
}

/**
 * Enforce password policy during password creation or change
 * 
 * @param password Password to validate
 * @param options Password policy options
 * @throws Error if password doesn't meet policy requirements
 */
export function enforcePasswordPolicy(
  password: string,
  options: Partial<PasswordPolicyOptions> = {}
): void {
  const result = validatePassword(password, options);
  
  if (!result.isValid) {
    throw createError(
      ErrorType.VALIDATION,
      'password_policy_violation',
      'Password does not meet security requirements',
      {
        errors: result.errors,
        suggestions: result.suggestions
      }
    );
  }
}

/**
 * Check if a password is in the user's password history
 * 
 * @param password Password to check
 * @param passwordHistory Array of previous password hashes
 * @param hashComparer Function to compare password with hash
 * @returns True if password is in history
 */
export async function isPasswordInHistory(
  password: string,
  passwordHistory: string[],
  hashComparer: (password: string, hash: string) => Promise<boolean>
): Promise<boolean> {
  for (const hash of passwordHistory) {
    if (await hashComparer(password, hash)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Generate a secure random password that meets policy requirements
 * 
 * @param options Password policy options
 * @returns Secure random password
 */
export function generateSecurePassword(
  options: Partial<PasswordPolicyOptions> = {}
): string {
  // Merge options with defaults
  const policy: PasswordPolicyOptions = {
    ...defaultPasswordPolicy,
    ...options
  };
  
  // Define character sets based on policy
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numberChars = '0123456789';
  const specialChars = '!@#$%^&*()_-+=<>?/[]{}|';
  
  // Build character pool based on requirements
  let charPool = '';
  if (policy.requireUppercase) charPool += uppercaseChars;
  if (policy.requireLowercase) charPool += lowercaseChars;
  if (policy.requireNumbers) charPool += numberChars;
  if (policy.requireSpecialChars) charPool += specialChars;
  
  // If nothing was required, use a default set
  if (charPool.length === 0) {
    charPool = lowercaseChars + numberChars;
  }
  
  // Generate random password
  const length = policy.minLength + Math.floor(Math.random() * 4); // Add some randomness to length
  let password = '';
  
  // First, ensure each required character type is included
  if (policy.requireUppercase) {
    password += getRandomChar(uppercaseChars);
  }
  
  if (policy.requireLowercase) {
    password += getRandomChar(lowercaseChars);
  }
  
  if (policy.requireNumbers) {
    password += getRandomChar(numberChars);
  }
  
  if (policy.requireSpecialChars) {
    password += getRandomChar(specialChars);
  }
  
  // Fill the rest with random characters from the pool
  while (password.length < length) {
    password += getRandomChar(charPool);
  }
  
  // Shuffle the password (Fisher-Yates algorithm)
  return shuffleString(password);
}

/**
 * Get a random character from a string
 */
function getRandomChar(chars: string): string {
  const randomBytes = new Uint8Array(1);
  window.crypto.getRandomValues(randomBytes);
  return chars.charAt(randomBytes[0] % chars.length);
}

/**
 * Shuffle a string (Fisher-Yates algorithm)
 */
function shuffleString(str: string): string {
  const arr = str.split('');
  const randomBytes = new Uint8Array(arr.length);
  window.crypto.getRandomValues(randomBytes);
  
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomBytes[i] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr.join('');
}

export default {
  validatePassword,
  enforcePasswordPolicy,
  isPasswordInHistory,
  generateSecurePassword,
  defaultPasswordPolicy
};