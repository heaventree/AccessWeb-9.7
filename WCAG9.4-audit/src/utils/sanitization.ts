/**
 * Sanitization Utility
 * 
 * Provides utilities for sanitizing user input and HTML content to prevent
 * cross-site scripting (XSS) attacks and other injection vulnerabilities.
 */

// Import DOMPurify for HTML sanitization
import DOMPurify from 'dompurify';
import { ErrorType, createError } from './errorHandler';

/**
 * Configure DOMPurify with secure defaults
 */
function configureDOMPurify() {
  // Add hooks for additional security measures if needed
  DOMPurify.addHook('afterSanitizeAttributes', function(node) {
    // Add noopener and noreferrer to all links
    if (node.tagName === 'A') {
      node.setAttribute('rel', 'noopener noreferrer');
      
      // Only allow http, https, mailto and tel protocols in links
      const href = node.getAttribute('href');
      if (href && !(/^(?:https?:|mailto:|tel:)/.test(href))) {
        node.removeAttribute('href');
      }
    }
  });
}

// Configure DOMPurify on initialization
configureDOMPurify();

/**
 * DOMPurify configuration for different security levels
 */
export const SANITIZE_CONFIGS = {
  // Allow very minimal HTML - only formatting tags
  minimal: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'br'],
    ALLOWED_ATTR: []
  },
  
  // Standard level for user-generated content
  standard: {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'span', 'br', 'p', 'ul', 'ol', 'li', 
      'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ],
    ALLOWED_ATTR: ['href', 'class', 'target']
  },
  
  // Restrictive for comments
  restrictive: {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'],
    ALLOWED_ATTR: ['href', 'target']
  }
};

/**
 * Sanitize HTML string to prevent XSS
 * @param html HTML string to sanitize
 * @param configName Configuration name from SANITIZE_CONFIGS
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(
  html: string, 
  configName: keyof typeof SANITIZE_CONFIGS = 'standard'
): string {
  if (!html) return '';
  
  const config = SANITIZE_CONFIGS[configName];
  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitize a string for safe insertion into HTML attributes
 * @param value String to sanitize
 * @returns Sanitized string
 */
export function sanitizeAttribute(value: string): string {
  if (!value) return '';
  
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Sanitize user input for use in code (prevents code injection)
 * @param input User input
 * @returns Sanitized input
 */
export function sanitizeUserInput(input: string): string {
  if (!input) return '';
  
  // Strip all HTML tags and special characters
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s.,;:!?-]/g, '');
}

/**
 * Sanitize URL to prevent javascript: and other unsafe protocols
 * @param url URL to sanitize
 * @returns Sanitized URL or empty string if unsafe
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  // Allow only http://, https://, mailto:, tel:
  const sanitized = url.trim().toLowerCase();
  if (/^(https?:\/\/|mailto:|tel:)/.test(sanitized)) {
    return url.trim();
  }
  
  // If no protocol specified, assume http
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(sanitized)) {
    return 'https://' + url.trim();
  }
  
  // Unsafe protocol
  return '';
}

/**
 * Recursively sanitize an object, applying appropriate sanitization
 * to all string properties
 * @param obj Object to sanitize
 * @returns Sanitized copy of the object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // Create a new object to avoid mutating the original
  const sanitized: Record<string, any> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Handle strings based on property name hints
      if (key.includes('html') || key.includes('content')) {
        sanitized[key] = sanitizeHtml(value, 'standard');
      } else if (key.includes('url') || key.includes('link')) {
        sanitized[key] = sanitizeUrl(value);
      } else {
        sanitized[key] = sanitizeUserInput(value);
      }
    } else if (value && typeof value === 'object') {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value);
    } else {
      // Pass through non-objects (numbers, booleans, etc.)
      sanitized[key] = value;
    }
  });
  
  return sanitized as T;
}

/**
 * Validate that HTML content is safe according to strict rules
 * Throws an error if the content is potentially unsafe
 * @param html HTML content to validate
 * @param allowedTags Tags allowed in the content
 * @throws Error if content is unsafe
 */
export function validateHtmlSafety(html: string, allowedTags: string[] = []): void {
  // Use DOMPurify to clean the HTML
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    RETURN_DOM: true
  });
  
  // If the cleaned DOM doesn't match the original structure, it's unsafe
  const cleanHtml = (clean as Node).textContent || '';
  const originalTextContent = document.createElement('div');
  originalTextContent.innerHTML = html;
  
  if (cleanHtml.length < originalTextContent.textContent!.length * 0.8) {
    throw createError(
      ErrorType.SECURITY,
      'unsafe_html_content',
      'The provided HTML content contains potentially unsafe elements',
      { allowedTags }
    );
  }
}

export default {
  sanitizeHtml,
  sanitizeAttribute,
  sanitizeUserInput,
  sanitizeUrl,
  sanitizeObject,
  validateHtmlSafety,
  SANITIZE_CONFIGS
};