import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();

// Note: Authentication is handled by requireAuth middleware in server.js
// req.user is already available from the parent route middleware

// Generate API key with proper format
const generateApiKey = () => {
  const prefix = 'ak'; // AccessKey
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(16).toString('hex');
  return `${prefix}_${timestamp}_${random}`;
};

// Generate key ID (public identifier)
const generateKeyId = () => {
  return `key_${crypto.randomBytes(8).toString('hex')}`;
};

// GET /api/user/api-keys - List user's API keys
router.get('/api-keys', async (req, res) => {
  try {
    console.log('API Keys GET - req.user:', req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const userApiKeys = await prisma.apiKey.findMany({
      where: {
        userId: req.user.id
      },
      select: {
        id: true,
        name: true,
        keyId: true,
        lastUsed: true,
        usageCount: true,
        rateLimit: true,
        isActive: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(userApiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Failed to fetch API keys' });
  } finally {
    await prisma.$disconnect();
  }
});

// POST /api/user/api-keys - Create new API key
router.post('/api-keys', async (req, res) => {
  try {
    console.log('API Keys POST - req.user:', req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'API key name is required' });
    }

    // Check if user already has max API keys (limit to 10 per user)
    const existingKeysCount = await prisma.apiKey.count({
      where: {
        userId: req.user.id
      }
    });

    if (existingKeysCount >= 10) {
      return res.status(400).json({ message: 'Maximum number of API keys reached (10)' });
    }

    // Generate API key and hash it
    const apiKey = generateApiKey();
    const keyId = generateKeyId();
    const keyHash = await bcrypt.hash(apiKey, 10);

    // Store in database
    const newApiKey = await prisma.apiKey.create({
      data: {
        userId: req.user.id,
        name: name.trim(),
        keyId,
        keyHash,
        usageCount: 0,
        rateLimit: 1000, // Default 1000 requests per hour
        isActive: true
      },
      select: {
        id: true,
        name: true,
        keyId: true,
        lastUsed: true,
        usageCount: true,
        rateLimit: true,
        isActive: true,
        createdAt: true
      }
    });

    // Return the key info and the actual API key (only time it's returned)
    res.status(201).json({
      keyInfo: newApiKey,
      apiKey // This is the actual key that user needs to save
    });

  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ message: 'Failed to create API key' });
  } finally {
    await prisma.$disconnect();
  }
});

// DELETE /api/user/api-keys/:keyId - Delete API key
router.delete('/api-keys/:keyId', async (req, res) => {
  try {
    // Debug logging
    console.log('API Keys DELETE - req.user:', req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { keyId } = req.params;

    // Delete the API key (only if it belongs to the user)
    const result = await prisma.apiKey.deleteMany({
      where: {
        keyId: keyId,
        userId: req.user.id
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ message: 'API key not found' });
    }

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Failed to delete API key' });
  } finally {
    await prisma.$disconnect();
  }
});

// Middleware to authenticate API key for public endpoints
const authenticateApiKey = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please provide API key in Authorization header as Bearer token'
      });
    }

    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Find API key in database by comparing hash
    const allApiKeys = await prisma.apiKey.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        keyHash: true,
        userId: true,
        isActive: true,
        rateLimit: true,
        usageCount: true
      }
    });

    let matchedKey = null;
    
    // Check each key's hash
    for (const key of allApiKeys) {
      const isValid = await bcrypt.compare(apiKey, key.keyHash);
      if (isValid) {
        matchedKey = key;
        break;
      }
    }

    if (!matchedKey) {
      return res.status(401).json({ 
        error: 'Invalid API key',
        message: 'The provided API key is invalid or has been deactivated'
      });
    }

    // Simple rate limiting check (you might want to use Redis for production)
    // For now, just check if usage in last hour exceeds limit
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentUsage = await prisma.apiUsage.count({
      where: {
        apiKeyId: matchedKey.id,
        createdAt: {
          gte: oneHourAgo
        }
      }
    });

    req.apiKey = matchedKey;
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication error',
      message: 'Failed to authenticate API key'
    });
  }
};

// Track API usage
const trackApiUsage = async (apiKeyId, endpoint, statusCode, responseTime, userAgent, ipAddress) => {
  try {
    await prisma.apiUsage.create({
      data: {
        apiKeyId,
        endpoint,
        statusCode,
        responseTime,
        userAgent,
        ipAddress
      }
    });

    // Update usage count
    await prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { 
        usageCount: { increment: 1 },
        lastUsed: new Date()
      }
    });
  } catch (error) {
    console.error('Error tracking API usage:', error);
  } finally {
    await prisma.$disconnect();
  }
};

export default router;
export { authenticateApiKey, trackApiUsage };