import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      }
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(201).json({ 
      user: userWithoutPassword, 
      message: 'User registered successfully' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    // Add debugging to check what's actually coming in
    console.log("Request headers:", req.headers);
    console.log("Request content-type:", req.headers['content-type']);
    console.log("Raw body:", req.body);
    
    // Handle both request formats for compatibility
    const email = req.body && (req.body.email || req.body.username);
    const password = req.body && req.body.password;
    
    // Check if this is an admin login attempt by:
    // 1. Checking the request URL/referer
    // 2. Or checking the explicit isAdminLogin flag in the request body
    const isAdminLoginAttempt = 
      (req.headers.referer && req.headers.referer.includes('/admin/login')) || 
      (req.body && req.body.isAdminLogin === true);
    
    console.log("Is admin login attempt:", isAdminLoginAttempt);

    // Validate input
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ 
        success: false,
        error: { 
          message: 'Email and password are required',
          code: 'auth/missing-credentials'
        }
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ 
        success: false,
        error: { 
          message: 'Invalid credentials',
          code: 'auth/invalid-credentials'
        }
      });
    }

    console.log("User found:", user.email, "isAdmin:", user.isAdmin);
    
    // If trying to login as admin but user is not admin, reject the login
    if (isAdminLoginAttempt && !user.isAdmin) {
      console.log("Non-admin user trying to access admin login:", email);
      return res.status(401).json({ 
        success: false,
        error: { 
          message: 'You do not have admin privileges',
          code: 'auth/insufficient-permissions'
        }
      });
    }
    
    // If trying to login as regular user but user is admin only, redirect to admin login
    if (!isAdminLoginAttempt && user.isAdmin && !user.canAccessUserFeatures) {
      console.log("Admin-only user trying to access regular login:", email);
      return res.status(401).json({ 
        success: false,
        error: { 
          message: 'Please use the admin login page',
          code: 'auth/use-admin-login',
          redirectToAdmin: true
        }
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ 
        success: false,
        error: { 
          message: 'Invalid credentials',
          code: 'auth/invalid-credentials'
        }
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '30d' }
    );

    // Set cookie
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Define user role and admin status
    const role = user.isAdmin ? 'admin' : 'subscriber';
    
    // Format the user object to match what the frontend expects
    const { password: _, ...userWithoutPassword } = user;
    
    // Return user data with token in the format expected by the frontend
    const response = { 
      success: true,
      token,
      refreshToken,
      expiresIn: 604800, // 7 days in seconds
      user: {
        ...userWithoutPassword,
        role,
        isAdmin: !!user.isAdmin, // Ensure this is a boolean
        subscription: {
          plan: user.isAdmin ? 'enterprise' : 'professional',
          status: 'active',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        }
      },
      message: 'Logged in successfully' 
    };
    
    console.log("Login successful. Response (without tokens):", {
      ...response,
      token: '[REDACTED]',
      refreshToken: '[REDACTED]'
    });
    
    return res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Get token from cookies
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Get user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId } 
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(401).json({ error: 'Not authenticated' });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  // Clear cookie
  res.clearCookie('accessToken');
  return res.json({ message: 'Logged out successfully' });
});

export default router;