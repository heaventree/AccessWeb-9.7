/**
 * Error Handler
 * 
 * Provides centralized error handling with standardized error types,
 * logging, and accessibility support.
 */

// Error types for categorization
export enum ErrorType {
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'authentication_error',
  AUTHORIZATION = 'authorization_error',
  API = 'api_error',
  NETWORK = 'network_error',
  TIMEOUT = 'timeout_error',
  RATE_LIMIT = 'rate_limit_error',
  RESOURCE_NOT_FOUND = 'not_found_error',
  INTERNAL = 'internal_error',
  EXTERNAL_SERVICE = 'external_service_error',
  SECURITY = 'security_error'
}

// Custom application error class
export class AppError extends Error {
  // Error type for categorization
  type: ErrorType;
  
  // Error code for specific identification
  code: string;
  
  // Optional details for debugging
  details?: Record<string, any>;
  
  // User-friendly message for display
  userMessage?: string;
  
  // Accessibility related fields
  a11yHint?: string;
  
  // Timestamp when error occurred
  timestamp: Date;
  
  constructor(
    type: ErrorType,
    code: string,
    message: string,
    details?: Record<string, any>,
    userMessage?: string,
    a11yHint?: string
  ) {
    // Set error message
    super(message);
    
    // Set error name for better stack traces
    this.name = 'AppError';
    
    // Set error type and code
    this.type = type;
    this.code = code;
    
    // Set optional fields
    this.details = details;
    this.userMessage = userMessage || message;
    this.a11yHint = a11yHint;
    
    // Set timestamp
    this.timestamp = new Date();
    
    // Ensure prototype chain works
    Object.setPrototypeOf(this, AppError.prototype);
  }
  
  /**
   * Get a user-friendly message for display
   * @returns User-friendly message
   */
  getUserMessage(): string {
    return this.userMessage || this.message;
  }
  
  /**
   * Get accessibility hint for screen readers
   * @returns Accessibility hint or default hint based on error type
   */
  getAccessibilityHint(): string {
    if (this.a11yHint) {
      return this.a11yHint;
    }
    
    // Default accessibility hints based on error type
    switch (this.type) {
      case ErrorType.VALIDATION:
        return 'Please check your input and try again.';
      case ErrorType.AUTHENTICATION:
        return 'There was a problem with your login. Please check your credentials.';
      case ErrorType.AUTHORIZATION:
        return 'You do not have permission to perform this action.';
      case ErrorType.NETWORK:
        return 'Network connection issue. Please check your internet connection.';
      case ErrorType.TIMEOUT:
        return 'The request took too long to complete. Please try again.';
      case ErrorType.RATE_LIMIT:
        return 'Too many requests. Please wait a moment before trying again.';
      case ErrorType.RESOURCE_NOT_FOUND:
        return 'The requested resource could not be found.';
      default:
        return 'An error occurred. Please try again later.';
    }
  }
  
  /**
   * Convert error to a plain object for logging or serialization
   * @returns Error as plain object
   */
  toObject(): Record<string, any> {
    return {
      name: this.name,
      type: this.type,
      code: this.code,
      message: this.message,
      userMessage: this.userMessage,
      a11yHint: this.a11yHint,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }
  
  /**
   * Check if error is of a specific type
   * @param type Error type to check
   * @returns True if error is of specified type
   */
  isType(type: ErrorType): boolean {
    return this.type === type;
  }
}

/**
 * Create a standardized application error
 * @param type Error type
 * @param code Error code
 * @param message Error message
 * @param details Optional error details
 * @param userMessage Optional user-friendly message
 * @param a11yHint Optional accessibility hint
 * @returns AppError instance
 */
export function createError(
  type: ErrorType,
  code: string,
  message: string,
  details?: Record<string, any>,
  userMessage?: string,
  a11yHint?: string
): AppError {
  return new AppError(type, code, message, details, userMessage, a11yHint);
}

/**
 * Transform any error to an AppError
 * @param error Original error
 * @param defaultMessage Default message if error is not an instance of Error
 * @returns AppError instance
 */
export function normalizeError(error: any, defaultMessage = 'An unknown error occurred'): AppError {
  // Already an AppError, return as is
  if (error instanceof AppError) {
    return error;
  }
  
  // Error instance, transform to AppError
  if (error instanceof Error) {
    return createError(
      ErrorType.INTERNAL,
      'unknown_error',
      error.message || defaultMessage,
      { originalError: error.name, stack: error.stack }
    );
  }
  
  // Response-like object
  if (error && typeof error === 'object' && 'status' in error) {
    const status = Number(error.status);
    
    // Determine error type based on status code
    let errorType = ErrorType.API;
    
    if (status === 400) {
      errorType = ErrorType.VALIDATION;
    } else if (status === 401 || status === 403) {
      errorType = ErrorType.AUTHENTICATION;
    } else if (status === 404) {
      errorType = ErrorType.RESOURCE_NOT_FOUND;
    } else if (status === 429) {
      errorType = ErrorType.RATE_LIMIT;
    }
    
    return createError(
      errorType,
      `http_${status}`,
      error.statusText || defaultMessage,
      error
    );
  }
  
  // String error
  if (typeof error === 'string') {
    return createError(ErrorType.INTERNAL, 'string_error', error);
  }
  
  // Unknown error
  return createError(
    ErrorType.INTERNAL,
    'unknown_error',
    defaultMessage,
    { originalError: error }
  );
}

/**
 * Log an error with standard format
 * @param error Error to log
 * @param context Optional context information
 */
export function logError(error: Error | AppError | any, context?: Record<string, any>): void {
  // Normalize error
  const normalizedError = normalizeError(error);
  
  // Create log data
  const logData = {
    ...normalizedError.toObject(),
    context
  };
  
  // Log error with appropriate severity
  if (
    normalizedError.type === ErrorType.INTERNAL ||
    normalizedError.type === ErrorType.SECURITY
  ) {
    console.error('ERROR:', logData);
  } else {
    console.warn('WARNING:', logData);
  }
  
  // Report to error monitoring service if available
  // This would be replaced with actual error reporting code
  if (typeof window !== 'undefined' && window.onerror) {
    window.onerror(
      normalizedError.message,
      undefined,
      undefined,
      undefined,
      normalizedError
    );
  }
}

/**
 * Handle API errors specifically
 * @param error Original error
 * @param context Optional context information
 * @returns Normalized AppError
 */
export function handleApiError(error: any, context?: string): AppError {
  // Log the error
  logError(error, { context });
  
  // Determine if network error
  const isNetworkError = 
    error.name === 'TypeError' || 
    error.message?.includes('network') ||
    error.message?.includes('fetch');
  
  if (isNetworkError) {
    return createError(
      ErrorType.NETWORK,
      'network_failure',
      context ? `Network error while ${context}` : 'Network connection error',
      { originalError: error },
      'There was a problem connecting to the server. Please check your internet connection and try again.',
      'Network connection issue detected. Please check your connection and retry.'
    );
  }
  
  // Handle timeout errors
  if (error.name === 'AbortError' || error.message?.includes('timeout')) {
    return createError(
      ErrorType.TIMEOUT,
      'request_timeout',
      context ? `Request timed out while ${context}` : 'Request timed out',
      { originalError: error },
      'The request took too long to complete. Please try again later.',
      'Request timeout detected. Please try again when network conditions improve.'
    );
  }
  
  // Already an AppError, ensure it has context
  if (error instanceof AppError) {
    if (context && !error.details?.context) {
      error.details = { ...error.details, context };
    }
    return error;
  }
  
  // Normalize other errors
  return normalizeError(error, context ? `Error while ${context}` : undefined);
}

/**
 * Get error message for display to user
 * @param error Error object
 * @param fallback Fallback message
 * @returns User-friendly error message
 */
export function getErrorMessage(error: any, fallback = 'An unexpected error occurred'): string {
  if (!error) return fallback;
  
  if (error instanceof AppError) {
    return error.getUserMessage();
  }
  
  if (error instanceof Error) {
    return error.message || fallback;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object') {
    return error.message || error.error || error.userMessage || fallback;
  }
  
  return fallback;
}

/**
 * Get accessibility hint for screen readers
 * @param error Error object
 * @param fallback Fallback hint
 * @returns Accessibility hint
 */
export function getAccessibilityHint(error: any, fallback = 'An error occurred. Please try again.'): string {
  if (!error) return fallback;
  
  if (error instanceof AppError) {
    return error.getAccessibilityHint();
  }
  
  return fallback;
}

export default {
  ErrorType,
  AppError,
  createError,
  normalizeError,
  logError,
  handleApiError,
  getErrorMessage,
  getAccessibilityHint
};