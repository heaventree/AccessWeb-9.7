# WordPress Integration Documentation

**Current Version:** 1.0.1  
**Last Updated:** April 14, 2024  
**Status:** Production-Ready  

## Overview

The WordPress integration allows the WCAG Accessibility Audit Tool to connect with WordPress sites to perform accessibility assessments, provide remediation suggestions, and implement fixes through the plugin. This document outlines the architecture, implementation details, and usage guidelines.

## Integration Architecture

The WordPress integration consists of two main components:

1. **WordPress Plugin:** A server-side plugin installed on client WordPress sites
2. **Client API Library:** Code within our application to communicate with WordPress sites

### Communication Flow

```
WCAG Accessibility Tool <---> WordPress REST API <---> WordPress Plugin <---> WordPress Site
```

## REST API Communication

The WordPress integration communicates with WordPress sites through their REST API:

- Endpoints are accessed through the WordPress REST API at `/wp-json/`
- Authentication uses secure API key validation
- All requests use HTTPS with proper error handling
- Response validation ensures data integrity

## Key Features

### 1. Intelligent Response Caching

To improve performance and reduce API calls:

- **Tiered Caching:** Different cache durations based on data type and volatility
- **Cache Invalidation:** Automatic and manual cache invalidation mechanisms
- **Optimized Performance:** Reduced API calls for frequently accessed data
- **Configurable Settings:** Cache timeout and persistence options can be adjusted

### 2. Plugin Detection and Verification

The integration verifies if WordPress sites have the required plugin installed:

- **Plugin Verification:** Checks if the AccessWeb plugin is installed and activated
- **Version Checking:** Verifies plugin compatibility with the current version
- **Installation Guidance:** Provides clear installation instructions when needed

### 3. Site Information Retrieval

Comprehensive site information is retrieved from WordPress sites:

- **Site Details:** Name, URL, version, and theme information
- **Plugin Information:** List of active plugins and their versions
- **Theme Data:** Current theme details including accessibility support
- **User Roles:** Information about user roles and permissions

## Implementation Details

### API Client

The API client is implemented in TypeScript and provides the following methods:

```typescript
// Core API methods
getSiteInfo(siteUrl: string): Promise<WordPressSiteInfo>
checkPluginStatus(siteUrl: string): Promise<PluginStatus>
runAccessibilityScan(siteUrl: string, options: ScanOptions): Promise<ScanResults>
applyFix(siteUrl: string, fixId: string, options: FixOptions): Promise<FixResult>
```

### Main Components

1. `src/lib/integrations/wordpress.ts` - Contains integration logic and caching
2. `src/lib/api/wordPressClient.ts` - Implements the REST API client
3. `src/components/integrations/WordPressSetup.tsx` - UI for connecting WordPress sites
4. `src/components/integrations/WordPressDashboard.tsx` - Dashboard for WordPress sites

## Plugin Requirements

The WordPress plugin requires:

- WordPress 6.0 or newer
- PHP 7.4 or newer
- REST API enabled
- Administrator access for installation

## Security Considerations

- API communication is secured with JWT authentication
- Sensitive data is never stored in browser storage
- Plugin installations are verified through cryptographic signatures
- All user inputs are sanitized and validated

## Usage Examples

### Connecting a WordPress Site

```typescript
import { connectWordPressSite } from 'lib/integrations/wordpress';

// Connect to a WordPress site
const connection = await connectWordPressSite({
  siteUrl: 'https://example.com',
  apiKey: 'user-provided-api-key'
});

// Store the connection for future use
saveConnection(connection);
```

### Running an Accessibility Scan

```typescript
import { scanWordPressSite } from 'lib/integrations/wordpress';

// Run a scan on a connected site
const results = await scanWordPressSite({
  siteId: savedConnection.id,
  options: {
    depth: 3,
    includeImages: true,
    checkForms: true
  }
});

// Process the results
displayResults(results);
```

## Troubleshooting

Common issues and their solutions:

1. **API Connection Failures:**
   - Verify site URL is correct and includes https://
   - Ensure WordPress REST API is enabled
   - Check API key permissions

2. **Plugin Detection Issues:**
   - Verify plugin is installed and activated
   - Update plugin to the latest version
   - Check WordPress version compatibility

3. **Scan Failures:**
   - Check for custom WordPress configurations
   - Verify site doesn't have REST API restrictions
   - Look for security plugins that might block API access

## Future Enhancements

Planned enhancements to the WordPress integration:

1. **Automated Fix Application:** Apply multiple fixes automatically
2. **Bulk Site Management:** Manage multiple WordPress sites from one interface
3. **Enhanced Reporting:** Generate detailed WordPress-specific accessibility reports
4. **Custom Plugin Extensions:** Allow site-specific plugin customizations