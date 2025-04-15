import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';
import { logError, ErrorType, createError } from '../utils/errorHandler';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, resetError: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  component?: string; // For tracking which component had the error
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * This implements best practices for accessibility and error recovery.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Create standardized error
    const appError = createError(
      ErrorType.APPLICATION,
      'component_error',
      `Error in component: ${this.props.component || 'unknown'}`,
      { 
        componentStack: errorInfo.componentStack,
        component: this.props.component
      },
      error
    );
    
    // Log the error with our standardized format
    logError(appError);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.resetError);
        }
        return this.props.fallback;
      }
      
      // Otherwise use the default ErrorFallback component
      return (
        <ErrorFallback 
          error={this.state.error} 
          resetError={this.resetError} 
        />
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorBoundary;