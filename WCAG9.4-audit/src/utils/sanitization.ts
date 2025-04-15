/**
 * Data Sanitization Utility
 * 
 * Provides functions for sanitizing input data to prevent XSS attacks
 * and other injection vulnerabilities.
 */

import DOMPurify from 'dompurify';

// Configure DOMPurify with strict settings
const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'a', 'b', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4',
    'h5', 'h6', 'hr', 'i', 'img', 'li', 'ol', 'p', 'pre', 'span', 
    'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul'
  ],
  ALLOWED_ATTR: [
    'alt', 'class', 'href', 'id', 'src', 'style', 'target', 'title',
    'aria-label', 'aria-hidden', 'role', 'tabindex'
  ],
  ALLOW_DATA_ATTR: false, // Disable data attributes
  USE_PROFILES: { html: true }, // Use HTML profile
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'textarea', 'select'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout']
};

// More restrictive config for user-generated content
const USER_CONTENT_CONFIG = {
  ALLOWED_TAGS: ['b', 'br', 'em', 'i', 'p', 'strong'],
  ALLOWED_ATTR: ['class'],
  ALLOW_DATA_ATTR: false,
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'textarea', 'select'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout']
};

/**
 * Sanitize HTML content to prevent XSS attacks
 * 
 * @param html HTML content to sanitize
 * @param isUserContent If true, applies more restrictive sanitization for user-generated content
 * @returns Sanitized HTML
 */
export function sanitizeHtml(html: string, isUserContent: boolean = false): string {
  const config = isUserContent ? USER_CONTENT_CONFIG : SANITIZE_CONFIG;
  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitize text content by escaping HTML entities
 * Use for plain text that should not contain any HTML
 * 
 * @param text Text to sanitize
 * @returns Text with HTML entities escaped
 */
export function sanitizeText(text: string): string {
  const el = document.createElement('div');
  el.textContent = text;
  return el.innerHTML;
}

/**
 * Sanitize a URL to prevent javascript: protocol attacks
 * 
 * @param url URL to sanitize
 * @returns Sanitized URL
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  // Try to parse the URL
  try {
    const parsed = new URL(url);
    
    // Block javascript: protocol
    if (
      parsed.protocol === 'javascript:' || 
      parsed.protocol === 'data:' ||
      parsed.protocol === 'vbscript:'
    ) {
      return '#';
    }
    
    return parsed.toString();
  } catch (err) {
    // If URL is invalid, return as is if it doesn't contain suspicious protocols
    if (
      /^javascript:/i.test(url) || 
      /^data:/i.test(url) ||
      /^vbscript:/i.test(url)
    ) {
      return '#';
    }
    
    return url;
  }
}

/**
 * Removes unsafe properties from an object recursively
 * 
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const result = { ...obj } as any;
  
  // Process each property
  for (const key in result) {
    const value = result[key];
    
    if (typeof value === 'string') {
      // Sanitize strings depending on property name
      if (key.includes('html') || key.includes('content')) {
        result[key] = sanitizeHtml(value, true);
      } else if (key.includes('url') || key.includes('link') || key.includes('href') || key.includes('src')) {
        result[key] = sanitizeUrl(value);
      } else {
        result[key] = sanitizeText(value);
      }
    } else if (value && typeof value === 'object') {
      // Recursively sanitize nested objects
      result[key] = sanitizeObject(value);
    }
  }
  
  return result as T;
}

/**
 * Sanitize form data before submission
 * 
 * @param formData Form data to sanitize
 * @returns Sanitized form data
 */
export function sanitizeFormData<T extends Record<string, any>>(formData: T): T {
  return sanitizeObject(formData);
}

export default {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeObject,
  sanitizeFormData
};