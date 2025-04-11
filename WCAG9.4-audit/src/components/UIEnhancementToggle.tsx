import React, { useState } from 'react';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';
import { Paintbrush, X } from 'lucide-react';

/**
 * UI Enhancement Toggle Component
 * 
 * This component provides a floating interface for toggling between
 * the current UI and the enhanced UI, as well as individual feature flags.
 * It's positioned on the side of the screen and can be expanded/collapsed.
 */
export const UIEnhancementToggle: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { uiMode, setUIMode, featureFlags, toggleFeatureFlag } = useUIEnhancement();

  return (
    <div 
      className={`fixed bottom-24 right-4 z-50 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-10'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-2 left-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label={isOpen ? 'Close UI enhancement panel' : 'Open UI enhancement panel'}
        >
          <Paintbrush size={20} />
        </button>

        {/* Panel Header */}
        <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 flex justify-between items-center">
          <h3 className={`font-medium text-gray-700 dark:text-gray-200 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            UI Enhancement
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            aria-label="Close panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Panel Content */}
        <div className={`p-4 transition-all duration-300 ${isOpen ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'}`}>
          {/* Global UI Mode Toggle */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enhanced UI
              </span>
              <button
                onClick={() => setUIMode(uiMode === 'current' ? 'enhanced' : 'current')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  uiMode === 'enhanced' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    uiMode === 'enhanced' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {uiMode === 'enhanced' 
                ? 'Using enhanced UI. Select components below to enable.' 
                : 'Using current UI. Toggle to enable enhanced UI features.'}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-600 my-3"></div>

          {/* Feature Flags */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              UI Components
            </h4>

            {Object.entries(featureFlags).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label 
                  htmlFor={`toggle-${key}`} 
                  className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
                <button
                  id={`toggle-${key}`}
                  onClick={() => toggleFeatureFlag(key as keyof typeof featureFlags)}
                  disabled={uiMode === 'current'}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                    value && uiMode === 'enhanced'
                      ? 'bg-blue-600' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  } ${uiMode === 'current' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  aria-pressed={value}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      value && uiMode === 'enhanced' ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Info Text */}
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>
              Non-destructive enhancement that preserves all existing functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};