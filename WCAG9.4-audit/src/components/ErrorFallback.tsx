/**
 * Error Fallback Component
 *
 * Provides an accessible error message for users when components fail.
 * Includes retry functionality and structured error information.
 */

import React, { ErrorInfo } from 'react';
import { AppError } from '../utils/errorHandler';

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  componentName?: string;
  onRetry?: () => void;
}

/**
 * Format an error for user display
 * @param error Error object
 * @returns User-friendly error message
 */
function formatErrorForUser(error: Error | null): string {
  if (!error) return 'An unknown error occurred';
  
  if (error instanceof AppError) {
    return error.getUserMessage();
  }
  
  return error.message || 'An unexpected error occurred';
}

/**
 * ErrorFallback provides a user-friendly, accessible error message
 * when a component encounters an error.
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  componentName,
  onRetry
}) => {
  const errorMessage = formatErrorForUser(error);
  const componentLabel = componentName ? ` in ${componentName}` : '';
  
  return (
    <div 
      role="alert"
      aria-live="assertive"
      className="error-boundary p-4 m-4 border-2 border-red-500 bg-red-50 rounded text-center"
    >
      <div className="flex flex-col items-center justify-center">
        <svg 
          className="w-12 h-12 text-red-500 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
        
        <h2 className="text-xl font-bold text-red-700 mb-2">
          Something went wrong{componentLabel}
        </h2>
        
        <p className="text-red-700 mb-4">
          {errorMessage}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Try again"
          >
            Try Again
          </button>
        )}
        
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-4 text-left w-full">
            <summary className="cursor-pointer text-red-700 font-medium">
              Technical Details
            </summary>
            <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs text-red-900">
              {error.stack}
              {errorInfo && errorInfo.componentStack && (
                <>
                  <hr className="my-2 border-red-200" />
                  <p className="font-bold">Component Stack:</p>
                  {errorInfo.componentStack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;