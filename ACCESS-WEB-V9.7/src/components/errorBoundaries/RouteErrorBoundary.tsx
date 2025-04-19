/**
 * Route Error Boundary Component
 * 
 * An error boundary that automatically resets when the route changes,
 * perfect for isolating errors within specific pages and routes.
 */

import { FC, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';

/**
 * RouteErrorBoundary Component
 * 
 * Wraps ErrorBoundary to automatically reset on route changes
 */
const RouteErrorBoundary: FC<Omit<ErrorBoundaryProps, 'resetOnRouteChange'>> = (props) => {
  // Get current location
  const location = useLocation();
  
  // Store pathname in state to detect changes
  const [previousPathname, setPreviousPathname] = useState(location.pathname);
  
  // Reset error boundary when pathname changes
  useEffect(() => {
    if (location.pathname !== previousPathname) {
      setPreviousPathname(location.pathname);
    }
  }, [location.pathname, previousPathname]);
  
  // Create a key based on pathname to force remount on route change
  const key = `route-error-boundary-${location.pathname}`;
  
  return (
    <ErrorBoundary 
      {...props}
      key={key}
      label={props.label || `Route: ${location.pathname}`}
    />
  );
};

export default RouteErrorBoundary;