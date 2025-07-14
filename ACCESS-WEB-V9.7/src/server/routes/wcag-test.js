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

// Industry-standard accessibility testing using axe-core
import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

// Severity mapping from axe-core to our system
const SEVERITY_MAP = {
  'critical': 'critical',
  'serious': 'serious', 
  'moderate': 'moderate',
  'minor': 'minor'
};

// WCAG principle mapping
const PRINCIPLE_MAP = {
  'color-contrast': 'perceivable',
  'image-alt': 'perceivable',
  'heading-order': 'perceivable',
  'label': 'perceivable',
  'language': 'understandable',
  'keyboard': 'operable',
  'focus': 'operable',
  'navigation': 'operable',
  'structure': 'robust',
  'parsing': 'robust'
};

function mapWcagPrinciple(tags) {
  if (!tags) return 'robust';
  
  for (const tag of tags) {
    if (tag.includes('color-contrast')) return 'perceivable';
    if (tag.includes('image') || tag.includes('alt')) return 'perceivable';
    if (tag.includes('heading')) return 'perceivable';
    if (tag.includes('keyboard') || tag.includes('focus')) return 'operable';
    if (tag.includes('navigation') || tag.includes('skip')) return 'operable';
    if (tag.includes('language') || tag.includes('title')) return 'understandable';
    if (tag.includes('parsing') || tag.includes('valid')) return 'robust';
  }
  
  return 'robust';
}

function generateRecommendation(ruleId, description) {
  const recommendations = {
    'color-contrast': 'Ensure text has sufficient color contrast ratio (4.5:1 for normal text, 3:1 for large text)',
    'image-alt': 'Add descriptive alt text that conveys the purpose and content of the image',
    'heading-order': 'Use heading levels in sequential order (h1 → h2 → h3) to create proper document structure',
    'label': 'Associate form controls with descriptive labels using <label> elements or aria-labelledby',
    'keyboard': 'Ensure all interactive elements are keyboard accessible and have proper focus indicators',
    'skip-link': 'Add skip navigation links to allow keyboard users to bypass repetitive content',
    'html-has-lang': 'Add lang attribute to html element (e.g., <html lang="en">)',
    'document-title': 'Provide a descriptive and unique page title',
    'landmark': 'Use semantic HTML landmarks (nav, main, header, footer) to structure page content',
    'list': 'Use proper list markup (ul, ol, li) for groups of related items',
    'button-name': 'Provide accessible names for buttons using text content or aria-label',
    'link-name': 'Ensure links have accessible names that describe their purpose or destination'
  };

  for (const [key, rec] of Object.entries(recommendations)) {
    if (ruleId.includes(key)) {
      return rec;
    }
  }
  
  return 'Review the element and ensure it follows WCAG accessibility guidelines';
}

// Real WCAG scan function using axe-core
async function performWCAGScan(url) {
  const startTime = Date.now();
  let browser;
  
  try {
    // Launch browser with accessibility-friendly options
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set realistic viewport and user agent
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 AccessWeb-Scanner/1.0');
    
    // Navigate to the page with timeout
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Run axe-core accessibility analysis
    const results = await new AxePuppeteer(page)
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'])
      .options({
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice']
        }
      })
      .analyze();
    
    // Process violations (issues)
    const issues = results.violations.map(violation => {
      const firstNode = violation.nodes[0];
      const element = firstNode?.html || '';
      const selector = firstNode?.target?.[0] || violation.id;
      
      return {
        wcagRule: violation.tags.find(tag => tag.match(/wcag\d+/))?.replace('wcag', '').replace(/(\d)(\d)/, '$1.$2') || violation.id,
        ruleName: violation.help,
        severity: SEVERITY_MAP[violation.impact] || 'moderate',
        principle: mapWcagPrinciple(violation.tags),
        element: element.substring(0, 200) + (element.length > 200 ? '...' : ''),
        selector: selector,
        description: violation.description,
        recommendation: generateRecommendation(violation.id, violation.description),
        helpUrl: violation.helpUrl,
        axeRuleId: violation.id,
        nodesCount: violation.nodes.length
      };
    });
    
    // Process passed checks
    const passedChecks = results.passes.map(pass => ({
      wcagRule: pass.tags.find(tag => tag.match(/wcag\d+/))?.replace('wcag', '').replace(/(\d)(\d)/, '$1.$2') || pass.id,
      ruleName: pass.help,
      description: `✓ ${pass.description}`,
      nodesCount: pass.nodes.length
    }));
    
    // Calculate severity breakdown
    const severityBreakdown = {
      critical: issues.filter(i => i.severity === 'critical').length,
      serious: issues.filter(i => i.severity === 'serious').length,
      moderate: issues.filter(i => i.severity === 'moderate').length,
      minor: issues.filter(i => i.severity === 'minor').length
    };
    
    // Calculate weighted accessibility score
    const penalties = {
      critical: 20,
      serious: 12,
      moderate: 6,
      minor: 2
    };
    
    const totalPenalty = Object.entries(severityBreakdown)
      .reduce((sum, [severity, count]) => sum + (count * penalties[severity]), 0);
    
    const overallScore = Math.max(0, Math.min(100, 100 - totalPenalty));
    
    // Determine WCAG conformance level
    let conformanceLevel = 'Non-conformant';
    if (severityBreakdown.critical === 0 && severityBreakdown.serious === 0) {
      if (severityBreakdown.moderate === 0) {
        conformanceLevel = 'AAA';
      } else {
        conformanceLevel = 'AA';
      }
    } else if (severityBreakdown.critical === 0) {
      conformanceLevel = 'A';
    }
    
    // Group issues by WCAG principle
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
    
    await browser.close();
    
    return {
      summary: {
        totalIssues: issues.length,
        severityBreakdown,
        passedChecks: passedChecks.length,
        overallScore: Math.round(overallScore),
        conformanceLevel,
        testedElements: results.passes.reduce((sum, pass) => sum + pass.nodes.length, 0) + 
                       results.violations.reduce((sum, violation) => sum + violation.nodes.length, 0)
      },
      issues,
      issuesByPrinciple,
      passedChecks,
      scanMetadata: {
        url,
        timestamp: new Date().toISOString(),
        scanDuration,
        wcagVersion: '2.1',
        toolVersion: 'axe-core 4.x',
        conformanceLevel,
        accessibilityScore: Math.round(overallScore),
        testEngine: 'axe-core',
        totalRules: results.passes.length + results.violations.length + results.incomplete.length + results.inapplicable.length,
        applicableRules: results.passes.length + results.violations.length
      },
      wcagGuidelines: {
        version: '2.1',
        principles: {
          perceivable: 'Information and user interface components must be presentable to users in ways they can perceive.',
          operable: 'User interface components and navigation must be operable.',
          understandable: 'Information and the operation of user interface must be understandable.',
          robust: 'Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.'
        }
      },
      axeResults: {
        violations: results.violations.length,
        passes: results.passes.length,
        incomplete: results.incomplete.length,
        inapplicable: results.inapplicable.length
      }
    };
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw new Error(`Failed to scan URL with axe-core: ${error.message}`);
  }
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