/**
 * Error Message Utility Functions
 * This module provides functions for formatting and generating user-friendly error messages
 */

/**
 * Generate a user-friendly error message for different error types
 * 
 * @param error The error object or message
 * @returns A user-friendly error message string
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';
  
  // Handle different error types
  if (typeof error === 'string') {
    return formatErrorMessage(error);
  } else if (error instanceof Error) {
    return formatErrorMessage(error.message);
  } else if (error.message) {
    return formatErrorMessage(error.message);
  } else {
    return 'An unexpected error occurred';
  }
}

/**
 * Format an error message to be more user-friendly
 * 
 * @param message The raw error message
 * @returns A formatted, user-friendly error message
 */
function formatErrorMessage(message: string): string {
  // Remove technical details and stack traces
  let formattedMessage = message.split('\n')[0];
  
  // Replace common technical terms with user-friendly ones
  formattedMessage = formattedMessage
    .replace(/ECONNREFUSED/g, 'Connection Refused')
    .replace(/ECONNRESET/g, 'Connection Reset')
    .replace(/ETIMEDOUT/g, 'Connection Timed Out')
    .replace(/ENOTFOUND/g, 'Domain Not Found')
    .replace(/500/g, 'Server Error (500)')
    .replace(/404/g, 'Not Found (404)')
    .replace(/403/g, 'Access Forbidden (403)')
    .replace(/401/g, 'Authentication Required (401)');
  
  return formattedMessage;
}

/**
 * Determine if an error is a network error
 * 
 * @param error The error to check
 * @returns True if the error is a network error, false otherwise
 */
export function isNetworkError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || '';
  
  return errorMessage.includes('ECONNREFUSED') ||
    errorMessage.includes('ECONNRESET') ||
    errorMessage.includes('ETIMEDOUT') ||
    errorMessage.includes('Network Error') ||
    errorMessage.includes('network') ||
    errorMessage.includes('connection');
}

/**
 * Determine if an error is a DNS error
 * 
 * @param error The error to check
 * @returns True if the error is a DNS error, false otherwise
 */
export function isDNSError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || '';
  
  return errorMessage.includes('ENOTFOUND') ||
    errorMessage.includes('getaddrinfo') ||
    errorMessage.includes('dns') ||
    errorMessage.includes('resolve');
}

/**
 * Determine if an error is an SSL/TLS error
 * 
 * @param error The error to check
 * @returns True if the error is an SSL/TLS error, false otherwise
 */
export function isSSLError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || '';
  
  return errorMessage.includes('ssl') ||
    errorMessage.includes('tls') ||
    errorMessage.includes('certificate') ||
    errorMessage.includes('handshake') ||
    errorMessage.includes('UNABLE_TO_VERIFY_LEAF_SIGNATURE') ||
    errorMessage.includes('ERR_TLS_CERT_ALTNAME_INVALID') ||
    errorMessage.includes('ERR_CERT');
}

/**
 * Extract the status code from an HTTP error
 * 
 * @param error The error to extract the status code from
 * @returns The HTTP status code, or null if not found
 */
export function getHTTPStatusCode(error: any): number | null {
  if (!error) return null;
  
  // Try to get status from Axios error
  if (error.response && error.response.status) {
    return error.response.status;
  }
  
  // Try to extract from error message
  const errorMessage = typeof error === 'string' 
    ? error 
    : error.message || '';
  
  const statusMatch = errorMessage.match(/(\d{3})/);
  if (statusMatch && 
      (statusMatch[1].startsWith('4') || statusMatch[1].startsWith('5'))) {
    return parseInt(statusMatch[1], 10);
  }
  
  return null;
}

/**
 * Group errors into categories based on their type
 * 
 * @param errors An array of errors
 * @returns An object with errors grouped by category
 */
export function categorizeErrors(errors: any[]): Record<string, any[]> {
  const categories: Record<string, any[]> = {
    network: [],
    dns: [],
    ssl: [],
    http4xx: [],
    http5xx: [],
    other: []
  };
  
  errors.forEach(error => {
    if (isSSLError(error)) {
      categories.ssl.push(error);
    } else if (isDNSError(error)) {
      categories.dns.push(error);
    } else if (isNetworkError(error)) {
      categories.network.push(error);
    } else {
      const statusCode = getHTTPStatusCode(error);
      if (statusCode) {
        if (statusCode >= 400 && statusCode < 500) {
          categories.http4xx.push(error);
        } else if (statusCode >= 500) {
          categories.http5xx.push(error);
        } else {
          categories.other.push(error);
        }
      } else {
        categories.other.push(error);
      }
    }
  });
  
  return categories;
}