interface EmailVerification {
  userId: string;
  token: string;
  expiresAt: Date;
  isVerified: boolean;
}

interface User {
  id: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type { EmailVerification, User };