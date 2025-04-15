/**
 * API Client Utility
 * 
 * A secure wrapper around fetch for making API requests with built-in
 * security features like CSRF protection, data sanitization, and error handling.
 */

import { sanitizeObject } from './sanitization';
import { getCsrfToken, appendCsrfHeader } from './csrfProtection';
import { ErrorType, createError, isAppError } from './errorHandler';
import { addSecurityHeaders } from './securityHeaders';
import { rateLimitCheck } from './rateLimiting';

// Types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiClientOptions {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
  withCredentials?: boolean;
  timeout?: number;
  retries?: number;
  csrfProtection?: boolean;
  sanitizeResponses?: boolean;
}

interface RequestOptions {
  headers?: Record<string, string>;
  withCredentials?: boolean;
  timeout?: number;
  retries?: number;
  skipSanitization?: boolean;
  skipRateLimiting?: boolean;
  abortSignal?: AbortSignal;
}

/**
 * Create a secure API client with configurable security features
 */
export function createApiClient(options: ApiClientOptions) {
  const {
    baseUrl,
    defaultHeaders = {},
    withCredentials = true,
    timeout = 30000,
    retries = 1,
    csrfProtection = true,
    sanitizeResponses = true
  } = options;

  /**
   * Internal request function with security features
   */
  async function secureRequest<T>(
    method: HttpMethod,
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    // Apply rate limiting (if not skipped)
    if (!options.skipRateLimiting) {
      rateLimitCheck(`${method}:${endpoint}`);
    }

    // Sanitize request data by default
    const sanitizedData = options.skipSanitization ? data : sanitizeObject(data);

    // Setup request timeout
    const requestTimeout = options.timeout || timeout;
    const controller = new AbortController();
    
    // If an external abort signal is provided, link it
    if (options.abortSignal) {
      options.abortSignal.addEventListener('abort', () => controller.abort());
    }
    
    // Setup timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, requestTimeout);

    try {
      // Prepare headers with security measures
      const headers = new Headers({
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...options.headers
      });
      
      // Add security headers
      addSecurityHeaders(headers);
      
      // Add CSRF protection if enabled
      if (csrfProtection) {
        await appendCsrfHeader(headers);
      }
      
      // Prepare request options
      const requestOptions: RequestInit = {
        method,
        headers,
        credentials: (options.withCredentials ?? withCredentials) ? 'include' : 'same-origin',
        signal: controller.signal
      };
      
      // Add body for non-GET requests
      if (method !== 'GET' && sanitizedData) {
        requestOptions.body = JSON.stringify(sanitizedData);
      }
      
      // Execute request
      const response = await fetch(`${baseUrl}${endpoint}`, requestOptions);
      
      clearTimeout(timeoutId);
      
      // Process response
      if (!response.ok) {
        // Handle error response
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (err) {
          // Failed to parse error response
        }
        
        throw createError(
          ErrorType.API,
          `api_${response.status}`,
          errorData.message || `API error (${response.status})`,
          { statusCode: response.status, ...errorData }
        );
      }
      
      // Check if response is empty
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {} as T;
      }
      
      // Parse and sanitize response
      const responseData = await response.json();
      return sanitizeResponses && !options.skipSanitization
        ? sanitizeObject(responseData)
        : responseData;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw createError(
          ErrorType.TIMEOUT,
          'request_timeout',
          `Request timed out after ${requestTimeout}ms`,
          { endpoint, method }
        );
      }
      
      if (isAppError(error)) {
        throw error;
      }
      
      throw createError(
        ErrorType.API,
        'request_failed',
        'API request failed',
        { endpoint, method },
        error
      );
    }
  }
  
  // Public API methods
  return {
    /**
     * Make a GET request
     */
    async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
      return secureRequest<T>('GET', endpoint, undefined, options);
    },
    
    /**
     * Make a POST request
     */
    async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
      return secureRequest<T>('POST', endpoint, data, options);
    },
    
    /**
     * Make a PUT request
     */
    async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
      return secureRequest<T>('PUT', endpoint, data, options);
    },
    
    /**
     * Make a PATCH request
     */
    async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
      return secureRequest<T>('PATCH', endpoint, data, options);
    },
    
    /**
     * Make a DELETE request
     */
    async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
      return secureRequest<T>('DELETE', endpoint, undefined, options);
    },
    
    /**
     * Get a fresh CSRF token
     */
    async refreshCsrfToken(): Promise<string> {
      return getCsrfToken(true);
    }
  };
}

// Create default API client instance
export const apiClient = createApiClient({
  baseUrl: '/api',
  csrfProtection: true,
  sanitizeResponses: true
});

export default apiClient;