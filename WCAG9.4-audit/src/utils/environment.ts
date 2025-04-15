/**
 * Environment Configuration Utility
 * 
 * Provides secure environment variable management and configuration utilities.
 * Improves security by centralizing access to environment settings and
 * preventing exposure of sensitive values.
 */

// Default environment is production for security
export const NODE_ENV = process.env.NODE_ENV || 'production';

// Mode flags for conditional behaviors
export const IS_DEVELOPMENT_MODE = NODE_ENV === 'development';
export const IS_PRODUCTION_MODE = NODE_ENV === 'production';
export const IS_TEST_MODE = NODE_ENV === 'test';

// API configuration
export const API_BASE_URL = process.env.VITE_API_BASE_URL || '/api';
export const API_VERSION = process.env.VITE_API_VERSION || 'v1';
export const API_TIMEOUT = parseInt(process.env.VITE_API_TIMEOUT || '30000', 10);

// Security settings
export const CSRF_ENABLED = process.env.VITE_CSRF_ENABLED !== 'false';
export const RATE_LIMITING_ENABLED = process.env.VITE_RATE_LIMITING_ENABLED !== 'false';
export const CSP_ENABLED = process.env.VITE_CSP_ENABLED !== 'false';
export const MAX_FAILED_LOGIN_ATTEMPTS = parseInt(process.env.VITE_MAX_FAILED_LOGIN_ATTEMPTS || '5', 10);
export const LOCKOUT_TIME = parseInt(process.env.VITE_LOCKOUT_TIME || '1800000', 10); // 30 minutes default

// Feature flags
export const ENABLE_ANALYTICS = process.env.VITE_ENABLE_ANALYTICS === 'true';
export const ENABLE_SUBSCRIPTION = process.env.VITE_ENABLE_SUBSCRIPTION === 'true';
export const ENABLE_NOTIFICATIONS = process.env.VITE_ENABLE_NOTIFICATIONS === 'true';

// Accessibility settings
export const DEFAULT_CONTRAST_LEVEL = process.env.VITE_DEFAULT_CONTRAST_LEVEL || 'standard';
export const DEFAULT_FONT_SIZE = parseInt(process.env.VITE_DEFAULT_FONT_SIZE || '16', 10);

/**
 * Safely get a string environment variable with fallback
 * @param key Environment variable key
 * @param defaultValue Default value if not found
 * @returns Environment variable value or default
 */
export function getEnvString(key: string, defaultValue: string = ''): string {
  const envVarName = `VITE_${key}`;
  return process.env[envVarName] || defaultValue;
}

/**
 * Safely get a numeric environment variable with fallback
 * @param key Environment variable key
 * @param defaultValue Default value if not found
 * @returns Environment variable value or default
 */
export function getEnvNumber(key: string, defaultValue: number = 0): number {
  const stringValue = getEnvString(key, String(defaultValue));
  const parsedValue = parseInt(stringValue, 10);
  return isNaN(parsedValue) ? defaultValue : parsedValue;
}

/**
 * Safely get a boolean environment variable with fallback
 * @param key Environment variable key
 * @param defaultValue Default value if not found
 * @returns Environment variable value or default
 */
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const stringValue = getEnvString(key, String(defaultValue));
  return stringValue.toLowerCase() === 'true';
}

/**
 * Check if a feature flag is enabled
 * @param featureKey Feature flag key
 * @param defaultValue Default value if not found
 * @returns True if feature is enabled
 */
export function isFeatureEnabled(featureKey: string, defaultValue: boolean = false): boolean {
  return getEnvBoolean(`ENABLE_${featureKey.toUpperCase()}`, defaultValue);
}

/**
 * Get public runtime configuration (safe to expose to clients)
 * @returns Public configuration object
 */
export function getPublicConfig(): Record<string, any> {
  return {
    apiBaseUrl: API_BASE_URL,
    apiVersion: API_VERSION,
    environment: NODE_ENV,
    features: {
      analytics: ENABLE_ANALYTICS,
      subscription: ENABLE_SUBSCRIPTION,
      notifications: ENABLE_NOTIFICATIONS
    },
    accessibility: {
      defaultContrastLevel: DEFAULT_CONTRAST_LEVEL,
      defaultFontSize: DEFAULT_FONT_SIZE
    }
  };
}

/**
 * Redact sensitive values from config object for logging
 * @param config Configuration object to redact
 * @returns Redacted configuration
 */
export function redactSensitiveConfig(config: Record<string, any>): Record<string, any> {
  const sensitiveKeys = ['key', 'secret', 'password', 'token', 'credential', 'auth'];
  const redacted = { ...config };
  
  // Recursively redact sensitive values
  const redactObject = (obj: Record<string, any>) => {
    Object.keys(obj).forEach(key => {
      // Check if key is sensitive
      const isSensitive = sensitiveKeys.some(sensitiveKey => 
        key.toLowerCase().includes(sensitiveKey.toLowerCase())
      );
      
      if (isSensitive) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        redactObject(obj[key]);
      }
    });
  };
  
  redactObject(redacted);
  return redacted;
}

export default {
  NODE_ENV,
  IS_DEVELOPMENT_MODE,
  IS_PRODUCTION_MODE,
  IS_TEST_MODE,
  API_BASE_URL,
  API_VERSION,
  API_TIMEOUT,
  CSRF_ENABLED,
  RATE_LIMITING_ENABLED,
  CSP_ENABLED,
  ENABLE_ANALYTICS,
  ENABLE_SUBSCRIPTION,
  ENABLE_NOTIFICATIONS,
  DEFAULT_CONTRAST_LEVEL,
  DEFAULT_FONT_SIZE,
  getEnvString,
  getEnvNumber,
  getEnvBoolean,
  isFeatureEnabled,
  getPublicConfig,
  redactSensitiveConfig
};