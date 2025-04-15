/**
 * Data Sanitization Utility
 * 
 * Provides utilities for sanitizing user inputs and outputs to prevent
 * cross-site scripting (XSS) attacks and other injection vulnerabilities.
 */

import DOMPurify from 'dompurify';
import { createError, ErrorType } from './errorHandler';

/**
 * Sanitize HTML content to prevent XSS attacks
 * 
 * @param html HTML content to sanitize
 * @param options DOMPurify configuration options
 * @returns Sanitized HTML
 */
export function sanitizeHtml(
  html: string,
  options: DOMPurify.Config = {}
): string {
  // Combine provided options with secure defaults
  const sanitizeOptions: DOMPurify.Config = {
    ALLOWED_TAGS: [
      'a', 'b', 'br', 'code', 'div', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'i', 'li', 'ol', 'p', 'pre', 'span', 'strong', 'table', 'tbody', 'td',
      'th', 'thead', 'tr', 'ul'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'class', 'id', 'style', 'target', 'rel'
    ],
    ADD_ATTR: ['target'],
    FORBID_CONTENTS: ['script', 'style', 'iframe', 'form', 'input', 'object', 'embed'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'object', 'embed'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onmousedown', 'onmouseup'],
    ALLOW_DATA_ATTR: false,
    USE_PROFILES: { html: true },
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false,
    RETURN_TRUSTED_TYPE: false,
    ...options
  };
  
  try {
    // Sanitize the HTML content and ensure it returns a string
    const result = DOMPurify.sanitize(html, sanitizeOptions);
    return typeof result === 'string' ? result : '';
  } catch (error) {
    throw createError(
      ErrorType.SECURITY,
      'sanitization_error',
      'Failed to sanitize HTML content',
      { error: String(error) }
    );
  }
}

/**
 * Sanitize a URL to prevent javascript: and data: URLs
 * 
 * @param url URL to sanitize
 * @returns Sanitized URL or # if the URL is invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '#';
  
  const sanitized = url.trim().toLowerCase();
  
  // Check for dangerous protocols
  if (
    sanitized.startsWith('javascript:') ||
    sanitized.startsWith('data:') ||
    sanitized.startsWith('vbscript:') ||
    sanitized.startsWith('file:')
  ) {
    return '#';
  }
  
  // Only allow http, https and relative URLs
  if (
    sanitized.startsWith('http://') ||
    sanitized.startsWith('https://') ||
    sanitized.startsWith('/') ||
    sanitized.startsWith('#') ||
    sanitized.startsWith('mailto:') ||
    sanitized.startsWith('tel:')
  ) {
    return url;
  }
  
  // Any other URLs are prefixed with http:// to prevent relative URLs with dangerous protocols
  return sanitized.includes(':') ? '#' : `http://${url}`;
}

/**
 * Escape HTML special characters to prevent XSS
 * 
 * @param text Text to escape
 * @returns Escaped text
 */
export function escapeHtml(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize file name to prevent path traversal attacks
 * 
 * @param fileName File name to sanitize
 * @returns Sanitized file name
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';
  
  // Remove path traversal sequences and control characters
  let sanitized = fileName
    .replace(/\.\.\//g, '')
    .replace(/\\/g, '')
    .replace(/\//g, '')
    .replace(/[\x00-\x1f\x80-\x9f]/g, '');
  
  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }
  
  return sanitized;
}

/**
 * Sanitize a JSON object by recursively checking and sanitizing string values
 * 
 * @param data Data object to sanitize
 * @returns Sanitized data object
 */
export function sanitizeObject<T extends Record<string, any>>(data: T): T {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const sanitized: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // Sanitize string values
      sanitized[key] = escapeHtml(value);
    } else if (Array.isArray(value)) {
      // Recursively sanitize arrays
      sanitized[key] = value.map(item => 
        typeof item === 'object' ? sanitizeObject(item) : 
        typeof item === 'string' ? escapeHtml(item) : item
      );
    } else if (value && typeof value === 'object') {
      // Recursively sanitize nested objects
      sanitized[key] = sanitizeObject(value);
    } else {
      // Keep other types as is
      sanitized[key] = value;
    }
  });
  
  return sanitized as T;
}

/**
 * Strip all HTML tags from a string
 * 
 * @param html HTML content
 * @returns Text with all HTML tags removed
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  // Create a DOM element to parse the HTML
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

/**
 * Sanitize user input for search queries
 * 
 * @param query Search query to sanitize
 * @returns Sanitized query
 */
export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  
  // Remove special characters, limit length
  return query
    .replace(/[^\w\s]/g, ' ')
    .trim()
    .substring(0, 100);
}

export default {
  sanitizeHtml,
  sanitizeUrl,
  escapeHtml,
  sanitizeFileName,
  sanitizeObject,
  stripHtml,
  sanitizeSearchQuery
};