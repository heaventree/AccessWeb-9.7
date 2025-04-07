import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import accessibilityTips, { AccessibilityTip } from '../data/accessibilityTips';

interface AccessibilityTipsContextType {
  isEnabled: boolean;
  toggleEnabled: () => void;
  setIsEnabled: (enabled: boolean) => void;
  getTipsByElement: (elementType: string) => AccessibilityTip[];
  getTipById: (id: string) => AccessibilityTip | undefined;
  getAllTips: () => AccessibilityTip[];
  setFilteredTips: (tips: AccessibilityTip[]) => void;
  filteredTips: AccessibilityTip[];
  searchTips: (query: string) => void;
}

const AccessibilityTipsContext = createContext<AccessibilityTipsContextType | undefined>(undefined);

export const useAccessibilityTips = () => {
  const context = useContext(AccessibilityTipsContext);
  if (!context) {
    throw new Error('useAccessibilityTips must be used within an AccessibilityTipsProvider');
  }
  return context;
};

interface AccessibilityTipsProviderProps {
  children: ReactNode;
}

export const AccessibilityTipsProvider: React.FC<AccessibilityTipsProviderProps> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [filteredTips, setFilteredTips] = useState<AccessibilityTip[]>([]);

  useEffect(() => {
    // Check localStorage for saved preference
    const savedPreference = localStorage.getItem('accessibility_tips_enabled');
    if (savedPreference === 'true') {
      setIsEnabled(true);
    }

    // Make the toggle function available globally for external scripts
    interface CustomWindow extends Window {
      __accessibilityTipsToggle?: (newValue: boolean) => void;
    }

    (window as CustomWindow).__accessibilityTipsToggle = (newValue: boolean) => {
      setIsEnabled(newValue);
      localStorage.setItem('accessibility_tips_enabled', String(newValue));
    };

    return () => {
      delete (window as CustomWindow).__accessibilityTipsToggle;
    };
  }, []);

  const toggleEnabled = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    localStorage.setItem('accessibility_tips_enabled', String(newValue));
  };

  const getTipsByElement = (elementType: string): AccessibilityTip[] => {
    return accessibilityTips.filter(tip => tip.element === elementType);
  };

  const getTipById = (id: string): AccessibilityTip | undefined => {
    return accessibilityTips.find(tip => tip.id === id);
  };

  const getAllTips = (): AccessibilityTip[] => {
    return accessibilityTips;
  };

  const searchTips = (query: string): void => {
    if (!query.trim()) {
      setFilteredTips([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = accessibilityTips.filter(tip => 
      tip.title.toLowerCase().includes(lowerQuery) || 
      tip.tip.toLowerCase().includes(lowerQuery) ||
      (tip.wcagReference && tip.wcagReference.toLowerCase().includes(lowerQuery)) ||
      tip.element.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredTips(filtered);
  };

  const value: AccessibilityTipsContextType = {
    isEnabled,
    toggleEnabled,
    setIsEnabled,
    getTipsByElement,
    getTipById,
    getAllTips,
    setFilteredTips,
    filteredTips,
    searchTips
  };

  return (
    <AccessibilityTipsContext.Provider value={value}>
      {children}
    </AccessibilityTipsContext.Provider>
  );
};

export default AccessibilityTipsProvider;