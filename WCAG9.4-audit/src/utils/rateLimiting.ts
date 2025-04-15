/**
 * Rate Limiting
 * 
 * Implements client-side rate limiting to prevent abuse and brute force attacks
 * by tracking request frequency and blocking excessive requests.
 */

import { logError, createError, ErrorType } from './errorHandler';
import { getEnvBoolean } from './environment';

// Feature flag
const RATE_LIMITING_ENABLED = getEnvBoolean('VITE_RATE_LIMITING_ENABLED', true);

// Rate limit storage
interface RateLimitBucket {
  /**
   * Number of requests in current window
   */
  count: number;
  
  /**
   * Timestamp when the current window expires
   */
  expiresAt: number;
}

// Store rate limit buckets in memory
const rateLimitBuckets: Record<string, RateLimitBucket> = {};

// Rate limit options
interface RateLimitOptions {
  /**
   * Key to identify the rate limit bucket
   */
  key: string;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number;
}

/**
 * Check rate limit and throw error if exceeded
 * @param options Rate limit options
 * @throws Error if rate limit exceeded
 */
export function checkRateLimit(options: RateLimitOptions): void {
  // Skip if rate limiting is disabled
  if (!RATE_LIMITING_ENABLED) {
    return;
  }
  
  try {
    const { key, windowMs, maxRequests } = options;
    const now = Date.now();
    
    // Get or create bucket
    let bucket = rateLimitBuckets[key];
    
    if (!bucket || now > bucket.expiresAt) {
      // Bucket doesn't exist or has expired, create new one
      bucket = {
        count: 0,
        expiresAt: now + windowMs
      };
      
      rateLimitBuckets[key] = bucket;
    }
    
    // Increment request count
    bucket.count++;
    
    // Check if rate limit exceeded
    if (bucket.count > maxRequests) {
      // Calculate retry after time in seconds
      const retryAfterMs = bucket.expiresAt - now;
      const retryAfterSecs = Math.ceil(retryAfterMs / 1000);
      
      // Throw rate limit error
      throw createError(
        ErrorType.RATE_LIMIT,
        'rate_limit_exceeded',
        `Rate limit exceeded. Try again in ${retryAfterSecs} seconds.`,
        {
          retryAfter: retryAfterSecs,
          limit: maxRequests,
          window: windowMs
        },
        'Too many requests. Please wait before trying again.',
        'Rate limit reached. For security reasons, please wait a moment before trying again.'
      );
    }
  } catch (error) {
    // Log error but don't rethrow non-rate limit errors to avoid blocking requests
    if (!(error instanceof Error) || (error as any).type !== ErrorType.RATE_LIMIT) {
      logError(error, { context: 'rateLimiting.checkRateLimit' });
      return;
    }
    
    // Rethrow rate limit errors
    throw error;
  }
}

/**
 * Reset rate limit for a specific key
 * @param key Rate limit key to reset
 */
export function resetRateLimit(key: string): void {
  delete rateLimitBuckets[key];
}

/**
 * Get current rate limit status
 * @param key Rate limit key
 * @returns Rate limit status or null if no bucket exists
 */
export function getRateLimitStatus(key: string): {
  remaining: number;
  total: number;
  resetsIn: number;
} | null {
  const bucket = rateLimitBuckets[key];
  
  if (!bucket) {
    return null;
  }
  
  // Calculate remaining requests
  const now = Date.now();
  
  // If expired, return null
  if (now > bucket.expiresAt) {
    delete rateLimitBuckets[key];
    return null;
  }
  
  // Return status
  return {
    remaining: Math.max(0, bucket.count),
    total: bucket.count,
    resetsIn: Math.ceil((bucket.expiresAt - now) / 1000)
  };
}

/**
 * Clear all rate limit buckets
 */
export function clearAllRateLimits(): void {
  Object.keys(rateLimitBuckets).forEach(key => {
    delete rateLimitBuckets[key];
  });
}

export default {
  checkRateLimit,
  resetRateLimit,
  getRateLimitStatus,
  clearAllRateLimits
};