/**
 * Utility functions for finding and tracking DOM elements
 */

/**
 * Generates a CSS selector path for a given element
 * @param element The DOM element to generate a path for
 * @returns A CSS selector string that uniquely identifies the element
 */
export function getElementPath(element: HTMLElement): string {
  if (!element) return '';
  
  const path: string[] = [];
  let currentElement: HTMLElement | null = element;
  
  while (currentElement && currentElement !== document.body && currentElement !== document.documentElement) {
    let selector = currentElement.tagName.toLowerCase();
    
    // Add id if available
    if (currentElement.id) {
      selector += `#${currentElement.id}`;
      path.unshift(selector);
      break; // ID should be unique, so we can stop here
    }
    
    // Add classes
    if (currentElement.className && typeof currentElement.className === 'string') {
      const classes = currentElement.className.trim().split(/\s+/).join('.');
      if (classes) {
        selector += `.${classes}`;
      }
    }
    
    // Add position among siblings for more specificity
    const siblings = Array.from(currentElement.parentElement?.children || [])
      .filter(sibling => sibling.tagName === currentElement?.tagName);
    
    if (siblings.length > 1) {
      const index = siblings.indexOf(currentElement);
      selector += `:nth-of-type(${index + 1})`;
    }
    
    path.unshift(selector);
    
    currentElement = currentElement.parentElement;
  }
  
  return path.join(' > ');
}

/**
 * Finds an element in the DOM using a path
 * @param path The CSS selector path to the element
 * @returns The found element or null if not found
 */
export function findElementByPath(path: string): HTMLElement | null {
  if (!path) return null;
  try {
    const element = document.querySelector(path) as HTMLElement;
    return element;
  } catch (error) {
    console.error('Error finding element by path:', error);
    return null;
  }
}

/**
 * Gets the absolute position of an element on the page
 * @param element The DOM element to get position for
 * @returns The x, y coordinates of the element
 */
export function getElementPosition(element: HTMLElement): { x: number; y: number } {
  if (!element) return { x: 0, y: 0 };
  
  const rect = element.getBoundingClientRect();
  
  return {
    x: rect.left + window.scrollX + (rect.width / 2),
    y: rect.top + window.scrollY + (rect.height / 2)
  };
}

/**
 * Determines if an element is visible
 * @param element The DOM element to check visibility for
 * @returns True if the element is visible, false otherwise
 */
export function isElementVisible(element: HTMLElement): boolean {
  if (!element) return false;
  
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return false;
  }
  
  const rect = element.getBoundingClientRect();
  
  // Check if element has size
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }
  
  // Check if element is within viewport
  const isInViewport = 
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth &&
    rect.bottom > 0 &&
    rect.right > 0;
    
  return isInViewport;
}

/**
 * Adds a highlighting outline to an element
 * @param element The DOM element to highlight
 * @param color The highlight color (CSS color string)
 */
export function highlightElement(element: HTMLElement, color: string = 'rgba(255, 0, 0, 0.5)'): void {
  if (!element) return;
  
  const originalOutline = element.style.outline;
  const originalOutlineOffset = element.style.outlineOffset;
  
  element.style.outline = `2px solid ${color}`;
  element.style.outlineOffset = '2px';
  
  // Return a cleanup function
  setTimeout(() => {
    element.style.outline = originalOutline;
    element.style.outlineOffset = originalOutlineOffset;
  }, 3000);
}

/**
 * Creates an overlay element at the position of the target element
 * @param targetElement The element to create an overlay for
 * @param className Optional CSS class for styling
 * @returns The created overlay element
 */
export function createElementOverlay(
  targetElement: HTMLElement, 
  className: string = 'element-overlay'
): HTMLElement {
  if (!targetElement) return document.createElement('div');
  
  const rect = targetElement.getBoundingClientRect();
  const overlay = document.createElement('div');
  
  overlay.className = className;
  overlay.style.position = 'absolute';
  overlay.style.left = `${rect.left + window.scrollX}px`;
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9999';
  
  document.body.appendChild(overlay);
  
  return overlay;
}