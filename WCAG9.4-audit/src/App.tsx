/**
 * Main Application Component
 * 
 * Entry point for the application that integrates all providers
 * and sets up secure routing and accessibility features.
 */

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import ErrorFallback from './components/ErrorFallback';

// Use lazy loading for improved performance and code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AccessibilityTestPage = lazy(() => import('./pages/AccessibilityTestPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const ReportDetailPage = lazy(() => import('./pages/ReportDetailPage'));
const AdminPage = lazy(() => import('./pages/admin/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

// Loading component for lazy-loaded routes
const PageLoader = (): JSX.Element => (
  <div 
    role="status" 
    aria-live="polite" 
    className="flex items-center justify-center min-h-screen bg-gray-50"
  >
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    <span className="sr-only">Loading page...</span>
  </div>
);

/**
 * Main application component
 */
function App(): JSX.Element {
  return (
    <AppProvider>
      <ErrorBoundary
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <ErrorFallback 
              error={new Error('Application error')}
              title="Application Error"
              message="We're sorry, but something went wrong. Please try refreshing the page."
            />
          </div>
        }
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes requiring authentication */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <AccessibilityTestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/:reportId"
              element={
                <ProtectedRoute>
                  <ReportDetailPage />
                </ProtectedRoute>
              }
            />
            
            {/* Admin routes requiring admin role */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin" redirectTo="/unauthorized">
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            
            {/* Error and utility routes */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            
            {/* Catch any unknown routes and redirect to not found */}
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AppProvider>
  );
}

export default App;