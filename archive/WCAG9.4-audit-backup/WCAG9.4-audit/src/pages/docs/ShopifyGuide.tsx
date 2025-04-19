import React from 'react';
import { Store, Key, Book, CheckCircle, ArrowRight, Shield, Zap, FileText, AlertTriangle, Package, Clock, DollarSign, Lock, Info, Settings, PenTool, Download, List, Webhook, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ShopifyGuide() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopify Integration Guide</h1>
          <p className="text-lg text-gray-600">
            Complete guide to integrating accessibility testing into your Shopify store. 
            Learn how to install, configure, and use our Shopify app for WCAG compliance.
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
              <li><a href="#dashboard" className="hover:underline">Shopify Dashboard</a></li>
              <li><a href="#theme-analysis" className="hover:underline">Theme Analysis</a></li>
              <li><a href="#product-pages" className="hover:underline">Product Page Testing</a></li>
              <li><a href="#checkout-flow" className="hover:underline">Checkout Flow Analysis</a></li>
              <li><a href="#auto-fixes" className="hover:underline">Automatic Fixes</a></li>
              <li><a href="#badge" className="hover:underline">Accessibility Badge</a></li>
              <li><a href="#webhooks" className="hover:underline">Webhooks & Notifications</a></li>
              <li><a href="#api" className="hover:underline">Shopify API Integration</a></li>
              <li><a href="#troubleshooting" className="hover:underline">Troubleshooting</a></li>
              <li><a href="#faq" className="hover:underline">Frequently Asked Questions</a></li>
            </ul>
          </div>
        </div>

        {/* Overview Section */}
        <div id="overview" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Store className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Overview</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Our Shopify app provides a comprehensive solution for monitoring, testing, and fixing accessibility issues 
                in your Shopify store. The app integrates seamlessly with your Shopify admin to provide:
              </p>
              
              <ul>
                <li>Complete theme accessibility testing against WCAG 2.1 standards</li>
                <li>Product page accessibility monitoring</li>
                <li>Checkout flow analysis for accessibility barriers</li>
                <li>Automated fixes for common accessibility issues</li>
                <li>Detailed reports and analytics dashboard</li>
                <li>Custom accessibility badge for your storefront</li>
              </ul>
              
              <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Features</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Theme accessibility testing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Product page monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Checkout flow analysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Custom fixes for Shopify themes</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-100 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Benefits</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Make your store accessible to all customers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Improve conversion rates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Ensure ADA compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                      <span>Enhance user experience for all shoppers</span>
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
                    <h3 className="text-sm font-medium text-blue-800">Compatibility</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        The AccessWeb Shopify app is compatible with all Shopify plans and works with both 
                        Shopify 1.0 and 2.0 themes. It supports all major browsers and devices.
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
                Installing and setting up the AccessWeb Shopify app is a simple process that takes just a few minutes.
                Follow these step-by-step instructions:
              </p>
              
              <h3>Method 1: Install from Shopify App Store</h3>
              <ol>
                <li>Log in to your Shopify admin dashboard</li>
                <li>Go to the Shopify App Store</li>
                <li>Search for "AccessWeb Accessibility"</li>
                <li>Click "Add app"</li>
                <li>Follow the installation prompts to authorize the app</li>
              </ol>
              
              <h3>Method 2: Direct Installation</h3>
              <ol>
                <li>Visit the <a href="https://apps.shopify.com/accessweb" className="text-blue-600 hover:underline">AccessWeb app page</a> on the Shopify App Store</li>
                <li>Click "Add app"</li>
                <li>Log in to your Shopify store if prompted</li>
                <li>Review the requested permissions and click "Install app"</li>
                <li>You'll be redirected to the app's setup page within your Shopify admin</li>
              </ol>
              
              <h3>Initial Setup</h3>
              <p>
                After installing the app, you'll need to complete a few setup steps:
              </p>
              
              <ol>
                <li>Choose your preferred scan frequency (daily, weekly, or monthly)</li>
                <li>Select which parts of your store to scan (theme, products, checkout)</li>
                <li>Configure notification preferences</li>
                <li>Choose whether to enable the accessibility badge</li>
                <li>Start your first accessibility scan</li>
              </ol>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                    <p className="mt-2 text-sm text-yellow-700">
                      The initial scan may take 15-30 minutes depending on the size of your store. 
                      You can continue to use your Shopify admin while the scan runs in the background.
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
                The AccessWeb Shopify app offers extensive configuration options to customize your accessibility testing:
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
                    <td className="px-6 py-4 text-sm text-gray-500">How often the app scans your store for accessibility issues</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Weekly</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Scan Scope</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Which parts of your store to scan</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">All</td>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Email Notifications</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Send email notifications for new issues</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">On</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Advanced Settings</h3>
              <p>
                Additional configuration options for more precise control:
              </p>
              <ul>
                <li><strong>Excluded Pages</strong>: Specify pages to exclude from scanning</li>
                <li><strong>Custom Test Rules</strong>: Enable or disable specific accessibility tests</li>
                <li><strong>Custom CSS Selectors</strong>: Define specific elements to test or ignore</li>
                <li><strong>JavaScript Timeout</strong>: Set how long to wait for JavaScript to load</li>
                <li><strong>Mobile Testing</strong>: Enable or disable mobile-specific tests</li>
              </ul>
              
              <h3>Notification Settings</h3>
              <p>
                Configure when and how you receive notifications:
              </p>
              <ul>
                <li><strong>Email Notifications</strong>: Configure recipients and frequency</li>
                <li><strong>Slack Integration</strong>: Send notifications to a Slack channel</li>
                <li><strong>SMS Alerts</strong>: Receive text messages for critical issues</li>
                <li><strong>Notification Thresholds</strong>: Set severity thresholds for notifications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shopify Dashboard Section */}
        <div id="dashboard" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <PenTool className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Shopify Dashboard</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                The AccessWeb app adds a dedicated dashboard to your Shopify admin where you can 
                monitor and manage accessibility issues.
              </p>
              
              <h3>Dashboard Overview</h3>
              <p>
                The main dashboard provides at-a-glance insights into your store's accessibility status:
              </p>
              <ul>
                <li><strong>Accessibility Score</strong>: Your store's overall accessibility rating</li>
                <li><strong>Issue Summary</strong>: Total issues broken down by severity (critical, serious, moderate, minor)</li>
                <li><strong>Compliance Status</strong>: Your store's WCAG compliance status</li>
                <li><strong>Recent Scans</strong>: Results from your most recent accessibility scans</li>
                <li><strong>Trend Analysis</strong>: Charts showing how your accessibility score has changed over time</li>
              </ul>
              
              <h3>Store Health Metrics</h3>
              <p>
                The dashboard also includes key metrics about your store's accessibility health:
              </p>
              <ul>
                <li><strong>Theme Health</strong>: Overall accessibility of your store theme</li>
                <li><strong>Product Page Health</strong>: Accessibility score for product pages</li>
                <li><strong>Collection Page Health</strong>: Accessibility score for collection pages</li>
                <li><strong>Checkout Health</strong>: Accessibility score for the checkout process</li>
                <li><strong>Mobile Experience</strong>: Accessibility score for mobile devices</li>
              </ul>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Pro Tip</h3>
                    <p className="mt-2 text-sm text-green-700">
                      Pin the AccessWeb app to your Shopify admin navigation for quick access. You can do this
                      by clicking the "Pin" icon in the app list in your Shopify admin.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Analysis Section */}
        <div id="theme-analysis" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Theme Analysis</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                The AccessWeb app provides comprehensive theme analysis to identify and fix accessibility issues in your Shopify theme.
              </p>
              
              <h3>Theme Scanning Features</h3>
              <ul>
                <li><strong>Template Analysis</strong>: Scans all theme templates (home, collection, product, cart, etc.)</li>
                <li><strong>Liquid Code Review</strong>: Analyzes your theme's Liquid code for accessibility issues</li>
                <li><strong>CSS Analysis</strong>: Examines CSS for potential accessibility problems</li>
                <li><strong>JavaScript Review</strong>: Checks for JavaScript accessibility issues</li>
                <li><strong>Theme Element Testing</strong>: Tests specific theme elements (header, footer, navigation, etc.)</li>
              </ul>
              
              <h3>Common Theme Issues</h3>
              <p>
                The app identifies and helps fix common theme accessibility issues such as:
              </p>
              <ul>
                <li><strong>Color Contrast</strong>: Insufficient contrast between text and background</li>
                <li><strong>Missing Alt Text</strong>: Images without alternative text</li>
                <li><strong>Keyboard Navigation</strong>: Elements that can't be accessed via keyboard</li>
                <li><strong>Form Labels</strong>: Form fields without proper labels</li>
                <li><strong>ARIA Attributes</strong>: Missing or incorrect ARIA attributes</li>
                <li><strong>Heading Structure</strong>: Improper heading hierarchy</li>
                <li><strong>Focus Indicators</strong>: Invisible or insufficient focus indicators</li>
              </ul>
              
              <h3>Theme Customizer Integration</h3>
              <p>
                The app integrates with the Shopify Theme Customizer to provide:
              </p>
              <ul>
                <li><strong>Real-time Feedback</strong>: Get accessibility feedback as you customize your theme</li>
                <li><strong>Visual Indicators</strong>: Highlight accessibility issues directly in the customizer</li>
                <li><strong>Suggested Fixes</strong>: See suggestions for fixing issues without coding</li>
                <li><strong>Theme Settings</strong>: Recommended theme settings for better accessibility</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Product Pages Section */}
        <div id="product-pages" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Package className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Product Page Testing</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Product pages are critical for e-commerce accessibility. Our app provides specialized testing for product pages.
              </p>
              
              <h3>Product Page Elements Tested</h3>
              <ul>
                <li><strong>Product Images</strong>: Alt text and image descriptions</li>
                <li><strong>Product Titles</strong>: Proper heading structure</li>
                <li><strong>Product Descriptions</strong>: Readability and clarity</li>
                <li><strong>Product Variants</strong>: Accessible variant selectors</li>
                <li><strong>Add to Cart Buttons</strong>: Keyboard accessibility and ARIA attributes</li>
                <li><strong>Price Information</strong>: Proper markup for price data</li>
                <li><strong>Quantity Selectors</strong>: Accessible number inputs</li>
                <li><strong>Related Products</strong>: Accessible related product carousels</li>
              </ul>
              
              <h3>E-commerce Specific Tests</h3>
              <p>
                The app includes tests specifically designed for e-commerce functionality:
              </p>
              <ul>
                <li><strong>SKU/Barcode Accessibility</strong>: Proper presentation of product identifiers</li>
                <li><strong>Inventory Status</strong>: Accessible "in stock" / "out of stock" indicators</li>
                <li><strong>Sale Prices</strong>: Accessible price display for items on sale</li>
                <li><strong>Size Charts</strong>: Accessible size charts and guides</li>
                <li><strong>Product Reviews</strong>: Accessible customer review sections</li>
                <li><strong>Shipping Information</strong>: Clearly conveyed shipping details</li>
              </ul>
              
              <h3>Product Content Enhancement</h3>
              <p>
                The app can help improve your product content for better accessibility:
              </p>
              <ul>
                <li><strong>Alt Text Generator</strong>: Suggests descriptive alt text for product images</li>
                <li><strong>Description Readability</strong>: Evaluates and improves product description readability</li>
                <li><strong>Structured Data Validation</strong>: Ensures proper product schema markup</li>
                <li><strong>Color Contrast Checker</strong>: Verifies sufficient contrast for product information</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Checkout Flow Section */}
        <div id="checkout-flow" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Checkout Flow Analysis</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                A critical part of e-commerce accessibility is ensuring that the checkout process is fully accessible to all users.
              </p>
              
              <h3>Checkout Flow Testing</h3>
              <p>
                The app analyzes the entire checkout process for accessibility issues:
              </p>
              <ul>
                <li><strong>Cart Page</strong>: Tests the shopping cart for accessibility</li>
                <li><strong>Checkout Steps</strong>: Analyzes each step of the checkout process</li>
                <li><strong>Form Fields</strong>: Tests all checkout form fields for proper labeling and keyboard access</li>
                <li><strong>Validation Errors</strong>: Ensures error messages are properly announced to screen readers</li>
                <li><strong>Order Summary</strong>: Tests the order summary for proper structure</li>
                <li><strong>Payment Options</strong>: Analyzes payment method selectors</li>
                <li><strong>Shipping Options</strong>: Tests shipping option selections</li>
                <li><strong>Confirmation Page</strong>: Ensures order confirmation is accessible</li>
              </ul>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Checkout Testing Limitations</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Due to Shopify's checkout restrictions, some aspects of the checkout may not be fully testable 
                        or modifiable, especially for stores not on Shopify Plus. The app will identify issues but may 
                        not be able to automatically fix them.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3>Checkout Optimization Recommendations</h3>
              <p>
                Based on the checkout analysis, the app provides recommendations to optimize your checkout for accessibility:
              </p>
              <ul>
                <li><strong>Form Layout Improvements</strong>: Suggested changes to form layout and structure</li>
                <li><strong>Input Field Enhancements</strong>: Recommendations for improved form fields</li>
                <li><strong>Error Handling</strong>: Better error messaging and validation</li>
                <li><strong>Progress Indication</strong>: Clearer step indicators for multi-page checkout</li>
                <li><strong>Mobile Optimization</strong>: Specific recommendations for mobile checkout accessibility</li>
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
                The AccessWeb app can automatically fix many common accessibility issues in your Shopify store.
              </p>
              
              <h3>Theme Fix Capabilities</h3>
              <p>
                The app can automatically fix various theme-related accessibility issues:
              </p>
              <ul>
                <li><strong>Alt Text Generation</strong>: Add missing alt text to images</li>
                <li><strong>Color Contrast Adjustments</strong>: Fix insufficient color contrast</li>
                <li><strong>Form Label Addition</strong>: Add missing form labels</li>
                <li><strong>ARIA Attribute Correction</strong>: Fix incorrect ARIA attributes</li>
                <li><strong>Heading Structure Fixes</strong>: Correct improper heading hierarchy</li>
                <li><strong>Link Text Enhancement</strong>: Improve generic link text</li>
                <li><strong>Keyboard Navigation Fixes</strong>: Make elements keyboard accessible</li>
              </ul>
              
              <h3>Fix Application Options</h3>
              <p>
                You can choose how automated fixes are applied to your store:
              </p>
              <ul>
                <li><strong>One-Click Fixes</strong>: Apply individual fixes with a single click</li>
                <li><strong>Bulk Fixes</strong>: Apply multiple fixes at once</li>
                <li><strong>Scheduled Fixes</strong>: Schedule fixes to be applied automatically</li>
                <li><strong>Theme Update</strong>: Apply fixes directly to your theme files</li>
                <li><strong>Real-time Fixes</strong>: Apply fixes via JavaScript without changing theme files</li>
              </ul>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                    <p className="mt-2 text-sm text-yellow-700">
                      We recommend creating a backup of your theme before applying bulk fixes. 
                      While our fix engine is designed to be safe, it's always good practice to have a backup.
                    </p>
                  </div>
                </div>
              </div>
              
              <h3>Fix Management</h3>
              <p>
                The app provides tools to manage and monitor applied fixes:
              </p>
              <ul>
                <li><strong>Fix History</strong>: View a log of all applied fixes</li>
                <li><strong>Revert Option</strong>: Revert any applied fix if needed</li>
                <li><strong>Fix Impact Analysis</strong>: See how fixes affect your accessibility score</li>
                <li><strong>Fix Notifications</strong>: Get notified when fixes are applied</li>
              </ul>
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
                Show your commitment to accessibility by displaying an accessibility badge on your Shopify store.
              </p>
              
              <h3>Badge Features</h3>
              <ul>
                <li><strong>Displays Accessibility Score</strong>: Shows your store's current accessibility rating</li>
                <li><strong>Certification Status</strong>: Indicates WCAG compliance level (A, AA, AAA)</li>
                <li><strong>Accessible Panel</strong>: Opens a detailed accessibility panel for visitors</li>
                <li><strong>Last Verified Date</strong>: Shows when your store was last verified</li>
              </ul>
              
              <h3>Badge Styles</h3>
              <p>
                Choose from multiple badge styles to match your store design:
              </p>
              <ul>
                <li><strong>Floating Badge</strong>: Small badge that floats in a corner of your site</li>
                <li><strong>Footer Badge</strong>: Badge designed to be placed in your footer</li>
                <li><strong>Minimal Badge</strong>: Simplified version with just the essentials</li>
                <li><strong>Custom Badge</strong>: Fully customizable badge to match your branding</li>
              </ul>
              
              <h3>Badge Placement</h3>
              <p>
                You can place the badge on your store in several ways:
              </p>
              <ol>
                <li><strong>Automatic Placement</strong>: Enable in app settings for automatic placement</li>
                <li><strong>Theme Editor</strong>: Add via the theme editor as a section or block</li>
                <li><strong>Manual Installation</strong>: Copy and paste the badge code into your theme files</li>
              </ol>
              
              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 text-sm">
                {`<!-- AccessWeb Badge Code -->
<script src="https://cdn.accessweb.com/badge.js" 
  data-shop="{{ shop.permanent_domain }}" 
  data-position="bottom-right"
  data-style="standard">
</script>`}
              </pre>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Pro Tip</h3>
                    <p className="mt-2 text-sm text-green-700">
                      The accessibility badge can help boost customer confidence and demonstrate your commitment to
                      inclusive shopping. Stores with accessibility badges often see higher conversion rates from
                      visitors with disabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Webhooks Section */}
        <div id="webhooks" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Webhook className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Webhooks & Notifications</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Stay informed about your store's accessibility status with webhooks and notifications.
              </p>
              
              <h3>Notification Channels</h3>
              <p>
                The app supports multiple notification channels:
              </p>
              <ul>
                <li><strong>Email Notifications</strong>: Receive email alerts about accessibility issues</li>
                <li><strong>Shopify Admin Notifications</strong>: Get notifications in your Shopify admin</li>
                <li><strong>Slack Integration</strong>: Send notifications to a Slack channel</li>
                <li><strong>SMS Alerts</strong>: Receive text messages for critical issues</li>
                <li><strong>Webhook Notifications</strong>: Send data to external systems via webhooks</li>
              </ul>
              
              <h3>Webhook Events</h3>
              <p>
                Configure webhooks for various accessibility events:
              </p>
              <ul>
                <li><strong>Scan Completed</strong>: Triggered when an accessibility scan completes</li>
                <li><strong>New Issue Detected</strong>: Triggered when a new accessibility issue is found</li>
                <li><strong>Issue Fixed</strong>: Triggered when an issue is fixed</li>
                <li><strong>Score Changed</strong>: Triggered when your accessibility score changes</li>
                <li><strong>Compliance Status Changed</strong>: Triggered when your compliance status changes</li>
              </ul>
              
              <h3>Webhook Setup</h3>
              <p>
                Setting up webhooks is straightforward:
              </p>
              <ol>
                <li>In the app settings, go to the "Webhooks" section</li>
                <li>Click "Add Webhook"</li>
                <li>Enter the webhook URL where data should be sent</li>
                <li>Select the events you want to trigger the webhook</li>
                <li>Set any filters if needed</li>
                <li>Save the webhook configuration</li>
              </ol>
              
              <h3>Webhook Payload Example</h3>
              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 text-sm">
                {`{
  "event": "scan_completed",
  "store": "your-store.myshopify.com",
  "timestamp": "2023-04-18T14:22:35Z",
  "data": {
    "scan_id": "scan_12345",
    "accessibility_score": 87,
    "issues_count": {
      "critical": 2,
      "serious": 5,
      "moderate": 12,
      "minor": 8
    },
    "compliance_status": "AA_partial",
    "pages_scanned": 45
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* API Integration Section */}
        <div id="api" className="bg-white rounded-xl shadow-sm mb-12">
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-center mb-6">
              <Code className="w-6 h-6 text-blue-600" />
              <h2 className="ml-3 text-2xl font-bold text-gray-900">Shopify API Integration</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p>
                For advanced users and developers, the AccessWeb app provides integration with the Shopify API.
              </p>
              
              <h3>API Capabilities</h3>
              <p>
                The app can interact with various Shopify APIs:
              </p>
              <ul>
                <li><strong>Theme API</strong>: Read and modify theme files</li>
                <li><strong>Product API</strong>: Access product data for accessibility testing</li>
                <li><strong>Store API</strong>: Access store settings and configuration</li>
                <li><strong>Metafield API</strong>: Store accessibility data in metafields</li>
                <li><strong>Asset API</strong>: Manage theme assets for accessibility improvements</li>
              </ul>
              
              <h3>Integration with Custom Apps</h3>
              <p>
                Developers can integrate the AccessWeb app with custom Shopify apps:
              </p>
              <ul>
                <li><strong>Accessibility Data Access</strong>: Access accessibility data via API</li>
                <li><strong>Trigger Scans</strong>: Trigger accessibility scans programmatically</li>
                <li><strong>Apply Fixes</strong>: Apply accessibility fixes via API</li>
                <li><strong>Custom Reporting</strong>: Build custom accessibility reports</li>
              </ul>
              
              <h3>GraphQL API Example</h3>
              <pre className="bg-gray-800 text-gray-100 rounded-lg p-4 text-sm">
                {`// Example: Fetch accessibility data for a specific product
const QUERY = \`
  query GetProductAccessibility($productId: ID!) {
    accessibilityData(productId: $productId) {
      score
      issues {
        id
        type
        severity
        element
        description
        suggestedFix
      }
      lastScanned
    }
  }
\`;

// Using fetch to call the AccessWeb API
fetch('https://api.accessweb.com/shopify/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': 'your_access_token'
  },
  body: JSON.stringify({
    query: QUERY,
    variables: {
      productId: 'gid://shopify/Product/1234567890'
    }
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
              </pre>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">API Documentation</h3>
                    <p className="mt-2 text-sm text-blue-700">
                      For complete API documentation, visit our <a href="/docs/api" className="text-blue-600 hover:underline">API Reference</a> or contact our developer support team.
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
                  <h3>App doesn't appear in my Shopify admin</h3>
                  <p>
                    This can happen due to caching or installation issues:
                  </p>
                  <ul>
                    <li>Try refreshing your browser or clearing cache</li>
                    <li>Log out of Shopify admin and log back in</li>
                    <li>Check if the app is listed in the "Apps" section</li>
                    <li>Try reinstalling the app if necessary</li>
                  </ul>
                </div>
                
                <div>
                  <h3>Scans are timing out or failing</h3>
                  <p>
                    This could be due to site size or complexity:
                  </p>
                  <ul>
                    <li>Reduce the scan scope in the app settings</li>
                    <li>Check for JavaScript errors on your site</li>
                    <li>Try limiting the number of pages to scan</li>
                    <li>Ensure your theme isn't blocking the scanner</li>
                  </ul>
                </div>
                
                <div>
                  <h3>Auto-fixes are not applying correctly</h3>
                  <p>
                    This may be due to theme compatibility issues:
                  </p>
                  <ul>
                    <li>Check for theme customizations that might conflict</li>
                    <li>Verify that your theme is compatible with the app</li>
                    <li>Try applying fixes manually through the theme editor</li>
                    <li>Contact our support team for assistance with complex themes</li>
                  </ul>
                </div>
                
                <div>
                  <h3>Badge is not displaying on my store</h3>
                  <p>
                    Badge display issues can be caused by:
                  </p>
                  <ul>
                    <li>Theme customizations blocking the badge script</li>
                    <li>JavaScript errors from other apps</li>
                    <li>Incorrect badge installation</li>
                    <li>Content Security Policy restrictions</li>
                  </ul>
                </div>
              </div>
              
              <h3>Contacting Support</h3>
              <p>
                If you're unable to resolve an issue, please contact our support team:
              </p>
              <ul>
                <li><strong>In-App Support</strong>: Click the "Help" button in the app</li>
                <li><strong>Email Support</strong>: support@accessweb.com</li>
                <li><strong>Documentation</strong>: Visit our <a href="/help" className="text-blue-600 hover:underline">Help Center</a></li>
                <li><strong>Live Chat</strong>: Available during business hours</li>
              </ul>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Debug Mode</h3>
                    <p className="mt-2 text-sm text-blue-700">
                      For technical issues, you can enable Debug Mode in the app settings. This will provide
                      detailed logs that our support team can use to help diagnose problems.
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
                  <h3>Will the app slow down my Shopify store?</h3>
                  <p>
                    No, the AccessWeb app is designed to have minimal impact on your store's performance.
                    The scanning process runs in the background and doesn't affect your customers' shopping experience.
                    The badge script is lightweight and loads asynchronously.
                  </p>
                </div>
                
                <div>
                  <h3>Is the app compatible with all Shopify themes?</h3>
                  <p>
                    The app is compatible with all standard Shopify themes and most third-party themes.
                    Some highly customized themes may have limitations with automatic fixes, but the scanning
                    and reporting features will still work.
                  </p>
                </div>
                
                <div>
                  <h3>Can I use the app on multiple Shopify stores?</h3>
                  <p>
                    Yes, you can use the app on multiple stores by installing it on each store separately.
                    Each store will require its own subscription, though multi-store discounts are available
                    for Professional and Enterprise plans.
                  </p>
                </div>
                
                <div>
                  <h3>How often should I scan my store?</h3>
                  <p>
                    For most stores, a weekly scan is sufficient. However, if you frequently update products
                    or content, daily scans are recommended. E-commerce sites with frequent changes should
                    consider real-time monitoring for the best results.
                  </p>
                </div>
                
                <div>
                  <h3>Will the app make my store fully WCAG compliant?</h3>
                  <p>
                    While the app can identify and fix many accessibility issues, achieving full WCAG compliance
                    may require some manual adjustments depending on your theme and content. The app will guide you
                    through any issues that cannot be automatically fixed.
                  </p>
                </div>
                
                <div>
                  <h3>Does the app work with Shopify 2.0 themes?</h3>
                  <p>
                    Yes, the app fully supports Shopify 2.0 themes and their features, including sections everywhere
                    and app blocks. The app can analyze and improve accessibility for these newer theme features.
                  </p>
                </div>
                
                <div>
                  <h3>Can I customize the accessibility badge?</h3>
                  <p>
                    Yes, the app offers several customization options for the accessibility badge, including
                    positioning, style, and color. Professional and Enterprise plans also offer fully custom
                    badge designs to match your brand.
                  </p>
                </div>
                
                <div>
                  <h3>Does the app test on mobile devices?</h3>
                  <p>
                    Yes, the app tests your store on both desktop and mobile viewports to ensure accessibility
                    across all devices. The reports will indicate any device-specific issues that need attention.
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
              <Link to="/help/shopify-app-tutorial" className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Shopify App Video Tutorial
                </h3>
                <p className="text-gray-600">
                  Step-by-step video guide to setting up and using the AccessWeb Shopify app.
                </p>
              </Link>
              
              <Link to="/knowledge-base/wcag-compliance-guide" className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  WCAG Compliance Guide
                </h3>
                <p className="text-gray-600">
                  Learn about WCAG guidelines and how to ensure your Shopify store meets them.
                </p>
              </Link>
              
              <Link to="/blog/shopify-accessibility-best-practices" className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-6 transition duration-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Shopify Accessibility Best Practices
                </h3>
                <p className="text-gray-600">
                  Essential tips for making your Shopify store more accessible to all users.
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