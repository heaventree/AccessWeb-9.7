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

// Simple test route to verify this location works
router.get('/test-ai', (req, res) => {
  res.json({ success: true, message: 'AI route location works!' });
});

/**
 * Get AI suggestions for fixing accessibility issues
 */
router.post('/ai-suggestions', async (req, res) => {
  try {
    const { issue, issueElement, issueType } = req.body;

    // Validate required fields
    if (!issue || !issueType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: issue and issueType are required'
      });
    }

    // Import OpenAI (dynamic import to handle potential missing dependency)
    const { OpenAI } = await import('openai');

    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key not configured'
      });
    }

    const openai = new OpenAI({ apiKey });

    // Create a comprehensive prompt for AI
    const prompt = `
You are a WCAG accessibility expert. Analyze this accessibility issue and provide a comprehensive fix recommendation.

Issue Details:
- Description: ${issue.description || issue.message || issue}
- Impact Level: ${issue.impact || 'moderate'}
- Issue Type: ${issueType}
- WCAG Criteria: ${issue.wcagCriteria ? issue.wcagCriteria.join(', ') : 'Not specified'}
- Element: ${issueElement || issue.element || issue.selector || 'Not provided'}
- HTML Code: ${issue.htmlCode || issue.nodes?.[0]?.html || 'Not provided'}

Please provide your response in the following JSON format:
{
  "explanation": "Brief explanation of why this is an accessibility issue and its impact on users",
  "suggestedFix": "Step-by-step instructions to fix this issue",
  "codeExample": "Complete code example showing the fix (HTML, CSS, or JavaScript as needed)",
  "additionalResources": ["Array of helpful links or resources"],
  "wcagReference": "Relevant WCAG success criteria",
  "testingTips": "How to test that the fix works properly"
}

Focus on providing practical, implementable solutions with clear code examples.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system", 
          content: "You are an expert WCAG accessibility consultant. Provide practical, implementable solutions with clear code examples. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      throw new Error('No response generated from AI');
    }

    // Try to parse AI response as JSON
    let suggestions;
    try {
      suggestions = JSON.parse(aiResponse);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      suggestions = {
        explanation: "AI recommendation generated successfully",
        suggestedFix: aiResponse,
        codeExample: "// See the suggested fix for implementation details",
        additionalResources: ["https://www.w3.org/WAI/WCAG21/quickref/"],
        wcagReference: issue.wcagCriteria ? issue.wcagCriteria.join(', ') : 'N/A',
        testingTips: "Test with screen readers and keyboard navigation"
      };
    }

    // Ensure all required fields are present
    const response = {
      success: true,
      data: {
        explanation: suggestions.explanation || "This accessibility issue affects user experience and WCAG compliance.",
        suggestedFix: suggestions.suggestedFix || suggestions.description || "Please review the issue manually for specific recommendations.",
        codeExample: suggestions.codeExample || "// Refer to WCAG guidelines for implementation",
        additionalResources: suggestions.additionalResources || ["https://www.w3.org/WAI/WCAG21/quickref/"],
        wcagReference: suggestions.wcagReference || issue.wcagCriteria?.join(', ') || 'N/A',
        testingTips: suggestions.testingTips || "Test with assistive technologies and keyboard navigation"
      }
    };

    res.json(response);

  } catch (error) {
    console.error('AI Suggestions Error:', error);
    
    // Provide a fallback response based on the issue type
    const fallbackSuggestions = getFallbackSuggestions(req.body.issue, req.body.issueType);
    
    res.status(200).json({
      success: true,
      data: fallbackSuggestions,
      note: "AI service unavailable, providing fallback recommendations"
    });
  }
});

/**
 * Generate fallback suggestions when AI service is unavailable
 */
function getFallbackSuggestions(issue, issueType) {
  const baseUrl = "https://www.w3.org/WAI/WCAG21/quickref/";
  
  const fallbacks = {
    'color-contrast': {
      explanation: "Color contrast issues occur when text doesn't have sufficient contrast against its background, making it difficult for users with visual impairments to read.",
      suggestedFix: "1. Increase contrast between text and background colors\n2. Use darker text on light backgrounds or lighter text on dark backgrounds\n3. Ensure contrast ratio meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)",
      codeExample: "/* Example: Improve contrast */\n.text-element {\n  color: #333333; /* Dark text */\n  background-color: #ffffff; /* Light background */\n  /* Contrast ratio: 12.6:1 - Exceeds WCAG AA */\n}",
      additionalResources: [baseUrl + "#contrast-minimum"],
      wcagReference: "WCAG 2.1 Success Criterion 1.4.3 Contrast (Minimum)",
      testingTips: "Use color contrast analyzers and test with users who have visual impairments"
    },
    'missing-alt-text': {
      explanation: "Images without alternative text cannot be understood by screen readers, excluding visually impaired users from important content.",
      suggestedFix: "1. Add descriptive alt text that conveys the purpose and content of the image\n2. Use alt='' for decorative images\n3. For complex images, provide detailed descriptions in nearby text",
      codeExample: '<!-- Before -->\n<img src="chart.jpg">\n\n<!-- After -->\n<img src="chart.jpg" alt="Sales chart showing 25% increase in Q3 2024">',
      additionalResources: [baseUrl + "#images-of-text"],
      wcagReference: "WCAG 2.1 Success Criterion 1.1.1 Non-text Content",
      testingTips: "Test with screen readers and verify alt text provides equivalent information"
    },
    'heading-structure': {
      explanation: "Improper heading structure makes it difficult for screen reader users to navigate content and understand page organization.",
      suggestedFix: "1. Use headings in logical order (h1, h2, h3, etc.)\n2. Don't skip heading levels\n3. Use only one h1 per page\n4. Make headings descriptive of the content that follows",
      codeExample: '<!-- Correct heading structure -->\n<h1>Main Page Title</h1>\n<h2>Section Title</h2>\n<h3>Subsection Title</h3>\n<h3>Another Subsection</h3>\n<h2>Another Section</h2>',
      additionalResources: [baseUrl + "#headings"],
      wcagReference: "WCAG 2.1 Success Criterion 1.3.1 Info and Relationships",
      testingTips: "Use heading navigation in screen readers to test logical flow"
    },
    'keyboard-navigation': {
      explanation: "Elements that cannot be accessed via keyboard exclude users who rely on keyboard navigation or assistive technologies.",
      suggestedFix: "1. Ensure all interactive elements are focusable with Tab key\n2. Add proper focus indicators\n3. Implement logical tab order\n4. Provide keyboard alternatives for mouse-only interactions",
      codeExample: '/* Add focus indicators */\nbutton:focus, a:focus {\n  outline: 2px solid #0066cc;\n  outline-offset: 2px;\n}\n\n/* Make non-button elements focusable if needed */\n.clickable-div {\n  tabindex="0"\n  role="button"\n}',
      additionalResources: [baseUrl + "#keyboard"],
      wcagReference: "WCAG 2.1 Success Criterion 2.1.1 Keyboard",
      testingTips: "Navigate the entire interface using only the keyboard (Tab, Enter, Space, Arrow keys)"
    }
  };

  // Try to match issue type to fallback suggestions
  const issueDescription = (issue.description || issue.message || issueType || '').toLowerCase();
  
  if (issueDescription.includes('contrast') || issueDescription.includes('color')) {
    return fallbacks['color-contrast'];
  } else if (issueDescription.includes('alt') || issueDescription.includes('image')) {
    return fallbacks['missing-alt-text'];
  } else if (issueDescription.includes('heading') || issueDescription.includes('h1') || issueDescription.includes('h2')) {
    return fallbacks['heading-structure'];
  } else if (issueDescription.includes('keyboard') || issueDescription.includes('focus') || issueDescription.includes('tab')) {
    return fallbacks['keyboard-navigation'];
  }

  // Default fallback
  return {
    explanation: "This accessibility issue may impact users with disabilities and should be addressed to ensure WCAG compliance.",
    suggestedFix: "1. Review the specific WCAG criteria for this issue\n2. Implement appropriate fixes based on the issue type\n3. Test with assistive technologies\n4. Validate the fix with accessibility testing tools",
    codeExample: "/* Refer to WCAG documentation for specific implementation guidance */",
    additionalResources: [baseUrl, "https://webaim.org/", "https://www.a11yproject.com/"],
    wcagReference: issue.wcagCriteria?.join(', ') || 'Refer to WCAG 2.1 guidelines',
    testingTips: "Use automated accessibility testing tools and manual testing with assistive technologies"
  };
}



export default router;