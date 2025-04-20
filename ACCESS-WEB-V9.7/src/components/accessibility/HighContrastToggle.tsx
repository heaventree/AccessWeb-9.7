/**
 * HighContrastToggle Component
 * 
 * Provides a toggle switch for high contrast mode, which is important
 * for users with visual impairments or color perception difficulties.
 * 
 * This component will add a CSS class to the document body that can be used
 * to apply high-contrast styles throughout the application.
 */

import React, { useEffect, useState } from 'react';
import { secureLocalStorage } from '../../utils/common/secureStorage';

// User preference storage key
const HIGH_CONTRAST_STORAGE_KEY = 'accessibility_high_contrast';
// CSS class applied to body
const HIGH_CONTRAST_CLASS = 'high-contrast-mode';

interface HighContrastToggleProps {
  /** Additional CSS class name */
  className?: string;
  /** Toggle label (defaults to "High Contrast") */
  label?: string;
  /** Whether to remember user preference */
  persistent?: boolean;
}

/**
 * Component that provides a toggle switch for high contrast mode
 */
const HighContrastToggle: React.FC<HighContrastToggleProps> = ({
  className = '',
  label = 'High Contrast',
  persistent = true,
}) => {
  // Default to user preference in localStorage or prefers-contrast media query
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    if (persistent) {
      const storedPreference = secureLocalStorage.getItem(HIGH_CONTRAST_STORAGE_KEY);
      if (storedPreference !== null) {
        return storedPreference === 'true';
      }
    }
    
    // Check for system preference
    return window.matchMedia('(prefers-contrast: more)').matches;
  });

  // Apply high contrast class to body when state changes
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add(HIGH_CONTRAST_CLASS);
    } else {
      document.body.classList.remove(HIGH_CONTRAST_CLASS);
    }
    
    // Store user preference if persistent
    if (persistent) {
      secureLocalStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, isHighContrast.toString());
    }
    
    // Announce change to screen readers
    const message = isHighContrast ? 'High contrast mode enabled' : 'High contrast mode disabled';
    const announcer = document.getElementById('sr-announcer') || document.createElement('div');
    if (!document.getElementById('sr-announcer')) {
      announcer.id = 'sr-announcer';
      announcer.className = 'sr-only';
      announcer.setAttribute('aria-live', 'polite');
      document.body.appendChild(announcer);
    }
    
    announcer.textContent = message;
  }, [isHighContrast, persistent]);
  
  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no stored preference
      if (persistent && secureLocalStorage.getItem(HIGH_CONTRAST_STORAGE_KEY) === null) {
        setIsHighContrast(e.matches);
      }
    };
    
    // Add listener for older browsers
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Legacy support
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      // Clean up listener
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Legacy cleanup
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [persistent]);
  
  const toggleId = React.useId();
  
  return (
    <div className={`high-contrast-toggle ${className}`}>
      <div className="flex items-center">
        <label 
          htmlFor={toggleId}
          className="mr-2 text-sm font-medium"
        >
          {label}
        </label>
        <button
          id={toggleId}
          type="button"
          onClick={() => setIsHighContrast(!isHighContrast)}
          aria-pressed={isHighContrast}
          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isHighContrast ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          role="switch"
        >
          <span className="sr-only">
            {isHighContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
          </span>
          <span 
            aria-hidden="true" 
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
              isHighContrast ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default HighContrastToggle;