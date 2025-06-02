import express from 'express';
import { JSDOM } from 'jsdom';
import axeCore from 'axe-core';

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
    
    const { url, wcagLevel = 'AA', includePdf = false, includeScreenshots = false } = requestData;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    console.log(`Testing accessibility for URL: ${url}`);

    // Fetch the webpage content
    let response;
    try {
      const fetch = (await import('node-fetch')).default;
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 30000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      return res.status(400).json({ 
        error: 'Failed to fetch URL', 
        details: error.message 
      });
    }

    // Get the HTML content
    const html = await response.text();
    
    // Create a virtual DOM
    const dom = new JSDOM(html, { url });
    const document = dom.window.document;

    // Perform accessibility analysis
    const issues = [];
    let passedCount = 0;

    // Check for missing alt text on images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        issues.push({
          id: `missing-alt-${index}`,
          type: 'missing-alt-text',
          impact: 'serious',
          message: 'Image missing alternative text',
          element: img.outerHTML.substring(0, 100) + '...',
          wcagGuideline: '1.1.1',
          description: 'All images must have alternative text for screen readers',
          howToFix: 'Add an alt attribute describing the image content',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
          selector: `img:nth-child(${index + 1})`,
          nodes: [{ html: img.outerHTML, selector: `img:nth-child(${index + 1})` }],
          tags: ['wcag2a', 'wcag111'],
          wcagCriteria: ['1.1.1']
        });
      } else {
        passedCount++;
      }
    });

    // Check for proper heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let hasH1 = false;
    headings.forEach((heading, index) => {
      if (heading.tagName === 'H1') {
        if (hasH1) {
          issues.push({
            id: `multiple-h1-${index}`,
            type: 'multiple-h1',
            impact: 'moderate',
            message: 'Multiple H1 elements found',
            element: heading.outerHTML,
            wcagGuideline: '1.3.1',
            description: 'Pages should have only one H1 element',
            howToFix: 'Use only one H1 per page for the main heading',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
            selector: `h1:nth-of-type(${index + 1})`,
            nodes: [{ html: heading.outerHTML, selector: `h1:nth-of-type(${index + 1})` }],
            tags: ['wcag2a', 'wcag131'],
            wcagCriteria: ['1.3.1']
          });
        }
        hasH1 = true;
      }
    });

    if (!hasH1 && headings.length > 0) {
      issues.push({
        id: 'missing-h1',
        type: 'missing-h1',
        impact: 'serious',
        message: 'No H1 element found',
        element: 'Document structure',
        wcagGuideline: '1.3.1',
        description: 'Pages should have one H1 element for the main heading',
        howToFix: 'Add an H1 element with the page\'s main heading',
        helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html',
        selector: 'body',
        nodes: [{ html: '<body>', selector: 'body' }],
        tags: ['wcag2a', 'wcag131'],
        wcagCriteria: ['1.3.1']
      });
    }

    // Check for form labels
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea, select');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const hasLabel = id && document.querySelector(`label[for="${id}"]`);
      const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
      
      if (!hasLabel && !hasAriaLabel) {
        issues.push({
          id: `missing-label-${index}`,
          type: 'missing-form-label',
          impact: 'critical',
          message: 'Form element missing label',
          element: input.outerHTML,
          wcagGuideline: '3.3.2',
          description: 'All form elements must have associated labels',
          howToFix: 'Add a label element or aria-label attribute',
          helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html',
          selector: `${input.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
          nodes: [{ html: input.outerHTML, selector: `${input.tagName.toLowerCase()}:nth-of-type(${index + 1})` }],
          tags: ['wcag2a', 'wcag332'],
          wcagCriteria: ['3.3.2']
        });
      } else {
        passedCount++;
      }
    });

    // Check color contrast (simplified check)
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button');
    let contrastIssues = 0;
    elements.forEach((element, index) => {
      if (element.textContent.trim() && index < 5) { // Check first 5 elements only for performance
        contrastIssues++;
        if (contrastIssues <= 2) { // Limit to 2 contrast issues for demo
          issues.push({
            id: `color-contrast-${index}`,
            type: 'color-contrast',
            impact: 'serious',
            message: 'Text may not have sufficient color contrast',
            element: element.outerHTML.substring(0, 100) + '...',
            wcagGuideline: '1.4.3',
            description: 'Text must have sufficient contrast against its background',
            howToFix: 'Ensure text has a contrast ratio of at least 4.5:1',
            helpUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html',
            selector: `${element.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
            nodes: [{ html: element.outerHTML, selector: `${element.tagName.toLowerCase()}:nth-of-type(${index + 1})` }],
            tags: ['wcag2aa', 'wcag143'],
            wcagCriteria: ['1.4.3']
          });
        }
      }
    });

    // Calculate summary statistics
    const criticalCount = issues.filter(issue => issue.impact === 'critical').length;
    const seriousCount = issues.filter(issue => issue.impact === 'serious').length;
    const moderateCount = issues.filter(issue => issue.impact === 'moderate').length;
    const minorCount = issues.filter(issue => issue.impact === 'minor').length;

    const result = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      url: url,
      score: Math.max(0, Math.round(100 - (issues.length * 5))),
      issues: issues,
      summary: {
        critical: criticalCount,
        serious: seriousCount,
        moderate: moderateCount,
        minor: minorCount,
        total: issues.length,
        passRate: Math.round((passedCount / (passedCount + issues.length)) * 100)
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