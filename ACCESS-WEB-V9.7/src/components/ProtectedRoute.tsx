/**
 * Protected Route Component
 * 
 * Secures routes that require authentication or specific roles,
 * with accessibility support and clear feedback.
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, DEVELOPMENT_MODE } from '../hooks/useAuth';

// Props interface
interface ProtectedRouteProps {
  /**
   * Child components to render if authorized
   */
  children: ReactNode;
  
  /**
   * Whether admin access is required (optional)
   */
  requireAdmin?: boolean;
  
  /**
   * Route to redirect to if unauthorized
   */
  redirectTo?: string;
  
  /**
   * Whether to check for authentication only
   */
  authOnly?: boolean;
  
  /**
   * Loading component while checking authentication
   */
  loadingComponent?: ReactNode;
}

/**
 * Protected Route Component
 * 
 * Ensures routes are only accessible to authenticated users with required roles
 */
export function ProtectedRoute({
  children,
  requireAdmin = false,
  redirectTo = '/login',
  authOnly = false,
  loadingComponent = <div className="p-4">Loading...</div>
}: ProtectedRouteProps): JSX.Element {
  // In development mode, bypass all protections
  if (DEVELOPMENT_MODE) {
    console.info('🔓 Development mode: Bypassing authentication checks for protected route');
    return <>{children}</>;
  }
  
  // Get authentication context
  const { user, isAuthenticated, loading: isLoading } = useAuth();
  
  // Get current location for redirection
  const location = useLocation();
  
  // Show loading component while checking authentication
  if (isLoading) {
    return <>{loadingComponent}</>;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    // Preserve current location for redirect after login
    const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(location.pathname)}`;
    
    return <Navigate to={redirectUrl} replace />;
  }
  
  // If admin access is required and user is not admin, redirect to unauthorized
  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and has required role, render children
  return <>{children}</>;
}

/**
 * Higher-order component to protect a route
 * @param Component Component to protect
 * @param protectedProps Protected route props
 * @returns Protected component
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  protectedProps: Omit<ProtectedRouteProps, 'children'>
): React.ComponentType<P> {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const ProtectedComponent = (props: P): JSX.Element => (
    <ProtectedRoute {...protectedProps}>
      <Component {...props} />
    </ProtectedRoute>
  );
  
  ProtectedComponent.displayName = `withProtectedRoute(${displayName})`;
  
  return ProtectedComponent;
}

export default ProtectedRoute;