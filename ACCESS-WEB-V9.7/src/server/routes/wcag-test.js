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

// Mock scan function for testing
async function mockWCAGScan(url) {
  // Simulate scan delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    summary: {
      totalIssues: 12,
      severityBreakdown: {
        critical: 1,
        serious: 3,
        moderate: 5,
        minor: 3
      },
      passedChecks: 45,
      overallScore: 85,
      conformanceLevel: 'AA'
    },
    issues: [
      {
        wcagRule: '1.4.3',
        ruleName: 'Contrast (Minimum)',
        severity: 'serious',
        principle: 'perceivable',
        element: 'button.primary',
        selector: 'button.primary',
        description: 'Button text contrast ratio is 3.1:1, needs to be at least 4.5:1',
        recommendation: 'Use darker text or lighter background'
      },
      {
        wcagRule: '1.3.1',
        ruleName: 'Info and Relationships',
        severity: 'moderate',
        principle: 'perceivable',
        element: 'h3',
        selector: 'h3:nth-child(3)',
        description: 'Heading level jumps from h1 to h3, skipping h2',
        recommendation: 'Use proper heading hierarchy (h1 -> h2 -> h3)'
      },
      {
        wcagRule: '1.1.1',
        ruleName: 'Non-text Content',
        severity: 'critical',
        principle: 'perceivable',
        element: 'img.hero',
        selector: 'img.hero',
        description: 'Image missing alt text',
        recommendation: 'Add descriptive alt text to all images'
      }
    ],
    issuesByPrinciple: {
      perceivable: { 
        count: 8, 
        issues: [
          {
            wcagRule: '1.4.3',
            ruleName: 'Contrast (Minimum)',
            severity: 'serious',
            principle: 'perceivable',
            element: 'button.primary',
            selector: 'button.primary',
            description: 'Button text contrast ratio is 3.1:1, needs to be at least 4.5:1',
            recommendation: 'Use darker text or lighter background'
          }
        ] 
      },
      operable: { 
        count: 2, 
        issues: [] 
      },
      understandable: { 
        count: 1, 
        issues: [] 
      },
      robust: { 
        count: 1, 
        issues: [] 
      }
    },
    passedChecks: [
      {
        wcagRule: '2.1.1',
        ruleName: 'Keyboard',
        description: 'All interactive elements are keyboard accessible'
      },
      {
        wcagRule: '2.4.1',
        ruleName: 'Bypass Blocks',
        description: 'Skip navigation link is present'
      }
    ],
    scanMetadata: {
      url,
      timestamp: new Date().toISOString(),
      scanDuration: 1000,
      wcagVersion: '2.2',
      toolVersion: '1.0.0',
      conformanceLevel: 'AA',
      accessibilityScore: 85
    },
    wcagGuidelines: {
      version: '2.2',
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
    const scanResult = await mockWCAGScan(sanitizedUrl);
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