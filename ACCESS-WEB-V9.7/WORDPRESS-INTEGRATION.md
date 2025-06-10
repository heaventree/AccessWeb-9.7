# WordPress Plugin Integration Guide

## Overview

The AccessWeb platform now supports WordPress plugin integration for real-time accessibility monitoring. When files change on a WordPress site, the plugin can automatically trigger accessibility scans through our webhook API.

## Integration Architecture

The WordPress integration uses the existing site connection API token system, eliminating the need for separate token management. This ensures consistency and security across the platform.

### Authentication Flow

1. User creates a site connection in AccessWeb dashboard
2. System generates an API token for the site connection
3. User configures WordPress plugin with the API token
4. Plugin sends webhooks to AccessWeb when files change
5. AccessWeb validates token and triggers accessibility scans

## Webhook API Endpoint

### URL
```
POST /api/wp-json/wp/v2/accessibility-auth/debug
```

### Request Format
```json
{
  "token": "site-connection-api-token",
  "status": "update|init|no-update",
  "run_time": 1234567890,
  "success": true,
  "message": "File changes detected",
  "ignore_list": [],
  "count": 5,
  "modified_at": "2025-06-10T10:34:00Z"
}
```

### Required Fields
- `token`: API token from site connection
- `status`: Change status (`update`, `init`, or `no-update`)

### Response Formats

#### Successful Scan Trigger
```json
{
  "success": true,
  "message": "Accessibility scan triggered successfully for file_update",
  "scan_reason": "file_update"
}
```

#### No Changes Detected
```json
{
  "success": true,
  "message": "No changes detected, scan not triggered"
}
```

#### Authentication Error
```json
{
  "error": "Invalid token or inactive site connection"
}
```

#### Domain Mismatch
```json
{
  "error": "Domain mismatch"
}
```

## Status Types

### `update`
- Triggered when WordPress files are modified
- Causes `file_update` scan reason
- Most common webhook type

### `init` 
- Triggered during plugin initialization
- Causes `file_init` scan reason
- Used for initial setup verification

### `no-update`
- Sent when no changes are detected
- No scan is triggered
- Used for heartbeat/status checks

## Security Features

### Token Validation
- Uses existing site connection API tokens
- Validates token against active site connections
- Requires matching user ownership

### Domain Verification
- Compares webhook domain with site connection URL
- Prevents cross-site token usage
- Ensures requests come from correct domain

### Request Validation
- Validates required fields
- Handles malformed requests gracefully
- Provides clear error messages

## Implementation Details

### Database Integration
- Scan results stored with `scan_reason` field
- Tracks whether scan was triggered by file changes or schedule
- Maintains full audit trail

### Error Handling
- Comprehensive logging for debugging
- Graceful degradation for invalid requests
- Clear error messages for troubleshooting

### Performance
- Reuses existing scan infrastructure
- No additional database tables required
- Minimal overhead on webhook processing

## WordPress Plugin Configuration

To configure the WordPress plugin:

1. **Get API Token**
   - Navigate to Site Connections in AccessWeb dashboard
   - Find your WordPress site connection
   - Copy the API token

2. **Configure Plugin**
   - Install AccessWeb WordPress plugin
   - Enter API token in plugin settings
   - Verify domain matches site connection URL
   - Save configuration

3. **Test Integration**
   - Plugin will send test webhook on activation
   - Check AccessWeb dashboard for scan results
   - Verify scans are triggered on file changes

## Monitoring and Debugging

### Log Messages
- All webhook requests are logged with identifiers
- Scan triggers include detailed information
- Authentication failures are clearly marked

### Dashboard Integration
- Scan results appear in normal dashboard views
- `scan_reason` field indicates trigger source
- File-triggered scans are visually distinguished

### Troubleshooting
- Check API token matches site connection
- Verify domain configuration
- Review webhook logs for error details
- Ensure site connection is active status

## Best Practices

### Security
- Keep API tokens secure and private
- Regularly rotate tokens if compromised
- Monitor webhook logs for suspicious activity

### Performance
- Plugin should debounce rapid file changes
- Avoid triggering scans for temporary files
- Use `no-update` status for heartbeat checks

### Maintenance
- Update plugin when new features are released
- Monitor scan quotas and usage
- Review scan results regularly for issues

## Future Enhancements

- Rate limiting for webhook requests
- Webhook signature verification
- Plugin auto-update mechanism
- Enhanced file change filtering
- Bulk scan optimization

This integration provides seamless real-time accessibility monitoring for WordPress sites while maintaining security and performance standards.