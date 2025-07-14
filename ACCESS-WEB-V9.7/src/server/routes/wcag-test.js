import express from 'express';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for WCAG scans
const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many scan requests, please try again later',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to sanitize URL input
function sanitizeUrl(url) {
  try {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const urlObj = new URL(cleanUrl);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      throw new Error('Only HTTP and HTTPS protocols are supported');
    }
    return cleanUrl;
  } catch (e) {
    console.error('URL validation failed for:', url, 'Error:', e.message);
    throw new Error(`Invalid URL format: ${e.message}`);
  }
}

// Install required packages for web scraping and accessibility testing
import axios from 'axios';
import { parse } from 'node-html-parser';

// Real WCAG scan function
async function performWCAGScan(url) {
  const startTime = Date.now();
  let html = '';
  let issues = [];
  let passedChecks = [];
  
  try {
    // Fetch the webpage
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'AccessWeb WCAG Scanner/1.0'
      },
      timeout: 10000,
      maxRedirects: 5
    });
    
    html = response.data;
  } catch (error) {
    throw new Error(`Failed to fetch URL: ${error.message}`);
  }

  // Parse HTML
  const root = parse(html);
  
  // WCAG 1.1.1 - Non-text Content (Alt text)
  const images = root.querySelectorAll('img');
  images.forEach((img, index) => {
    const alt = img.getAttribute('alt');
    const src = img.getAttribute('src');
    
    if (!alt || alt.trim() === '') {
      issues.push({
        wcagRule: '1.1.1',
        ruleName: 'Non-text Content',
        severity: alt === null ? 'critical' : 'serious',
        principle: 'perceivable',
        element: img.outerHTML.substring(0, 100) + '...',
        selector: `img:nth-child(${index + 1})`,
        description: alt === null ? 'Image missing alt attribute' : 'Image has empty alt text',
        recommendation: 'Add descriptive alt text that conveys the purpose and content of the image'
      });
    } else {
      passedChecks.push({
        wcagRule: '1.1.1',
        ruleName: 'Non-text Content',
        description: `Image has alt text: "${alt.substring(0, 50)}..."`
      });
    }
  });

  // WCAG 1.3.1 - Info and Relationships (Heading structure)
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastHeadingLevel = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName[1]);
    
    if (index === 0 && level !== 1) {
      issues.push({
        wcagRule: '1.3.1',
        ruleName: 'Info and Relationships',
        severity: 'moderate',
        principle: 'perceivable',
        element: heading.outerHTML.substring(0, 100) + '...',
        selector: heading.tagName.toLowerCase(),
        description: 'Page should start with h1 heading',
        recommendation: 'Use h1 for the main page heading'
      });
    }
    
    if (level > lastHeadingLevel + 1) {
      issues.push({
        wcagRule: '1.3.1',
        ruleName: 'Info and Relationships',
        severity: 'moderate',
        principle: 'perceivable',
        element: heading.outerHTML.substring(0, 100) + '...',
        selector: `${heading.tagName.toLowerCase()}:nth-child(${index + 1})`,
        description: `Heading level jumps from h${lastHeadingLevel} to h${level}, skipping levels`,
        recommendation: 'Use heading levels in order (h1 -> h2 -> h3, etc.)'
      });
    }
    
    lastHeadingLevel = level;
  });

  // WCAG 1.4.3 - Contrast (Minimum) - Basic check for common patterns
  const buttons = root.querySelectorAll('button, .btn, .button');
  buttons.forEach((button, index) => {
    const style = button.getAttribute('style') || '';
    const className = button.getAttribute('class') || '';
    
    // Check for common low-contrast patterns
    if (style.includes('color: #ccc') || style.includes('color: #ddd') || 
        className.includes('disabled') || className.includes('muted')) {
      issues.push({
        wcagRule: '1.4.3',
        ruleName: 'Contrast (Minimum)',
        severity: 'serious',
        principle: 'perceivable',
        element: button.outerHTML.substring(0, 100) + '...',
        selector: `button:nth-child(${index + 1})`,
        description: 'Button may have insufficient color contrast',
        recommendation: 'Ensure text has contrast ratio of at least 4.5:1 against background'
      });
    }
  });

  // WCAG 2.1.1 - Keyboard (Basic check for interactive elements)
  const interactiveElements = root.querySelectorAll('button, a, input, select, textarea');
  let keyboardAccessibleCount = 0;
  
  interactiveElements.forEach((element, index) => {
    const tabindex = element.getAttribute('tabindex');
    const href = element.getAttribute('href');
    
    if (element.tagName.toLowerCase() === 'a' && (!href || href === '#')) {
      issues.push({
        wcagRule: '2.1.1',
        ruleName: 'Keyboard',
        severity: 'moderate',
        principle: 'operable',
        element: element.outerHTML.substring(0, 100) + '...',
        selector: `a:nth-child(${index + 1})`,
        description: 'Link has no href or empty href',
        recommendation: 'Provide meaningful href attributes for all links'
      });
    } else if (tabindex !== '-1') {
      keyboardAccessibleCount++;
    }
  });

  // WCAG 2.4.1 - Bypass Blocks (Skip links)
  const skipLinks = root.querySelectorAll('a[href^="#"]');
  let hasSkipLink = false;
  
  skipLinks.forEach(link => {
    const text = link.text.toLowerCase();
    if (text.includes('skip') && (text.includes('content') || text.includes('main') || text.includes('navigation'))) {
      hasSkipLink = true;
      passedChecks.push({
        wcagRule: '2.4.1',
        ruleName: 'Bypass Blocks',
        description: 'Skip navigation link found'
      });
    }
  });
  
  if (!hasSkipLink && root.querySelectorAll('nav, header').length > 0) {
    issues.push({
      wcagRule: '2.4.1',
      ruleName: 'Bypass Blocks',
      severity: 'moderate',
      principle: 'operable',
      element: 'Page structure',
      selector: 'body',
      description: 'No skip navigation link found',
      recommendation: 'Add a skip link to allow keyboard users to bypass navigation'
    });
  }

  // WCAG 1.4.4 - Resize text (Check for viewport meta tag)
  const viewportMeta = root.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    const content = viewportMeta.getAttribute('content') || '';
    if (content.includes('user-scalable=no') || content.includes('maximum-scale=1')) {
      issues.push({
        wcagRule: '1.4.4',
        ruleName: 'Resize text',
        severity: 'serious',
        principle: 'perceivable',
        element: viewportMeta.outerHTML,
        selector: 'meta[name="viewport"]',
        description: 'Viewport prevents text scaling',
        recommendation: 'Allow users to scale text up to 200% by removing user-scalable=no'
      });
    } else {
      passedChecks.push({
        wcagRule: '1.4.4',
        ruleName: 'Resize text',
        description: 'Viewport allows text scaling'
      });
    }
  }

  // WCAG 3.1.1 - Language of Page
  const htmlElement = root.querySelector('html');
  const lang = htmlElement?.getAttribute('lang');
  
  if (!lang || lang.trim() === '') {
    issues.push({
      wcagRule: '3.1.1',
      ruleName: 'Language of Page',
      severity: 'moderate',
      principle: 'understandable',
      element: htmlElement?.outerHTML.substring(0, 100) + '...' || '<html>',
      selector: 'html',
      description: 'Page language not specified',
      recommendation: 'Add lang attribute to html element (e.g., <html lang="en">)'
    });
  } else {
    passedChecks.push({
      wcagRule: '3.1.1',
      ruleName: 'Language of Page',
      description: `Page language specified: ${lang}`
    });
  }

  // WCAG 2.4.2 - Page Titled
  const title = root.querySelector('title');
  if (!title || !title.text.trim()) {
    issues.push({
      wcagRule: '2.4.2',
      ruleName: 'Page Titled',
      severity: 'serious',
      principle: 'operable',
      element: title?.outerHTML || '<title>',
      selector: 'title',
      description: 'Page has no title or empty title',
      recommendation: 'Provide a descriptive page title'
    });
  } else {
    passedChecks.push({
      wcagRule: '2.4.2',
      ruleName: 'Page Titled',
      description: `Page has title: "${title.text.substring(0, 50)}..."`
    });
  }

  // Calculate severity breakdown
  const severityBreakdown = {
    critical: issues.filter(i => i.severity === 'critical').length,
    serious: issues.filter(i => i.severity === 'serious').length,
    moderate: issues.filter(i => i.severity === 'moderate').length,
    minor: issues.filter(i => i.severity === 'minor').length
  };

  // Calculate score (100 - weighted penalty for issues)
  const penalties = {
    critical: 15,
    serious: 10,
    moderate: 5,
    minor: 2
  };
  
  const totalPenalty = Object.entries(severityBreakdown)
    .reduce((sum, [severity, count]) => sum + (count * penalties[severity]), 0);
  
  const overallScore = Math.max(0, 100 - totalPenalty);
  
  // Determine conformance level
  let conformanceLevel = 'Non-conformant';
  if (severityBreakdown.critical === 0 && severityBreakdown.serious === 0) {
    conformanceLevel = 'AA';
  } else if (severityBreakdown.critical === 0) {
    conformanceLevel = 'A';
  }

  // Group issues by principle
  const issuesByPrinciple = {
    perceivable: { count: 0, issues: [] },
    operable: { count: 0, issues: [] },
    understandable: { count: 0, issues: [] },
    robust: { count: 0, issues: [] }
  };

  issues.forEach(issue => {
    if (issuesByPrinciple[issue.principle]) {
      issuesByPrinciple[issue.principle].count++;
      issuesByPrinciple[issue.principle].issues.push(issue);
    }
  });

  const scanDuration = Date.now() - startTime;

  return {
    summary: {
      totalIssues: issues.length,
      severityBreakdown,
      passedChecks: passedChecks.length,
      overallScore,
      conformanceLevel
    },
    issues,
    issuesByPrinciple,
    passedChecks,
    scanMetadata: {
      url,
      timestamp: new Date().toISOString(),
      scanDuration,
      wcagVersion: '2.1',
      toolVersion: '1.0.0',
      conformanceLevel,
      accessibilityScore: overallScore
    },
    wcagGuidelines: {
      version: '2.1',
      principles: {
        perceivable: 'Information and user interface components must be presentable to users in ways they can perceive.',
        operable: 'User interface components and navigation must be operable.',
        understandable: 'Information and the operation of user interface must be understandable.',
        robust: 'Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.'
      }
    }
  };
}

// POST /api/wcag-test/scan - Start a new WCAG scan
router.post('/scan', scanLimiter, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL is required',
        message: 'Please provide a valid URL to scan'
      });
    }

    const sanitizedUrl = sanitizeUrl(url);
    console.log(`Starting test WCAG scan for URL: ${sanitizedUrl}`);
    
    const startTime = Date.now();
    const scanResult = await performWCAGScan(sanitizedUrl);
    const endTime = Date.now();
    
    console.log(`Test WCAG scan completed for ${sanitizedUrl} in ${endTime - startTime}ms`);
    
    const responseData = {
      success: true,
      ...scanResult,
      scanId: Date.now(),
      message: 'Test WCAG scan completed successfully'
    };
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Error in test WCAG scan:', error);
    res.status(500).json({
      success: false,
      error: 'Scan failed to start',
      message: error.message
    });
  }
});

// GET /api/wcag-test/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'WCAG Test Scanner',
    timestamp: new Date().toISOString()
  });
});

export default router;