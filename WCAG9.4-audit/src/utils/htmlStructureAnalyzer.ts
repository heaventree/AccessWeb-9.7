/**
 * HTML Structure Analyzer
 * 
 * This utility provides enhanced analysis of HTML structure, focusing on 
 * aspects like heading hierarchy, semantic HTML usage, and URL design.
 * It complements the standard accessibility checks from axe-core with
 * more detailed structural analysis that impacts both accessibility and SEO.
 */

import { parse, HTMLElement } from 'node-html-parser';
import type { AccessibilityIssue } from '../types';

interface StructureAnalysisOptions {
  checkMultipleH1: boolean;
  checkHeadingHierarchy: boolean;
  checkSkippedHeadings: boolean;
  checkSemantic: boolean;
  checkMissingLandmarks: boolean;
}

interface HeadingInfo {
  level: number;
  text: string;
  element: HTMLElement;
}

interface URLAnalysisResult {
  readability: 'good' | 'moderate' | 'poor';
  length: 'good' | 'moderate' | 'poor';
  usesKeywords: boolean;
  usesHyphens: boolean;
  usesUnderscores: boolean;
  containsParameters: boolean;
  issues: string[];
}

const defaultOptions: StructureAnalysisOptions = {
  checkMultipleH1: true,
  checkHeadingHierarchy: true,
  checkSkippedHeadings: true,
  checkSemantic: true,
  checkMissingLandmarks: true
};

/**
 * Analyzes HTML structure for accessibility and usability issues
 */
export function analyzeHtmlStructure(
  html: string, 
  url: string,
  options: Partial<StructureAnalysisOptions> = {}
): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    const root = parse(html);
    
    // Check for semantic HTML issues
    if (mergedOptions.checkSemantic) {
      issues.push(...checkSemanticHTML(root));
    }
    
    // Check heading structure
    const headings = extractHeadings(root);
    
    if (mergedOptions.checkMultipleH1) {
      issues.push(...checkMultipleH1Tags(headings));
    }
    
    if (mergedOptions.checkHeadingHierarchy) {
      issues.push(...checkHeadingHierarchy(headings));
    }
    
    if (mergedOptions.checkSkippedHeadings) {
      issues.push(...checkSkippedHeadingLevels(headings));
    }
    
    // Check for missing landmarks
    if (mergedOptions.checkMissingLandmarks) {
      issues.push(...checkLandmarks(root));
    }
    
    // Add URL design analysis
    const urlAnalysis = analyzeURL(url);
    if (urlAnalysis.issues.length > 0) {
      issues.push({
        id: 'url-design',
        impact: 'moderate',
        description: 'URL design could be improved for better user experience and SEO',
        nodes: [`<url>${url}</url>`],
        wcagCriteria: ['2.4.4', '2.4.5'],
        autoFixable: false,
        fixSuggestion: urlAnalysis.issues.join(' '),
      });
    }
    
  } catch (error) {
    console.error('Error during HTML structure analysis:', error);
    issues.push({
      id: 'structure-analysis-error',
      impact: 'moderate',
      description: 'An error occurred during structure analysis. Some issues may not be reported.',
      nodes: ['<div>Structure analysis failed</div>'],
      wcagCriteria: ['1.3.1'],
      autoFixable: false,
      fixSuggestion: 'Please check the HTML structure manually for proper semantic elements and heading hierarchy.'
    });
  }
  
  return issues;
}

/**
 * Extracts all headings from the HTML document
 */
function extractHeadings(root: HTMLElement): HeadingInfo[] {
  const headings: HeadingInfo[] = [];
  
  for (let level = 1; level <= 6; level++) {
    const elements = root.querySelectorAll(`h${level}`);
    
    elements.forEach(heading => {
      headings.push({
        level,
        text: heading.text.trim(),
        element: heading
      });
    });
  }
  
  // Sort headings by their position in the document (if possible)
  // Note: Exact position indexing would require the original HTML string
  // which we don't have access to here. This is approximated based on DOM order.
  headings.sort((a, b) => {
    // This is a simplified approach - in a real implementation with the original HTML
    // we would check the actual string position
    const aHTML = a.element.toString();
    const bHTML = b.element.toString();
    
    // We can compare based on element order in the document
    // by using a simple string comparison of their HTML representation
    return aHTML.localeCompare(bHTML);
  });
  
  return headings;
}

/**
 * Checks for multiple H1 tags in the document
 */
function checkMultipleH1Tags(headings: HeadingInfo[]): AccessibilityIssue[] {
  const h1Headings = headings.filter(h => h.level === 1);
  
  if (h1Headings.length > 1) {
    return [{
      id: 'multiple-h1',
      impact: 'moderate',
      description: `Multiple H1 headings found (${h1Headings.length}). There should be only one main H1 per page.`,
      nodes: h1Headings.map(h => h.element.toString()),
      wcagCriteria: ['1.3.1', '2.4.6'],
      autoFixable: false,
      fixSuggestion: 'Keep only one H1 heading that describes the main purpose of the page. Convert additional H1s to H2s.'
    }];
  }
  
  return [];
}

/**
 * Checks for proper heading hierarchy (H1 before H2, H2 before H3, etc.)
 */
function checkHeadingHierarchy(headings: HeadingInfo[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  let highestLevelSeen = 0;
  
  for (const heading of headings) {
    if (heading.level === 1) {
      highestLevelSeen = 1;
    } else if (heading.level > highestLevelSeen + 1) {
      issues.push({
        id: 'heading-hierarchy',
        impact: 'moderate',
        description: `Heading level ${heading.level} (${heading.text}) appears before any level ${heading.level - 1} heading.`,
        nodes: [heading.element.toString()],
        wcagCriteria: ['1.3.1', '2.4.6'],
        autoFixable: false,
        fixSuggestion: `Use a logical heading hierarchy. H${heading.level} should be preceded by H${heading.level - 1} in the document structure.`
      });
    } else {
      highestLevelSeen = Math.max(highestLevelSeen, heading.level);
    }
  }
  
  return issues;
}

/**
 * Checks for skipped heading levels (e.g., H1 followed by H3)
 */
function checkSkippedHeadingLevels(headings: HeadingInfo[]): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  let previousLevel = 0;
  
  for (const heading of headings) {
    if (previousLevel > 0 && heading.level > previousLevel && heading.level - previousLevel > 1) {
      issues.push({
        id: 'skipped-heading-level',
        impact: 'moderate',
        description: `Heading level jumped from H${previousLevel} to H${heading.level}, skipping at least one level.`,
        nodes: [heading.element.toString()],
        wcagCriteria: ['1.3.1', '2.4.6'],
        autoFixable: false,
        fixSuggestion: `Don't skip heading levels. Change this heading from H${heading.level} to H${previousLevel + 1} or add the missing heading levels before it.`
      });
    }
    
    previousLevel = heading.level;
  }
  
  return issues;
}

/**
 * Checks for semantic HTML elements
 */
function checkSemanticHTML(root: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  // Check for missing main landmark
  const mainElements = root.querySelectorAll('main');
  if (mainElements.length === 0) {
    const possibleMains = root.querySelectorAll('div[class*="main"], div[class*="content"], div[id*="main"], div[id*="content"]');
    
    if (possibleMains.length > 0) {
      issues.push({
        id: 'missing-main-landmark',
        impact: 'moderate',
        description: 'No <main> element found. Using semantic <main> helps screen readers identify the main content.',
        nodes: possibleMains.map(el => el.toString().substring(0, 200) + '...'),
        wcagCriteria: ['1.3.1', '2.4.1'],
        autoFixable: true,
        fixSuggestion: 'Replace non-semantic <div> containing main content with <main> element.'
      });
    }
  }
  
  // Check for unsemantic divs that could be replaced with semantic elements
  const divs = root.querySelectorAll('div[class*="nav"], div[id*="nav"]');
  if (divs.length > 0) {
    issues.push({
      id: 'unsemantic-navigation',
      impact: 'moderate',
      description: 'Non-semantic <div> elements used for navigation instead of <nav>.',
      nodes: divs.map(el => el.toString().substring(0, 200) + '...'),
      wcagCriteria: ['1.3.1'],
      autoFixable: true,
      fixSuggestion: 'Replace <div> elements with semantic <nav> elements for navigation.'
    });
  }
  
  // Check for lists that don't use <ul> or <ol>
  const listPatterns = root.querySelectorAll('div > div > div.item, div[class*="list"] > div');
  if (listPatterns.length > 5) {
    issues.push({
      id: 'unsemantic-list',
      impact: 'minor',
      description: 'Possible list items found not using proper <ul>/<ol> and <li> elements.',
      nodes: [listPatterns[0].toString().substring(0, 200) + '...'],
      wcagCriteria: ['1.3.1'],
      autoFixable: false,
      fixSuggestion: 'Use proper list elements (<ul> or <ol> with <li> items) for content that represents a list.'
    });
  }
  
  return issues;
}

/**
 * Checks for missing landmark roles
 */
function checkLandmarks(root: HTMLElement): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = [];
  
  // Check for header
  const headerElements = root.querySelectorAll('header');
  if (headerElements.length === 0) {
    const possibleHeaders = root.querySelectorAll('div[class*="header"], div[id*="header"]');
    
    if (possibleHeaders.length > 0) {
      issues.push({
        id: 'missing-header-landmark',
        impact: 'minor',
        description: 'No <header> element found. Using semantic <header> helps screen readers identify the header content.',
        nodes: possibleHeaders.map(el => el.toString().substring(0, 200) + '...'),
        wcagCriteria: ['1.3.1', '2.4.1'],
        autoFixable: true,
        fixSuggestion: 'Replace non-semantic <div> containing header content with <header> element.'
      });
    }
  }
  
  // Check for footer
  const footerElements = root.querySelectorAll('footer');
  if (footerElements.length === 0) {
    const possibleFooters = root.querySelectorAll('div[class*="footer"], div[id*="footer"]');
    
    if (possibleFooters.length > 0) {
      issues.push({
        id: 'missing-footer-landmark',
        impact: 'minor',
        description: 'No <footer> element found. Using semantic <footer> helps screen readers identify the footer content.',
        nodes: possibleFooters.map(el => el.toString().substring(0, 200) + '...'),
        wcagCriteria: ['1.3.1', '2.4.1'],
        autoFixable: true,
        fixSuggestion: 'Replace non-semantic <div> containing footer content with <footer> element.'
      });
    }
  }
  
  return issues;
}

/**
 * Analyzes URL design for readability and usability
 */
export function analyzeURL(url: string): URLAnalysisResult {
  try {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    const issues: string[] = [];
    
    // Check URL length
    const urlLength = url.length;
    let lengthRating: 'good' | 'moderate' | 'poor' = 'good';
    
    if (urlLength > 100) {
      lengthRating = 'poor';
      issues.push('URL is too long (over 100 characters).');
    } else if (urlLength > 75) {
      lengthRating = 'moderate';
      issues.push('URL is moderately long (over 75 characters).');
    }
    
    // Check URL readability
    const segments = pathname.split('/').filter(Boolean);
    let readabilityRating: 'good' | 'moderate' | 'poor' = 'good';
    
    // Check for uppercase letters (generally not recommended in URLs)
    if (/[A-Z]/.test(pathname)) {
      readabilityRating = 'poor';
      issues.push('URL contains uppercase letters, which are not recommended for URLs.');
    }
    
    // Check for excessive use of numbers or special characters
    if (/[0-9]{5,}/.test(pathname)) {
      readabilityRating = readabilityRating === 'poor' ? 'poor' : 'moderate';
      issues.push('URL contains long numeric sequences, which reduces readability.');
    }
    
    // Check segment length
    for (const segment of segments) {
      if (segment.length > 30) {
        readabilityRating = readabilityRating === 'poor' ? 'poor' : 'moderate';
        issues.push('URL contains very long path segments (over 30 characters).');
        break;
      }
    }
    
    // Check for query parameters
    const containsParameters = parsedUrl.search.length > 0;
    if (containsParameters && parsedUrl.search.length > 50) {
      issues.push('URL contains lengthy query parameters, which reduces clarity.');
    }
    
    // Check for hyphens vs underscores
    const usesHyphens = pathname.includes('-');
    const usesUnderscores = pathname.includes('_');
    
    if (usesUnderscores) {
      issues.push('URL uses underscores instead of the preferred hyphens for word separation.');
    }
    
    // Check for keywords (very basic implementation)
    const usesKeywords = segments.some(segment => 
      segment.length > 3 && 
      !segment.match(/^(page|id|user|item|index|www|com|net|org)$/)
    );
    
    if (!usesKeywords) {
      issues.push('URL lacks descriptive keywords, which helps with both SEO and user comprehension.');
    }
    
    return {
      readability: readabilityRating,
      length: lengthRating,
      usesKeywords,
      usesHyphens,
      usesUnderscores,
      containsParameters,
      issues
    };
  } catch (error) {
    console.error('Error analyzing URL:', error);
    return {
      readability: 'poor',
      length: 'moderate',
      usesKeywords: false,
      usesHyphens: false,
      usesUnderscores: false,
      containsParameters: false,
      issues: ['Error analyzing URL. Please ensure it is properly formatted.']
    };
  }
}