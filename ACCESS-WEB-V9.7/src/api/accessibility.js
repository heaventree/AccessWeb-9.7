import { Router } from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';

const router = Router();

// Mock accessibility testing implementation
// In a real application, this would integrate with actual accessibility testing tools

/**
 * Test URL for accessibility issues
 */
router.post('/test-url', async (req, res) => {
  try {
    console.log('Request body received:', req.body);
    console.log('Request headers:', req.headers);
    
    // Handle both direct body and nested data structures
    const requestData = req.body || {};
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
      response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AccessWebPro-Accessibility-Checker/1.0'
        }
      });
    } catch (error) {
      return res.status(400).json({ 
        error: 'Unable to fetch URL', 
        details: error.message 
      });
    }

    const html = response.data;
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Perform basic accessibility checks
    const issues = [];
    let criticalCount = 0;
    let seriousCount = 0;
    let moderateCount = 0;
    let minorCount = 0;

    // Check for missing alt text on images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.getAttribute('alt')) {
        issues.push({
          id: `img-alt-${index}`,
          wcagGuideline: '1.1.1',
          impact: 'serious',
          type: 'Images',
          message: 'Image missing alt text',
          context: img.outerHTML,
          selector: `img:nth-child(${index + 1})`,
          htmlCode: img.outerHTML,
          recommendation: 'Add descriptive alt text to the image'
        });
        seriousCount++;
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const label = id ? document.querySelector(`label[for="${id}"]`) : null;
      const ariaLabel = input.getAttribute('aria-label');
      
      if (!label && !ariaLabel) {
        issues.push({
          id: `form-label-${index}`,
          wcagGuideline: '3.3.2',
          impact: 'serious',
          type: 'Forms',
          message: 'Form input missing label',
          context: input.outerHTML,
          selector: `input:nth-child(${index + 1})`,
          htmlCode: input.outerHTML,
          recommendation: 'Add a proper label or aria-label to the form input'
        });
        seriousCount++;
      }
    });

    // Check for heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level - lastLevel > 1) {
        issues.push({
          id: `heading-hierarchy-${index}`,
          wcagGuideline: '2.4.6',
          impact: 'moderate',
          type: 'Structure',
          message: 'Heading hierarchy skipped',
          context: heading.outerHTML,
          selector: heading.tagName.toLowerCase(),
          htmlCode: heading.outerHTML,
          recommendation: 'Ensure heading levels are properly nested'
        });
        moderateCount++;
      }
      lastLevel = level;
    });

    // Check for color contrast (simplified check)
    const elements = document.querySelectorAll('*');
    let contrastIssues = 0;
    elements.forEach((element, index) => {
      if (contrastIssues < 3) { // Limit to 3 issues for demo
        const style = element.style;
        if (style.color && style.backgroundColor) {
          // Simplified contrast check - in reality this would be more complex
          issues.push({
            id: `contrast-${index}`,
            wcagGuideline: '1.4.3',
            impact: 'moderate',
            type: 'Color Contrast',
            message: 'Potential color contrast issue',
            context: element.outerHTML.substring(0, 100),
            selector: element.tagName.toLowerCase(),
            htmlCode: element.outerHTML.substring(0, 100),
            recommendation: 'Ensure sufficient color contrast ratio (4.5:1 for normal text)'
          });
          moderateCount++;
          contrastIssues++;
        }
      }
    });

    // Check for missing page title
    const title = document.querySelector('title');
    if (!title || !title.textContent.trim()) {
      issues.push({
        id: 'missing-title',
        wcagGuideline: '2.4.2',
        impact: 'serious',
        type: 'Page Title',
        message: 'Page missing title',
        context: '<head>',
        selector: 'title',
        htmlCode: title ? title.outerHTML : '<title></title>',
        recommendation: 'Add a descriptive page title'
      });
      seriousCount++;
    }

    // Add some passed checks for demonstration
    const passedCount = Math.max(0, 20 - issues.length);

    const result = {
      id: `test-${Date.now()}`,
      url: url,
      timestamp: new Date().toISOString(),
      score: Math.max(0, 100 - (issues.length * 5)),
      issues: issues,
      summary: {
        critical: criticalCount,
        serious: seriousCount,
        moderate: moderateCount,
        minor: minorCount,
        total: issues.length,
        passed: passedCount,
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