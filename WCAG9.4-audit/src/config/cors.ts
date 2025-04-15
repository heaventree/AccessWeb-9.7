/**
 * CORS Configuration
 * 
 * This file provides CORS (Cross-Origin Resource Sharing) configuration settings
 * for the application's API endpoints. These settings are used to restrict which
 * external domains can access our API resources.
 */

import { IS_DEVELOPMENT_MODE, getEnvironmentVariable } from '../utils/environment';

/**
 * CORS Configuration settings
 */
export const corsConfig = {
  // Allowed origins (domains) that can access our API
  // In production, this is strictly limited to trusted domains
  // In development, we allow local development servers
  allowedOrigins: IS_DEVELOPMENT_MODE
    ? [
        'http://localhost:3000',
        'http://localhost:5000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:5000',
        'https://localhost:3000',
        'https://localhost:5000',
      ]
    : [
        // Production domains - should be configured via environment variables
        getEnvironmentVariable('APP_DOMAIN', 'https://app.wcag-accessibility.com'),
        getEnvironmentVariable('API_DOMAIN', 'https://api.wcag-accessibility.com'),
      ],
  
  // Allow credentials (cookies, authorization headers, etc.)
  allowCredentials: true,
  
  // Maximum age (in seconds) of the preflight request
  maxAge: 86400, // 24 hours
  
  // Allowed HTTP methods
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  
  // Allowed HTTP headers
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token',
    'X-API-Key',
  ],
  
  // Headers exposed to the client
  exposedHeaders: [
    'Content-Length',
    'X-Ratelimit-Limit',
    'X-Ratelimit-Remaining',
    'X-Ratelimit-Reset',
  ],
};

/**
 * Generate CORS headers for server responses
 * @param origin The request origin
 * @returns Object with CORS headers
 */
export const generateCorsHeaders = (origin: string | null): Record<string, string> => {
  // Determine if the origin is allowed
  const allowedOrigin = validateCors(origin) 
    ? origin 
    : corsConfig.allowedOrigins[0];
  
  // Generate the headers
  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Methods': corsConfig.allowedMethods.join(', '),
    'Access-Control-Allow-Headers': corsConfig.allowedHeaders.join(', '),
    'Access-Control-Expose-Headers': corsConfig.exposedHeaders.join(', '),
    'Access-Control-Allow-Credentials': String(corsConfig.allowCredentials),
    'Access-Control-Max-Age': String(corsConfig.maxAge),
    // Add security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };
};

/**
 * Check if a request passes CORS validation
 * @param origin The request origin
 * @returns Whether the request passes CORS validation
 */
export const validateCors = (origin: string | null): boolean => {
  // If no origin is provided, it's a same-origin request, which is allowed
  if (!origin) return true;
  
  // Check if the origin is in the allowed origins list
  if (corsConfig.allowedOrigins.includes(origin)) {
    return true;
  }
  
  // In development mode, be more permissive for testing
  if (IS_DEVELOPMENT_MODE) {
    // Allow localhost with any port
    if (origin.match(/^https?:\/\/localhost(:\d+)?$/) ||
        origin.match(/^https?:\/\/127\.0\.0\.1(:\d+)?$/)) {
      return true;
    }
  }
  
  // Check if the origin matches a domain pattern
  const domainPatterns = [
    // Add any domain patterns here, e.g. *.example.com
    /^https:\/\/.*\.wcag-accessibility\.com$/,
    /^https:\/\/wcag-accessibility\.com$/
  ];
  
  return domainPatterns.some(pattern => pattern.test(origin));
};