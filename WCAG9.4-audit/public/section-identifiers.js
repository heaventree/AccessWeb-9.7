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
   * Find all sections in the document
   */
  function findSections() {
    const sections = [];
    
    try {
      // Method 1: Find main content sections first
      const mainSections = document.querySelectorAll('main section, article, [role="main"] > div');
      if (mainSections.length > 0) {
        mainSections.forEach(function(section) {
          if (isValidSection(section)) {
            sections.push({
              element: section,
              type: section.tagName.toLowerCase() === 'article' ? 'article' : 'main'
            });
          }
        });
      }
      
      // Method 2: Find cards and UI components
      const cards = document.querySelectorAll('.card, [class*="card"], [class*="Card"]');
      if (cards.length > 0) {
        cards.forEach(function(card) {
          if (isValidSection(card) && !isSectionChild(card, sections)) {
            sections.push({
              element: card,
              type: 'card'
            });
          }
        });
      }
      
      // Method 3: Find forms
      const forms = document.querySelectorAll('form, [role="form"]');
      if (forms.length > 0) {
        forms.forEach(function(form) {
          if (isValidSection(form) && !isSectionChild(form, sections)) {
            sections.push({
              element: form,
              type: 'form'
            });
          }
        });
      }
      
      // Method 4: Find React components by class naming conventions
      const reactComponents = document.querySelectorAll('[class*="container"], [class*="wrapper"], [class*="Component"]');
      if (reactComponents.length > 0) {
        reactComponents.forEach(function(component) {
          if (isValidSection(component) && 
              !isSectionChild(component, sections) && 
              !sections.some(s => s.element === component)) {
            sections.push({
              element: component,
              type: 'component'
            });
          }
        });
      }
    } catch (error) {
      console.warn('Error finding sections:', error);
    }
    
    return sections;
  }
  
  /**
   * Check if an element is a valid section
   */
  function isValidSection(element) {
    try {
      // Skip elements that are too small
      const rect = element.getBoundingClientRect();
      if (rect.width < 100 || rect.height < 100) {
        return false;
      }
      
      // Skip hidden elements
      if (element.offsetParent === null) {
        return false;
      }
      
      // Skip elements with no meaningful content
      if (element.textContent.trim().length === 0 && element.querySelectorAll('img, svg').length === 0) {
        return false;
      }
      
      // Skip certain types of elements
      const tagName = element.tagName.toLowerCase();
      if (['script', 'style', 'link', 'meta', 'head', 'html', 'body'].includes(tagName)) {
        return false;
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
      
      // Set tooltip info
      identifier.setAttribute('data-info', `${elementTag}${elementId}${elementClass}`);
      
      // Position the identifier correctly based on element position
      const rect = element.getBoundingClientRect();
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