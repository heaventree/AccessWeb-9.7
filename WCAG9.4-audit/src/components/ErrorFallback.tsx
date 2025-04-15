/**
 * Error Fallback Component
 * 
 * A dedicated fallback UI to display when errors occur.
 * This component is used by the ErrorBoundary when an error is caught.
 * 
 * Implements best practices for error display, including accessibility considerations.
 */

import React from 'react';
import { ErrorResponse } from '../utils/errorHandler';
import { IS_DEVELOPMENT_MODE } from '../utils/environment';
import { getUserFriendlyErrorMessage } from '../utils/errorHandler';

interface ErrorFallbackProps {
  error: Error | ErrorResponse;
  resetError?: () => void;
  title?: string;
  showResetButton?: boolean;
  showTechnicalDetails?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Something went wrong',
  showResetButton = true,
  showTechnicalDetails
}) => {
  // If the error has a type property, it's an ErrorResponse
  const isErrorResponse = (err: any): err is ErrorResponse => {
    return err && typeof err === 'object' && 'type' in err && 'code' in err;
  };
  
  // Get the appropriate error message
  const errorMessage = getUserFriendlyErrorMessage(error);
  
  // Determine if technical details should be shown
  const displayTechnicalDetails = showTechnicalDetails !== undefined
    ? showTechnicalDetails
    : IS_DEVELOPMENT_MODE;
  
  return (
    <div 
      className="error-fallback"
      role="alert"
      aria-live="assertive"
      data-testid="error-fallback"
    >
      <div className="error-fallback-container">
        <h2 id="error-title" className="error-fallback-title">
          {title}
        </h2>
        
        <p className="error-fallback-message">
          {errorMessage}
        </p>
        
        {displayTechnicalDetails && (
          <details className="error-fallback-details">
            <summary className="error-fallback-summary">
              Technical details (for developers)
            </summary>
            
            <div className="error-fallback-technical">
              {isErrorResponse(error) ? (
                <>
                  <p><strong>Type:</strong> {error.type}</p>
                  <p><strong>Code:</strong> {error.code}</p>
                  <p><strong>Message:</strong> {error.message}</p>
                  
                  {error.details && (
                    <>
                      <p><strong>Details:</strong></p>
                      <pre>{JSON.stringify(error.details, null, 2)}</pre>
                    </>
                  )}
                  
                  {error.stack && (
                    <>
                      <p><strong>Stack:</strong></p>
                      <pre>{error.stack}</pre>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p><strong>Message:</strong> {error.message}</p>
                  <p><strong>Stack:</strong></p>
                  <pre>{error.stack}</pre>
                </>
              )}
            </div>
          </details>
        )}
        
        {showResetButton && resetError && (
          <button 
            onClick={resetError}
            className="error-fallback-button"
            aria-describedby="error-title"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;