import { ReactNode } from 'react';
import { Route } from 'react-router-dom';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';

interface EnhancedRouteProps {
  path: string;
  element: ReactNode;
  enhancedElement: ReactNode;
  featureFlag?: keyof ReturnType<typeof useUIEnhancement>['featureFlags'];
}

/**
 * EnhancedRoute component that conditionally renders either the original or enhanced
 * version of a page/component based on the UI mode and feature flags.
 * 
 * This provides a clean way to toggle between UI versions without complex conditional rendering.
 */
export function EnhancedRoute({
  path,
  element,
  enhancedElement,
  featureFlag = 'enhancedNavigation'
}: EnhancedRouteProps) {
  const { uiMode, featureFlags, isEnhanced } = useUIEnhancement();
  
  // Determine which element to render based on UI mode and feature flags
  const renderedElement = uiMode === 'enhanced' && featureFlags[featureFlag] 
    ? enhancedElement 
    : element;
  
  return (
    <Route path={path} element={renderedElement} />
  );
}