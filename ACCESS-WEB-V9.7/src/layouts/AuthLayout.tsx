import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Protected route wrapper that redirects to login if not authenticated
export const ProtectedRoute: React.FC<{ children?: React.ReactNode, allowedRoles?: string[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#0fae96] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!user) {
    // Save the location they were trying to access for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // For admin routes, check the isAdmin flag rather than role
  if (allowedRoles && allowedRoles.includes('admin') && !user.isAdmin) {
    // User doesn't have admin privileges, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  
  // For subscriber routes, anyone with a valid account can access (both subscribers and admins)
  if (allowedRoles && allowedRoles.includes('subscriber') && !allowedRoles.includes('admin')) {
    // No extra checks needed - all logged in users can access subscriber content
  }
  
  return <>{children || <Outlet />}</>;
};

// Subscriber-only route wrapper
export const SubscriberRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={['subscriber', 'admin']}>
      {children}
    </ProtectedRoute>
  );
};

// Admin-only route wrapper that redirects to admin login page
export const AdminRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#0fae96] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Not authenticated? Redirect to admin login instead of regular login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  // Not an admin? Redirect to unauthorized page
  if (!user.isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children || <Outlet />}</>;
};

// Public only route wrapper that redirects to dashboard if already authenticated
export const PublicOnlyRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-[#0fae96] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (user) {
    // Redirect to the page they were trying to access before logging in
    // or to the dashboard as a fallback
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }
  
  return <>{children || <Outlet />}</>;
};