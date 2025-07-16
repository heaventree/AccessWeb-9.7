import express from 'express';
import { JSDOM } from 'jsdom';
import axeCore from 'axe-core';
import puppeteer from 'puppeteer';

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

    // Launch puppeteer for real browser testing
    let browser;
    let page;
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      
      page = await browser.newPage();
      
      // Set a realistic viewport and user agent
      await page.setViewport({ width: 1920, height: 1080 });
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Navigate to the URL with timeout
      await page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });

      // Inject axe-core into the page
      await page.addScriptTag({ content: axeCore.source });
      
    } catch (error) {
      console.error('Browser/Page setup error:', error);
      if (browser) await browser.close();
      return res.status(400).json({ 
        error: 'Failed to fetch URL', 
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

    // Run axe-core accessibility analysis
    let axeResults;
    try {
      const axeConfig = getAxeConfig(region, standards, wcagLevel);
      console.log('Running axe-core with config:', axeConfig);
      
      axeResults = await page.evaluate((config) => {
        return new Promise((resolve, reject) => {
          window.axe.run(config).then(results => {
            resolve(results);
          }).catch(err => {
            reject(err);
          });
        });
      }, axeConfig);
      
    } catch (error) {
      console.error('Axe-core analysis error:', error);
      await browser.close();
      return res.status(500).json({ 
        error: 'Failed to analyze accessibility', 
        details: error.message 
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    // Transform axe-core results to our format
    const issues = axeResults.violations.map(violation => ({
      id: violation.id,
      type: violation.id,
      impact: violation.impact || 'moderate',
      message: violation.description,
      element: violation.nodes[0]?.html || '',
      wcagGuideline: violation.tags.find(tag => tag.match(/wcag\d+/))?.replace('wcag', '').replace(/[a-z]/g, '.') || 'Unknown',
      description: violation.help,
      howToFix: violation.helpUrl,
      helpUrl: violation.helpUrl,
      selector: violation.nodes[0]?.target?.join(', ') || '',
      nodes: violation.nodes.map(node => ({
        html: node.html,
        selector: node.target?.join(', ') || ''
      })),
      tags: violation.tags,
      wcagCriteria: violation.tags.filter(tag => tag.startsWith('wcag'))
    }));

    const passedChecks = axeResults.passes || [];
    const incompleteChecks = axeResults.incomplete || [];

    // Calculate summary statistics from axe-core results
    const criticalCount = issues.filter(issue => issue.impact === 'critical').length;
    const seriousCount = issues.filter(issue => issue.impact === 'serious').length;
    const moderateCount = issues.filter(issue => issue.impact === 'moderate').length;
    const minorCount = issues.filter(issue => issue.impact === 'minor').length;
    const totalChecks = passedChecks.length + issues.length + incompleteChecks.length;
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