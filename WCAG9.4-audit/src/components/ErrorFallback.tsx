import React from 'react';
import { formatErrorForUser } from '../utils/errorHandler';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

/**
 * Error Fallback Component
 * 
 * Provides a user-friendly error display with accessibility features
 * and options to recover from the error.
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  // Format error for user display
  const userFriendlyError = formatErrorForUser(error as any);
  
  // Focus on the error container when it mounts
  React.useEffect(() => {
    const container = document.getElementById('error-container');
    if (container) {
      container.focus();
    }
  }, []);
  
  return (
    <div 
      id="error-container"
      role="alert"
      tabIndex={-1}
      className="p-6 mx-auto my-8 max-w-2xl bg-red-50 border border-red-200 rounded-lg shadow-sm"
      aria-labelledby="error-title"
    >
      <h2 
        id="error-title" 
        className="text-xl font-semibold text-red-800 mb-2"
      >
        Something went wrong
      </h2>
      
      <div className="mb-4 text-gray-700">
        <p className="mb-2">
          We're sorry, but we encountered an error while processing your request.
        </p>
        <p className="mb-2">
          Error details: {userFriendlyError.message}
        </p>
        {userFriendlyError.userMessage && (
          <p className="mb-2 font-medium">
            {userFriendlyError.userMessage}
          </p>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Try again"
        >
          Try Again
        </button>
        
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Return to home page"
        >
          Return to Home
        </button>
        
        <a
          href="mailto:support@wcag-checker.com?subject=Error Report"
          className="px-4 py-2 text-center border border-gray-300 text-gray-700 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Contact support"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default ErrorFallback;