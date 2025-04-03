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
  
  // Cache DOM lookups
  let toggleButton = null;
  
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
      
      // Create new identifiers
      sections.forEach(function(section, index) {
        createIdentifier(section, index + 1);
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
      
      // Build enhanced tooltip info
      const tooltipInfo = [
        `Type: ${type}`,
        `Element: ${elementTag}${elementId}${elementClass}`,
        `Size: ${width}×${height}px`,
        headingText ? `Heading: ${headingText}` : '',
        contentSummary ? `Content: "${contentSummary}"` : ''
      ].filter(Boolean).join('\n');
      
      // Set tooltip info
      identifier.setAttribute('data-info', tooltipInfo);
      
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
  
  // Export API for debugging purpose only (not for application use)
  window._devSectionIdentifiers = {
    refresh: refreshIdentifiers,
    enable: function() { setEnabled(true); },
    disable: function() { setEnabled(false); },
    toggle: function() { setEnabled(!document.body.classList.contains('section-identifiers-enabled')); }
  };
})();