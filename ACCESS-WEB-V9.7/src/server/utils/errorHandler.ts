import { Request, Response } from 'express';

/**
 * Error codes for standardized error handling
 */
export enum ErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'invalid_credentials',
  UNAUTHORIZED = 'unauthorized',
  TOKEN_EXPIRED = 'token_expired',
  ACCOUNT_LOCKED = 'account_locked',
  
  // Authorization errors
  FORBIDDEN = 'forbidden',
  INSUFFICIENT_PERMISSIONS = 'insufficient_permissions',
  
  // Resource errors
  NOT_FOUND = 'not_found',
  ALREADY_EXISTS = 'already_exists',
  VALIDATION_ERROR = 'validation_error',
  
  // System errors
  INTERNAL_ERROR = 'internal_error',
  DATABASE_ERROR = 'database_error',
  EXTERNAL_SERVICE_ERROR = 'external_service_error',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  
  // Payment errors
  PAYMENT_REQUIRED = 'payment_required',
  PAYMENT_FAILED = 'payment_failed',
  SUBSCRIPTION_INACTIVE = 'subscription_inactive',
  
  // Generic errors
  BAD_REQUEST = 'bad_request',
  CONFLICT = 'conflict',
  UNPROCESSABLE_ENTITY = 'unprocessable_entity'
}

/**
 * Interface for structured API errors
 */
interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  path?: string;
}

/**
 * Standardized error handler for API responses
 * 
 * @param err Error object
 * @param req Express request
 * @param res Express response
 * @param code Error code
 * @param statusCode HTTP status code (defaults to 500)
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  code: string = ErrorCode.INTERNAL_ERROR,
  statusCode: number = 500
): void {
  // Log error
  console.error(`[${code}] Error:`, err);
  
  // Determine appropriate status code
  let responseStatus = statusCode;
  
  // Adjust status code based on error code if not explicitly provided
  if (statusCode === 500) {
    switch (code) {
      case ErrorCode.INVALID_CREDENTIALS:
      case ErrorCode.UNAUTHORIZED:
      case ErrorCode.TOKEN_EXPIRED:
      case ErrorCode.ACCOUNT_LOCKED:
        responseStatus = 401;
        break;
      case ErrorCode.FORBIDDEN:
      case ErrorCode.INSUFFICIENT_PERMISSIONS:
        responseStatus = 403;
        break;
      case ErrorCode.NOT_FOUND:
        responseStatus = 404;
        break;
      case ErrorCode.ALREADY_EXISTS:
      case ErrorCode.CONFLICT:
        responseStatus = 409;
        break;
      case ErrorCode.VALIDATION_ERROR:
      case ErrorCode.BAD_REQUEST:
        responseStatus = 400;
        break;
      case ErrorCode.PAYMENT_REQUIRED:
        responseStatus = 402;
        break;
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        responseStatus = 429;
        break;
      case ErrorCode.UNPROCESSABLE_ENTITY:
        responseStatus = 422;
        break;
      default:
        responseStatus = 500;
    }
  }
  
  // Extract error message
  let message = 'An unexpected error occurred';
  
  if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === 'string') {
    message = err;
  } else if (err && typeof err === 'object' && 'message' in err) {
    message = err.message as string;
  }
  
  // Filter sensitive information from error messages
  message = filterSensitiveInfo(message);
  
  // Construct error response object
  const errorResponse: ApiError = {
    code,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  };
  
  // Add details in development environment only
  if (process.env.NODE_ENV === 'development') {
    errorResponse.details = err.stack || err;
  }
  
  // Send error response
  res.status(responseStatus).json({ error: errorResponse });
}

/**
 * Remove sensitive information from error messages
 * 
 * @param message Error message
 * @returns Sanitized error message
 */
function filterSensitiveInfo(message: string): string {
  // Remove API keys, tokens, passwords, etc.
  const patterns = [
    /sk_(?:test|live)_[0-9a-zA-Z]{24,}/g, // Stripe secret keys
    /pk_(?:test|live)_[0-9a-zA-Z]{24,}/g, // Stripe public keys
    /Bearer\s+[A-Za-z0-9\-._~+/]+=*/g,    // Bearer tokens
    /password['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi, // Password in JSON or code
    /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g // Email addresses
  ];
  
  let sanitizedMessage = message;
  
  patterns.forEach(pattern => {
    sanitizedMessage = sanitizedMessage.replace(pattern, '[REDACTED]');
  });
  
  return sanitizedMessage;
}