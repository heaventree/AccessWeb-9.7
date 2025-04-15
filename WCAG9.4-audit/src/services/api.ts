/**
 * Secure API Service
 * 
 * Provides a secure interface for making API requests with proper security headers,
 * authentication, CSRF protection, and error handling.
 */

import { authStorage } from '../utils/secureStorage';
import { getApiUrl, IS_DEVELOPMENT_MODE } from '../utils/environment';
import { corsConfig, validateCors } from '../config/cors';
import { ErrorType, createError, handleApiError } from '../utils/errorHandler';

export interface ApiRequestOptions extends RequestInit {
  useAuth?: boolean;
  retries?: number; 
  timeout?: number;
  abortController?: AbortController;
}

export interface ApiErrorResponse {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiRequestConfig {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  defaultOptions?: ApiRequestOptions;
}

export class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultOptions: ApiRequestOptions;
  private rateLimit: {
    maxRequests: number;
    timeWindow: number;
    currentRequests: number;
    resetTime: number;
  };

  constructor(config?: ApiRequestConfig) {
    this.baseUrl = config?.baseUrl || getApiUrl();
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config?.defaultHeaders,
    };
    this.defaultOptions = {
      useAuth: true,
      retries: 3,
      timeout: 30000, // 30 seconds default timeout
      ...config?.defaultOptions,
    };
    this.rateLimit = {
      maxRequests: 60, // 60 requests per minute by default
      timeWindow: 60 * 1000, // 1 minute in milliseconds
      currentRequests: 0,
      resetTime: Date.now() + 60 * 1000,
    };
  }

  /**
   * Make a secure API request with proper error handling and security headers
   */
  async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    try {
      // Rate limiting check
      if (!this.checkRateLimit()) {
        throw createError(
          ErrorType.API,
          'rate_limit_exceeded',
          'Rate limit exceeded. Please try again later.',
          { maxRequests: this.rateLimit.maxRequests, timeWindow: this.rateLimit.timeWindow }
        );
      }

      // Create abort controller for timeout if not provided
      const abortController = options.abortController || new AbortController();
      
      // Set up timeout
      const timeoutMs = options.timeout || this.defaultOptions.timeout || 30000;
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, timeoutMs);

      // Apply default options
      const useAuth = options.useAuth ?? this.defaultOptions.useAuth;
      
      // Build headers with security best practices
      const headers = new Headers(this.defaultHeaders);
      
      // Add authorization header if required and token exists
      if (useAuth) {
        const token = authStorage.getItem('token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      
      // Add security headers
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-XSS-Protection', '1; mode=block');
      
      // Add CSRF protection if method is not GET or HEAD
      const method = options.method || 'GET';
      if (method !== 'GET' && method !== 'HEAD') {
        const csrfToken = authStorage.getItem('csrf') || this.generateCsrfToken();
        headers.set('X-CSRF-Token', csrfToken);
      }

      // Validate request against CORS rules
      // In client-side code, the browser enforces CORS, but we add an extra check
      // to avoid making requests that will definitely fail due to CORS
      if (!IS_DEVELOPMENT_MODE) {
        const apiUrl = new URL(`${this.baseUrl}${endpoint}`);
        if (!validateCors(apiUrl.origin)) {
          throw createError(
            ErrorType.NETWORK,
            'cors_error',
            'Request blocked due to CORS policy',
            { origin: apiUrl.origin }
          );
        }
      }
      
      // Add CORS headers for cross-origin requests
      corsConfig.allowedHeaders.forEach((headerName) => {
        if (!headers.has(headerName)) {
          headers.set(headerName, '');
        }
      });
      
      // Make the API request with all security measures
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: abortController.signal,
        credentials: 'include', // Include cookies for session management
        mode: 'cors', // Explicitly enable CORS
      });

      // Clear timeout
      clearTimeout(timeoutId);

      // Handle response based on status code
      if (!response.ok) {
        // Try to parse error response
        let errorData: ApiErrorResponse;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            code: `http_${response.status}`,
            message: response.statusText || 'API request failed',
          };
        }

        // Check if we need to retry
        const retries = options.retries !== undefined 
          ? options.retries 
          : (this.defaultOptions.retries || 0);
          
        if (this.shouldRetry(response.status) && retries > 0) {
          // Calculate exponential backoff delay
          const defaultRetries = this.defaultOptions.retries || 3;
          const attempt = defaultRetries - retries + 1;
          const delay = this.calculateBackoff(attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Retry with one less retry attempt
          return this.request<T>(endpoint, {
            ...options,
            retries: retries - 1,
          });
        }

        // If we reached here, either we should not retry or we've exhausted retries
        throw errorData;
      }

      // For successful responses, parse and return the data
      if (response.status !== 204) { // No Content
        const data = await response.json();
        return data as T;
      }

      return {} as T;
    } catch (error) {
      // Re-throw abort errors
      if (error instanceof DOMException && error.name === 'AbortError') {
        const timeout = options.timeout || this.defaultOptions.timeout || 30000;
        throw createError(
          ErrorType.NETWORK,
          'request_timeout',
          'Request timed out',
          { endpoint, method: options.method || 'GET', timeout }
        );
      }

      // If it's already a properly formatted error response from our error handler, rethrow
      if ((error as any)?.type && (error as any)?.code) {
        throw error;
      }

      // For API errors that have a code property but not our full error format
      if ((error as ApiErrorResponse)?.code) {
        throw createError(
          ErrorType.API,
          (error as ApiErrorResponse).code,
          (error as ApiErrorResponse).message || 'API request failed',
          (error as ApiErrorResponse).details
        );
      }

      // Handle all other unexpected errors
      console.error('API request failed:', error);
      throw handleApiError(error);
    }
  }

  /**
   * Convenience method for GET requests
   */
  async get<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  /**
   * Convenience method for POST requests
   */
  async post<T>(
    endpoint: string,
    data: unknown,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Convenience method for PUT requests
   */
  async put<T>(
    endpoint: string,
    data: unknown,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Convenience method for PATCH requests
   */
  async patch<T>(
    endpoint: string,
    data: unknown,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Convenience method for DELETE requests
   */
  async delete<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Generate a CSRF token
   */
  private generateCsrfToken(): string {
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    authStorage.setItem('csrf', token);
    return token;
  }

  /**
   * Check if we should retry based on status code
   */
  private shouldRetry(status: number): boolean {
    // Retry on server errors or specific client errors
    return (
      status >= 500 || // Server errors
      status === 408 || // Request Timeout
      status === 429 // Too Many Requests
    );
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoff(attempt: number): number {
    // Exponential backoff with jitter: (2^attempt * 100) + random(50)
    const expBackoff = Math.pow(2, attempt) * 100;
    const jitter = Math.floor(Math.random() * 50);
    return expBackoff + jitter;
  }

  /**
   * Check rate limit and update counters
   */
  private checkRateLimit(): boolean {
    const now = Date.now();

    // Reset counters if time window has passed
    if (now > this.rateLimit.resetTime) {
      this.rateLimit.currentRequests = 0;
      this.rateLimit.resetTime = now + this.rateLimit.timeWindow;
    }

    // Check if rate limit is exceeded
    if (this.rateLimit.currentRequests >= this.rateLimit.maxRequests) {
      return false;
    }

    // Increment request counter
    this.rateLimit.currentRequests++;
    return true;
  }
}

// Create and export default API service instance
const api = new ApiService();
export default api;

// Re-export specialized API services
export { default as authApi } from './authApi';
export { default as paymentsApi } from './paymentsApi';