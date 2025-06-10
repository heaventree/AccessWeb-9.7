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



export default router;