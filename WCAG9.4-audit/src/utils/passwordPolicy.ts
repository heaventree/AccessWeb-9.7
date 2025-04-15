/**
 * Password Policy Utility
 * 
 * Enforces strong password rules and secure password handling
 * to protect user accounts from brute force and credential stuffing attacks.
 */

import { ErrorType, createError } from './errorHandler';
import { MAX_FAILED_LOGIN_ATTEMPTS, LOCKOUT_TIME } from './environment';

export class PasswordValidationError extends Error {
  code: string;
  details: Record<string, any>;
  
  constructor(code: string, message: string, details: Record<string, any> = {}) {
    super(message);
    this.name = 'PasswordValidationError';
    this.code = code;
    this.details = details;
    
    // Set prototype explicitly for instanceof to work
    Object.setPrototypeOf(this, PasswordValidationError.prototype);
  }
}

/**
 * Password policy configuration
 */
export interface PasswordPolicyConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  disallowCommonPasswords: boolean;
  passwordHistoryLimit: number;
}

/**
 * Default password policy configuration
 */
export const DEFAULT_PASSWORD_POLICY: PasswordPolicyConfig = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  disallowCommonPasswords: true,
  passwordHistoryLimit: 5
};

/**
 * Validation rules for password checking
 */
const PASSWORD_VALIDATION_RULES = [
  {
    test: (password: string, config: PasswordPolicyConfig) => 
      password.length >= config.minLength,
    code: 'min_length',
    message: (config: PasswordPolicyConfig) => 
      `Password must be at least ${config.minLength} characters long`
  },
  {
    test: (password: string, config: PasswordPolicyConfig) => 
      password.length <= config.maxLength,
    code: 'max_length',
    message: (config: PasswordPolicyConfig) => 
      `Password cannot exceed ${config.maxLength} characters`
  },
  {
    test: (password: string, config: PasswordPolicyConfig) => 
      !config.requireUppercase || /[A-Z]/.test(password),
    code: 'require_uppercase',
    message: () => 'Password must include at least one uppercase letter'
  },
  {
    test: (password: string, config: PasswordPolicyConfig) => 
      !config.requireLowercase || /[a-z]/.test(password),
    code: 'require_lowercase',
    message: () => 'Password must include at least one lowercase letter'
  },
  {
    test: (password: string, config: PasswordPolicyConfig) => 
      !config.requireNumbers || /[0-9]/.test(password),
    code: 'require_numbers',
    message: () => 'Password must include at least one number'
  },
  {
    test: (password: string, config: PasswordPolicyConfig) => 
      !config.requireSpecialChars || /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password),
    code: 'require_special_chars',
    message: () => 'Password must include at least one special character'
  }
];

// Top 20 most common passwords to check against
const COMMON_PASSWORDS = [
  '123456', 'password', '12345678', 'qwerty', '123456789',
  '12345', '1234', '111111', '1234567', 'dragon',
  '123123', 'baseball', 'abc123', 'football', 'monkey',
  'letmein', '696969', 'shadow', 'master', '666666'
];

/**
 * Validate a password against the password policy
 * @param password Password to validate
 * @param config Password policy configuration
 * @returns Array of validation failures or empty array if valid
 */
export function validatePassword(
  password: string,
  config: Partial<PasswordPolicyConfig> = {}
): { isValid: boolean; failures: Array<{ code: string; message: string }> } {
  // Merge with default config
  const mergedConfig = { ...DEFAULT_PASSWORD_POLICY, ...config };
  const failures: Array<{ code: string; message: string }> = [];

  // Check each validation rule
  PASSWORD_VALIDATION_RULES.forEach(rule => {
    if (!rule.test(password, mergedConfig)) {
      failures.push({
        code: rule.code,
        message: rule.message(mergedConfig)
      });
    }
  });

  // Check for common passwords
  if (mergedConfig.disallowCommonPasswords && COMMON_PASSWORDS.includes(password.toLowerCase())) {
    failures.push({
      code: 'common_password',
      message: 'Password is too common and easily guessable'
    });
  }
  
  return {
    isValid: failures.length === 0,
    failures
  };
}

/**
 * Check if a password is in the user's history
 * @param newPassword New password to check
 * @param passwordHistory Array of previous password hashes
 * @returns True if password is in history
 */
export function isPasswordInHistory(
  newPassword: string,
  passwordHistory: string[]
): boolean {
  // In a real implementation, we would hash the new password and compare
  // with stored hashes. This is a simplified version.
  return passwordHistory.includes(newPassword);
}

/**
 * Validate password with error throwing
 * @param password Password to validate
 * @param config Password policy configuration
 * @throws Error if password is invalid
 */
export function enforcePasswordPolicy(
  password: string,
  config: Partial<PasswordPolicyConfig> = {}
): void {
  const { isValid, failures } = validatePassword(password, config);
  
  if (!isValid) {
    throw createError(
      ErrorType.VALIDATION,
      'invalid_password',
      failures[0].message,
      { failures }
    );
  }
}

/**
 * Track and enforce account lockout after too many failed attempts
 */
export class AccountLockoutManager {
  private static failedAttempts: Map<string, number> = new Map();
  private static lockoutTimestamps: Map<string, number> = new Map();
  
  /**
   * Record a failed login attempt
   * @param username Username or identifier
   * @returns Number of remaining attempts before lockout
   */
  static recordFailedAttempt(username: string): number {
    // Check if account is already locked
    if (this.isAccountLocked(username)) {
      return 0;
    }
    
    // Get current failed attempts
    const currentAttempts = this.failedAttempts.get(username) || 0;
    const newAttempts = currentAttempts + 1;
    
    // Update failed attempts
    this.failedAttempts.set(username, newAttempts);
    
    // Set lockout timestamp if max attempts reached
    if (newAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      this.lockoutTimestamps.set(username, Date.now() + LOCKOUT_TIME);
      return 0;
    }
    
    return MAX_FAILED_LOGIN_ATTEMPTS - newAttempts;
  }
  
  /**
   * Check if an account is currently locked out
   * @param username Username or identifier
   * @returns True if account is locked
   */
  static isAccountLocked(username: string): boolean {
    const lockoutTime = this.lockoutTimestamps.get(username);
    
    if (!lockoutTime) {
      return false;
    }
    
    // Check if lockout has expired
    if (Date.now() >= lockoutTime) {
      // Reset lockout
      this.resetLockout(username);
      return false;
    }
    
    return true;
  }
  
  /**
   * Get time remaining on account lockout in seconds
   * @param username Username or identifier
   * @returns Seconds remaining or 0 if not locked
   */
  static getLockoutTimeRemaining(username: string): number {
    const lockoutTime = this.lockoutTimestamps.get(username);
    
    if (!lockoutTime) {
      return 0;
    }
    
    const remaining = Math.max(0, Math.floor((lockoutTime - Date.now()) / 1000));
    
    return remaining;
  }
  
  /**
   * Reset lockout and failed attempts for an account
   * @param username Username or identifier
   */
  static resetLockout(username: string): void {
    this.failedAttempts.delete(username);
    this.lockoutTimestamps.delete(username);
  }
}

export default {
  validatePassword,
  enforcePasswordPolicy,
  isPasswordInHistory,
  AccountLockoutManager,
  DEFAULT_PASSWORD_POLICY
};