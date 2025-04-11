import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// UI Mode options - 'current' is the existing UI, 'enhanced' is the new UI
type UIMode = 'current' | 'enhanced';

// Feature flags to control which UI elements are enhanced
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

// Context properties
interface UIEnhancementContextProps {
  uiMode: UIMode;
  setUIMode: (mode: UIMode) => void;
  featureFlags: FeatureFlags;
  toggleFeatureFlag: (flag: keyof FeatureFlags) => void;
  isEnhanced: (feature: keyof FeatureFlags) => boolean;
}

// Create context with default values
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
  // Get mode from localStorage or default to 'current'
  const [uiMode, setUIModeState] = useState<UIMode>(() => {
    const savedMode = localStorage.getItem('uiMode') as UIMode;
    return savedMode === 'enhanced' ? 'enhanced' : 'current';
  });
  
  // Initialize feature flags from localStorage or set defaults
  const initialFeatureFlags: FeatureFlags = {
    enhancedNavigation: true, // Navigation is always enhanced when UI mode is 'enhanced'
    enhancedFooter: true,    // Footer is always enhanced when UI mode is 'enhanced'
    enhancedCards: false,
    enhancedTables: false,
    enhancedForms: false,
    enhancedButtons: false,
    enhancedAnalytics: false,
    enhancedDashboards: false,
  };
  
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(() => {
    const savedFlags = localStorage.getItem('featureFlags');
    return savedFlags ? JSON.parse(savedFlags) : initialFeatureFlags;
  });
  
  // Update localStorage when UI mode changes
  const handleSetUIMode = (mode: UIMode) => {
    localStorage.setItem('uiMode', mode);
    setUIModeState(mode);
    
    // If switching to current mode, disable all feature flags
    if (mode === 'current') {
      const allDisabled = Object.keys(featureFlags).reduce((acc, key) => {
        acc[key as keyof FeatureFlags] = false;
        return acc;
      }, {} as FeatureFlags);
      
      setFeatureFlags(allDisabled);
      localStorage.setItem('featureFlags', JSON.stringify(allDisabled));
    } else {
      // If switching to enhanced, enable navigation and footer by default
      const updatedFlags = {
        ...featureFlags,
        enhancedNavigation: true,
        enhancedFooter: true,
      };
      setFeatureFlags(updatedFlags);
      localStorage.setItem('featureFlags', JSON.stringify(updatedFlags));
    }
  };
  
  // Toggle individual feature flags
  const toggleFeatureFlag = (flag: keyof FeatureFlags) => {
    const updatedFlags = {
      ...featureFlags,
      [flag]: !featureFlags[flag],
    };
    
    // Special handling: if enhancedNavigation is turned off but UI mode is enhanced,
    // don't allow it (navigation is always enhanced in enhanced mode)
    if (flag === 'enhancedNavigation' && uiMode === 'enhanced' && !updatedFlags.enhancedNavigation) {
      return;
    }
    
    // Same for footer
    if (flag === 'enhancedFooter' && uiMode === 'enhanced' && !updatedFlags.enhancedFooter) {
      return;
    }
    
    setFeatureFlags(updatedFlags);
    localStorage.setItem('featureFlags', JSON.stringify(updatedFlags));
  };
  
  // Helper to check if a feature is enhanced
  const isEnhanced = (feature: keyof FeatureFlags): boolean => {
    return uiMode === 'enhanced' && featureFlags[feature];
  };
  
  // Context value
  const value = {
    uiMode,
    setUIMode: handleSetUIMode,
    featureFlags,
    toggleFeatureFlag,
    isEnhanced,
  };
  
  return (
    <UIEnhancementContext.Provider value={value}>
      {children}
    </UIEnhancementContext.Provider>
  );
}

// Custom hook to use the context
export function useUIEnhancement() {
  const context = useContext(UIEnhancementContext);
  if (context === undefined) {
    throw new Error('useUIEnhancement must be used within a UIEnhancementProvider');
  }
  return context;
}