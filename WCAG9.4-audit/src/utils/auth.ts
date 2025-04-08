import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { 
  User, 
  LoginResponse, 
  RegistrationData, 
  RegistrationResponse, 
  AuthError, 
  UserRole 
} from '../types/auth';
import { IS_DEVELOPMENT_MODE } from './environment';

// JWT secret key - in production, this would come from an environment variable
const JWT_SECRET = 'wcag94-accessibility-platform-secret-key';
const TOKEN_EXPIRY = '24h';

/**
 * Hashes a password using bcrypt
 * @param password The plain text password
 * @returns The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed password
 * @param password The plain text password
 * @param hashedPassword The hashed password
 * @returns True if the passwords match
 */
export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generates a JWT token for an authenticated user
 * @param user The user data to encode in the token
 * @returns The JWT token string
 */
export const generateToken = (user: Partial<User>): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

/**
 * Validates a JWT token and extracts the user data
 * @param token The JWT token to validate
 * @returns User data if valid, null if invalid
 */
export const validateToken = (
  token: string
): { id: string; email: string; role: UserRole; name?: string; organization?: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role as UserRole,
      name: decoded.name,
      organization: decoded.organization
    };
  } catch (error) {
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
      const mockUser: User = {
        id: uuidv4(),
        name: 'Development User',
        email: email,
        role: 'user',
        organization: 'WCAG Compliance Team'
      };
      
      const token = generateToken(mockUser);
      
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
      
      const token = generateToken(newUser);
      
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