import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const router = Router();

// Configure email transporter for 2FA codes
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

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

    // Create user with free plan as default
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        subscriptionPlan: 'free',
        subscriptionStatus: 'active'
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
    console.log('Login request received:', { email: req.body.email, password: '********' });
    console.log('Environment:', process.env.NODE_ENV || 'development');
    console.log('JWT_SECRET available:', !!process.env.JWT_SECRET);
    console.log('DATABASE_URL available:', !!process.env.DATABASE_URL);

    // Handle both request formats for compatibility
    const email = req.body && (req.body.email || req.body.username);
    const password = req.body && req.body.password;

    // Check if this is an admin login attempt by:
    // 1. Checking if isAdminLogin is explicitly true in the options
    // 2. Or as a fallback, checking if the request is coming from an admin URL
    const isAdminLoginAttempt = 
      (req.body && req.body.isAdminLogin === true) ||
      (req.headers.referer && req.headers.referer.includes('/admin/login'));

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

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      throw new Error('Database connection failed');
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

    // If trying to login as regular user but user is admin, redirect to admin login
    if (!isAdminLoginAttempt && user.isAdmin) {
      console.log("Admin user trying to access regular login:", email);
      return res.status(200).json({ 
        success: true,
        isAdminRedirect: true,
        message: 'Please use the admin login page',
        redirectUrl: '/admin/login'
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

    // Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      // Generate and store 2FA code
      const code = crypto.randomInt(100000, 999999).toString();
      const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorCode: code,
          twoFactorCodeExpiry: expiry
        }
      });
      
      // Send the code via email
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: user.email,
        subject: 'Your Verification Code',
        html: `
          <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
            <h2 style="color: #0fae96;">Verification Code</h2>
            <p>Hello ${user.name || user.email},</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #0fae96; letter-spacing: 8px;">${code}</span>
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        
        // Create security log entry
        await prisma.securityLog.create({
          data: {
            userId: user.id,
            eventType: '2fa_login_attempt',
            description: 'Two-factor authentication required for login',
            ipAddress: req.ip,
            userAgent: req.get('User-Agent') || '',
            metadata: { email: user.email }
          }
        });

        return res.json({
          success: false,
          requiresTwoFactor: true,
          userId: user.id,
          message: 'Please check your email for the verification code',
          email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3') // Mask email for security
        });
      } catch (emailError) {
        console.error('Failed to send 2FA email:', emailError);
        return res.status(500).json({ error: 'Failed to send verification code' });
      }
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
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    // More specific error messages for debugging
    let errorMessage = 'Internal server error';
    if (error.message.includes('Database connection failed')) {
      errorMessage = 'Database connection error';
    } else if (error.message.includes('JWT')) {
      errorMessage = 'Authentication configuration error';
    } else if (error.code === 'P2002') {
      errorMessage = 'Database constraint error';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Get token from Authorization header or cookies
    let token = req.cookies.accessToken;

    // If no cookie token, check Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log('Decoded JWT:', decoded);

    // Get user
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.userId } 
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without password, with proper role and admin status
    const { password, ...userWithoutPassword } = user;
    const userResponse = {
      ...userWithoutPassword,
      role: user.isAdmin ? 'admin' : 'subscriber',
      isAdmin: !!user.isAdmin
    };

    return res.json({ user: userResponse });
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

// Verify 2FA code for login
router.post('/verify-2fa', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ 
        success: false,
        error: { message: 'User ID and verification code are required' }
      });
    }

    const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Verify the code
    const now = new Date();
    const isValid = user.twoFactorCode === code && 
                   user.twoFactorCodeExpiry && 
                   user.twoFactorCodeExpiry > now;
    
    if (!isValid) {
      // Create security log for failed verification
      await prisma.securityLog.create({
        data: {
          userId: user.id,
          eventType: '2fa_verification_failed',
          description: 'Two-factor authentication verification failed during login',
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || '',
          metadata: { providedCode: code }
        }
      });

      return res.status(400).json({ 
        success: false,
        error: { message: 'Invalid or expired verification code' }
      });
    }

    // Clear the 2FA code after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorCode: null,
        twoFactorCodeExpiry: null
      }
    });

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
    const { password: _, twoFactorCode: __, twoFactorCodeExpiry: ___, twoFactorSecret: ____, ...userWithoutPassword } = user;

    // Create security log for successful verification
    await prisma.securityLog.create({
      data: {
        userId: user.id,
        eventType: '2fa_login_success',
        description: 'Two-factor authentication login successful',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || ''
      }
    });

    // Return user data with token in the format expected by the frontend
    return res.json({ 
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
      message: 'Two-factor authentication successful' 
    });
  } catch (error) {
    console.error('2FA verification error:', error);
    return res.status(500).json({ 
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Update 2FA settings
router.put('/users/:id/two-factor', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { isTwoFactorEnabled } = req.body;
    
    // Get token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    if (decoded.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Update 2FA settings
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: isTwoFactorEnabled }
    });

    // Create security log entry
    await prisma.securityLog.create({
      data: {
        userId: userId,
        eventType: isTwoFactorEnabled ? '2fa_enabled' : '2fa_disabled',
        description: `Two-factor authentication ${isTwoFactorEnabled ? 'enabled' : 'disabled'}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || '',
        metadata: { isTwoFactorEnabled }
      }
    });

    res.json({
      success: true,
      message: `Two-factor authentication ${isTwoFactorEnabled ? 'enabled' : 'disabled'} successfully`,
      isTwoFactorEnabled: updatedUser.isTwoFactorEnabled
    });
  } catch (error) {
    console.error('Update 2FA settings error:', error);
    res.status(500).json({ error: 'Failed to update two-factor authentication settings' });
  }
});

export default router;