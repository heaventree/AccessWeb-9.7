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
      run_time,
      success,
      message,
      status,
      ignore_list,
      count,
      modified_at
    } = req.body;

    console.log(`🔌 [WP-PLUGIN] Received webhook with token: ${token?.substring(0, 8)}..., status: ${status}`);

    // Validate required fields
    if (!token || !status) {
      return res.status(400).json({
        error: 'Missing required fields: token, status'
      });
    }

    // Find the site connection using the existing API token
    const siteConnection = await prisma.siteConnection.findFirst({
      where: { 
        apiToken: token,
        status: 'active'
      },
      include: {
        user: true
      }
    });

    if (!siteConnection) {
      console.log(`❌ [WP-PLUGIN] Invalid token or inactive site connection: ${token?.substring(0, 8)}...`);
      return res.status(401).json({
        error: 'Invalid token or inactive site connection'
      });
    }

    console.log(`✅ [WP-PLUGIN] Authenticated for site: ${siteConnection.siteName} (${siteConnection.siteUrl})`);
    const siteDomain = new URL(siteConnection.siteUrl).hostname;

    // Handle different status types
    if (status === 'no-update') {
      console.log(`ℹ️ [WP-PLUGIN] No changes detected for ${siteDomain}, ignoring`);
      return res.json({
        success: true,
        message: 'No changes detected, scan not triggered'
      });
    }

    if (status === 'init' || status === 'update') {
      const scanReason = status === 'init' ? 'file_init' : 'file_update';
      
      console.log(`🚀 [WP-PLUGIN] Triggering ${scanReason} scan for ${siteDomain}`);

      // Trigger the accessibility scan using existing scanner logic
      try {
        const scanResult = await siteScannerQueue.performAccessibilityScan(
          siteConnection.id,
          siteConnection.siteUrl,
          siteConnection.platform || 'wordpress',
          scanReason
        );

        console.log(`✅ [WP-PLUGIN] Scan completed for ${siteDomain}, result ID: ${scanResult?.id}`);

        return res.json({
          success: true,
          message: `Accessibility scan triggered successfully for ${scanReason}`,
          scan_id: scanResult?.id,
          scan_reason: scanReason
        });

      } catch (scanError) {
        console.error(`❌ [WP-PLUGIN] Scan failed for ${siteDomain}:`, scanError);
        
        return res.status(500).json({
          success: false,
          error: 'Failed to perform accessibility scan',
          details: scanError.message
        });
      }
    }

    // Unknown status
    console.log(`⚠️ [WP-PLUGIN] Unknown status: ${status} for ${siteDomain}`);
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
 * WordPress Plugin Token Verification API
 * Endpoint: /api/accessibility-auth/verify
 * Method: POST
 * 
 * Validates API tokens for WordPress plugin authentication
 * Payload: { "token": "xxx", "site_url": "https://example.com" }
 */
router.post('/accessibility-auth/verify', async (req, res) => {
  try {
    const { token, site_url } = req.body;

    console.log(`🔐 [WP-AUTH] Token verification request for site: ${site_url}`);

    // Validate required fields
    if (!token || !site_url) {
      console.log(`❌ [WP-AUTH] Missing required fields: token or site_url`);
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: token and site_url are required'
      });
    }

    // Find the site connection using the API token
    const siteConnection = await prisma.siteConnection.findFirst({
      where: { 
        apiToken: token,
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            subscriptionStatus: true
          }
        }
      }
    });

    if (!siteConnection) {
      console.log(`❌ [WP-AUTH] Invalid token: ${token?.substring(0, 8)}...`);
      return res.json({
        success: false,
        message: 'Token is invalid or site connection is not active'
      });
    }

    // Site URL validation removed - focus only on token validation

    console.log(`✅ [WP-AUTH] Token verified for site: ${siteConnection.siteName} (${siteConnection.siteUrl})`);

    // Return success with basic site information
    return res.json({
      success: true,
      message: 'Token is valid',
      site_info: {
        site_name: siteConnection.siteName,
        platform: siteConnection.platform,
        last_scan: siteConnection.lastScanAt,
        auto_scan_enabled: siteConnection.autoScanEnabled
      }
    });

  } catch (error) {
    console.error('❌ [WP-AUTH] Token verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during token verification'
    });
  }
});

/**
 * WordPress Schedule API Proxy
 * Endpoint: /api/wordpress/:connectionId/schedule
 * Method: POST
 * 
 * Proxies schedule control requests to WordPress plugin API
 */
router.post('/:connectionId/schedule', requireAuth, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    console.log(`🔄 [WP-SCHEDULE] User ${userId} requesting action "${action}" for connection ${connectionId}`);

    // Validate required fields
    if (!action) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: action'
      });
    }

    // Find the site connection and verify ownership
    const siteConnection = await prisma.siteConnection.findFirst({
      where: { 
        id: parseInt(connectionId),
        userId: userId,
        status: 'active',
        platform: 'wordpress'
      }
    });

    if (!siteConnection) {
      console.log(`❌ [WP-SCHEDULE] Connection ${connectionId} not found for user ${userId}`);
      return res.status(404).json({
        success: false,
        message: 'WordPress connection not found or access denied'
      });
    }

    // Ensure URL is properly formatted
    let baseUrl = siteConnection.siteUrl.trim();
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`;
    }
    baseUrl = baseUrl.replace(/\/$/, '');

    const apiUrl = `${baseUrl}/wp-json/wcag/v2/schedule`;
    console.log(`🌐 [WP-SCHEDULE] Making API call to: ${apiUrl} with action: ${action}`);

    // Make the request to WordPress plugin API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action })
    });

    console.log(`📡 [WP-SCHEDULE] WordPress API response status: ${response.status}`);

    if (!response.ok) {
      throw new Error(`WordPress API responded with status ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ [WP-SCHEDULE] WordPress API response:`, result);

    // Return the response from WordPress plugin
    return res.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('❌ [WP-SCHEDULE] Error proxying WordPress schedule request:', error);
    
    // Handle specific error cases
    if (error.message.includes('fetch')) {
      return res.status(503).json({
        success: false,
        message: 'Unable to connect to WordPress site. Please verify the plugin is installed and the site is accessible.',
        error_type: 'connection_failed'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to communicate with WordPress plugin',
      error_type: 'api_error'
    });
  }
});

export default router;