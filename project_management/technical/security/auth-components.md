# Authentication Components Documentation

**Date:** April 15, 2024  
**Status:** Active Implementation  
**Owner:** Security Architecture Team  

## Overview

This document describes the authentication and authorization components implemented in the WCAG Accessibility Audit Tool. These components provide secure user authentication, route protection, and role-based access control throughout the application.

## Component Architecture

The authentication system consists of several interconnected components:

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│                 │     │                  │     │                │
│ Auth Components │────▶│ Auth Context API │────▶│ Token Services │
│                 │     │                  │     │                │
└─────────────────┘     └──────────────────┘     └────────────────┘
        │                        │                       │
        ▼                        ▼                       ▼
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│                 │     │                  │     │                │
│ Protected Routes│◀────│  User Management │◀────│ Auth Services  │
│                 │     │                  │     │                │
└─────────────────┘     └──────────────────┘     └────────────────┘
```

## Core Components

### 1. AuthContext

The `AuthContext` provides application-wide authentication state and methods through React Context API.

**File:** `src/contexts/AuthContext.tsx`

**Key Features:**
- Authentication state management
- User information storage
- Login/logout functionality
- Registration handling
- Password reset functionality

**Usage Example:**
```tsx
// Access authentication context in any component
const { isAuthenticated, user, login, logout } = useContext(AuthContext);

// Use authentication methods
const handleLogin = async (email, password) => {
  const result = await login(email, password);
  if (result.success) {
    // Redirect or show success message
  } else {
    // Show error message
  }
};
```

### 2. PrivateRoute

The `PrivateRoute` component protects routes that require authentication or specific user roles.

**File:** `src/components/auth/PrivateRoute.tsx`

**Key Features:**
- Redirects unauthenticated users to login
- Supports role-based route protection
- Handles loading states during authentication check
- Preserves original navigation targets for redirect after login

**Usage Example:**
```tsx
// In your router configuration
<Route element={<PrivateRoute allowedRoles={['admin']} />}>
  <Route path="/admin-dashboard" element={<AdminDashboard />} />
</Route>

// For routes that just require authentication without specific roles
<Route element={<PrivateRoute />}>
  <Route path="/profile" element={<UserProfile />} />
</Route>
```

### 3. RoleBasedAccess

The `RoleBasedAccess` component conditionally renders UI elements based on user roles.

**File:** `src/components/auth/RoleBasedAccess.tsx`

**Key Features:**
- Visibility control based on user roles
- Optional fallback content for unauthorized users
- Supports multiple allowed roles

**Usage Example:**
```tsx
// Only show admin controls to users with admin role
<RoleBasedAccess allowedRoles={['admin']}>
  <AdminControls />
</RoleBasedAccess>

// With fallback content
<RoleBasedAccess 
  allowedRoles={['admin', 'developer']} 
  fallback={<AccessDeniedMessage />}
>
  <AdvancedSettings />
</RoleBasedAccess>
```

### 4. PermissionCheck

The `PermissionCheck` component provides fine-grained permission control for UI elements.

**File:** `src/components/auth/PermissionCheck.tsx`

**Key Features:**
- Permission-based visibility control
- Support for multiple required permissions
- Role-to-permission mapping
- Optional fallback content

**Usage Example:**
```tsx
// Only show audit creation button to users with audit:create permission
<PermissionCheck permissions="audit:create">
  <CreateAuditButton />
</PermissionCheck>

// Require multiple permissions
<PermissionCheck 
  permissions={['report:create', 'report:update']} 
  fallback={<RequestAccessButton />}
>
  <ReportEditor />
</PermissionCheck>
```

## Authentication Services

### 1. Token Services

The token services handle JWT token generation, validation, and management.

**File:** `src/utils/auth.ts`

**Key Features:**
- Secure JWT token generation using jose library
- Token validation with proper signature verification
- Token payload handling with proper claims
- Expiration and issuance time management

**Implementation Details:**
```typescript
// Token generation with jose
export const generateToken = async (user: Partial<User>): Promise<string> => {
  // Create JWT with user data
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('wcag-audit-tool')
    .setAudience('wcag-audit-users')
    .setExpirationTime(expirationTime)
    .setNotBefore(new Date())
    .sign(SECRET_KEY);
};

// Token validation with jose
export const validateToken = async (token: string): Promise<UserData | null> => {
  // Verify token signature and claims
  const { payload } = await jose.jwtVerify(token, SECRET_KEY, {
    issuer: 'wcag-audit-tool',
    audience: 'wcag-audit-users'
  });
  
  // Return user data if valid
  return {
    id: payload.sub as string,
    email: payload.email as string,
    // Additional user data...
  };
};
```

### 2. Authentication API Services

The authentication API services handle user authentication, registration, and profile management.

**File:** `src/utils/auth.ts`

**Key Functions:**

| Function | Description |
|----------|-------------|
| loginUser | Authenticates a user with email and password |
| registerUser | Registers a new user in the system |
| verifyEmail | Verifies a user's email using a token |
| createPasswordResetToken | Creates a password reset token |
| resetPassword | Resets a user's password using a token |
| updateUserProfile | Updates a user's profile information |
| updatePassword | Updates a user's password |

## Permission System

### Role-Based Access Control

The system implements role-based access control (RBAC) with the following roles:

| Role | Description | Access Level |
|------|-------------|--------------|
| admin | Administrator | Full system access |
| user | Standard user | Access to own data and basic features |
| guest | Guest user | Limited read-only access |
| developer | Developer | System access with debugging capabilities |

### Permission Structure

Permissions are structured in a `resource:action` format:

| Permission Pattern | Example | Description |
|-------------------|---------|-------------|
| audit:create | Create new audits | Permission to create audit resources |
| audit:read | View audits | Permission to read audit resources |
| audit:update | Modify audits | Permission to update audit resources |
| audit:delete | Delete audits | Permission to delete audit resources |

The same pattern applies to other resources (report, user, system, etc.).

## Security Considerations

### Token Storage

- During development, tokens are stored in `localStorage` for simplicity
- In production, the recommended approach is to use HttpOnly cookies for tokens
- The token storage mechanism can be customized in the `AuthContext`

### CSRF Protection

- For enhanced security in production, implement CSRF tokens for authentication endpoints
- Use proper CORS configuration to restrict API access

### Token Expiration

- Tokens automatically expire after 24 hours by default
- Implement a token refresh mechanism for production use

## Future Enhancements

### Short-Term Enhancements

1. **JWTMiddleware Implementation**
   - Server-side middleware for API protection
   - Token validation on API requests
   - Role and permission verification

2. **Complete Form Components**
   - Full RegistrationForm implementation
   - Complete PasswordReset workflow

### Long-Term Enhancements

1. **OAuth Integration**
   - Support for third-party authentication providers
   - Social login options

2. **Multi-Factor Authentication (MFA)**
   - Time-based one-time password (TOTP) support
   - SMS or email verification codes
   - MFA setup and management flows