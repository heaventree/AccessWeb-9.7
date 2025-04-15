/**
 * CORS Configuration
 * 
 * This file provides CORS (Cross-Origin Resource Sharing) configuration settings
 * for the application's API endpoints. These settings are used to restrict which
 * external domains can access our API resources.
 */

import { IS_DEVELOPMENT_MODE } from '../utils/environment';

/**
 * CORS Configuration settings
 */
export const corsConfig = {
  // List of allowed origins (domains) that can access the API
  allowedOrigins: IS_DEVELOPMENT_MODE
    ? [
        'http://localhost:5000',
        'http://localhost:3000', 
        'http://127.0.0.1:5000',
        'http://127.0.0.1:3000',
      ]
    : [
        // Production domains
        'https://accessibilitychecker.app',
        'https://www.accessibilitychecker.app',
        'https://api.accessibilitychecker.app',
      ],
  
  // HTTP methods that are allowed
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  
  // HTTP headers that can be used when making the actual request
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
    'X-Requested-With',
    'Accept',
    'Origin',
  ],
  
  // HTTP headers that can be exposed to the client
  exposedHeaders: ['Content-Range', 'X-Total-Count'],
  
  // Whether cookies and authentication can be included in cross-origin requests
  allowCredentials: true,
  
  // How long the results of a preflight request can be cached (in seconds)
  maxAge: 86400, // 24 hours
  
  // Function to validate if an origin is allowed
  isOriginAllowed: (origin: string): boolean => {
    if (!origin) return false;
    
    return corsConfig.allowedOrigins.some(allowedOrigin => {
      // Exact match
      if (allowedOrigin === origin) return true;
      
      // Wildcard subdomain match (for production multi-tenant scenarios)
      if (allowedOrigin.startsWith('*.')) {
        const domain = allowedOrigin.slice(2); // Remove '*.'
        return origin.endsWith(domain) && origin.slice(0, -domain.length).lastIndexOf('.') !== -1;
      }
      
      return false;
    });
  }
};

/**
 * Generate CORS headers for server responses
 * @param origin The request origin
 * @returns Object with CORS headers
 */
export const generateCorsHeaders = (origin: string | null): Record<string, string> => {
  const headers: Record<string, string> = {};
  
  // Only set Access-Control-Allow-Origin if the origin is allowed
  if (origin && corsConfig.isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  } else if (IS_DEVELOPMENT_MODE) {
    // In development, allow from localhost
    headers['Access-Control-Allow-Origin'] = 'http://localhost:5000';
  } else {
    // In production, default to the primary domain
    headers['Access-Control-Allow-Origin'] = 'https://accessibilitychecker.app';
  }
  
  // Add other CORS headers
  headers['Access-Control-Allow-Methods'] = corsConfig.allowedMethods.join(', ');
  headers['Access-Control-Allow-Headers'] = corsConfig.allowedHeaders.join(', ');
  headers['Access-Control-Expose-Headers'] = corsConfig.exposedHeaders.join(', ');
  headers['Access-Control-Allow-Credentials'] = corsConfig.allowCredentials.toString();
  headers['Access-Control-Max-Age'] = corsConfig.maxAge.toString();
  
  return headers;
};

/**
 * Check if a request passes CORS validation
 * @param origin The request origin
 * @returns Whether the request passes CORS validation
 */
export const validateCors = (origin: string | null): boolean => {
  // If no origin, only allow in development mode
  if (!origin) return IS_DEVELOPMENT_MODE;
  
  // Check if origin is allowed
  return corsConfig.isOriginAllowed(origin);
};