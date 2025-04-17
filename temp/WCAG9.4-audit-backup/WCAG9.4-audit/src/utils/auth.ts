import { User, EmailVerification } from '../types/auth';

// Simulated database tables
let users: User[] = [];
let verifications: EmailVerification[] = [];

export const generateVerificationToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const createVerificationEntry = (userId: string) => {
  const token = generateVerificationToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

  const verification: EmailVerification = {
    userId,
    token,
    expiresAt,
    isVerified: false
  };

  verifications.push(verification);
  return token;
};

export const verifyEmail = (token: string) => {
  const verification = verifications.find(v => v.token === token);
  if (!verification) {
    throw new Error('Invalid verification token');
  }

  if (verification.expiresAt < new Date()) {
    throw new Error('Verification token has expired');
  }

  if (verification.isVerified) {
    throw new Error('Email already verified');
  }

  // Update verification status
  verification.isVerified = true;

  // Update user's email verification status
  const user = users.find(u => u.id === verification.userId);
  if (user) {
    user.isEmailVerified = true;
  }

  return true;
};

export const sendVerificationEmail = async (email: string, token: string) => {
  // TODO: Implement actual email sending logic
  console.log('Verification email would be sent to:', email);
  console.log('Verification token:', token);
  console.log('Verification link would be:', `https://yourdomain.com/verify-email/${token}`);
};