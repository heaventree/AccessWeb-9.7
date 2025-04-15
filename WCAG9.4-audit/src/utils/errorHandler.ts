/**
 * Error Handler Utility
 * 
 * Provides comprehensive error handling, logging, and sanitization for the application.
 * Implements best practices for error handling, including proper error categorization,
 * sanitization of sensitive data, and consistent error formatting.
 */

import { IS_DEVELOPMENT_MODE } from './environment';

// Error types for consistent categorization
export enum ErrorType {
  // Authentication and authorization errors
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  
  // Input validation errors
  VALIDATION = 'validation',
  
  // API and network errors
  API = 'api',
  NETWORK = 'network',
  
  // Data access and storage errors
  DATABASE = 'database',
  STORAGE = 'storage',
  
  // Application logic errors
  BUSINESS_LOGIC = 'business_logic',
  
  // System and infrastructure errors
  SYSTEM = 'system',
  
  // Unknown or unexpected errors
  UNKNOWN = 'unknown'
}

// Standard error response format
export interface ErrorResponse {
  type: ErrorType;
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

/**
 * Creates a standardized error object
 */
export const createError = (
  type: ErrorType,
  code: string,
  message: string,
  details?: Record<string, any>
): ErrorResponse => {
  return {
    type,
    code,
    message,
    details: sanitizeErrorDetails(details),
    stack: IS_DEVELOPMENT_MODE ? new Error().stack : undefined
  };
};

/**
 * Handles API errors and returns a standardized error response
 */
export const handleApiError = (error: any): ErrorResponse => {
  // Already formatted error
  if (error && error.type && error.code && error.message) {
    return error as ErrorResponse;
  }
  
  // Network errors (e.g. CORS, offline)
  if (error instanceof TypeError && error.message.includes('Network request failed')) {
    return createError(
      ErrorType.NETWORK,
      'network_error',
      'Network request failed. Please check your connection.',
      { originalError: error.message }
    );
  }
  
  // Timeout errors
  if (error.name === 'AbortError' || (error.code === 'request_timeout')) {
    return createError(
      ErrorType.NETWORK,
      'request_timeout',
      'The request timed out. Please try again.',
      { originalError: error.message }
    );
  }
  
  // Authentication errors
  if (error.message?.includes('unauthorized') || error.status === 401 || error.code === 401) {
    return createError(
      ErrorType.AUTHENTICATION,
      'unauthorized',
      'Authentication required. Please log in.',
      { originalError: error.message }
    );
  }
  
  // Authorization errors
  if (error.message?.includes('forbidden') || error.status === 403 || error.code === 403) {
    return createError(
      ErrorType.AUTHORIZATION,
      'forbidden',
      'You do not have permission to perform this action.',
      { originalError: error.message }
    );
  }
  
  // Validation errors
  if (error.message?.includes('validation') || error.status === 422 || error.code === 422) {
    return createError(
      ErrorType.VALIDATION,
      'validation_error',
      'The request data is invalid.',
      { originalError: error.message, fields: error.details?.fields }
    );
  }
  
  // Not found errors
  if (error.message?.includes('not found') || error.status === 404 || error.code === 404) {
    return createError(
      ErrorType.API,
      'not_found',
      'The requested resource was not found.',
      { originalError: error.message }
    );
  }
  
  // Server errors
  if (error.status >= 500 || error.code >= 500) {
    return createError(
      ErrorType.SYSTEM,
      'server_error',
      'An error occurred on the server. Please try again later.',
      { originalError: error.message }
    );
  }
  
  // Default case - unknown error
  return createError(
    ErrorType.UNKNOWN,
    'unknown_error',
    'An unexpected error occurred.',
    { originalError: error.message || String(error) }
  );
};

/**
 * Logs errors with appropriate level and details
 */
export const logError = (error: ErrorResponse | any): void => {
  const formattedError = error.type ? error : handleApiError(error);
  
  // Determine log level based on error type
  switch (formattedError.type) {
    case ErrorType.NETWORK:
      if (navigator.onLine) {
        console.warn(`Network Error: ${formattedError.message}`, formattedError);
      } else {
        // Offline errors are less severe
        console.info(`Offline: ${formattedError.message}`);
      }
      break;
      
    case ErrorType.VALIDATION:
      console.warn(`Validation Error: ${formattedError.message}`, formattedError);
      break;
      
    case ErrorType.AUTHENTICATION:
    case ErrorType.AUTHORIZATION:
      console.warn(`Auth Error: ${formattedError.message}`, formattedError);
      break;
      
    case ErrorType.SYSTEM:
    case ErrorType.DATABASE:
      console.error(`Critical Error: ${formattedError.message}`, formattedError);
      // In production, you might want to report these to a monitoring service
      break;
      
    default:
      console.error(`Error: ${formattedError.message}`, formattedError);
  }
  
  // In development mode, also log the stack trace
  if (IS_DEVELOPMENT_MODE && formattedError.stack) {
    console.debug('Error Stack:', formattedError.stack);
  }
};

/**
 * Sanitizes error details to remove sensitive information
 */
export const sanitizeErrorDetails = (details?: Record<string, any>): Record<string, any> | undefined => {
  if (!details) return undefined;
  
  const sanitized: Record<string, any> = {};
  const sensitiveKeys = ['password', 'token', 'secret', 'key', 'auth', 'authorization', 'credential'];
  
  // Clone details and remove sensitive information
  Object.entries(details).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    
    // Check if the key contains any sensitive keywords
    if (sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeErrorDetails(value as Record<string, any>);
    } else {
      sanitized[key] = value;
    }
  });
  
  return sanitized;
};

/**
 * Gets a user-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: ErrorResponse | any): string => {
  const formattedError = error.type ? error : handleApiError(error);
  
  // Return a user-friendly message based on error type
  switch (formattedError.type) {
    case ErrorType.NETWORK:
      return navigator.onLine
        ? 'Unable to connect to the server. Please check your connection and try again.'
        : 'You are currently offline. Please check your internet connection.';
      
    case ErrorType.AUTHENTICATION:
      return 'Your session has expired. Please log in again.';
      
    case ErrorType.AUTHORIZATION:
      return 'You do not have permission to perform this action.';
      
    case ErrorType.VALIDATION:
      return 'Please check your input and try again.';
      
    case ErrorType.SYSTEM:
      return 'Something went wrong on our end. We\'re working to fix it.';
      
    case ErrorType.DATABASE:
    case ErrorType.STORAGE:
      return 'Unable to access data at this time. Please try again later.';
      
    case ErrorType.BUSINESS_LOGIC:
      return formattedError.message || 'Unable to complete the requested action.';
      
    default:
      return 'An unexpected error occurred. Please try again later.';
  }
};

/**
 * Determines if an error is retryable
 */
export const isRetryableError = (error: ErrorResponse | any): boolean => {
  const formattedError = error.type ? error : handleApiError(error);
  
  // Determine if the error is retryable based on its type
  switch (formattedError.type) {
    case ErrorType.NETWORK:
      return true; // Network errors are generally retryable
      
    case ErrorType.SYSTEM:
      return true; // Server errors are generally retryable
      
    case ErrorType.DATABASE:
    case ErrorType.STORAGE:
      return true; // Data access errors are generally retryable
      
    case ErrorType.AUTHENTICATION:
    case ErrorType.AUTHORIZATION:
    case ErrorType.VALIDATION:
    case ErrorType.BUSINESS_LOGIC:
      return false; // These errors require user action
      
    default:
      return false; // Unknown errors are not retryable by default
  }
};