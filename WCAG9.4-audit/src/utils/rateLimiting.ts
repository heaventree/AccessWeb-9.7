/**
 * Rate Limiting Utility
 * 
 * Provides client-side rate limiting to prevent abuse and API flooding.
 * Tracks request rates and applies throttling when necessary.
 */

import { ErrorType, createError } from './errorHandler';

interface RateLimitEntry {
  count: number;
  resetAt: number;
  blocked: boolean;
  lastRequest: number;
}

interface RateLimitOptions {
  // Maximum requests per time window
  maxRequests: number;
  
  // Time window in milliseconds
  windowMs: number;
  
  // Minimum time between requests in milliseconds
  minInterval?: number;
  
  // How long to block if rate limit is exceeded (ms)
  blockDuration?: number;
}

// Default limits (can be overridden on a per-endpoint basis)
const DEFAULT_LIMITS: RateLimitOptions = {
  maxRequests: 60, // 60 requests
  windowMs: 60 * 1000, // per minute
  minInterval: 50, // minimum 50ms between requests
  blockDuration: 30 * 1000 // block for 30 seconds if exceeded
};

// Store for rate limit tracking (endpoint -> rate limit data)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Custom rate limits for specific endpoints
const endpointLimits = new Map<string, RateLimitOptions>([
  // More restrictive limits for authentication endpoints
  ['POST:auth/login', { maxRequests: 5, windowMs: 60 * 1000, minInterval: 1000, blockDuration: 2 * 60 * 1000 }],
  ['POST:auth/register', { maxRequests: 3, windowMs: 60 * 1000, minInterval: 1000, blockDuration: 5 * 60 * 1000 }],
  ['POST:auth/reset-password', { maxRequests: 3, windowMs: 60 * 1000, minInterval: 1000, blockDuration: 5 * 60 * 1000 }],
  
  // More restrictive for sensitive operations
  ['*:user/*', { maxRequests: 30, windowMs: 60 * 1000, minInterval: 100, blockDuration: 60 * 1000 }],
  ['*:payment/*', { maxRequests: 10, windowMs: 60 * 1000, minInterval: 500, blockDuration: 60 * 1000 }],
  
  // Default for API endpoints
  ['*:api/*', { maxRequests: 60, windowMs: 60 * 1000, minInterval: 50, blockDuration: 30 * 1000 }]
]);

/**
 * Find the most specific rate limit for an endpoint
 * @param endpoint API endpoint
 * @returns Rate limit options
 */
function getLimitsForEndpoint(endpoint: string): RateLimitOptions {
  // Find most specific match
  let bestMatch: string | null = null;
  let maxMatchScore = 0;
  
  // Method:path format
  const [method, path] = endpoint.split(':');
  
  for (const [pattern, _] of endpointLimits) {
    const [patternMethod, patternPath] = pattern.split(':');
    
    // Skip if method doesn't match and isn't wildcard
    if (patternMethod !== '*' && patternMethod !== method) {
      continue;
    }
    
    // Calculate how specific the match is
    // More segments and non-wildcards = more specific
    const pathSegments = patternPath.split('/');
    const endpointSegments = path.split('/');
    
    // Skip if pattern has more segments than the endpoint
    if (pathSegments.length > endpointSegments.length) {
      continue;
    }
    
    // Check if pattern matches
    let matches = true;
    let matchScore = 0;
    
    for (let i = 0; i < pathSegments.length; i++) {
      const patternSeg = pathSegments[i];
      const endpointSeg = endpointSegments[i];
      
      if (patternSeg === '*' || patternSeg === endpointSeg) {
        matchScore += patternSeg === '*' ? 1 : 2;
      } else {
        matches = false;
        break;
      }
    }
    
    // If wildcard method, reduce score
    matchScore += patternMethod === '*' ? 0 : 5;
    
    if (matches && matchScore > maxMatchScore) {
      maxMatchScore = matchScore;
      bestMatch = pattern;
    }
  }
  
  return bestMatch ? endpointLimits.get(bestMatch)! : DEFAULT_LIMITS;
}

/**
 * Check if a request exceeds rate limits
 * @param endpoint API endpoint
 * @throws If rate limit is exceeded
 */
export function rateLimitCheck(endpoint: string): void {
  const now = Date.now();
  
  // Get rate limit options for this endpoint
  const limits = getLimitsForEndpoint(endpoint);
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(endpoint);
  if (!entry) {
    entry = {
      count: 0,
      resetAt: now + limits.windowMs,
      blocked: false,
      lastRequest: 0
    };
    rateLimitStore.set(endpoint, entry);
  }
  
  // Check if currently blocked
  if (entry.blocked) {
    if (now < entry.resetAt) {
      throw createError(
        ErrorType.RATE_LIMIT,
        'rate_limit_blocked',
        `Too many requests. Please try again in ${Math.ceil((entry.resetAt - now) / 1000)} seconds.`,
        { endpoint, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
      );
    }
    
    // Unblock if block period has passed
    entry.blocked = false;
    entry.count = 0;
    entry.resetAt = now + limits.windowMs;
  }
  
  // Check if window has expired and reset if needed
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + limits.windowMs;
  }
  
  // Check minimum interval between requests
  if (limits.minInterval && entry.lastRequest > 0) {
    const timeSinceLast = now - entry.lastRequest;
    if (timeSinceLast < limits.minInterval) {
      throw createError(
        ErrorType.RATE_LIMIT,
        'rate_limit_interval',
        `Request rate too high. Please slow down.`,
        { endpoint, retryAfter: Math.ceil((limits.minInterval - timeSinceLast) / 1000) }
      );
    }
  }
  
  // Increment count and check against limit
  entry.count++;
  entry.lastRequest = now;
  
  if (entry.count > limits.maxRequests) {
    // Set blocked state
    entry.blocked = true;
    entry.resetAt = now + (limits.blockDuration || DEFAULT_LIMITS.blockDuration!);
    
    throw createError(
      ErrorType.RATE_LIMIT,
      'rate_limit_exceeded',
      `Rate limit exceeded for ${endpoint}. Please try again later.`,
      { endpoint, retryAfter: Math.ceil((limits.blockDuration || DEFAULT_LIMITS.blockDuration!) / 1000) }
    );
  }
}

/**
 * Reset rate limiting for testing or emergency situations
 * @param endpoint Optional specific endpoint to reset, otherwise resets all
 */
export function resetRateLimits(endpoint?: string): void {
  if (endpoint) {
    rateLimitStore.delete(endpoint);
  } else {
    rateLimitStore.clear();
  }
}

export default {
  rateLimitCheck,
  resetRateLimits
};