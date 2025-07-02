import express from 'express';
import puppeteer from 'puppeteer';

const router = express.Router();

// Simple WCAG checker without database dependency
class SimpleWCAGChecker {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
        ]
      });
    }
  }

  async runChecks(url) {
    await this.initialize();
    const page = await this.browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      const results = await page.evaluate(() => {
        const issues = [];
        
        // Check for missing alt attributes
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
          if (!img.alt && img.alt !== '') {
            issues.push({
              id: `missing-alt-${index}`,
              issueType: 'missing-alt',
              severity: 'serious',
              wcagGuideline: '1.1.1',
              element: img.outerHTML.substring(0, 200),
              message: 'Image missing alt attribute',
              recommendation: 'Add descriptive alt text to the image'
            });
          }
        });

        // Check for missing form labels
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach((input, index) => {
          if (input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
            const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                           input.getAttribute('aria-label') || 
                           input.getAttribute('aria-labelledby');
            if (!hasLabel) {
              issues.push({
                id: `missing-form-label-${index}`,
                issueType: 'missing-form-label',
                severity: 'serious',
                wcagGuideline: '3.3.2',
                element: input.outerHTML.substring(0, 200),
                message: 'Form control missing label',
                recommendation: 'Add a label element or aria-label attribute'
              });
            }
          }
        });

        // Check for missing document language
        const htmlLang = document.documentElement.lang;
        if (!htmlLang) {
          issues.push({
            id: 'missing-doc-language',
            issueType: 'missing-doc-language',
            severity: 'serious',
            wcagGuideline: '3.1.1',
            element: '<html>',
            message: 'Document missing language attribute',
            recommendation: 'Add lang attribute to html element (e.g., <html lang="en">)'
          });
        }

        // Check heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        headings.forEach((heading, index) => {
          const level = parseInt(heading.tagName.charAt(1));
          if (level > lastLevel + 1) {
            issues.push({
              id: `heading-hierarchy-${index}`,
              issueType: 'heading-hierarchy',
              severity: 'moderate',
              wcagGuideline: '1.3.1',
              element: heading.outerHTML.substring(0, 200),
              message: 'Heading levels should not skip levels',
              recommendation: 'Use proper heading hierarchy (h1 → h2 → h3, etc.)'
            });
          }
          lastLevel = level;
        });

        // Check for duplicate IDs
        const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
        duplicateIds.forEach((id, index) => {
          issues.push({
            id: `duplicate-id-${index}`,
            issueType: 'duplicate-id',
            severity: 'serious',
            wcagGuideline: '4.1.1',
            element: `[id="${id}"]`,
            message: `Duplicate ID found: ${id}`,
            recommendation: 'Ensure all IDs are unique on the page'
          });
        });

        // Check for empty link text
        const links = document.querySelectorAll('a');
        links.forEach((link, index) => {
          const linkText = link.textContent.trim();
          const ariaLabel = link.getAttribute('aria-label');
          if (!linkText && !ariaLabel) {
            issues.push({
              id: `empty-link-text-${index}`,
              issueType: 'empty-link-text',
              severity: 'serious',
              wcagGuideline: '2.4.4',
              element: link.outerHTML.substring(0, 200),
              message: 'Link has no accessible text',
              recommendation: 'Add descriptive text or aria-label to the link'
            });
          }
        });

        // Check for color contrast (simplified)
        const elements = document.querySelectorAll('*');
        let contrastIssues = 0;
        for (let i = 0; i < Math.min(elements.length, 10); i++) {
          const el = elements[i];
          const styles = window.getComputedStyle(el);
          const backgroundColor = styles.backgroundColor;
          const color = styles.color;
          
          if (backgroundColor !== 'rgba(0, 0, 0, 0)' && color !== 'rgba(0, 0, 0, 0)') {
            // Simplified contrast check - in real implementation would calculate luminance
            if (backgroundColor === color || 
                (backgroundColor.includes('rgb(255') && color.includes('rgb(255')) ||
                (backgroundColor.includes('rgb(0') && color.includes('rgb(0'))) {
              contrastIssues++;
              if (contrastIssues <= 3) { // Limit to 3 contrast issues
                issues.push({
                  id: `color-contrast-${i}`,
                  issueType: 'color-contrast',
                  severity: 'serious',
                  wcagGuideline: '1.4.3',
                  element: el.outerHTML.substring(0, 200),
                  message: 'Insufficient color contrast',
                  recommendation: 'Ensure text has sufficient contrast ratio (4.5:1 for normal text)'
                });
              }
            }
          }
        }

        // Check for keyboard navigation
        const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
        let keyboardIssues = 0;
        focusableElements.forEach((el, index) => {
          const tabIndex = el.getAttribute('tabindex');
          if (tabIndex && parseInt(tabIndex) > 0 && keyboardIssues < 2) {
            keyboardIssues++;
            issues.push({
              id: `keyboard-navigation-${index}`,
              issueType: 'keyboard-navigation',
              severity: 'moderate',
              wcagGuideline: '2.1.1',
              element: el.outerHTML.substring(0, 200),
              message: 'Positive tabindex values can cause keyboard navigation issues',
              recommendation: 'Use tabindex="0" or rely on natural tab order'
            });
          }
        });

        return {
          issues,
          totalChecked: images.length + inputs.length + headings.length + links.length + focusableElements.length
        };
      });

      await page.close();
      
      // Calculate scores
      const totalIssues = results.issues.length;
      const criticalCount = results.issues.filter(i => i.severity === 'critical').length;
      const seriousCount = results.issues.filter(i => i.severity === 'serious').length;
      const moderateCount = results.issues.filter(i => i.severity === 'moderate').length;
      const minorCount = results.issues.filter(i => i.severity === 'minor').length;
      
      const weightedScore = Math.max(0, 100 - (
        (criticalCount * 10) + 
        (seriousCount * 5) + 
        (moderateCount * 2) + 
        (minorCount * 1)
      ));

      return {
        id: Date.now(),
        url,
        overallScore: Math.round(weightedScore),
        totalIssues,
        criticalIssues: criticalCount,
        seriousIssues: seriousCount,
        moderateIssues: moderateCount,
        minorIssues: minorCount,
        status: 'completed',
        scanDuration: Date.now() - performance.now(),
        createdAt: new Date().toISOString(),
        issues: results.issues
      };
      
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

const wcagChecker = new SimpleWCAGChecker();

// POST /api/wcag-simple/scan - Start a new WCAG scan
router.post('/scan', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({
        error: 'URL is required',
        message: 'Please provide a valid URL to scan'
      });
    }

    console.log(`Starting simple WCAG scan for URL: ${url}`);
    
    const startTime = Date.now();
    const results = await wcagChecker.runChecks(url);
    results.scanDuration = Date.now() - startTime;
    
    console.log(`WCAG scan completed for ${url} in ${results.scanDuration}ms`);
    
    res.json(results);
    
  } catch (error) {
    console.error('Error during WCAG scan:', error);
    res.status(500).json({
      error: 'Scan failed',
      message: error.message
    });
  }
});

// GET /api/wcag-simple/health - Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'wcag-simple' });
});

// Cleanup on process exit
process.on('SIGTERM', async () => {
  console.log('Cleaning up WCAG checker...');
  await wcagChecker.cleanup();
});

process.on('SIGINT', async () => {
  console.log('Cleaning up WCAG checker...');
  await wcagChecker.cleanup();
});

export default router;