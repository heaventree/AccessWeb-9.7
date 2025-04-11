import React from 'react';
import { UIEnhancementWrapper } from './UIEnhancementWrapper';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';

interface EnhancedRouteProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
}

/**
 * EnhancedRoute Component
 * 
 * This component provides a standardized layout with Navigation, Footer, and BackToTop
 * components, optionally enhanced by the UIEnhancementContext. It serves as a drop-in
 * replacement for the existing route elements in App.tsx without modifying their structure.
 */
export function EnhancedRoute({ children, showNavigation = true, showFooter = true }: EnhancedRouteProps) {
  const { uiMode, isEnhanced } = useUIEnhancement();
  
  // If UI Enhancement is not active, render the original components
  if (uiMode === 'current') {
    return (
      <>
        {showNavigation && <Navigation />}
        <main id="main-content">{children}</main>
        {showFooter && <Footer />}
        <BackToTop />
      </>
    );
  }
  
  // If UI Enhancement is active, use UIEnhancementWrapper to handle enhanced UI
  return (
    <UIEnhancementWrapper showNavigation={showNavigation}>
      <main id="main-content">{children}</main>
      {showFooter && <Footer />}
      <BackToTop />
    </UIEnhancementWrapper>
  );
}