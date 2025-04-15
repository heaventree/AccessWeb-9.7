/**
 * Error Handling Utility
 * 
 * Provides centralized error handling, custom error types,
 * and consistent error formatting throughout the application.
 */

// Error type enum to categorize errors
export enum ErrorType {
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'authentication_error',
  AUTHORIZATION = 'authorization_error',
  API = 'api_error',
  NETWORK = 'network_error',
  RATE_LIMIT = 'rate_limit_error',
  TIMEOUT = 'timeout_error',
  UNKNOWN = 'unknown_error',
  SECURITY = 'security_error',
  ACCESSIBILITY = 'accessibility_error'
}

// Custom error class with enhanced properties
export class AppError extends Error {
  type: ErrorType;
  code: string;
  details?: Record<string, any>;
  originalError?: unknown;
  timestamp: Date;
  
  constructor(
    type: ErrorType,
    code: string,
    message: string,
    details?: Record<string, any>,
    originalError?: unknown
  ) {
    super(message);
    
    // Standard Error properties
    this.name = 'AppError';
    
    // Enhanced properties
    this.type = type;
    this.code = code;
    this.details = details;
    this.originalError = originalError;
    this.timestamp = new Date();
    
    // Set prototype explicitly for instanceof to work
    Object.setPrototypeOf(this, AppError.prototype);
  }
  
  // Convert to plain object for logging/serializing
  toJSON() {
    return {
      name: this.name,
      type: this.type,
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }
  
  // Get user-friendly error message
  getUserMessage(): string {
    // Default user messages by error type
    const defaultMessages: Record<ErrorType, string> = {
      [ErrorType.VALIDATION]: 'There was a problem with your input. Please check the form and try again.',
      [ErrorType.AUTHENTICATION]: 'Authentication failed. Please sign in again.',
      [ErrorType.AUTHORIZATION]: 'You do not have permission to perform this action.',
      [ErrorType.API]: 'The server encountered an error. Please try again later.',
      [ErrorType.NETWORK]: 'Network connection issue. Please check your internet connection.',
      [ErrorType.RATE_LIMIT]: 'Too many requests. Please slow down and try again later.',
      [ErrorType.TIMEOUT]: 'The request timed out. Please try again.',
      [ErrorType.UNKNOWN]: 'An unexpected error occurred. Please try again later.',
      [ErrorType.SECURITY]: 'A security issue was detected. Please try again or contact support.',
      [ErrorType.ACCESSIBILITY]: 'An accessibility issue was detected in the content.'
    };
    
    // Use custom message if available, otherwise use default
    return this.message || defaultMessages[this.type];
  }
}

/**
 * Check if an error is an AppError
 * @param error Error to check
 * @returns True if error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Create a new AppError
 * @param type Error type
 * @param code Error code
 * @param message Error message
 * @param details Additional error details
 * @param originalError Original error object
 * @returns AppError instance
 */
export function createError(
  type: ErrorType,
  code: string,
  message: string,
  details?: Record<string, any>,
  originalError?: unknown
): AppError {
  return new AppError(type, code, message, details, originalError);
}

/**
 * Log an error with standardized format
 * @param error Error to log
 * @param context Additional context information
 */
export function logError(error: unknown, context?: Record<string, any>): void {
  // Format the error for logging
  const logData = {
    timestamp: new Date().toISOString(),
    context,
    error: isAppError(error) 
      ? error.toJSON()
      : {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
  };
  
  // Log to console in development, in production would send to logging service
  console.error('Error:', logData);
}

/**
 * Generic error handler function for async operations
 * @param fn Async function to execute
 * @param errorHandler Custom error handler
 * @returns Function with built-in error handling
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler?: (error: unknown) => Promise<R> | R
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Log the error
      logError(error, { args });
      
      // If custom error handler provided, use it
      if (errorHandler) {
        return errorHandler(error);
      }
      
      // Re-throw the error
      throw error;
    }
  };
}

/**
 * Handle API errors and transform them into AppErrors
 * @param error Error to handle
 * @param fallbackMessage Fallback error message
 * @throws AppError
 */
export function handleApiError(error: unknown, fallbackMessage: string = 'API request failed'): never {
  if (isAppError(error)) {
    throw error;
  }
  
  if (error instanceof Error) {
    throw createError(
      ErrorType.API,
      'api_error',
      error.message || fallbackMessage,
      {},
      error
    );
  }
  
  throw createError(
    ErrorType.UNKNOWN,
    'unknown_error',
    fallbackMessage,
    {},
    error
  );
}

export default {
  ErrorType,
  AppError,
  isAppError,
  createError,
  logError,
  withErrorHandling,
  handleApiError
};