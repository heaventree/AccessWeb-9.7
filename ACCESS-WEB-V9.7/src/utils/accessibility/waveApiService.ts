/**
 * WAVE API Service
 * Provides real accessibility testing using WebAIM's WAVE API
 */

import type { TestResult, AccessibilityIssue } from '../../types';

interface WaveApiResponse {
  status: {
    success: boolean;
    httpstatuscode: number;
  };
  statistics: {
    pagetitle: string;
    pageurl: string;
    time: number;
    creditsremaining: number;
    allitemcount: number;
    totalelements: number;
    waveurl: string;
  };
  categories: {
    error: {
      description: string;
      count: number;
      items: Record<string, WaveItem>;
    };
    contrast: {
      description: string;
      count: number;
      items: Record<string, WaveItem>;
    };
    alert: {
      description: string;
      count: number;
      items: Record<string, WaveItem>;
    };
    feature: {
      description: string;
      count: number;
      items: Record<string, WaveItem>;
    };
    structure: {
      description: string;
      count: number;
      items: Record<string, WaveItem>;
    };
    aria: {
      description: string;
      count: number;
      items: Record<string, WaveItem>;
    };
  };
}

interface WaveItem {
  id: string;
  description: string;
  count: number;
  selectors: string[];
  wcag: WcagReference[];
}

interface WcagReference {
  name: string;
  link: string;
}

/**
 * Convert WAVE API response to our TestResult format
 */
function convertWaveToTestResult(waveResponse: WaveApiResponse, url: string): TestResult {
  const issues: AccessibilityIssue[] = [];
  const warnings: AccessibilityIssue[] = [];
  const passes: AccessibilityIssue[] = [];

  // Process errors (critical/serious issues)
  Object.entries(waveResponse.categories.error.items).forEach(([key, item]) => {
    issues.push({
      id: key,
      impact: 'serious' as const,
      description: item.description,
      nodes: item.selectors,
      wcagCriteria: item.wcag.map(w => extractWcagNumber(w.name)),
      autoFixable: false,
      fixSuggestion: getFixSuggestion(key, item.description)
    });
  });

  // Process contrast issues (serious)
  Object.entries(waveResponse.categories.contrast.items).forEach(([key, item]) => {
    issues.push({
      id: key,
      impact: 'serious' as const,
      description: item.description,
      nodes: item.selectors,
      wcagCriteria: item.wcag.map(w => extractWcagNumber(w.name)),
      autoFixable: false,
      fixSuggestion: getFixSuggestion(key, item.description)
    });
  });

  // Process alerts (warnings/moderate issues)
  Object.entries(waveResponse.categories.alert.items).forEach(([key, item]) => {
    warnings.push({
      id: key,
      impact: 'moderate' as const,
      description: item.description,
      nodes: item.selectors,
      wcagCriteria: item.wcag.map(w => extractWcagNumber(w.name)),
      autoFixable: false,
      fixSuggestion: getFixSuggestion(key, item.description)
    });
  });

  // Process features (passes)
  Object.entries(waveResponse.categories.feature.items).forEach(([key, item]) => {
    passes.push({
      id: key,
      impact: 'minor' as const,
      description: item.description,
      nodes: item.selectors,
      wcagCriteria: item.wcag.map(w => extractWcagNumber(w.name)),
      autoFixable: false,
      fixSuggestion: ''
    });
  });

  // Process structural elements (passes)
  Object.entries(waveResponse.categories.structure.items).forEach(([key, item]) => {
    passes.push({
      id: key,
      impact: 'minor' as const,
      description: item.description,
      nodes: item.selectors,
      wcagCriteria: item.wcag.map(w => extractWcagNumber(w.name)),
      autoFixable: false,
      fixSuggestion: ''
    });
  });

  // Process ARIA elements (passes)
  Object.entries(waveResponse.categories.aria.items).forEach(([key, item]) => {
    passes.push({
      id: key,
      impact: 'minor' as const,
      description: item.description,
      nodes: item.selectors,
      wcagCriteria: item.wcag.map(w => extractWcagNumber(w.name)),
      autoFixable: false,
      fixSuggestion: ''
    });
  });

  // Calculate summary
  const summary = {
    critical: issues.filter(i => i.impact === 'critical').length,
    serious: issues.filter(i => i.impact === 'serious').length,
    moderate: warnings.filter(i => i.impact === 'moderate').length,
    minor: issues.filter(i => i.impact === 'minor').length,
    passes: passes.length,
    warnings: warnings.length,
    pdfIssues: 0,
    documentIssues: 0,
    mediaIssues: 0,
    audioIssues: 0,
    videoIssues: 0
  };

  return {
    url,
    timestamp: new Date().toISOString(),
    summary,
    issues,
    warnings,
    passes
  };
}

/**
 * Extract WCAG criterion number from WAVE reference name
 */
function extractWcagNumber(name: string): string {
  const match = name.match(/(\d+\.\d+\.\d+)/);
  return match ? match[1] : '';
}

/**
 * Get fix suggestion based on WAVE item type
 */
function getFixSuggestion(itemId: string, description: string): string {
  const suggestions: Record<string, string> = {
    'alt_missing': 'Add descriptive alt text to all images. Use alt="" for decorative images.',
    'alt_empty': 'Provide meaningful alt text that describes the image content or function.',
    'alt_spacer_missing': 'Add alt="" to spacer images to hide them from screen readers.',
    'alt_redundant': 'Remove redundant alt text that duplicates nearby text content.',
    'contrast': 'Increase color contrast ratio to meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).',
    'heading_missing': 'Add heading elements (h1-h6) to provide proper document structure.',
    'heading_skipped': 'Use heading levels sequentially without skipping levels.',
    'link_empty': 'Provide descriptive link text that explains the link destination.',
    'link_redundant': 'Remove redundant link text and combine adjacent links with same destination.',
    'label_missing': 'Add labels to all form inputs using <label> elements or aria-label.',
    'button_empty': 'Provide descriptive text or accessible names for all buttons.',
    'language_missing': 'Add lang attribute to the html element to specify page language.',
    'title_invalid': 'Provide a descriptive page title that identifies the page content.',
    'noscript': 'Ensure content is accessible when JavaScript is disabled.',
    'tabindex': 'Avoid positive tabindex values and ensure logical tab order.'
  };

  return suggestions[itemId] || 'Review this element for accessibility compliance according to WCAG guidelines.';
}

/**
 * Calculate accessibility score based on issues found
 */
function calculateAccessibilityScore(summary: any): number {
  const totalIssues = summary.critical * 10 + summary.serious * 5 + summary.moderate * 2 + summary.minor * 1;
  const maxScore = 100;
  const score = Math.max(0, maxScore - totalIssues);
  return Math.round(score);
}

/**
 * Test accessibility using WAVE API
 */
export async function testAccessibilityWithWave(
  url: string,
  region: string = 'global',
  options: any = {}
): Promise<TestResult> {
  const apiKey = import.meta.env.VITE_WAVE_API_KEY || process.env.WAVE_API_KEY;
  
  if (!apiKey) {
    throw new Error('WAVE API key is not configured. Please add WAVE_API_KEY to your environment variables.');
  }

  try {
    // Validate URL
    new URL(url);

    // Make request to WAVE API
    const waveUrl = `https://wave.webaim.org/api/request?key=${apiKey}&url=${encodeURIComponent(url)}&format=json&reporttype=1`;
    
    const response = await fetch(waveUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'AccessWeb-Checker/1.0'
      }
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('Invalid URL or API request. Please check the URL format.');
      } else if (response.status === 401) {
        throw new Error('Invalid WAVE API key. Please check your API credentials.');
      } else if (response.status === 402) {
        throw new Error('WAVE API credits exhausted. Please check your account balance.');
      } else if (response.status === 500) {
        throw new Error('WAVE API server error. Please try again later.');
      }
      throw new Error(`WAVE API error: ${response.status} ${response.statusText}`);
    }

    const waveData: WaveApiResponse = await response.json();

    if (!waveData.status.success) {
      throw new Error(`WAVE API returned an error: HTTP ${waveData.status.httpstatuscode}`);
    }

    // Convert WAVE response to our format
    const result = convertWaveToTestResult(waveData, url);
    
    console.log(`WAVE API analysis complete. Credits remaining: ${waveData.statistics.creditsremaining}`);
    
    return result;

  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw error;
      }
      if (error.message.includes('Invalid URL')) {
        throw new Error('Please enter a valid URL (e.g., https://example.com)');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred while testing the website.');
  }
}