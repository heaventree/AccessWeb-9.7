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
    
    // For the HTTP version of heaventree10.com, provide specialized mock results
    if (url.toLowerCase().startsWith('http://heaventree10.com') || 
        url.toLowerCase().startsWith('http://www.heaventree10.com')) {
      console.log("Generating HTTP fallback results for heaventree10.com");
      return {
        url,
        timestamp: new Date(),
        score: 65, // Different score to show it's the HTTP version
        passCount: 16,
        warningCount: 6,
        issueCount: 14,
        region,
        standards: {
          wcag21: true,
          wcag22: true,
          section508: region === 'us',
          eaa: region === 'eu'
        },
        issues: [
          {
            id: 'color-contrast',
            impact: 'serious',
            description: 'Elements must have sufficient color contrast',
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
            id: 'http-security',
            impact: 'serious',
            description: 'Site should use secure HTTPS instead of HTTP',
            wcagCriteria: ['2.2.6'], // Added for demo
            nodes: [
              {
                html: '<link rel="stylesheet" href="http://unsecure-cdn.example.com/style.css">',
                selector: 'head link'
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
    
    // If we get here, the website is accessible, continue with standard mock test results
    return {
      url,
      timestamp: new Date(),
      score: 72,
      passCount: 18,
      warningCount: 5,
      issueCount: 12,
      region,
      standards: {
        wcag21: true,
        wcag22: true,
        section508: region === 'us',
        eaa: region === 'eu'
      },
      issues: [
        {
          id: 'color-contrast',
          impact: 'serious',
          description: 'Elements must have sufficient color contrast',
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
  } catch (error) {
    // If there was an error connecting to the website, rethrow it
    if (error instanceof WebsiteConnectionError) {
      throw error;
    }
    
    // For any other error, pass through
    throw error;
  }
}