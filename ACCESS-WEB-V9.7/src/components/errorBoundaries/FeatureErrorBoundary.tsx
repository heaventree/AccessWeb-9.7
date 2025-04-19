/**
 * Feature Error Boundary Component
 * 
 * A specialized error boundary designed for wrapping specific features
 * or functional components to prevent errors from affecting other parts of the UI.
 */

import { FC, ReactNode } from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';

interface FeatureErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'label'> {
  /**
   * Name of the feature this boundary wraps
   */
  featureName: string;
  
  /**
   * Whether to show a minimal fallback UI
   */
  minimal?: boolean;
  
  /**
   * Custom fallback message
   */
  fallbackMessage?: string;
}

/**
 * Feature Error Boundary Component
 * 
 * Wraps specific features to isolate errors and provide feature-specific fallback UIs
 */
const FeatureErrorBoundary: FC<FeatureErrorBoundaryProps> = ({
  children,
  featureName,
  minimal = false,
  fallbackMessage,
  ...props
}) => {
  // Create minimal fallback UI if requested
  const minimalFallback: ReactNode = minimal ? (
    <div className="feature-error-minimal">
      <p>
        {fallbackMessage || `The ${featureName} feature is temporarily unavailable.`}
      </p>
      {props.onError && (
        <button 
          onClick={() => window.location.reload()}
          className="feature-error-retry-button"
        >
          Retry
        </button>
      )}
      <style>
        {`
        .feature-error-minimal {
          padding: 12px;
          border-radius: 6px;
          background-color: #f5f5f5;
          border: 1px solid #e0e0e0;
          margin: 12px 0;
          text-align: center;
        }
        
        .feature-error-retry-button {
          margin-top: 8px;
          padding: 4px 12px;
          background-color: #e0e0e0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .feature-error-retry-button:hover {
          background-color: #d0d0d0;
        }
        `}
      </style>
    </div>
  ) : undefined;
  
  return (
    <ErrorBoundary
      {...props}
      label={`Feature: ${featureName}`}
      fallback={minimalFallback || props.fallback}
    >
      {children}
    </ErrorBoundary>
  );
};

export default FeatureErrorBoundary;