# Authentication Implementation

**Date:** April 15, 2024  
**Status:** Initial Draft  
**Owner:** Security Architecture Team  

## Overview

This document provides detailed implementation information for the authentication system in the WCAG Accessibility Audit Tool. It outlines the authentication methods, token management, security considerations, and implementation details to ensure secure user authentication.

## Authentication Methods

The WCAG Accessibility Audit Tool implements the following authentication methods:

### 1. JWT-based Authentication

JSON Web Tokens (JWT) are used as the primary authentication mechanism due to their stateless nature and ability to securely transmit information between parties. The implementation follows these key principles:

#### 1.1 JWT Structure

- **Header** - Algorithm and token type
  ```json
  {
    "alg": "HS256",
    "typ": "JWT"
  }
  ```

- **Payload** - User data and claims
  ```json
  {
    "sub": "user123",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "roles": ["auditor"],
    "iat": 1649944612,
    "exp": 1649948212
  }
  ```

- **Signature** - Secures the token
  ```
  HMACSHA256(
    base64UrlEncode(header) + "." +
    base64UrlEncode(payload),
    secret
  )
  ```

#### 1.2 JWT Claims

| Claim | Description | Implementation Details |
|-------|-------------|------------------------|
| `sub` | Subject (user ID) | Unique identifier from user database |
| `name` | User's full name | Used for display purposes only |
| `email` | User's email | Used for display and notifications |
| `roles` | User's assigned roles | Array of role identifiers |
| `iat` | Issued at timestamp | UNIX timestamp when token was issued |
| `exp` | Expiration timestamp | UNIX timestamp when token expires |
| `jti` | JWT ID | Unique identifier for token |

#### 1.3 Implementation Details

**Core Components:**
- `AuthService` - Backend service that generates and validates JWT tokens
- `JWTUtil` - Utility functions for token operations
- `AuthMiddleware` - Express middleware for token validation

**Key Files:**
- `WCAG9.4-audit/src/services/AuthService.ts` - Authentication service implementation
- `WCAG9.4-audit/src/utils/JWTUtil.ts` - JWT utility functions
- `WCAG9.4-audit/src/middleware/auth.middleware.ts` - Authentication middleware

**Token Generation:**
```typescript
// Inside AuthService.ts
async login(email: string, password: string): Promise<AuthResult> {
  // Validate user credentials
  const user = await this.userRepository.findByEmail(email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const passwordValid = await bcrypt.compare(password, user.password);
  
  if (!passwordValid) {
    throw new Error('Invalid password');
  }
  
  // Generate JWT token
  const token = jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
    this.configService.get('JWT_SECRET'),
    {
      expiresIn: '1h',
      jti: uuidv4(),
    }
  );
  
  // Generate refresh token
  const refreshToken = this.generateRefreshToken(user.id);
  
  // Log authentication event
  this.loggingService.logAuthEvent({
    userId: user.id,
    action: 'LOGIN',
    status: 'SUCCESS',
    timestamp: new Date(),
  });
  
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
    token,
    refreshToken,
  };
}
```

**Token Validation:**
```typescript
// Inside auth.middleware.ts
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from request
    const token = extractTokenFromRequest(req);
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, configService.get('JWT_SECRET'));
    
    // Check if token is blacklisted (for logout)
    if (tokenBlacklistService.isBlacklisted(decoded.jti)) {
      return res.status(401).json({ message: 'Token is no longer valid' });
    }
    
    // Add user to request
    req.user = decoded;
    
    // Log authentication verification
    loggingService.logAuthEvent({
      userId: decoded.sub,
      action: 'VERIFY',
      status: 'SUCCESS',
      timestamp: new Date(),
    });
    
    next();
  } catch (error) {
    // Log authentication failure
    loggingService.logAuthEvent({
      action: 'VERIFY',
      status: 'FAILURE',
      error: error.message,
      timestamp: new Date(),
    });
    
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Helper function to extract token
function extractTokenFromRequest(req) {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
}
```

### 2. Session-based Authentication (Alternative)

While JWT is the primary authentication method, session-based authentication is implemented as an alternative for specific use cases where server-side session management is preferred.

#### 2.1 Session Structure

- **Session Store** - Redis-based session storage
- **Session ID** - Secure, random identifier stored in cookies
- **Session Data** - User information and authentication state

#### 2.2 Implementation Details

**Core Components:**
- `SessionManager` - Backend service for session management
- `SessionStore` - Redis-based session storage
- `SessionMiddleware` - Express middleware for session validation

**Key Files:**
- `WCAG9.4-audit/src/services/SessionManager.ts` - Session management service
- `WCAG9.4-audit/src/utils/SessionStore.ts` - Session storage implementation
- `WCAG9.4-audit/src/middleware/session.middleware.ts` - Session middleware

**Session Creation:**
```typescript
// Inside SessionManager.ts
async createSession(user: User): Promise<string> {
  // Generate session ID
  const sessionId = uuidv4();
  
  // Create session data
  const sessionData = {
    userId: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + this.sessionDuration),
  };
  
  // Store session
  await this.sessionStore.set(sessionId, sessionData);
  
  // Log session creation
  this.loggingService.logAuthEvent({
    userId: user.id,
    action: 'SESSION_CREATE',
    status: 'SUCCESS',
    timestamp: new Date(),
  });
  
  return sessionId;
}
```

**Session Validation:**
```typescript
// Inside session.middleware.ts
export const sessionMiddleware = async (req, res, next) => {
  try {
    // Get session ID from cookie
    const sessionId = req.cookies.sessionId;
    
    if (!sessionId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Get session from store
    const session = await sessionStore.get(sessionId);
    
    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }
    
    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      await sessionStore.delete(sessionId);
      return res.status(401).json({ message: 'Session expired' });
    }
    
    // Add user to request
    req.user = {
      id: session.userId,
      name: session.name,
      email: session.email,
      roles: session.roles,
    };
    
    // Log session verification
    loggingService.logAuthEvent({
      userId: session.userId,
      action: 'SESSION_VERIFY',
      status: 'SUCCESS',
      timestamp: new Date(),
    });
    
    // Extend session if needed
    if (shouldExtendSession(session)) {
      await extendSession(sessionId, session);
    }
    
    next();
  } catch (error) {
    // Log session verification failure
    loggingService.logAuthEvent({
      action: 'SESSION_VERIFY',
      status: 'FAILURE',
      error: error.message,
      timestamp: new Date(),
    });
    
    return res.status(401).json({ message: 'Session verification failed' });
  }
};
```

### 3. OAuth 2.0 Integration (Planned)

OAuth 2.0 integration is planned for future implementation to support authentication through third-party providers such as Google, Microsoft, and GitHub.

#### 3.1 Planned Providers

- Google
- Microsoft
- GitHub
- Facebook

#### 3.2 Implementation Plan

1. Create OAuth provider interfaces
2. Implement provider-specific adapters
3. Integrate with existing authentication flow
4. Add frontend support for OAuth login

## Token Management

### 1. Token Storage

#### 1.1 Client-side Storage

JWT tokens are stored on the client side using the following approach:

- **Access Token** - Stored in an HttpOnly, Secure cookie to prevent XSS
- **Refresh Token** - Stored in a secure HttpOnly, Secure cookie with longer expiration

```typescript
// Setting cookies in response
res.cookie('token', accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600000, // 1 hour
});

res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 3600000, // 7 days
});
```

#### 1.2 Server-side Storage

The system maintains the following server-side token information:

- **Token Blacklist** - Invalidated tokens (from logout)
- **Refresh Token Registry** - Mapping of refresh tokens to users
- **Token Metadata** - Additional information for security monitoring

### 2. Token Rotation

The system implements token rotation to enhance security:

- **Access Token** - Short-lived (1 hour)
- **Refresh Token** - Longer-lived (7 days)
- **Rotation Strategy** - New tokens issued on refresh
- **One-time Use** - Refresh tokens are single-use

```typescript
// Inside AuthService.ts
async refreshToken(refreshToken: string): Promise<AuthResult> {
  try {
    // Validate refresh token
    const tokenData = await this.validateRefreshToken(refreshToken);
    
    if (!tokenData) {
      throw new Error('Invalid refresh token');
    }
    
    // Get user
    const user = await this.userRepository.findById(tokenData.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Invalidate current refresh token
    await this.invalidateRefreshToken(refreshToken);
    
    // Generate new tokens
    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = this.generateRefreshToken(user.id);
    
    // Log token refresh
    this.loggingService.logAuthEvent({
      userId: user.id,
      action: 'TOKEN_REFRESH',
      status: 'SUCCESS',
      timestamp: new Date(),
    });
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      },
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error) {
    // Log refresh failure
    this.loggingService.logAuthEvent({
      action: 'TOKEN_REFRESH',
      status: 'FAILURE',
      error: error.message,
      timestamp: new Date(),
    });
    
    throw error;
  }
}
```

### 3. Token Revocation

The system supports token revocation in the following scenarios:

- **User Logout** - Explicit user logout action
- **Password Change** - All tokens invalidated on password change
- **Security Breach** - Admin capability to revoke all tokens for a user

```typescript
// Inside AuthService.ts
async logout(token: string): Promise<void> {
  try {
    // Decode token without verification
    const decoded = jwt.decode(token);
    
    if (!decoded || typeof decoded === 'string') {
      throw new Error('Invalid token format');
    }
    
    // Add token to blacklist
    await this.tokenBlacklistService.blacklist(decoded.jti, new Date(decoded.exp * 1000));
    
    // Log logout
    this.loggingService.logAuthEvent({
      userId: decoded.sub,
      action: 'LOGOUT',
      status: 'SUCCESS',
      timestamp: new Date(),
    });
  } catch (error) {
    // Log logout failure
    this.loggingService.logAuthEvent({
      action: 'LOGOUT',
      status: 'FAILURE',
      error: error.message,
      timestamp: new Date(),
    });
    
    throw error;
  }
}

async revokeAllUserTokens(userId: string): Promise<void> {
  try {
    // Add user to token revocation list
    await this.tokenRevocationService.revokeAllForUser(userId, new Date());
    
    // Delete all refresh tokens for user
    await this.refreshTokenRepository.deleteAllForUser(userId);
    
    // Log token revocation
    this.loggingService.logAuthEvent({
      userId,
      action: 'REVOKE_ALL_TOKENS',
      status: 'SUCCESS',
      timestamp: new Date(),
    });
  } catch (error) {
    // Log revocation failure
    this.loggingService.logAuthEvent({
      userId,
      action: 'REVOKE_ALL_TOKENS',
      status: 'FAILURE',
      error: error.message,
      timestamp: new Date(),
    });
    
    throw error;
  }
}
```

## Password Management

### 1. Password Storage

Passwords are stored securely using the following approach:

- **Hashing Algorithm** - bcrypt with appropriate work factor (12)
- **Salting** - Unique salt per user (handled automatically by bcrypt)
- **Pepper** - Optional additional secret (application-wide)

```typescript
// Inside UserService.ts
async createUser(userData: CreateUserDto): Promise<User> {
  // Check if user already exists
  const existingUser = await this.userRepository.findByEmail(userData.email);
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12);
  
  // Create user
  const user = await this.userRepository.create({
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
  });
  
  // Log user creation
  this.loggingService.logUserEvent({
    userId: user.id,
    action: 'USER_CREATE',
    status: 'SUCCESS',
    timestamp: new Date(),
  });
  
  return user;
}
```

### 2. Password Validation

Password validation ensures that passwords meet security requirements:

- **Minimum Length** - 8 characters
- **Complexity** - Requires a mix of uppercase, lowercase, numbers, and special characters
- **Common Passwords** - Checks against a list of common passwords
- **Personal Information** - Prevents use of personal information (name, email)

```typescript
// Inside UserService.ts
validatePassword(password: string, user?: User): string[] {
  const errors = [];
  
  // Check length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Check complexity
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check against common passwords
  if (this.commonPasswordService.isCommonPassword(password)) {
    errors.push('Password is too common');
  }
  
  // Check against personal information
  if (user) {
    const lowercasePassword = password.toLowerCase();
    
    if (user.name && lowercasePassword.includes(user.name.toLowerCase())) {
      errors.push('Password must not contain your name');
    }
    
    if (user.email) {
      const emailParts = user.email.split('@')[0].toLowerCase();
      if (lowercasePassword.includes(emailParts)) {
        errors.push('Password must not contain your email');
      }
    }
  }
  
  return errors;
}
```

### 3. Password Change

The password change process includes the following security measures:

- **Current Password Verification** - Requires current password
- **Password History** - Prevents reuse of recent passwords
- **Token Invalidation** - Invalidates all existing tokens

```typescript
// Inside UserService.ts
async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  // Get user
  const user = await this.userRepository.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Verify current password
  const passwordValid = await bcrypt.compare(currentPassword, user.password);
  
  if (!passwordValid) {
    throw new Error('Current password is incorrect');
  }
  
  // Validate new password
  const validationErrors = this.validatePassword(newPassword, user);
  
  if (validationErrors.length > 0) {
    throw new Error(`Password validation failed: ${validationErrors.join(', ')}`);
  }
  
  // Check password history
  const passwordHistory = await this.passwordHistoryRepository.getForUser(userId);
  
  for (const historicPassword of passwordHistory) {
    const isHistoricMatch = await bcrypt.compare(newPassword, historicPassword.password);
    
    if (isHistoricMatch) {
      throw new Error('New password cannot be the same as any of your recent passwords');
    }
  }
  
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update user password
  await this.userRepository.updatePassword(userId, hashedPassword);
  
  // Add to password history
  await this.passwordHistoryRepository.add({
    userId,
    password: user.password,
    createdAt: new Date(),
  });
  
  // Revoke all tokens
  await this.authService.revokeAllUserTokens(userId);
  
  // Log password change
  this.loggingService.logUserEvent({
    userId,
    action: 'PASSWORD_CHANGE',
    status: 'SUCCESS',
    timestamp: new Date(),
  });
}
```

### 4. Password Reset

The password reset flow includes the following security measures:

- **Email Verification** - Reset link sent to user's email
- **Time-limited Token** - Reset tokens expire after a short period
- **One-time Use** - Reset tokens can only be used once
- **Rate Limiting** - Limits the number of reset requests

```typescript
// Inside UserService.ts
async requestPasswordReset(email: string): Promise<void> {
  // Get user
  const user = await this.userRepository.findByEmail(email);
  
  if (!user) {
    // Return success even if user doesn't exist to prevent email enumeration
    return;
  }
  
  // Check rate limiting
  const recentRequests = await this.passwordResetRepository.countRecentRequests(email);
  
  if (recentRequests >= 3) {
    throw new Error('Too many reset requests. Please try again later.');
  }
  
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  // Save reset token
  await this.passwordResetRepository.create({
    userId: user.id,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 3600000), // 1 hour
    createdAt: new Date(),
  });
  
  // Send reset email
  await this.emailService.sendPasswordReset(
    user.email,
    user.name,
    `${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`
  );
  
  // Log reset request
  this.loggingService.logUserEvent({
    userId: user.id,
    action: 'PASSWORD_RESET_REQUEST',
    status: 'SUCCESS',
    timestamp: new Date(),
  });
}

async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
  // Get user
  const user = await this.userRepository.findByEmail(email);
  
  if (!user) {
    throw new Error('Invalid reset request');
  }
  
  // Hash the token from the URL
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  // Get reset record
  const resetRecord = await this.passwordResetRepository.findValid(user.id, hashedToken);
  
  if (!resetRecord) {
    throw new Error('Invalid or expired reset token');
  }
  
  // Validate new password
  const validationErrors = this.validatePassword(newPassword, user);
  
  if (validationErrors.length > 0) {
    throw new Error(`Password validation failed: ${validationErrors.join(', ')}`);
  }
  
  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update user password
  await this.userRepository.updatePassword(user.id, hashedPassword);
  
  // Add to password history
  await this.passwordHistoryRepository.add({
    userId: user.id,
    password: user.password,
    createdAt: new Date(),
  });
  
  // Invalidate reset token
  await this.passwordResetRepository.invalidate(resetRecord.id);
  
  // Revoke all tokens
  await this.authService.revokeAllUserTokens(user.id);
  
  // Log password reset
  this.loggingService.logUserEvent({
    userId: user.id,
    action: 'PASSWORD_RESET',
    status: 'SUCCESS',
    timestamp: new Date(),
  });
}
```

## Account Security

### 1. Account Lockout

The system implements account lockout to prevent brute force attacks:

- **Threshold** - 5 failed login attempts
- **Lockout Duration** - 15 minutes
- **Progressive Lockout** - Increasing duration for repeated failures
- **Notification** - Email notification for lockouts

```typescript
// Inside AuthService.ts
async login(email: string, password: string): Promise<AuthResult> {
  // Get user
  const user = await this.userRepository.findByEmail(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    // Log login attempt on locked account
    this.loggingService.logAuthEvent({
      userId: user.id,
      action: 'LOGIN_ATTEMPT',
      status: 'FAILURE',
      reason: 'ACCOUNT_LOCKED',
      timestamp: new Date(),
    });
    
    throw new Error(`Account is locked. Please try again after ${formatDateTime(user.lockedUntil)}`);
  }
  
  // Verify password
  const passwordValid = await bcrypt.compare(password, user.password);
  
  if (!passwordValid) {
    // Increment failed attempts
    const failedAttempts = (user.failedLoginAttempts || 0) + 1;
    
    // Update user with failed attempt
    if (failedAttempts >= 5) {
      // Calculate lockout duration (progressive)
      const lockoutMinutes = Math.min(15 * Math.pow(2, Math.floor(failedAttempts / 5) - 1), 1440); // Max 24 hours
      const lockedUntil = new Date(Date.now() + lockoutMinutes * 60000);
      
      await this.userRepository.updateLoginAttempts(user.id, 0, lockedUntil);
      
      // Send lockout notification
      await this.emailService.sendAccountLockout(
        user.email,
        user.name,
        lockedUntil
      );
      
      // Log account lockout
      this.loggingService.logAuthEvent({
        userId: user.id,
        action: 'ACCOUNT_LOCKOUT',
        status: 'SUCCESS',
        details: `Locked until ${lockedUntil.toISOString()}`,
        timestamp: new Date(),
      });
    } else {
      await this.userRepository.updateLoginAttempts(user.id, failedAttempts);
    }
    
    // Log failed login
    this.loggingService.logAuthEvent({
      userId: user.id,
      action: 'LOGIN',
      status: 'FAILURE',
      reason: 'INVALID_PASSWORD',
      details: `Failed attempt ${failedAttempts}/5`,
      timestamp: new Date(),
    });
    
    throw new Error('Invalid credentials');
  }
  
  // Reset failed attempts on successful login
  if (user.failedLoginAttempts > 0) {
    await this.userRepository.updateLoginAttempts(user.id, 0, null);
  }
  
  // Continue with login process...
}
```

### 2. Suspicious Activity Detection

The system implements suspicious activity detection:

- **Unusual Login Locations** - Detection of logins from new locations
- **Login Time Patterns** - Detection of logins outside normal time patterns
- **Multiple Devices** - Tracking of multiple device logins
- **Notification** - Email notification for suspicious activity

```typescript
// Inside AuthService.ts
async detectSuspiciousActivity(user: User, loginData: LoginData): Promise<boolean> {
  let suspicious = false;
  const suspiciousReasons = [];
  
  // Check login location
  const userLocations = await this.userLocationRepository.getForUser(user.id);
  const knownLocation = userLocations.some(loc => 
    geoDistance(loc.latitude, loc.longitude, loginData.latitude, loginData.longitude) < 100
  );
  
  if (!knownLocation && userLocations.length > 0) {
    suspicious = true;
    suspiciousReasons.push('NEW_LOCATION');
  }
  
  // Check login time pattern
  const loginTimes = await this.loginTimeRepository.getForUser(user.id);
  const averageLoginHour = calculateAverageLoginHour(loginTimes);
  const currentHour = new Date().getHours();
  
  if (loginTimes.length > 5 && Math.abs(currentHour - averageLoginHour) > 6) {
    suspicious = true;
    suspiciousReasons.push('UNUSUAL_TIME');
  }
  
  // Check multiple devices
  const activeSessions = await this.sessionRepository.getActiveForUser(user.id);
  
  if (activeSessions.length >= 5) {
    suspicious = true;
    suspiciousReasons.push('MULTIPLE_DEVICES');
  }
  
  // Record login data
  await this.userLocationRepository.add({
    userId: user.id,
    ip: loginData.ip,
    userAgent: loginData.userAgent,
    latitude: loginData.latitude,
    longitude: loginData.longitude,
    city: loginData.city,
    country: loginData.country,
    timestamp: new Date(),
  });
  
  await this.loginTimeRepository.add({
    userId: user.id,
    timestamp: new Date(),
  });
  
  // Log suspicious activity
  if (suspicious) {
    this.loggingService.logSecurityEvent({
      userId: user.id,
      action: 'SUSPICIOUS_ACTIVITY',
      status: 'DETECTED',
      details: `Reasons: ${suspiciousReasons.join(', ')}`,
      timestamp: new Date(),
    });
    
    // Send notification
    await this.emailService.sendSuspiciousActivityAlert(
      user.email,
      user.name,
      {
        time: new Date(),
        ip: loginData.ip,
        location: `${loginData.city}, ${loginData.country}`,
        device: loginData.userAgent,
        reasons: suspiciousReasons,
      }
    );
  }
  
  return suspicious;
}
```

### 3. Multi-factor Authentication (Planned)

Multi-factor authentication (MFA) is planned for future implementation:

- **TOTP** - Time-based One-Time Password (e.g., Google Authenticator)
- **Email Codes** - One-time codes sent via email
- **SMS Codes** - One-time codes sent via SMS (where available)
- **Recovery Codes** - Backup codes for account recovery

## Frontend Implementation

### 1. Authentication Context

The frontend implements an authentication context for managing auth state:

```tsx
// Inside AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const authService = new AuthService();
  
  useEffect(() => {
    // Check if user is already authenticated
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Handle error or leave user as null
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    // Set up token refresh interval
    const refreshInterval = setInterval(() => {
      if (user) {
        refreshToken();
      }
    }, 15 * 60 * 1000); // 15 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshToken = async () => {
    try {
      const result = await authService.refreshToken();
      setUser(result.user);
      return true;
    } catch (error) {
      // If refresh fails, log out
      setUser(null);
      return false;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. Login Component

The login component handles user authentication:

```tsx
// Inside LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(email, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Sign In</h2>
      
      {error && <div className="error-message" role="alert">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
        />
      </div>
      
      <div className="form-actions">
        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <a href="/forgot-password">Forgot password?</a>
      </div>
    </form>
  );
};
```

### 3. Protected Routes

The frontend implements protected routes to restrict access:

```tsx
// Inside PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PrivateRouteProps {
  requiredRoles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Show loading state
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check roles if required
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = user?.roles.some(role => requiredRoles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Render the protected component
  return <Outlet />;
};
```

## Security Considerations

### 1. CSRF Protection

The system implements CSRF protection:

- **Same-Site Cookies** - Cookies set with SameSite=Strict
- **CSRF Tokens** - Optional tokens for non-GET requests
- **Origin Validation** - Verification of request origin

```typescript
// Inside CSRFMiddleware.ts
export const csrfProtection = (req, res, next) => {
  // Skip for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Verify Origin header
  const origin = req.headers.origin;
  const allowedOrigins = [configService.get('FRONTEND_URL')];
  
  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ message: 'Invalid request origin' });
  }
  
  // Verify Referer header
  const referer = req.headers.referer;
  
  if (referer) {
    const refererUrl = new URL(referer);
    const allowedHosts = [new URL(configService.get('FRONTEND_URL')).host];
    
    if (!allowedHosts.includes(refererUrl.host)) {
      return res.status(403).json({ message: 'Invalid request referer' });
    }
  }
  
  // If using CSRF tokens in addition to SameSite cookies
  if (configService.get('USE_CSRF_TOKENS') === 'true') {
    const csrfToken = req.headers['x-csrf-token'];
    
    if (!csrfToken || !validateCsrfToken(req, csrfToken)) {
      return res.status(403).json({ message: 'Invalid or missing CSRF token' });
    }
  }
  
  next();
};
```

### 2. XSS Protection

The system implements XSS protection:

- **React's Built-in Protection** - React escapes content by default
- **Content Security Policy** - Strict CSP headers
- **HttpOnly Cookies** - Prevents JavaScript access to cookies
- **Input Validation** - Server-side validation of all inputs

```typescript
// Inside SecurityMiddleware.ts
import helmet from 'helmet';

export const securityMiddleware = [
  // Set security headers
  helmet(),
  
  // Set custom Content Security Policy
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Consider removing unsafe-inline
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://api.example.com"],
      fontSrc: ["'self'", "https://fonts.googleapis.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
  
  // Prevent browsers from interpreting files as different MIME types
  helmet.noSniff(),
  
  // XSS Protection header (although modern browsers use CSP)
  helmet.xssFilter(),
  
  // Prevent clickjacking
  helmet.frameguard({ action: 'deny' }),
];
```

### 3. Secure Headers

The system implements secure HTTP headers:

- **Strict-Transport-Security** - Forces HTTPS connections
- **X-Content-Type-Options** - Prevents MIME type sniffing
- **X-Frame-Options** - Prevents clickjacking
- **Referrer-Policy** - Controls referrer information
- **Permissions-Policy** - Restricts browser features

```typescript
// Part of SecurityMiddleware.ts
export const secureHeadersMiddleware = [
  // HSTS (HTTP Strict Transport Security)
  (req, res, next) => {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
    next();
  },
  
  // Referrer Policy
  (req, res, next) => {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  },
  
  // Permissions Policy
  (req, res, next) => {
    res.setHeader(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(self), payment=()'
    );
    next();
  },
];
```

## Testing and Verification

### 1. Authentication Testing

The authentication system is tested through:

- **Unit Tests** - Testing individual components
- **Integration Tests** - Testing authentication flow
- **End-to-End Tests** - Testing complete user flows
- **Security Tests** - Testing security measures

```typescript
// Example authentication tests
describe('Authentication Service', () => {
  describe('login', () => {
    it('should return user and tokens for valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'CorrectPassword123!';
      
      // Act
      const result = await authService.login(email, password);
      
      // Assert
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe(email);
    });
    
    it('should throw error for invalid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'WrongPassword123!';
      
      // Act & Assert
      await expect(authService.login(email, password))
        .rejects.toThrow('Invalid credentials');
    });
    
    it('should lock account after 5 failed attempts', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'WrongPassword123!';
      
      // Act - 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await expect(authService.login(email, password))
          .rejects.toThrow('Invalid credentials');
      }
      
      // Assert - 6th attempt should indicate account locked
      await expect(authService.login(email, password))
        .rejects.toThrow(/Account is locked/);
    });
  });
  
  // Additional test cases...
});
```

### 2. Security Scanning

The authentication system is validated through:

- **Static Analysis** - Code scanning for security issues
- **Dependency Scanning** - Checking for vulnerable dependencies
- **Secret Scanning** - Ensuring no secrets in code
- **Authentication-specific Scanning** - Specialized tools for auth issues

```yaml
# Inside .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 3 * * 1' # Weekly at 3am on Monday

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
        
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run ESLint security plugin
        run: npx eslint --plugin security --ext .js,.jsx,.ts,.tsx .
        
      - name: Run npm audit
        run: npm audit --production
        
      - name: Run OWASP ZAP scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: 'http://localhost:3000'
```

## Conclusion

The authentication implementation described in this document provides a secure, robust, and user-friendly authentication system for the WCAG Accessibility Audit Tool. By implementing JWT-based authentication with appropriate security measures, the system ensures that users can securely access the application while protecting against common authentication vulnerabilities.

The authentication system will continue to evolve as security best practices advance and new authentication methods become available. Regular security reviews and updates will ensure that the authentication system remains secure and effective.

## Appendices

### Appendix A: Authentication Flow Diagrams

#### User Login Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│         │     │         │     │         │     │         │
│  User   │────▶│ Frontend│────▶│   API   │────▶│  Auth   │
│         │     │         │     │         │     │ Service │
│         │     │         │     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
                                                      │
                                                      ▼
                                                ┌─────────┐
                                                │         │
                                                │ Database│
                                                │         │
                                                └─────────┘
```

#### Token Refresh Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│         │     │         │     │         │     │         │
│ Frontend│────▶│   API   │────▶│  Auth   │────▶│ Token   │
│         │     │         │     │ Service │────▶│ Store   │
│         │     │         │     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
    ▲                                │
    │                                ▼
    │                          ┌─────────┐
    │                          │         │
    └──────────────────────────│  User   │
                               │ Database│
                               │         │
                               └─────────┘
```

#### Password Reset Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│         │     │         │     │         │     │         │
│  User   │────▶│ Frontend│────▶│   API   │────▶│  User   │
│         │     │         │     │         │     │ Service │
│         │     │         │     │         │     │         │
└─────────┘     └─────────┘     └─────────┘     └─────────┘
    ▲                                                │
    │                                                ▼
    │                                          ┌─────────┐
    │                                          │         │
    │                                          │  Email  │
    │                                          │ Service │
    │                                          │         │
    │                                          └─────────┘
    │                                                │
    └────────────────────────────────────────────────┘
```

### Appendix B: JWT Payload Structure

```json
{
  "sub": "user123",          // Subject (user ID)
  "name": "Jane Doe",        // User's full name
  "email": "jane@example.com", // User's email
  "roles": ["auditor"],      // User's roles
  "permissions": ["audit:read", "audit:create"], // User's permissions
  "iat": 1649944612,         // Issued at timestamp
  "exp": 1649948212,         // Expiration timestamp
  "jti": "abc123def456",     // JWT ID
  "iss": "wcag-audit-tool",  // Issuer
  "aud": "wcag-audit-api"    // Audience
}
```

### Appendix C: Security Configuration Reference

```json
{
  "authentication": {
    "jwtSecret": "[REDACTED]",
    "jwtExpiresIn": "1h",
    "refreshTokenExpiresIn": "7d",
    "passwordHashRounds": 12,
    "lockoutThreshold": 5,
    "lockoutDuration": "15m"
  },
  "csrf": {
    "enabled": true,
    "cookieName": "XSRF-TOKEN",
    "headerName": "X-XSRF-TOKEN",
    "methods": ["POST", "PUT", "DELETE", "PATCH"]
  },
  "cookies": {
    "secure": true,
    "httpOnly": true,
    "sameSite": "strict",
    "domain": "example.com",
    "path": "/"
  }
}
```