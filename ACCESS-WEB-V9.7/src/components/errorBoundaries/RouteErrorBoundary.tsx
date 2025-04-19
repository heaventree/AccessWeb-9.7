/**
 * Route Error Boundary Component
 * 
 * A specialized error boundary for route components with navigation capabilities
 * to handle route-specific errors and provide fallback UI.
 */

import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';

/**
 * Route Error Boundary Component Props
 */
interface RouteErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'label'> {
  /**
   * Route name
   */
  routeName: string;

  /**
   * Path to navigate to when retrying
   */
  fallbackPath?: string;
}

/**
 * Route Error Boundary Component
 * 
 * Provides navigation controls when errors occur in route components
 */
const RouteErrorBoundary: FC<RouteErrorBoundaryProps> = ({
  children,
  routeName,
  fallbackPath,
  ...props
}) => {
  const navigate = useNavigate();

  /**
   * Handle fallback navigation
   */
  const handleFallbackNavigation = () => {
    if (fallbackPath) {
      navigate(fallbackPath);
    } else {
      navigate('/');
    }
  };

  /**
   * Get custom fallback UI to display when an error occurs
   */
  const getRouteFallback = () => (
    <div className="route-error">
      <h2>Route Error</h2>
      <p>There was a problem loading this page ({routeName}).</p>
      <div className="route-error-actions">
        <button 
          onClick={() => window.location.reload()}
          className="route-error-button route-error-button-primary"
        >
          Reload Page
        </button>
        <button 
          onClick={handleFallbackNavigation} 
          className="route-error-button route-error-button-secondary"
        >
          Go to {fallbackPath ? 'Previous Page' : 'Home Page'}
        </button>
      </div>
      <style>
        {`
        .route-error {
          padding: 2rem;
          margin: 2rem auto;
          max-width: 600px;
          text-align: center;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .route-error h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #e53e3e;
        }
        
        .route-error p {
          margin-bottom: 1.5rem;
          color: #4a5568;
        }
        
        .route-error-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        
        .route-error-button {
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .route-error-button-primary {
          background-color: #3182ce;
          color: white;
          border: none;
        }
        
        .route-error-button-primary:hover {
          background-color: #2b6cb0;
        }
        
        .route-error-button-secondary {
          background-color: transparent;
          color: #4a5568;
          border: 1px solid #cbd5e0;
        }
        
        .route-error-button-secondary:hover {
          background-color: #f7fafc;
        }
        `}
      </style>
    </div>
  );

  return (
    <ErrorBoundary
      {...props}
      label={`Route: ${routeName}`}
      resetOnRouteChange
      fallback={props.fallback || getRouteFallback()}
    >
      {children}
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary;