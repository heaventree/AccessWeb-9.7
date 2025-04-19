/**
 * Global Error Boundary Component
 * 
 * A top-level error boundary that provides comprehensive error handling
 * for the entire application with analytics and reporting capabilities.
 */

import { FC } from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';
import { handleError } from '../../utils/errorHandler';

interface GlobalErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'onError' | 'label'> {
  /**
   * Whether to send errors to analytics
   */
  sendToAnalytics?: boolean;
  
  /**
   * Custom label for the error boundary
   */
  label?: string;
}

/**
 * GlobalErrorBoundary Component
 * 
 * Top-level error boundary with extended capabilities for analytics and reporting
 */
const GlobalErrorBoundary: FC<GlobalErrorBoundaryProps> = ({
  children,
  sendToAnalytics = true,
  label = 'GlobalErrorBoundary',
  ...props
}) => {
  /**
   * Handle errors by reporting to analytics and logging
   */
  const handleGlobalError = (error: Error, componentStack: string) => {
    // Log the error with our centralized error handler
    handleError(error, {
      context: `GlobalErrorBoundary: ${label}`,
      data: {
        componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent
      },
      isFatal: true,
      key: 'global_app_error',
      notify: true
    });
    
    // Send to analytics if enabled (would be implemented with real analytics in production)
    if (sendToAnalytics) {
      // This would integrate with your analytics service
      console.info('[Analytics] Error reported:', error.message);
    }
  };
  
  return (
    <ErrorBoundary
      {...props}
      label={label}
      onError={(error, errorInfo) => handleGlobalError(error, errorInfo.componentStack)}
    >
      {children}
    </ErrorBoundary>
  );
};

export default GlobalErrorBoundary;