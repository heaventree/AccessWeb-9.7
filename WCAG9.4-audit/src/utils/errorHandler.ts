/**
 * Error Handling Utility
 * 
 * Provides utilities for creating, handling, and processing application errors
 * with standardized error types, codes, and messages to improve error reporting,
 * debugging, and user experience.
 */

// Standard error types for categorization
export enum ErrorType {
  // Data validation errors
  VALIDATION = 'validation_error',
  
  // Authentication/authorization errors
  AUTH = 'authentication_error',
  
  // API-related errors (requests, responses)
  API = 'api_error',
  
  // Network-related errors
  NETWORK = 'network_error',
  
  // Security-related errors (XSS, CSRF, etc.)
  SECURITY = 'security_error',
  
  // Database-related errors
  DATABASE = 'database_error',
  
  // General application errors
  APPLICATION = 'application_error',
  
  // Unknown/unexpected errors
  UNKNOWN = 'unknown_error'
}

// Application error interface
export interface AppError extends Error {
  type: ErrorType;
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  originalError?: any;
}

/**
 * Create a standardized application error
 * 
 * @param type Error type for categorization
 * @param code Specific error code
 * @param message User-friendly error message
 * @param details Additional error details
 * @param originalError Original error if wrapping another error
 * @returns Standardized AppError object
 */
export function createError(
  type: ErrorType,
  code: string,
  message: string,
  details?: Record<string, any>,
  originalError?: any
): AppError {
  const error = new Error(message) as AppError;
  error.type = type;
  error.code = code;
  error.message = message;
  error.details = details;
  error.timestamp = new Date().toISOString();
  error.originalError = originalError;
  
  // Capture stack trace
  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, createError);
  }
  
  return error;
}

/**
 * Process an API error response and convert to standardized AppError
 * 
 * @param error Error from API request
 * @returns Standardized AppError
 */
export function handleAPIError(error: any): AppError {
  // Check if it's an Axios error with a response
  if (error.response) {
    const { status, data } = error.response;
    
    // Handle based on status code
    if (status === 400) {
      return createError(
        ErrorType.VALIDATION,
        'invalid_request',
        data.message || 'Invalid request parameters',
        data.details || {},
        error
      );
    }
    
    if (status === 401) {
      return createError(
        ErrorType.AUTH,
        'unauthorized',
        data.message || 'Authentication required',
        data.details || {},
        error
      );
    }
    
    if (status === 403) {
      return createError(
        ErrorType.AUTH,
        'forbidden',
        data.message || 'You do not have permission to access this resource',
        data.details || {},
        error
      );
    }
    
    if (status === 404) {
      return createError(
        ErrorType.API,
        'not_found',
        data.message || 'The requested resource was not found',
        data.details || {},
        error
      );
    }
    
    if (status === 429) {
      return createError(
        ErrorType.API,
        'rate_limited',
        data.message || 'Too many requests, please try again later',
        { retryAfter: error.response.headers['retry-after'] },
        error
      );
    }
    
    if (status >= 500) {
      return createError(
        ErrorType.API,
        'server_error',
        data.message || 'An unexpected server error occurred',
        data.details || {},
        error
      );
    }
    
    // Generic error for other status codes
    return createError(
      ErrorType.API,
      `http_${status}`,
      data.message || `Request failed with status code ${status}`,
      data.details || {},
      error
    );
  }
  
  // Handle network errors (no response from server)
  if (error.request) {
    return createError(
      ErrorType.NETWORK,
      'network_error',
      'Unable to connect to the server. Please check your internet connection.',
      { request: error.request },
      error
    );
  }
  
  // For everything else (setup errors, etc)
  return createError(
    ErrorType.UNKNOWN,
    'request_failed',
    error.message || 'An unexpected error occurred',
    {},
    error
  );
}

/**
 * Format error details for logging
 * 
 * @param error Error to format
 * @returns Formatted error object for logging
 */
export function formatErrorForLogging(error: AppError): Record<string, any> {
  return {
    type: error.type,
    code: error.code,
    message: error.message,
    details: error.details || {},
    timestamp: error.timestamp,
    stack: error.stack,
    originalError: error.originalError ? {
      message: error.originalError.message,
      stack: error.originalError.stack
    } : undefined
  };
}

/**
 * Format error for user display
 * 
 * @param error Error to format
 * @returns User-friendly error object
 */
export function formatErrorForUser(error: AppError): Record<string, any> {
  // Create a user-friendly error without sensitive details
  return {
    code: error.code,
    message: error.message,
    ...(error.details?.userMessage ? { userMessage: error.details.userMessage } : {}),
    timestamp: error.timestamp
  };
}

/**
 * Get appropriate HTTP status code for an error
 * 
 * @param error Application error
 * @returns HTTP status code
 */
export function getHttpStatusForError(error: AppError): number {
  switch (error.type) {
    case ErrorType.VALIDATION:
      return 400;
    case ErrorType.AUTH:
      return error.code === 'unauthorized' ? 401 : 403;
    case ErrorType.API:
      if (error.code === 'not_found') return 404;
      if (error.code === 'rate_limited') return 429;
      return 500;
    case ErrorType.SECURITY:
      return 403;
    case ErrorType.DATABASE:
      return 500;
    case ErrorType.NETWORK:
      return 503;
    case ErrorType.APPLICATION:
    case ErrorType.UNKNOWN:
    default:
      return 500;
  }
}

/**
 * Log error with appropriate level and formatting
 * 
 * @param error Error to log
 * @param level Log level (default: 'error')
 */
export function logError(error: AppError, level: 'info' | 'warn' | 'error' = 'error'): void {
  const formattedError = formatErrorForLogging(error);
  
  switch (level) {
    case 'info':
      console.info('[ERROR_INFO]', JSON.stringify(formattedError));
      break;
    case 'warn':
      console.warn('[ERROR_WARNING]', JSON.stringify(formattedError));
      break;
    case 'error':
    default:
      console.error('[ERROR]', JSON.stringify(formattedError));
  }
}

// Export all functions for use throughout the application
export default {
  ErrorType,
  createError,
  handleAPIError,
  formatErrorForLogging,
  formatErrorForUser,
  getHttpStatusForError,
  logError
};