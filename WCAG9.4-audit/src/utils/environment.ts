/**
 * Environment utilities for detecting the current environment
 * and providing environment-specific functionality
 */

// Safely detect if we're in development mode
export const isDevelopmentMode = (): boolean => {
  try {
    // For Vite
    if (import.meta.env && import.meta.env.MODE) {
      return import.meta.env.MODE === 'development';
    }
    
    // Fallback
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
      return process.env.NODE_ENV === 'development';
    }
    
    return false;
  } catch (error) {
    // If any errors occur, default to false
    return false;
  }
};

// Convenience wrapper that returns the actual boolean value (not function)
export const IS_DEVELOPMENT_MODE: boolean = isDevelopmentMode();

// Safe environment variable getter with fallbacks
export const getEnvVariable = (name: string, defaultValue: string = ''): string => {
  try {
    // For Vite
    if (import.meta.env && import.meta.env[name]) {
      return import.meta.env[name] as string;
    }
    
    // For Node.js
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
      return process.env[name] as string;
    }
    
    return defaultValue;
  } catch (error) {
    return defaultValue;
  }
};