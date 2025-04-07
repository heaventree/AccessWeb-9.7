import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AuthPage } from './pages/AuthPage';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { EmailVerification } from './components/auth/EmailVerification';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { AccessibilityTipsDemo } from './components/demos/AccessibilityTipsDemo';
import { useAuth } from './hooks/useAuth';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <>
      <Helmet>
        <title>WCAG 9.4 Audit Tool</title>
        <meta name="description" content="A comprehensive web accessibility audit and compliance tool" />
      </Helmet>
      
      <Router>
        <AccessibilityToolbar />
        
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<EmailVerification />} />
          
          {/* Demo routes */}
          <Route path="/demo/accessibility-tips" element={<AccessibilityTipsDemo />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="p-4">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p>This is a protected route.</p>
              </div>
            </ProtectedRoute>
          } />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* 404 route */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-gray-600 mb-6">Page not found</p>
              <a href="/" className="text-primary-600 hover:text-primary-800">
                Return to Home
              </a>
            </div>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;