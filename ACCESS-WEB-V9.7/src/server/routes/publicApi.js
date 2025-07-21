import express from 'express';
import axeCore from 'axe-core';
import { JSDOM } from 'jsdom';
import { authenticateApiKey, trackApiUsage } from './apiKeys.js';

const router = express.Router();

// Helper function to fetch and parse HTML
async function fetchWebpage(url) {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AccessWeb-WCAG-Checker/1.0'
      },
      timeout: 10000 // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    return html;
  } catch (error) {
    throw new Error(`Failed to fetch webpage: ${error.message}`);
  }
}

// Helper function to run axe-core analysis
async function runAxeAnalysis(html, url, options = {}) {
  try {
    const dom = new JSDOM(html, { 
      url: url,
      pretendToBeVisual: true,
      resources: 'usable'
    });
    
    const { window } = dom;
    const { document } = window;

    // Set up axe for this window/document
    const axe = axeCore;
    
    // Configure axe based on region and tag
    const axeConfig = {
      reporter: 'v2',
      ...options
    };

    // Map region to appropriate tags/standards
    if (options.region) {
      switch (options.region.toLowerCase()) {
        case 'eu':
          axeConfig.tags = ['wcag2a', 'wcag2aa', 'wcag21aa', 'en301549'];
          break;
        case 'us':
          axeConfig.tags = ['wcag2a', 'wcag2aa', 'section508'];
          break;
        case 'uk':
          axeConfig.tags = ['wcag2a', 'wcag2aa', 'wcag21aa'];
          break;
        default:
          axeConfig.tags = ['wcag2a', 'wcag2aa'];
      }
    }

    // Override with specific tag if provided
    if (options.tag) {
      const tagMap = {
        'WCAG2A': ['wcag2a'],
        'WCAG2AA': ['wcag2a', 'wcag2aa'],
        'WCAG2AAA': ['wcag2a', 'wcag2aa', 'wcag2aaa'],
        'WCAG21A': ['wcag21a'],
        'WCAG21AA': ['wcag21a', 'wcag21aa'],
        'SECTION508': ['section508'],
        'EN301549': ['en301549']
      };
      
      if (tagMap[options.tag.toUpperCase()]) {
        axeConfig.tags = tagMap[options.tag.toUpperCase()];
      }
    }

    // Run axe analysis
    return new Promise((resolve, reject) => {
      // Since we're in Node.js, we need to use axe-core differently
      // We'll use axe-puppeteer approach but simulate it
      
      const mockWindow = {
        ...window,
        axe: axeCore
      };

      axeCore.run(document, axeConfig, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

  } catch (error) {
    throw new Error(`Failed to analyze webpage: ${error.message}`);
  }
}

// Helper function to format results
function formatResults(axeResults, url, region, tag) {
  const violations = axeResults.violations || [];
  const passes = axeResults.passes || [];
  const incomplete = axeResults.incomplete || [];
  
  const totalIssues = violations.length;
  const criticalIssues = violations.filter(v => v.impact === 'critical').length;
  const seriousIssues = violations.filter(v => v.impact === 'serious').length;
  const moderateIssues = violations.filter(v => v.impact === 'moderate').length;
  const minorIssues = violations.filter(v => v.impact === 'minor').length;

  // Calculate compliance score
  const totalRules = violations.length + passes.length;
  const passedRules = passes.length;
  const complianceScore = totalRules > 0 ? Math.round((passedRules / totalRules) * 100) : 100;

  return {
    url,
    region,
    tag,
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues,
      criticalIssues,
      seriousIssues,
      moderateIssues,
      minorIssues,
      complianceScore,
      totalRulesChecked: totalRules,
      rulesPassed: passedRules
    },
    violations: violations.map(violation => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.map(node => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary,
        element: node.element
      }))
    })),
    passes: passes.map(pass => ({
      id: pass.id,
      description: pass.description,
      help: pass.help,
      tags: pass.tags,
      nodes: pass.nodes.length
    })),
    incomplete: incomplete.map(inc => ({
      id: inc.id,
      description: inc.description,
      help: inc.help,
      tags: inc.tags,
      nodes: inc.nodes.length
    })),
    metadata: {
      standard: tag || 'WCAG2AA',
      region: region || 'us',
      engine: 'axe-core',
      version: axeCore.version
    }
  };
}

// POST /api/public/wcag-check - Public WCAG checking endpoint
router.post('/wcag-check', authenticateApiKey, async (req, res) => {
  const startTime = Date.now();
  let statusCode = 200;
  let responseData = null;

  try {
    const { url, region = 'us', tag = 'WCAG2AA' } = req.body;

    // Validate input
    if (!url) {
      statusCode = 400;
      const error = { 
        error: 'Missing required parameter',
        message: 'URL is required'
      };
      responseData = error;
      return res.status(statusCode).json(error);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      statusCode = 400;
      const error = { 
        error: 'Invalid URL format',
        message: 'Please provide a valid HTTP or HTTPS URL'
      };
      responseData = error;
      return res.status(statusCode).json(error);
    }

    // Validate region
    const validRegions = ['us', 'eu', 'uk'];
    if (!validRegions.includes(region.toLowerCase())) {
      statusCode = 400;
      const error = { 
        error: 'Invalid region',
        message: 'Region must be one of: us, eu, uk'
      };
      responseData = error;
      return res.status(statusCode).json(error);
    }

    // Validate tag
    const validTags = ['WCAG2A', 'WCAG2AA', 'WCAG2AAA', 'WCAG21A', 'WCAG21AA', 'SECTION508', 'EN301549'];
    if (!validTags.includes(tag.toUpperCase())) {
      statusCode = 400;
      const error = { 
        error: 'Invalid tag',
        message: `Tag must be one of: ${validTags.join(', ')}`
      };
      responseData = error;
      return res.status(statusCode).json(error);
    }

    console.log(`[API] Starting WCAG check for ${url} (region: ${region}, tag: ${tag})`);

    // Fetch webpage
    const html = await fetchWebpage(url);
    
    // Run accessibility analysis
    const axeResults = await runAxeAnalysis(html, url, { region, tag });
    
    // Format results
    const formattedResults = formatResults(axeResults, url, region, tag);
    
    responseData = formattedResults;
    res.json(formattedResults);

  } catch (error) {
    console.error('[API] WCAG check error:', error);
    statusCode = 500;
    
    const errorResponse = {
      error: 'Analysis failed',
      message: error.message,
      timestamp: new Date().toISOString()
    };
    responseData = errorResponse;
    
    res.status(statusCode).json(errorResponse);
  } finally {
    // Track API usage
    const responseTime = Date.now() - startTime;
    
    try {
      await trackApiUsage(
        req.apiKey.id,
        '/api/public/wcag-check',
        'POST',
        req.body.url,
        statusCode,
        responseTime,
        req.get('User-Agent'),
        req.ip,
        req.body,
        responseData
      );
    } catch (trackingError) {
      console.error('Failed to track API usage:', trackingError);
    }
  }
});

// GET /api/public/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AccessWeb Public API',
    version: '1.0.0'
  });
});

export default router;