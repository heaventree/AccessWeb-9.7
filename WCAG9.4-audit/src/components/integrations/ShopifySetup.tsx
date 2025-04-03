import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Key, Globe, ArrowRight, Settings, Copy, Check, Shield, RefreshCw, ExternalLink } from 'lucide-react';
import { Container } from '../Container';
import { useContainerId } from '../../contexts/ContainerIdContext';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface ShopifySetupProps {
  apiKey?: string;
  shopUrl?: string;
}

export function ShopifySetup({ apiKey, shopUrl }: ShopifySetupProps) {
  const [showCopied, setShowCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'manual'>('weekly');
  const [excludedPaths, setExcludedPaths] = useState('');
  const [notificationEmail, setNotificationEmail] = useState('');
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const handleCopyClick = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const handleRegenerateClick = () => {
    setShowRegenerateConfirm(true);
  };

  const handleRegenerateConfirm = () => {
    // API call to regenerate key would go here
    setShowRegenerateConfirm(false);
  };

  const handleRegenerateCancel = () => {
    setShowRegenerateConfirm(false);
  };

  return (
    <div className="space-y-8">
      {/* Header with green accent */}
      <Container className="bg-green-50 p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-green-800 mb-3">Shopify Integration Setup</h1>
        <p className="text-gray-700 mb-4">
          Integrate WCAG accessibility scanning directly into your Shopify store with our official app.
        </p>
        <div className="flex items-center text-green-700">
          <Link to="/my-account/connections" className="flex items-center hover:underline">
            <ArrowRight className="w-4 h-4 mr-1" />
            <span>Return to My Connections</span>
          </Link>
        </div>
      </Container>

      {/* Store Connection Status */}
      {shopUrl && (
        <Container className="bg-white p-6 rounded-lg shadow border-t-4 border-green-500">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-green-500 mr-2" />
            <h2 className="text-xl font-medium">Connected Store</h2>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600 mb-1">Your Shopify store is connected:</p>
              <div className="flex items-center">
                <span className="font-medium">{shopUrl}</span>
                <a 
                  href={`https://${shopUrl}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center ml-2 text-green-600 hover:text-green-800"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  <span>Visit Store</span>
                </a>
              </div>
            </div>
            <div className="flex items-center bg-green-100 px-3 py-1 rounded-full text-green-800">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Connected
            </div>
          </div>
        </Container>
      )}

      {/* API Key Section */}
      <Container className="bg-white p-6 rounded-lg shadow border-t-4 border-green-500">
        <div className="flex items-center mb-4">
          <Shield className="w-5 h-5 text-green-500 mr-2" />
          <h2 className="text-xl font-medium">API Key</h2>
        </div>

        {apiKey ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Use this API key to authenticate your Shopify app with our service.
              Keep this key secure—it uniquely identifies your account.
            </p>

            <div className="flex items-center">
              <div className="flex-grow p-3 bg-gray-50 rounded-l-md border border-r-0 border-gray-300 font-mono text-sm">
                {apiKey}
              </div>
              <button
                onClick={handleCopyClick}
                className="p-3 bg-green-100 hover:bg-green-200 rounded-r-md border border-green-300 text-green-700 transition duration-150"
                aria-label="Copy API key to clipboard"
              >
                {showCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>

            {showRegenerateConfirm ? (
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <p className="text-yellow-800 mb-3">
                  Are you sure you want to regenerate your API key? Your existing integrations will stop working until you update them with the new key.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={handleRegenerateConfirm}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition duration-150"
                  >
                    Yes, Regenerate
                  </button>
                  <button
                    onClick={handleRegenerateCancel}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-right">
                <button
                  onClick={handleRegenerateClick}
                  className="flex items-center ml-auto px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition duration-150"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Key
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              You haven't generated an API key for Shopify yet. Generate a key to get started with the integration.
            </p>
            <div className="text-right">
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-150"
              >
                Generate API Key
              </button>
            </div>
          </div>
        )}
      </Container>

      {/* Installation Instructions */}
      <Container className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <Key className="w-5 h-5 text-green-500 mr-2" />
          <h2 className="text-xl font-medium">Installation Instructions</h2>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">
            Follow these steps to integrate the WCAG scanner with your Shopify store:
          </p>

          <ol className="space-y-4 list-decimal list-inside">
            <li className="text-gray-700">
              <span className="font-medium">Install the app</span>
              <p className="ml-6 mt-1 text-gray-600">
                Visit the Shopify App Store and search for "WCAG Accessibility Scanner" or click the button below to install directly.
              </p>
              <a
                href="https://apps.shopify.com/wcag-accessibility-scanner"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-6 mt-2 inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-150"
              >
                Install from Shopify App Store
              </a>
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Connect your store</span>
              <p className="ml-6 mt-1 text-gray-600">
                Follow the prompts in Shopify to authorize the app and connect it to your store.
              </p>
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Enter your API key</span>
              <p className="ml-6 mt-1 text-gray-600">
                Once installed, enter the API key shown above to connect your Shopify store to our service.
              </p>
            </li>
            <li className="text-gray-700">
              <span className="font-medium">Configure scan settings</span>
              <p className="ml-6 mt-1 text-gray-600">
                Choose which pages to scan, how often to run scans, and how to display accessibility information to your customers.
              </p>
            </li>
          </ol>
        </div>
      </Container>

      {/* Advanced Settings */}
      <Container className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <Settings className="w-5 h-5 text-green-500 mr-2" />
          <h2 className="text-xl font-medium">Advanced Settings</h2>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition duration-150"
        >
          {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Scan Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly' | 'manual')}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual Only</option>
              </select>
              <p className="mt-1 text-gray-500 text-sm">How often should automatic scans run on your Shopify store</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Excluded Paths</label>
              <textarea
                value={excludedPaths}
                onChange={(e) => setExcludedPaths(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                rows={3}
                placeholder="/admin/*, /cart/*, /account/*"
              ></textarea>
              <p className="mt-1 text-gray-500 text-sm">Enter paths to exclude from scanning, one per line. Supports * wildcard.</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Notification Email</label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="store-owner@example.com"
              />
              <p className="mt-1 text-gray-500 text-sm">Receive scan reports and accessibility alerts at this email address</p>
            </div>

            <div className="pt-4 text-right">
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition duration-150"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}