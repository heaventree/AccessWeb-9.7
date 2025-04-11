import React from 'react';
import { Navigation } from './Navigation';
import { EnhancedNavigation } from './EnhancedNavigation';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';
import { UIEnhancementToggle } from './UIEnhancementToggle';

interface UIEnhancementWrapperProps {
  children: React.ReactNode;
  showNavigation?: boolean;
}

/**
 * UIEnhancementWrapper Component
 * 
 * This component allows us to non-destructively toggle between the current UI and
 * enhanced UI without modifying the application's structure. It handles the conditional
 * rendering of UI components based on the selected enhancement mode and feature flags.
 */
export function UIEnhancementWrapper({ children, showNavigation = true }: UIEnhancementWrapperProps) {
  const { uiMode, isEnhanced } = useUIEnhancement();
  
  // Inject CSS for enhanced UI if needed
  React.useEffect(() => {
    let enhancedStylesLink: HTMLLinkElement | null = null;
    
    if (uiMode === 'enhanced') {
      // Create and append the enhanced styles stylesheet
      enhancedStylesLink = document.createElement('link');
      enhancedStylesLink.rel = 'stylesheet';
      enhancedStylesLink.href = '/src/styles/ui-enhancement.css';
      enhancedStylesLink.id = 'enhanced-ui-styles';
      document.head.appendChild(enhancedStylesLink);
      
      // Add cs_dark class to body if in dark mode
      if (document.documentElement.classList.contains('dark')) {
        document.body.classList.add('cs_dark');
      }
    } else {
      // Remove enhanced styles if they exist
      const existingStyles = document.getElementById('enhanced-ui-styles');
      if (existingStyles) {
        existingStyles.remove();
      }
      
      // Remove cs_dark class from body
      document.body.classList.remove('cs_dark');
    }
    
    return () => {
      if (enhancedStylesLink) {
        enhancedStylesLink.remove();
      }
      document.body.classList.remove('cs_dark');
    };
  }, [uiMode]);
  
  // Listen for theme changes
  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.target === document.documentElement && 
          mutation.attributeName === 'class' &&
          uiMode === 'enhanced'
        ) {
          const isDark = document.documentElement.classList.contains('dark');
          if (isDark) {
            document.body.classList.add('cs_dark');
          } else {
            document.body.classList.remove('cs_dark');
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, [uiMode]);
  
  return (
    <>
      {showNavigation && (
        <>
          {/* Conditionally render enhanced or regular navigation */}
          {isEnhanced('enhancedNavigation') ? (
            <EnhancedNavigation />
          ) : (
            <Navigation />
          )}
        </>
      )}
      
      {/* Render the UI enhancement toggle button */}
      {uiMode === 'enhanced' && <UIEnhancementToggle />}
      
      {/* Render children (main content) */}
      {children}
    </>
  );
}