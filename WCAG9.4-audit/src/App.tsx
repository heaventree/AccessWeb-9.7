import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Import authentication components
import { EmailVerification } from './components/auth/EmailVerification';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';

/**
 * Main application component with routing
 */
const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/verify-email/:token" element={<EmailVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      
      {/* Default Route */}
      <Route 
        path="/" 
        element={
          <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <h1 className="text-3xl font-bold">
              WCAG 9.4 Accessibility Audit Tool
            </h1>
            <p className="mt-4 max-w-lg text-gray-600">
              A comprehensive platform for evaluating and improving web accessibility
              compliance, designed with intelligent tools to simplify the implementation
              of WCAG standards.
            </p>
            
            <div className="mt-8">
              <button className="btn mr-4">
                Sign In
              </button>
              <button className="btn bg-white text-primary-600 border border-primary-600 hover:bg-gray-50">
                Sign Up
              </button>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">Intelligent Scanning</h2>
                <p className="text-gray-600">
                  Automatically detect accessibility issues with our AI-powered scanning engine.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">Real-time Monitoring</h2>
                <p className="text-gray-600">
                  Monitor your site continuously for compliance as content changes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-3">Actionable Reports</h2>
                <p className="text-gray-600">
                  Get clear guidance on how to fix issues with prioritized recommendations.
                </p>
              </div>
            </div>
          </div>
        }
      />
      
      {/* Catch-all Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;