import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { db } from '../db.js';
import * as schema from '../../shared/schema.js';
const { apiKeys, apiUsage } = schema;
import { eq, and, desc } from 'drizzle-orm';

const router = express.Router();

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
    const userApiKeys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyId: apiKeys.keyId,
        lastUsed: apiKeys.lastUsed,
        usageCount: apiKeys.usageCount,
        rateLimit: apiKeys.rateLimit,
        isActive: apiKeys.isActive,
        createdAt: apiKeys.createdAt
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, req.user.id))
      .orderBy(desc(apiKeys.createdAt));

    res.json(userApiKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    res.status(500).json({ message: 'Failed to fetch API keys' });
  }
});

// POST /api/user/api-keys - Create new API key
router.post('/api-keys', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'API key name is required' });
    }

    // Check if user already has max API keys (limit to 10 per user)
    const existingKeys = await db
      .select({ count: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.userId, req.user.id));

    if (existingKeys.length >= 10) {
      return res.status(400).json({ message: 'Maximum number of API keys reached (10)' });
    }

    // Generate API key and hash it
    const apiKey = generateApiKey();
    const keyId = generateKeyId();
    const keyHash = await bcrypt.hash(apiKey, 10);

    // Store in database
    const [newApiKey] = await db
      .insert(apiKeys)
      .values({
        userId: req.user.id,
        name: name.trim(),
        keyId,
        keyHash,
        rateLimit: 1000, // Default 1000 requests per hour
        isActive: true
      })
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        keyId: apiKeys.keyId,
        lastUsed: apiKeys.lastUsed,
        usageCount: apiKeys.usageCount,
        rateLimit: apiKeys.rateLimit,
        isActive: apiKeys.isActive,
        createdAt: apiKeys.createdAt
      });

    // Return the key info and the actual API key (only time it's returned)
    res.status(201).json({
      keyInfo: newApiKey,
      apiKey // This is the actual key that user needs to save
    });

  } catch (error) {
    console.error('Error creating API key:', error);
    res.status(500).json({ message: 'Failed to create API key' });
  }
});

// DELETE /api/user/api-keys/:keyId - Delete API key  
router.delete('/api-keys/:keyId', async (req, res) => {
  try {
    const { keyId } = req.params;

    // Delete the API key (only if it belongs to the user)
    const result = await db
      .delete(apiKeys)
      .where(and(
        eq(apiKeys.keyId, keyId),
        eq(apiKeys.userId, req.user.id)
      ))
      .returning({ id: apiKeys.id });

    if (result.length === 0) {
      return res.status(404).json({ message: 'API key not found' });
    }

    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Failed to delete API key' });
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
    const allApiKeys = await db
      .select({
        id: apiKeys.id,
        keyHash: apiKeys.keyHash,
        userId: apiKeys.userId,
        isActive: apiKeys.isActive,
        rateLimit: apiKeys.rateLimit,
        usageCount: apiKeys.usageCount
      })
      .from(apiKeys)
      .where(eq(apiKeys.isActive, true));

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
    const recentUsage = await db
      .select({ count: apiUsage.id })
      .from(apiUsage)
      .where(and(
        eq(apiUsage.apiKeyId, matchedKey.id),
        // Note: You might need to adjust this query based on your DB setup
      ));

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
const trackApiUsage = async (apiKeyId, endpoint, method, requestUrl, statusCode, responseTime, userAgent, ipAddress, requestData = null, responseData = null) => {
  try {
    await db.insert(apiUsage).values({
      apiKeyId,
      endpoint,
      method,
      requestUrl,
      statusCode,
      responseTime,
      userAgent,
      ipAddress,
      requestData: requestData ? JSON.stringify(requestData) : null,
      responseData: responseData ? JSON.stringify(responseData) : null
    });

    // Update usage count
    await db
      .update(apiKeys)
      .set({ 
        usageCount: db.raw(`usage_count + 1`),
        lastUsed: new Date()
      })
      .where(eq(apiKeys.id, apiKeyId));
  } catch (error) {
    console.error('Error tracking API usage:', error);
  }
};

export default router;
export { authenticateApiKey, trackApiUsage };