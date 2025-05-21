import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'access_web_v97_super_secret_jwt_key';

export interface UserData {
  id: number;
  email: string;
  name?: string | null;
  profileImageUrl?: string | null;
  isAdmin: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateToken(user: UserData): string {
  const payload = {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserData | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserData;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function registerUser(email: string, password: string, name?: string): Promise<UserData | null> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return null;
    }

    // Hash the password and create user
    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    });

    // Return user data without the password
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      profileImageUrl: newUser.profileImageUrl,
      isAdmin: newUser.isAdmin
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}

export async function loginUser(email: string, password: string): Promise<{ user: UserData; token: string } | null> {
  try {
    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return null;
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Create user data without password
    const userData: UserData = {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      isAdmin: user.isAdmin
    };

    // Generate JWT token
    const token = generateToken(userData);

    return { user: userData, token };
  } catch (error) {
    console.error("Error logging in user:", error);
    return null;
  }
}

export async function getUserFromToken(token: string): Promise<UserData | null> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return null;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      profileImageUrl: user.profileImageUrl,
      isAdmin: user.isAdmin
    };
  } catch (error) {
    console.error("Error fetching user from token:", error);
    return null;
  }
}