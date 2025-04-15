/**
 * Error Boundary Component
 * 
 * A React error boundary that catches errors in component trees and displays a
 * fallback UI. This helps prevent the entire app from crashing when an error occurs.
 * 
 * Implements best practices for error recovery, logging, and user experience.
 */

import React, { Component, ErrorInfo, ReactNode, ReactElement } from 'react';
import { logError, ErrorType, createError } from '../utils/errorHandler';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactElement);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Format and log the error
    const formattedError = createError(
      ErrorType.SYSTEM,
      'react_error',
      error.message || 'An error occurred in the application',
      { 
        componentStack: errorInfo.componentStack,
        stack: error.stack
      }
    );
    
    logError(formattedError);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // If a custom fallback was provided as a function, use it
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.resetError);
      }
      
      // If a custom fallback was provided as a ReactNode, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, use our ErrorFallback component
      return (
        <ErrorFallback 
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with an ErrorBoundary
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.FC<P> => {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WithErrorBoundary.displayName = `WithErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;
  
  return WithErrorBoundary;
};

export default ErrorBoundary;