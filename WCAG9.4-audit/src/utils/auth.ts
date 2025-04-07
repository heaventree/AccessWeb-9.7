import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, UserRole, RegisterParams, LoginResponse } from '../types/auth';

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'wcag-audit-secret-key';

// Token storage key
const TOKEN_KEY = 'wcag_auth_token';

// In-memory user store (replace with API calls to your backend)
let users: User[] = [];

// For development purposes, we'll initialize with a test admin user
if (process.env.NODE_ENV === 'development') {
  users.push({
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  });
}

// In-memory user passwords (in a real app, these would be stored in a database)
const userPasswords: Record<string, string> = {
  '1': bcrypt.hashSync('admin123', 10)
};

/**
 * Get the authentication token from localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Save the authentication token to localStorage
 */
export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove the authentication token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Register a new user
 */
export const register = async (params: RegisterParams): Promise<{ verificationToken: string }> => {
  // Check if email already exists
  const existingUser = users.find(u => u.email === params.email);
  if (existingUser) {
    throw new Error('email-already-exists');
  }

  // Validate password strength
  if (params.password.length < 8) {
    throw new Error('password-too-weak');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(params.password, 10);

  // Create new user with a unique ID
  const userId = uuidv4();
  const newUser: User = {
    id: userId,
    name: params.name,
    email: params.email,
    role: UserRole.USER,
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
  };
  
  // Store the password hash
  userPasswords[userId] = hashedPassword;

  // Add user to in-memory store
  users.push(newUser);

  // Generate verification token
  const verificationToken = jwt.sign(
    { userId: newUser.id, purpose: 'email-verification' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return { verificationToken };
};

/**
 * Verify a user's email address
 */
export const verifyEmail = async (token: string): Promise<void> => {
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; purpose: string };
    
    if (decoded.purpose !== 'email-verification') {
      throw new Error('verification-failed');
    }
    
    // Find user
    const userIndex = users.findIndex(u => u.id === decoded.userId);
    if (userIndex === -1) {
      throw new Error('user-not-found');
    }
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      isEmailVerified: true
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('token-expired');
    }
    throw error;
  }
};

/**
 * Login a user
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    throw new Error('invalid-credentials');
  }

  // Check if password is valid
  const storedHash = userPasswords[user.id];
  if (!storedHash || !(await bcrypt.compare(password, storedHash))) {
    throw new Error('invalid-credentials');
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user, token };
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  removeToken();
};

/**
 * Get the current user from the JWT token
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = getToken();
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: UserRole };
    const user = users.find(u => u.id === decoded.userId);
    
    return user || null;
  } catch (error) {
    // Token is invalid
    removeToken();
    return null;
  }
};

/**
 * Create a password reset token
 */
export const createPasswordResetToken = async (email: string): Promise<void> => {
  // Find user
  const user = users.find(u => u.email === email);
  if (!user) {
    // For security reasons, don't reveal if user exists
    return;
  }

  // Generate reset token
  const resetToken = jwt.sign(
    { userId: user.id, purpose: 'password-reset' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  // In a real app, we would send this token to the user's email
  console.log(`Password reset token for ${email}: ${resetToken}`);
};

/**
 * Reset a user's password
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; purpose: string };
    
    if (decoded.purpose !== 'password-reset') {
      throw new Error('verification-failed');
    }
    
    // Find user
    const userIndex = users.findIndex(u => u.id === decoded.userId);
    if (userIndex === -1) {
      throw new Error('user-not-found');
    }
    
    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('password-too-weak');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password in storage
    userPasswords[decoded.userId] = hashedPassword;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('token-expired');
    }
    throw error;
  }
};