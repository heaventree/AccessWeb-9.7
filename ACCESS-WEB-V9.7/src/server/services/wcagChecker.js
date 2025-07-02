const puppeteer = require('puppeteer');
const axeCore = require('axe-core');
const pa11y = require('pa11y');
const validator = require('validator');
const urlParse = require('url-parse');
const fs = require('fs').promises;
const path = require('path');

class WCAGChecker {
  constructor() {
    this.browser = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (!this.isInitialized) {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-default-apps'
        ]
      });
      this.isInitialized = true;
    }
  }

  async validateUrl(url) {
    // Basic URL validation
    if (!validator.isURL(url, { 
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true
    })) {
      throw new Error('Invalid URL format');
    }

    // Parse URL to check for malicious patterns
    const parsed = urlParse(url);
    
    // Block localhost, private IPs, and file protocols for security
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
    const privateIPRegex = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/;
    
    if (blockedHosts.includes(parsed.hostname) || 
        privateIPRegex.test(parsed.hostname) ||
        parsed.protocol === 'file:') {
      throw new Error('URL not allowed for security reasons');
    }

    return true;
  }

  async checkReachability(url) {
    try {
      await this.initialize();
      const page = await this.browser.newPage();
      
      // Set timeout and user agent
      await page.setUserAgent('WCAG-Checker/1.0 (+https://accessibility-checker.org)');
      
      const response = await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });
      
      if (!response.ok()) {
        throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
      }

      await page.close();
      return true;
    } catch (error) {
      throw new Error(`URL not reachable: ${error.message}`);
    }
  }

  async runWCAGChecks(url, options = {}) {
    await this.validateUrl(url);
    await this.checkReachability(url);

    const results = {
      url,
      timestamp: new Date().toISOString(),
      overallScore: 0,
      totalIssues: 0,
      criticalIssues: 0,
      seriousIssues: 0,
      moderateIssues: 0,
      minorIssues: 0,
      checks: {
        axeCore: null,
        pa11y: null,
        custom: null
      },
      recommendations: [],
      summary: {}
    };

    try {
      // Run axe-core checks
      results.checks.axeCore = await this.runAxeChecks(url);
      
      // Run pa11y checks
      results.checks.pa11y = await this.runPa11yChecks(url);
      
      // Run custom WCAG checks
      results.checks.custom = await this.runCustomChecks(url);
      
      // Aggregate results
      this.aggregateResults(results);
      
      return results;
    } catch (error) {
      throw new Error(`WCAG check failed: ${error.message}`);
    }
  }

  async runAxeChecks(url) {
    const page = await this.browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      // Inject axe-core
      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      
      // Run axe checks
      const axeResults = await page.evaluate(() => {
        return new Promise((resolve) => {
          axe.run({
            tags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
            rules: {
              'color-contrast': { enabled: true },
              'image-alt': { enabled: true },
              'label': { enabled: true },
              'html-has-lang': { enabled: true },
              'heading-order': { enabled: true },
              'aria-roles': { enabled: true },
              'keyboard': { enabled: true },
              'duplicate-id': { enabled: true },
              'link-name': { enabled: true }
            }
          }, (err, results) => {
            if (err) resolve({ error: err.message });
            resolve(results);
          });
        });
      });

      await page.close();
      return axeResults;
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  async runPa11yChecks(url) {
    try {
      const pa11yResults = await pa11y(url, {
        standard: 'WCAG2AA',
        timeout: 30000,
        wait: 1000,
        chromeLaunchConfig: {
          args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
      });
      
      return pa11yResults;
    } catch (error) {
      return { error: error.message };
    }
  }

  async runCustomChecks(url) {
    const page = await this.browser.newPage();
    
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      
      const customChecks = await page.evaluate(() => {
        const issues = [];
        
        // Check for missing alt attributes
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
          if (!img.alt && img.alt !== '') {
            issues.push({
              type: 'missing-alt',
              severity: 'serious',
              element: img.outerHTML,
              message: 'Image missing alt attribute',
              wcagGuideline: '1.1.1',
              recommendation: 'Add descriptive alt text to the image'
            });
          }
        });

        // Check for missing form labels
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach((input) => {
          if (input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
            const hasLabel = document.querySelector(`label[for="${input.id}"]`) || 
                           input.getAttribute('aria-label') || 
                           input.getAttribute('aria-labelledby');
            if (!hasLabel) {
              issues.push({
                type: 'missing-form-label',
                severity: 'serious',
                element: input.outerHTML,
                message: 'Form control missing label',
                wcagGuideline: '3.3.2',
                recommendation: 'Add a label element or aria-label attribute'
              });
            }
          }
        });

        // Check for missing document language
        const htmlLang = document.documentElement.lang;
        if (!htmlLang) {
          issues.push({
            type: 'missing-doc-language',
            severity: 'serious',
            element: '<html>',
            message: 'Document missing language attribute',
            wcagGuideline: '3.1.1',
            recommendation: 'Add lang attribute to html element (e.g., <html lang="en">)'
          });
        }

        // Check heading structure
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        headings.forEach((heading) => {
          const level = parseInt(heading.tagName.charAt(1));
          if (level > lastLevel + 1) {
            issues.push({
              type: 'heading-hierarchy',
              severity: 'moderate',
              element: heading.outerHTML,
              message: 'Heading levels should not skip levels',
              wcagGuideline: '1.3.1',
              recommendation: 'Use proper heading hierarchy (h1 -> h2 -> h3, etc.)'
            });
          }
          lastLevel = level;
        });

        // Check for duplicate IDs
        const allIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        const duplicateIds = allIds.filter((id, index) => allIds.indexOf(id) !== index);
        duplicateIds.forEach((id) => {
          issues.push({
            type: 'duplicate-id',
            severity: 'serious',
            element: `[id="${id}"]`,
            message: `Duplicate ID found: ${id}`,
            wcagGuideline: '4.1.1',
            recommendation: 'Ensure all IDs are unique on the page'
          });
        });

        // Check for empty link text
        const links = document.querySelectorAll('a');
        links.forEach((link) => {
          const linkText = link.textContent.trim();
          const ariaLabel = link.getAttribute('aria-label');
          if (!linkText && !ariaLabel) {
            issues.push({
              type: 'empty-link-text',
              severity: 'serious',
              element: link.outerHTML,
              message: 'Link has no accessible text',
              wcagGuideline: '2.4.4',
              recommendation: 'Add descriptive text or aria-label to the link'
            });
          }
        });

        return { issues, totalChecked: images.length + inputs.length + headings.length + links.length };
      });

      await page.close();
      return customChecks;
    } catch (error) {
      await page.close();
      throw error;
    }
  }

  aggregateResults(results) {
    let totalIssues = 0;
    let criticalIssues = 0;
    let seriousIssues = 0;
    let moderateIssues = 0;
    let minorIssues = 0;

    // Process axe-core results
    if (results.checks.axeCore && results.checks.axeCore.violations) {
      results.checks.axeCore.violations.forEach(violation => {
        const count = violation.nodes.length;
        totalIssues += count;
        
        switch (violation.impact) {
          case 'critical':
            criticalIssues += count;
            break;
          case 'serious':
            seriousIssues += count;
            break;
          case 'moderate':
            moderateIssues += count;
            break;
          case 'minor':
            minorIssues += count;
            break;
        }
      });
    }

    // Process pa11y results
    if (results.checks.pa11y && results.checks.pa11y.issues) {
      results.checks.pa11y.issues.forEach(issue => {
        totalIssues++;
        switch (issue.type) {
          case 'error':
            seriousIssues++;
            break;
          case 'warning':
            moderateIssues++;
            break;
          case 'notice':
            minorIssues++;
            break;
        }
      });
    }

    // Process custom check results
    if (results.checks.custom && results.checks.custom.issues) {
      results.checks.custom.issues.forEach(issue => {
        totalIssues++;
        switch (issue.severity) {
          case 'critical':
            criticalIssues++;
            break;
          case 'serious':
            seriousIssues++;
            break;
          case 'moderate':
            moderateIssues++;
            break;
          case 'minor':
            minorIssues++;
            break;
        }
      });
    }

    // Calculate overall accessibility score (0-100)
    const maxPossibleIssues = 100; // Baseline for scoring
    const weightedScore = Math.max(0, 100 - (
      (criticalIssues * 10) + 
      (seriousIssues * 5) + 
      (moderateIssues * 2) + 
      (minorIssues * 1)
    ));

    results.totalIssues = totalIssues;
    results.criticalIssues = criticalIssues;
    results.seriousIssues = seriousIssues;
    results.moderateIssues = moderateIssues;
    results.minorIssues = minorIssues;
    results.overallScore = Math.round(weightedScore);

    // Generate recommendations
    this.generateRecommendations(results);
  }

  generateRecommendations(results) {
    const recommendations = [];

    if (results.criticalIssues > 0) {
      recommendations.push({
        priority: 'high',
        message: `Address ${results.criticalIssues} critical accessibility issues immediately`,
        action: 'Fix critical issues that prevent users from accessing content'
      });
    }

    if (results.seriousIssues > 0) {
      recommendations.push({
        priority: 'high',
        message: `Fix ${results.seriousIssues} serious accessibility barriers`,
        action: 'These issues significantly impact user experience'
      });
    }

    if (results.moderateIssues > 0) {
      recommendations.push({
        priority: 'medium',
        message: `Improve ${results.moderateIssues} moderate accessibility issues`,
        action: 'These issues may cause difficulties for some users'
      });
    }

    if (results.overallScore < 60) {
      recommendations.push({
        priority: 'high',
        message: 'Overall accessibility score is below acceptable threshold',
        action: 'Consider comprehensive accessibility audit and remediation'
      });
    } else if (results.overallScore < 80) {
      recommendations.push({
        priority: 'medium',
        message: 'Good accessibility foundation, but room for improvement',
        action: 'Focus on remaining issues to achieve excellent accessibility'
      });
    }

    results.recommendations = recommendations;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.isInitialized = false;
    }
  }
}

module.exports = WCAGChecker;