import React from 'react';
import { Paintbrush } from 'lucide-react';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';

/**
 * UIEnhancementButton Component
 * 
 * A simple floating button that allows toggling between current and enhanced UI modes.
 * This component is placed directly in the App.tsx and provides a way to activate
 * the enhanced UI without modifying any routes or components.
 */
export function UIEnhancementButton() {
  const { uiMode, setUIMode, featureFlags, toggleFeatureFlag } = useUIEnhancement();
  
  const handleToggleUIMode = () => {
    if (uiMode === 'current') {
      // When enabling enhanced UI, also enable some default components
      setUIMode('enhanced');
      // Enable navigation by default when activating enhanced UI
      if (!featureFlags.enhancedNavigation) {
        toggleFeatureFlag('enhancedNavigation');
      }
    } else {
      setUIMode('current');
    }
  };
  
  return (
    <button
      onClick={handleToggleUIMode}
      className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
      aria-label={uiMode === 'current' ? 'Enable enhanced UI' : 'Disable enhanced UI'}
      title={uiMode === 'current' ? 'Enable enhanced UI' : 'Disable enhanced UI'}
    >
      <Paintbrush className={`w-6 h-6 ${uiMode === 'enhanced' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} />
    </button>
  );
}