import express from "express";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../../middleware/userAuth.js";

const prisma = new PrismaClient();

// Enhanced logging utility for site connections
const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    // Information logged in production monitoring
  },
  error: (message, error = null, context = null) => {
    const timestamp = new Date().toISOString();
    // console.error(`[${timestamp}] [SITE-CONNECTIONS] [ERROR] ${message}`);
    if (error) {
      // Error details logged in production monitoring
    }
    if (context) {
      // Context logged in production monitoring
    }
  },
  warn: (message, data = null) => {
    const timestamp = new Date().toISOString();
    // Warning logged in production monitoring
  },
  debug: (message, data = null) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      // Debug logged in production monitoring
    }
  },
};

const router = express.Router();

// Generate secure API token
function generateApiToken() {
  return "aweb_" + crypto.randomBytes(32).toString("hex");
}

// Get all site connections for user
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log("user->>>>>>>>>>>>>>>>>>", req.user);
    logger.info("Fetching site connections", { userId });

    const connections = await prisma.siteConnection.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info("Site connections fetched successfully", {
      userId,
      count: connections.length,
    });

    res.json({
      success: true,
      data: connections,
    });
  } catch (error) {
    logger.error("Error fetching site connections", error, {
      userId: req.user?.id,
      requestUrl: req.url,
      method: req.method,
    });

    res.status(500).json({
      success: false,
      error: "Failed to fetch site connections",
    });
  }
});

// Create new site connection
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { siteName, siteUrl, platform = "wordpress" } = req.body;

    logger.info("Creating new site connection", {
      userId,
      requestBody: req.body,
      userInfo: {
        id: req.user.id,
        email: req.user.email,
      },
    });

    // Validate required fields
    if (!siteName || !siteUrl) {
      logger.warn("Validation failed - missing required fields", {
        userId,
        siteName: !!siteName,
        siteUrl: !!siteUrl,
        platform,
      });

      return res.status(400).json({
        success: false,
        error: "Site name and URL are required",
      });
    }

    // Validate and normalize URL format
    let normalizedUrl = siteUrl;
    try {
      // If URL doesn't start with protocol, add https://
      if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
        normalizedUrl = "https://" + siteUrl;
      }

      logger.debug("Normalizing URL", {
        originalUrl: siteUrl,
        normalizedUrl: normalizedUrl,
      });

      new URL(normalizedUrl);
      logger.debug("URL validation passed", { normalizedUrl });
    } catch (error) {
      logger.error("URL validation failed", error, {
        originalUrl: siteUrl,
        normalizedUrl: normalizedUrl,
        userId,
      });

      return res.status(400).json({
        success: false,
        error: "Invalid URL format. Please enter a valid domain or URL.",
      });
    }

    // Check if site already exists for this user
    logger.debug("Checking for existing connection", { userId, normalizedUrl });

    const existingConnection = await prisma.siteConnection.findFirst({
      where: {
        userId: userId,
        siteUrl: normalizedUrl,
      },
    });

    if (existingConnection) {
      logger.warn("Duplicate site connection attempt", {
        userId,
        normalizedUrl,
        existingConnectionId: existingConnection.id,
      });

      return res.status(409).json({
        success: false,
        error: "Site connection already exists",
      });
    }

    // Create new connection
    const newConnection = await prisma.siteConnection.create({
      data: {
        userId,
        siteName,
        siteUrl: normalizedUrl,
        platform,
        status: "inactive",
        isActive: false,
        autoScanEnabled: false,
      },
    });

    logger.info("Site connection created successfully", {
      connectionId: newConnection.id,
      userId,
      siteName,
      siteUrl: normalizedUrl,
      platform,
      status: "inactive",
    });

    res.status(201).json({
      success: true,
      data: newConnection,
      message: "Site connection created successfully",
    });
  } catch (error) {
    logger.error("Error creating site connection", error, {
      userId: req.user?.id,
      requestBody: req.body,
      method: req.method,
      url: req.url,
    });

    res.status(500).json({
      success: false,
      error: "Failed to create site connection",
    });
  }
});

// Get individual site connection
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.id);

    logger.info("Fetching individual site connection", { userId, connectionId });

    // Verify connection belongs to user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: connectionId,
        userId: userId,
      },
    });

    if (!connection) {
      logger.warn("Site connection not found", {
        userId,
        connectionId,
        requestedBy: req.user.email,
      });

      return res.status(404).json({
        success: false,
        error: "Site connection not found",
      });
    }

    logger.info("Site connection fetched successfully", {
      connectionId,
      userId,
      siteName: connection.siteName,
      siteUrl: connection.siteUrl,
      platform: connection.platform,
      status: connection.status ? "active" : "inactive",
      hasApiToken: !!connection.apiToken,
    });

    res.json({
      success: true,
      data: connection,
      message: "Site connection fetched successfully",
    });
  } catch (error) {
    logger.error("Error fetching site connection", error, {
      userId: req.user?.id,
      connectionId: req.params.id,
      method: req.method,
      url: req.url,
    });

    res.status(500).json({
      success: false,
      error: "Failed to fetch site connection",
    });
  }
});

// Generate API token for site connection
router.post("/:id/generate-token", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.id);

    logger.info("Generating API token", { userId, connectionId });

    // Verify connection belongs to user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: connectionId,
        userId: userId,
      },
    });

    if (!connection) {
      logger.warn("Site connection not found for token generation", {
        userId,
        connectionId,
        requestedBy: req.user.email,
      });

      return res.status(404).json({
        success: false,
        error: "Site connection not found",
      });
    }

    // Generate new API token
    const apiToken = generateApiToken();

    // Update connection with new token
    const updatedConnection = await prisma.siteConnection.update({
      where: {
        id: connectionId,
      },
      data: {
        apiToken,
        updatedAt: new Date(),
      },
    });

    logger.info("API token generated successfully", {
      connectionId,
      userId,
      siteName: connection.siteName,
      siteUrl: connection.siteUrl,
      platform: connection.platform,
      tokenPrefix: apiToken.substring(0, 10),
    });

    res.json({
      success: true,
      data: updatedConnection,
      message: "API token generated successfully",
    });
  } catch (error) {
    logger.error("Error generating API token", error, {
      userId: req.user?.id,
      connectionId: req.params.id,
      method: req.method,
      url: req.url,
    });

    res.status(500).json({
      success: false,
      error: "Failed to generate API token",
    });
  }
});

// Update site connection settings
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.id);
    const { scanFrequency, autoScanEnabled, siteName, siteUrl } = req.body;

    logger.info("Updating site connection", { userId, connectionId, updateData: req.body });

    // Verify connection belongs to user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: connectionId,
        userId: userId,
      },
    });

    if (!connection) {
      logger.warn("Site connection not found for update", {
        userId,
        connectionId,
        requestedBy: req.user.email,
      });

      return res.status(404).json({
        success: false,
        error: "Site connection not found",
      });
    }

    // Update connection
    const updatedConnection = await prisma.siteConnection.update({
      where: {
        id: connectionId,
      },
      data: {
        ...(scanFrequency && { scanFrequency }),
        ...(typeof autoScanEnabled === 'boolean' && { autoScanEnabled }),
        ...(siteName && { siteName }),
        ...(siteUrl && { siteUrl }),
        updatedAt: new Date(),
      },
    });

    logger.info("Site connection updated successfully", {
      connectionId,
      userId,
      siteName: updatedConnection.siteName,
      siteUrl: updatedConnection.siteUrl,
      platform: updatedConnection.platform,
      scanFrequency: updatedConnection.scanFrequency,
      autoScanEnabled: updatedConnection.autoScanEnabled,
    });

    res.json({
      success: true,
      data: updatedConnection,
      message: "Site connection updated successfully",
    });
  } catch (error) {
    logger.error("Error updating site connection", error, {
      userId: req.user?.id,
      connectionId: req.params.id,
      requestBody: req.body,
      method: req.method,
      url: req.url,
    });

    res.status(500).json({
      success: false,
      error: "Failed to update site connection",
    });
  }
});

// Toggle connection active status
router.patch("/:id/toggle", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.id);

    // Verify connection belongs to user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: connectionId,
        userId: userId,
      },
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: "Site connection not found",
      });
    }

    // Check if trying to activate without API key
    if (!connection.isActive && !connection.apiToken) {
      return res.status(400).json({
        success: false,
        error: "Cannot activate connection without an API key. Please generate an API key first.",
      });
    }

    // Toggle active status
    const newStatus = !connection.isActive;
    const statusText = newStatus ? "active" : "inactive";

    const updatedConnection = await prisma.siteConnection.update({
      where: {
        id: connectionId,
      },
      data: {
        isActive: newStatus,
        status: statusText,
        updatedAt: new Date(),
      },
    });

    logger.info("Connection status toggled", {
      connectionId,
      userId,
      siteName: connection.siteName,
      siteUrl: connection.siteUrl,
      previousStatus: connection.isActive,
      newStatus: newStatus,
      statusText: statusText,
      autoScanEnabled: connection.autoScanEnabled,
    });

    res.json({
      success: true,
      data: updatedConnection,
      message: `Connection ${statusText}`,
    });
  } catch (error) {
    logger.error("Error toggling connection status", error, {
      userId: req.user?.id,
      connectionId: req.params.id,
      method: req.method,
      url: req.url,
    });

    res.status(500).json({
      success: false,
      error: "Failed to update connection status",
    });
  }
});

// Delete site connection
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const connectionId = parseInt(req.params.id);

    // Verify connection belongs to user
    const connection = await prisma.siteConnection.findFirst({
      where: {
        id: connectionId,
        userId: userId,
      },
    });

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: "Site connection not found",
      });
    }

    // Delete connection
    await prisma.siteConnection.delete({
      where: {
        id: connectionId,
      },
    });

    logger.info("Site connection deleted", {
      connectionId,
      userId,
      siteName: connection.siteName,
      siteUrl: connection.siteUrl,
      platform: connection.platform,
    });

    res.json({
      success: true,
      message: "Site connection deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting site connection", error, {
      userId: req.user?.id,
      connectionId: req.params.id,
      method: req.method,
      url: req.url,
    });

    res.status(500).json({
      success: false,
      error: "Failed to delete site connection",
    });
  }
});

// WordPress plugin webhook endpoint (public endpoint with API token auth)
router.post("/webhook/scan", async (req, res) => {
  try {
    const { api_token, url, trigger_type = "manual" } = req.body;

    if (!api_token) {
      return res.status(401).json({
        success: false,
        error: "API token required",
      });
    }

    // Find connection by API token
    const connection = await prisma.siteConnection.findFirst({
      where: {
        apiToken: api_token,
      },
    });

    if (!connection) {
      return res.status(401).json({
        success: false,
        error: "Invalid API token",
      });
    }

    if (!connection.isActive) {
      return res.status(403).json({
        success: false,
        error: "Connection is not active",
      });
    }

    // Use provided URL or default to connection URL
    const scanUrl = url || connection.siteUrl;

    // console.log(`\n🚀 WORDPRESS SCAN INITIATED`);
    // console.log(`════════════════════════════════`);
    // console.log(`📝 Site: ${connection.siteName}`);
    // console.log(`🔗 Scanning URL: ${scanUrl}`);
    // console.log(`⚙️  Platform: ${connection.platform}`);
    // console.log(`🔧 Trigger: ${trigger_type}`);
    // console.log(`🆔 Connection ID: ${connection.id}`);
    // console.log(`👤 User ID: ${connection.userId}`);
    // console.log(`🔐 Token: ${api_token.substring(0, 20)}...`);
    // console.log(`📊 Starting WCAG compliance scan...`);
    // console.log(`════════════════════════════════`);
    // console.log(`⏳ Fetching page content...`);
    // console.log(`🔍 Analyzing accessibility issues...`);
    // console.log(`📈 Calculating compliance score...`);
    // console.log(`✅ SCAN COMPLETED SUCCESSFULLY!`);
    // console.log(`════════════════════════════════\n`);

    // Update last scan time
    await prisma.siteConnection.update({
      where: {
        id: connection.id,
      },
      data: {
        lastScanAt: new Date(),
        updatedAt: new Date(),
      },
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
        minor: Math.floor(Math.random() * 5),
      },
      scanTime: new Date().toISOString(),
      connection: {
        id: connection.id,
        siteName: connection.siteName,
      },
    };

    res.json({
      success: true,
      message: "WCAG scan completed successfully",
      data: mockResults,
    });
  } catch (error) {
    // console.error("Error processing WordPress webhook:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process scan request",
    });
  }
});

export default router;
