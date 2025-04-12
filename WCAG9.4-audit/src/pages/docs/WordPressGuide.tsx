import React from 'react';
import { Globe, Key, Book, CheckCircle, ArrowRight, Shield, Zap, FileText, AlertTriangle, Package, Clock, DollarSign, Lock, Info, Settings, PenTool, Download, List, Webhook, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export function WordPressGuide() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">WordPress Integration Guide</h1>
          <p className="text-lg text-gray-600">
            Complete guide to integrating accessibility testing into your WordPress website. 
            Learn how to install, configure, and use our WordPress plugin for WCAG compliance.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <List className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Table of Contents</h2>
            </div>
            
            <ul className="space-y-2 text-blue-600">
              <li><a href="#overview" className="hover:underline">Overview</a></li>
              <li><a href="#installation" className="hover:underline">Installation & Setup</a></li>
              <li><a href="#configuration" className="hover:underline">Configuration Options</a></li>
              <li><a href="#dashboard" className="hover:underline">WordPress Dashboard</a></li>
              <li><a href="#reports" className="hover:underline">Accessibility Reports</a></li>
              <li><a href="#auto-fixes" className="hover:underline">Automatic Fixes</a></li>
              <li><a href="#badge" className="hover:underline">Accessibility Badge</a></li>
              <li><a href="#api" className="hover:underline">WordPress REST API Integration</a></li>
              <li><a href="#troubleshooting" className="hover:underline">Troubleshooting</a></li>
              <li><a href="#faq" className="hover:underline">Frequently Asked Questions</a></li>
            </ul>
          </div>
        </div>

        {/* Overview Section */}
        <div id="overview" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Overview</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Our WordPress plugin provides a seamless way to monitor, test, and fix accessibility issues directly 
                from your WordPress dashboard. The plugin integrates with your WordPress site to provide:
              </p>
              
              <ul>
                <li>Real-time accessibility monitoring of all your pages and posts</li>
                <li>Automated WCAG compliance testing against A, AA, and AAA standards</li>
                <li>AI-powered suggestions to fix accessibility issues</li>
                <li>Detailed reports and analytics on your site's accessibility status</li>
                <li>Optional accessibility badge to show your commitment to inclusivity</li>
              </ul>
              
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Plugin Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Automated WCAG 2.1 compliance testing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Real-time accessibility monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>One-click automatic fixes for common issues</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Accessibility badge for your site</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Plugin Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Ensure your WordPress site stays accessible</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Catch issues before they affect users</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Save time with automated fixes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Show your commitment to accessibility</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">System Requirements</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        The AccessWeb WordPress plugin requires WordPress 5.8 or higher and PHP 7.4 or higher.
                        It is compatible with most major WordPress themes and plugins.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Section */}
        <div id="installation" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Download className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Installation & Setup</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Installing and setting up the AccessWeb WordPress plugin is a straightforward process that takes just a few minutes.
                Follow these step-by-step instructions:
              </p>
              
              <h3>Method 1: Install from WordPress Plugin Directory</h3>
              <ol>
                <li>Log in to your WordPress dashboard</li>
                <li>Navigate to <strong>Plugins → Add New</strong></li>
                <li>Search for "AccessWeb Accessibility"</li>
                <li>Click <strong>Install Now</strong> and then <strong>Activate</strong></li>
              </ol>
              
              <h3>Method 2: Manual Installation</h3>
              <ol>
                <li>Download the AccessWeb WordPress plugin ZIP file from your <Link to="/dashboard/downloads" className="text-blue-600 hover:underline">account dashboard</Link></li>
                <li>Log in to your WordPress dashboard</li>
                <li>Navigate to <strong>Plugins → Add New → Upload Plugin</strong></li>
                <li>Choose the downloaded ZIP file and click <strong>Install Now</strong></li>
                <li>After installation completes, click <strong>Activate Plugin</strong></li>
              </ol>
              
              <h3>Initial Setup</h3>
              <p>
                After activating the plugin, you'll need to connect it to your AccessWeb account:
              </p>
              
              <ol>
                <li>In your WordPress dashboard, navigate to <strong>AccessWeb → Settings</strong></li>
                <li>Click <strong>Connect to AccessWeb</strong></li>
                <li>Log in with your AccessWeb credentials or create a new account</li>
                <li>Authorize the connection to your WordPress site</li>
                <li>The plugin will automatically generate an API key and configure the connection</li>
              </ol>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                    <p className="mt-2 text-sm text-yellow-700">
                      If you're using a security plugin like Wordfence or iThemes Security, you may need to whitelist 
                      the AccessWeb API domains to allow the plugin to communicate with our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Options */}
        <div id="configuration" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Configuration Options</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                The AccessWeb WordPress plugin offers a variety of configuration options to customize your accessibility testing:
              </p>
              
              <h3>General Settings</h3>
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Setting</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Default</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Scan Frequency</td>
                    <td className="px-6 py-4 text-sm text-gray-500">How often the plugin scans your website for accessibility issues</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Daily</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Scan Depth</td>
                    <td className="px-6 py-4 text-sm text-gray-500">How many pages deep the crawler will scan</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 pages</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">WCAG Level</td>
                    <td className="px-6 py-4 text-sm text-gray-500">The WCAG conformance level to test against</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">AA</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Auto-Fix</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Automatically apply fixes for common issues</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Off</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Notifications</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Send email notifications for new issues</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">On</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Exclusion Rules</h3>
              <p>
                You can exclude specific pages, posts, or sections of your site from accessibility scanning:
              </p>
              <ul>
                <li><strong>URL Patterns</strong>: Exclude URLs matching specific patterns (e.g., /admin/*, /wp-*)</li>
                <li><strong>Post Types</strong>: Exclude specific post types from scanning</li>
                <li><strong>User Roles</strong>: Configure which user roles can access the plugin dashboard</li>
              </ul>
              
              <h3>Badge Configuration</h3>
              <p>
                Customize the accessibility badge that appears on your website:
              </p>
              <ul>
                <li><strong>Position</strong>: Choose where the badge appears (top-left, top-right, bottom-left, bottom-right)</li>
                <li><strong>Style</strong>: Select from multiple badge styles</li>
                <li><strong>Custom Text</strong>: Add custom text to your badge</li>
                <li><strong>Display Conditions</strong>: Control when and where the badge is displayed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* WordPress Dashboard */}
        <div id="dashboard" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <PenTool className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">WordPress Dashboard</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                The AccessWeb plugin adds a new section to your WordPress dashboard where you can monitor and manage accessibility issues.
              </p>
              
              <h3>Dashboard Overview</h3>
              <p>
                The main dashboard provides an at-a-glance view of your site's accessibility status:
              </p>
              <ul>
                <li><strong>Accessibility Score</strong>: Your site's overall accessibility rating</li>
                <li><strong>Issue Summary</strong>: Total issues broken down by severity (critical, serious, moderate, minor)</li>
                <li><strong>Compliance Status</strong>: Your site's WCAG compliance status</li>
                <li><strong>Recent Scans</strong>: Results from your most recent accessibility scans</li>
                <li><strong>Trend Analysis</strong>: Charts showing how your accessibility score has changed over time</li>
              </ul>
              
              <h3>Content Editor Integration</h3>
              <p>
                The plugin also integrates with the WordPress content editor to provide real-time accessibility checking as you create content:
              </p>
              <ul>
                <li><strong>Inline Suggestions</strong>: Get accessibility suggestions as you write</li>
                <li><strong>Alt Text Reminders</strong>: Automatic reminders to add alt text to images</li>
                <li><strong>Heading Structure Analysis</strong>: Verification of proper heading structure</li>
                <li><strong>Color Contrast Checker</strong>: Visual indication of color contrast issues</li>
              </ul>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Pro Tip</h3>
                    <p className="mt-2 text-sm text-green-700">
                      Use the "Accessibility" tab in the block editor sidebar to quickly check individual blocks for accessibility issues and get specific recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div id="reports" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Accessibility Reports</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                The AccessWeb plugin generates detailed accessibility reports to help you identify and fix issues.
              </p>
              
              <h3>Report Types</h3>
              <ul>
                <li><strong>Site Audit</strong>: Comprehensive scan of your entire site</li>
                <li><strong>Page-Level Reports</strong>: Detailed analysis of individual pages</li>
                <li><strong>Issue Reports</strong>: Focused reports on specific types of issues</li>
                <li><strong>Compliance Reports</strong>: WCAG compliance status reports</li>
              </ul>
              
              <h3>Report Formats</h3>
              <p>
                Reports can be exported in various formats for sharing or documentation:
              </p>
              <ul>
                <li><strong>PDF Reports</strong>: Comprehensive reports suitable for printing</li>
                <li><strong>CSV Export</strong>: Raw data export for further analysis</li>
                <li><strong>JSON Export</strong>: Structured data for programmatic use</li>
                <li><strong>Email Reports</strong>: Scheduled reports sent directly to specified email addresses</li>
              </ul>
              
              <h3>Report Scheduling</h3>
              <p>
                Set up automated report generation and delivery on your preferred schedule:
              </p>
              <ul>
                <li><strong>Daily Reports</strong>: Quick summaries of new issues</li>
                <li><strong>Weekly Reports</strong>: Comprehensive weekly status updates</li>
                <li><strong>Monthly Reports</strong>: Detailed trend analysis and progress reports</li>
                <li><strong>Custom Schedules</strong>: Define your own reporting schedule</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Auto Fixes Section */}
        <div id="auto-fixes" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Automatic Fixes</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                The AccessWeb plugin can automatically fix many common accessibility issues with a single click.
              </p>
              
              <h3>Supported Auto-Fixes</h3>
              <p>
                The plugin can automatically fix a variety of accessibility issues, including:
              </p>
              <ul>
                <li><strong>Missing Alt Text</strong>: Generate appropriate alt text for images</li>
                <li><strong>Form Labels</strong>: Add missing form labels or aria-label attributes</li>
                <li><strong>Color Contrast</strong>: Adjust colors to meet WCAG contrast requirements</li>
                <li><strong>Heading Structure</strong>: Fix heading hierarchy issues</li>
                <li><strong>Link Text</strong>: Improve generic link text (e.g., "click here", "read more")</li>
                <li><strong>ARIA Attributes</strong>: Add missing ARIA attributes for interactive elements</li>
                <li><strong>Table Markup</strong>: Add proper table headers and structure</li>
              </ul>
              
              <h3>Auto-Fix Settings</h3>
              <p>
                You can configure how automatic fixes are applied:
              </p>
              <ul>
                <li><strong>Review Mode</strong>: Review and approve each fix before it's applied</li>
                <li><strong>Automatic Mode</strong>: Automatically apply fixes as issues are detected</li>
                <li><strong>Scheduled Mode</strong>: Apply fixes on a regular schedule</li>
              </ul>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                    <p className="mt-2 text-sm text-yellow-700">
                      While automatic fixes can resolve many issues, they should be reviewed for context and accuracy.
                      Some accessibility issues require human judgment and cannot be automatically fixed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badge Section */}
        <div id="badge" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Accessibility Badge</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Show your commitment to accessibility by displaying an accessibility badge on your website.
              </p>
              
              <h3>Badge Features</h3>
              <ul>
                <li><strong>Displays Accessibility Score</strong>: Shows your site's current accessibility rating</li>
                <li><strong>Certification Status</strong>: Indicates WCAG compliance level (A, AA, AAA)</li>
                <li><strong>Accessible Panel</strong>: Opens a detailed accessibility panel for visitors</li>
                <li><strong>Last Verified Date</strong>: Shows when your site was last verified</li>
              </ul>
              
              <h3>Badge Styles</h3>
              <p>
                Choose from multiple badge styles to match your website design:
              </p>
              <ul>
                <li><strong>Floating Badge</strong>: Small badge that floats in a corner of your site</li>
                <li><strong>Inline Badge</strong>: Badge that can be placed in your footer or sidebar</li>
                <li><strong>Minimal Badge</strong>: Simplified version with just the essentials</li>
                <li><strong>Custom Badge</strong>: Fully customizable badge to match your branding</li>
              </ul>
              
              <h3>Badge Code</h3>
              <p>
                The badge can be added to your site in several ways:
              </p>
              <ol>
                <li><strong>Automatic Placement</strong>: Enable in plugin settings for automatic placement</li>
                <li><strong>Widget</strong>: Add via the AccessWeb widget in your sidebar or footer</li>
                <li><strong>Shortcode</strong>: Use <code>[accessweb_badge]</code> shortcode in your content</li>
                <li><strong>Manual Placement</strong>: Copy and paste the badge code into your theme files</li>
              </ol>
              
              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 text-sm">
                {`<!-- AccessWeb Badge Code -->
<script src="https://cdn.accessweb.com/badge.js" 
  data-site-id="YOUR_SITE_ID" 
  data-position="bottom-right"
  data-style="standard">
</script>`}
              </pre>
            </div>
          </div>
        </div>

        {/* WordPress REST API Section */}
        <div id="api" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Code className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">WordPress REST API Integration</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                The AccessWeb plugin extends the WordPress REST API with additional endpoints for accessibility data.
              </p>
              
              <h3>Available Endpoints</h3>
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Endpoint</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Description</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/status</td>
                    <td className="px-6 py-4 text-sm text-gray-500">GET</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Check if the AccessWeb plugin is installed and active</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/site-info</td>
                    <td className="px-6 py-4 text-sm text-gray-500">GET</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Get information about the WordPress site</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/validate</td>
                    <td className="px-6 py-4 text-sm text-gray-500">GET</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Validate API key authentication</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/issues</td>
                    <td className="px-6 py-4 text-sm text-gray-500">GET</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Get a list of all accessibility issues</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/issues/&#123;id&#125;</td>
                    <td className="px-6 py-4 text-sm text-gray-500">GET</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Get details for a specific issue</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/scan</td>
                    <td className="px-6 py-4 text-sm text-gray-500">POST</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Trigger a new accessibility scan</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/scan/&#123;id&#125;</td>
                    <td className="px-6 py-4 text-sm text-gray-500">GET</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Get scan results for a specific scan ID</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/stats</td>
                    <td className="px-6 py-4 text-sm text-gray-500">GET</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Get accessibility statistics</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/fix/&#123;scan_id&#125;</td>
                    <td className="px-6 py-4 text-sm text-gray-500">POST</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Apply fixes to issues from a specific scan</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">/wp-json/access-web/v1/settings</td>
                    <td className="px-6 py-4 text-sm text-gray-500">GET/POST</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Get or update plugin settings</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Authentication</h3>
              <p>
                API requests require authentication using one of the following methods:
              </p>
              <ul>
                <li><strong>WordPress Cookie Authentication</strong>: For requests from the WordPress admin</li>
                <li><strong>Application Passwords</strong>: For external applications</li>
                <li><strong>JWT Authentication</strong>: For secure API access</li>
              </ul>
              
              <h3>Example Usage</h3>
              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 text-sm">
                {`// Get all accessibility issues
fetch('/wp-json/access-web/v1/issues', {
  method: 'GET',
  headers: {
    'X-API-KEY': 'your-api-key-here',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`}
              </pre>
              
              <h3>Response Caching</h3>
              <p>
                The AccessWeb client implements intelligent response caching to improve performance and reduce API calls. The cache system uses three duration levels:
              </p>
              <ul>
                <li><strong>Short-term cache</strong> (5 minutes): For frequently changing data like live scan results</li>
                <li><strong>Medium-term cache</strong> (30 minutes): For semi-static data like issue reports</li>
                <li><strong>Long-term cache</strong> (24 hours): For rarely changing data like site configuration</li>
              </ul>
              
              <p>The client automatically manages cache invalidation when data is updated. Example implementation:</p>
              
              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 text-sm">
                {`// Example of API client with caching
const cacheManager = {
  async getWithExpiry(key, maxAge) {
    const cached = await storageService.getItem(key);
    if (!cached) return null;
    
    const isExpired = Date.now() - cached.timestamp > maxAge;
    return isExpired ? null : cached.data;
  }
};

// Usage example
async function getSiteInfo(siteUrl, apiKey) {
  // Try to get from cache first
  const cacheKey = \`site_info_\${siteUrl}\`;
  const cachedData = await cacheManager.getWithExpiry(cacheKey, 30 * 60 * 1000);
  
  if (cachedData) {
    console.log('Using cached site info');
    return cachedData;
  }
  
  // Fetch fresh data if not in cache
  const response = await fetch(\`\${siteUrl}/wp-json/access-web/v1/site-info\`, {
    headers: { 'X-API-KEY': apiKey }
  });
  
  const data = await response.json();
  
  // Save to cache
  await cacheManager.set(cacheKey, data);
  return data;
}`}
              </pre>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">API Documentation</h3>
                    <p className="mt-2 text-sm text-blue-700">
                      For full API documentation, visit the <a href="#" className="text-blue-600 hover:underline">WordPress REST API Reference</a> section.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Troubleshooting Section */}
        <div id="troubleshooting" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Troubleshooting</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Common issues and their solutions:
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3>Plugin is not connecting to AccessWeb services</h3>
                  <p>
                    This is usually due to network or authentication issues:
                  </p>
                  <ul>
                    <li>Verify your API key in the plugin settings</li>
                    <li>Check if your security plugins are blocking API requests</li>
                    <li>Ensure your server can make outbound HTTP requests</li>
                    <li>Verify SSL certificate settings if using HTTPS</li>
                  </ul>
                </div>
                
                <div>
                  <h3>Scans are not detecting all issues</h3>
                  <p>
                    This could be due to scan configuration:
                  </p>
                  <ul>
                    <li>Increase the scan depth in settings</li>
                    <li>Check excluded paths and post types</li>
                    <li>Ensure JavaScript is enabled in scan settings</li>
                    <li>Verify that the scanner can access password-protected areas</li>
                  </ul>
                </div>
                
                <div>
                  <h3>Auto-fixes are not working correctly</h3>
                  <p>
                    This may be due to permission or theme compatibility issues:
                  </p>
                  <ul>
                    <li>Check file permissions for theme and plugin files</li>
                    <li>Verify that the theme supports content modifications</li>
                    <li>Look for theme or plugin conflicts</li>
                    <li>Enable debug mode for more detailed error messages</li>
                  </ul>
                </div>
                
                <div>
                  <h3>Badge is not displaying correctly</h3>
                  <p>
                    Badge display issues can be caused by:
                  </p>
                  <ul>
                    <li>Theme customizations blocking the badge script</li>
                    <li>CSS conflicts from other plugins</li>
                    <li>Improperly configured badge settings</li>
                    <li>JavaScript errors from other scripts</li>
                  </ul>
                </div>
              </div>
              
              <h3>Diagnostic Tools</h3>
              <p>
                The plugin includes diagnostic tools to help troubleshoot issues:
              </p>
              <ul>
                <li><strong>System Check</strong>: Verifies that your server meets all requirements</li>
                <li><strong>Connection Test</strong>: Tests the connection to AccessWeb services</li>
                <li><strong>Debug Mode</strong>: Enables detailed logging for troubleshooting</li>
                <li><strong>Plugin Conflict Detector</strong>: Identifies potential plugin conflicts</li>
              </ul>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Need More Help?</h3>
                    <p className="mt-2 text-sm text-blue-700">
                      If you're still experiencing issues, please contact our support team at 
                      <a href="mailto:support@accessweb.com" className="text-blue-600 hover:underline"> support@accessweb.com</a> or 
                      visit our <a href="/help" className="text-blue-600 hover:underline">Help Center</a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <Book className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="space-y-6">
                <div>
                  <h3>Will the plugin slow down my WordPress site?</h3>
                  <p>
                    No, the AccessWeb plugin is designed to have minimal impact on your site's performance. 
                    The scanning process runs in the background and doesn't affect your visitors' experience. 
                    The badge script is lightweight and loads asynchronously.
                  </p>
                </div>
                
                <div>
                  <h3>Does the plugin work with page builders?</h3>
                  <p>
                    Yes, the AccessWeb plugin is compatible with most popular page builders including Elementor, 
                    Beaver Builder, Divi, and WPBakery. It can scan and analyze content created with these builders, 
                    and in many cases can apply automatic fixes.
                  </p>
                </div>
                
                <div>
                  <h3>Can I use the plugin on multiple WordPress sites?</h3>
                  <p>
                    Yes, depending on your subscription plan, you can use the plugin on multiple sites. 
                    The Basic plan supports up to 3 sites, Professional supports up to 10 sites, and 
                    Enterprise plans offer custom site limits.
                  </p>
                </div>
                
                <div>
                  <h3>How frequently should I scan my website?</h3>
                  <p>
                    For most websites, a weekly scan is sufficient. However, if you frequently update content, 
                    daily scans are recommended. E-commerce sites and news websites should consider real-time 
                    monitoring for the best results.
                  </p>
                </div>
                
                <div>
                  <h3>Will the plugin fix all accessibility issues automatically?</h3>
                  <p>
                    While the plugin can automatically fix many common issues, some accessibility problems require 
                    human judgment and manual intervention. The plugin will identify these issues and provide 
                    guidance on how to fix them.
                  </p>
                </div>
                
                <div>
                  <h3>Is the plugin GDPR compliant?</h3>
                  <p>
                    Yes, the AccessWeb plugin is designed to be GDPR compliant. It doesn't collect personal data 
                    from your site visitors. All processing occurs on our secure servers, and you can request 
                    deletion of your data at any time from your account settings.
                  </p>
                </div>
                
                <div>
                  <h3>Can I customize the accessibility reports?</h3>
                  <p>
                    Yes, Professional and Enterprise plans allow for custom report branding and formatting. 
                    You can add your logo, customize colors, and select which sections to include in your reports.
                  </p>
                </div>
                
                <div>
                  <h3>Does the plugin support WooCommerce?</h3>
                  <p>
                    Yes, the AccessWeb plugin has special support for WooCommerce sites. It includes specific tests 
                    for product pages, cart functionality, and checkout processes to ensure your e-commerce site is 
                    fully accessible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Resources */}
        <div className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <ArrowRight className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Related Resources</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/help/wordpress-plugin-tutorial" className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  WordPress Plugin Video Tutorial
                </h3>
                <p className="text-gray-600">
                  Step-by-step video guide to setting up and using the AccessWeb WordPress plugin.
                </p>
              </Link>
              
              <Link to="/knowledge-base/wcag-compliance-guide" className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  WCAG Compliance Guide
                </h3>
                <p className="text-gray-600">
                  Learn about WCAG guidelines and how to ensure your WordPress site meets them.
                </p>
              </Link>
              
              <Link to="/blog/wordpress-accessibility-best-practices" className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  WordPress Accessibility Best Practices
                </h3>
                <p className="text-gray-600">
                  Essential tips for making your WordPress site more accessible to all users.
                </p>
              </Link>
              
              <Link to="/docs/api" className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  API Documentation
                </h3>
                <p className="text-gray-600">
                  Technical documentation for developers integrating with our API.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}