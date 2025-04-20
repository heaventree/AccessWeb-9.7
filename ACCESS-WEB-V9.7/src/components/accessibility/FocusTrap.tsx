/**
 * FocusTrap Component
 * 
 * Creates a focus trap for modal dialogs and other UI elements that require 
 * keyboard focus to be contained within a specific area.
 * 
 * This is important for accessibility as it prevents keyboard users from
 * accidentally moving focus outside of a modal dialog.
 */

import React, { useEffect, useRef } from 'react';

interface FocusTrapProps {
  /** Whether the focus trap is active */
  active: boolean;
  /** Content to render inside the trap */
  children: React.ReactNode;
  /** Element to return focus to when trap is deactivated */
  returnFocusTo?: HTMLElement | null;
  /** Additional CSS class name */
  className?: string;
  /** Whether to auto-focus the first focusable element */
  autoFocus?: boolean;
}

/**
 * Focus Trap component that keeps focus within a container when active
 */
const FocusTrap: React.FC<FocusTrapProps> = ({
  active,
  children,
  returnFocusTo = null,
  className = '',
  autoFocus = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(returnFocusTo);

  /**
   * Handles tab key to keep focus within the container
   */
  const handleTabKey = (e: KeyboardEvent) => {
    if (!containerRef.current || !active) return;

    // Find all focusable elements within the container
    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    // If shift+tab is pressed and focus is on first element, move to last element
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } 
    // If tab is pressed and focus is on last element, move to first element
    else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  /**
   * Handle key presses
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      handleTabKey(e);
    }
  };

  /**
   * Focus the first focusable element when activated
   */
  const focusFirstElement = () => {
    if (!containerRef.current || !autoFocus) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      (focusableElements[0] as HTMLElement).focus();
    } else {
      // If no focusable elements, make the container itself focusable
      containerRef.current.tabIndex = -1;
      containerRef.current.focus();
    }
  };

  useEffect(() => {
    // Store the current active element when trap is activated
    if (active && !previouslyFocusedElement.current) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
    }

    // Set up event handlers when active
    if (active) {
      document.addEventListener('keydown', handleKeyDown);
      focusFirstElement();
    }

    // Clean up event handlers when deactivated
    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus to the previously focused element when deactivated
      if (!active && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
        previouslyFocusedElement.current = null;
      }
    };
  }, [active]);

  return (
    <div ref={containerRef} className={className} data-focus-trap={active ? 'active' : 'inactive'}>
      {/* Trap sentinel element for screen reader announcements */}
      {active && (
        <div
          className="sr-only"
          tabIndex={0}
          aria-label="You are now in a modal dialog. To exit this dialog, press the Escape key."
        />
      )}
      {children}
      {/* Final sentinel element for the tab loop */}
      {active && <div className="sr-only" tabIndex={0} aria-hidden="true" />}
    </div>
  );
};

export default FocusTrap;