/**
 * Authentication Utilities
 * 
 * Provides secure JWT token handling with automatic key rotation,
 * token validation, and secure storage.
 */

import * as jose from 'jose';
import { createError, ErrorType, handleError } from './errorHandler';
import { secureLocalStorage, secureSessionStorage } from './secureStorage';
import { 
  getEnvNumber, 
  getEnvString, 
  requireEnvVariable, 
  isDevelopment 
} from './environment';

// Configuration constants
// Use requireEnvVariable for production but allow development fallback
const JWT_SECRET = isDevelopment() 
  ? getEnvString('VITE_JWT_SECRET', 'wcag_secure_jwt_secret_key_for_development_only')
  : requireEnvVariable('VITE_JWT_SECRET', 'wcag_secure_jwt_secret_key_for_development_only');

// Expiry settings
const JWT_EXPIRY = getEnvNumber('VITE_JWT_EXPIRY', 60 * 60); // 1 hour in seconds
const REFRESH_TOKEN_EXPIRY = getEnvNumber('VITE_REFRESH_TOKEN_EXPIRY', 7 * 24 * 60 * 60); // 7 days in seconds

// Storage keys
const AUTH_PERSISTENCE_KEY = 'auth_token';
const REFRESH_PERSISTENCE_KEY = 'refresh_token';
const USER_PERSISTENCE_KEY = 'auth_user';

// Define token payload interfaces
interface TokenPayload {
  sub: string;       // Subject (user ID)
  email?: string;    // User email
  name?: string;     // User name
  role?: string;     // User role
  iat: number;       // Issued at (timestamp)
  exp: number;       // Expiration (timestamp)
  iss?: string;      // Issuer
  aud?: string;      // Audience
  jti?: string;      // JWT ID (for blacklisting)
  type?: string;     // Token type (e.g., 'refresh')
  [key: string]: any; // Index signature for compatibility with JWTPayload
}

// User data interface
export interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  [key: string]: any;
}

// Key interface for advanced rotation
interface JwtKey {
  id: string;     // Unique key identifier
  key: CryptoKey; // Actual crypto key
  createdAt: number; // Timestamp when key was created
  isActive: boolean; // Whether this is the current active key
}

// Enhanced key manager for JWT signing and verification with proper rotation
class JwtKeyManager {
  private keys: JwtKey[] = []; // Store multiple keys for rotation
  private readonly keyRotationInterval: number = 24 * 60 * 60 * 1000; // 24 hours in ms
  private readonly maxKeys: number = 2; // Maximum number of keys to keep (current + previous)
  private initializing: Promise<void> | null = null;
  
  constructor() {
    // Initialize keys on first use
    this.initializing = this.initialize();
  }
  
  /**
   * Initialize the key manager
   */
  private async initialize(): Promise<void> {
    try {
      // Generate initial key if none exist
      if (this.keys.length === 0) {
        const initialKey = await this.createNewKey();
        this.keys.push(initialKey);
      }
      
      // Ensure we have an active key
      const hasActiveKey = this.keys.some(k => k.isActive);
      if (!hasActiveKey && this.keys.length > 0) {
        this.keys[0].isActive = true;
      }
    } catch (error) {
      handleError(error, { 
        context: 'JwtKeyManager.initialize', 
        keysCount: this.keys.length 
      });
      throw error;
    } finally {
      this.initializing = null;
    }
  }
  
  /**
   * Get current signing key, generating if needed
   * @returns Current signing key
   */
  async getCurrentSigningKey(): Promise<CryptoKey> {
    // Wait for initialization if it's in progress
    if (this.initializing) {
      await this.initializing;
    }
    
    // Check if keys need rotation
    await this.rotateKeysIfNeeded();
    
    // Find active key
    const activeKey = this.keys.find(k => k.isActive);
    if (!activeKey) {
      throw new Error('No active signing key available');
    }
    
    return activeKey.key;
  }
  
  /**
   * Get all verification keys
   * @returns Array of verification keys
   */
  async getVerificationKeys(): Promise<CryptoKey[]> {
    // Wait for initialization if it's in progress
    if (this.initializing) {
      await this.initializing;
    }
    
    // Check if keys need rotation
    await this.rotateKeysIfNeeded();
    
    // Return all keys for verification
    return this.keys.map(k => k.key);
  }
  
  /**
   * Rotate keys if enough time has passed
   */
  private async rotateKeysIfNeeded(): Promise<void> {
    const now = Date.now();
    
    // Find the active key
    const activeKeyIndex = this.keys.findIndex(k => k.isActive);
    
    // If no active key or rotation interval has passed, generate a new key
    if (
      activeKeyIndex === -1 || // No active key
      this.keys.length === 0 || // No keys at all
      now - this.keys[activeKeyIndex].createdAt >= this.keyRotationInterval // Time to rotate
    ) {
      try {
        // Create new key
        const newKey = await this.createNewKey();
        
        // Deactivate current active key
        if (activeKeyIndex !== -1) {
          this.keys[activeKeyIndex].isActive = false;
        }
        
        // Add new key
        this.keys.push(newKey);
        
        // Prune old keys if we have too many
        if (this.keys.length > this.maxKeys) {
          // Sort by creation time (newest first)
          this.keys.sort((a, b) => b.createdAt - a.createdAt);
          
          // Keep only the newest maxKeys
          this.keys = this.keys.slice(0, this.maxKeys);
        }
      } catch (error) {
        handleError(error, { 
          context: 'JwtKeyManager.rotateKeysIfNeeded',
          keysCount: this.keys.length,
          hasActiveKey: activeKeyIndex !== -1
        });
        
        // If we failed to create a new key but have an existing one, keep using it
        if (activeKeyIndex === -1 && this.keys.length > 0) {
          // Activate the newest key
          this.keys.sort((a, b) => b.createdAt - a.createdAt);
          this.keys[0].isActive = true;
        }
      }
    }
  }
  
  /**
   * Create a new JWT key
   * @returns New JwtKey object
   */
  private async createNewKey(): Promise<JwtKey> {
    // Convert JWT secret to bytes
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(JWT_SECRET);
    
    // Add some entropy to make each key unique even with same secret
    const entropy = new Uint8Array(8);
    crypto.getRandomValues(entropy);
    
    // Combine secret with entropy
    const combinedSecret = new Uint8Array(secretBytes.length + entropy.length);
    combinedSecret.set(secretBytes);
    combinedSecret.set(entropy, secretBytes.length);
    
    // Import as HMAC key
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      combinedSecret,
      { name: 'HMAC', hash: 'SHA-256' },
      false, // Non-extractable
      ['sign', 'verify'] // Key usage
    );
    
    // Return as JwtKey object
    return {
      id: crypto.randomUUID(), // Unique ID for this key
      key: cryptoKey,
      createdAt: Date.now(),
      isActive: true // New keys are active by default
    };
  }
}

// Create key manager instance
const keyManager = new JwtKeyManager();

/**
 * Generate a JWT token for a user
 * @param user User data
 * @param expiresIn Expiration time in seconds
 * @returns Generated JWT token
 */
export async function generateToken(
  user: UserData,
  expiresIn: number = JWT_EXPIRY
): Promise<string> {
  try {
    // Get current signing key
    const key = await keyManager.getCurrentSigningKey();
    
    // Generate random JWT ID
    const keyId = crypto.randomUUID();
    
    // Create JWT payload
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
      jti: keyId,
      iss: 'wcag-accessibility-service'
    };
    
    // Sign token
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(key);
    
    return token;
  } catch (error) {
    handleError(error, { context: 'auth.generateToken' });
    // Create error with proper type and message
    const authError = createError(
      'Failed to generate authentication token',
      ErrorType.INTERNAL
    );
    // Attach additional details
    (authError as any).details = { 
      code: 'token_generation_failed',
      originalError: error 
    };
    throw authError;
  }
}

/**
 * Generate a refresh token for a user
 * @param userId User ID
 * @param expiresIn Expiration time in seconds
 * @returns Generated refresh token
 */
export async function generateRefreshToken(
  userId: string,
  expiresIn: number = REFRESH_TOKEN_EXPIRY
): Promise<string> {
  try {
    // Get current signing key
    const key = await keyManager.getCurrentSigningKey();
    
    // Create JWT payload for refresh token (minimal)
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn,
      jti: crypto.randomUUID(),
      iss: 'wcag-accessibility-service',
      type: 'refresh'
    };
    
    // Sign token
    const token = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .sign(key);
    
    return token;
  } catch (error) {
    handleError(error, { context: 'auth.generateRefreshToken' });
    // Create error with proper type and message
    const authError = createError(
      'Failed to generate refresh token',
      ErrorType.INTERNAL
    );
    // Attach additional details
    (authError as any).details = { 
      code: 'refresh_token_generation_failed',
      originalError: error 
    };
    throw authError;
  }
}

/**
 * Verify a JWT token
 * @param token JWT token to verify
 * @returns Decoded token payload
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    // Get verification keys
    const keys = await keyManager.getVerificationKeys();
    
    // Try each key
    let verificationError: Error | null = null;
    
    for (const key of keys) {
      try {
        // Verify token with this key
        const { payload } = await jose.jwtVerify(token, key);
        return payload as TokenPayload;
      } catch (error) {
        // Store error but continue trying other keys
        verificationError = error as Error;
      }
    }
    
    // If we got here, none of the keys worked
    throw verificationError || new Error('Token verification failed');
  } catch (error) {
    // Check if token expired
    if (error instanceof Error && error.message.includes('expired')) {
      // Create error with proper type and message
      const authError = createError(
        'Authentication token has expired',
        ErrorType.AUTHENTICATION
      );
      // Attach additional details
      (authError as any).details = { 
        code: 'token_expired',
        originalError: error 
      };
      throw authError;
    }
    
    // General verification error
    const authError = createError(
      'Invalid authentication token',
      ErrorType.AUTHENTICATION
    );
    // Attach additional details
    (authError as any).details = { 
      code: 'token_invalid',
      originalError: error 
    };
    throw authError;
  }
}

/**
 * Verify a refresh token
 * @param token Refresh token to verify
 * @returns User ID from token
 */
export async function verifyRefreshToken(token: string): Promise<string> {
  try {
    // Verify token
    const payload = await verifyToken(token);
    
    // Check if it's a refresh token
    if (payload.type !== 'refresh') {
      throw new Error('Not a refresh token');
    }
    
    // Return user ID
    return payload.sub;
  } catch (error) {
    // Create error with proper type and message
    const authError = createError(
      'Invalid refresh token',
      ErrorType.AUTHENTICATION
    );
    // Attach additional details
    (authError as any).details = { 
      code: 'refresh_token_invalid',
      originalError: error 
    };
    throw authError;
  }
}

/**
 * Store authentication data securely
 * @param token JWT token
 * @param refreshToken Refresh token
 * @param user User data
 * @param rememberMe Whether to persist across sessions
 */
export function storeAuth(
  token: string,
  refreshToken: string,
  user: UserData,
  rememberMe: boolean = false
): void {
  try {
    // Determine storage to use
    const storage = rememberMe ? secureLocalStorage : secureSessionStorage;
    
    // Store tokens and user data
    storage.setItem(AUTH_PERSISTENCE_KEY, token);
    storage.setItem(REFRESH_PERSISTENCE_KEY, refreshToken);
    storage.setItem(USER_PERSISTENCE_KEY, JSON.stringify(user));
  } catch (error) {
    handleError(error, { context: 'auth.storeAuth' });
    // Don't throw here to avoid breaking authentication flow
  }
}

/**
 * Get stored authentication data
 * @returns Authentication data or null if not logged in
 */
export function getStoredAuth(): {
  token: string;
  refreshToken: string;
  user: UserData;
} | null {
  try {
    // Try session storage first
    let token = secureSessionStorage.getItem(AUTH_PERSISTENCE_KEY);
    let refreshToken = secureSessionStorage.getItem(REFRESH_PERSISTENCE_KEY);
    let userData = secureSessionStorage.getItem(USER_PERSISTENCE_KEY);
    
    // If not in session storage, try local storage
    if (!token || !refreshToken || !userData) {
      token = secureLocalStorage.getItem(AUTH_PERSISTENCE_KEY);
      refreshToken = secureLocalStorage.getItem(REFRESH_PERSISTENCE_KEY);
      userData = secureLocalStorage.getItem(USER_PERSISTENCE_KEY);
    }
    
    // Return null if any required item is missing
    if (!token || !refreshToken || !userData) {
      return null;
    }
    
    // Parse user data
    const user = JSON.parse(userData) as UserData;
    
    // Return authenticated data
    return { token, refreshToken, user };
  } catch (error) {
    logError(error, { context: 'auth.getStoredAuth' });
    return null;
  }
}

/**
 * Clear stored authentication data (logout)
 */
export function clearAuth(): void {
  try {
    // Remove from both storages to ensure complete logout
    secureSessionStorage.removeItem(AUTH_PERSISTENCE_KEY);
    secureSessionStorage.removeItem(REFRESH_PERSISTENCE_KEY);
    secureSessionStorage.removeItem(USER_PERSISTENCE_KEY);
    
    secureLocalStorage.removeItem(AUTH_PERSISTENCE_KEY);
    secureLocalStorage.removeItem(REFRESH_PERSISTENCE_KEY);
    secureLocalStorage.removeItem(USER_PERSISTENCE_KEY);
  } catch (error) {
    logError(error, { context: 'auth.clearAuth' });
    // Don't throw here to ensure logout completes even with errors
  }
}

/**
 * Check if user is authenticated
 * @returns True if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getStoredAuth() !== null;
}

/**
 * Get current authenticated user
 * @returns User data or null if not logged in
 */
export function getCurrentUser(): UserData | null {
  const authData = getStoredAuth();
  return authData ? authData.user : null;
}

/**
 * Check if token needs refresh
 * @param token JWT token
 * @returns True if token needs refresh
 */
export async function needsTokenRefresh(token: string): Promise<boolean> {
  try {
    // Decode token (without verification)
    const decoded = jose.decodeJwt(token);
    
    // Check if token is close to expiry
    const expiryBuffer = 5 * 60; // 5 minutes buffer
    const now = Math.floor(Date.now() / 1000);
    
    return !decoded.exp || decoded.exp < now + expiryBuffer;
  } catch (error) {
    // If decoding fails, assume token needs refresh
    logError(error, { context: 'auth.needsTokenRefresh' });
    return true;
  }
}

/**
 * Check if user has required role
 * @param requiredRole Required role
 * @param user User to check (defaults to current user)
 * @returns True if user has required role
 */
export function hasRole(requiredRole: string, user?: UserData): boolean {
  // Get user to check
  const userToCheck = user || getCurrentUser();
  
  // Not authenticated
  if (!userToCheck) {
    return false;
  }
  
  // Admin role has access to everything
  if (userToCheck.role === 'admin') {
    return true;
  }
  
  // Check if user has required role
  return userToCheck.role === requiredRole;
}

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  storeAuth,
  getStoredAuth,
  clearAuth,
  isAuthenticated,
  getCurrentUser,
  needsTokenRefresh,
  hasRole
};