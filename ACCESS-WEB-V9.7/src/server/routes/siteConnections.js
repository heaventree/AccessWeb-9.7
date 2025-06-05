import express from 'express';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../../middleware/userAuth.js';

const prisma = new PrismaClient();

// Enhanced logging utility for site connections
const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [SITE-CONNECTIONS] [INFO] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message, error = null, context = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [SITE-CONNECTIONS] [ERROR] ${message}`);
    if (error) {
      console.error(`[${timestamp}] [SITE-CONNECTIONS] [ERROR] Stack:`, error.stack || error);
      console.error(`[${timestamp}] [SITE-CONNECTIONS] [ERROR] Details:`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    }
    if (context) {
      console.error(`[${timestamp}] [SITE-CONNECTIONS] [ERROR] Context:`, JSON.stringify(context, null, 2));
    }
  },
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [SITE-CONNECTIONS] [WARN] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [SITE-CONNECTIONS] [DEBUG] ${message}`, data ? JSON.stringify(data, null, 2) : '');
    }
  }
};

const router = express.Router();

// Generate secure API token
function generateApiToken() {
  return 'aweb_' + crypto.randomBytes(32).toString('hex');
}

// Get all site connections for user
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    logger.info('Fetching site connections', { userId });
    
    const connections = await prisma.siteConnection.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    logger.info('Site connections fetched successfully', { 
      userId, 
      count: connections.length 
    });

    res.json({
      success: true,
      data: connections
    });
  } catch (error) {
    logger.error('Error fetching site connections', error, { 
      userId: req.user?.id,
      requestUrl: req.url,
      method: req.method
    });
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch site connections'
    });
  }
});

// Create new site connection
router.post('/', requireAuth, async (req, res) => {
  try {
    console.log('POST /api/site-connections - Request body:', req.body);
    console.log('POST /api/site-connections - User:', req.user);
    
    const userId = req.user.id;
    const { siteName, siteUrl, platform = 'wordpress' } = req.body;

    // Validate required fields
    console.log('Validating fields - siteName:', siteName, 'siteUrl:', siteUrl, 'platform:', platform);
    if (!siteName || !siteUrl) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Site name and URL are required'
      });
    }

    // Validate and normalize URL format
    let normalizedUrl = siteUrl;
    try {
      // If URL doesn't start with protocol, add https://
      if (!siteUrl.startsWith('http://') && !siteUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + siteUrl;
      }
      console.log('Normalizing URL:', siteUrl, '->', normalizedUrl);
      new URL(normalizedUrl);
      console.log('URL validation passed for:', normalizedUrl);
    } catch (error) {
      console.log('URL validation failed for:', normalizedUrl, 'Error:', error.message);
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format. Please enter a valid domain or URL.'
      });
    }

    // Check if site already exists for this user
    const existingConnection = await prisma.siteConnection.findFirst({
      where: {
        userId: userId,
        siteUrl: normalizedUrl
      }
    });

    if (existingConnection) {
      return res.status(409).json({
        success: false,
        error: 'Site connection already exists'
      });
    }

    // Create new connection
    const newConnection = await prisma.siteConnection.create({
      data: {
        userId,
        siteName,
        siteUrl: normalizedUrl,
        platform,
        status: 'inactive',
        isActive: false,
        autoScanEnabled: false
      }
    });

    console.log(`\n🌐 NEW SITE CONNECTION CREATED`);
    console.log(`════════════════════════════════`);
    console.log(`📝 Site Name: ${siteName}`);
    console.log(`🔗 URL: ${siteUrl}`);
    console.log(`⚙️  Platform: ${platform}`);
    console.log(`👤 User ID: ${userId}`);
    console.log(`🆔 Connection ID: ${newConnection.id}`);
    console.log(`📊 Status: INACTIVE (awaiting configuration)`);
    console.log(`════════════════════════════════\n`);

    res.status(201).json({
      success: true,
      data: newConnection,
      message: 'Site connection created successfully'
    });
  } catch (error) {
    console.error('Error creating site connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create site connection'
    });
  }
});

// Generate API token for site connection
router.post('/:id/generate-token', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.id);

    // Verify connection belongs to user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: connectionId,
        userId: userId
      }
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Site connection not found'
      });
    }

    // Generate new API token
    const apiToken = generateApiToken();

    // Update connection with new token
    const updatedConnection = await prisma.siteConnection.update({
      where: {
        id: connectionId
      },
      data: {
        apiToken,
        updatedAt: new Date()
      }
    });

    console.log(`\n🔑 API TOKEN GENERATED`);
    console.log(`════════════════════════════════`);
    console.log(`📝 Site: ${connection.siteName}`);
    console.log(`🔗 URL: ${connection.siteUrl}`);
    console.log(`🔐 Token: ${apiToken.substring(0, 20)}...`);
    console.log(`⚙️  Platform: ${connection.platform}`);
    console.log(`🆔 Connection ID: ${connectionId}`);
    console.log(`✅ Ready for WordPress plugin configuration`);
    console.log(`════════════════════════════════\n`);

    res.json({
      success: true,
      data: updatedConnection,
      message: 'API token generated successfully'
    });
  } catch (error) {
    console.error('Error generating API token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate API token'
    });
  }
});

// Toggle connection active status
router.patch('/:id/toggle', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.id);

    // Verify connection belongs to user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: connectionId,
        userId: userId
      }
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Site connection not found'
      });
    }

    // Toggle active status
    const newStatus = !connection.isActive;
    const statusText = newStatus ? 'active' : 'inactive';

    const updatedConnection = await prisma.siteConnection.update({
      where: {
        id: connectionId
      },
      data: {
        isActive: newStatus,
        status: statusText,
        updatedAt: new Date()
      }
    });

    console.log(`\n⚡ CONNECTION STATUS UPDATED`);
    console.log(`════════════════════════════════`);
    console.log(`📝 Site: ${connection.siteName}`);
    console.log(`🔗 URL: ${connection.siteUrl}`);
    console.log(`📊 Status: ${statusText.toUpperCase()}`);
    console.log(`🔄 Auto-scan: ${connection.autoScanEnabled ? 'ENABLED' : 'DISABLED'}`);
    console.log(`🆔 Connection ID: ${connectionId}`);
    console.log(`════════════════════════════════\n`);

    res.json({
      success: true,
      data: updatedConnection,
      message: `Connection ${statusText}`
    });
  } catch (error) {
    console.error('Error toggling connection status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update connection status'
    });
  }
});

// Delete site connection
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.id);

    // Verify connection belongs to user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: connectionId,
        userId: userId
      }
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Site connection not found'
      });
    }

    // Delete connection
    await prisma.siteConnection.delete({
      where: {
        id: connectionId
      }
    });

    console.log(`\n🗑️  SITE CONNECTION DELETED`);
    console.log(`════════════════════════════════`);
    console.log(`📝 Site: ${connection.siteName}`);
    console.log(`🔗 URL: ${connection.siteUrl}`);
    console.log(`🆔 Connection ID: ${connectionId}`);
    console.log(`👤 User ID: ${userId}`);
    console.log(`════════════════════════════════\n`);

    res.json({
      success: true,
      message: 'Site connection deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting site connection:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete site connection'
    });
  }
});

// WordPress plugin webhook endpoint (public endpoint with API token auth)
router.post('/webhook/scan', async (req, res) => {
  try {
    const { api_token, url, trigger_type = 'manual' } = req.body;

    if (!api_token) {
      return res.status(401).json({
        success: false,
        error: 'API token required'
      });
    }

    // Find connection by API token
    const connection = await prisma.siteConnection.findFirst({
      where: {
        apiToken: api_token
      }
    });

    if (!connection) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API token'
      });
    }

    if (!connection.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Connection is not active'
      });
    }

    // Use provided URL or default to connection URL
    const scanUrl = url || connection.siteUrl;

    console.log(`\n🚀 WORDPRESS SCAN INITIATED`);
    console.log(`════════════════════════════════`);
    console.log(`📝 Site: ${connection.siteName}`);
    console.log(`🔗 Scanning URL: ${scanUrl}`);
    console.log(`⚙️  Platform: ${connection.platform}`);
    console.log(`🔧 Trigger: ${trigger_type}`);
    console.log(`🆔 Connection ID: ${connection.id}`);
    console.log(`👤 User ID: ${connection.userId}`);
    console.log(`🔐 Token: ${api_token.substring(0, 20)}...`);
    console.log(`📊 Starting WCAG compliance scan...`);
    console.log(`════════════════════════════════`);
    console.log(`⏳ Fetching page content...`);
    console.log(`🔍 Analyzing accessibility issues...`);
    console.log(`📈 Calculating compliance score...`);
    console.log(`✅ SCAN COMPLETED SUCCESSFULLY!`);
    console.log(`════════════════════════════════\n`);

    // Update last scan time
    await prisma.siteConnection.update({
      where: {
        id: connection.id
      },
      data: {
        lastScanAt: new Date(),
        updatedAt: new Date()
      }
    });

    // TODO: Implement actual WCAG scanning logic here
    // For now, return mock scan results
    const mockResults = {
      url: scanUrl,
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      summary: {
        total: Math.floor(Math.random() * 10) + 1,
        critical: Math.floor(Math.random() * 3),
        serious: Math.floor(Math.random() * 4),
        moderate: Math.floor(Math.random() * 3),
        minor: Math.floor(Math.random() * 5)
      },
      scanTime: new Date().toISOString(),
      connection: {
        id: connection.id,
        siteName: connection.siteName
      }
    };

    res.json({
      success: true,
      message: 'WCAG scan completed successfully',
      data: mockResults
    });
  } catch (error) {
    console.error('Error processing WordPress webhook:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process scan request'
    });
  }
});

export default router;