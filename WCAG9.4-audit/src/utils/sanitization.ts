/**
 * Sanitization Utilities
 * 
 * Provides robust data sanitization to prevent XSS and injection attacks
 * by cleaning user input and untrusted data.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param html HTML string to sanitize
 * @param config Optional DOMPurify configuration
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string, config?: DOMPurify.Config): string {
  if (!html) return '';
  
  // Default configuration with strict settings
  const defaultConfig: DOMPurify.Config = {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      'a', 'b', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'i', 'li', 'ol', 'p', 'pre', 'span', 'strong', 'table', 'tbody', 
      'td', 'th', 'thead', 'tr', 'ul'
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'class', 'id', 'style', 'title', 'alt', 
      'aria-label', 'aria-labelledby', 'aria-hidden', 'role',
      'tabindex'
    ],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    FORBID_CONTENTS: true,
    WHOLE_DOCUMENT: false,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
    SAFE_FOR_TEMPLATES: true,
    SANITIZE_DOM: true
  };
  
  // Merge with user config
  const finalConfig = { ...defaultConfig, ...(config || {}) };
  
  // Sanitize HTML
  return DOMPurify.sanitize(html, finalConfig);
}

/**
 * Sanitize a text string (removes HTML tags completely)
 * @param text Text to sanitize
 * @returns Sanitized text string
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  // Convert to string if not already
  const stringText = String(text);
  
  // Remove all HTML tags
  return DOMPurify.sanitize(stringText, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    FORBID_CONTENTS: true,
    WHOLE_DOCUMENT: false
  });
}

/**
 * Validate and sanitize a URL
 * @param url URL to sanitize
 * @param allowedProtocols Allowed protocols
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(
  url: string, 
  allowedProtocols: string[] = ['http:', 'https:']
): string {
  if (!url) return '';
  
  try {
    // Attempt to parse URL
    const parsed = new URL(url);
    
    // Check if protocol is allowed
    if (!allowedProtocols.includes(parsed.protocol)) {
      return '';
    }
    
    // Return sanitized URL
    return parsed.toString();
  } catch (error) {
    // Invalid URL
    return '';
  }
}

/**
 * Sanitize an object recursively
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  // Clone object to avoid mutating original
  const sanitized = { ...obj };
  
  // Sanitize each property
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    
    if (typeof value === 'string') {
      // Sanitize string values
      sanitized[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects
      if (Array.isArray(value)) {
        // Handle arrays
        sanitized[key] = value.map(item => 
          typeof item === 'object' && item !== null
            ? sanitizeObject(item)
            : typeof item === 'string'
              ? sanitizeText(item)
              : item
        );
      } else {
        // Handle objects
        sanitized[key] = sanitizeObject(value);
      }
    }
    // Primitive values (numbers, booleans) are kept as is
  });
  
  return sanitized as T;
}

/**
 * Sanitize form data from a FormData object
 * @param formData FormData object
 * @returns Sanitized key-value object
 */
export function sanitizeFormData(formData: FormData): Record<string, string | File> {
  const sanitized: Record<string, string | File> = {};
  
  // Process each form field
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      // Sanitize string values
      sanitized[key] = sanitizeText(value);
    } else {
      // Keep file objects as is
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

/**
 * Create a safe HTML attribute value
 * @param value Value to sanitize for HTML attribute
 * @returns Sanitized attribute value
 */
export function sanitizeHtmlAttribute(value: string): string {
  if (!value) return '';
  
  // Convert to string and escape special characters
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeObject,
  sanitizeFormData,
  sanitizeHtmlAttribute
};