/**
 * Specialized error handler for website connection issues
 * This utility helps detect and classify common errors that can occur
 * when connecting to external websites, especially for accessibility testing
 */

import { AxiosError } from 'axios';

export interface ConnectionErrorDetails {
  type: 'ssl' | 'timeout' | 'cors' | 'dns' | 'network' | 'http' | 'unknown';
  message: string;
  technicalDetails?: string;
  userFriendlyMessage: string;
  possibleSolutions: string[];
}

/**
 * Analyzes a network error to determine the specific type of connection issue
 * @param error The error object from a failed network request
 * @returns ConnectionErrorDetails with classified error information
 */
export function analyzeConnectionError(error: any): ConnectionErrorDetails {
  // Default/fallback error
  let errorDetails: ConnectionErrorDetails = {
    type: 'unknown',
    message: 'Unknown connection error',
    userFriendlyMessage: 'We couldn\'t connect to this website due to an unexpected error.',
    possibleSolutions: [
      'Try checking the website directly in your browser',
      'Verify the URL is correct',
      'Try again later'
    ]
  };

  // Exit early if not an error object
  if (!error) return errorDetails;

  const axiosError = error as AxiosError;
  const errorMessage = axiosError.message || '';
  const errorResponse = axiosError.response;
  const errorRequest = axiosError.request;
  const errorCode = axiosError.code;

  // Check for specific error types
  
  // 1. SSL/TLS errors
  if (
    errorMessage.includes('SSL') || 
    errorMessage.includes('certificate') || 
    errorMessage.includes('CERT_') || 
    errorMessage.includes('SSL handshake') ||
    errorMessage.includes('TLS')
  ) {
    return {
      type: 'ssl',
      message: 'SSL/TLS Connection Error',
      technicalDetails: errorMessage,
      userFriendlyMessage: 'This website has SSL/TLS security configuration issues.',
      possibleSolutions: [
        'The website might have an expired or invalid SSL certificate',
        'There may be a TLS version mismatch or improper configuration',
        'Try visiting the website directly in your browser to see security warnings',
        'Contact the website administrator to fix their SSL/TLS configuration'
      ]
    };
  }

  // 2. Timeout errors
  if (
    errorCode === 'ECONNABORTED' || 
    errorMessage.includes('timeout') ||
    errorMessage.includes('timed out')
  ) {
    return {
      type: 'timeout',
      message: 'Connection Timeout',
      technicalDetails: errorMessage,
      userFriendlyMessage: 'The website took too long to respond.',
      possibleSolutions: [
        'The website may be experiencing heavy traffic or server issues',
        'The website might have performance problems',
        'Try testing again later when the website might be more responsive',
        'Check if the website is generally slow in regular browsers too'
      ]
    };
  }

  // 3. CORS errors
  if (
    errorMessage.includes('CORS') || 
    errorMessage.includes('Cross-Origin') ||
    errorMessage.includes('Access-Control-Allow-Origin')
  ) {
    return {
      type: 'cors',
      message: 'CORS Policy Blocked Request',
      technicalDetails: errorMessage,
      userFriendlyMessage: 'The website has security restrictions that prevent testing.',
      possibleSolutions: [
        'The website has restrictions that block external accessibility testing',
        'Testing can only be performed by the website owners',
        'Consider contacting the website administrator for cooperation on testing',
        'If you own this site, you could modify the CORS policies to allow testing'
      ]
    };
  }

  // 4. DNS resolution failures
  if (
    errorCode === 'ENOTFOUND' || 
    errorMessage.includes('getaddrinfo') ||
    errorMessage.includes('Could not resolve host')
  ) {
    return {
      type: 'dns',
      message: 'DNS Resolution Failed',
      technicalDetails: errorMessage,
      userFriendlyMessage: 'The website address could not be found.',
      possibleSolutions: [
        'Check if the URL is correct',
        'The website domain might not exist or may be experiencing DNS issues',
        'If the site was working previously, it may be a temporary DNS issue',
        'Try again later if you believe this is a temporary problem'
      ]
    };
  }

  // 5. General network issues
  if (errorRequest && !errorResponse) {
    return {
      type: 'network',
      message: 'Network Connection Failed',
      technicalDetails: errorMessage,
      userFriendlyMessage: 'We couldn\'t establish a connection to the website.',
      possibleSolutions: [
        'The website might be down or experiencing server issues',
        'There may be network issues preventing the connection',
        'Try again later or check if the website is accessible in your browser',
        'The website may have firewall rules blocking our testing tools'
      ]
    };
  }

  // 6. HTTP errors (we received a response but with an error status)
  if (errorResponse && errorResponse.status) {
    let httpErrorMessage = '';
    let httpSolutions: string[] = [];

    switch (errorResponse.status) {
      case 301:
      case 302:
      case 307:
      case 308:
        httpErrorMessage = 'The website redirected us too many times.';
        httpSolutions = [
          'The website might have redirect loops',
          'Try accessing the final redirect destination directly',
          'The website might be attempting to block automated tools'
        ];
        break;
      case 401:
        httpErrorMessage = 'The website requires authentication.';
        httpSolutions = [
          'This website requires login credentials',
          'You need to be logged in to test this page',
          'Try testing publicly accessible pages instead'
        ];
        break;
      case 403:
        httpErrorMessage = 'The website denied access to our testing tools.';
        httpSolutions = [
          'The website may have security measures blocking automated testing',
          'Try accessing the website directly in your browser',
          'You may need special permissions to test this website'
        ];
        break;
      case 404:
        httpErrorMessage = 'The page was not found on this website.';
        httpSolutions = [
          'Check if the URL is correct',
          'The page might have been moved or deleted',
          'Try testing the website\'s homepage instead'
        ];
        break;
      case 429:
        httpErrorMessage = 'The website is limiting the number of requests.';
        httpSolutions = [
          'The website has rate limiting in place',
          'Try again later after waiting a while',
          'Consider testing less frequently'
        ];
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        httpErrorMessage = 'The website is experiencing server issues.';
        httpSolutions = [
          'The website\'s server is having technical problems',
          'This is likely a temporary issue',
          'Try again later when the website may be functioning normally'
        ];
        break;
      default:
        httpErrorMessage = `The website returned an HTTP error: ${errorResponse.status}`;
        httpSolutions = [
          'The website returned an unexpected error response',
          'Try accessing the website directly to see if it\'s working properly',
          'The issue may be temporary, try again later'
        ];
    }

    return {
      type: 'http',
      message: `HTTP Error ${errorResponse.status}`,
      technicalDetails: errorResponse.statusText || errorMessage,
      userFriendlyMessage: httpErrorMessage,
      possibleSolutions: httpSolutions
    };
  }

  // Return default error if no specific type was identified
  return errorDetails;
}

/**
 * Creates a user-friendly error message for website connection issues
 * @param url The URL that failed to connect
 * @param error The error object received
 * @returns A formatted error message object with detailed diagnosis
 */
export function getWebsiteConnectionErrorMessage(url: string, error: any): {
  title: string;
  message: string;
  details: ConnectionErrorDetails;
} {
  const errorDetails = analyzeConnectionError(error);
  
  let title = 'Connection Issue';
  switch (errorDetails.type) {
    case 'ssl':
      title = 'SSL/TLS Certificate Issue';
      break;
    case 'timeout':
      title = 'Connection Timeout';
      break;
    case 'cors':
      title = 'Website Access Restricted';
      break;
    case 'dns':
      title = 'Website Not Found';
      break;
    case 'http':
      title = 'Website Error';
      break;
    case 'network':
      title = 'Network Connection Failed';
      break;
  }

  return {
    title,
    message: `We encountered an issue connecting to ${url}: ${errorDetails.userFriendlyMessage}`,
    details: errorDetails
  };
}