import { v4 as uuidv4 } from 'uuid';
import * as jose from 'jose';
import { 
  User, 
  LoginResponse, 
  RegistrationData, 
  RegistrationResponse, 
  UserRole 
} from '../types/auth';
import { IS_DEVELOPMENT_MODE, requireEnvVariable } from './environment';

// JWT configuration
const TOKEN_EXPIRY_HOURS = 24;

// Load JWT secret from environment variables
const JWT_SECRET = requireEnvVariable('JWT_SECRET', 'dev-only-wcag-audit-tool-secret-key-for-testing');

// Secret key in Uint8Array format for jose
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

// For key rotation, store current and previous keys
interface JWTKey {
  id: string;
  key: Uint8Array;
  createdAt: Date;
}

// Initialize JWT keys array with current key
const JWT_KEYS: JWTKey[] = [
  {
    id: 'current',
    key: SECRET_KEY,
    createdAt: new Date()
  }
];

// If previous key exists, add it for verification of existing tokens
const PREVIOUS_JWT_SECRET = process.env.PREVIOUS_JWT_SECRET;
if (PREVIOUS_JWT_SECRET) {
  JWT_KEYS.push({
    id: 'previous',
    key: new TextEncoder().encode(PREVIOUS_JWT_SECRET),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  });
}

/**
 * Generate a secure JWT token for the user using jose (browser-compatible)
 * @param user The user data to encode in the token
 * @returns A JWT token string
 */
export const generateToken = async (user: Partial<User>): Promise<string> => {
  // Create a payload with user data and claims
  const payload = {
    sub: user.id, // Subject (user ID)
    email: user.email,
    role: user.role,
    name: user.name,
    organization: user.organization
  };
  
  // Set expiration to current time + TOKEN_EXPIRY_HOURS
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + TOKEN_EXPIRY_HOURS);
  
  // Create and sign JWT token
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('wcag-audit-tool')
    .setAudience('wcag-audit-users')
    .setExpirationTime(expirationTime)
    .setNotBefore(new Date()) // Valid from now
    .sign(SECRET_KEY);
};

/**
 * Validates a JWT token and extracts the user data
 * @param token The token to validate
 * @returns User data if valid, null if invalid
 */
export const validateToken = async (
  token: string
): Promise<{ id: string; email: string; role: UserRole; name?: string; organization?: string } | null> => {
  try {
    // Add token format validation before verification
    if (!token || typeof token !== 'string' || !token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)) {
      console.warn('Invalid token format');
      return null;
    }
    
    // Try each key until one works or all fail
    let payload: any = null;
    let keyId: string = '';
    
    for (const jwKey of JWT_KEYS) {
      try {
        const result = await jose.jwtVerify(token, jwKey.key, {
          issuer: 'wcag-audit-tool',
          audience: 'wcag-audit-users',
          clockTolerance: 30 // 30 seconds tolerance for clock skew
        });
        
        payload = result.payload;
        keyId = jwKey.id;
        break;
      } catch (e) {
        // Try next key
        continue;
      }
    }
    
    if (!payload) {
      console.log('Token validation failed with all keys');
      return null;
    }
    
    // Add additional validation checks
    const currentTime = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < currentTime) {
      console.warn('Token expired');
      return null;
    }
    
    if (!payload.sub || typeof payload.sub !== 'string') {
      console.warn('Token missing subject (user ID)');
      return null;
    }
    
    // If token was signed with previous key, we should generate a new token
    // with the current key (implemented in the auth context)
    
    // Return user data
    return {
      id: payload.sub as string,  // Subject contains user ID
      email: payload.email as string,
      role: payload.role as UserRole,
      name: payload.name as string || '',
      organization: payload.organization as string || ''
    };
  } catch (error) {
    // Log the error for debugging
    if (error instanceof jose.errors.JWTExpired) {
      console.log('Token expired');
    } else if (error instanceof jose.errors.JOSEError) {
      console.log('Invalid token');
    } else {
      console.error('Token validation error:', error);
    }
    return null;
  }
};

/**
 * Makes a login API request to authenticate the user
 * @param email User's email
 * @param password User's password
 * @returns LoginResponse with token and user information
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    // This would typically be an API call to authenticate the user
    // For demonstration purposes, we'll mock the response
    
    // In development mode, always succeed with a mock user
    if (IS_DEVELOPMENT_MODE) {
      console.log('🔓 Running in DEVELOPMENT MODE - Authentication is disabled');
      
      const mockUser: User = {
        id: uuidv4(),
        name: 'Development User',
        email: email,
        role: 'user',
        organization: 'WCAG Compliance Team'
      };
      
      const token = await generateToken(mockUser);
      
      return {
        success: true,
        token,
        user: mockUser
      };
    }
    
    // In production this would verify credentials against a database
    return {
      success: false,
      error: {
        code: 'auth/not-implemented',
        message: 'Authentication not implemented in this environment'
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: {
        code: 'auth/server-error',
        message: 'An error occurred during authentication'
      }
    };
  }
};

/**
 * Registers a new user
 * @param data User registration data
 * @returns Registration response
 */
export const registerUser = async (
  data: RegistrationData
): Promise<RegistrationResponse> => {
  try {
    // Validate password strength
    import('./passwordPolicy').then(({ enforcePasswordPolicy }) => {
      // Enforce password policy
      try {
        enforcePasswordPolicy(data.password);
      } catch (policyError: any) {
        throw {
          code: 'auth/weak-password',
          message: policyError.message,
          details: policyError.details
        };
      }
    }).catch(error => {
      console.error('Failed to load password policy:', error);
    });
    
    // This would typically be an API call to register the user
    // For demonstration purposes, we'll mock the response
    
    // In development mode, always succeed with a new user
    if (IS_DEVELOPMENT_MODE) {
      const newUser: User = {
        id: uuidv4(),
        name: data.name,
        email: data.email,
        role: 'user',
        organization: data.organization
      };
      
      const token = await generateToken(newUser);
      
      return {
        success: true,
        token,
        user: newUser
      };
    }
    
    // In production this would create a user in the database
    return {
      success: false,
      error: {
        code: 'auth/not-implemented',
        message: 'Registration not implemented in this environment'
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: {
        code: 'auth/server-error',
        message: 'An error occurred during registration'
      }
    };
  }
};

/**
 * Verifies a user's email using a verification token
 * @param token Email verification token
 * @returns True if verification successful
 */
export const verifyEmail = async (token: string): Promise<boolean> => {
  // This would typically be an API call to verify the email
  // For demonstration purposes, we'll mock the response
  return IS_DEVELOPMENT_MODE;
};

/**
 * Requests a password reset for the given email
 * @param email User's email address
 * @returns True if reset token was created and email sent
 */
export const createPasswordResetToken = async (email: string): Promise<boolean> => {
  // This would typically be an API call to create a reset token
  // For demonstration purposes, we'll mock the response
  return IS_DEVELOPMENT_MODE;
};

/**
 * Resets a user's password using a reset token
 * @param token Password reset token
 * @param newPassword New password
 * @returns True if password reset successful
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<boolean> => {
  // This would typically be an API call to reset the password
  // For demonstration purposes, we'll mock the response
  return IS_DEVELOPMENT_MODE;
};

/**
 * Updates a user's profile information
 * @param data Partial user data to update
 * @returns True if update successful
 */
export const updateUserProfile = async (data: Partial<User>): Promise<boolean> => {
  // This would typically be an API call to update the profile
  // For demonstration purposes, we'll mock the response
  return IS_DEVELOPMENT_MODE;
};

/**
 * Updates a user's password
 * @param currentPassword Current password for verification
 * @param newPassword New password
 * @returns True if password update successful
 */
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  // This would typically be an API call to update the password
  // For demonstration purposes, we'll mock the response
  return IS_DEVELOPMENT_MODE;
};