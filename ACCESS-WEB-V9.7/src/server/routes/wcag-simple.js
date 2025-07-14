import express from 'express';
import rateLimit from 'express-rate-limit';
import ComprehensiveWCAGChecker from '../services/comprehensiveWCAGChecker.js';

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

// Create WCAG checker instance
const comprehensiveChecker = new ComprehensiveWCAGChecker();

// Helper function to sanitize URL input
function sanitizeUrl(url) {
  try {
    // Clean the URL
    let cleanUrl = url.trim();
    
    // Add protocol if missing
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    
    // Basic URL validation
    const urlObj = new URL(cleanUrl);
    
    // Ensure it's http or https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      throw new Error('Only HTTP and HTTPS protocols are supported');
    }
    
    return cleanUrl;
  } catch (e) {
    console.error('URL validation failed for:', url, 'Error:', e.message);
    throw new Error(`Invalid URL format: ${e.message}`);
  }
}

// POST /api/wcag-simple/scan - Start a new WCAG scan
router.post('/scan', scanLimiter, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        error: 'URL is required',
        message: 'Please provide a valid URL to scan'
      });
    }

    // Sanitize and validate URL
    const sanitizedUrl = sanitizeUrl(url);
    
    console.log(`Starting comprehensive WCAG scan for URL: ${sanitizedUrl}`);
    
    // Start the scan
    const startTime = Date.now();
    
    // Use comprehensive checker for detailed WCAG analysis
    const scanResult = await comprehensiveChecker.performScan(sanitizedUrl);
    
    const endTime = Date.now();
    console.log(`Comprehensive WCAG scan completed for ${sanitizedUrl} in ${endTime - startTime}ms`);
    
    // Add scan metadata
    const responseData = {
      ...scanResult,
      scanId: Date.now(),
      timestamp: new Date().toISOString(),
      message: 'Comprehensive WCAG scan completed successfully'
    };
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Error starting WCAG scan:', error);
    res.status(500).json({
      error: 'Scan failed to start',
      message: error.message
    });
  }
});

// GET /api/wcag-simple/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'WCAG Scanner',
    timestamp: new Date().toISOString()
  });
});

export default router;