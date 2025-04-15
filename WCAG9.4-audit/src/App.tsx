/**
 * Main Application Component
 * 
 * Entry point for the application that integrates all providers
 * and sets up secure routing and accessibility features.
 */

import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorFallback from './components/ErrorFallback';

// Use lazy loading for improved performance and code splitting
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
 * Temporary redirect to dashboard for development
 */
const AppRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard directly
    navigate('/dashboard');
  }, [navigate]);
  
  return <PageLoader />;
};

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
              errorInfo={null}
              resetErrorBoundary={() => window.location.reload()}
              title="Application Error"
              message="We're sorry, but something went wrong. Please try refreshing the page."
            />
          </div>
        }
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Temporary development route - redirect to dashboard */}
            <Route path="/" element={<AppRedirect />} />
            <Route path="/login" element={<AppRedirect />} />
            <Route path="/register" element={<AppRedirect />} />
            
            {/* Main application routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/test" element={<AccessibilityTestPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/reports/:reportId" element={<ReportDetailPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            
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