import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Activity, Key, Info, Book, ArrowRight, ArrowLeft, CheckCircle, Globe, FileText, ShoppingBag, Store, X, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { shopifyAPI } from '../../lib/integrations/shopify';
import type { ShopifySettings } from '../../types/integrations';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export function ShopifySetup() {
  const [settings, setSettings] = useState<ShopifySettings>({
    apiKey: '',
    shop: '',
    accessToken: '',
    scanFrequency: 'weekly',
    autoFix: true,
    notifyAdmin: true,
    excludedPaths: [],
    theme: {
      id: '',
      name: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  // Load existing settings
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const savedSettings = await shopifyAPI.getSettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleValidateCredentials = async () => {
    try {
      setValidating(true);
      const isValid = await shopifyAPI.validateCredentials(settings.shop, settings.accessToken);
      
      if (isValid) {
        toast.success('Credentials validated successfully');
        
        // Get current theme
        const theme = await shopifyAPI.getCurrentTheme(settings.shop, settings.accessToken);
        setSettings({...settings, theme});
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to validate credentials');
    } finally {
      setValidating(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      // Validate credentials first
      const isValid = await shopifyAPI.validateCredentials(settings.shop, settings.accessToken);
      if (!isValid) {
        throw new Error('Invalid Shopify credentials');
      }
      
      // Get current theme
      const theme = await shopifyAPI.getCurrentTheme(settings.shop, settings.accessToken);
      
      // Save settings
      const result = await shopifyAPI.saveSettings({...settings, theme});
      
      if (result.success) {
        toast.success('Settings saved successfully');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Return to Connections Link */}
      <div className="mb-2">
        <Link 
          to="/my-account/connections" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to My Connections
        </Link>
      </div>
      {/* Shopify App Documentation Link */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start">
          <Book className="w-6 h-6 text-blue-600 mt-1" />
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-blue-900">Shopify App Setup</h2>
            <p className="mt-1 text-blue-700">
              Before connecting your Shopify store, you'll need to either install our app from the Shopify App Store or create a custom app in your Shopify admin. Follow our setup instructions to get started.
            </p>
            <div className="flex mt-3 space-x-3">
              <Link
                to="/docs/shopify"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Book className="w-5 h-5 mr-2" />
                View Documentation
              </Link>
              <button
                onClick={() => setShowInstructionsModal(true)}
                className="inline-flex items-center px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Setup Instructions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Credentials Management */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        {/* Shopify Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 pb-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">
                  Shopify Credentials
                </h2>
              </div>
              <span className="text-sm font-medium text-gray-500">
                Connect your Shopify store
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Why do we need these credentials?</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    To integrate with your Shopify store, we need access to your store through the Shopify API. 
                    This allows us to scan your theme for accessibility issues and provide fixes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="shop" className="block text-sm font-medium text-gray-700">
                Shopify Store URL
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="shop"
                  value={settings.shop}
                  onChange={(e) => setSettings({...settings, shop: e.target.value})}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="your-store.myshopify.com"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Your Shopify store URL (must end with .myshopify.com)
              </p>
            </div>

            <div>
              <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">
                Access Token
              </label>
              <div className="mt-1 relative">
                <input
                  type={showCredentials ? "text" : "password"}
                  id="accessToken"
                  value={settings.accessToken}
                  onChange={(e) => setSettings({...settings, accessToken: e.target.value})}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md pr-12"
                  placeholder="shpat_xxxxxxxxxxxxxxxxxxxx"
                />
                <button
                  type="button"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-blue-600 hover:text-blue-700"
                >
                  {showCredentials ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Access token from your custom Shopify app (starts with shpat_)
                <a 
                  href="https://admin.shopify.com/settings/apps/development" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  Get your access token →
                </a>
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleValidateCredentials}
                disabled={validating || !settings.shop || !settings.accessToken}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {validating ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Validating...
                  </>
                ) : (
                  'Validate Credentials'
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Shopify Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 border border-green-100 rounded-xl"
        >
          <div className="border-b border-gray-200 pb-5 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Store className="w-6 h-6 text-blue-600" />
                <h2 className="ml-3 text-lg font-medium text-gray-900">
                  Shopify Configuration
                </h2>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scanFrequency" className="block text-sm font-medium text-gray-700">
                  Scan Frequency
                </label>
                <select
                  id="scanFrequency"
                  value={settings.scanFrequency}
                  onChange={(e) => setSettings({ ...settings, scanFrequency: e.target.value })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  style={{ maxWidth: '280px' }}
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center space-x-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="autoFix"
                      name="autoFix"
                      type="checkbox"
                      checked={settings.autoFix}
                      onChange={(e) => setSettings({ ...settings, autoFix: e.target.checked })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="autoFix" className="font-medium text-gray-700">Auto-fix Issues</label>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="notifyAdmin"
                      name="notifyAdmin"
                      type="checkbox"
                      checked={settings.notifyAdmin}
                      onChange={(e) => setSettings({ ...settings, notifyAdmin: e.target.checked })}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="notifyAdmin" className="font-medium text-gray-700">Notify Admin</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="excludedPaths" className="block text-sm font-medium text-gray-700">
                Excluded Paths (one per line)
              </label>
              <div className="mt-1">
                <textarea
                  id="excludedPaths"
                  rows={3}
                  value={settings.excludedPaths.join('\n')}
                  onChange={(e) => setSettings({ ...settings, excludedPaths: e.target.value.split('\n').filter(p => p.trim()) })}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="/cart&#10;/products/sample-product&#10;/collections/all"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter paths that should be excluded from accessibility scanning
              </p>
            </div>

            {/* Theme information display */}
            {settings.theme && settings.theme.id && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Current Theme</h3>
                <div className="mt-2 flex items-center">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Store className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{settings.theme.name}</p>
                    <p className="text-xs text-gray-500">ID: {settings.theme.id}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={loading || !settings.shop || !settings.accessToken}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="-ml-1 mr-2 h-5 w-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Shopify Integration Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-start">
            <FileText className="w-6 h-6 text-blue-600 mt-1" />
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-900">Shopify Integration Steps</h3>
              <ol className="mt-2 text-blue-700 space-y-3 list-decimal list-inside">
                <li>Create a custom app in your Shopify admin panel</li>
                <li>Set up the appropriate API permissions (read/write access to themes)</li>
                <li>Generate an access token in your Shopify admin</li>
                <li>Enter your store URL and access token above</li>
                <li>Configure scanning options</li>
                <li>Save settings and start your first scan</li>
              </ol>
              <div className="mt-4">
                <Link
                  to="/help/shopify-integration-guide"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  Read the full integration guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Instructions Modal */}
      {showInstructionsModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowInstructionsModal(false)}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowInstructionsModal(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Shopify Integration Steps
                  </h3>
                  <div className="mt-4">
                    <ol className="list-decimal list-inside space-y-3 text-gray-600">
                      <li>Install our app from the Shopify App Store
                        <ul className="list-disc list-inside pl-6 mt-2 text-sm text-gray-500 space-y-1">
                          <li>Search for "WCAG Accessibility Scanner" in the Shopify App Store</li>
                          <li>Click "Add app" and follow the installation process</li>
                        </ul>
                      </li>
                      <li>Alternatively, if you prefer a custom app setup:
                        <ul className="list-disc list-inside pl-6 mt-2 text-sm text-gray-500 space-y-1">
                          <li>Go to your Shopify admin dashboard</li>
                          <li>Navigate to Settings &gt; Apps and sales channels</li>
                          <li>Click on "Develop apps for your store"</li>
                          <li>Create a new app with a descriptive name</li>
                          <li>Set up Admin API access with the following scopes: read_themes, write_themes, read_content, write_content</li>
                          <li>Install the app to your store</li>
                          <li>Copy the access token and enter it in the form above</li>
                          <li><a 
                              href="https://admin.shopify.com/settings/apps/development" 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Open Shopify app development page
                            </a> to generate your token
                          </li>
                        </ul>
                      </li>
                    </ol>
                    
                    <div className="mt-6 bg-blue-50 p-4 rounded-md">
                      <h4 className="font-medium text-blue-800">Important Security Note</h4>
                      <p className="mt-2 text-sm text-blue-700">
                        Your access token is sensitive information. We securely store and encrypt this token,
                        and only use it to scan and fix accessibility issues in your Shopify theme.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowInstructionsModal(false)}
                >
                  Got it
                </button>
                <Link
                  to="/docs/shopify"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  View Full Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}