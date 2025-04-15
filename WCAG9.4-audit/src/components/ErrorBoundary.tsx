/**
 * Error Boundary Component
 * 
 * Catches and handles React component errors with accessibility support
 * and standardized error reporting.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError, normalizeError, ErrorType } from '../utils/errorHandler';
import ErrorFallback from './ErrorFallback';

// Error boundary props
interface ErrorBoundaryProps {
  /**
   * Child components
   */
  children: ReactNode;
  
  /**
   * Optional custom fallback component
   */
  fallback?: ReactNode;
  
  /**
   * Optional error handler
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  
  /**
   * Whether to reset the error boundary on component remount
   */
  resetOnUnmount?: boolean;
}

// Error boundary state
interface ErrorBoundaryState {
  /**
   * Whether an error has occurred
   */
  hasError: boolean;
  
  /**
   * Error that occurred
   */
  error: Error | null;
  
  /**
   * Error information
   */
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Catches errors in child component tree and displays a fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }
  
  /**
   * Handle errors during rendering
   * @param error Error that occurred
   * @returns Updated state
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }
  
  /**
   * Handle component errors
   * @param error Error that occurred
   * @param errorInfo React error info
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error info
    this.setState({
      errorInfo
    });
    
    // Log error
    logError(error, {
      context: 'ErrorBoundary.componentDidCatch',
      componentStack: errorInfo.componentStack
    });
    
    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Focus the error message for screen readers
    setTimeout(() => {
      const errorElement = document.getElementById('error-boundary-heading');
      if (errorElement) {
        errorElement.focus();
      }
    }, 100);
  }
  
  /**
   * Reset error state when component unmounts (if configured)
   */
  componentWillUnmount(): void {
    if (this.props.resetOnUnmount && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null
      });
    }
  }
  
  /**
   * Reset error state
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };
  
  render(): ReactNode {
    // If no error, render children
    if (!this.state.hasError || !this.state.error) {
      return this.props.children;
    }
    
    // If custom fallback is provided, render it
    if (this.props.fallback) {
      return this.props.fallback;
    }
    
    // Convert to standardized error
    const normalizedError = normalizeError(this.state.error);
    
    // Render default error fallback
    return (
      <ErrorFallback
        error={normalizedError}
        componentStack={this.state.errorInfo?.componentStack}
        resetErrorBoundary={this.handleReset}
      />
    );
  }
}

/**
 * Higher-order component to wrap components with an error boundary
 * @param Component Component to wrap
 * @param errorBoundaryProps Error boundary props
 * @returns Wrapped component
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const ComponentWithErrorBoundary = (props: P): JSX.Element => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  ComponentWithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  
  return ComponentWithErrorBoundary;
}

export default ErrorBoundary;