/**
 * Authentication API Service
 * 
 * Provides specialized API methods for authentication-related operations.
 * Uses the base API service for secure HTTP requests.
 */

import api from './api';
import { validateData } from '../utils/validation';
import { z } from 'zod';

// Type definitions for API responses
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface RegistrationResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface TokenRefreshResponse {
  token: string;
  refreshToken: string;
  expiresAt: number;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  profile?: {
    avatar?: string;
    bio?: string;
    company?: string;
    website?: string;
    location?: string;
  };
}

// Input validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional(),
});

const registrationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

/**
 * Auth API methods
 */
const authApi = {
  /**
   * Log in a user
   */
  async login(data: z.infer<typeof loginSchema>): Promise<LoginResponse> {
    // Validate input data
    const validatedData = validateData(loginSchema, data);
    
    // Make API request
    return api.post<LoginResponse>('/auth/login', validatedData);
  },
  
  /**
   * Register a new user
   */
  async register(data: z.infer<typeof registrationSchema>): Promise<RegistrationResponse> {
    // Validate input data
    const validatedData = validateData(registrationSchema, data);
    
    // Make API request
    return api.post<RegistrationResponse>('/auth/register', validatedData);
  },
  
  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    return api.post<TokenRefreshResponse>('/auth/refresh', { refreshToken });
  },
  
  /**
   * Log out a user
   */
  async logout(): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>('/auth/logout', {});
  },
  
  /**
   * Send a password reset email
   */
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const validatedData = validateData(forgotPasswordSchema, { email });
    
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', validatedData);
  },
  
  /**
   * Reset password with token
   */
  async resetPassword(data: z.infer<typeof resetPasswordSchema>): Promise<ResetPasswordResponse> {
    const validatedData = validateData(resetPasswordSchema, data);
    
    return api.post<ResetPasswordResponse>('/auth/reset-password', validatedData);
  },
  
  /**
   * Change user password
   */
  async changePassword(data: z.infer<typeof changePasswordSchema>): Promise<ChangePasswordResponse> {
    const validatedData = validateData(changePasswordSchema, data);
    
    return api.post<ChangePasswordResponse>('/auth/change-password', validatedData);
  },
  
  /**
   * Get current user profile
   */
  async getProfile(): Promise<UserProfileResponse> {
    return api.get<UserProfileResponse>('/auth/profile');
  },
  
  /**
   * Verify if user is authenticated
   */
  async verifyAuth(): Promise<{ authenticated: boolean; user?: UserProfileResponse }> {
    try {
      const user = await this.getProfile();
      return { authenticated: true, user };
    } catch (error) {
      return { authenticated: false };
    }
  }
};

export default authApi;