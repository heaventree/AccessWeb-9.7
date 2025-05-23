/**
 * Environment Utilities
 * 
 * Provides a secure and centralized way to access environment variables
 * and configuration.
 */

import { handleError, ErrorType } from './errorHandler';

// Cache for environment variables
const envCache: Record<string, string> = {};

/**
 * Load all environment variables into cache
 */
export function loadEnvVariables(): void {
  try {
    // Import.meta.env is available in Vite applications
    if (import.meta.env) {
      // Load all environment variables from import.meta.env
      Object.entries(import.meta.env).forEach(([key, value]) => {
        if (typeof value === 'string') {
          envCache[key] = value;
        }
      });
    }
    
    // Also load from process.env if available (for SSR or Node.js environments)
    if (typeof process !== 'undefined' && process.env) {
      Object.entries(process.env).forEach(([key, value]) => {
        if (typeof value === 'string') {
          envCache[key] = value;
        }
      });
    }
  } catch (error) {
    handleError(error, { context: 'loadEnvVariables' });
  }
}

/**
 * Get any environment variable (alias for getEnvString for backward compatibility)
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value or default
 */
/**
 * Require an environment variable - throws error in production if not set
 * @param key Environment variable key
 * @param devFallback Optional fallback value for development
 * @returns Environment variable value 
 * @throws Error if variable not set in production
 */
export function requireEnvVariable(key: string, devFallback?: string): string {
  // Get the value
  const value = getEnvString(key, '');
  
  // Check if we have a value
  if (!value) {
    if (isProduction()) {
      // In production, this is a critical error
      const errorMessage = `Required environment variable ${key} is not set`;
      console.error(`[ERROR] ${errorMessage}`);
      
      // Create and throw a standard error
      const error = new Error(errorMessage);
      (error as any).type = ErrorType.CONFIGURATION;
      (error as any).code = 'missing_env_variable';
      
      // Log the error using our error handler
      handleError(errorMessage, { 
        context: 'requireEnvVariable', 
        key
      });
      
      throw error;
    } else if (devFallback) {
      // In development, use fallback but log a warning
      const message = `Environment variable ${key} not set, using development fallback. This would fail in production.`;
      console.warn(message);
      return devFallback;
    }
  }
  
  return value;
}

export function getEnvVariable(key: string, defaultValue: string = ''): string {
  return getEnvString(key, defaultValue);
}

/**
 * Get a string environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value or default
 */
export function getEnvString(key: string, defaultValue: string = ''): string {
  try {
    // Check cache first
    if (envCache[key]) {
      return envCache[key];
    }
    
    // Try to get from import.meta.env (Vite)
    if (import.meta.env && import.meta.env[key]) {
      const value = import.meta.env[key];
      
      if (typeof value === 'string') {
        // Cache value for future use
        envCache[key] = value;
        return value;
      }
    }
    
    // Try to get from process.env (Node.js)
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      const value = process.env[key];
      
      if (typeof value === 'string') {
        // Cache value for future use
        envCache[key] = value;
        return value;
      }
    }
    
    // Return default value if not found
    return defaultValue;
  } catch (error) {
    handleError(error, { context: 'getEnvString', key });
    return defaultValue;
  }
}

/**
 * Get a number environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set or not a valid number
 * @returns Environment variable value as number or default
 */
export function getEnvNumber(key: string, defaultValue: number = 0): number {
  try {
    const stringValue = getEnvString(key, String(defaultValue));
    const numberValue = Number(stringValue);
    
    // Return default if not a valid number
    return isNaN(numberValue) ? defaultValue : numberValue;
  } catch (error) {
    handleError(error, { context: 'getEnvNumber', key });
    return defaultValue;
  }
}

/**
 * Get a boolean environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value as boolean or default
 */
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  try {
    const stringValue = getEnvString(key, String(defaultValue));
    
    // Check for truthy values
    return ['true', 'yes', '1'].includes(stringValue.toLowerCase());
  } catch (error) {
    handleError(error, { context: 'getEnvBoolean', key });
    return defaultValue;
  }
}

/**
 * Get an array environment variable (comma-separated values)
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set
 * @returns Environment variable value as array or default
 */
export function getEnvArray(key: string, defaultValue: string[] = []): string[] {
  try {
    const stringValue = getEnvString(key, '');
    
    // Return default if empty
    if (!stringValue) {
      return defaultValue;
    }
    
    // Split by comma and trim each value
    return stringValue.split(',').map(item => item.trim());
  } catch (error) {
    handleError(error, { context: 'getEnvArray', key });
    return defaultValue;
  }
}

/**
 * Get a JSON environment variable
 * @param key Environment variable key
 * @param defaultValue Default value if environment variable is not set or not valid JSON
 * @returns Environment variable value as parsed JSON or default
 */
export function getEnvJson<T>(key: string, defaultValue: T): T {
  try {
    const stringValue = getEnvString(key, '');
    
    // Return default if empty
    if (!stringValue) {
      return defaultValue;
    }
    
    // Parse JSON
    return JSON.parse(stringValue) as T;
  } catch (error) {
    handleError(error, { context: 'getEnvJson', key });
    return defaultValue;
  }
}

/**
 * Check if running in development mode
 * @returns Whether running in development mode
 */
export function isDevelopment(): boolean {
  return getEnvString('NODE_ENV', 'development') === 'development';
}

/**
 * Check if running in production mode
 * @returns Whether running in production mode
 */
export function isProduction(): boolean {
  return getEnvString('NODE_ENV', 'development') === 'production';
}

/**
 * Check if running in test mode
 * @returns Whether running in test mode
 */
export function isTest(): boolean {
  return getEnvString('NODE_ENV', 'development') === 'test';
}

/**
 * API timeout in milliseconds
 */
export const API_TIMEOUT: number = getEnvNumber('VITE_API_TIMEOUT', 30000);

/**
 * API base URL
 */
export const API_BASE_URL: string = getEnvString('VITE_API_BASE_URL', 'http://localhost:3000/api');

/**
 * API version
 */
export const API_VERSION: string = getEnvString('VITE_API_VERSION', 'v1');

export default {
  loadEnvVariables,
  getEnvVariable,
  getEnvString,
  getEnvNumber,
  getEnvBoolean,
  getEnvArray,
  getEnvJson,
  requireEnvVariable,
  isDevelopment,
  isProduction,
  isTest,
  API_TIMEOUT,
  API_BASE_URL,
  API_VERSION
};