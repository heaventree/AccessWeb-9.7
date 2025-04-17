# API Security

**Date:** April 15, 2024  
**Status:** Initial Draft  
**Owner:** Security Architecture Team  

## Overview

This document outlines the security controls implemented for the API layer of the WCAG Accessibility Audit Tool. It covers authentication, authorization, input validation, output encoding, rate limiting, and other security measures designed to protect the API endpoints from common vulnerabilities and attacks.

## API Security Principles

The API security implementation follows these core principles:

1. **Defense in Depth** - Multiple layers of security controls
2. **Least Privilege** - API access limited to minimum required functionality
3. **Complete Mediation** - All API requests fully authenticated and authorized
4. **Secure by Default** - Secure defaults for all API configurations
5. **Fail Secure** - APIs fail in a secure manner
6. **Minimize Attack Surface** - Only necessary endpoints exposed

## API Authentication

### 1. Authentication Methods

The API supports the following authentication methods:

#### 1.1 JWT-based Authentication

JSON Web Tokens (JWT) are the primary authentication mechanism for the API:

- **Token Format** - Standard JWT with header, payload, and signature
- **Signature Algorithm** - HS256 or RS256 (configurable)
- **Token Lifetime** - Short-lived access tokens (1 hour) with refresh tokens (7 days)
- **Token Storage** - HttpOnly, secure cookies or Authorization header

```typescript
// JWT authentication middleware
export const jwtAuthMiddleware = (req, res, next) => {
  try {
    // Extract token from request
    const token = extractTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user information to request
    req.user = decoded;
    
    // Proceed to next middleware
    next();
  } catch (error) {
    // Log authentication failure
    logger.warn('JWT authentication failed', {
      error: error.message,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
    
    // Return error response
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// Helper function to extract token
function extractTokenFromRequest(req) {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookie
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
}
```

#### 1.2 API Key Authentication

API keys are supported for service-to-service communication:

- **Key Format** - Random, high-entropy strings
- **Key Rotation** - Regular rotation of API keys
- **Key Management** - Secure management of API keys
- **Key Scope** - Keys scoped to specific API resources

```typescript
// API key authentication middleware
export const apiKeyAuthMiddleware = (req, res, next) => {
  try {
    // Extract API key from request
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ message: 'API key required' });
    }
    
    // Verify API key
    const apiKeyDetails = verifyApiKey(apiKey);
    
    if (!apiKeyDetails) {
      // Log invalid API key attempt
      logger.warn('Invalid API key', {
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      return res.status(401).json({ message: 'Invalid API key' });
    }
    
    // Check if API key is enabled
    if (!apiKeyDetails.enabled) {
      logger.warn('Disabled API key used', {
        keyId: apiKeyDetails.id,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      return res.status(401).json({ message: 'API key is disabled' });
    }
    
    // Check if API key has expired
    if (apiKeyDetails.expiresAt && new Date() > new Date(apiKeyDetails.expiresAt)) {
      logger.warn('Expired API key used', {
        keyId: apiKeyDetails.id,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      return res.status(401).json({ message: 'API key has expired' });
    }
    
    // Add API key information to request
    req.apiKey = apiKeyDetails;
    
    // Add the API key owner information to the request
    req.user = {
      sub: apiKeyDetails.userId,
      name: apiKeyDetails.name,
      type: 'api-key',
      scope: apiKeyDetails.scope,
    };
    
    // Log API key usage
    logger.debug('API key authentication successful', {
      keyId: apiKeyDetails.id,
      path: req.path,
      method: req.method,
    });
    
    // Proceed to next middleware
    next();
  } catch (error) {
    // Log authentication failure
    logger.error('API key authentication error', {
      error: error.message,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
    
    // Return error response
    return res.status(500).json({ message: 'Authentication error' });
  }
};

// Helper function to verify API key
function verifyApiKey(apiKey) {
  // In a real implementation, this would verify against a database
  // For now, return a mock result
  const apiKeys = {
    'test-api-key': {
      id: '123',
      name: 'Test API Key',
      userId: 'system',
      enabled: true,
      scope: ['read:audits', 'read:reports'],
      expiresAt: null,
    },
  };
  
  return apiKeys[apiKey];
}
```

### 2. Token Management

#### 2.1 Token Issuance

Tokens are issued through a secure process:

```typescript
// Token service
export class TokenService {
  async issueAccessToken(user: User): Promise<string> {
    // Create token payload
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      scope: this.getScopeFromRoles(user.roles),
      type: 'access',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
      jti: uuidv4(),
    };
    
    // Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    
    // Log token issuance
    this.logger.debug('Access token issued', {
      userId: user.id,
      expiresAt: new Date(payload.exp * 1000).toISOString(),
    });
    
    return token;
  }
  
  async issueRefreshToken(user: User): Promise<string> {
    // Generate refresh token ID
    const tokenId = uuidv4();
    
    // Create token record
    await this.refreshTokenRepository.create({
      id: tokenId,
      userId: user.id,
      issuedAt: new Date(),
      expiresAt: new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)), // 7 days
      revokedAt: null,
    });
    
    // Create token payload
    const payload = {
      sub: user.id,
      type: 'refresh',
      jti: tokenId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    };
    
    // Sign token
    const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET);
    
    // Log token issuance
    this.logger.debug('Refresh token issued', {
      userId: user.id,
      tokenId,
      expiresAt: new Date(payload.exp * 1000).toISOString(),
    });
    
    return token;
  }
  
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      
      // Check token type
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      
      // Get token from database
      const tokenRecord = await this.refreshTokenRepository.findById(decoded.jti);
      
      if (!tokenRecord) {
        throw new Error('Token not found');
      }
      
      // Check if token is revoked
      if (tokenRecord.revokedAt) {
        throw new Error('Token has been revoked');
      }
      
      // Check if token is expired
      if (new Date() > new Date(tokenRecord.expiresAt)) {
        throw new Error('Token has expired');
      }
      
      // Get user
      const user = await this.userRepository.findById(tokenRecord.userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Revoke current refresh token (one-time use)
      await this.refreshTokenRepository.update(decoded.jti, {
        revokedAt: new Date(),
      });
      
      // Issue new access token
      return this.issueAccessToken(user);
    } catch (error) {
      // Log token refresh failure
      this.logger.warn('Access token refresh failed', {
        error: error.message,
      });
      
      throw error;
    }
  }
  
  private getScopeFromRoles(roles: string[]): string[] {
    // Map roles to scopes
    const scopeMap = {
      admin: ['*'],
      manager: ['read:*', 'write:*', 'delete:audits', 'delete:reports'],
      auditor: ['read:*', 'write:audits', 'write:reports'],
      viewer: ['read:audits', 'read:reports'],
    };
    
    // Combine scopes from all roles
    return roles.flatMap(role => scopeMap[role] || []);
  }
}
```

#### 2.2 Token Validation

Tokens are validated on each API request:

```typescript
// Token validation middleware
export const validateTokenMiddleware = (req, res, next) => {
  try {
    // Check if user exists on request (set by authentication middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Check token expiration
    if (req.user.exp && req.user.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ message: 'Token has expired' });
    }
    
    // Check token type
    if (req.user.type === 'refresh') {
      return res.status(401).json({ message: 'Invalid token type' });
    }
    
    // Additional checks can be added here
    
    // Proceed to next middleware
    next();
  } catch (error) {
    // Log validation failure
    logger.error('Token validation error', {
      error: error.message,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
    
    // Return error response
    return res.status(500).json({ message: 'Validation error' });
  }
};
```

#### 2.3 Token Revocation

Tokens can be revoked for security reasons:

```typescript
// Token service (continued)
export class TokenService {
  // ... other methods ...
  
  async revokeToken(token: string): Promise<void> {
    try {
      // Decode token without verification
      const decoded = jwt.decode(token);
      
      if (!decoded || typeof decoded === 'string') {
        throw new Error('Invalid token format');
      }
      
      // Check token type
      if (decoded.type === 'refresh') {
        // Revoke refresh token in database
        await this.refreshTokenRepository.update(decoded.jti, {
          revokedAt: new Date(),
        });
      } else {
        // Add access token to blacklist
        await this.tokenBlacklistRepository.create({
          jti: decoded.jti,
          expiresAt: new Date(decoded.exp * 1000),
          revokedAt: new Date(),
        });
      }
      
      // Log token revocation
      this.logger.info('Token revoked', {
        tokenType: decoded.type,
        tokenId: decoded.jti,
        userId: decoded.sub,
      });
    } catch (error) {
      // Log revocation failure
      this.logger.error('Token revocation failed', {
        error: error.message,
      });
      
      throw error;
    }
  }
  
  async revokeAllUserTokens(userId: string): Promise<void> {
    try {
      // Revoke all refresh tokens
      await this.refreshTokenRepository.revokeAllForUser(userId);
      
      // Log revocation
      this.logger.info('All user tokens revoked', {
        userId,
      });
    } catch (error) {
      // Log revocation failure
      this.logger.error('User token revocation failed', {
        userId,
        error: error.message,
      });
      
      throw error;
    }
  }
}
```

## API Authorization

### 1. Scope-Based Authorization

The API implements scope-based authorization:

```typescript
// Scope-based authorization middleware
export const requireScope = (requiredScopes: string[]) => {
  return (req, res, next) => {
    try {
      // Check if user exists on request
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Get user scopes
      const userScopes = req.user.scope || [];
      
      // Check for wildcard scope
      if (userScopes.includes('*')) {
        return next();
      }
      
      // Check if user has all required scopes
      const hasAllScopes = requiredScopes.every(scope => {
        // Check for exact scope match
        if (userScopes.includes(scope)) {
          return true;
        }
        
        // Check for wildcard scope match
        const scopeParts = scope.split(':');
        if (scopeParts.length === 2) {
          const wildcardScope = `${scopeParts[0]}:*`;
          return userScopes.includes(wildcardScope);
        }
        
        return false;
      });
      
      if (!hasAllScopes) {
        // Log authorization failure
        logger.warn('Scope authorization failed', {
          userId: req.user.sub,
          requiredScopes,
          userScopes,
          path: req.path,
          method: req.method,
        });
        
        return res.status(403).json({ message: 'Insufficient scope' });
      }
      
      // Proceed to next middleware
      next();
    } catch (error) {
      // Log authorization error
      logger.error('Scope authorization error', {
        error: error.message,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      // Return error response
      return res.status(500).json({ message: 'Authorization error' });
    }
  };
};
```

### 2. Role-Based Authorization

In addition to scopes, the API implements role-based authorization:

```typescript
// Role-based authorization middleware
export const requireRole = (requiredRoles: string[]) => {
  return (req, res, next) => {
    try {
      // Check if user exists on request
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Get user roles
      const userRoles = req.user.roles || [];
      
      // Check if user has at least one of the required roles
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        // Log authorization failure
        logger.warn('Role authorization failed', {
          userId: req.user.sub,
          requiredRoles,
          userRoles,
          path: req.path,
          method: req.method,
        });
        
        return res.status(403).json({ message: 'Insufficient role' });
      }
      
      // Proceed to next middleware
      next();
    } catch (error) {
      // Log authorization error
      logger.error('Role authorization error', {
        error: error.message,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      // Return error response
      return res.status(500).json({ message: 'Authorization error' });
    }
  };
};
```

### 3. Resource-Based Authorization

For finer-grained control, the API implements resource-based authorization:

```typescript
// Resource-based authorization middleware
export const requireResourceAccess = (resourceType: string, actionType: string) => {
  return async (req, res, next) => {
    try {
      // Check if user exists on request
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // Get resource ID from request
      const resourceId = req.params.id;
      
      if (!resourceId) {
        return res.status(400).json({ message: 'Resource ID required' });
      }
      
      // Check resource access
      const accessResult = await checkResourceAccess(
        req.user.sub,
        resourceType,
        resourceId,
        actionType
      );
      
      if (!accessResult.granted) {
        // Log authorization failure
        logger.warn('Resource authorization failed', {
          userId: req.user.sub,
          resourceType,
          resourceId,
          actionType,
          reason: accessResult.reason,
          path: req.path,
          method: req.method,
        });
        
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Add resource to request
      req.resource = accessResult.resource;
      
      // Proceed to next middleware
      next();
    } catch (error) {
      // Log authorization error
      logger.error('Resource authorization error', {
        error: error.message,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      // Return error response
      return res.status(500).json({ message: 'Authorization error' });
    }
  };
};

// Helper function to check resource access
async function checkResourceAccess(userId, resourceType, resourceId, actionType) {
  // Get resource
  const resource = await getResource(resourceType, resourceId);
  
  if (!resource) {
    return { granted: false, reason: 'RESOURCE_NOT_FOUND' };
  }
  
  // Check if user is resource owner
  if (resource.userId === userId) {
    return { granted: true, resource };
  }
  
  // Check if resource is public
  if (resource.public && actionType === 'read') {
    return { granted: true, resource };
  }
  
  // Check if user has explicit permission
  const permission = await getResourcePermission(resourceType, resourceId, userId);
  
  if (permission && permission[actionType]) {
    return { granted: true, resource };
  }
  
  // Check if user has admin role
  const userRoles = await getUserRoles(userId);
  
  if (userRoles.includes('admin')) {
    return { granted: true, resource };
  }
  
  // Access denied
  return { granted: false, reason: 'INSUFFICIENT_PERMISSION' };
}

// Helper functions to get resource, permission, and roles
async function getResource(resourceType, resourceId) {
  // In a real implementation, this would retrieve from a database
  // This is a simplified example
  return { id: resourceId, userId: 'owner123', public: false };
}

async function getResourcePermission(resourceType, resourceId, userId) {
  // In a real implementation, this would retrieve from a database
  // This is a simplified example
  return null;
}

async function getUserRoles(userId) {
  // In a real implementation, this would retrieve from a database
  // This is a simplified example
  return ['user'];
}
```

## Input Validation

### 1. Request Validation

All API requests are validated:

```typescript
// Request validation middleware
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Create validation context
      const context = {
        body: req.body,
        query: req.query,
        params: req.params,
        headers: req.headers,
      };
      
      // Validate request against schema
      const validationResult = schema.validate(context);
      
      if (validationResult.error) {
        // Log validation failure
        logger.debug('Request validation failed', {
          path: req.path,
          method: req.method,
          error: validationResult.error.message,
        });
        
        // Return validation error
        return res.status(400).json({
          message: 'Validation error',
          errors: validationResult.error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message,
          })),
        });
      }
      
      // Update request with validated data
      if (validationResult.value.body) {
        req.body = validationResult.value.body;
      }
      
      if (validationResult.value.query) {
        req.query = validationResult.value.query;
      }
      
      if (validationResult.value.params) {
        req.params = validationResult.value.params;
      }
      
      // Proceed to next middleware
      next();
    } catch (error) {
      // Log validation error
      logger.error('Request validation error', {
        error: error.message,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      // Return error response
      return res.status(500).json({ message: 'Validation error' });
    }
  };
};

// Example schema for creating an audit
const createAuditSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required().max(100),
    description: Joi.string().max(1000),
    website: Joi.string().uri().required(),
    standard: Joi.string().valid('WCAG2A', 'WCAG2AA', 'WCAG2AAA').required(),
    tags: Joi.array().items(Joi.string().max(50)).max(10),
  }).required(),
});

// Example usage in route definition
router.post(
  '/audits',
  jwtAuthMiddleware,
  validateRequest(createAuditSchema),
  requireScope(['write:audits']),
  auditController.createAudit
);
```

### 2. Data Sanitization

Input data is sanitized to prevent injection attacks:

```typescript
// HTML sanitization middleware
export const sanitizeHtml = (fields) => {
  return (req, res, next) => {
    try {
      // Process each specified field in body
      if (req.body) {
        for (const field of fields) {
          if (req.body[field]) {
            // Sanitize HTML content
            req.body[field] = DOMPurify.sanitize(req.body[field]);
          }
        }
      }
      
      // Proceed to next middleware
      next();
    } catch (error) {
      // Log sanitization error
      logger.error('HTML sanitization error', {
        error: error.message,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      // Return error response
      return res.status(500).json({ message: 'Sanitization error' });
    }
  };
};

// SQL injection prevention
export const sanitizeSql = (req, res, next) => {
  try {
    // Function to sanitize string
    const sanitize = (value) => {
      if (typeof value === 'string') {
        // Replace SQL injection patterns
        return value
          .replace(/'/g, "''")
          .replace(/;/g, "")
          .replace(/--/g, "")
          .replace(/\/\*/g, "")
          .replace(/\*\//g, "");
      }
      return value;
    };
    
    // Function to recursively sanitize object
    const sanitizeObject = (obj) => {
      if (!obj || typeof obj !== 'object') return obj;
      
      const result = Array.isArray(obj) ? [] : {};
      
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const value = obj[key];
          
          if (typeof value === 'object' && value !== null) {
            result[key] = sanitizeObject(value);
          } else {
            result[key] = sanitize(value);
          }
        }
      }
      
      return result;
    };
    
    // Sanitize request body, query, and params
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }
    
    if (req.query) {
      req.query = sanitizeObject(req.query);
    }
    
    if (req.params) {
      req.params = sanitizeObject(req.params);
    }
    
    // Proceed to next middleware
    next();
  } catch (error) {
    // Log sanitization error
    logger.error('SQL sanitization error', {
      error: error.message,
      path: req.path,
      method: req.method,
      ip: req.ip
    });
    
    // Return error response
    return res.status(500).json({ message: 'Sanitization error' });
  }
};
```

### 3. Content Type Validation

API endpoints validate content types:

```typescript
// Content type validation middleware
export const validateContentType = (allowedTypes) => {
  return (req, res, next) => {
    try {
      // Skip for methods without body
      if (['GET', 'HEAD', 'OPTIONS', 'DELETE'].includes(req.method)) {
        return next();
      }
      
      // Get content type
      const contentType = req.headers['content-type'];
      
      if (!contentType) {
        return res.status(415).json({ message: 'Content-Type header required' });
      }
      
      // Check if content type is allowed
      const contentTypeWithoutParams = contentType.split(';')[0].trim();
      
      if (!allowedTypes.includes(contentTypeWithoutParams)) {
        // Log validation failure
        logger.warn('Content-Type validation failed', {
          path: req.path,
          method: req.method,
          contentType,
          allowedTypes,
        });
        
        return res.status(415).json({
          message: 'Unsupported Content-Type',
          allowedTypes,
        });
      }
      
      // Proceed to next middleware
      next();
    } catch (error) {
      // Log validation error
      logger.error('Content-Type validation error', {
        error: error.message,
        path: req.path,
        method: req.method,
        ip: req.ip
      });
      
      // Return error response
      return res.status(500).json({ message: 'Validation error' });
    }
  };
};

// Example usage in route definition
router.post(
  '/audits',
  validateContentType(['application/json']),
  jwtAuthMiddleware,
  validateRequest(createAuditSchema),
  requireScope(['write:audits']),
  auditController.createAudit
);
```

## Rate Limiting and Throttling

### 1. API Rate Limiting

Rate limiting prevents abuse of the API:

```typescript
// Rate limiting middleware
export const rateLimiter = (options) => {
  // Default options
  const defaultOptions = {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      // Log rate limit exceeded
      logger.warn('Rate limit exceeded', {
        path: req.path,
        method: req.method,
        ip: req.ip,
        userId: req.user?.sub,
      });
      
      return res.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    },
    keyGenerator: (req) => {
      // Use user ID if available, otherwise IP
      return req.user?.sub || req.ip;
    },
    skip: (req) => {
      // Skip rate limiting for certain conditions (e.g., admin users)
      return req.user?.roles?.includes('admin') || false;
    },
  };
  
  // Merge options
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Create rate limiter
  const limiter = rateLimit(mergedOptions);
  
  return limiter;
};

// Example usage in route definition
router.get(
  '/audits',
  jwtAuthMiddleware,
  rateLimiter({ max: 200 }), // 200 requests per minute
  requireScope(['read:audits']),
  auditController.getAudits
);

// Different rate limits for different endpoints
router.post(
  '/audits',
  jwtAuthMiddleware,
  rateLimiter({ max: 20 }), // 20 creates per minute
  validateRequest(createAuditSchema),
  requireScope(['write:audits']),
  auditController.createAudit
);
```

### 2. Advanced Rate Limiting

For more complex scenarios, advanced rate limiting is implemented:

```typescript
// Advanced rate limiting service
export class RateLimitingService {
  async checkRateLimit(userId: string, action: string): Promise<{ allowed: boolean, limit: number, remaining: number, reset: number }> {
    try {
      // Get rate limit configuration for action
      const config = this.getRateLimitConfig(action);
      
      // Get current window
      const currentWindow = Math.floor(Date.now() / config.windowMs);
      
      // Create rate limit key
      const key = `ratelimit:${userId}:${action}:${currentWindow}`;
      
      // Get current count
      const count = await this.redisClient.get(key);
      
      // Convert count to number or default to 0
      const currentCount = count ? parseInt(count, 10) : 0;
      
      // Check if limit is exceeded
      if (currentCount >= config.limit) {
        // Calculate reset time
        const reset = (currentWindow + 1) * config.windowMs;
        
        return {
          allowed: false,
          limit: config.limit,
          remaining: 0,
          reset,
        };
      }
      
      // Increment count
      await this.redisClient.incr(key);
      
      // Set expiration (if not already set)
      await this.redisClient.expire(key, Math.ceil(config.windowMs / 1000));
      
      // Return result
      return {
        allowed: true,
        limit: config.limit,
        remaining: config.limit - (currentCount + 1),
        reset: (currentWindow + 1) * config.windowMs,
      };
    } catch (error) {
      // Log error
      this.logger.error('Rate limit check error', {
        userId,
        action,
        error: error.message,
      });
      
      // Default to allowed in case of error
      return {
        allowed: true,
        limit: 0,
        remaining: 0,
        reset: 0,
      };
    }
  }
  
  private getRateLimitConfig(action: string): { limit: number, windowMs: number } {
    // Define rate limit configurations for different actions
    const configs = {
      'audit:create': { limit: 20, windowMs: 60 * 1000 }, // 20 per minute
      'audit:run': { limit: 10, windowMs: 60 * 1000 }, // 10 per minute
      'report:generate': { limit: 5, windowMs: 60 * 1000 }, // 5 per minute
      'user:create': { limit: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour
      'default': { limit: 100, windowMs: 60 * 1000 }, // 100 per minute
    };
    
    return configs[action] || configs.default;
  }
}

// Usage example in a controller
export class AuditController {
  async createAudit(req, res) {
    try {
      // Check rate limit
      const rateLimitResult = await this.rateLimitingService.checkRateLimit(
        req.user.sub,
        'audit:create'
      );
      
      // Set rate limit headers
      res.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      res.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      res.set('X-RateLimit-Reset', rateLimitResult.reset.toString());
      
      if (!rateLimitResult.allowed) {
        return res.status(429).json({
          message: 'Rate limit exceeded. Please try again later.',
        });
      }
      
      // Process audit creation
      const audit = await this.auditService.createAudit(req.body, req.user.sub);
      
      return res.status(201).json(audit);
    } catch (error) {
      // Handle error
      return res.status(500).json({ message: error.message });
    }
  }
}
```

## Error Handling

### 1. Error Handling Middleware

Centralized error handling ensures security:

```typescript
// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  // Get error details
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errorId = uuidv4();
  
  // Determine error detail level based on environment
  const includeDetails = process.env.NODE_ENV === 'development';
  
  // Log error
  if (status >= 500) {
    logger.error('Server error', {
      errorId,
      status,
      message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
      userId: req.user?.sub,
    });
  } else {
    logger.warn('Client error', {
      errorId,
      status,
      message,
      path: req.path,
      method: req.method,
      ip: req.ip,
      userId: req.user?.sub,
    });
  }
  
  // Create error response
  const errorResponse = {
    status: 'error',
    message,
    errorId,
  };
  
  // Add details for development environment
  if (includeDetails) {
    errorResponse.details = {
      stack: err.stack,
      ...err.details,
    };
  }
  
  // Send error response
  res.status(status).json(errorResponse);
};

// Custom error class
export class ApiError extends Error {
  constructor(status, message, details = {}) {
    super(message);
    this.status = status;
    this.details = details;
  }
  
  static badRequest(message, details = {}) {
    return new ApiError(400, message, details);
  }
  
  static unauthorized(message = 'Authentication required', details = {}) {
    return new ApiError(401, message, details);
  }
  
  static forbidden(message = 'Access denied', details = {}) {
    return new ApiError(403, message, details);
  }
  
  static notFound(message = 'Resource not found', details = {}) {
    return new ApiError(404, message, details);
  }
  
  static methodNotAllowed(message = 'Method not allowed', details = {}) {
    return new ApiError(405, message, details);
  }
  
  static conflict(message, details = {}) {
    return new ApiError(409, message, details);
  }
  
  static tooManyRequests(message = 'Too many requests', details = {}) {
    return new ApiError(429, message, details);
  }
  
  static internal(message = 'Internal server error', details = {}) {
    return new ApiError(500, message, details);
  }
}

// Example usage in a controller
export class AuditController {
  async getAuditById(req, res, next) {
    try {
      const auditId = req.params.id;
      
      // Validate ID format
      if (!isValidUUID(auditId)) {
        throw ApiError.badRequest('Invalid audit ID format');
      }
      
      // Get audit
      const audit = await this.auditService.getAuditById(auditId);
      
      if (!audit) {
        throw ApiError.notFound('Audit not found');
      }
      
      // Check access permission
      const hasAccess = await this.auditService.checkAuditAccess(audit, req.user.sub);
      
      if (!hasAccess) {
        throw ApiError.forbidden('You do not have permission to access this audit');
      }
      
      return res.json(audit);
    } catch (error) {
      next(error);
    }
  }
}
```

### 2. Security Headers

Security headers protect the API:

```typescript
// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Set security headers
  
  // Strict-Transport-Security
  // Enforce HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // X-Content-Type-Options
  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection
  // Prevent XSS attacks (legacy browsers)
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content-Security-Policy
  // Comprehensive security policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self'; style-src 'self';");
  
  // Cache-Control
  // Prevent caching of sensitive data
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  // Feature-Policy
  // Restrict browser features
  res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
  
  // Referrer-Policy
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
};
```

## CORS Configuration

Cross-Origin Resource Sharing is properly configured:

```typescript
// CORS configuration
export const corsOptions = {
  // Allowed origins
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['https://app.example.com'];
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // Log blocked origin
      logger.warn('CORS origin blocked', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  
  // Allowed methods
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  
  // Allowed headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Requested-With'],
  
  // Exposed headers
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  
  // Allow credentials
  credentials: true,
  
  // Pre-flight cache duration
  maxAge: 86400, // 24 hours
  
  // Handle pre-flight errors
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
```

## API Security Testing

### 1. Automated Security Testing

The API undergoes regular security testing:

```typescript
// In security tests
describe('API Security', () => {
  describe('Authentication', () => {
    test('should return 401 when no token is provided', async () => {
      const response = await request(app).get('/api/audits');
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication required');
    });
    
    test('should return 401 when invalid token is provided', async () => {
      const response = await request(app)
        .get('/api/audits')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Authentication failed');
    });
    
    test('should return 401 when expired token is provided', async () => {
      const expiredToken = generateExpiredToken();
      
      const response = await request(app)
        .get('/api/audits')
        .set('Authorization', `Bearer ${expiredToken}`);
      
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Token has expired');
    });
  });
  
  describe('Authorization', () => {
    test('should return 403 when user lacks required scope', async () => {
      const token = generateTokenWithScopes(['read:reports']);
      
      const response = await request(app)
        .get('/api/audits')
        .set('Authorization', `Bearer ${token}`);
      
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Insufficient scope');
    });
    
    test('should return 403 when user lacks required role', async () => {
      const token = generateTokenWithRoles(['viewer']);
      
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test User', email: 'test@example.com' });
      
      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Insufficient role');
    });
  });
  
  describe('Input Validation', () => {
    test('should return 400 when request body is invalid', async () => {
      const token = generateAdminToken();
      
      const response = await request(app)
        .post('/api/audits')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test Audit' }); // Missing required fields
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error');
      expect(response.body.errors).toBeDefined();
    });
    
    test('should sanitize HTML in request body', async () => {
      const token = generateAdminToken();
      
      const response = await request(app)
        .post('/api/audits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Audit',
          description: '<script>alert("XSS")</script>Test description',
          website: 'https://example.com',
          standard: 'WCAG2AA',
        });
      
      expect(response.status).toBe(201);
      expect(response.body.description).not.toContain('<script>');
    });
  });
  
  describe('Rate Limiting', () => {
    test('should return 429 when rate limit is exceeded', async () => {
      const token = generateAdminToken();
      
      // Make multiple requests to exceed rate limit
      for (let i = 0; i < 25; i++) {
        await request(app)
          .post('/api/audits')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: `Test Audit ${i}`,
            description: 'Test description',
            website: 'https://example.com',
            standard: 'WCAG2AA',
          });
      }
      
      // This request should be rate limited
      const response = await request(app)
        .post('/api/audits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Audit',
          description: 'Test description',
          website: 'https://example.com',
          standard: 'WCAG2AA',
        });
      
      expect(response.status).toBe(429);
      expect(response.body.message).toContain('Too many requests');
    });
  });
});
```

### 2. API Security Monitoring

The API includes security monitoring:

```typescript
// API security monitoring service
export class ApiSecurityMonitoringService {
  async monitorApiSecurity(): Promise<void> {
    // Monitor authentication failures
    await this.monitorAuthenticationFailures();
    
    // Monitor authorization failures
    await this.monitorAuthorizationFailures();
    
    // Monitor rate limit breaches
    await this.monitorRateLimitBreaches();
    
    // Monitor suspicious activity
    await this.monitorSuspiciousActivity();
  }
  
  private async monitorAuthenticationFailures(): Promise<void> {
    // Get recent authentication failures
    const failures = await this.securityEventRepository.getRecentAuthFailures();
    
    // Group by IP and user
    const ipGroups = this.groupByIp(failures);
    const userGroups = this.groupByUser(failures);
    
    // Check for brute force attempts
    for (const [ip, events] of Object.entries(ipGroups)) {
      if (events.length >= 10) {
        // Too many failures from same IP
        await this.createSecurityAlert({
          type: 'BRUTE_FORCE_BY_IP',
          severity: 'HIGH',
          source: 'API_SECURITY_MONITOR',
          details: {
            ip,
            failureCount: events.length,
            timeWindow: '10 minutes',
          },
        });
      }
    }
    
    for (const [username, events] of Object.entries(userGroups)) {
      if (events.length >= 5) {
        // Too many failures for same user
        await this.createSecurityAlert({
          type: 'BRUTE_FORCE_BY_USER',
          severity: 'HIGH',
          source: 'API_SECURITY_MONITOR',
          details: {
            username,
            failureCount: events.length,
            timeWindow: '10 minutes',
          },
        });
      }
    }
  }
  
  // Similar implementations for other monitoring methods
  
  private async createSecurityAlert(alert): Promise<void> {
    // Create alert in database
    await this.securityAlertRepository.create(alert);
    
    // Log alert
    this.logger.warn('Security alert created', {
      type: alert.type,
      severity: alert.severity,
      details: alert.details,
    });
    
    // Notify security team for high severity alerts
    if (alert.severity === 'HIGH') {
      await this.notificationService.notifySecurityTeam(alert);
    }
  }
  
  // Helper methods
  private groupByIp(events): { [key: string]: any[] } {
    return events.reduce((groups, event) => {
      const key = event.ip;
      groups[key] = groups[key] || [];
      groups[key].push(event);
      return groups;
    }, {});
  }
  
  private groupByUser(events): { [key: string]: any[] } {
    return events.reduce((groups, event) => {
      const key = event.username || 'unknown';
      groups[key] = groups[key] || [];
      groups[key].push(event);
      return groups;
    }, {});
  }
}
```

## API Documentation

### 1. OpenAPI Specification

The API is documented using OpenAPI:

```typescript
// OpenAPI configuration
export const openApiConfig = {
  openapi: '3.0.0',
  info: {
    title: 'WCAG Accessibility Audit Tool API',
    version: '1.0.0',
    description: 'API for the WCAG Accessibility Audit Tool',
    contact: {
      name: 'API Support',
      email: 'api-support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'https://api.example.com/v1',
      description: 'Production API Server',
    },
    {
      url: 'https://staging-api.example.com/v1',
      description: 'Staging API Server',
    },
    {
      url: 'http://localhost:3000/v1',
      description: 'Development API Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      apiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
      },
    },
    schemas: {
      // Schema definitions...
    },
  },
  security: [
    { bearerAuth: [] },
  ],
  paths: {
    // Path definitions...
  },
};
```

### 2. Security Documentation

Security requirements are documented:

```typescript
// OpenAPI path with security documentation
export const auditPaths = {
  '/audits': {
    get: {
      summary: 'Get all audits',
      description: 'Returns a list of accessibility audits that the user has access to',
      security: [
        { bearerAuth: [] },
      ],
      parameters: [
        // Parameter definitions...
      ],
      responses: {
        '200': {
          description: 'A list of audits',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Audit',
                },
              },
            },
          },
        },
        '401': {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Authentication required',
              },
            },
          },
        },
        '403': {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Insufficient scope',
              },
            },
          },
        },
        '429': {
          description: 'Too many requests',
          headers: {
            'X-RateLimit-Limit': {
              schema: {
                type: 'integer',
              },
              description: 'The number of allowed requests in the current period',
            },
            'X-RateLimit-Remaining': {
              schema: {
                type: 'integer',
              },
              description: 'The number of remaining requests in the current period',
            },
            'X-RateLimit-Reset': {
              schema: {
                type: 'integer',
                format: 'unix-time',
              },
              description: 'The time when the current rate limit window resets in UTC epoch seconds',
            },
          },
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'Too many requests, please try again later.',
              },
            },
          },
        },
      },
    },
    post: {
      summary: 'Create a new audit',
      description: 'Creates a new accessibility audit',
      security: [
        { bearerAuth: [] },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateAuditRequest',
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'Audit created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Audit',
              },
            },
          },
        },
        '400': {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        '401': {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '403': {
          description: 'Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        '429': {
          description: 'Too many requests',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
  },
};
```

## Conclusion

The API security measures implemented in the WCAG Accessibility Audit Tool provide a comprehensive approach to protecting the API endpoints from common vulnerabilities and attacks. These measures include authentication, authorization, input validation, rate limiting, and proper error handling.

By following security best practices and implementing defense in depth, the API is protected against a wide range of threats while providing a secure and reliable interface for client applications.

## Appendices

### Appendix A: API Security Checklist

- [ ] All endpoints require authentication
- [ ] Authentication uses secure mechanisms (JWT, API keys)
- [ ] Authorization is implemented for all endpoints
- [ ] Input validation is implemented for all requests
- [ ] Rate limiting is implemented to prevent abuse
- [ ] Security headers are set on all responses
- [ ] CORS is properly configured
- [ ] Error handling is secure and doesn't leak sensitive information
- [ ] API documentation includes security requirements

### Appendix B: API Security Configuration

```json
{
  "security": {
    "jwt": {
      "algorithm": "HS256",
      "accessTokenExpiresIn": "1h",
      "refreshTokenExpiresIn": "7d"
    },
    "rateLimit": {
      "default": {
        "windowMs": 60000,
        "max": 100
      },
      "createAudit": {
        "windowMs": 60000,
        "max": 20
      },
      "createUser": {
        "windowMs": 3600000,
        "max": 10
      }
    },
    "cors": {
      "allowedOrigins": [
        "https://app.example.com",
        "https://admin.example.com"
      ],
      "allowedMethods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "allowedHeaders": ["Content-Type", "Authorization", "X-API-Key", "X-Requested-With"],
      "exposedHeaders": ["X-RateLimit-Limit", "X-RateLimit-Remaining", "X-RateLimit-Reset"],
      "maxAge": 86400
    }
  }
}
```

### Appendix C: API Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│         │     │         │     │         │     │         │
│ Client  │────▶│  API    │────▶│  Auth   │────▶│ Database│
│         │     │ Gateway │     │ Service │     │         │
│         │     │         │     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │               ▲
     │               │
     └───────────────┘
     Authentication Flow
```