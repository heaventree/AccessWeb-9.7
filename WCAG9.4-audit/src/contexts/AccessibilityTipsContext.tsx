import React, { createContext, useContext, useState, ReactNode } from 'react';
import accessibilityTips, { AccessibilityTip } from '../data/accessibilityTips';

interface AccessibilityTipsContextType {
  isEnabled: boolean;
  toggleEnabled: () => void;
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
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [filteredTips, setFilteredTips] = useState<AccessibilityTip[]>(accessibilityTips);

  const toggleEnabled = () => {
    setIsEnabled((prev) => !prev);
  };

  const getTipsByElement = (elementType: string) => {
    return accessibilityTips.filter((tip) => tip.element === elementType);
  };

  const getTipById = (id: string) => {
    return accessibilityTips.find((tip) => tip.id === id);
  };

  const getAllTips = () => {
    return accessibilityTips;
  };

  const searchTips = (query: string) => {
    if (!query.trim()) {
      setFilteredTips(accessibilityTips);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = accessibilityTips.filter(
      (tip) =>
        tip.title.toLowerCase().includes(lowerCaseQuery) ||
        tip.tip.toLowerCase().includes(lowerCaseQuery) ||
        tip.element.toLowerCase().includes(lowerCaseQuery) ||
        (tip.wcagReference && tip.wcagReference.toLowerCase().includes(lowerCaseQuery))
    );

    setFilteredTips(filtered);
  };

  return (
    <AccessibilityTipsContext.Provider
      value={{
        isEnabled,
        toggleEnabled,
        getTipsByElement,
        getTipById,
        getAllTips,
        filteredTips,
        setFilteredTips,
        searchTips,
      }}
    >
      {children}
    </AccessibilityTipsContext.Provider>
  );
};