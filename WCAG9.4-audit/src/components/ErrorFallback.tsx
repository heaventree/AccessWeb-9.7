import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { IS_DEVELOPMENT_MODE } from '../utils/environment';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Application Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We're sorry, but something went wrong. Please try again or contact support if the problem persists.
          </p>
          {IS_DEVELOPMENT_MODE && (
            <pre className="mt-4 p-4 bg-red-50 rounded-lg text-left text-sm text-red-700 overflow-auto">
              {error.message}
            </pre>
          )}
        </div>
        <div>
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}