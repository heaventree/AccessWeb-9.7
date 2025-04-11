import { ReactNode } from 'react';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';

interface UIEnhancementWrapperProps {
  children: ReactNode;
  enhancedVersion: ReactNode;
  featureFlag: keyof ReturnType<typeof useUIEnhancement>['featureFlags'];
}

/**
 * UIEnhancementWrapper component conditionally renders either the original children
 * or an enhanced version based on the current UI mode and the specified feature flag.
 * 
 * This is useful for smaller UI elements that need to be enhanced without creating
 * full page alternatives.
 */
export function UIEnhancementWrapper({
  children,
  enhancedVersion,
  featureFlag
}: UIEnhancementWrapperProps) {
  const { uiMode, featureFlags } = useUIEnhancement();
  
  // Show enhanced version only if both UI mode is enhanced and the specific feature flag is enabled
  const shouldShowEnhanced = uiMode === 'enhanced' && featureFlags[featureFlag];
  
  return shouldShowEnhanced ? <>{enhancedVersion}</> : <>{children}</>;
}