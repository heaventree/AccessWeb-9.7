/**
 * Authentication API Service
 * 
 * Provides centralized, secure authentication API endpoints with
 * specialized handling for auth-related operations.
 */

import { apiClient } from '../utils/api/apiClient';
import { AccountLockoutManager } from '../utils/security/passwordPolicy';
import { ErrorType, createError } from '../utils/errorHandler';

// Auth API endpoints
const AUTH_ENDPOINTS = {
  LOGIN: 'auth/login',
  REGISTER: 'auth/register',
  LOGOUT: 'auth/logout',
  REFRESH_TOKEN: 'auth/refresh',
  VERIFY_EMAIL: 'auth/verify',
  FORGOT_PASSWORD: 'auth/forgot-password',
  RESET_PASSWORD: 'auth/reset-password',
  CHANGE_PASSWORD: 'auth/change-password',
  GET_PROFILE: 'auth/profile',
  UPDATE_PROFILE: 'auth/profile'
};

// Login response interface
export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isAdmin?: boolean; // Flag to determine admin access
  };
}

// Registration response interface
export interface RegistrationResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
  };
}

/**
 * Login options interface
 */
interface LoginOptions {
  isAdminLogin?: boolean;
}

/**
 * Login user with email and password
 * @param email User email
 * @param password User password
 * @param options Login options including isAdminLogin flag
 * @returns Login response
 */
export async function login(
  email: string, 
  password: string, 
  options: LoginOptions = { isAdminLogin: false }
): Promise<LoginResponse> {
  try {
    // Check if account is locked
    if (AccountLockoutManager.isAccountLocked(email)) {
      const timeRemaining = AccountLockoutManager.getLockoutTimeRemaining(email);
      throw createError(
        `Account is temporarily locked. Please try again in ${Math.ceil(timeRemaining / 60)} minutes`,
        ErrorType.AUTHENTICATION,
        { code: 'account_locked', timeRemaining }
      );
    }
    
    // Ensure the isAdminLogin flag is defined
    const isAdminLogin = options.isAdminLogin === true;
    
    // Log the login attempt for debugging
    console.log('Attempting login with:', { email, password: '********', isAdminLogin });
    
    // Make login request directly to the API
    // Send the isAdminLogin flag in the request body for clarity
    const directResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email, 
        password,
        isAdminLogin // Add this to the request body with the explicit value
      }),
      credentials: 'include'
    });
    
    console.log('Direct fetch response:', directResponse.status);
    
    if (!directResponse.ok) {
      const errorText = await directResponse.text();
      console.error('Login API error:', errorText);
      throw new Error(`Login failed: ${directResponse.status} ${errorText}`);
    }
    
    const responseData = await directResponse.json();
    
    // Reset any failed attempts
    AccountLockoutManager.resetLockout(email);
    
    return responseData;
  } catch (error) {
    // Record failed attempt
    console.error('Login error:', error);
    
    if (
      error instanceof Error &&
      (error as any).type === ErrorType.AUTHENTICATION
    ) {
      AccountLockoutManager.recordFailedAttempt(email);
    }
    
    throw error;
  }
}

/**
 * Register a new user
 * @param userData User registration data
 * @returns Registration response
 */
export async function register(userData: {
  email: string;
  password: string;
  name: string;
}): Promise<RegistrationResponse> {
  return apiClient.post<RegistrationResponse>(AUTH_ENDPOINTS.REGISTER, userData);
}

/**
 * Logout the current user
 * @returns Success status
 */
export async function logout(): Promise<boolean> {
  try {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
}

/**
 * Refresh the authentication token
 * @param refreshToken Current refresh token
 * @returns New tokens
 */
export async function refreshToken(refreshToken: string): Promise<{
  token: string;
  refreshToken: string;
  expiresIn: number;
}> {
  return apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
}

/**
 * Verify email address
 * @param token Verification token
 * @returns Success status
 */
export async function verifyEmail(token: string): Promise<{
  success: boolean;
  message: string;
}> {
  return apiClient.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { token });
}

/**
 * Request password reset
 * @param email User email
 * @returns Success status
 */
export async function forgotPassword(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  return apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, { email });
}

/**
 * Reset password with token
 * @param token Reset token
 * @param newPassword New password
 * @returns Success status
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{
  success: boolean;
  message: string;
}> {
  return apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
    token,
    newPassword
  });
}

/**
 * Change password (authenticated)
 * @param currentPassword Current password
 * @param newPassword New password
 * @returns Success status
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{
  success: boolean;
  message: string;
}> {
  return apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
    currentPassword,
    newPassword
  });
}

/**
 * Get current user's profile
 * @returns User profile
 */
export async function getProfile(): Promise<any> {
  return apiClient.get(AUTH_ENDPOINTS.GET_PROFILE);
}

/**
 * Update user profile
 * @param profileData Profile data
 * @returns Updated profile
 */
export async function updateProfile(profileData: Record<string, any>): Promise<any> {
  return apiClient.put(AUTH_ENDPOINTS.UPDATE_PROFILE, profileData);
}

export default {
  login,
  register,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile
};