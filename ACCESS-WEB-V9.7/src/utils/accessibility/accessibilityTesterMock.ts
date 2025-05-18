/**
 * Mock implementation of accessibility testing
 * This allows us to simulate various error conditions for testing
 */

import { checkWebsiteAccessibility, WebsiteConnectionError } from '../websiteConnectionChecker';

/**
 * Test a website for accessibility issues
 * This is a mock implementation for testing error handling
 * 
 * @param url The URL to test
 * @param region The region to apply standards for
 * @param options Additional testing options
 * @returns Mock test results or throws WebsiteConnectionError
 */
export async function testAccessibilityWithErrorHandling(
  url: string,
  region: string = 'global',
  options: any = {}
): Promise<any> {
  // First check if the website is accessible at all
  try {
    await checkWebsiteAccessibility(url);
    
    // If this is heaven tree, handle it differently for the special case
    if (url.toLowerCase().includes('heaventree')) {
      const isHttps = url.toLowerCase().startsWith('https://');
      console.log(`Handling heaventree with protocol: ${isHttps ? 'HTTPS' : 'HTTP'}`);
      
      // Different scores and issues based on HTTP vs HTTPS
      const score = isHttps ? 78 : 65;
      
      console.log(`Providing heaventree results with score: ${score}`);
      
      return {
        url,
        timestamp: new Date(),
        score: score,
        passCount: isHttps ? 20 : 16,
        warningCount: isHttps ? 4 : 6,
        issueCount: isHttps ? 9 : 14,
        region,
        summary: {
          critical: isHttps ? 0 : 2,
          serious: isHttps ? 3 : 5,
          moderate: isHttps ? 2 : 4,
          minor: isHttps ? 4 : 3,
          warnings: isHttps ? 4 : 6,
          passes: isHttps ? 20 : 16,
          pdfIssues: 0,
          documentIssues: 0,
          mediaIssues: 0,
          audioIssues: 0,
          videoIssues: 0
        },
        standards: {
          wcag21: true,
          wcag22: true,
          section508: region === 'usa',
          eaa: region === 'eu'
        },
        issues: [
          {
            id: 'color-contrast',
            impact: 'serious',
            description: 'Elements must have sufficient colour contrast',
            wcagCriteria: ['1.4.3'],
            nodes: [
              {
                html: '<button class="btn-primary">Submit</button>',
                selector: '#login-form .btn-primary',
                colorPairs: [
                  { foreground: '#ffffff', background: '#6c757d', ratio: '3.1:1', required: '4.5:1' }
                ]
              }
            ]
          }
        ],
        warnings: [
          {
            id: 'heading-order',
            impact: 'moderate',
            description: 'Heading levels should only increase by one',
            wcagCriteria: ['1.3.1'],
            nodes: [
              { html: '<h3>Section Title</h3>', selector: 'main > h3' }
            ]
          }
        ],
        passes: [
          {
            id: 'html-lang',
            impact: 'serious',
            description: 'HTML element must have lang attribute',
            wcagCriteria: ['3.1.1'],
            nodes: [
              { html: '<html lang="en">', selector: 'html' }
            ]
          }
        ]
      };
    }
    
    // Standard test case
    // Determine whether to show PASS or FAIL based on URL
    const isPassingTest = !url.toLowerCase().includes('fail') && 
                          !url.toLowerCase().includes('error') &&
                          !url.toLowerCase().includes('bad');
    
    if (isPassingTest) {
      // PASS case - no critical or serious issues
      return {
        url,
        timestamp: new Date(),
        score: 92,
        passCount: 28,
        warningCount: 3,
        issueCount: 4,
        region,
        summary: {
          critical: 0,
          serious: 0,
          moderate: 2,
          minor: 2,
          warnings: 3,
          passes: 28,
          pdfIssues: 0,
          documentIssues: 0,
          mediaIssues: 0,
          audioIssues: 0,
          videoIssues: 0
        },
        standards: {
          wcag21: true,
          wcag22: true,
          section508: region === 'usa',
          eaa: region === 'eu'
        },
        issues: [
          {
            id: 'link-name',
            impact: 'moderate',
            description: 'Links must have discernible text',
            wcagCriteria: ['2.4.4'],
            nodes: [
              {
                html: '<a href="/more"><img src="icon.png"></a>',
                selector: '.nav-links a'
              }
            ]
          },
          {
            id: 'heading-order',
            impact: 'moderate',
            description: 'Heading levels should only increase by one',
            wcagCriteria: ['1.3.1'],
            nodes: [
              { html: '<h4>Subsection</h4>', selector: 'main > h4' }
            ]
          },
          {
            id: 'focus-order',
            impact: 'minor',
            description: 'Focus order should be logical',
            wcagCriteria: ['2.4.3'],
            nodes: [
              { html: '<div tabindex="2">Second</div>', selector: '.interactive-element' }
            ]
          },
          {
            id: 'label-content-name-mismatch',
            impact: 'minor',
            description: 'Visual label should match accessible name',
            wcagCriteria: ['2.5.3'],
            nodes: [
              { html: '<button aria-label="Next">Continue</button>', selector: '.action-button' }
            ]
          }
        ],
        warnings: [
          {
            id: 'landmark-complementary-is-top-level',
            impact: 'moderate',
            description: 'Complementary landmark should not be contained in another landmark',
            wcagCriteria: ['1.3.1'],
            nodes: [
              { html: '<aside>Sidebar content</aside>', selector: 'main > aside' }
            ]
          }
        ],
        passes: [
          {
            id: 'html-lang',
            impact: 'serious',
            description: 'HTML element must have lang attribute',
            wcagCriteria: ['3.1.1'],
            nodes: [
              { html: '<html lang="en">', selector: 'html' }
            ]
          },
          {
            id: 'document-title',
            impact: 'serious',
            description: 'Document must have a title',
            wcagCriteria: ['2.4.2'],
            nodes: [
              { html: '<title>Website Title</title>', selector: 'head > title' }
            ]
          }
        ]
      };
    } else {
      // FAIL case - has critical and serious issues
      return {
        url,
        timestamp: new Date(),
        score: 64,
        passCount: 18,
        warningCount: 5,
        issueCount: 14,
        region,
        summary: {
          critical: 2,
          serious: 4,
          moderate: 5,
          minor: 3,
          warnings: 5,
          passes: 18,
          pdfIssues: 0,
          documentIssues: 0,
          mediaIssues: 0,
          audioIssues: 0,
          videoIssues: 0
        },
        standards: {
          wcag21: true,
          wcag22: true,
          section508: region === 'usa',
          eaa: region === 'eu'
        },
        issues: [
          {
            id: 'color-contrast',
            impact: 'serious',
            description: 'Elements must have sufficient colour contrast',
            wcagCriteria: ['1.4.3'],
            nodes: [
              {
                html: '<button class="btn-primary">Submit</button>',
                selector: '#login-form .btn-primary',
                colorPairs: [
                  { foreground: '#ffffff', background: '#6c757d', ratio: '3.1:1', required: '4.5:1' }
                ]
              },
              {
                html: '<p class="text-light">Footer content</p>',
                selector: 'footer .text-light',
                colorPairs: [
                  { foreground: '#f8f9fa', background: '#ffffff', ratio: '1.1:1', required: '4.5:1' }
                ]
              }
            ]
          },
          {
            id: 'aria-required-attr',
            impact: 'critical',
            description: 'Required ARIA attributes must be provided',
            wcagCriteria: ['4.1.2'],
            nodes: [
              {
                html: '<div role="slider"></div>',
                selector: '.custom-range'
              }
            ]
          },
          {
            id: 'image-alt',
            impact: 'serious',
            description: 'Images must have alternate text',
            wcagCriteria: ['1.1.1'],
            nodes: [
              {
                html: '<img src="logo.png">',
                selector: 'header img'
              },
              {
                html: '<img src="product.jpg">',
                selector: '.product-image'
              }
            ]
          },
          {
            id: 'keyboard-nav',
            impact: 'critical',
            description: 'Page must be navigable by keyboard',
            wcagCriteria: ['2.1.1'],
            nodes: [
              {
                html: '<div onclick="openMenu()">Menu</div>',
                selector: '.menu-trigger'
              }
            ]
          }
        ],
        warnings: [
          {
            id: 'heading-order',
            impact: 'moderate',
            description: 'Heading levels should only increase by one',
            wcagCriteria: ['1.3.1'],
            nodes: [
              { html: '<h3>Section Title</h3>', selector: 'main > h3' }
            ]
          }
        ],
        passes: [
          {
            id: 'html-lang',
            impact: 'serious',
            description: 'HTML element must have lang attribute',
            wcagCriteria: ['3.1.1'],
            nodes: [
              { html: '<html lang="en">', selector: 'html' }
            ]
          }
        ]
      };
    }
  } catch (error) {
    // If there was an error connecting to the website, rethrow it
    if (error instanceof WebsiteConnectionError) {
      throw error;
    }
    
    // For any other error, pass through
    throw error;
  }
}