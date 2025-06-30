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

    // Production logging: `🔌 [WP-PLUGIN] Received webhook with token: ${token?.substring(0, 8)}..., status: ${status};

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
      // Production logging: `❌ [WP-PLUGIN] Invalid token or inactive site connection: ${token?.substring(0, 8)}...;
      return res.status(401).json({
        error: 'Invalid token or inactive site connection'
      });
    }

    // Production logging: `✅ [WP-PLUGIN] Authenticated for site: ${siteConnection.siteName} (${siteConnection.siteUrl});
    const siteDomain = new URL(siteConnection.siteUrl).hostname;

    // Handle different status types
    if (status === 'no-update') {
      // Production logging: `ℹ️ [WP-PLUGIN] No changes detected for ${siteDomain}, ignoring;
      return res.json({
        success: true,
        message: 'No changes detected, scan not triggered'
      });
    }

    if (status === 'init' || status === 'update') {
      const scanReason = status === 'init' ? 'file_init' : 'file_update';
      
      // Production logging: `🚀 [WP-PLUGIN] Triggering ${scanReason} scan for ${siteDomain};

      // Trigger the accessibility scan using existing scanner logic
      try {
        const scanResult = await siteScannerQueue.performAccessibilityScan(
          siteConnection.id,
          siteConnection.siteUrl,
          siteConnection.platform || 'wordpress',
          scanReason
        );

        // Production logging: `✅ [WP-PLUGIN] Scan completed for ${siteDomain}, result ID: ${scanResult?.id};

        return res.json({
          success: true,
          message: `Accessibility scan triggered successfully for ${scanReason}`,
          scan_id: scanResult?.id,
          scan_reason: scanReason
        });

      } catch (scanError) {
        // console.error(`❌ [WP-PLUGIN] Scan failed for ${siteDomain}:`, scanError);
        
        return res.status(500).json({
          success: false,
          error: 'Failed to perform accessibility scan',
          details: scanError.message
        });
      }
    }

    // Unknown status
    // Production logging: `⚠️ [WP-PLUGIN] Unknown status: ${status} for ${siteDomain};
    return res.status(400).json({
      error: `Unknown status: ${status}`
    });

  } catch (error) {
    // console.error('❌ [WP-PLUGIN] Webhook processing error:', error);
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

    // Production logging: `🔐 [WP-AUTH] Token verification request for site: ${site_url};

    // Validate required fields
    if (!token || !site_url) {
      // Production logging: `❌ [WP-AUTH] Missing required fields: token or site_url;
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
      // Production logging: `❌ [WP-AUTH] Invalid token: ${token?.substring(0, 8)}...;
      return res.json({
        success: false,
        message: 'Token is invalid or site connection is not active'
      });
    }

    // Site URL validation removed - focus only on token validation

    // Production logging: `✅ [WP-AUTH] Token verified for site: ${siteConnection.siteName} (${siteConnection.siteUrl});

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
    // console.error('❌ [WP-AUTH] Token verification error:', error);
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

    // Production logging: `🔄 [WP-SCHEDULE] User ${userId} requesting action "${action}" for connection ${connectionId};

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
      // Production logging: `❌ [WP-SCHEDULE] Connection ${connectionId} not found for user ${userId};
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
    // Production logging: `🌐 [WP-SCHEDULE] Making API call to: ${apiUrl} with action: ${action};

    // Set longer timeout for "run" action as it waits for complete scan
    const timeoutMs = action === 'run' ? 600000 : 30000; // 10 minutes for run, 30 seconds for others
    
    // Create AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    // Make the request to WordPress plugin API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // Production logging: `📡 [WP-SCHEDULE] WordPress API response status: ${response.status};

    if (!response.ok) {
      throw new Error(`WordPress API responded with status ${response.status}: ${response.statusText};
    }

    const result = await response.json();
    // Production logging: `✅ [WP-SCHEDULE] WordPress API response:`, result);

    // Return the response from WordPress plugin
    return res.json({
      success: true,
      ...result
    });

  } catch (error) {
    // console.error('❌ [WP-SCHEDULE] Error proxying WordPress schedule request:', error);
    
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

/**
 * WordPress Plugin Hourly Schedule Response Webhook
 * Endpoint: /wcag-compliance/schedule-response
 * Method: POST
 * 
 * Handles hourly file change notifications from WordPress plugin
 * and triggers accessibility scans when status is "init" or "update"
 */
router.post('/wcag-compliance/schedule-response', async (req, res) => {
  try {
    // Production logging: `📥 [WP-SCHEDULE-WEBHOOK] Received hourly schedule response;
    // Production logging: `📥 [WP-SCHEDULE-WEBHOOK] Full payload:`, JSON.stringify(req.body, null, 2));

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

    // Production logging: `🔍 [WP-SCHEDULE-WEBHOOK] Extracted fields:;
    // Production logging: `   - Token: ${token ? `${token.substring(0, 8)}...` : 'MISSING'};
    // Production logging: `   - Domain: ${domain || 'MISSING'};
    // Production logging: `   - Status: ${status || 'MISSING'};
    // Production logging: `   - Success: ${success};
    // Production logging: `   - Message: ${message || 'No message'};
    // Production logging: `   - Run time: ${run_time || 'MISSING'};
    // Production logging: `   - File count: ${count || 'MISSING'};
    // Production logging: `   - Modified at: ${modified_at || 'MISSING'};

    // Validate required fields
    if (!token) {
      // Production logging: `❌ [WP-SCHEDULE-WEBHOOK] Missing required field: token;
      return res.status(400).json({
        success: false,
        error: 'Missing required field: token'
      });
    }

    if (!status) {
      // Production logging: `❌ [WP-SCHEDULE-WEBHOOK] Missing required field: status;
      return res.status(400).json({
        success: false,
        error: 'Missing required field: status'
      });
    }

    // Find the site connection using the API token
    // Production logging: `🔍 [WP-SCHEDULE-WEBHOOK] Looking up site connection for token: ${token.substring(0, 8)}...;
    
    const siteConnection = await prisma.siteConnection.findFirst({
      where: { 
        apiToken: token,
        status: 'active',
        platform: 'wordpress'
      },
      include: {
        user: true
      }
    });

    if (!siteConnection) {
      // Production logging: `❌ [WP-SCHEDULE-WEBHOOK] No active WordPress site connection found for token: ${token.substring(0, 8)}...;
      return res.status(404).json({
        success: false,
        error: 'Site connection not found or inactive'
      });
    }

    // Production logging: `✅ [WP-SCHEDULE-WEBHOOK] Found site connection:;
    // Production logging: `   - Connection ID: ${siteConnection.id};
    // Production logging: `   - Site Name: ${siteConnection.siteName};
    // Production logging: `   - Site URL: ${siteConnection.siteUrl};
    // Production logging: `   - User ID: ${siteConnection.userId};
    // Production logging: `   - User Email: ${siteConnection.user.email};

    // Check if we should trigger a scan based on status
    // Production logging: `🔄 [WP-SCHEDULE-WEBHOOK] Checking status: "${status}";
    
    // Initialize scan data for tracking
    let scanResult = null;
    let scanTriggered = false;

    if (status === 'init') {
      // Production logging: `🆕 [WP-SCHEDULE-WEBHOOK] Status is "init" - First time scan detected;
      // Production logging: `🚀 [WP-SCHEDULE-WEBHOOK] Triggering accessibility scan for first-time setup;
      
      // Trigger accessibility scan asynchronously (don't wait for completion)
      setImmediate(async () => {
        try {
          // Production logging: `🔍 [WP-SCAN-ASYNC] Starting async init scan for connection ${siteConnection.id};
          const result = await siteScannerQueue.performAccessibilityScan(
            siteConnection.id,
            siteConnection.siteUrl,
            siteConnection.platform || 'wordpress',
            'file_init'
          );
          // Production logging: `✅ [WP-SCAN-ASYNC] Init scan completed - Score: ${result.score}%, Errors: ${result.errorCount};
        } catch (error) {
          // console.error(`❌ [WP-SCAN-ASYNC] Init scan failed for connection ${siteConnection.id}:`, error);
        }
      });
      
      scanTriggered = true;
      // Production logging: `✅ [WP-SCHEDULE-WEBHOOK] Init scan queued for connection ${siteConnection.id};
      
    } else if (status === 'update') {
      // Production logging: `🔄 [WP-SCHEDULE-WEBHOOK] Status is "update" - File changes detected;
      // Production logging: `🚀 [WP-SCHEDULE-WEBHOOK] Triggering accessibility scan for updated files;
      
      // Trigger accessibility scan asynchronously (don't wait for completion)
      setImmediate(async () => {
        try {
          // Production logging: `🔍 [WP-SCAN-ASYNC] Starting async update scan for connection ${siteConnection.id};
          const result = await siteScannerQueue.performAccessibilityScan(
            siteConnection.id,
            siteConnection.siteUrl,
            siteConnection.platform || 'wordpress',
            'file_update'
          );
          // Production logging: `✅ [WP-SCAN-ASYNC] Update scan completed - Score: ${result.score}%, Errors: ${result.errorCount};
        } catch (error) {
          // console.error(`❌ [WP-SCAN-ASYNC] Update scan failed for connection ${siteConnection.id}:`, error);
        }
      });
      
      scanTriggered = true;
      // Production logging: `✅ [WP-SCHEDULE-WEBHOOK] Update scan queued for connection ${siteConnection.id}`)
      
    } else if (status === 'no-update') {
      // Production logging: `ℹ️ [WP-SCHEDULE-WEBHOOK] Status is "no-update" - No changes detected;
      // Production logging: `⏭️ [WP-SCHEDULE-WEBHOOK] Skipping scan - no file changes to process;
      
    } else {
      // Production logging: `⚠️ [WP-SCHEDULE-WEBHOOK] Unknown status: "${status}" - Skipping scan;
    }

    // Log additional details if available
    if (ignore_list && Array.isArray(ignore_list)) {
      // Production logging: `📁 [WP-SCHEDULE-WEBHOOK] Ignore list contains ${ignore_list.length} items:`, ignore_list);
    }

    if (success === false) {
      // Production logging: `⚠️ [WP-SCHEDULE-WEBHOOK] WordPress plugin reported scan failure: ${message};
    }

    // Store webhook data for potential future reference
    // Production logging: `💾 [WP-SCHEDULE-WEBHOOK] Webhook processed successfully;
    // Production logging: `📊 [WP-SCHEDULE-WEBHOOK] Summary:;
    // Production logging: `   - Connection: ${siteConnection.siteName} (${siteConnection.id});
    // Production logging: `   - Action taken: ${scanTriggered ? 'Accessibility scan queued' : 'No scan needed'};
    // Production logging: `   - Files scanned by WP: ${count || 'Unknown'};
    // Production logging: `   - Plugin success: ${success};

    // Return immediate response without waiting for scan completion
    return res.json({
      success: true,
      message: scanTriggered ? 'WordPress webhook processed and accessibility scan queued' : 'WordPress webhook processed - no scan required',
      data: {
        connectionId: siteConnection.id,
        siteName: siteConnection.siteName,
        status: status,
        scanTriggered: scanTriggered,
        timestamp: new Date().toISOString(),
        webhookData: {
          filesChanged: count,
          pluginSuccess: success,
          message: message
        }
      }
    });

  } catch (error) {
    // console.error('❌ [WP-SCHEDULE-WEBHOOK] Error processing webhook:', error);
    // console.error('❌ [WP-SCHEDULE-WEBHOOK] Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error processing webhook',
      message: error.message
    });
  }
});

export default router;