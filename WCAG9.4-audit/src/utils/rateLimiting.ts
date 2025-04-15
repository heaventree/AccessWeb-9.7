/**
 * Rate Limiting Utility
 * 
 * Provides client-side rate limiting to prevent brute force attacks and API abuse.
 * Implements token bucket algorithm for flexible rate limiting.
 */

import { authStorage } from './secureStorage';
import { ErrorType, createError } from './errorHandler';

export interface RateLimitConfig {
  maxTokens: number;        // Maximum number of tokens in the bucket
  refillRate: number;       // Rate at which tokens are refilled (tokens per second)
  refillInterval: number;   // Interval in ms at which tokens are added back
  storageKey: string;       // Key used to store rate limit info in secure storage
}

export interface RateLimitInfo {
  tokens: number;           // Current number of tokens in the bucket
  lastRefill: number;       // Timestamp of the last token refill
}

/**
 * Rate limiter using token bucket algorithm
 */
export class RateLimiter {
  private config: RateLimitConfig;
  
  constructor(config: RateLimitConfig) {
    this.config = {
      maxTokens: config.maxTokens || 60,
      refillRate: config.refillRate || 1,
      refillInterval: config.refillInterval || 1000,
      storageKey: config.storageKey || 'rate_limit',
    };
    
    // Initialize rate limit info if not exists
    this.initRateLimitInfo();
  }
  
  /**
   * Initialize rate limit info in storage
   */
  private initRateLimitInfo(): void {
    const storedInfo = authStorage.getItem(this.config.storageKey);
    
    if (!storedInfo) {
      const initialInfo: RateLimitInfo = {
        tokens: this.config.maxTokens,
        lastRefill: Date.now(),
      };
      
      authStorage.setItem(this.config.storageKey, JSON.stringify(initialInfo));
    }
  }
  
  /**
   * Get current rate limit info
   */
  private getRateLimitInfo(): RateLimitInfo {
    const storedInfo = authStorage.getItem(this.config.storageKey);
    
    if (!storedInfo) {
      // Should never happen since we initialize in constructor, but handle just in case
      return {
        tokens: this.config.maxTokens,
        lastRefill: Date.now(),
      };
    }
    
    try {
      return JSON.parse(storedInfo);
    } catch (error) {
      // If JSON parsing fails, initialize with defaults
      const initialInfo: RateLimitInfo = {
        tokens: this.config.maxTokens,
        lastRefill: Date.now(),
      };
      
      authStorage.setItem(this.config.storageKey, JSON.stringify(initialInfo));
      return initialInfo;
    }
  }
  
  /**
   * Update rate limit info in storage
   */
  private updateRateLimitInfo(info: RateLimitInfo): void {
    authStorage.setItem(this.config.storageKey, JSON.stringify(info));
  }
  
  /**
   * Calculate token refill based on elapsed time
   */
  private refillTokens(info: RateLimitInfo): RateLimitInfo {
    const now = Date.now();
    const elapsed = now - info.lastRefill;
    
    if (elapsed < this.config.refillInterval) {
      // Not enough time has passed to refill tokens
      return info;
    }
    
    // Calculate how many tokens to add back
    const intervalsElapsed = Math.floor(elapsed / this.config.refillInterval);
    const tokensToAdd = intervalsElapsed * this.config.refillRate;
    
    // Update tokens count, but don't exceed max
    const newTokens = Math.min(info.tokens + tokensToAdd, this.config.maxTokens);
    
    // Update last refill time based on used intervals
    const newLastRefill = info.lastRefill + (intervalsElapsed * this.config.refillInterval);
    
    return {
      tokens: newTokens,
      lastRefill: newLastRefill,
    };
  }
  
  /**
   * Consume a token if available, throw error if rate limited
   * @param cost Number of tokens to consume (default: 1)
   * @throws Error if rate limited
   */
  public consumeToken(cost: number = 1): void {
    let info = this.getRateLimitInfo();
    
    // Refill tokens based on elapsed time
    info = this.refillTokens(info);
    
    // Check if enough tokens are available
    if (info.tokens < cost) {
      // Not enough tokens, rate limited
      const retryAfterMs = this.calculateRetryAfter(info, cost);
      throw createError(
        ErrorType.SECURITY,
        'rate_limit_exceeded',
        'Rate limit exceeded. Please try again later.',
        { 
          retryAfterMs, 
          retryAfterSec: Math.ceil(retryAfterMs / 1000) 
        }
      );
    }
    
    // Consume tokens
    info.tokens -= cost;
    
    // Update storage
    this.updateRateLimitInfo(info);
  }
  
  /**
   * Calculate when rate limit will be reset
   * @returns Time in ms until retry is possible
   */
  public calculateRetryAfter(info: RateLimitInfo, cost: number): number {
    const tokensNeeded = cost - info.tokens;
    const intervalsNeeded = Math.ceil(tokensNeeded / this.config.refillRate);
    return intervalsNeeded * this.config.refillInterval;
  }
  
  /**
   * Get remaining tokens
   * @returns Number of tokens remaining
   */
  public getRemainingTokens(): number {
    let info = this.getRateLimitInfo();
    info = this.refillTokens(info);
    this.updateRateLimitInfo(info);
    return info.tokens;
  }
  
  /**
   * Reset rate limiter to initial state
   */
  public reset(): void {
    const initialInfo: RateLimitInfo = {
      tokens: this.config.maxTokens,
      lastRefill: Date.now(),
    };
    
    this.updateRateLimitInfo(initialInfo);
  }
}

// Common rate limiter configurations
export const rateLimiters = {
  // For regular API requests (60 requests per minute)
  api: new RateLimiter({
    maxTokens: 60,
    refillRate: 1,
    refillInterval: 1000,
    storageKey: 'rate_limit_api'
  }),
  
  // For authentication attempts (5 attempts per minute)
  auth: new RateLimiter({
    maxTokens: 5,
    refillRate: 1,
    refillInterval: 12000, // 1 token per 12 seconds
    storageKey: 'rate_limit_auth'
  }),
  
  // For sensitive operations (10 operations per minute)
  sensitive: new RateLimiter({
    maxTokens: 10,
    refillRate: 1,
    refillInterval: 6000, // 1 token per 6 seconds
    storageKey: 'rate_limit_sensitive'
  })
};

export default rateLimiters;