import puppeteer from 'puppeteer';
import { AxePuppeteer } from '@axe-core/puppeteer';

/**
 * Comprehensive WCAG 2.2 Checker
 * Implements worldwide WCAG guidelines and provides detailed accessibility analysis
 */
class ComprehensiveWCAGChecker {
  constructor() {
    this.wcagRules = this.initializeWCAGRules();
    this.severityLevels = {
      critical: 4,
      serious: 3,
      moderate: 2,
      minor: 1
    };
  }

  /**
   * Initialize comprehensive WCAG 2.2 rules based on worldwide guidelines
   */
  initializeWCAGRules() {
    return {
      // PRINCIPLE 1: PERCEIVABLE
      perceivable: {
        '1.1.1': {
          name: 'Non-text Content',
          level: 'A',
          description: 'All non-text content has text alternatives',
          principle: 'Perceivable'
        },
        '1.2.1': {
          name: 'Audio-only and Video-only (Prerecorded)',
          level: 'A',
          description: 'Alternatives for prerecorded audio-only and video-only media',
          principle: 'Perceivable'
        },
        '1.2.2': {
          name: 'Captions (Prerecorded)',
          level: 'A',
          description: 'Captions for prerecorded audio content in synchronized media',
          principle: 'Perceivable'
        },
        '1.3.1': {
          name: 'Info and Relationships',
          level: 'A',
          description: 'Information and relationships are programmatically determinable',
          principle: 'Perceivable'
        },
        '1.3.2': {
          name: 'Meaningful Sequence',
          level: 'A',
          description: 'Content has a meaningful sequence when presented programmatically',
          principle: 'Perceivable'
        },
        '1.3.3': {
          name: 'Sensory Characteristics',
          level: 'A',
          description: 'Instructions don\'t rely solely on sensory characteristics',
          principle: 'Perceivable'
        },
        '1.4.1': {
          name: 'Use of Color',
          level: 'A',
          description: 'Color is not the only means of conveying information',
          principle: 'Perceivable'
        },
        '1.4.2': {
          name: 'Audio Control',
          level: 'A',
          description: 'Audio control mechanism is available',
          principle: 'Perceivable'
        },
        '1.4.3': {
          name: 'Contrast (Minimum)',
          level: 'AA',
          description: 'Text and background have sufficient color contrast (4.5:1)',
          principle: 'Perceivable'
        },
        '1.4.4': {
          name: 'Resize Text',
          level: 'AA',
          description: 'Text can be resized up to 200% without loss of functionality',
          principle: 'Perceivable'
        },
        '1.4.5': {
          name: 'Images of Text',
          level: 'AA',
          description: 'Text is used rather than images of text',
          principle: 'Perceivable'
        },
        '1.4.6': {
          name: 'Contrast (Enhanced)',
          level: 'AAA',
          description: 'Enhanced color contrast ratio (7:1)',
          principle: 'Perceivable'
        },
        '1.4.10': {
          name: 'Reflow',
          level: 'AA',
          description: 'Content reflows without horizontal scrolling at 320px width',
          principle: 'Perceivable'
        },
        '1.4.11': {
          name: 'Non-text Contrast',
          level: 'AA',
          description: 'Visual presentation of UI components has sufficient contrast',
          principle: 'Perceivable'
        },
        '1.4.12': {
          name: 'Text Spacing',
          level: 'AA',
          description: 'Content adapts to increased text spacing',
          principle: 'Perceivable'
        },
        '1.4.13': {
          name: 'Content on Hover or Focus',
          level: 'AA',
          description: 'Additional content triggered by hover or focus is controllable',
          principle: 'Perceivable'
        }
      },

      // PRINCIPLE 2: OPERABLE
      operable: {
        '2.1.1': {
          name: 'Keyboard',
          level: 'A',
          description: 'All functionality available from keyboard',
          principle: 'Operable'
        },
        '2.1.2': {
          name: 'No Keyboard Trap',
          level: 'A',
          description: 'Keyboard focus is not trapped',
          principle: 'Operable'
        },
        '2.1.4': {
          name: 'Character Key Shortcuts',
          level: 'A',
          description: 'Character key shortcuts can be turned off or remapped',
          principle: 'Operable'
        },
        '2.2.1': {
          name: 'Timing Adjustable',
          level: 'A',
          description: 'Time limits are adjustable',
          principle: 'Operable'
        },
        '2.2.2': {
          name: 'Pause, Stop, Hide',
          level: 'A',
          description: 'Moving content can be paused, stopped, or hidden',
          principle: 'Operable'
        },
        '2.3.1': {
          name: 'Three Flashes or Below Threshold',
          level: 'A',
          description: 'Content doesn\'t flash more than 3 times per second',
          principle: 'Operable'
        },
        '2.4.1': {
          name: 'Bypass Blocks',
          level: 'A',
          description: 'Skip links or other bypass mechanisms are available',
          principle: 'Operable'
        },
        '2.4.2': {
          name: 'Page Titled',
          level: 'A',
          description: 'Web pages have descriptive titles',
          principle: 'Operable'
        },
        '2.4.3': {
          name: 'Focus Order',
          level: 'A',
          description: 'Focus order preserves meaning and operability',
          principle: 'Operable'
        },
        '2.4.4': {
          name: 'Link Purpose (In Context)',
          level: 'A',
          description: 'Link purpose is clear from link text or context',
          principle: 'Operable'
        },
        '2.4.5': {
          name: 'Multiple Ways',
          level: 'AA',
          description: 'Multiple ways to locate pages are available',
          principle: 'Operable'
        },
        '2.4.6': {
          name: 'Headings and Labels',
          level: 'AA',
          description: 'Headings and labels describe topic or purpose',
          principle: 'Operable'
        },
        '2.4.7': {
          name: 'Focus Visible',
          level: 'AA',
          description: 'Keyboard focus indicator is visible',
          principle: 'Operable'
        },
        '2.5.1': {
          name: 'Pointer Gestures',
          level: 'A',
          description: 'Multipoint or path-based gestures have single-pointer alternatives',
          principle: 'Operable'
        },
        '2.5.2': {
          name: 'Pointer Cancellation',
          level: 'A',
          description: 'Down-event triggering can be aborted or undone',
          principle: 'Operable'
        },
        '2.5.3': {
          name: 'Label in Name',
          level: 'A',
          description: 'Accessible name contains visible label text',
          principle: 'Operable'
        },
        '2.5.4': {
          name: 'Motion Actuation',
          level: 'A',
          description: 'Device motion can be disabled',
          principle: 'Operable'
        }
      },

      // PRINCIPLE 3: UNDERSTANDABLE
      understandable: {
        '3.1.1': {
          name: 'Language of Page',
          level: 'A',
          description: 'Primary language of page is programmatically determinable',
          principle: 'Understandable'
        },
        '3.1.2': {
          name: 'Language of Parts',
          level: 'AA',
          description: 'Language of page parts is programmatically determinable',
          principle: 'Understandable'
        },
        '3.2.1': {
          name: 'On Focus',
          level: 'A',
          description: 'Focus doesn\'t trigger unexpected context changes',
          principle: 'Understandable'
        },
        '3.2.2': {
          name: 'On Input',
          level: 'A',
          description: 'Input doesn\'t trigger unexpected context changes',
          principle: 'Understandable'
        },
        '3.2.3': {
          name: 'Consistent Navigation',
          level: 'AA',
          description: 'Navigation is consistent across pages',
          principle: 'Understandable'
        },
        '3.2.4': {
          name: 'Consistent Identification',
          level: 'AA',
          description: 'Components with same functionality are consistently identified',
          principle: 'Understandable'
        },
        '3.3.1': {
          name: 'Error Identification',
          level: 'A',
          description: 'Input errors are identified and described',
          principle: 'Understandable'
        },
        '3.3.2': {
          name: 'Labels or Instructions',
          level: 'A',
          description: 'Labels or instructions are provided for user input',
          principle: 'Understandable'
        },
        '3.3.3': {
          name: 'Error Suggestion',
          level: 'AA',
          description: 'Error correction suggestions are provided',
          principle: 'Understandable'
        },
        '3.3.4': {
          name: 'Error Prevention (Legal, Financial, Data)',
          level: 'AA',
          description: 'Error prevention for important transactions',
          principle: 'Understandable'
        }
      },

      // PRINCIPLE 4: ROBUST
      robust: {
        '4.1.1': {
          name: 'Parsing',
          level: 'A',
          description: 'Markup can be parsed unambiguously',
          principle: 'Robust'
        },
        '4.1.2': {
          name: 'Name, Role, Value',
          level: 'A',
          description: 'Name, role, and value are programmatically determinable',
          principle: 'Robust'
        },
        '4.1.3': {
          name: 'Status Messages',
          level: 'AA',
          description: 'Status messages are programmatically determinable',
          principle: 'Robust'
        }
      }
    };
  }

  /**
   * Perform comprehensive WCAG scan
   */
  async performScan(url, options = {}) {
    const startTime = Date.now();
    let browser = null;

    try {
      // Launch browser
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
        defaultViewport: { width: 1280, height: 720 }
      });

      const page = await browser.newPage();
      
      // Set user agent to avoid bot detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      
      // Navigate to page
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Run axe-core analysis
      const axeResults = await new AxePuppeteer(page)
        .withTags(['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21aa', 'wcag22aa'])
        .analyze();

      // Perform custom WCAG checks
      const customChecks = await this.performCustomChecks(page);

      // Analyze results and generate comprehensive report
      const report = await this.generateComprehensiveReport(url, axeResults, customChecks, startTime);

      return report;

    } catch (error) {
      console.error('WCAG scan error:', error);
      throw new Error(`Scan failed: ${error.message}`);
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Perform custom WCAG checks beyond axe-core
   */
  async performCustomChecks(page) {
    const checks = {
      colorContrast: await this.checkColorContrast(page),
      focusManagement: await this.checkFocusManagement(page),
      semanticStructure: await this.checkSemanticStructure(page),
      formAccessibility: await this.checkFormAccessibility(page),
      imageAccessibility: await this.checkImageAccessibility(page),
      linkAccessibility: await this.checkLinkAccessibility(page),
      keyboardNavigation: await this.checkKeyboardNavigation(page),
      headingStructure: await this.checkHeadingStructure(page),
      languageAttributes: await this.checkLanguageAttributes(page),
      skipLinks: await this.checkSkipLinks(page)
    };

    return checks;
  }

  /**
   * Check color contrast ratios
   */
  async checkColorContrast(page) {
    return await page.evaluate(() => {
      const issues = [];
      const elements = document.querySelectorAll('*');

      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const backgroundColor = styles.backgroundColor;
        
        if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          // Simplified contrast calculation
          const textElement = el.textContent?.trim();
          if (textElement && textElement.length > 0) {
            const fontSize = parseFloat(styles.fontSize);
            const fontWeight = styles.fontWeight;
            
            // Check if text is large (18pt+ or 14pt+ bold)
            const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
            const requiredRatio = isLargeText ? 3.0 : 4.5;
            
            // Simplified contrast check - in real implementation, use proper color contrast calculation
            issues.push({
              element: el.tagName.toLowerCase(),
              selector: el.className ? `.${el.className.split(' ')[0]}` : el.tagName.toLowerCase(),
              issue: 'Color contrast needs verification',
              wcagRule: '1.4.3',
              severity: 'moderate',
              recommendation: `Ensure contrast ratio meets ${requiredRatio}:1 minimum requirement`
            });
          }
        }
      });

      return issues.slice(0, 10); // Limit results
    });
  }

  /**
   * Check focus management
   */
  async checkFocusManagement(page) {
    return await page.evaluate(() => {
      const issues = [];
      const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');

      focusableElements.forEach(el => {
        // Check for visible focus indicators
        const styles = window.getComputedStyle(el, ':focus');
        const outline = styles.outline;
        const outlineWidth = styles.outlineWidth;
        
        if (outline === 'none' && outlineWidth === '0px') {
          issues.push({
            element: el.tagName.toLowerCase(),
            selector: el.className ? `.${el.className.split(' ')[0]}` : el.tagName.toLowerCase(),
            issue: 'Missing visible focus indicator',
            wcagRule: '2.4.7',
            severity: 'serious',
            recommendation: 'Add visible focus indicators using CSS :focus pseudo-class'
          });
        }
      });

      return issues;
    });
  }

  /**
   * Check semantic structure
   */
  async checkSemanticStructure(page) {
    return await page.evaluate(() => {
      const issues = [];
      
      // Check for semantic HTML elements
      const semanticElements = ['header', 'nav', 'main', 'article', 'section', 'aside', 'footer'];
      let foundSemanticElements = 0;
      
      semanticElements.forEach(element => {
        if (document.querySelector(element)) {
          foundSemanticElements++;
        }
      });

      if (foundSemanticElements < 3) {
        issues.push({
          element: 'document',
          selector: 'html',
          issue: 'Limited use of semantic HTML elements',
          wcagRule: '1.3.1',
          severity: 'moderate',
          recommendation: 'Use semantic HTML elements like <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>'
        });
      }

      // Check for proper heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let previousLevel = 0;
      
      headings.forEach(heading => {
        const currentLevel = parseInt(heading.tagName.charAt(1));
        if (currentLevel > previousLevel + 1) {
          issues.push({
            element: heading.tagName.toLowerCase(),
            selector: heading.className ? `.${heading.className.split(' ')[0]}` : heading.tagName.toLowerCase(),
            issue: 'Heading level skipped',
            wcagRule: '1.3.1',
            severity: 'moderate',
            recommendation: 'Use heading levels in sequential order (don\'t skip levels)'
          });
        }
        previousLevel = currentLevel;
      });

      return issues;
    });
  }

  /**
   * Check form accessibility
   */
  async checkFormAccessibility(page) {
    return await page.evaluate(() => {
      const issues = [];
      const formControls = document.querySelectorAll('input, textarea, select');

      formControls.forEach(control => {
        // Check for labels
        const hasLabel = control.labels && control.labels.length > 0;
        const hasAriaLabel = control.getAttribute('aria-label');
        const hasAriaLabelledby = control.getAttribute('aria-labelledby');

        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
          issues.push({
            element: control.tagName.toLowerCase(),
            selector: control.id ? `#${control.id}` : control.tagName.toLowerCase(),
            issue: 'Form control missing accessible label',
            wcagRule: '3.3.2',
            severity: 'serious',
            recommendation: 'Add a <label> element or aria-label attribute to describe the form control'
          });
        }
      });

      return issues;
    });
  }

  /**
   * Check image accessibility
   */
  async checkImageAccessibility(page) {
    return await page.evaluate(() => {
      const issues = [];
      const images = document.querySelectorAll('img');

      images.forEach(img => {
        const altText = img.getAttribute('alt');
        const ariaLabel = img.getAttribute('aria-label');
        const role = img.getAttribute('role');

        if (altText === null && !ariaLabel && role !== 'presentation') {
          issues.push({
            element: 'img',
            selector: img.src ? `img[src*="${img.src.split('/').pop()}"]` : 'img',
            issue: 'Image missing alternative text',
            wcagRule: '1.1.1',
            severity: 'critical',
            recommendation: 'Add meaningful alt text or use alt="" for decorative images'
          });
        }
      });

      return issues;
    });
  }

  /**
   * Check link accessibility
   */
  async checkLinkAccessibility(page) {
    return await page.evaluate(() => {
      const issues = [];
      const links = document.querySelectorAll('a');

      links.forEach(link => {
        const linkText = link.textContent.trim();
        const ariaLabel = link.getAttribute('aria-label');
        const hasText = linkText.length > 0 || ariaLabel;

        if (!hasText) {
          issues.push({
            element: 'a',
            selector: link.href ? `a[href="${link.href}"]` : 'a',
            issue: 'Link without accessible text',
            wcagRule: '2.4.4',
            severity: 'serious',
            recommendation: 'Add descriptive text content or aria-label to the link'
          });
        }

        // Check for vague link text
        const vagueTexts = ['click here', 'read more', 'here', 'more', 'link'];
        if (vagueTexts.includes(linkText.toLowerCase())) {
          issues.push({
            element: 'a',
            selector: link.href ? `a[href="${link.href}"]` : 'a',
            issue: 'Vague link text',
            wcagRule: '2.4.4',
            severity: 'moderate',
            recommendation: 'Use descriptive link text that explains the destination or purpose'
          });
        }
      });

      return issues;
    });
  }

  /**
   * Check keyboard navigation
   */
  async checkKeyboardNavigation(page) {
    return await page.evaluate(() => {
      const issues = [];
      const interactiveElements = document.querySelectorAll('button, a, input, textarea, select, [role="button"], [role="link"]');

      interactiveElements.forEach(el => {
        const tabIndex = el.getAttribute('tabindex');
        
        if (tabIndex && parseInt(tabIndex) > 0) {
          issues.push({
            element: el.tagName.toLowerCase(),
            selector: el.className ? `.${el.className.split(' ')[0]}` : el.tagName.toLowerCase(),
            issue: 'Positive tabindex found',
            wcagRule: '2.4.3',
            severity: 'moderate',
            recommendation: 'Avoid positive tabindex values; use 0 or -1, or restructure HTML for natural tab order'
          });
        }
      });

      return issues;
    });
  }

  /**
   * Check heading structure
   */
  async checkHeadingStructure(page) {
    return await page.evaluate(() => {
      const issues = [];
      const h1Elements = document.querySelectorAll('h1');

      if (h1Elements.length === 0) {
        issues.push({
          element: 'document',
          selector: 'html',
          issue: 'Missing h1 heading',
          wcagRule: '2.4.6',
          severity: 'serious',
          recommendation: 'Add an h1 heading to describe the main topic of the page'
        });
      } else if (h1Elements.length > 1) {
        issues.push({
          element: 'h1',
          selector: 'h1',
          issue: 'Multiple h1 headings found',
          wcagRule: '2.4.6',
          severity: 'moderate',
          recommendation: 'Use only one h1 heading per page to maintain proper heading hierarchy'
        });
      }

      return issues;
    });
  }

  /**
   * Check language attributes
   */
  async checkLanguageAttributes(page) {
    return await page.evaluate(() => {
      const issues = [];
      const htmlElement = document.documentElement;
      const lang = htmlElement.getAttribute('lang');

      if (!lang) {
        issues.push({
          element: 'html',
          selector: 'html',
          issue: 'Missing language attribute',
          wcagRule: '3.1.1',
          severity: 'serious',
          recommendation: 'Add lang attribute to html element (e.g., <html lang="en">)'
        });
      }

      return issues;
    });
  }

  /**
   * Check for skip links
   */
  async checkSkipLinks(page) {
    return await page.evaluate(() => {
      const issues = [];
      const skipLinks = document.querySelectorAll('a[href^="#"]');
      
      let hasSkipToMain = false;
      skipLinks.forEach(link => {
        const linkText = link.textContent.toLowerCase();
        if (linkText.includes('skip') && (linkText.includes('main') || linkText.includes('content'))) {
          hasSkipToMain = true;
        }
      });

      if (!hasSkipToMain) {
        issues.push({
          element: 'document',
          selector: 'body',
          issue: 'Missing skip to main content link',
          wcagRule: '2.4.1',
          severity: 'moderate',
          recommendation: 'Add a skip link at the beginning of the page to allow users to bypass navigation'
        });
      }

      return issues;
    });
  }

  /**
   * Generate comprehensive WCAG report
   */
  async generateComprehensiveReport(url, axeResults, customChecks, startTime) {
    const endTime = Date.now();
    const scanDuration = endTime - startTime;

    // Process axe-core results
    const axeIssues = this.processAxeResults(axeResults);
    
    // Process custom check results
    const customIssues = this.processCustomChecks(customChecks);

    // Combine all issues
    const allIssues = [...axeIssues, ...customIssues];

    // Group issues by WCAG principle
    const issuesByPrinciple = this.groupIssuesByPrinciple(allIssues);

    // Calculate severity breakdown
    const severityBreakdown = this.calculateSeverityBreakdown(allIssues);

    // Calculate accessibility score
    const accessibilityScore = this.calculateAccessibilityScore(allIssues, axeResults.passes?.length || 0);

    // Determine WCAG conformance level
    const conformanceLevel = this.determineConformanceLevel(allIssues);

    // Generate passed checks list
    const passedChecks = this.generatePassedChecks(axeResults.passes);

    return {
      url,
      scanDuration,
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: allIssues.length,
        criticalIssues: severityBreakdown.critical,
        seriousIssues: severityBreakdown.serious,
        moderateIssues: severityBreakdown.moderate,
        minorIssues: severityBreakdown.minor,
        passedChecks: passedChecks.length,
        accessibilityScore,
        conformanceLevel
      },
      issuesByPrinciple,
      detailedIssues: allIssues,
      passedChecks,
      wcagGuidelines: this.wcagRules,
      scanMetadata: {
        toolVersion: '2.2.0',
        wcagVersion: '2.2',
        scanType: 'comprehensive',
        userAgent: 'AccessWeb WCAG Checker'
      }
    };
  }

  /**
   * Process axe-core results into standardized format
   */
  processAxeResults(axeResults) {
    const issues = [];

    if (axeResults.violations) {
      axeResults.violations.forEach(violation => {
        violation.nodes.forEach(node => {
          const wcagRule = this.extractWCAGRule(violation.tags);
          issues.push({
            id: `axe-${violation.id}-${Date.now()}-${Math.random()}`,
            source: 'axe-core',
            wcagRule: wcagRule,
            ruleName: this.getRuleName(wcagRule),
            severity: this.mapAxeSeverity(violation.impact),
            principle: this.getPrincipleFromRule(wcagRule),
            element: node.target.join(' '),
            description: violation.description,
            helpUrl: violation.helpUrl,
            recommendation: violation.help,
            location: node.target.join(' '),
            html: node.html
          });
        });
      });
    }

    return issues;
  }

  /**
   * Process custom check results
   */
  processCustomChecks(customChecks) {
    const issues = [];

    Object.entries(customChecks).forEach(([checkType, checkResults]) => {
      checkResults.forEach(issue => {
        issues.push({
          id: `custom-${checkType}-${Date.now()}-${Math.random()}`,
          source: 'custom',
          wcagRule: issue.wcagRule,
          ruleName: this.getRuleName(issue.wcagRule),
          severity: issue.severity,
          principle: this.getPrincipleFromRule(issue.wcagRule),
          element: issue.element,
          selector: issue.selector,
          description: issue.issue,
          recommendation: issue.recommendation,
          location: issue.selector
        });
      });
    });

    return issues;
  }

  /**
   * Group issues by WCAG principle
   */
  groupIssuesByPrinciple(issues) {
    const grouped = {
      perceivable: [],
      operable: [],
      understandable: [],
      robust: [],
      other: []
    };

    issues.forEach(issue => {
      const principle = issue.principle?.toLowerCase() || 'other';
      if (grouped[principle]) {
        grouped[principle].push(issue);
      } else {
        grouped.other.push(issue);
      }
    });

    return grouped;
  }

  /**
   * Calculate severity breakdown
   */
  calculateSeverityBreakdown(issues) {
    const breakdown = {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    };

    issues.forEach(issue => {
      if (breakdown.hasOwnProperty(issue.severity)) {
        breakdown[issue.severity]++;
      }
    });

    return breakdown;
  }

  /**
   * Calculate accessibility score (0-100)
   */
  calculateAccessibilityScore(issues, passedCount = 0) {
    const totalChecks = issues.length + passedCount;
    if (totalChecks === 0) return 100;

    // Weight issues by severity
    let weightedIssueScore = 0;
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': weightedIssueScore += 10; break;
        case 'serious': weightedIssueScore += 6; break;
        case 'moderate': weightedIssueScore += 3; break;
        case 'minor': weightedIssueScore += 1; break;
      }
    });

    // Calculate score
    const maxPossibleScore = totalChecks * 10; // Assuming all issues were critical
    const score = Math.max(0, Math.round(((maxPossibleScore - weightedIssueScore) / maxPossibleScore) * 100));
    
    return Math.min(100, score);
  }

  /**
   * Determine WCAG conformance level
   */
  determineConformanceLevel(issues) {
    const hasLevelAIssues = issues.some(issue => this.isLevelA(issue.wcagRule));
    const hasLevelAAIssues = issues.some(issue => this.isLevelAA(issue.wcagRule));

    if (hasLevelAIssues) return 'Non-compliant';
    if (hasLevelAAIssues) return 'A';
    return 'AA';
  }

  /**
   * Generate list of passed checks
   */
  generatePassedChecks(axePasses = []) {
    return axePasses.map(pass => ({
      id: pass.id,
      description: pass.description,
      help: pass.help,
      wcagRule: this.extractWCAGRule(pass.tags),
      impact: 'passed'
    }));
  }

  // Helper methods
  extractWCAGRule(tags) {
    const wcagTag = tags.find(tag => tag.match(/wcag\d{3}/));
    if (wcagTag) {
      const match = wcagTag.match(/wcag(\d)(\d)(\d)/);
      if (match) {
        return `${match[1]}.${match[2]}.${match[3]}`;
      }
    }
    return null;
  }

  getRuleName(wcagRule) {
    if (!wcagRule) return 'Unknown Rule';
    
    for (const principle of Object.values(this.wcagRules)) {
      if (principle[wcagRule]) {
        return principle[wcagRule].name;
      }
    }
    return `WCAG ${wcagRule}`;
  }

  getPrincipleFromRule(wcagRule) {
    if (!wcagRule) return 'Other';
    
    for (const [principleName, rules] of Object.entries(this.wcagRules)) {
      if (rules[wcagRule]) {
        return rules[wcagRule].principle;
      }
    }
    return 'Other';
  }

  mapAxeSeverity(impact) {
    const mapping = {
      'critical': 'critical',
      'serious': 'serious',
      'moderate': 'moderate',
      'minor': 'minor'
    };
    return mapping[impact] || 'moderate';
  }

  isLevelA(wcagRule) {
    if (!wcagRule) return false;
    
    for (const principle of Object.values(this.wcagRules)) {
      if (principle[wcagRule] && principle[wcagRule].level === 'A') {
        return true;
      }
    }
    return false;
  }

  isLevelAA(wcagRule) {
    if (!wcagRule) return false;
    
    for (const principle of Object.values(this.wcagRules)) {
      if (principle[wcagRule] && principle[wcagRule].level === 'AA') {
        return true;
      }
    }
    return false;
  }
}

export default ComprehensiveWCAGChecker;