import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export function ProtectedRoute({ children, isAdmin }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading, isDevelopmentMode } = useAuth();
  const location = useLocation();

  // In development mode, always render children without authentication checks
  if (isDevelopmentMode) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/login" : "/login"} state={{ from: location }} replace />;
  }

  if (isAdmin && user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}