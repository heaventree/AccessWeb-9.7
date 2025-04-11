import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// UI Enhancement modes
export type UIMode = 'current' | 'enhanced';

// Feature flags for specific components
export interface FeatureFlags {
  enhancedNavigation: boolean;
  enhancedFooter: boolean;
  enhancedLandingPage: boolean;
  enhancedCards: boolean;
  enhancedButtons: boolean;
  enhancedForms: boolean;
  darkModeEnhancement: boolean;
}

// Context interface
interface UIEnhancementContextType {
  uiMode: UIMode;
  setUIMode: (mode: UIMode) => void;
  featureFlags: FeatureFlags;
  toggleFeatureFlag: (flag: keyof FeatureFlags) => void;
  isEnhanced: (component: keyof FeatureFlags) => boolean;
}

// Default feature flags
const defaultFeatureFlags: FeatureFlags = {
  enhancedNavigation: false,
  enhancedFooter: false,
  enhancedLandingPage: false,
  enhancedCards: false,
  enhancedButtons: false,
  enhancedForms: false,
  darkModeEnhancement: false,
};

// Create context with default values
const UIEnhancementContext = createContext<UIEnhancementContextType>({
  uiMode: 'current',
  setUIMode: () => {},
  featureFlags: defaultFeatureFlags,
  toggleFeatureFlag: () => {},
  isEnhanced: () => false,
});

// Provider component
export function UIEnhancementProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available
  const [uiMode, setUIMode] = useState<UIMode>(() => {
    const savedMode = localStorage.getItem('uiEnhancementMode');
    return (savedMode as UIMode) || 'current';
  });

  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(() => {
    const savedFlags = localStorage.getItem('uiEnhancementFlags');
    return savedFlags ? JSON.parse(savedFlags) : defaultFeatureFlags;
  });

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('uiEnhancementMode', uiMode);
  }, [uiMode]);

  useEffect(() => {
    localStorage.setItem('uiEnhancementFlags', JSON.stringify(featureFlags));
  }, [featureFlags]);

  // Toggle individual feature flags
  const toggleFeatureFlag = (flag: keyof FeatureFlags) => {
    setFeatureFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  // Helper to check if a component should use enhanced UI
  const isEnhanced = (component: keyof FeatureFlags): boolean => {
    return uiMode === 'enhanced' && featureFlags[component];
  };

  return (
    <UIEnhancementContext.Provider 
      value={{
        uiMode,
        setUIMode,
        featureFlags,
        toggleFeatureFlag,
        isEnhanced
      }}
    >
      {children}
    </UIEnhancementContext.Provider>
  );
}

// Hook for consuming the context
export function useUIEnhancement() {
  const context = useContext(UIEnhancementContext);
  if (context === undefined) {
    throw new Error('useUIEnhancement must be used within a UIEnhancementProvider');
  }
  return context;
}