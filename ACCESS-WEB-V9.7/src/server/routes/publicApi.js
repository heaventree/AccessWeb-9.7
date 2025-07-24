import express from "express";
import puppeteer from "puppeteer";
import { authenticateApiKey, trackApiUsage } from "./apiKeys.js";

const router = express.Router();

// Run axe analysis using Puppeteer for proper browser environment
async function runAxeAnalysis(url, options = {}) {
  let browser;
  try {
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
      ],
    });

    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    );

    // Navigate to the page
    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

    // Inject axe-core from CDN (more reliable than local file)
    await page.addScriptTag({
      url: "https://unpkg.com/axe-core@4.8.2/axe.min.js",
    });

    // Configure axe based on options
    const axeConfig = { runOnly: { type: "tags", values: [] } };

    // Set region-specific rules
    if (options.region) {
      switch (options.region.toLowerCase()) {
        case "eu":
          axeConfig.runOnly.values = [
            "wcag2a",
            "wcag2aa",
            "wcag21aa",
            "en301549",
          ];
          break;
        case "us":
          axeConfig.runOnly.values = ["wcag2a", "wcag2aa", "section508"];
          break;
        case "uk":
          axeConfig.runOnly.values = ["wcag2a", "wcag2aa", "wcag21aa"];
          break;
        default:
          axeConfig.runOnly.values = ["wcag2a", "wcag2aa"];
      }
    }

    // Override with specific tag if provided
    if (options.tag) {
      const tagMap = {
        WCAG2A: ["wcag2a"],
        WCAG2AA: ["wcag2a", "wcag2aa"],
        WCAG2AAA: ["wcag2a", "wcag2aa", "wcag2aaa"],
        WCAG21A: ["wcag21a"],
        WCAG21AA: ["wcag21a", "wcag21aa"],
        SECTION508: ["section508"],
        EN301549: ["en301549"],
      };

      if (tagMap[options.tag.toUpperCase()]) {
        axeConfig.runOnly.values = tagMap[options.tag.toUpperCase()];
      }
    }

    // Run axe analysis
    const results = await page.evaluate((config) => {
      return new Promise((resolve, reject) => {
        window.axe.run(document, config, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });
    }, axeConfig);

    return results;
  } catch (error) {
    throw new Error(`Failed to analyze webpage: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Helper function to format results
function formatResults(axeResults, url, region, tag) {
  const violations = axeResults.violations || [];
  const passes = axeResults.passes || [];
  const incomplete = axeResults.incomplete || [];

  const totalIssues = violations.length;
  const criticalIssues = violations.filter(
    (v) => v.impact === "critical",
  ).length;
  const seriousIssues = violations.filter((v) => v.impact === "serious").length;
  const moderateIssues = violations.filter(
    (v) => v.impact === "moderate",
  ).length;
  const minorIssues = violations.filter((v) => v.impact === "minor").length;

  // Calculate compliance score
  const totalRules = violations.length + passes.length;
  const passedRules = passes.length;
  const complianceScore =
    totalRules > 0 ? Math.round((passedRules / totalRules) * 100) : 100;

  return {
    url,
    region,
    tag,
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues,
      criticalIssues,
      seriousIssues,
      moderateIssues,
      minorIssues,
      complianceScore,
      totalRulesChecked: totalRules,
      rulesPassed: passedRules,
    },
    violations: violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.map((node) => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary,
        element: node.element,
      })),
    })),
    passes: passes.map((pass) => ({
      id: pass.id,
      description: pass.description,
      help: pass.help,
      tags: pass.tags,
      nodes: pass.nodes.length,
    })),
    incomplete: incomplete.map((inc) => ({
      id: inc.id,
      description: inc.description,
      help: inc.help,
      tags: inc.tags,
      nodes: inc.nodes.length,
    })),
    metadata: {
      standard: tag || "WCAG2AA",
      region: region || "us",
      engine: "axe-core",
    },
  };
}

// POST /api/public/wcag-check - Public WCAG checking endpoint
router.post("/wcag-check", authenticateApiKey, async (req, res) => {
  const startTime = Date.now();
  let statusCode = 200;
  let responseData = null;

  try {
    const { url, region = "us", tag = "WCAG2AA" } = req.body;

    // Validate input
    if (!url) {
      statusCode = 400;
      const error = {
        error: "Missing required parameter",
        message: "URL is required",
      };
      responseData = error;
      return res.status(statusCode).json(error);
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      statusCode = 400;
      const error = {
        error: "Invalid URL format",
        message: "Please provide a valid HTTP or HTTPS URL",
      };
      responseData = error;
      return res.status(statusCode).json(error);
    }

    // Validate region
    const validRegions = ["us", "eu", "uk"];
    if (!validRegions.includes(region.toLowerCase())) {
      statusCode = 400;
      const error = {
        error: "Invalid region",
        message: "Region must be one of: us, eu, uk",
      };
      responseData = error;
      return res.status(statusCode).json(error);
    }

    // Validate tag
    const validTags = [
      "WCAG2A",
      "WCAG2AA",
      "WCAG2AAA",
      "WCAG21A",
      "WCAG21AA",
      "SECTION508",
      "EN301549",
    ];
    if (!validTags.includes(tag.toUpperCase())) {
      statusCode = 400;
      const error = {
        error: "Invalid tag",
        message: `Tag must be one of: ${validTags.join(", ")}`,
      };
      responseData = error;
      return res.status(statusCode).json(error);
    }

    console.log(
      `[API] Starting WCAG check for ${url} (region: ${region}, tag: ${tag})`,
    );

    // Run accessibility analysis directly on the URL
    const axeResults = await runAxeAnalysis(url, { region, tag });

    // Format results
    const formattedResults = formatResults(axeResults, url, region, tag);

    // Save scan result to database linked to the API key user
    try {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      
      // Get user ID from the API key
      const apiKey = await prisma.apiKey.findUnique({
        where: { id: req.apiKey.id },
        include: { user: true }
      });

      if (apiKey && apiKey.user) {
        // Check if a site connection already exists for this URL and user
        let siteConnection = await prisma.siteConnection.findFirst({
          where: {
            userId: apiKey.userId,
            siteUrl: url
          }
        });

        // If not, create one
        if (!siteConnection) {
          const urlObj = new URL(url);
          siteConnection = await prisma.siteConnection.create({
            data: {
              userId: apiKey.userId,
              siteName: urlObj.hostname,
              siteUrl: url,
              platform: 'api',
              isActive: true,
              autoScanEnabled: false,
              scanFrequency: 'manual',
              lastScanAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
        }

        // Save the scan result
        await prisma.scanResult.create({
          data: {
            siteConnectionId: siteConnection.id,
            scanType: 'api',
            scanUrl: url,
            scanStatus: 'completed',
            errorCount: formattedResults.summary.criticalIssues + formattedResults.summary.seriousIssues,
            warningCount: formattedResults.summary.moderateIssues,
            noticeCount: formattedResults.summary.minorIssues,
            score: formattedResults.summary.complianceScore / 100, // Convert percentage to decimal
            rawResults: formattedResults,
            scanDuration: Date.now() - startTime,
            userAgent: req.get('User-Agent') || 'API Client',
            scanReason: 'api_request'
          }
        });

        console.log(`✅ [PUBLIC-API] Scan result saved for user ${apiKey.userId} via API key`);
      }
      
      await prisma.$disconnect();
    } catch (saveError) {
      console.error('Error saving API scan result:', saveError);
      // Continue with response even if save fails
    }

    responseData = formattedResults;
    res.json(formattedResults);
  } catch (error) {
    console.error("[API] WCAG check error:", error);
    statusCode = 500;

    const errorResponse = {
      error: "Analysis failed",
      message: error.message,
      timestamp: new Date().toISOString(),
    };
    responseData = errorResponse;

    res.status(statusCode).json(errorResponse);
  } finally {
    // Track API usage
    const responseTime = Date.now() - startTime;

    try {
      await trackApiUsage(
        req.apiKey.id,
        "/api/public/wcag-check",
        statusCode,
        responseTime,
        req.get("User-Agent"),
        req.ip,
      );
    } catch (trackingError) {
      console.error("Failed to track API usage:", trackingError);
    }
  }
});

// GET /api/public/health - Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "AccessWeb Public API",
    version: "1.0.0",
  });
});

export default router;
