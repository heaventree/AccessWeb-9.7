import express from 'express';
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
 * Configure axe-core based on region and compliance standards
 */
const getAxeConfig = (region, standards, wcagLevel) => {
  let tags = [`wcag2${wcagLevel.toLowerCase()}`];
  
  // Add region-specific tags based on compliance requirements
  switch (region) {
    case 'eu':
      tags.push('wcag2a', 'wcag2aa'); // European EN 301 549 standard maps to WCAG
      if (standards.includes('EN 301 549')) tags.push('section508');
      break;
    case 'us':
    case 'usa':
      tags.push('section508'); // US Section 508
      break;
    case 'uk':
      tags.push('wcag2a', 'wcag2aa'); // UK follows EN 301 549 which maps to WCAG
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
  if (standards.includes('Section 508')) tags.push('section508');

  return {
    tags,
    runOnly: {
      type: 'tag',
      values: tags
    }
  };
};

/**
 * Test URL for accessibility issues using axe-core
 */
router.post('/test-url', parseRawBody, async (req, res) => {
  let browser;
  
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

    // Launch Puppeteer browser for real accessibility testing
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate to the URL
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Inject axe-core into the page via CDN
    console.log('Injecting axe-core into the page...');
    await page.addScriptTag({ 
      url: 'https://unpkg.com/axe-core@4.8.4/axe.min.js'
    });
    
    // Configure axe-core based on region and standards
    const axeConfig = getAxeConfig(region, standards, wcagLevel);
    console.log('Running axe-core with config:', axeConfig);
    
    // Run axe-core analysis
    const axeResults = await page.evaluate((config) => {
      return axe.run(document, config);
    }, axeConfig);

    // Close browser
    await browser.close();

    console.log(`Axe-core analysis completed. Found ${axeResults.violations.length} violations across ${axeResults.passes.length + axeResults.violations.length} checks.`);

    // Process axe-core results into our format
    const issues = axeResults.violations.map((violation) => ({
      id: violation.id,
      type: violation.id,
      impact: violation.impact || 'moderate',
      message: violation.description,
      element: violation.nodes[0]?.html || '',
      wcagGuideline: violation.tags.find(tag => tag.match(/wcag\d{3}/))?.replace('wcag', '').replace(/(\d)(\d)(\d)/, '$1.$2.$3') || 'N/A',
      description: violation.description,
      howToFix: violation.help,
      helpUrl: violation.helpUrl,
      selector: violation.nodes[0]?.target?.join(', ') || '',
      nodes: violation.nodes.map(node => ({
        html: node.html,
        selector: node.target?.join(', ') || ''
      })),
      tags: violation.tags,
      wcagCriteria: violation.tags.filter(tag => tag.match(/wcag\d{3}/)).map(tag => 
        tag.replace('wcag', '').replace(/(\d)(\d)(\d)/, '$1.$2.$3')
      )
    }));

    // Calculate summary statistics from axe-core results
    const criticalCount = issues.filter(issue => issue.impact === 'critical').length;
    const seriousCount = issues.filter(issue => issue.impact === 'serious').length;
    const moderateCount = issues.filter(issue => issue.impact === 'moderate').length;
    const minorCount = issues.filter(issue => issue.impact === 'minor').length;
    const totalChecks = axeResults.passes.length + axeResults.violations.length;
    const passedCount = axeResults.passes.length;

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
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    console.error('Accessibility test error:', error);
    res.status(500).json({ 
      error: 'Internal server error during accessibility test',
      details: error.message 
    });
  }
});

/**
 * Test HTML content for accessibility issues using axe-core
 */
router.post('/test-html', async (req, res) => {
  let browser;
  
  try {
    const { html, wcagLevel = 'AA', baseUrl, region = 'eu', standards = [] } = req.body;

    if (!html) {
      return res.status(400).json({ error: 'HTML content is required' });
    }

    console.log(`Testing HTML content accessibility with region: ${region} and standards:`, standards);

    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: true,
      executablePath: '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Inject axe-core into the page via CDN
    await page.addScriptTag({ 
      url: 'https://unpkg.com/axe-core@4.8.4/axe.min.js'
    });
    
    // Configure axe-core based on region and standards
    const axeConfig = getAxeConfig(region, standards, wcagLevel);
    
    // Run axe-core analysis
    const axeResults = await page.evaluate((config) => {
      return axe.run(document, config);
    }, axeConfig);

    // Close browser
    await browser.close();

    console.log(`HTML axe-core analysis completed. Found ${axeResults.violations.length} violations.`);

    // Process results same as URL test
    const issues = axeResults.violations.map((violation) => ({
      id: violation.id,
      type: violation.id,
      impact: violation.impact || 'moderate',
      message: violation.description,
      element: violation.nodes[0]?.html || '',
      wcagGuideline: violation.tags.find(tag => tag.match(/wcag\d{3}/))?.replace('wcag', '').replace(/(\d)(\d)(\d)/, '$1.$2.$3') || 'N/A',
      description: violation.description,
      howToFix: violation.help,
      helpUrl: violation.helpUrl,
      selector: violation.nodes[0]?.target?.join(', ') || '',
      nodes: violation.nodes.map(node => ({
        html: node.html,
        selector: node.target?.join(', ') || ''
      })),
      tags: violation.tags,
      wcagCriteria: violation.tags.filter(tag => tag.match(/wcag\d{3}/)).map(tag => 
        tag.replace('wcag', '').replace(/(\d)(\d)(\d)/, '$1.$2.$3')
      )
    }));

    const criticalCount = issues.filter(issue => issue.impact === 'critical').length;
    const seriousCount = issues.filter(issue => issue.impact === 'serious').length;
    const moderateCount = issues.filter(issue => issue.impact === 'moderate').length;
    const minorCount = issues.filter(issue => issue.impact === 'minor').length;
    const totalChecks = axeResults.passes.length + axeResults.violations.length;
    const passedCount = axeResults.passes.length;
    const score = totalChecks > 0 ? Math.round((passedCount / totalChecks) * 100) : 100;

    const result = {
      id: `html-test-${Date.now()}`,
      timestamp: new Date().toISOString(),
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
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    console.error('HTML accessibility test error:', error);
    res.status(500).json({ 
      error: 'Internal server error during HTML accessibility test',
      details: error.message 
    });
  }
});

export default router;