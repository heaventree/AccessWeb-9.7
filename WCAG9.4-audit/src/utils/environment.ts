/**
 * Environment configuration utilities
 * Provides secure access to environment variables with validation
 */

// Whether the application is running in development mode
export const IS_DEVELOPMENT_MODE = process.env.NODE_ENV !== 'production';

/**
 * Require an environment variable with validation
 * Throws an error in production if the variable is not set
 * Returns a default value in development
 */
export const requireEnvVariable = (name: string, devDefault?: string): string => {
  const value = process.env[name];
  
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Environment variable ${name} must be set in production`);
  }
  
  return value || devDefault || `dev-only-${name.toLowerCase().replace(/_/g, '-')}-for-testing`;
};

/**
 * Get an optional environment variable
 * Returns the default value if not set
 */
export const getEnvVariable = (name: string, defaultValue: string): string => {
  return process.env[name] || defaultValue;
};

/**
 * Get a boolean environment variable
 * Converts string values to booleans
 */
export const getBoolEnvVariable = (name: string, defaultValue: boolean): boolean => {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

/**
 * Get a numeric environment variable
 * Converts string values to numbers
 */
export const getNumericEnvVariable = (name: string, defaultValue: number): number => {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  const numValue = Number(value);
  return isNaN(numValue) ? defaultValue : numValue;
};

/**
 * Get the base URL of the application
 * In production, this is set by environment variable
 * In development, it defaults to localhost
 */
export const getBaseUrl = (): string => {
  return process.env.BASE_URL || (IS_DEVELOPMENT_MODE
    ? 'http://localhost:5000'
    : 'https://accessibilitychecker.app'
  );
};

/**
 * Get the API URL
 * In production, this comes from environment variables
 * In development, it defaults to localhost
 */
export const getApiUrl = (): string => {
  return process.env.API_URL || (IS_DEVELOPMENT_MODE
    ? 'http://localhost:5000/api'
    : 'https://api.accessibilitychecker.app/api/v1'
  );
};