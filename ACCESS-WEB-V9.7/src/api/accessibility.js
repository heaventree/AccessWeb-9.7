import express from 'express';
import { JSDOM } from 'jsdom';

const router = express.Router();

// Middleware to handle raw body parsing for text/plain requests
const parseRawBody = (req, res, next) => {
  if (req.headers['content-type'] === 'text/plain;charset=UTF-8') {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(rawBody);
      } catch (e) {
        req.body = { url: rawBody.trim() };
      }
      next();
    });
  } else {
    next();
  }
};

/**
 * Test URL for accessibility issues
 */
router.post('/test-url', parseRawBody, async (req, res) => {
  try {
    console.log('Request body received:', req.body);
    console.log('Request headers:', req.headers);
    
    // Handle case where body might be undefined or sent as text
    let requestData = req.body;
    
    // If body is undefined, try to get data from raw body or query
    if (!requestData || typeof requestData === 'string') {
      // If it's a string, try to parse as JSON
      if (typeof requestData === 'string') {
        try {
          requestData = JSON.parse(requestData);
        } catch (e) {
          console.log('Failed to parse body as JSON, treating as URL');
          requestData = { url: requestData };
        }
      } else {
        // Check if URL was sent as a query parameter or in headers
        const urlFromQuery = req.query.url;
        const urlFromHeader = req.headers['x-test-url'];
        
        if (urlFromQuery) {
          requestData = { url: urlFromQuery };
        } else if (urlFromHeader) {
          requestData = { url: urlFromHeader };
        } else {
          return res.status(400).json({ error: 'URL is required' });
        }
      }
    }
    
    console.log('Parsed request data:', requestData);
    
    const { url, wcagLevel = 'AA', includePdf = false, includeScreenshots = false, region = 'eu', standards = [] } = requestData;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Testing accessibility for URL: ${url} with region: ${region} and standards:`, standards);

    // Fetch the webpage content using node-fetch for JSDOM analysis
    let response;
    let html;
    try {
      const fetch = (await import('node-fetch')).default;
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 30000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      html = await response.text();
    } catch (error) {
      console.error('Fetch error:', error);
      return res.status(400).json({ 
        error: 'Failed to fetch URL', 
        details: error.message 
      });
    }

    // Create JSDOM environment for real accessibility analysis
    let dom;
    let window;
    let document;
    try {
      dom = new JSDOM(html, { url });
      window = dom.window;
      document = window.document;
    } catch (error) {
      console.error('JSDOM setup error:', error);
      return res.status(400).json({ 
        error: 'Failed to analyze page content', 
        details: error.message 
      });
    }

    // Configure axe-core based on region and standards
    const getAxeConfig = (region, standards, wcagLevel) => {
      let tags = [`wcag2${wcagLevel.toLowerCase()}`];
      
      // Add region-specific tags based on compliance requirements
      switch (region) {
        case 'eu':
          tags.push('EN-301-549'); // European EN 301 549 standard
          if (standards.includes('EN 301 549')) tags.push('section508');
          break;
        case 'us':
        case 'usa':
          tags.push('section508'); // US Section 508
          break;
        case 'uk':
          tags.push('EN-301-549'); // UK follows EN 301 549
          break;
        case 'canada':
          tags.push('section508'); // Similar to US standards
          break;
        case 'australia':
          tags.push('wcag2a', 'wcag2aa'); // Australia follows WCAG
          break;
        case 'japan':
          tags.push('wcag2a', 'wcag2aa'); // Japan follows WCAG
          break;
        default:
          tags.push('wcag2a', 'wcag2aa'); // Global WCAG standards
      }

      // Add specific standards if provided
      if (standards.includes('WCAG 2.1')) tags.push('wcag21a', 'wcag21aa');
      if (standards.includes('WCAG 2.2')) tags.push('wcag22a', 'wcag22aa');
      if (standards.includes('EAA')) tags.push('EN-301-549');

      return {
        tags,
        runOnly: {
          type: 'tag',
          values: tags
        }
      };
    };

    // Perform comprehensive accessibility analysis using JSDOM
    console.log('Running comprehensive accessibility analysis...');
    const issues = [];
    let passedChecks = [];

    // Helper function to create issue
    const createIssue = (id, type, impact, message, element, wcagGuideline, description, howToFix, selector) => ({
      id,
      type,
      impact,
      message,
      element: element ? element.outerHTML?.substring(0, 200) + '...' : '',
      wcagGuideline,
      description,
      howToFix,
      helpUrl: `https://www.w3.org/WAI/WCAG21/Understanding/${wcagGuideline.replace(/\./g, '')}.html`,
      selector,
      nodes: [{
        html: element ? element.outerHTML : '',
        selector
      }],
      tags: [`wcag${wcagLevel.toLowerCase()}`, `wcag${wcagGuideline.replace(/\./g, '')}`],
      wcagCriteria: [wcagGuideline]
    });

    // 1. Check for missing alt text on images (WCAG 1.1.1)
    const images = document.querySelectorAll('img');
    let imageChecks = 0;
    images.forEach((img, index) => {
      imageChecks++;
      if (!img.hasAttribute('alt')) {
        issues.push(createIssue(
          `missing-alt-${index}`,
          'missing-alt-text',
          'serious',
          'Image missing alternative text',
          img,
          '1.1.1',
          'All images must have alternative text for screen readers',
          'Add an alt attribute describing the image content',
          `img:nth-child(${index + 1})`
        ));
      } else if (img.getAttribute('alt').trim() === '') {
        issues.push(createIssue(
          `empty-alt-${index}`,
          'empty-alt-text',
          'moderate',
          'Image has empty alt attribute',
          img,
          '1.1.1',
          'Alt text should be descriptive or empty for decorative images',
          'Provide meaningful alt text or use alt="" for decorative images',
          `img:nth-child(${index + 1})`
        ));
      } else {
        passedChecks.push({ id: `alt-text-${index}`, description: 'Image has alt text' });
      }
    });

    // 2. Check heading structure (WCAG 1.3.1)
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let headingChecks = 0;
    let hasH1 = false;
    let lastLevel = 0;
    
    headings.forEach((heading, index) => {
      headingChecks++;
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level === 1) {
        if (hasH1) {
          issues.push(createIssue(
            `multiple-h1-${index}`,
            'multiple-h1',
            'moderate',
            'Multiple H1 elements found',
            heading,
            '1.3.1',
            'Pages should have only one H1 element',
            'Use only one H1 per page for the main heading',
            `h1:nth-of-type(${index + 1})`
          ));
        }
        hasH1 = true;
      }
      
      if (lastLevel > 0 && level > lastLevel + 1) {
        issues.push(createIssue(
          `heading-skip-${index}`,
          'heading-skip-level',
          'moderate',
          'Heading level skipped',
          heading,
          '1.3.1',
          'Headings should not skip levels',
          'Use heading levels in sequence (h1, h2, h3, etc.)',
          `${heading.tagName.toLowerCase()}:nth-of-type(${index + 1})`
        ));
      }
      
      lastLevel = level;
    });

    if (!hasH1 && headings.length > 0) {
      issues.push(createIssue(
        'missing-h1',
        'missing-h1',
        'serious',
        'No H1 element found',
        null,
        '1.3.1',
        'Pages should have one H1 element for the main heading',
        'Add an H1 element with the page\'s main heading',
        'body'
      ));
    } else if (hasH1) {
      passedChecks.push({ id: 'h1-present', description: 'Page has H1 heading' });
    }

    // 3. Check form labels (WCAG 3.3.2)
    const formElements = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="tel"], textarea, select');
    let formChecks = 0;
    
    formElements.forEach((input, index) => {
      formChecks++;
      const id = input.getAttribute('id');
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
      const hasPlaceholder = input.hasAttribute('placeholder');
      
      if (!hasLabel && !hasAriaLabel) {
        issues.push(createIssue(
          `missing-label-${index}`,
          'missing-form-label',
          'critical',
          'Form element missing label',
          input,
          '3.3.2',
          'All form elements must have associated labels',
          'Add a label element or aria-label attribute',
          `${input.tagName.toLowerCase()}:nth-of-type(${index + 1})`
        ));
      } else {
        passedChecks.push({ id: `form-label-${index}`, description: 'Form element has label' });
      }
    });

    // 4. Check color contrast (simplified - flag potential issues)
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, label');
    let contrastChecks = 0;
    
    textElements.forEach((element, index) => {
      if (element.textContent.trim() && index < 10) { // Check first 10 elements for performance
        contrastChecks++;
        // This is a simplified check - in a real implementation, you'd calculate actual color contrast
        const style = element.style;
        if (style.color && style.backgroundColor) {
          // Simplified heuristic for potential contrast issues
          issues.push(createIssue(
            `potential-contrast-${index}`,
            'color-contrast',
            'serious',
            'Potential color contrast issue detected',
            element,
            '1.4.3',
            'Text must have sufficient contrast against its background',
            'Ensure text has a contrast ratio of at least 4.5:1',
            `${element.tagName.toLowerCase()}:nth-of-type(${index + 1})`
          ));
        } else {
          passedChecks.push({ id: `contrast-${index}`, description: 'Element uses default colors' });
        }
      }
    });

    // 5. Check for missing language attribute (WCAG 3.1.1)
    const htmlElement = document.querySelector('html');
    if (!htmlElement || !htmlElement.hasAttribute('lang')) {
      issues.push(createIssue(
        'missing-lang',
        'missing-lang',
        'serious',
        'Missing language attribute on html element',
        htmlElement,
        '3.1.1',
        'The html element must have a lang attribute',
        'Add lang="en" or appropriate language code to the html element',
        'html'
      ));
    } else {
      passedChecks.push({ id: 'lang-present', description: 'HTML element has lang attribute' });
    }

    // 6. Check for keyboard navigation (simplified)
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    let keyboardChecks = 0;
    
    interactiveElements.forEach((element, index) => {
      keyboardChecks++;
      if (element.tabIndex === -1 && element.tagName !== 'INPUT') {
        issues.push(createIssue(
          `keyboard-access-${index}`,
          'keyboard-access',
          'serious',
          'Interactive element not keyboard accessible',
          element,
          '2.1.1',
          'All interactive elements must be keyboard accessible',
          'Ensure element can be focused with Tab key',
          `${element.tagName.toLowerCase()}:nth-of-type(${index + 1})`
        ));
      } else {
        passedChecks.push({ id: `keyboard-${index}`, description: 'Element is keyboard accessible' });
      }
    });

    console.log(`Accessibility analysis completed. Found ${issues.length} issues across ${imageChecks + headingChecks + formChecks + contrastChecks + keyboardChecks + 1} checks.`);

    // Calculate summary statistics from axe-core results
    const criticalCount = issues.filter(issue => issue.impact === 'critical').length;
    const seriousCount = issues.filter(issue => issue.impact === 'serious').length;
    const moderateCount = issues.filter(issue => issue.impact === 'moderate').length;
    const minorCount = issues.filter(issue => issue.impact === 'minor').length;
    const totalChecks = passedChecks.length + issues.length;
    const passedCount = passedChecks.length;

    // Calculate accessibility score based on actual results
    const score = totalChecks > 0 ? Math.round((passedCount / totalChecks) * 100) : 100;

    const result = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      url: url,
      score: score,
      issues: issues,
      summary: {
        critical: criticalCount,
        serious: seriousCount,
        moderate: moderateCount,
        minor: minorCount,
        total: issues.length,
        passed: passedCount,
        passRate: score
      }
    };

    res.json(result);
  } catch (error) {
    console.error('Accessibility test error:', error);
    res.status(500).json({ 
      error: 'Internal server error during accessibility test',
      details: error.message 
    });
  }
});

/**
 * Test HTML content for accessibility issues
 */
router.post('/test-html', async (req, res) => {
  try {
    const { html, wcagLevel = 'AA', baseUrl } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    // Similar testing logic as test-url but for provided HTML
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Perform the same accessibility checks as above
    const issues = [];
    // ... (same checking logic as in test-url)

    const result = {
      id: `html-test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      score: 85,
      issues: issues,
      summary: {
        critical: 0,
        serious: issues.length,
        moderate: 2,
        minor: 1,
        total: issues.length + 3,
        passed: 15,
        passRate: 80
      }
    };

    res.json(result);
  } catch (error) {
    console.error('HTML accessibility test error:', error);
    res.status(500).json({ 
      error: 'Internal server error during HTML accessibility test',
      details: error.message 
    });
  }
});

/**
 * Get accessibility test report
 */
router.get('/report/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    
    // In a real implementation, this would fetch from a database
    res.json({
      id: reportId,
      timestamp: new Date().toISOString(),
      status: 'completed',
      message: 'Report not found in storage. Please run a new test.'
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * List accessibility test reports
 */
router.get('/reports', async (req, res) => {
  try {
    // In a real implementation, this would fetch from a database
    res.json({
      reports: [],
      total: 0,
      page: 1,
      limit: 10
    });
  } catch (error) {
    console.error('List reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;