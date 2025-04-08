/**
 * Base API Client
 * 
 * This provides a consistent API for making HTTP requests with proper error handling
 * and authentication. It's extended by specific API clients for different integrations.
 */

import { ApiError, NetworkError, ValidationError } from './apiErrors';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  data?: any;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

export default class ApiClient {
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;
  protected defaultTimeout: number;

  constructor(
    baseUrl: string, 
    defaultHeaders: Record<string, string> = {}, 
    defaultTimeout: number = 30000
  ) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...defaultHeaders,
    };
    this.defaultTimeout = defaultTimeout;
  }

  /**
   * Make an HTTP request
   */
  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    // Merge default options with provided options
    const url = this.buildUrl(endpoint, options.params);
    const method = options.method || 'GET';
    const headers = { ...this.defaultHeaders, ...options.headers };
    const timeout = options.timeout || this.defaultTimeout;
    
    try {
      // Build request options
      const fetchOptions: RequestInit = {
        method,
        headers,
        credentials: options.withCredentials ? 'include' : 'same-origin',
      };

      // Add body for non-GET requests
      if (method !== 'GET' && options.data !== undefined) {
        fetchOptions.body = JSON.stringify(options.data);
      }

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      fetchOptions.signal = controller.signal;

      // Make the request
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      // Parse response based on responseType
      let data;
      if (options.responseType === 'text') {
        data = await response.text();
      } else if (options.responseType === 'blob') {
        data = await response.blob();
      } else if (options.responseType === 'arraybuffer') {
        data = await response.arrayBuffer();
      } else {
        // Default to JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }
      }

      // Handle error responses
      if (!response.ok) {
        this.handleErrorResponse(response, data);
      }

      return data as T;
    } catch (error) {
      return this.handleRequestError(error, endpoint);
    }
  }

  /**
   * Build URL with query parameters
   */
  protected buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = endpoint.startsWith('/') || endpoint.startsWith('http')
      ? endpoint
      : `${this.baseUrl}${endpoint}`;
    
    if (!params) return url;

    const queryParams = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    return queryParams ? `${url}${url.includes('?') ? '&' : '?'}${queryParams}` : url;
  }

  /**
   * Handle HTTP error responses
   */
  protected handleErrorResponse(response: Response, data: any): never {
    const status = response.status;
    const message = data?.message || data?.error || `HTTP Error ${status}`;

    if (status === 400) {
      throw new ValidationError(message, data?.errors || {}, status);
    } else if (status === 401) {
      throw new ApiError('Unauthorized: Authentication required', status);
    } else if (status === 403) {
      throw new ApiError('Forbidden: You do not have permission to access this resource', status);
    } else if (status === 404) {
      throw new ApiError(`Not Found: ${message}`, status);
    } else if (status === 429) {
      throw new ApiError('Rate Limit Exceeded: Too many requests', status);
    } else if (status >= 500) {
      throw new ApiError(`Server Error: ${message}`, status);
    } else {
      throw new ApiError(message, status);
    }
  }

  /**
   * Handle request errors (network errors, timeouts, etc.)
   */
  protected handleRequestError(error: any, endpoint: string): never {
    // Handle abort errors (timeouts)
    if (error.name === 'AbortError') {
      throw new NetworkError(`Request timeout for endpoint: ${endpoint}`);
    }

    // Handle API errors that were already thrown
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle other errors
    throw new NetworkError(
      `Network error while fetching ${endpoint}: ${error.message || String(error)}`
    );
  }

  /**
   * Convenience methods for common HTTP methods
   */
  async get<T = any>(endpoint: string, params?: Record<string, string | number | boolean | undefined>, options: Omit<RequestOptions, 'method' | 'params'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET', params });
  }

  async post<T = any>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', data });
  }

  async put<T = any>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', data });
  }

  async patch<T = any>(endpoint: string, data?: any, options: Omit<RequestOptions, 'method' | 'data'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', data });
  }

  async delete<T = any>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}