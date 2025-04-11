import React, { ReactNode } from 'react';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';

/**
 * A wrapper component that renders either standard or enhanced UI elements
 * based on the current UI mode from UIEnhancementContext
 */
interface UIEnhancementWrapperProps {
  standardElement: ReactNode;
  enhancedElement: ReactNode;
}

export function UIEnhancementWrapper({ standardElement, enhancedElement }: UIEnhancementWrapperProps) {
  const { uiMode } = useUIEnhancement();
  
  return (
    <>
      {uiMode === 'enhanced' ? enhancedElement : standardElement}
    </>
  );
}