/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child component tree and displays fallback UI.
 * Includes accessibility support and error reporting capabilities.
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '../utils/errorHandler';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
  component?: string;
  fallback?: ReactNode;
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
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

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error reporting service
    const component = this.props.component || 'unknown';
    
    // Update state with error details
    this.setState({
      errorInfo
    });
    
    // Log the error
    logError(error, {
      component,
      react: true,
      errorInfo: {
        componentStack: errorInfo.componentStack
      }
    });
    
    // Call the optional onError handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reset the error state to allow retry
   */
  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback, component } = this.props;

    if (hasError) {
      // Custom fallback provided as a prop
      if (fallback) {
        return fallback;
      }
      
      // Default error fallback component with accessibility support
      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          componentName={component}
          onRetry={this.handleRetry}
        />
      );
    }

    // When there's no error, render children normally
    return children;
  }
}

export default ErrorBoundary;