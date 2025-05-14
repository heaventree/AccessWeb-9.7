/**
 * Error handling utility for Axios HTTP errors
 * Extracts useful information from Axios error objects
 */

import axios from 'axios';
import { analyzeConnectionError, type ConnectionErrorDetails } from './websiteConnectionErrorHandler';
import { WebsiteConnectionError } from './websiteConnectionChecker';

/**
 * Process an axios error and extract connection-related details
 * 
 * @param error The axios error object
 * @param url The URL that was being accessed
 * @returns A standardized error with user-friendly details
 */
export function handleAxiosError(error: unknown, url: string): WebsiteConnectionError {
  // If we already have our custom error type, just return it
  if (error instanceof WebsiteConnectionError) {
    return error;
  }
  
  let details: ConnectionErrorDetails;
  
  // Handle axios-specific error format
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    
    // Handle different HTTP status codes
    if (status) {
      // Client errors (4xx)
      if (status >= 400 && status < 500) {
        if (status === 401 || status === 403) {
          details = {
            type: 'server',
            message: 'Authentication Required',
            technicalDetails: `HTTP ${status}: ${error.response?.statusText}`,
            userFriendlyMessage: 'This website requires authentication to access.',
            possibleSolutions: [
              'You may need to log in to access this content',
              'The website might restrict automated testing tools',
              'Try visiting the website directly in your browser'
            ]
          };
        } else if (status === 404) {
          details = {
            type: 'server',
            message: 'Page Not Found',
            technicalDetails: `HTTP 404: ${error.response?.statusText}`,
            userFriendlyMessage: 'The requested page could not be found on this website.',
            possibleSolutions: [
              'Check if the URL is correct',
              'The page might have been moved or removed',
              'Try accessing the website homepage first'
            ]
          };
        } else {
          details = {
            type: 'server',
            message: 'Client Error',
            technicalDetails: `HTTP ${status}: ${error.response?.statusText}`,
            userFriendlyMessage: 'The website rejected our request.',
            possibleSolutions: [
              'The website might have security measures that block our testing tools',
              'Try accessing the website directly in your browser',
              'Contact the website administrator if you need help'
            ]
          };
        }
      } 
      // Server errors (5xx)
      else if (status >= 500) {
        details = {
          type: 'server',
          message: 'Server Error',
          technicalDetails: `HTTP ${status}: ${error.response?.statusText}`,
          userFriendlyMessage: 'The website server encountered an error.',
          possibleSolutions: [
            'The website might be experiencing technical difficulties',
            'Try again later when the server issues may be resolved',
            'Contact the website administrator if the problem persists'
          ]
        };
      } else {
        // Fallback for other status codes
        details = {
          type: 'unknown',
          message: `HTTP Error: ${status}`,
          technicalDetails: `${error.response?.statusText || 'Unknown error'}`,
          userFriendlyMessage: 'The website returned an unexpected response.',
          possibleSolutions: [
            'Try again later',
            'Check if the website is working properly'
          ]
        };
      }
    } 
    // Network errors (no response)
    else if (error.request) {
      // Check the error message for clues about the type of network error
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        details = {
          type: 'timeout',
          message: 'Request Timeout',
          technicalDetails: error.message,
          userFriendlyMessage: 'The website took too long to respond.',
          possibleSolutions: [
            'The website servers might be overloaded',
            'Your internet connection might be slow or unstable',
            'Try again later when the website may be more responsive'
          ]
        };
      } else if (
        errorMessage.includes('ssl') || 
        errorMessage.includes('tls') || 
        errorMessage.includes('certificate') ||
        errorMessage.includes('handshake')
      ) {
        details = {
          type: 'ssl',
          message: 'SSL/TLS Connection Error',
          technicalDetails: error.message,
          userFriendlyMessage: 'There is a security certificate issue with this website.',
          possibleSolutions: [
            'The website might have an expired or invalid SSL certificate',
            'There may be a TLS version mismatch or improper configuration',
            'Try visiting the website directly in your browser to see security warnings',
            'Contact the website administrator to fix their SSL/TLS configuration'
          ]
        };
      } else {
        // Use our general connection error analyzer
        details = analyzeConnectionError(new Error(error.message));
      }
    } else {
      // Something happened in setting up the request
      details = {
        type: 'unknown',
        message: 'Request Configuration Error',
        technicalDetails: error.message,
        userFriendlyMessage: 'An error occurred while preparing the request to the website.',
        possibleSolutions: [
          'Check if the URL is valid',
          'Try again later',
          'If the problem persists, please contact support'
        ]
      };
    }
  } else if (error instanceof Error) {
    // For non-Axios errors, use the general analyzer
    details = analyzeConnectionError(error);
  } else {
    // Handle non-Error objects
    details = {
      type: 'unknown',
      message: 'Unknown Error',
      technicalDetails: String(error),
      userFriendlyMessage: 'An unexpected error occurred while trying to access this website.',
      possibleSolutions: [
        'Try again later',
        'Check if the website is accessible in your browser'
      ]
    };
  }
  
  return new WebsiteConnectionError(url, `Connection to ${url} failed: ${details.message}`, details);
}