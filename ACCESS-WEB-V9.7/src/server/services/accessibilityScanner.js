import { PrismaClient } from '@prisma/client';
import { parse } from 'node-html-parser';

const prisma = new PrismaClient();

export class AccessibilityScanner {
  constructor() {
    this.scanConfig = {
      timeout: 30000,
      userAgent: 'AccessWeb-WCAG-Scanner/1.0',
      maxRedirects: 5
    };
  }

  async scanUrl(url, siteConnectionId, scanReason = 'schedule') {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 [ACCESSIBILITY] Starting WCAG scan for: ${url} (${scanReason})`);
      
      // Fetch and analyze HTML content
      const htmlContent = await this.fetchPageContent(url);
      const analysisResults = await this.analyzeHtmlAccessibility(htmlContent, url);
      
      const scanDuration = Date.now() - startTime;
      
      console.log(`✅ [ACCESSIBILITY] Scan completed in ${scanDuration}ms - Errors: ${analysisResults.errorCount}, Warnings: ${analysisResults.warningCount}, Notices: ${analysisResults.noticeCount}`);
      
      // Save results to database
      const savedResult = await this.saveResults({
        siteConnectionId,
        scanUrl: url,
        scanStatus: 'completed',
        errorCount: analysisResults.errorCount,
        warningCount: analysisResults.warningCount,
        noticeCount: analysisResults.noticeCount,
        score: analysisResults.score,
        rawResults: analysisResults.rawData,
        scanDuration,
        userAgent: this.scanConfig.userAgent,
        scanReason: scanReason
      });
      
      // Update site connection last scan time
      await this.updateSiteConnectionScanTime(siteConnectionId);
      
      return savedResult;
      
    } catch (error) {
      const scanDuration = Date.now() - startTime;
      
      console.error(`❌ [ACCESSIBILITY] Scan failed for ${url}:`, error.message);
      
      // Save error result to database
      const errorResult = await this.saveResults({
        siteConnectionId,
        scanUrl: url,
        scanStatus: 'failed',
        errorCount: 0,
        warningCount: 0,
        noticeCount: 0,
        score: null,
        rawResults: {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        },
        scanDuration,
        userAgent: this.scanConfig.userAgent,
        scanReason: scanReason
      });
      
      throw error;
    }
  }

  async fetchPageContent(url) {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': this.scanConfig.userAgent,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: this.scanConfig.timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  }

  async analyzeHtmlAccessibility(htmlContent, url) {
    const root = parse(htmlContent);
    const issues = [];
    
    // WCAG 2.1 Level AA Checks
    
    // 1.1.1 Non-text Content - Images without alt text
    const images = root.querySelectorAll('img');
    images.forEach((img, index) => {
      const alt = img.getAttribute('alt');
      const src = img.getAttribute('src');
      
      if (alt === null || alt === undefined) {
        issues.push({
          type: 'error',
          code: 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37',
          message: 'Image elements must have an alt attribute',
          element: `img[src="${src}"]`,
          selector: `img:nth-of-type(${index + 1})`,
          guideline: '1.1.1 Non-text Content'
        });
      } else if (alt.trim() === '' && !img.getAttribute('role') && !img.getAttribute('aria-label')) {
        // Decorative images should have empty alt or role="presentation"
        issues.push({
          type: 'warning',
          code: 'WCAG2AA.Principle1.Guideline1_1.1_1_1.H67.2',
          message: 'Image with empty alt text should have role="presentation" or be decorative',
          element: `img[src="${src}"]`,
          selector: `img:nth-of-type(${index + 1})`,
          guideline: '1.1.1 Non-text Content'
        });
      }
    });

    // 1.3.1 Info and Relationships - Heading structure
    const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastHeadingLevel = 0;
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      
      if (level > lastHeadingLevel + 1) {
        issues.push({
          type: 'error',
          code: 'WCAG2AA.Principle1.Guideline1_3.1_3_1.G141',
          message: `Heading level ${level} skips intermediate levels`,
          element: heading.tagName.toLowerCase(),
          selector: `${heading.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
          guideline: '1.3.1 Info and Relationships'
        });
      }
      
      lastHeadingLevel = level;
    });

    // Check for missing h1
    const h1Elements = root.querySelectorAll('h1');
    if (h1Elements.length === 0) {
      issues.push({
        type: 'error',
        code: 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H42.2',
        message: 'Page should have at least one h1 element',
        element: 'html',
        selector: 'html',
        guideline: '1.3.1 Info and Relationships'
      });
    } else if (h1Elements.length > 1) {
      issues.push({
        type: 'warning',
        code: 'WCAG2AA.Principle1.Guideline1_3.1_3_1.H42.1',
        message: 'Page has multiple h1 elements, consider using only one',
        element: 'h1',
        selector: 'h1',
        guideline: '1.3.1 Info and Relationships'
      });
    }

    // 1.4.3 Contrast - Basic check for background/text colors
    const elementsWithStyle = root.querySelectorAll('[style*="color"], [style*="background"]');
    elementsWithStyle.forEach((element, index) => {
      const style = element.getAttribute('style');
      if (style && (style.includes('color:') || style.includes('background:'))) {
        issues.push({
          type: 'notice',
          code: 'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18',
          message: 'Manual review required: Check color contrast ratio meets WCAG AA standards (4.5:1)',
          element: element.tagName.toLowerCase(),
          selector: `${element.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
          guideline: '1.4.3 Contrast (Minimum)'
        });
      }
    });

    // 2.1.1 Keyboard - Form controls without labels
    const formControls = root.querySelectorAll('input:not([type="hidden"]), select, textarea');
    formControls.forEach((control, index) => {
      const id = control.getAttribute('id');
      const ariaLabel = control.getAttribute('aria-label');
      const ariaLabelledby = control.getAttribute('aria-labelledby');
      const title = control.getAttribute('title');
      
      if (id) {
        const label = root.querySelector(`label[for="${id}"]`);
        if (!label && !ariaLabel && !ariaLabelledby && !title) {
          issues.push({
            type: 'error',
            code: 'WCAG2AA.Principle2.Guideline2_1.2_1_1.H91.A.EmptyNoId',
            message: 'Form control has no associated label',
            element: control.tagName.toLowerCase(),
            selector: `${control.tagName.toLowerCase()}:nth-of-type(${index + 1})`,
            guideline: '2.1.1 Keyboard'
          });
        }
      }
    });

    // 2.4.1 Bypass Blocks - Skip links
    const skipLinks = root.querySelectorAll('a[href*="#main"], a[href*="#content"], a[href*="#skip"]');
    if (skipLinks.length === 0) {
      issues.push({
        type: 'warning',
        code: 'WCAG2AA.Principle2.Guideline2_4.2_4_1.H69.1',
        message: 'Consider adding skip navigation links for keyboard users',
        element: 'body',
        selector: 'body',
        guideline: '2.4.1 Bypass Blocks'
      });
    }

    // 2.4.2 Page Titled
    const titleElements = root.querySelectorAll('title');
    if (titleElements.length === 0) {
      issues.push({
        type: 'error',
        code: 'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
        message: 'Page must have a title element',
        element: 'head',
        selector: 'head',
        guideline: '2.4.2 Page Titled'
      });
    } else if (titleElements[0].innerHTML.trim() === '') {
      issues.push({
        type: 'error',
        code: 'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.1.EmptyTitle',
        message: 'Page title must not be empty',
        element: 'title',
        selector: 'title',
        guideline: '2.4.2 Page Titled'
      });
    }

    // 3.1.1 Language of Page
    const htmlElement = root.querySelector('html');
    if (!htmlElement || !htmlElement.getAttribute('lang')) {
      issues.push({
        type: 'error',
        code: 'WCAG2AA.Principle3.Guideline3_1.3_1_1.H57.2',
        message: 'HTML element must have a lang attribute',
        element: 'html',
        selector: 'html',
        guideline: '3.1.1 Language of Page'
      });
    }

    // 4.1.1 Parsing - Basic HTML validation
    const duplicateIds = this.findDuplicateIds(root);
    duplicateIds.forEach(id => {
      issues.push({
        type: 'error',
        code: 'WCAG2AA.Principle4.Guideline4_1.4_1_1.F77',
        message: `Duplicate id attribute: "${id}"`,
        element: `[id="${id}"]`,
        selector: `[id="${id}"]`,
        guideline: '4.1.1 Parsing'
      });
    });

    // Calculate counts and score
    const errorCount = issues.filter(issue => issue.type === 'error').length;
    const warningCount = issues.filter(issue => issue.type === 'warning').length;
    const noticeCount = issues.filter(issue => issue.type === 'notice').length;
    
    // Calculate accessibility score (0-100)
    const totalIssues = errorCount + (warningCount * 0.5);
    const maxIssues = 50; // Baseline for scoring
    const score = Math.max(0, Math.min(100, 100 - (totalIssues / maxIssues) * 100));

    return {
      errorCount,
      warningCount,
      noticeCount,
      score: parseFloat(score.toFixed(2)),
      rawData: {
        issues,
        summary: {
          total: issues.length,
          errors: errorCount,
          warnings: warningCount,
          notices: noticeCount,
          url: url
        },
        pageInfo: {
          title: titleElements.length > 0 ? titleElements[0].innerHTML.trim() : '',
          lang: htmlElement ? htmlElement.getAttribute('lang') : null,
          headingCount: headings.length,
          imageCount: images.length,
          formControlCount: formControls.length
        },
        scanConfig: this.scanConfig,
        timestamp: new Date().toISOString()
      }
    };
  }

  findDuplicateIds(root) {
    const ids = [];
    const duplicates = [];
    
    const elementsWithId = root.querySelectorAll('[id]');
    elementsWithId.forEach(element => {
      const id = element.getAttribute('id');
      if (id) {
        if (ids.includes(id) && !duplicates.includes(id)) {
          duplicates.push(id);
        } else {
          ids.push(id);
        }
      }
    });
    
    return duplicates;
  }

  processResults(results) {
    if (!Array.isArray(results)) {
      return {
        errorCount: 0,
        warningCount: 0,
        noticeCount: 0,
        score: 100,
        rawData: { issues: [], documentTitle: '', pageUrl: '' }
      };
    }

    const errors = results.filter(issue => issue.type === 'error');
    const warnings = results.filter(issue => issue.type === 'warning');
    const notices = results.filter(issue => issue.type === 'notice');

    // Calculate accessibility score (0-100)
    const totalIssues = errors.length + warnings.length;
    const maxIssues = 100; // Baseline for scoring
    const score = Math.max(0, Math.min(100, 100 - (totalIssues / maxIssues) * 100));

    return {
      errorCount: errors.length,
      warningCount: warnings.length,
      noticeCount: notices.length,
      score: parseFloat(score.toFixed(2)),
      rawData: {
        issues: results,
        summary: {
          total: results.length,
          errors: errors.length,
          warnings: warnings.length,
          notices: notices.length
        },
        scanConfig: this.pa11yConfig,
        timestamp: new Date().toISOString()
      }
    };
  }

  async saveResults(resultData) {
    try {
      const savedResult = await prisma.scanResult.create({
        data: resultData
      });
      
      console.log(`💾 [ACCESSIBILITY] Scan results saved with ID: ${savedResult.id}`);
      return savedResult;
      
    } catch (error) {
      console.error('❌ [ACCESSIBILITY] Failed to save scan results:', error);
      throw error;
    }
  }

  async updateSiteConnectionScanTime(siteConnectionId) {
    try {
      await prisma.siteConnection.update({
        where: { id: siteConnectionId },
        data: { lastScanAt: new Date() }
      });
      
      console.log(`⏰ [ACCESSIBILITY] Updated last scan time for connection ${siteConnectionId}`);
      
    } catch (error) {
      console.error('❌ [ACCESSIBILITY] Failed to update scan time:', error);
    }
  }

  async getRecentResults(siteConnectionId, limit = 10) {
    try {
      const results = await prisma.scanResult.findMany({
        where: { siteConnectionId },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
      
      return results;
      
    } catch (error) {
      console.error('❌ [ACCESSIBILITY] Failed to fetch scan results:', error);
      throw error;
    }
  }

  async getScanHistory(siteConnectionId, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    try {
      const results = await prisma.scanResult.findMany({
        where: {
          siteConnectionId,
          createdAt: {
            gte: startDate
          }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return results;
      
    } catch (error) {
      console.error('❌ [ACCESSIBILITY] Failed to fetch scan history:', error);
      throw error;
    }
  }
}

export const accessibilityScanner = new AccessibilityScanner();