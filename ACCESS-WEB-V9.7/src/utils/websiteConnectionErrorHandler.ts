/**
 * Error analysis and handling utility for website connection issues
 * This helps provide user-friendly error messages and troubleshooting steps
 */

export interface ConnectionErrorDetails {
  type: 'dns' | 'network' | 'ssl' | 'timeout' | 'cors' | 'server' | 'unknown';
  message: string;
  technicalDetails?: string;
  userFriendlyMessage: string;
  possibleSolutions: string[];
}

/**
 * Analyze a connection error and extract useful details
 * @param error The original error object
 * @returns Structured error details with user-friendly messages
 */
export function analyzeConnectionError(error: Error): ConnectionErrorDetails {
  const errorMessage = error.message.toLowerCase();
  
  // DNS errors
  if (
    errorMessage.includes('getaddrinfo') || 
    errorMessage.includes('dns') || 
    errorMessage.includes('enotfound') ||
    errorMessage.includes('could not resolve host')
  ) {
    return {
      type: 'dns',
      message: 'DNS Resolution Error',
      technicalDetails: error.message,
      userFriendlyMessage: 'The domain name could not be found.',
      possibleSolutions: [
        'Check if the URL is spelled correctly',
        'The website might be temporarily unavailable',
        'The domain may no longer exist',
        'Your network DNS settings might be misconfigured'
      ]
    };
  }

  // SSL/TLS errors
  if (
    errorMessage.includes('ssl') || 
    errorMessage.includes('tls') || 
    errorMessage.includes('certificate') ||
    errorMessage.includes('handshake') ||
    errorMessage.includes('cert')
  ) {
    return {
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
  }

  // Network connectivity errors
  if (
    errorMessage.includes('network') || 
    errorMessage.includes('econnrefused') || 
    errorMessage.includes('econnreset') ||
    errorMessage.includes('econnaborted') ||
    errorMessage.includes('connection refused') ||
    errorMessage.includes('network error')
  ) {
    return {
      type: 'network',
      message: 'Network Connection Error',
      technicalDetails: error.message,
      userFriendlyMessage: 'Cannot establish a connection to the website.',
      possibleSolutions: [
        'Check your internet connection',
        'The website might be down or unreachable',
        'A firewall might be blocking access',
        'Try again later when the website may be back online'
      ]
    };
  }

  // Timeout errors
  if (
    errorMessage.includes('timeout') || 
    errorMessage.includes('timed out') || 
    errorMessage.includes('etimedout')
  ) {
    return {
      type: 'timeout',
      message: 'Connection Timeout',
      technicalDetails: error.message,
      userFriendlyMessage: 'The website took too long to respond.',
      possibleSolutions: [
        'The website servers might be overloaded',
        'Your internet connection might be slow or unstable',
        'The website might be blocking automated requests',
        'Try again later when the website may be more responsive'
      ]
    };
  }

  // CORS errors
  if (
    errorMessage.includes('cors') || 
    errorMessage.includes('cross-origin') || 
    errorMessage.includes('cross origin')
  ) {
    return {
      type: 'cors',
      message: 'CORS Policy Error',
      technicalDetails: error.message,
      userFriendlyMessage: 'The website does not allow external access to its content.',
      possibleSolutions: [
        'The website has security policies that block our testing tools',
        'Contact the website administrator and ask them to allow access',
        'Consider testing the website manually instead'
      ]
    };
  }

  // Server errors
  if (
    errorMessage.includes('500') || 
    errorMessage.includes('502') || 
    errorMessage.includes('503') || 
    errorMessage.includes('504') ||
    errorMessage.includes('server error')
  ) {
    return {
      type: 'server',
      message: 'Server Error',
      technicalDetails: error.message,
      userFriendlyMessage: 'The website server encountered an error.',
      possibleSolutions: [
        'The website is experiencing technical difficulties',
        'Try again later when the server issues may be resolved',
        'Contact the website administrator if the problem persists'
      ]
    };
  }
  
  // Generic fallback for unknown errors
  return {
    type: 'unknown',
    message: 'Unknown Connection Error',
    technicalDetails: error.message,
    userFriendlyMessage: 'An unexpected error occurred while trying to access this website.',
    possibleSolutions: [
      'Try again later',
      'Check if the website is accessible in your browser',
      'Verify that the URL is correct'
    ]
  };
}