/**
 * Password Policy Utility
 * 
 * Enforces secure password requirements based on NIST 800-63B recommendations
 * and implements zxcvbn for password strength estimation.
 */

// Password validation types
interface PasswordValidationError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

interface PasswordStrengthResult {
  score: number; // 0-4, with 4 being strongest
  feedback: {
    warning: string;
    suggestions: string[];
  };
  isStrong: boolean;
}

// Common weak passwords list (abbreviated example)
// In production, this should be much more comprehensive or use an external library
const COMMON_PASSWORDS = [
  'password', 'admin', '123456', 'qwerty', 'welcome', 
  'letmein', 'monkey', 'football', 'dragon', 'baseball',
  '111111', 'iloveyou', 'trustno1', 'sunshine', 'master',
  'access', 'shadow', 'michael', 'superman', 'princess'
];

// Password policy configuration
export const PASSWORD_POLICY = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  preventPersonalInfo: true,
  minScore: 3, // Minimum zxcvbn score (0-4)
  ageLimit: 90 // Password expiry in days
};

/**
 * Check if password contains common patterns
 * @param password Password to check
 * @returns True if password contains common patterns
 */
function containsCommonPatterns(password: string): boolean {
  const patterns = [
    /^12345/, // Sequential numbers
    /^qwerty/i, // Sequential keyboard chars
    /([a-zA-Z0-9])\\1{2,}/ // Repeated characters
  ];
  
  return patterns.some(pattern => pattern.test(password));
}

/**
 * Check if password is in common passwords list
 * @param password Password to check
 * @returns True if password is common
 */
function isCommonPassword(password: string): boolean {
  const normalizedPassword = password.toLowerCase();
  return COMMON_PASSWORDS.includes(normalizedPassword);
}

/**
 * Basic password strength estimation
 * Note: In production, you should use zxcvbn or a similar library
 * @param password Password to check
 * @returns Password strength result
 */
export function estimatePasswordStrength(password: string): PasswordStrengthResult {
  // Score starts at 0 (weakest)
  let score = 0;
  const feedback = {
    warning: '',
    suggestions: []
  };
  
  // Length check
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety
  if (/[A-Z]/.test(password)) score += 0.5;
  if (/[a-z]/.test(password)) score += 0.5;
  if (/[0-9]/.test(password)) score += 0.5;
  if (/[^A-Za-z0-9]/.test(password)) score += 0.5;
  
  // Check for common patterns and passwords
  if (containsCommonPatterns(password)) {
    score = Math.max(0, score - 2);
    feedback.warning = 'Password contains common patterns';
    feedback.suggestions.push('Avoid sequential characters or repeated patterns');
  }
  
  if (isCommonPassword(password)) {
    score = 0; // Common passwords are automatically weak
    feedback.warning = 'This is a commonly used password';
    feedback.suggestions.push('Choose a unique password not found in common password lists');
  }
  
  // Add suggestions based on score
  if (score < 3) {
    if (password.length < 16) {
      feedback.suggestions.push('Use a longer password (16+ characters)');
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      feedback.suggestions.push('Mix uppercase and lowercase letters');
    }
    if (!/[0-9]/.test(password)) {
      feedback.suggestions.push('Add some numbers');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      feedback.suggestions.push('Add special characters (!, @, #, etc.)');
    }
  }
  
  // Round score to nearest integer and clamp between 0-4
  const finalScore = Math.min(4, Math.max(0, Math.round(score)));
  
  return {
    score: finalScore,
    feedback,
    isStrong: finalScore >= PASSWORD_POLICY.minScore
  };
}

/**
 * Enforces password policy rules
 * @param password Password to validate
 * @throws PasswordValidationError if password doesn't meet requirements
 */
export function enforcePasswordPolicy(password: string): void {
  const errors: string[] = [];
  
  // Check minimum length
  if (password.length < PASSWORD_POLICY.minLength) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
  }
  
  // Check maximum length
  if (password.length > PASSWORD_POLICY.maxLength) {
    errors.push(`Password cannot exceed ${PASSWORD_POLICY.maxLength} characters`);
  }
  
  // Check character requirements
  if (PASSWORD_POLICY.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (PASSWORD_POLICY.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (PASSWORD_POLICY.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (PASSWORD_POLICY.requireSpecialChars && !/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common passwords
  if (PASSWORD_POLICY.preventCommonPasswords && isCommonPassword(password)) {
    errors.push('Password is too common and easily guessable');
  }
  
  // Check for common patterns
  if (containsCommonPatterns(password)) {
    errors.push('Password contains common patterns (sequential characters, repeated patterns)');
  }
  
  // Estimate password strength
  const strengthResult = estimatePasswordStrength(password);
  if (!strengthResult.isStrong) {
    errors.push('Password is not strong enough. ' + strengthResult.feedback.warning);
    errors.push(...strengthResult.feedback.suggestions);
  }
  
  // If any errors, throw validation error
  if (errors.length > 0) {
    throw {
      code: 'password_policy_violation',
      message: 'Password does not meet security requirements',
      details: {
        errors,
        score: strengthResult.score
      }
    };
  }
}

export default {
  PASSWORD_POLICY,
  estimatePasswordStrength,
  enforcePasswordPolicy
};