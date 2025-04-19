/**
 * Error Handler Utilities
 * 
 * Provides centralized error handling, logging, and recovery mechanisms
 * for consistent and accessible error management.
 */

import { getEnvBoolean, getEnvString } from './environment';

// Define standard error types for consistent handling
export enum ErrorSeverity {
  CRITICAL = 'critical',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

// Define specific error types for error classification
export enum ErrorType {
  INTERNAL = 'internal',
  NETWORK = 'network',
  API = 'api',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  NOT_FOUND = 'not_found',
  RATE_LIMIT = 'rate_limit',
  TIMEOUT = 'timeout',
  SECURITY = 'security',
  UNKNOWN = 'unknown'
}

// Error context data for additional debug information
export interface ErrorContext {
  context?: string;
  data?: Record<string, any>;
  source?: string;
  errorId?: string;
  severity?: ErrorSeverity;
  userId?: string;
  timestamp?: number;
}

// In-memory log of recent errors
const errorLog: Array<{
  error: Error;
  context: ErrorContext;
  timestamp: number;
}> = [];

// Maximum number of errors to keep in memory
const MAX_ERROR_LOG_SIZE = 50;

/**
 * Log error with context
 * @param error Error to log
 * @param context Additional context for the error
 */
export function logError(error: unknown, context: ErrorContext = {}): void {
  try {
    // Ensure error is an Error object
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    // Add timestamp if not provided
    if (!context.timestamp) {
      context.timestamp = Date.now();
    }
    
    // Add severity if not provided
    if (!context.severity) {
      context.severity = ErrorSeverity.ERROR;
    }
    
    // Add error ID if not provided
    if (!context.errorId) {
      context.errorId = generateErrorId();
    }
    
    // Log to console in development
    if (getEnvBoolean('VITE_DEBUG_MODE', true)) {
      console.error(
        `[${context.severity}] ${context.context || 'Application Error'}:`,
        errorObj,
        context
      );
    }
    
    // Add to in-memory log
    errorLog.unshift({
      error: errorObj,
      context,
      timestamp: context.timestamp
    });
    
    // Limit log size
    if (errorLog.length > MAX_ERROR_LOG_SIZE) {
      errorLog.pop();
    }
    
    // Send to error monitoring service in production
    if (getEnvBoolean('VITE_ENABLE_ERROR_REPORTING', false)) {
      sendErrorToMonitoring(errorObj, context);
    }
    
    // Store in session for debugging
    storeErrorInSession(errorObj, context);
  } catch (loggingError) {
    // Fallback console error if our error handler fails
    console.error('Error in error handler:', loggingError);
    console.error('Original error:', error);
  }
}

/**
 * Get recent errors
 * @param limit Maximum number of errors to return
 * @returns Recent errors
 */
export function getRecentErrors(limit: number = 10): Array<{
  error: Error;
  context: ErrorContext;
  timestamp: number;
}> {
  return errorLog.slice(0, limit);
}

/**
 * Clear error log
 */
export function clearErrorLog(): void {
  errorLog.length = 0;
}

/**
 * Generate a unique error ID
 * @returns Unique error ID
 */
function generateErrorId(): string {
  return Math.random().toString(36).substring(2, 12);
}

/**
 * Send error to monitoring service
 * @param error Error to send
 * @param context Error context
 */
function sendErrorToMonitoring(error: Error, context: ErrorContext): void {
  // Get monitoring service URL from environment
  const monitoringUrl = getEnvString('VITE_ERROR_MONITORING_URL', '');
  
  // Skip if no monitoring URL
  if (!monitoringUrl) {
    return;
  }
  
  try {
    // Send error to monitoring service
    fetch(monitoringUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: error.name,
        message: error.message,
        stack: error.stack,
        context: context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: context.timestamp || Date.now()
      })
    }).catch(e => {
      console.error('Failed to send error to monitoring service:', e);
    });
  } catch (e) {
    console.error('Failed to send error to monitoring service:', e);
  }
}

/**
 * Store error in session for debugging
 * @param error Error to store
 * @param context Error context
 */
function storeErrorInSession(error: Error, context: ErrorContext): void {
  try {
    // Get existing errors from session
    const storedErrors = sessionStorage.getItem('app_errors');
    const errors = storedErrors ? JSON.parse(storedErrors) : [];
    
    // Add new error
    errors.unshift({
      name: error.name,
      message: error.message,
      context: context,
      timestamp: context.timestamp || Date.now()
    });
    
    // Limit number of stored errors
    const maxStoredErrors = 20;
    if (errors.length > maxStoredErrors) {
      errors.length = maxStoredErrors;
    }
    
    // Save back to session
    sessionStorage.setItem('app_errors', JSON.stringify(errors));
  } catch (e) {
    console.error('Failed to store error in session:', e);
  }
}

/**
 * Format error message for display
 * @param error Error to format
 * @param includeStack Whether to include stack trace
 * @returns Formatted error message
 */
export function formatErrorMessage(error: Error | unknown, includeStack: boolean = false): string {
  if (!(error instanceof Error)) {
    return String(error);
  }
  
  const message = `${error.name}: ${error.message}`;
  
  if (includeStack && error.stack) {
    return `${message}\n\n${error.stack}`;
  }
  
  return message;
}

/**
 * Check if an error is of a specific type
 * @param error Error to check
 * @param errorType Error type to check for
 * @returns Whether error is of the specified type
 */
export function isErrorType(error: unknown, errorType: any): boolean {
  return error instanceof errorType;
}

/**
 * Create a custom error with type and additional data
 * @param message Error message
 * @param type Error type
 * @param data Additional error data
 * @returns Custom error
 */
export function createError(message: string, type: ErrorType, data: Record<string, any> = {}): Error {
  const error = new Error(message);
  (error as any).type = type;
  (error as any).data = data;
  (error as any).timestamp = Date.now();
  
  return error;
}

/**
 * Handle API errors consistently
 * @param error Original error 
 * @param context Error context
 * @returns Properly formatted error
 */
export function handleApiError(error: unknown, context: ErrorContext = {}): Error {
  // Default to API error type
  let errorType = ErrorType.API;
  let errorMessage = "An unexpected API error occurred";
  
  // Extract response details if available
  if (error instanceof Response || (error && typeof error === 'object' && 'status' in error)) {
    const response = error as Response;
    
    // Map HTTP status codes to error types
    switch (response.status) {
      case 400:
        errorType = ErrorType.VALIDATION;
        errorMessage = "The request was invalid";
        break;
      case 401:
      case 403:
        errorType = ErrorType.AUTHENTICATION;
        errorMessage = "You don't have permission to access this resource";
        break;
      case 404:
        errorType = ErrorType.NOT_FOUND;
        errorMessage = "The requested resource was not found";
        break;
      case 429:
        errorType = ErrorType.RATE_LIMIT;
        errorMessage = "Too many requests, please try again later";
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorType = ErrorType.API;
        errorMessage = "The server encountered an error";
        break;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
    
    // Check for network errors
    if (
      error.name === 'NetworkError' || 
      error.message.includes('network') ||
      error.message.includes('connection')
    ) {
      errorType = ErrorType.NETWORK;
      errorMessage = "Network error occurred. Please check your connection.";
    }
  }
  
  // Create standardized error
  const standardError = createError(errorMessage, errorType, { 
    originalError: error,
    ...context
  });
  
  // Log the error
  logError(standardError, {
    context: context.context || 'API',
    severity: ErrorSeverity.ERROR,
    ...context
  });
  
  return standardError;
}

/**
 * Get user-friendly error message
 * @param error Error to get message for
 * @returns User-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  // Default generic message
  let friendlyMessage = "Something went wrong. Please try again later.";
  
  if (error instanceof Error) {
    // Handle specific error types
    switch (error.name) {
      case 'NetworkError':
        friendlyMessage = "We're having trouble connecting to the server. Please check your internet connection and try again.";
        break;
      
      case 'ValidationError':
        friendlyMessage = "There was a problem with the information you provided. Please check your entries and try again.";
        break;
      
      case 'AuthenticationError':
        friendlyMessage = "Your session may have expired. Please sign in again to continue.";
        break;
      
      case 'AuthorizationError':
        friendlyMessage = "You don't have permission to perform this action.";
        break;
      
      case 'NotFoundError':
        friendlyMessage = "The requested resource was not found.";
        break;
      
      case 'TimeoutError':
        friendlyMessage = "The request timed out. Please try again.";
        break;
      
      case 'RateLimitError':
        friendlyMessage = "You've made too many requests. Please wait a moment and try again.";
        break;
      
      default:
        // Use actual message if available and in development
        if (getEnvBoolean('VITE_DEBUG_MODE', false) && error.message) {
          friendlyMessage = error.message;
        }
    }
  }
  
  return friendlyMessage;
}

/**
 * Create error message properties for accessibility
 * @param message Error message
 * @returns Accessible properties for error display
 */
export function getAccessibleErrorProps(message: string): {
  role: string; 
  'aria-live': string;
  'aria-atomic'?: string;
} {
  return {
    role: 'alert',
    'aria-live': 'assertive',
    'aria-atomic': 'true'
  };
}

export default {
  logError,
  getRecentErrors,
  clearErrorLog,
  formatErrorMessage,
  isErrorType,
  getUserFriendlyErrorMessage,
  getAccessibleErrorProps,
  ErrorSeverity,
  ErrorType,
  createError,
  handleApiError
};