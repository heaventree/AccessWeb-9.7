import express from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import siteScannerQueue from '../jobs/siteScanner.js';
import { requireAuth } from '../../middleware/userAuth.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * WordPress Plugin Webhook API
 * Endpoint: /wp-json/wp/v2/accessibility-auth/debug
 * Method: POST
 * 
 * Handles file change notifications from WordPress plugin
 * and triggers accessibility scans based on the status
 */
router.post('/wp-json/wp/v2/accessibility-auth/debug', async (req, res) => {
  try {
    const {
      token,
      domain,
      run_time,
      success,
      message,
      status,
      ignore_list,
      count,
      modified_at
    } = req.body;

    console.log(`🔌 [WP-PLUGIN] Received webhook from domain: ${domain}, status: ${status}`);

    // Validate required fields
    if (!token || !domain || !status) {
      return res.status(400).json({
        error: 'Missing required fields: token, domain, status'
      });
    }

    // Find the site connection using the token
    const tokenRecord = await prisma.wpPluginToken.findUnique({
      where: { token },
      include: {
        siteConnection: {
          include: {
            user: true
          }
        }
      }
    });

    if (!tokenRecord || !tokenRecord.isActive) {
      console.log(`❌ [WP-PLUGIN] Invalid or inactive token: ${token}`);
      return res.status(401).json({
        error: 'Invalid or inactive token'
      });
    }

    // Verify domain matches
    if (tokenRecord.domain !== domain) {
      console.log(`❌ [WP-PLUGIN] Domain mismatch. Expected: ${tokenRecord.domain}, Got: ${domain}`);
      return res.status(403).json({
        error: 'Domain mismatch'
      });
    }

    // Update last used timestamp
    await prisma.wpPluginToken.update({
      where: { id: tokenRecord.id },
      data: { lastUsedAt: new Date() }
    });

    const siteConnection = tokenRecord.siteConnection;

    // Handle different status types
    if (status === 'no-update') {
      console.log(`ℹ️ [WP-PLUGIN] No changes detected for ${domain}, ignoring`);
      return res.json({
        success: true,
        message: 'No changes detected, scan not triggered'
      });
    }

    if (status === 'init' || status === 'update') {
      const scanReason = status === 'init' ? 'file_init' : 'file_update';
      
      console.log(`🚀 [WP-PLUGIN] Triggering ${scanReason} scan for ${domain}`);

      // Trigger the accessibility scan using existing scanner logic
      try {
        const scanResult = await siteScannerQueue.performAccessibilityScan(
          siteConnection.id,
          siteConnection.siteUrl,
          siteConnection.platform || 'wordpress',
          scanReason
        );

        console.log(`✅ [WP-PLUGIN] Scan completed for ${domain}, result ID: ${scanResult?.id}`);

        return res.json({
          success: true,
          message: `Accessibility scan triggered successfully for ${scanReason}`,
          scan_id: scanResult?.id,
          scan_reason: scanReason
        });

      } catch (scanError) {
        console.error(`❌ [WP-PLUGIN] Scan failed for ${domain}:`, scanError);
        
        return res.status(500).json({
          success: false,
          error: 'Failed to perform accessibility scan',
          details: scanError.message
        });
      }
    }

    // Unknown status
    console.log(`⚠️ [WP-PLUGIN] Unknown status: ${status} for ${domain}`);
    return res.status(400).json({
      error: `Unknown status: ${status}`
    });

  } catch (error) {
    console.error('❌ [WP-PLUGIN] Webhook processing error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
});

/**
 * Generate WordPress Plugin Token
 * Creates a new token for WordPress plugin integration
 */
router.post('/wp-plugin/generate-token', async (req, res) => {
  try {
    const { site_connection_id, domain } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!site_connection_id || !domain) {
      return res.status(400).json({
        error: 'Missing required fields: site_connection_id, domain'
      });
    }

    // Verify user owns the site connection
    const siteConnection = await prisma.siteConnection.findFirst({
      where: {
        id: parseInt(site_connection_id),
        userId: userId
      }
    });

    if (!siteConnection) {
      return res.status(404).json({
        error: 'Site connection not found or access denied'
      });
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');

    // Create token record
    const tokenRecord = await prisma.wpPluginToken.create({
      data: {
        token,
        siteConnectionId: parseInt(site_connection_id),
        domain
      }
    });

    console.log(`🔑 [WP-PLUGIN] Generated token for site: ${domain}`);

    res.json({
      success: true,
      token: token,
      domain: domain,
      site_connection_id: site_connection_id,
      webhook_url: `${req.protocol}://${req.get('host')}/api/wp-json/wp/v2/accessibility-auth/debug`
    });

  } catch (error) {
    console.error('❌ [WP-PLUGIN] Token generation error:', error);
    res.status(500).json({
      error: 'Failed to generate token',
      details: error.message
    });
  }
});

/**
 * List WordPress Plugin Tokens
 * Get all tokens for the authenticated user
 */
router.get('/wp-plugin/tokens', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const tokens = await prisma.wpPluginToken.findMany({
      where: {
        siteConnection: {
          userId: userId
        }
      },
      include: {
        siteConnection: {
          select: {
            id: true,
            siteName: true,
            siteUrl: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      tokens: tokens.map(token => ({
        id: token.id,
        token: token.token.substring(0, 8) + '...' + token.token.substring(token.token.length - 8), // Masked token
        domain: token.domain,
        site_connection: token.siteConnection,
        created_at: token.createdAt,
        last_used_at: token.lastUsedAt,
        is_active: token.isActive
      }))
    });

  } catch (error) {
    console.error('❌ [WP-PLUGIN] Token list error:', error);
    res.status(500).json({
      error: 'Failed to fetch tokens',
      details: error.message
    });
  }
});

/**
 * Revoke WordPress Plugin Token
 * Deactivate a token
 */
router.delete('/wp-plugin/tokens/:tokenId', async (req, res) => {
  try {
    const userId = req.user?.id;
    const tokenId = parseInt(req.params.tokenId);

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Verify user owns the token
    const tokenRecord = await prisma.wpPluginToken.findFirst({
      where: {
        id: tokenId,
        siteConnection: {
          userId: userId
        }
      }
    });

    if (!tokenRecord) {
      return res.status(404).json({
        error: 'Token not found or access denied'
      });
    }

    // Deactivate token
    await prisma.wpPluginToken.update({
      where: { id: tokenId },
      data: { isActive: false }
    });

    console.log(`🔐 [WP-PLUGIN] Token revoked for domain: ${tokenRecord.domain}`);

    res.json({
      success: true,
      message: 'Token revoked successfully'
    });

  } catch (error) {
    console.error('❌ [WP-PLUGIN] Token revocation error:', error);
    res.status(500).json({
      error: 'Failed to revoke token',
      details: error.message
    });
  }
});

export default router;