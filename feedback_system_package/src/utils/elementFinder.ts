/**
 * Utility functions for finding and interacting with DOM elements
 */

import { Position } from '../types/feedback';

/**
 * Generate a simple path/selector for an element
 * This creates a selector that can be used to find the element again later
 */
export function getElementPath(element: HTMLElement): string {
  if (!element) return '';
  if (element === document.body) return 'body';
  
  let selector = element.tagName.toLowerCase();
  
  // Add id if available
  if (element.id) {
    selector += `#${element.id}`;
    return selector;
  }
  
  // Add classes if available
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.split(/\\s+/).filter(c => c);
    if (classes.length) {
      selector += `.${classes.join('.')}`;
    }
  }
  
  // Add basic path info
  const parentElement = element.parentElement;
  if (parentElement && parentElement !== document.body) {
    return `${getElementPath(parentElement)} > ${selector}`;
  }
  
  return selector;
}

/**
 * Find an element by its path
 * Attempts to find the exact element, or the closest match if the exact one isn't found
 */
export function findElementByPath(path: string, originalPosition: Position): HTMLElement | null {
  try {
    // Try to simplify the selector to improve chances of finding it
    const simplifiedSelector = path
      .split('>')
      .pop()
      ?.trim() || '';
      
    if (simplifiedSelector) {
      // Try to find the element using the selector
      const possibleElements = document.querySelectorAll(simplifiedSelector);
      
      if (possibleElements.length === 1) {
        return possibleElements[0] as HTMLElement;
      } else if (possibleElements.length > 1) {
        // If multiple elements match, find the one closest to the original click position
        const originalX = originalPosition.x;
        const originalY = originalPosition.y;
        
        let closestElement = null;
        let closestDistance = Infinity;
        
        possibleElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2 + window.scrollX;
          const centerY = rect.top + rect.height / 2 + window.scrollY;
          
          const distance = Math.sqrt(
            Math.pow(centerX - originalX, 2) + 
            Math.pow(centerY - originalY, 2)
          );
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestElement = el;
          }
        });
        
        if (closestElement) {
          return closestElement as HTMLElement;
        }
      }
    }
    
    // Fallback: try the full path
    try {
      const element = document.querySelector(path) as HTMLElement;
      if (element) return element;
    } catch (error) {
      // Selector might be invalid, ignore
    }
    
    return null;
  } catch (error) {
    console.error('Error finding element by path:', error);
    return null;
  }
}

/**
 * Update the position of an element marker based on the target element
 */
export function updateMarkerPosition(
  markerElement: HTMLElement, 
  targetElement: HTMLElement
): void {
  if (!markerElement || !targetElement) return;
  
  const rect = targetElement.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  
  // Position at the top-right corner of the element
  markerElement.style.position = 'absolute';
  markerElement.style.left = `${rect.right + scrollX}px`;
  markerElement.style.top = `${rect.top + scrollY}px`;
}