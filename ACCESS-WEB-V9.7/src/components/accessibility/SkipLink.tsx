/**
 * SkipLink Component
 * 
 * Provides a skip navigation link that's only visible when focused.
 * This allows keyboard users to bypass navigation and go straight to main content.
 */

import React from 'react';

interface SkipLinkProps {
  /** The target ID to skip to (without the #) */
  targetId: string;
  /** Link text (defaults to "Skip to main content") */
  children?: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  children = 'Skip to main content',
  className = '',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className={`skip-link ${className}`}
      onClick={(e) => {
        // Ensure the target element gets focus
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.tabIndex = -1;
          target.focus();
          // Remove tabIndex after blur to maintain good semantics
          target.addEventListener('blur', () => {
            target.removeAttribute('tabindex');
          }, { once: true });
        }
      }}
    >
      {children}
    </a>
  );
};

export default SkipLink;