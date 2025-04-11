import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WordPressSetup } from '../../components/integrations/WordPressSetup';
import { toast } from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';
import type { WordPressSettings } from '../../types/integrations';
import { wordPressAPI } from '../../lib/integrations/wordpress';

export function WordPressSetupPage() {
  const [connected, setConnected] = useState(false);
  const [settings, setSettings] = useState<WordPressSettings | null>(null);

  // Load saved settings on component mount
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        // Get settings from storage
        const savedSettings = await wordPressAPI.getSettings('', '');
        
        if (savedSettings && savedSettings.apiKey && savedSettings.siteUrl) {
          setSettings(savedSettings);
          
          // Check if connection is valid
          const isValid = await wordPressAPI.validateAPIKey(
            savedSettings.apiKey, 
            savedSettings.siteUrl
          );
          
          setConnected(isValid);
        }
      } catch (error) {
        console.error('Failed to load WordPress settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSaveSettings = (newSettings: WordPressSettings) => {
    setSettings(newSettings);
    toast.success('WordPress settings saved successfully');
  };

  const handleTestSuccess = () => {
    setConnected(true);
    toast.success('WordPress connection verified successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            WordPress Integration Setup
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect your WordPress site to enable accessibility monitoring, automated fixes, and compliance reporting.
          </p>
        </div>

        {/* Connection Status */}
        {settings && (
          <div className={`mb-8 p-4 rounded-lg ${connected ? 'bg-green-50 border border-green-100' : 'bg-yellow-50 border border-yellow-100'}`}>
            <div className="flex items-center">
              {connected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">
                    Connected to WordPress site: {settings.siteUrl}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-5 w-5 bg-yellow-400 rounded-full mr-2" />
                  <span className="text-yellow-700 font-medium">
                    WordPress site not connected. Please configure your settings below.
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* WordPress Setup Form */}
        <div className="mb-16">
          <WordPressSetup 
            settings={settings} 
            onSave={handleSaveSettings} 
            onTestSuccess={handleTestSuccess} 
          />
        </div>

        {/* Related Links */}
        {connected && (
          <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Manage WordPress Scans</h2>
              <p className="text-gray-600 mb-4">
                Run scans, view results, and apply auto-fixes to your WordPress site.
              </p>
              <Link
                to="/integrations/wordpress/scans"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Scans
              </Link>
            </div>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">WordPress Monitoring Tools</h2>
              <p className="text-gray-600 mb-4">
                Get custom widgets, badges, and monitoring scripts for your WordPress site.
              </p>
              <Link
                to="/integrations/wordpress/tools"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                View Tools
              </Link>
            </div>
          </div>
        )}

        {/* Documentation */}
        <div className="bg-white shadow-sm rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">WordPress Integration Documentation</h2>
          <div className="prose max-w-none">
            <p>
              Our WordPress integration allows you to seamlessly monitor and improve the accessibility 
              of your WordPress site. With our plugin, you can:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Automatically detect accessibility issues across your entire site</li>
              <li>Apply automated fixes for common WCAG compliance problems</li>
              <li>Monitor your site in real-time for new accessibility issues</li>
              <li>Generate compliance reports to track your accessibility status</li>
              <li>Display accessibility badges to showcase your commitment to inclusivity</li>
            </ul>
            <h3 className="mt-6 text-xl font-semibold">Getting Started</h3>
            <ol className="mt-2 space-y-2">
              <li>Install the AccessWeb WordPress plugin from the WordPress plugin directory</li>
              <li>Generate an API key in your WordPress admin panel</li>
              <li>Enter your site URL and API key in the setup form above</li>
              <li>Configure your monitoring and notification preferences</li>
              <li>Run your first accessibility scan to find and fix issues</li>
            </ol>
            <p className="mt-4">
              For more detailed instructions, please visit our{" "}
              <Link to="/docs/wordpress" className="text-blue-600 hover:text-blue-800 font-medium">
                complete WordPress integration guide
              </Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}