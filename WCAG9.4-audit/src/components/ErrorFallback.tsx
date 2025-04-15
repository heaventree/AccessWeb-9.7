/**
 * Error Fallback Component
 * 
 * Displays a user-friendly error message with accessibility support
 * and options to recover from the error.
 */

import React from 'react';
import { AppError, getAccessibilityHint, getErrorMessage } from '../utils/errorHandler';
import { IS_DEVELOPMENT_MODE } from '../utils/environment';

// Error fallback props
interface ErrorFallbackProps {
  /**
   * Error that occurred
   */
  error: Error | AppError;
  
  /**
   * Optional component stack
   */
  componentStack?: string;
  
  /**
   * Optional function to reset the error boundary
   */
  resetErrorBoundary?: () => void;
  
  /**
   * Optional error title
   */
  title?: string;
  
  /**
   * Optional custom message
   */
  message?: string;
}

/**
 * Error Fallback Component
 * 
 * Displays an accessible error message to the user
 */
export function ErrorFallback({
  error,
  componentStack,
  resetErrorBoundary,
  title = 'Something went wrong',
  message
}: ErrorFallbackProps): JSX.Element {
  // Get error message
  const errorMessage = message || getErrorMessage(error);
  
  // Get accessibility hint
  const a11yHint = getAccessibilityHint(error);
  
  /**
   * Handle try again button
   */
  const handleTryAgain = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    }
  };
  
  /**
   * Handle refresh button
   */
  const handleRefresh = () => {
    window.location.reload();
  };
  
  /**
   * Handle go home button
   */
  const handleGoHome = () => {
    window.location.href = '/';
  };
  
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-6 max-w-3xl mx-auto my-8 bg-white rounded-lg shadow-lg border border-red-200"
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <svg
            className="h-10 w-10 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <div>
          <h2
            id="error-boundary-heading"
            tabIndex={-1}
            className="text-xl font-semibold text-gray-900"
          >
            {title}
          </h2>
          
          <p className="mt-2 text-sm text-gray-600">
            {errorMessage}
          </p>
          
          {a11yHint && (
            <p className="mt-1 text-sm text-gray-500" aria-live="polite">
              {a11yHint}
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-3">
        {resetErrorBoundary && (
          <button
            onClick={handleTryAgain}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-describedby="error-boundary-heading"
          >
            Try Again
          </button>
        )}
        
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-describedby="error-boundary-heading"
        >
          Refresh Page
        </button>
        
        <button
          onClick={handleGoHome}
          className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          aria-describedby="error-boundary-heading"
        >
          Go to Home
        </button>
      </div>
      
      {/* Show additional details in development mode */}
      {IS_DEVELOPMENT_MODE && (
        <details className="mt-6 text-xs text-gray-500 border-t pt-4">
          <summary className="cursor-pointer font-medium">
            Error Details (Development Only)
          </summary>
          
          <div className="mt-2 p-2 bg-gray-50 rounded overflow-auto">
            <p className="font-mono whitespace-pre-wrap break-all">
              {error.name}: {error.message}
            </p>
            
            {error.stack && (
              <pre className="mt-2 text-red-700 overflow-auto max-h-64 p-1">
                {error.stack}
              </pre>
            )}
            
            {componentStack && (
              <>
                <p className="mt-4 font-semibold">Component Stack:</p>
                <pre className="mt-1 text-orange-700 overflow-auto max-h-64 p-1">
                  {componentStack}
                </pre>
              </>
            )}
            
            {error instanceof AppError && error.details && (
              <>
                <p className="mt-4 font-semibold">Error Details:</p>
                <pre className="mt-1 text-blue-700 overflow-auto max-h-64 p-1">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              </>
            )}
          </div>
        </details>
      )}
    </div>
  );
}

export default ErrorFallback;