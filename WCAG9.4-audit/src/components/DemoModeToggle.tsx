import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface DemoModeToggleProps {
  className?: string;
}

export function DemoModeToggle({ className = '' }: DemoModeToggleProps) {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Check local storage for demo mode status
  useEffect(() => {
    const demoModeStatus = localStorage.getItem('demo_mode') === 'true';
    setIsDemoMode(demoModeStatus);
  }, []);

  // Handle demo mode toggle
  const handleToggleDemo = () => {
    if (isDemoMode) {
      // Turn off demo mode
      localStorage.removeItem('demo_mode');
      setIsDemoMode(false);
      // Reload page to refresh all demo data
      window.location.reload();
    } else {
      // Start demo mode activation process
      activateDemoMode();
    }
  };

  // Activate demo mode with animation
  const activateDemoMode = async () => {
    setIsActivating(true);
    
    // Store demo mode state
    localStorage.setItem('demo_mode', 'true');
    
    // Simulate API call or loading process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Activate demo mode
    setIsDemoMode(true);
    setIsActivating(false);
    
    // Redirect to dashboard if not already there
    if (window.location.pathname !== '/dashboard') {
      navigate('/dashboard');
    } else {
      // Reload page to refresh all demo data
      window.location.reload();
    }
  };

  // If already authenticated, don't show the demo mode toggle
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="fixed bottom-16 right-4 z-30 md:bottom-4 md:right-4">
        <button
          onClick={handleToggleDemo}
          disabled={isActivating}
          className={`
            relative flex items-center justify-center 
            px-4 py-2 rounded-full shadow-lg 
            transition-all duration-300 ease-in-out
            ${isDemoMode 
              ? 'bg-amber-500 hover:bg-amber-600 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'}
            ${isActivating ? 'opacity-75 cursor-wait' : 'opacity-100 cursor-pointer'}
          `}
        >
          {isActivating ? (
            <div className="flex items-center">
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Activating Demo...</span>
            </div>
          ) : isDemoMode ? (
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>Exit Demo Mode</span>
            </div>
          ) : (
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>Try Demo Mode</span>
            </div>
          )}
        </button>
      </div>
      
      {/* Tooltip that appears when demo mode is active */}
      {isDemoMode && (
        <div className="fixed top-0 left-0 right-0 bg-amber-100 border-b border-amber-200 text-amber-800 text-center py-2 shadow-md z-50">
          <div className="container mx-auto px-4">
            <p className="text-sm font-medium">
              <span className="font-bold">Demo Mode Active</span> - You're viewing sample data. 
              <button 
                onClick={handleToggleDemo}
                className="ml-3 underline hover:text-amber-900"
              >
                Exit Demo
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}