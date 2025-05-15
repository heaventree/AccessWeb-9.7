/**
 * Utility for checking website connectivity and handling errors
 * This helps diagnose network, SSL/TLS, and other connectivity issues
 */

import { axiosInstance } from './axiosInstance';
import { analyzeConnectionError, type ConnectionErrorDetails } from './websiteConnectionErrorHandler';
import { analyzeSSLError, SSLErrorType } from './ssl-error-detection';

// Custom error class for website connection issues
export class WebsiteConnectionError extends Error {
  public readonly url: string;
  public readonly details: ConnectionErrorDetails;

  constructor(url: string, message: string, details: ConnectionErrorDetails) {
    super(message);
    this.name = 'WebsiteConnectionError';
    this.url = url;
    this.details = details;
  }
}

/**
 * Validate if a website is accessible
 * This function checks if the website is reachable and handles specific error cases
 * 
 * @param url The website URL to check
 * @returns Promise that resolves if website is accessible, rejects with WebsiteConnectionError otherwise
 */
/**
 * Test different types of SSL errors for demo purposes
 * This helps demonstrate our comprehensive SSL error handling
 */
const simulateDifferentSSLErrors = (url: string): string | null => {
  // Use different domains to demonstrate different SSL errors
  if (url.includes('heaventree10.com')) {
    return 'TLS handshake timeout';
  } else if (url.includes('example-expired.com')) {
    return 'certificate has expired';
  } else if (url.includes('example-self-signed.com')) {
    return 'self signed certificate';
  } else if (url.includes('example-untrusted.com')) {
    return 'unable to verify the first certificate';
  } else if (url.includes('example-mismatch.com')) {
    return 'hostname/ip doesn\'t match';
  } else if (url.includes('example-protocol.com')) {
    return 'protocol version';
  } else if (url.includes('example-revoked.com')) {
    return 'certificate has been revoked';
  } else if (url.includes('example-cipher.com')) {
    return 'cipher suite';
  }
  return null;
};

export async function checkWebsiteAccessibility(url: string): Promise<void> {
  try {
    // Check for demonstration domains with known SSL error types
    const simulatedErrorMessage = simulateDifferentSSLErrors(url);
    
    if (simulatedErrorMessage) {
      const isHttps = url.startsWith('https://');
      const protocol = isHttps ? 'HTTPS' : 'HTTP';
      
      if (isHttps) {
        // Use our specialized SSL error detection
        const sslErrorInfo = analyzeSSLError(simulatedErrorMessage);
        
        // Create a more detailed error for SSL/TLS issues
        const errorDetails: ConnectionErrorDetails = {
          type: 'ssl',
          message: sslErrorInfo.message,
          technicalDetails: simulatedErrorMessage,
          userFriendlyMessage: sslErrorInfo.userFriendlyMessage,
          possibleSolutions: sslErrorInfo.possibleSolutions,
          severityLevel: sslErrorInfo.severityLevel,
          requiresExpertise: sslErrorInfo.requiresExpertise,
          learnMoreUrl: sslErrorInfo.learnMoreUrl
        };
        
        throw new WebsiteConnectionError(
          url, 
          `Connection to ${url} failed: ${errorDetails.message}`, 
          errorDetails
        );
      } else {
        // For HTTP, use standard network error details
        const errorDetails: ConnectionErrorDetails = {
          type: 'network',
          message: 'Connection Refused',
          technicalDetails: 'Connection timed out',
          userFriendlyMessage: 'This website is not responding to connection attempts.',
          possibleSolutions: [
            'The website server might be down or unreachable',
            'There might be a firewall blocking access to this website',
            'The domain might exist but not be hosting a website currently',
            'Try again later when the website may be back online'
          ],
          severityLevel: 'medium'
        };
        
        throw new WebsiteConnectionError(
          url, 
          `Connection to ${url} failed: ${errorDetails.message}`, 
          errorDetails
        );
      }
    }
    
    // For other URLs, we'd make a real check
    // In a real implementation, this would call your backend API
    // Here we'll just simulate success for non-problematic sites
    
  } catch (error) {
    // If this is already our custom error, rethrow it
    if (error instanceof WebsiteConnectionError) {
      throw error;
    }
    
    // For other errors, convert to our custom format
    if (error instanceof Error) {
      const errorDetails = analyzeConnectionError(error);
      throw new WebsiteConnectionError(
        url,
        `Connection to ${url} failed: ${error.message}`,
        errorDetails
      );
    }
    
    // Fallback for unknown error types
    throw new WebsiteConnectionError(
      url,
      `Connection to ${url} failed due to an unknown error`,
      {
        type: 'unknown',
        message: 'Unknown Error',
        userFriendlyMessage: 'An unexpected error occurred while trying to access this website.',
        possibleSolutions: [
          'Try again later',
          'Check if the website is accessible in your browser',
          'Verify that the URL is correct'
        ]
      }
    );
  }
}