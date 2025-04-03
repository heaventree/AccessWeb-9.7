/**
 * Section Identifiers
 * 
 * This script implements a non-breaking section identification system
 * that helps visualize the structure of the website during development.
 */

(function() {
  // Ensure we don't pollute the global namespace
  'use strict';

  // Configuration
  const IDENTIFIERS_ENABLED_KEY = 'sectionIdentifiersEnabled';
  const IDENTIFIERS_COUNTER_KEY = 'sectionIdentifiersCounter';
  const IDENTIFIERS_MAP_KEY = 'sectionIdentifiersMap';
  
  // Global counter for unique identifiers
  let globalCounter = 1;
  
  // Map to store element paths and their assigned IDs
  const elementIdentifierMap = new Map();
  
  // Cache DOM lookups
  let toggleButton = null;
  
  // Try to load the global counter from localStorage
  try {
    const savedCounter = parseInt(localStorage.getItem(IDENTIFIERS_COUNTER_KEY));
    if (!isNaN(savedCounter) && savedCounter > 1) {
      globalCounter = savedCounter;
    }
  } catch (e) {
    console.warn('Error loading saved counter:', e);
  }
  
  // Try to load the element map from localStorage
  try {
    const savedMap = localStorage.getItem(IDENTIFIERS_MAP_KEY);
    if (savedMap) {
      const parsedMap = JSON.parse(savedMap);
      // Convert JSON object back to Map
      Object.entries(parsedMap).forEach(([key, value]) => {
        elementIdentifierMap.set(key, value);
      });
    }
  } catch (e) {
    console.warn('Error loading saved element map:', e);
  }
  
  /**
   * Initialize the section identifiers system
   */
  function initSectionIdentifiers() {
    try {
      // Add the stylesheet to the document
      addStylesheet();
      
      // Create the toggle button if it doesn't exist
      createToggle();
      
      // Setup event delegation for dynamic content changes
      setupMutationObserver();
      
      // Check localStorage for user preference
      const enabled = localStorage.getItem(IDENTIFIERS_ENABLED_KEY) === 'true';
      setEnabled(enabled);
      
      // Initial render
      setTimeout(function() {
        refreshIdentifiers();
      }, 100);
    } catch (error) {
      console.warn('Error initializing section identifiers:', error);
    }
  }
  
  /**
   * Add the section identifiers stylesheet to the document
   */
  function addStylesheet() {
    try {
      // Check if the stylesheet is already added
      if (document.querySelector('link[href*="section-identifiers.css"]')) {
        return;
      }
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/section-identifiers.css';
      link.id = 'section-identifiers-styles';
      document.head.appendChild(link);
    } catch (error) {
      console.warn('Error adding section identifiers stylesheet:', error);
    }
  }
  
  /**
   * Create the toggle button
   */
  function createToggle() {
    try {
      // Remove existing toggle if any
      const existingToggle = document.querySelector('.section-identifiers-toggle');
      if (existingToggle) {
        existingToggle.remove();
      }
      
      // Create new toggle
      const toggle = document.createElement('div');
      toggle.className = 'section-identifiers-toggle';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = 'section-identifiers-toggle-input';
      checkbox.checked = localStorage.getItem(IDENTIFIERS_ENABLED_KEY) === 'true';
      
      const label = document.createElement('label');
      label.htmlFor = 'section-identifiers-toggle-input';
      label.textContent = 'Section Identifiers';
      
      toggle.appendChild(checkbox);
      toggle.appendChild(label);
      
      // Add event listener
      checkbox.addEventListener('change', function(event) {
        // Prevent event bubbling
        event.stopPropagation();
        
        setEnabled(this.checked);
      });
      
      document.body.appendChild(toggle);
      toggleButton = checkbox;
    } catch (error) {
      console.warn('Error creating section identifiers toggle:', error);
    }
  }
  
  /**
   * Enable or disable section identifiers
   */
  function setEnabled(enabled) {
    try {
      // Update body class
      if (enabled) {
        document.body.classList.add('section-identifiers-enabled');
      } else {
        document.body.classList.remove('section-identifiers-enabled');
      }
      
      // Update localStorage
      localStorage.setItem(IDENTIFIERS_ENABLED_KEY, enabled ? 'true' : 'false');
      
      // Update toggle if it exists
      if (toggleButton) {
        toggleButton.checked = enabled;
      }
      
      // Refresh identifiers
      refreshIdentifiers();
    } catch (error) {
      console.warn('Error setting section identifiers state:', error);
    }
  }
  
  /**
   * Set up mutation observer to watch for DOM changes
   */
  function setupMutationObserver() {
    try {
      // Create an observer instance
      const observer = new MutationObserver(function(mutations) {
        // Only refresh if the feature is enabled
        if (document.body.classList.contains('section-identifiers-enabled')) {
          // Debounce the refresh to avoid too many updates
          if (window._sectionIdentifiersTimeout) {
            clearTimeout(window._sectionIdentifiersTimeout);
          }
          
          window._sectionIdentifiersTimeout = setTimeout(function() {
            refreshIdentifiers();
            window._sectionIdentifiersTimeout = null;
          }, 200);
        }
      });
      
      // Configure and start the observer
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });
    } catch (error) {
      console.warn('Error setting up mutation observer:', error);
    }
  }
  
  /**
   * Generate a unique element path to identify elements across page loads
   * @param {Element} element - The DOM element
   * @returns {string} A unique path for the element
   */
  function generateElementPath(element) {
    try {
      // Get element path components
      const tagName = element.tagName.toLowerCase();
      const id = element.id ? `#${element.id}` : '';
      const classes = Array.from(element.classList).map(c => `.${c}`).join('');
      
      // Try to get text content hash for additional uniqueness
      let contentHash = '';
      if (element.textContent) {
        const text = element.textContent.trim();
        if (text.length > 0) {
          // Simple hashing function for text content
          let hash = 0;
          for (let i = 0; i < Math.min(text.length, 50); i++) {
            hash = ((hash << 5) - hash) + text.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
          }
          contentHash = `::${Math.abs(hash)}`;
        }
      }
      
      // Calculate position in parent if no ID
      let positionInfo = '';
      if (!id && element.parentElement) {
        const siblings = Array.from(element.parentElement.children)
          .filter(el => el.tagName === element.tagName);
        const position = siblings.indexOf(element);
        if (position !== -1) {
          positionInfo = `:nth-of-type(${position + 1})`;
        }
      }
      
      // Generate a unique path
      const path = `${tagName}${id}${classes}${positionInfo}${contentHash}`;
      
      return path;
    } catch (e) {
      console.warn('Error generating element path:', e);
      // Fallback to random ID
      return `element-${Math.floor(Math.random() * 1000000)}`;
    }
  }
  
  /**
   * Refresh all section identifiers
   */
  function refreshIdentifiers() {
    try {
      // Skip if the feature is disabled
      if (!document.body.classList.contains('section-identifiers-enabled')) {
        return;
      }
      
      // Clean up existing identifiers
      const existingIdentifiers = document.querySelectorAll('.section-identifier');
      existingIdentifiers.forEach(function(identifier) {
        identifier.remove();
      });
      
      // Find sections without modifying them
      const sections = findSections();
      
      // Create new identifiers with globally unique IDs
      sections.forEach(function(section) {
        const element = section.element;
        const elementPath = generateElementPath(element);
        
        // Check if this element already has a stable ID assigned
        let sectionId;
        if (elementIdentifierMap.has(elementPath)) {
          sectionId = elementIdentifierMap.get(elementPath);
        } else {
          // Assign new ID from the global counter
          sectionId = globalCounter++;
          elementIdentifierMap.set(elementPath, sectionId);
          
          // Save the updated counter to localStorage
          localStorage.setItem(IDENTIFIERS_COUNTER_KEY, globalCounter.toString());
          
          // Save the updated map to localStorage (convert Map to object first)
          try {
            const mapObject = Object.fromEntries(elementIdentifierMap.entries());
            localStorage.setItem(IDENTIFIERS_MAP_KEY, JSON.stringify(mapObject));
          } catch (e) {
            console.warn('Error saving element map:', e);
          }
        }
        
        createIdentifier(section, sectionId);
      });
    } catch (error) {
      console.warn('Error refreshing section identifiers:', error);
    }
  }
  
  /**
   * Find all sections in the document with a more granular approach
   */
  function findSections() {
    const sections = [];
    
    try {
      // Helper to add section if valid
      const addToSections = function(element, type, sections) {
        if (isValidSection(element) && !sections.some(s => s.element === element)) {
          sections.push({
            element: element,
            type: type
          });
        }
      };
      
      // ----------------
      // Color Palette Generator Page - Specific Sections
      // ----------------
      
      // Find palette generator sections
      const generatorSections = document.querySelectorAll('.palette-generator, [id*="palette"], [class*="palette"]');
      generatorSections.forEach(section => {
        addToSections(section, 'generator', sections);
      });
      
      // Find all headings with content as sections
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach(heading => {
        // Find the parent container of this heading
        let parentSection = heading.parentElement;
        if (parentSection && parentSection !== document.body) {
          addToSections(parentSection, 'section', sections);
        }
      });
      
      // Look for specific WCAG related sections
      const wcagSections = document.querySelectorAll('[class*="wcag"], [id*="wcag"], [class*="WCAG"], [id*="WCAG"]');
      wcagSections.forEach(section => {
        addToSections(section, 'wcag', sections);
      });
      
      // ----------------
      // Generic UI Components
      // ----------------
      
      // Method 1: Find main content sections first
      const mainSections = document.querySelectorAll('main, section, article, [role="main"] > div');
      mainSections.forEach(section => {
        addToSections(section, 'main', sections);
        
        // Look for direct children that are substantial sections
        Array.from(section.children).forEach(child => {
          // Only consider fairly substantial elements
          if (child.offsetHeight > 50 && child.offsetWidth > 50) {
            addToSections(child, 'sub-section', sections);
          }
        });
      });
      
      // Method 2: Find UI components by common class patterns
      [
        // UI Components
        '.card, [class*="card"], [class*="Card"]',
        '.panel, [class*="panel"], [class*="Panel"]',
        '.box, [class*="box"], [class*="Box"]',
        // Forms
        'form, [role="form"]',
        // Layout components
        '.container, [class*="container"], [class*="Container"]',
        '.wrapper, [class*="wrapper"], [class*="Wrapper"]',
        '.layout, [class*="layout"], [class*="Layout"]',
        // Interactive components
        '[class*="generator"], [id*="generator"]',
        '[class*="form-group"], [class*="form-section"]',
        // Results displays
        '[class*="results"], [id*="results"]',
        '[class*="output"], [id*="output"]',
        '.color-display, [class*="color-display"]'
      ].forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Avoid adding children of already added sections
          if (!isSectionChild(element, sections)) {
            // Get selector type for classification
            const type = selector.includes('card') ? 'card' 
                        : selector.includes('form') ? 'form'
                        : selector.includes('container') || selector.includes('wrapper') ? 'container'
                        : selector.includes('generator') ? 'generator'
                        : selector.includes('results') || selector.includes('output') ? 'results'
                        : 'component';
            
            addToSections(element, type, sections);
          }
        });
      });

      // Look specifically for color palette output areas
      const colorOutputs = document.querySelectorAll('[class*="color-combination"], [class*="color-palette"], [class*="palette-output"]');
      colorOutputs.forEach(output => {
        addToSections(output, 'palette-output', sections);
      });
      
      // Find buttons groups - they're often important controls
      const buttonGroups = document.querySelectorAll('.btn-group, [class*="button-group"], [role="toolbar"]');
      buttonGroups.forEach(group => {
        addToSections(group, 'controls', sections);
      });
      
      // Special case: look for grid sections which are often results displays
      const gridSections = document.querySelectorAll('[class*="grid"]');
      gridSections.forEach(grid => {
        // Avoid tiny grids
        if (grid.offsetHeight > 100 && grid.offsetWidth > 100) {
          addToSections(grid, 'grid', sections);
        }
      });
      
      // Get React component containers
      const reactComponents = document.querySelectorAll('[class*="Component"], [class*="component"]');
      reactComponents.forEach(component => {
        if (!isSectionChild(component, sections)) {
          addToSections(component, 'react-component', sections);
        }
      });
      
    } catch (error) {
      console.warn('Error finding sections:', error);
    }
    
    return sections;
  }
  
  /**
   * Check if an element is a valid section - with more granular requirements
   */
  function isValidSection(element) {
    try {
      // Get element dimensions
      const rect = element.getBoundingClientRect();
      
      // Skip extremely small elements (allowing more granular sections)
      // Relaxed from 100x100 to 50x50 to catch smaller UI elements
      if (rect.width < 50 || rect.height < 50) {
        return false;
      }
      
      // Skip hidden elements
      if (element.offsetParent === null) {
        return false;
      }
      
      // Skip elements with no meaningful content, but allow UI controls
      const hasUIControl = element.querySelector('button, input, select, textarea');
      const hasImage = element.querySelectorAll('img, svg').length > 0;
      const hasText = element.textContent.trim().length > 0;
      
      if (!hasText && !hasImage && !hasUIControl) {
        return false;
      }
      
      // Skip certain types of elements that are never sections
      const tagName = element.tagName.toLowerCase();
      if (['script', 'style', 'link', 'meta', 'head', 'html', 'body', 'br', 'hr'].includes(tagName)) {
        return false;
      }
      
      // Skip very simple inline elements
      if (['span', 'a', 'label', 'strong', 'em', 'i', 'b', 'u'].includes(tagName)) {
        // Unless they have specific classes that indicate they're components
        const classes = Array.from(element.classList);
        const isComponent = classes.some(cls => 
          cls.includes('component') || 
          cls.includes('container') || 
          cls.includes('card') || 
          cls.includes('button') || 
          cls.includes('control'));
          
        if (!isComponent) {
          return false;
        }
      }
      
      // Special case: identify palette generation regions
      if (element.className && typeof element.className === 'string') {
        if (element.className.includes('palette') || 
            element.className.includes('color-') || 
            element.className.includes('generator') ||
            element.id && element.id.includes('palette')) {
          // For palette-related elements, be more lenient with size
          return true;
        }
      }
      
      // Include all elements with IDs as they're likely important
      if (element.id && element.id.trim() !== '') {
        return true;
      }
      
      return true;
    } catch (error) {
      console.warn('Error checking if element is valid section:', error);
      return false;
    }
  }
  
  /**
   * Check if an element is a child of an existing section
   */
  function isSectionChild(element, sections) {
    try {
      return sections.some(function(section) {
        return section.element.contains(element) && section.element !== element;
      });
    } catch (error) {
      console.warn('Error checking if element is section child:', error);
      return false;
    }
  }
  
  /**
   * Create an identifier for a section
   */
  function createIdentifier(section, index) {
    try {
      const element = section.element;
      const type = section.type;
      
      // Create the identifier element
      const identifier = document.createElement('div');
      identifier.className = 'section-identifier';
      identifier.textContent = index;
      identifier.setAttribute('data-section-type', type);
      identifier.setAttribute('data-global-id', index); // Add global ID attribute
      
      // Add additional information
      const elementId = element.id ? '#' + element.id : '';
      const elementClass = Array.from(element.classList).map(c => '.' + c).join('');
      const elementTag = element.tagName.toLowerCase();
      
      // Get element dimensions for tooltip
      const rect = element.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      
      // Get element content summary
      let contentSummary = '';
      if (element.textContent) {
        const text = element.textContent.trim();
        if (text.length > 0) {
          // Get first 30 chars of content as a preview
          contentSummary = text.length > 30 ? 
            text.substring(0, 30) + '...' : 
            text;
        }
      }
      
      // Get heading content if present
      const headingElement = element.querySelector('h1, h2, h3, h4, h5, h6');
      const headingText = headingElement ? headingElement.textContent.trim() : '';
      
      // Count child elements
      const childCount = element.children.length;
      
      // Get any ARIA attributes
      const ariaAttributes = [];
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        if (attr.name.startsWith('aria-') || attr.name === 'role') {
          ariaAttributes.push(`${attr.name}="${attr.value}"`);
        }
      }
      
      // Check for interactive elements
      const hasButtons = element.querySelectorAll('button').length > 0;
      const hasInputs = element.querySelectorAll('input, select, textarea').length > 0;
      const hasLinks = element.querySelectorAll('a').length > 0;
      
      const interactiveInfo = [
        hasButtons ? `Contains ${element.querySelectorAll('button').length} button(s)` : '',
        hasInputs ? `Contains ${element.querySelectorAll('input, select, textarea').length} form field(s)` : '',
        hasLinks ? `Contains ${element.querySelectorAll('a').length} link(s)` : ''
      ].filter(Boolean);
      
      // Generate a unique selector for this element (for developer reference)
      const elementPath = generateElementPath(element);
      const shortPath = elementPath.length > 80 ? elementPath.substring(0, 80) + '...' : elementPath;
      
      // Build enhanced tooltip info
      const tooltipInfo = [
        `ID: ${index} (${type})`,
        `Element: ${elementTag}${elementId}${elementClass}`,
        `Size: ${width}×${height}px`,
        childCount > 0 ? `Children: ${childCount} element(s)` : '',
        ariaAttributes.length > 0 ? `ARIA: ${ariaAttributes.join(', ')}` : '',
        interactiveInfo.length > 0 ? `Interactive: ${interactiveInfo.join(', ')}` : '',
        headingText ? `Heading: ${headingText}` : '',
        contentSummary ? `Content: "${contentSummary}"` : '',
        `Path: ${shortPath}`
      ].filter(Boolean).join('\n');
      
      // Set tooltip info
      identifier.setAttribute('data-info', tooltipInfo);
      
      // Set bright pink color for high visibility
      identifier.style.backgroundColor = '#FF1493'; // Deep Pink
      identifier.style.color = 'white';
      identifier.style.fontWeight = 'bold';
      
      // Position the identifier correctly based on element position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      identifier.style.top = rect.top + scrollTop + 'px';
      identifier.style.left = rect.left + scrollLeft + 'px';
      
      // Append to document body (not to the element itself)
      document.body.appendChild(identifier);
    } catch (error) {
      console.warn('Error creating identifier:', error);
    }
  }
  
  // Initialize when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSectionIdentifiers);
  } else {
    // If the page is already loaded, run initialization now
    initSectionIdentifiers();
  }
  
  // Handle dynamic page navigation in SPAs
  window.addEventListener('popstate', refreshIdentifiers);
  
  // Re-detect sections on window resize
  let resizeTimeout;
  window.addEventListener('resize', function() {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
    }
    
    resizeTimeout = setTimeout(function() {
      if (document.body.classList.contains('section-identifiers-enabled')) {
        refreshIdentifiers();
      }
    }, 250);
  });
  
  /**
   * Reset all section identifiers to start fresh
   */
  function resetIdentifiers() {
    try {
      // Reset global counter
      globalCounter = 1;
      
      // Clear the element map
      elementIdentifierMap.clear();
      
      // Clear localStorage
      localStorage.removeItem(IDENTIFIERS_COUNTER_KEY);
      localStorage.removeItem(IDENTIFIERS_MAP_KEY);
      
      // Refresh identifiers
      refreshIdentifiers();
      
      console.info('Section identifiers have been reset');
    } catch (error) {
      console.warn('Error resetting section identifiers:', error);
    }
  }
  
  // Export API for debugging purpose only (not for application use)
  window._devSectionIdentifiers = {
    refresh: refreshIdentifiers,
    enable: function() { setEnabled(true); },
    disable: function() { setEnabled(false); },
    toggle: function() { setEnabled(!document.body.classList.contains('section-identifiers-enabled')); },
    reset: resetIdentifiers
  };
})();