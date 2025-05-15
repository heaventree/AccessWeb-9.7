/**
 * URL utility functions for the application
 */

/**
 * Converts an HTTPS URL to HTTP
 * 
 * @param url The HTTPS URL to convert
 * @returns The HTTP version of the URL
 */
export function httpsToHttp(url: string): string {
  if (url.toLowerCase().startsWith('https://')) {
    return 'http://' + url.substring(8);
  }
  return url;
}

/**
 * Converts an HTTP URL to HTTPS
 * 
 * @param url The HTTP URL to convert
 * @returns The HTTPS version of the URL
 */
export function httpToHttps(url: string): string {
  if (url.toLowerCase().startsWith('http://')) {
    return 'https://' + url.substring(7);
  }
  return url;
}

/**
 * Normalizes a URL by ensuring it has a protocol
 * If no protocol is specified, HTTPS is used by default
 * 
 * @param url The URL to normalize
 * @returns The normalized URL with a protocol
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';
  
  url = url.trim();
  
  if (!url.toLowerCase().startsWith('http://') && !url.toLowerCase().startsWith('https://')) {
    // Default to HTTPS if no protocol is specified
    return 'https://' + url;
  }
  
  return url;
}

/**
 * Extracts the domain from a URL
 * 
 * @param url The URL to extract the domain from
 * @returns The domain part of the URL without the protocol or path
 */
export function getDomainFromUrl(url: string): string {
  try {
    const parsedUrl = new URL(normalizeUrl(url));
    return parsedUrl.hostname;
  } catch (error) {
    // Handle invalid URLs
    return url;
  }
}

/**
 * Checks if a URL is using HTTPS
 * 
 * @param url The URL to check
 * @returns True if the URL is using HTTPS, false otherwise
 */
export function isHttps(url: string): boolean {
  return url.toLowerCase().startsWith('https://');
}

/**
 * Creates a protocol-relative URL (starts with //)
 * This is useful for resources that should be loaded using the same protocol as the page
 * 
 * @param url The URL to convert
 * @returns The protocol-relative URL
 */
export function getProtocolRelativeUrl(url: string): string {
  if (url.toLowerCase().startsWith('http://') || url.toLowerCase().startsWith('https://')) {
    const parsedUrl = new URL(url);
    return '//' + parsedUrl.host + parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
  }
  return url;
}