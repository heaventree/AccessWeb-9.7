# AccessWeb WCAG Checker WordPress Plugin

Professional WCAG 2.1 AA+ compliance testing and monitoring directly in your WordPress dashboard. This plugin integrates the powerful AccessWeb accessibility testing platform into WordPress, allowing you to scan your site for accessibility issues, generate detailed reports, and ensure compliance with web accessibility standards.

## Features

### Core Functionality
- **WCAG 2.1 AA/AAA Compliance Testing** - Comprehensive accessibility scanning
- **Real-time Analysis** - Get instant feedback on accessibility issues
- **Detailed Reporting** - View specific issues with remediation guidance
- **Score Tracking** - Monitor your site's accessibility score over time
- **Issue Categorization** - Critical, Serious, Moderate, and Minor issue classification

### Testing Capabilities
- **URL Testing** - Test any webpage for accessibility compliance
- **Homepage Quick Scan** - One-click scanning of your WordPress site
- **WCAG Level Selection** - Choose between AA and AAA compliance levels
- **Advanced Options** - Screenshot generation and PDF reports (Pro features)

### Color Accessibility Tools
- **WCAG Color Palette Generator** - Create accessible color combinations
- **Contrast Ratio Calculator** - Real-time contrast checking
- **Color Harmony Generator** - Complementary, analogous, triadic, and monochromatic palettes
- **Live Preview** - See how colors look with text overlays

### Reporting & Management
- **Report History** - Store and view past accessibility scans
- **Export Functionality** - PDF and data export capabilities
- **Automated Monitoring** - Weekly automated scans (configurable)
- **Email Notifications** - Get notified when new issues are detected

## Installation

### Method 1: WordPress Admin Dashboard
1. Download the `accessweb-wcag-checker.zip` file
2. Go to your WordPress admin dashboard
3. Navigate to **Plugins > Add New**
4. Click **Upload Plugin**
5. Choose the downloaded zip file and click **Install Now**
6. Activate the plugin

### Method 2: FTP Upload
1. Extract the `accessweb-wcag-checker` folder from the zip file
2. Upload the folder to `/wp-content/plugins/` directory
3. Go to **Plugins** in your WordPress admin
4. Find "AccessWeb WCAG Checker" and click **Activate**

## Configuration

### Initial Setup
1. After activation, go to **WCAG Checker > Settings** in your WordPress admin
2. Configure the API endpoint:
   - **Local Development**: `http://localhost:3001/api`
   - **Production**: Your deployed AccessWeb API URL
3. (Optional) Add your AccessWeb Pro API key for enhanced features
4. Configure automation and notification preferences

### API Configuration
The plugin connects to the AccessWeb API backend. You have several options:

#### Option 1: Use Your Deployed AccessWeb Instance
```
API Endpoint: https://your-domain.com/api
API Key: your-api-key (optional)
```

#### Option 2: Local Development
```
API Endpoint: http://localhost:3001/api
API Key: (leave empty for basic testing)
```

#### Option 3: AccessWeb Cloud Service
```
API Endpoint: https://api.accessweb.ai
API Key: your-pro-api-key (required)
```

## Usage

### Basic Website Scanning
1. Go to **WCAG Checker** in your WordPress admin menu
2. Enter a URL or use "Quick Scan Current Site"
3. Select WCAG compliance level (AA recommended)
4. Click **Scan Website**
5. Review results and follow remediation guidance

### Viewing Reports
1. Navigate to **WCAG Checker > Reports**
2. Filter reports by timeframe
3. View detailed results and track improvements over time
4. Export reports for compliance documentation

### Color Palette Generator
1. Go to **WCAG Checker > Color Palette**
2. Select a base color using the color picker
3. Choose a color harmony type
4. Generate accessible color combinations
5. Test contrast ratios in real-time

### Automated Monitoring
1. Enable "Auto-scan Homepage" in settings
2. Configure email notifications
3. Receive weekly reports and alerts for new issues

## Understanding Results

### Accessibility Score
- **80-100**: Excellent accessibility compliance
- **60-79**: Good with minor improvements needed  
- **40-59**: Fair but requires attention
- **0-39**: Poor accessibility, immediate action required

### Issue Severity Levels
- **Critical**: Prevents access for users with disabilities (e.g., missing alt text, form labels)
- **Serious**: Significantly impacts accessibility (e.g., poor contrast, heading structure)
- **Moderate**: Accessibility barriers that should be addressed (e.g., missing landmarks)
- **Minor**: Best practice improvements (e.g., redundant links)

### WCAG Guidelines Referenced
- **1.1.1** - Non-text Content (Alt text for images)
- **1.3.1** - Info and Relationships (Proper heading structure)
- **1.4.3** - Contrast (Minimum color contrast ratios)
- **3.3.2** - Labels or Instructions (Form accessibility)
- **And many more...**

## Pro Features

Upgrade to AccessWeb Pro to unlock advanced capabilities:

- **Unlimited Scans** - No restrictions on testing frequency
- **PDF Report Generation** - Professional compliance reports
- **Screenshot Documentation** - Visual proof of issues
- **API Access** - Integrate with other tools and workflows
- **Priority Support** - Direct technical assistance
- **Advanced Monitoring** - Real-time alerts and notifications

## Requirements

### WordPress
- WordPress 5.0 or higher
- PHP 7.4 or higher
- MySQL 5.6 or higher

### AccessWeb API
- Active AccessWeb API instance (local or cloud)
- Internet connection for external API calls
- (Optional) AccessWeb Pro subscription for advanced features

## Troubleshooting

### Common Issues

#### "Failed to connect to AccessWeb API"
- Check your API endpoint URL in settings
- Ensure your AccessWeb server is running
- Verify network connectivity
- For local development, make sure the API server is on port 3001

#### "API request failed"
- Verify API endpoint is correct
- Check if API key is required and properly configured
- Review server logs for detailed error messages

#### "Insufficient permissions"
- Ensure you have WordPress admin privileges
- Check if the plugin is properly activated

### Getting Help

1. **Plugin Settings**: Verify API configuration
2. **Server Logs**: Check WordPress and AccessWeb server logs
3. **Network Issues**: Test API endpoint directly in browser
4. **Support**: Contact AccessWeb support for Pro subscribers

## Development

### Local Development Setup
1. Clone the AccessWeb repository
2. Set up the API server (Node.js + Express)
3. Configure WordPress with this plugin
4. Point plugin to `http://localhost:3001/api`

### Customization
The plugin provides hooks and filters for customization:

```php
// Filter API endpoint
add_filter('accessweb_api_endpoint', function($endpoint) {
    return 'https://custom-api.example.com';
});

// Hook into scan completion
add_action('accessweb_scan_completed', function($results) {
    // Custom logic after scan
});
```

## Security

- All API communications use secure HTTPS (when available)
- Input validation and sanitization
- WordPress nonce protection for admin actions
- Secure storage of API keys in WordPress options

## Privacy

This plugin:
- Only scans URLs you explicitly test
- Stores reports locally in your WordPress database
- Does not transmit personal user data
- Connects only to configured AccessWeb API endpoints

## License

GPL v2 or later - same as WordPress

## Support

- **Community Support**: WordPress.org plugin forums
- **Pro Support**: Direct support for AccessWeb Pro subscribers
- **Documentation**: Full guides at https://accessweb.ai/docs
- **Issues**: Report bugs on GitHub

## Changelog

### Version 1.0.0
- Initial release
- WCAG 2.1 AA/AAA testing
- Color palette generator
- Report management
- WordPress integration