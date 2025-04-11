/**
 * Responsive Design Analyzer
 * 
 * This utility analyzes HTML for responsive design patterns and mobile-friendliness
 * to ensure content is accessible on various device sizes as per WCAG requirements.
 */

import type { AccessibilityIssue } from '../types';

interface ViewportSize {
  width: number;
  height: number;
  name: string;
}

interface ResponsiveAnalysisOptions {
  checkMetaViewport: boolean;
  checkMediaQueries: boolean;
  checkTouchTargets: boolean;
  checkFontSizes: boolean;
  checkResponsiveImages: boolean;
}

const defaultOptions: ResponsiveAnalysisOptions = {
  checkMetaViewport: true,
  checkMediaQueries: true,
  checkTouchTargets: true,
  checkFontSizes: true,
  checkResponsiveImages: true
};

// Common device sizes for testing
const viewportSizes: ViewportSize[] = [
  { width: 320, height: 568, name: 'small-mobile' },
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1024, height: 768, name: 'landscape-tablet' },
  { width: 1366, height: 768, name: 'laptop' },
  { width: 1920, height: 1080, name: 'desktop' }
];

/**
 * Analyzes HTML for responsive design and mobile-friendliness issues
 */
export function analyzeResponsiveDesign(
  html: string,
  options: Partial<ResponsiveAnalysisOptions> = {}
): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  // Apply default options
  const opts = { ...defaultOptions, ...options };
  
  try {
    // Parse HTML string to a DOM
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Check viewport meta tag
    if (opts.checkMetaViewport) {
      issues.push(...checkViewportMeta(doc));
    }
    
    // Check font sizes for readability
    if (opts.checkFontSizes) {
      issues.push(...checkFontSizes(doc));
    }
    
    // Check touch target sizes
    if (opts.checkTouchTargets) {
      issues.push(...checkTouchTargets(doc));
    }
    
    // Check responsive images
    if (opts.checkResponsiveImages) {
      issues.push(...checkResponsiveImages(doc));
    }
    
    // Check for media queries in stylesheets
    if (opts.checkMediaQueries) {
      issues.push(...checkMediaQueries(doc));
    }
    
    return issues;
  } catch (error) {
    console.error('Error analyzing responsive design:', error);
    return [{
      id: 'responsive-analysis-error',
      impact: 'moderate',
      description: 'An error occurred while analyzing responsive design patterns.',
      nodes: ['<div>Error analyzing responsive design</div>'],
      wcagCriteria: ['1.4.4', '1.4.10'],
      autoFixable: false
    }];
  }
}

/**
 * Checks if the page has a properly configured viewport meta tag
 */
function checkViewportMeta(doc: Document): AccessibilityIssue[] {
  const viewportMeta = doc.querySelector('meta[name="viewport"]');
  
  if (!viewportMeta) {
    return [{
      id: 'missing-viewport-meta',
      impact: 'serious',
      description: 'The page is missing a viewport meta tag, which is essential for proper mobile rendering.',
      nodes: ['<head>...</head>'],
      wcagCriteria: ['1.4.10'],
      autoFixable: true,
      fixSuggestion: 'Add a viewport meta tag to the <head> section of your HTML.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'meta',
        suggestedStructure: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      }
    }];
  }
  
  const content = viewportMeta.getAttribute('content') || '';
  
  // Check for proper viewport configuration
  if (!content.includes('width=device-width')) {
    return [{
      id: 'improper-viewport-configuration',
      impact: 'moderate',
      description: 'The viewport meta tag is missing "width=device-width", which is needed for responsive design.',
      nodes: [viewportMeta.outerHTML],
      wcagCriteria: ['1.4.10'],
      autoFixable: true,
      fixSuggestion: 'Update the viewport meta tag to include width=device-width.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'meta',
        suggestedStructure: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      }
    }];
  }
  
  // Check for user-scalable=no, which prevents zooming
  if (content.includes('user-scalable=no') || content.includes('maximum-scale=1')) {
    return [{
      id: 'disabled-zoom',
      impact: 'critical',
      description: 'The page prevents zooming, which violates WCAG 1.4.4 (Resize Text) requirements.',
      nodes: [viewportMeta.outerHTML],
      wcagCriteria: ['1.4.4', '1.4.10'],
      autoFixable: true,
      fixSuggestion: 'Remove "user-scalable=no" and ensure maximum-scale is at least 5.0.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'meta',
        suggestedStructure: '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
      }
    }];
  }
  
  return [];
}

/**
 * Checks for adequate touch target sizes (especially for interactive elements)
 */
function checkTouchTargets(doc: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const minimumTouchSize = 44; // 44px is the recommended minimum size
  
  // Find potentially small interactive elements
  const interactiveElements = doc.querySelectorAll('a, button, input, select, textarea, [role="button"]');
  const smallElements: Element[] = [];
  
  interactiveElements.forEach((el) => {
    const styles = window.getComputedStyle(el as Element);
    const width = parseInt(styles.width, 10);
    const height = parseInt(styles.height, 10);
    const padding = parseInt(styles.padding, 10) || 0;
    
    // Check if the element might be too small for touch
    if (
      (width > 0 && width < minimumTouchSize) || 
      (height > 0 && height < minimumTouchSize)
    ) {
      // Exclude elements that are hidden or not displayed
      if (styles.display !== 'none' && styles.visibility !== 'hidden') {
        smallElements.push(el);
      }
    }
  });
  
  if (smallElements.length > 0) {
    issues.push({
      id: 'insufficient-touch-target-size',
      impact: 'moderate',
      description: `Found ${smallElements.length} interactive elements with touch targets smaller than 44×44 pixels.`,
      nodes: smallElements.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['2.5.5'],
      autoFixable: false,
      fixSuggestion: 'Ensure all interactive elements have a touch target size of at least 44×44 pixels.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'touch-target',
        suggestedStructure: `/* CSS example */
.button, a.nav-link {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}`
      }
    });
  }
  
  return issues;
}

/**
 * Checks for responsive image usage
 */
function checkResponsiveImages(doc: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const images = doc.querySelectorAll('img:not([srcset])');
  const largeImages: Element[] = [];
  
  images.forEach((img) => {
    const imgElement = img as HTMLImageElement;
    
    // Check for large images without srcset
    if (imgElement.naturalWidth > 600) {
      const styles = window.getComputedStyle(imgElement);
      // If the image is responsive (has max-width set)
      if (!styles.maxWidth || styles.maxWidth === 'none') {
        largeImages.push(img);
      }
    }
  });
  
  if (largeImages.length > 0) {
    issues.push({
      id: 'non-responsive-images',
      impact: 'moderate',
      description: `Found ${largeImages.length} large images that may not be optimized for mobile devices.`,
      nodes: largeImages.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['1.4.10'],
      autoFixable: false,
      fixSuggestion: 'Use responsive image techniques like srcset or picture element for large images.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'image',
        suggestedStructure: `<img srcset="image-320w.jpg 320w,
                image-480w.jpg 480w,
                image-800w.jpg 800w"
     sizes="(max-width: 320px) 280px,
            (max-width: 480px) 440px,
            800px"
     src="image-800w.jpg" alt="Description of image">`
      }
    });
  }
  
  return issues;
}

/**
 * Checks for adequate font sizes and if text is readable on mobile
 */
function checkFontSizes(doc: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const bodyStyle = window.getComputedStyle(doc.body);
  const bodyFontSize = parseInt(bodyStyle.fontSize, 10);
  
  // Check body font size (should generally be at least 16px for readability)
  if (bodyFontSize < 16) {
    issues.push({
      id: 'small-base-font-size',
      impact: 'moderate',
      description: `The base font size is ${bodyFontSize}px, which may be too small for comfortable reading on mobile devices.`,
      nodes: ['<body style="font-size: ' + bodyFontSize + 'px">...</body>'],
      wcagCriteria: ['1.4.4'],
      autoFixable: false,
      fixSuggestion: 'Increase the base font size to at least 16px for better readability.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'font-size',
        suggestedStructure: `body {
  font-size: 16px;
}

/* Or better, use relative units: */
body {
  font-size: 100%; /* This is typically 16px in most browsers */
}`
      }
    });
  }
  
  // Find text elements with very small font sizes
  const textElements = doc.querySelectorAll('p, span, li, a, h1, h2, h3, h4, h5, h6, div');
  const smallTextElements: Element[] = [];
  
  textElements.forEach((el) => {
    const styles = window.getComputedStyle(el as Element);
    if (styles.fontSize) {
      const size = parseInt(styles.fontSize, 10);
      if (size < 12) { // 12px is generally considered the minimum readable size
        // Exclude elements that are hidden or not displayed
        if (styles.display !== 'none' && styles.visibility !== 'hidden' && styles.opacity !== '0') {
          smallTextElements.push(el);
        }
      }
    }
  });
  
  if (smallTextElements.length > 0) {
    issues.push({
      id: 'too-small-text',
      impact: 'serious',
      description: `Found ${smallTextElements.length} text elements with font sizes smaller than 12px.`,
      nodes: smallTextElements.slice(0, 3).map(el => (el as HTMLElement).outerHTML),
      wcagCriteria: ['1.4.4'],
      autoFixable: false,
      fixSuggestion: 'Increase the font size of small text to at least 12px, preferably 16px for body text.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'font-size',
        suggestedStructure: `/* Use relative units for better scaling */
p, li, span, div {
  font-size: 1rem; /* Equivalent to 16px at browser default */
}

.legal-text, .footnote {
  font-size: 0.875rem; /* Equivalent to 14px at browser default */
}`
      }
    });
  }
  
  return issues;
}

/**
 * Checks for the use of media queries in stylesheets
 */
function checkMediaQueries(doc: Document): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const styleSheets = Array.from(doc.styleSheets);
  let mediaQueriesFound = false;
  
  try {
    // Check for media queries in stylesheets
    for (const sheet of styleSheets) {
      try {
        if (sheet.href && !sheet.href.startsWith(window.location.origin)) {
          // Skip external stylesheets for security reasons
          continue;
        }
        
        const rules = (sheet as CSSStyleSheet).cssRules;
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          if (rule instanceof CSSMediaRule) {
            mediaQueriesFound = true;
            break;
          }
        }
        
        if (mediaQueriesFound) break;
      } catch (e) {
        // Security error, likely from cross-origin stylesheet
        console.warn('Could not access rules in stylesheet', e);
      }
    }
  } catch (e) {
    console.error('Error checking for media queries:', e);
  }
  
  if (!mediaQueriesFound) {
    issues.push({
      id: 'no-media-queries',
      impact: 'moderate',
      description: 'No media queries were detected in the stylesheets, which suggests the page may not be responsive.',
      nodes: ['<style>...</style>'],
      wcagCriteria: ['1.4.10'],
      autoFixable: false,
      fixSuggestion: 'Implement media queries in your CSS to adapt your layout for different viewport sizes.',
      structureType: 'responsive',
      structureDetails: {
        elementType: 'css',
        suggestedStructure: `/* Example media queries */
@media screen and (max-width: 768px) {
  /* Styles for tablets and smaller */
  .container {
    width: 100%;
    padding: 0 20px;
  }
  
  .nav {
    flex-direction: column;
  }
}

@media screen and (max-width: 480px) {
  /* Styles for mobile devices */
  .multi-column {
    display: block;
  }
  
  h1 {
    font-size: 1.8rem;
  }
}`
      }
    });
  }
  
  return issues;
}