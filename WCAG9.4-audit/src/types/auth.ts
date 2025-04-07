export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export type AuthError = 
  | 'invalid-credentials'
  | 'user-not-found'
  | 'email-already-exists'
  | 'password-too-weak'
  | 'network-error'
  | 'server-error'
  | 'verification-failed'
  | 'token-expired';

export interface LoginResponse {
  user: User;
  token: string;
}