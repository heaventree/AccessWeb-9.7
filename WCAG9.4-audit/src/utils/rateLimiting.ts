/**
 * Rate Limiting Utility
 * 
 * Provides client-side rate limiting protection against brute force attacks
 * and excessive API usage. Helps prevent account lockouts and API throttling.
 */

import { ErrorType, createError } from './errorHandler';
import { RATE_LIMITING_ENABLED } from './environment';

// Rate limiting storage prefix
const RATE_LIMIT_PREFIX = 'rate_limit:';

// Default rate limits
const DEFAULT_WINDOW_MS = 60000; // 1 minute
const DEFAULT_MAX_REQUESTS = 60; // 60 requests per minute

/**
 * Rate limiter configuration
 */
interface RateLimiterOptions {
  /**
   * Identifier for this rate limit (e.g., 'login', 'api')
   */
  key: string;
  
  /**
   * Time window in milliseconds
   */
  windowMs?: number;
  
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests?: number;
  
  /**
   * Whether to throw an error when rate limit is exceeded (true)
   * or just return a boolean result (false)
   */
  throwOnLimit?: boolean;
}

/**
 * Rate limit information
 */
interface RateLimitInfo {
  /**
   * Timestamp when the window started
   */
  windowStart: number;
  
  /**
   * Number of requests made in current window
   */
  requestCount: number;
  
  /**
   * Maximum requests allowed in window
   */
  maxRequests: number;
  
  /**
   * Window duration in milliseconds
   */
  windowMs: number;
}

/**
 * Get the stored rate limit information
 * @param key Rate limit key
 * @returns Rate limit info or null if not found
 */
function getRateLimitInfo(key: string): RateLimitInfo | null {
  try {
    const storageKey = RATE_LIMIT_PREFIX + key;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) {
      return null;
    }
    
    return JSON.parse(stored) as RateLimitInfo;
  } catch (error) {
    console.error(`Error getting rate limit info for ${key}:`, error);
    return null;
  }
}

/**
 * Store rate limit information
 * @param key Rate limit key
 * @param info Rate limit info
 */
function storeRateLimitInfo(key: string, info: RateLimitInfo): void {
  try {
    const storageKey = RATE_LIMIT_PREFIX + key;
    localStorage.setItem(storageKey, JSON.stringify(info));
  } catch (error) {
    console.error(`Error storing rate limit info for ${key}:`, error);
  }
}

/**
 * Check and increment rate limit counter
 * @param options Rate limiter options
 * @returns Boolean indicating if request is allowed
 * @throws Error if rate limit exceeded and throwOnLimit is true
 */
export function checkRateLimit(options: RateLimiterOptions): boolean {
  // Skip if rate limiting is disabled
  if (!RATE_LIMITING_ENABLED) {
    return true;
  }
  
  const {
    key,
    windowMs = DEFAULT_WINDOW_MS,
    maxRequests = DEFAULT_MAX_REQUESTS,
    throwOnLimit = true
  } = options;
  
  // Get current limit info
  let limitInfo = getRateLimitInfo(key);
  const now = Date.now();
  
  // Create new window if needed
  if (!limitInfo || (now - limitInfo.windowStart) > limitInfo.windowMs) {
    limitInfo = {
      windowStart: now,
      requestCount: 0,
      maxRequests,
      windowMs
    };
  }
  
  // Check if limit exceeded
  if (limitInfo.requestCount >= limitInfo.maxRequests) {
    // Calculate time remaining until rate limit resets
    const resetTime = limitInfo.windowStart + limitInfo.windowMs;
    const msRemaining = Math.max(0, resetTime - now);
    const secondsRemaining = Math.ceil(msRemaining / 1000);
    
    if (throwOnLimit) {
      throw createError(
        ErrorType.RATE_LIMIT,
        'rate_limit_exceeded',
        `Rate limit exceeded. Please try again in ${secondsRemaining} seconds.`,
        {
          key,
          maxRequests: limitInfo.maxRequests,
          windowMs: limitInfo.windowMs,
          resetTime,
          remainingSeconds: secondsRemaining
        }
      );
    }
    
    return false;
  }
  
  // Increment counter and store
  limitInfo.requestCount++;
  storeRateLimitInfo(key, limitInfo);
  
  return true;
}

/**
 * Get remaining requests for a rate limit key
 * @param key Rate limit key
 * @param defaultMax Default max requests if not found
 * @returns Number of remaining requests allowed
 */
export function getRemainingRequests(key: string, defaultMax: number = DEFAULT_MAX_REQUESTS): number {
  // Skip if rate limiting is disabled
  if (!RATE_LIMITING_ENABLED) {
    return defaultMax;
  }
  
  const limitInfo = getRateLimitInfo(key);
  
  if (!limitInfo) {
    return defaultMax;
  }
  
  // Check if window has expired
  const now = Date.now();
  if ((now - limitInfo.windowStart) > limitInfo.windowMs) {
    return limitInfo.maxRequests;
  }
  
  return Math.max(0, limitInfo.maxRequests - limitInfo.requestCount);
}

/**
 * Reset a rate limit counter
 * @param key Rate limit key
 */
export function resetRateLimit(key: string): void {
  try {
    const storageKey = RATE_LIMIT_PREFIX + key;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error(`Error resetting rate limit for ${key}:`, error);
  }
}

/**
 * Create a rate-limited version of a function
 * @param fn Function to rate limit
 * @param options Rate limiter options
 * @returns Rate-limited function
 */
export function createRateLimitedFunction<T extends (...args: any[]) => any>(
  fn: T,
  options: RateLimiterOptions
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    // Check rate limit
    checkRateLimit(options);
    
    // Call function if not exceeded
    return fn(...args);
  };
}

export default {
  checkRateLimit,
  getRemainingRequests,
  resetRateLimit,
  createRateLimitedFunction
};