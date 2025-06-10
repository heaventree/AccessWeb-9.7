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
      console.log(`❌ [WP-PLUGIN] Invalid token or inactive site connection: ${token}`);
      return res.status(401).json({
        error: 'Invalid token or inactive site connection'
      });
    }

    // Verify domain matches site URL
    const siteUrl = new URL(siteConnection.siteUrl);
    if (siteUrl.hostname !== domain) {
      console.log(`❌ [WP-PLUGIN] Domain mismatch. Expected: ${siteUrl.hostname}, Got: ${domain}`);
      return res.status(403).json({
        error: 'Domain mismatch'
      });
    }

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



export default router;