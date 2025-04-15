/**
 * Environment Utilities
 * 
 * Securely access and validate environment variables with
 * type safety and default fallbacks.
 */

// Environment detection
export const IS_PRODUCTION = import.meta.env.PROD;
export const IS_DEVELOPMENT_MODE = import.meta.env.DEV;
export const IS_TEST_MODE = import.meta.env.MODE === 'test';
export const APP_MODE = import.meta.env.MODE || 'development';

// Default constants
export const API_BASE_URL = getEnvString('VITE_API_BASE_URL', IS_DEVELOPMENT_MODE 
  ? 'http://localhost:3000/api'
  : 'https://api.accessibility.example.com');

export const API_VERSION = getEnvString('VITE_API_VERSION', 'v1');
export const API_TIMEOUT = getEnvNumber('VITE_API_TIMEOUT', 30000); // 30 seconds

export const AUTH_TOKEN_EXPIRY = getEnvNumber('VITE_AUTH_TOKEN_EXPIRY', 60 * 60); // 1 hour
export const REFRESH_TOKEN_EXPIRY = getEnvNumber('VITE_REFRESH_TOKEN_EXPIRY', 7 * 24 * 60 * 60); // 7 days

export const CSP_REPORT_URI = getEnvString('VITE_CSP_REPORT_URI', '');
export const MAX_UPLOAD_SIZE = getEnvNumber('VITE_MAX_UPLOAD_SIZE', 10 * 1024 * 1024); // 10MB

/**
 * Get a string value from environment variables
 * @param key Variable name
 * @param defaultValue Fallback value
 * @returns Environment variable value or default
 */
export function getEnvString(key: string, defaultValue: string = ''): string {
  const value = import.meta.env[key];
  return value !== undefined ? String(value) : defaultValue;
}

/**
 * Get a number value from environment variables
 * @param key Variable name
 * @param defaultValue Fallback value
 * @returns Environment variable value or default
 */
export function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = import.meta.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Get a boolean value from environment variables
 * @param key Variable name
 * @param defaultValue Fallback value
 * @returns Environment variable value or default
 */
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Get a JSON value from environment variables
 * @param key Variable name
 * @param defaultValue Fallback value
 * @returns Parsed environment variable value or default
 */
export function getEnvJson<T>(key: string, defaultValue: T): T {
  const value = import.meta.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`Error parsing JSON from env var ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Require an environment variable, throw error if missing
 * @param key Variable name
 * @param errorMessage Optional custom error message
 * @returns Environment variable value
 * @throws Error if variable is missing
 */
export function requireEnvVariable(key: string, errorMessage?: string): string {
  const value = import.meta.env[key];
  
  if (value === undefined) {
    throw new Error(
      errorMessage || 
      `Required environment variable ${key} is missing. Please check your .env file.`
    );
  }
  
  return String(value);
}

/**
 * Check if an environment variable exists
 * @param key Variable name
 * @returns True if variable exists
 */
export function hasEnvVariable(key: string): boolean {
  return import.meta.env[key] !== undefined;
}

/**
 * Get the current deployment environment
 * @returns Environment name
 */
export function getEnvironment(): 'development' | 'staging' | 'production' | 'test' {
  const env = getEnvString('NODE_ENV', 'development');
  
  switch (env) {
    case 'production':
      return 'production';
    case 'staging':
      return 'staging';
    case 'test':
      return 'test';
    case 'development':
    default:
      return 'development';
  }
}

export default {
  IS_PRODUCTION,
  IS_DEVELOPMENT_MODE,
  IS_TEST_MODE,
  APP_MODE,
  API_BASE_URL,
  API_VERSION,
  API_TIMEOUT,
  AUTH_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
  getEnvString,
  getEnvNumber,
  getEnvBoolean,
  getEnvJson,
  requireEnvVariable,
  hasEnvVariable,
  getEnvironment
};