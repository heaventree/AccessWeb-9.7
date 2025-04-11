import { createContext, useContext, useState, ReactNode } from 'react';

// Define the supported UI modes
type UIMode = 'current' | 'enhanced';

// Define the feature flags for gradual enhancement
interface FeatureFlags {
  enhancedNavigation: boolean;
  enhancedFooter: boolean;
  enhancedCards: boolean;
  enhancedTables: boolean;
  enhancedForms: boolean;
  enhancedButtons: boolean;
  enhancedAnalytics: boolean;
  enhancedDashboards: boolean;
}

// Context interface
interface UIEnhancementContextProps {
  uiMode: UIMode;
  setUIMode: (mode: UIMode) => void;
  featureFlags: FeatureFlags;
  toggleFeatureFlag: (flag: keyof FeatureFlags) => void;
  isEnhanced: (feature: keyof FeatureFlags) => boolean;
}

// Create the context with default values
const UIEnhancementContext = createContext<UIEnhancementContextProps>({
  uiMode: 'current',
  setUIMode: () => {},
  featureFlags: {
    enhancedNavigation: false,
    enhancedFooter: false,
    enhancedCards: false,
    enhancedTables: false,
    enhancedForms: false,
    enhancedButtons: false,
    enhancedAnalytics: false,
    enhancedDashboards: false,
  },
  toggleFeatureFlag: () => {},
  isEnhanced: () => false,
});

// Provider component
export function UIEnhancementProvider({ children }: { children: ReactNode }) {
  // Initialize UI mode from localStorage if available
  const initialMode = (localStorage.getItem('uiMode') as UIMode) || 'current';
  const [uiMode, setUIMode] = useState<UIMode>(initialMode);
  
  // Initialize feature flags from localStorage if available
  const initialFeatureFlags: FeatureFlags = JSON.parse(
    localStorage.getItem('featureFlags') || 
    JSON.stringify({
      enhancedNavigation: false,
      enhancedFooter: false,
      enhancedCards: false,
      enhancedTables: false,
      enhancedForms: false,
      enhancedButtons: false,
      enhancedAnalytics: false,
      enhancedDashboards: false,
    })
  );
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(initialFeatureFlags);
  
  // Save UI mode to localStorage
  const handleSetUIMode = (mode: UIMode) => {
    localStorage.setItem('uiMode', mode);
    setUIMode(mode);
  };
  
  // Toggle a feature flag
  const toggleFeatureFlag = (flag: keyof FeatureFlags) => {
    const updatedFlags = {
      ...featureFlags,
      [flag]: !featureFlags[flag],
    };
    localStorage.setItem('featureFlags', JSON.stringify(updatedFlags));
    setFeatureFlags(updatedFlags);
  };
  
  // Check if a feature is enhanced
  const isEnhanced = (feature: keyof FeatureFlags): boolean => {
    return uiMode === 'enhanced' && featureFlags[feature];
  };
  
  return (
    <UIEnhancementContext.Provider
      value={{
        uiMode,
        setUIMode: handleSetUIMode,
        featureFlags,
        toggleFeatureFlag,
        isEnhanced,
      }}
    >
      {children}
    </UIEnhancementContext.Provider>
  );
}

// Custom hook for using the context
export function useUIEnhancement() {
  const context = useContext(UIEnhancementContext);
  if (context === undefined) {
    throw new Error('useUIEnhancement must be used within a UIEnhancementProvider');
  }
  return context;
}