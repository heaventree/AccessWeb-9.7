import type { APIError } from '../types/api';
import { toast } from 'react-hot-toast';

// Known errors to suppress
const suppressedErrors = new Set([
  '42710: policy "Users can manage own API keys" for table "api_keys" already exists'
]);

// Error categories for better handling
const errorCategories = {
  auth: ['invalid_api_key', 'expired_api_key', 'insufficient_permissions'],
  rate_limit: ['rate_limit_exceeded', 'too_many_requests'],
  validation: ['invalid_input', 'missing_required_field'],
  network: ['network_error', 'timeout', 'connection_failed'],
  server: ['internal_server_error', 'service_unavailable']
};

export function handleAPIError(error: any): APIError {
  // Extract error details
  const code = error.code || error.error?.code || 'UNKNOWN_ERROR';
  const message = error.message || error.error?.message || 'An unexpected error occurred';
  const details = error.details || error.error?.details;

  // Create standardized error object
  const apiError: APIError = {
    code,
    message,
    details
  };

  // Check if error should be suppressed
  const errorMessage = `${apiError.code}: ${apiError.message}`;
  if (suppressedErrors.has(errorMessage)) {
    console.debug('Suppressed error:', errorMessage);
    return {
      code: 'SUPPRESSED_ERROR',
      message: 'Operation completed with suppressed warnings',
      details: { suppressedError: errorMessage }
    };
  }

  // Handle error by category
  if (errorCategories.auth.includes(code)) {
    toast.error('Authentication error. Please check your credentials.');
  } else if (errorCategories.rate_limit.includes(code)) {
    toast.error('Rate limit exceeded. Please try again later.');
  } else if (errorCategories.validation.includes(code)) {
    toast.error('Invalid input. Please check your data.');
  } else if (errorCategories.network.includes(code)) {
    toast.error('Network error. Please check your connection.');
  } else if (errorCategories.server.includes(code)) {
    toast.error('Server error. Please try again later.');
  } else {
    console.error('Unhandled API Error:', apiError);
    toast.error('An unexpected error occurred');
  }

  return apiError;
}

export function isSuppressedError(error: any): boolean {
  if (!error) return false;
  const errorMessage = `${error.code}: ${error.message}`;
  return suppressedErrors.has(errorMessage);
}