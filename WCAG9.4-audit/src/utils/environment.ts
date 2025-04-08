/**
 * Environment utilities for detecting the current environment
 * and providing environment-specific functionality
 */

// Fixed constant for development mode
export const IS_DEVELOPMENT_MODE: boolean = true;

// Safe environment variable getter with fallbacks
export const getEnvVariable = (name: string, defaultValue: string = ''): string => {
  try {
    // For Vite
    if (import.meta.env && import.meta.env[name]) {
      return import.meta.env[name] as string;
    }
    
    // Fallback to default
    return defaultValue;
  } catch (error) {
    return defaultValue;
  }
};