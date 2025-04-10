import { useState, useEffect } from 'react';
import { useDemoMode } from '../hooks/useDemoMode';

export function DemoModeToggle() {
  const { isDemoMode, enableDemoMode, disableDemoMode } = useDemoMode();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle toggle click
  const handleToggle = () => {
    if (isDemoMode) {
      disableDemoMode();
    } else {
      enableDemoMode();
    }
  };

  // Toggle panel visibility
  const togglePanel = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
  };

  // Handle animation end
  const handleAnimationEnd = () => {
    setIsAnimating(false);
  };

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isOpen && !target.closest('.demo-mode-toggle')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-24 right-4 z-50 demo-mode-toggle flex flex-col items-end">
      {/* Floating panel */}
      {(isOpen || isAnimating) && (
        <div 
          className={`bg-white rounded-lg shadow-lg p-4 mb-2 w-64 transform transition-all duration-300 ${
            isOpen 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-4 opacity-0 pointer-events-none'
          }`}
          onAnimationEnd={handleAnimationEnd}
        >
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-900">Demo Mode</h3>
            <p className="text-xs text-gray-500 mt-1">
              Toggle demo mode to explore features without authentication.
            </p>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-700">Status:</span>
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isDemoMode 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {isDemoMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isDemoMode}
                onChange={handleToggle}
              />
              <div 
                className={`block w-10 h-6 rounded-full transition-colors ${
                  isDemoMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
              <div 
                className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${
                  isDemoMode ? 'translate-x-4' : ''
                }`}
              />
            </div>
            <div className="ml-3 text-sm font-medium text-gray-700">
              {isDemoMode ? 'On' : 'Off'}
            </div>
          </label>
          
          {isDemoMode && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <h4 className="text-xs font-medium text-gray-900 mb-1">Active Demo Features:</h4>
              <ul className="text-xs text-gray-600 space-y-1 pl-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-1">•</span> Test subscriptions
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-1">•</span> Simulated payment processing
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-1">•</span> Sample reports & analytics
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Toggle button */}
      <button
        onClick={togglePanel}
        className={`rounded-full p-2.5 shadow-lg flex items-center justify-center transition-colors ${
          isDemoMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-white hover:bg-gray-100 text-gray-700'
        }`}
        aria-label="Toggle demo mode"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}