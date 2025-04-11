import React, { useState, useEffect } from 'react';
import { WordPressSetup } from '../../components/integrations/WordPressSetup';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Zap, Shield, Code, CheckCircle } from 'lucide-react';
import { wordPressAPI } from '../../lib/integrations/wordpress';
import { toast } from 'react-hot-toast';
import type { WordPressSettings } from '../../types/integrations';

export function WordPressAPIPage() {
  const [connected, setConnected] = useState(false);
  const [settings, setSettings] = useState<WordPressSettings | undefined>();
  const [loading, setLoading] = useState(true);

  // Load saved settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSaveSettings = (newSettings: WordPressSettings) => {
    setSettings(newSettings);
    setConnected(true);
    toast.success('WordPress settings saved successfully');
  };

  const handleTestSuccess = () => {
    setConnected(true);
    toast.success('WordPress connection verified successfully');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          WordPress API Integration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Connect your WordPress site with our accessibility testing tools
        </p>
        <Link 
          to="/my-account/connections" 
          className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to My Connections
        </Link>
      </div>
      
      {/* Connection Status */}
      {!loading && settings && (
        <div className={`mb-8 p-4 rounded-lg ${connected ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800'}`}>
          <div className="flex items-center">
            {connected ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Connected to WordPress site: {settings.siteUrl}
                </span>
              </>
            ) : (
              <>
                <span className="h-5 w-5 bg-yellow-400 dark:bg-yellow-500 rounded-full mr-2" />
                <span className="text-yellow-700 dark:text-yellow-300 font-medium">
                  WordPress site not connected. Please configure your settings below.
                </span>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <WordPressSetup 
          settings={settings}
          onSave={handleSaveSettings}
          onTestSuccess={handleTestSuccess}
        />
      </div>
      
      {/* WordPress Benefits */}
      {connected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Zap className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Automated Testing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Schedule regular accessibility scans of your WordPress site and receive detailed reports.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Shield className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              WCAG Compliance
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ensure your WordPress site meets accessibility standards with real-time monitoring.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <Code className="h-8 w-8 text-blue-500 dark:text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Automated Fixes
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Let our system automatically fix common accessibility issues on your WordPress site.
            </p>
          </div>
        </div>
      )}
      
      {/* Call to Action */}
      {connected && (
        <div className="bg-blue-600 dark:bg-blue-700 rounded-lg shadow p-6 text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Ready to start monitoring your WordPress site?
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/my-account/wordpress/scans"
              className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-md transition duration-150"
            >
              Start Your First Scan
            </Link>
            <Link
              to="/my-account/wordpress/settings"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white border border-blue-500 font-medium rounded-md transition duration-150"
            >
              Configure Monitoring
            </Link>
          </div>
        </div>
      )}
      
      {/* Documentation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          WordPress Integration Documentation
        </h2>
        <div className="prose dark:prose-invert max-w-none">
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
          <h3 className="mt-6 text-lg font-semibold">Getting Started</h3>
          <ol className="mt-2 space-y-2">
            <li>Install the AccessWeb WordPress plugin from the WordPress plugin directory</li>
            <li>Generate an API key in your WordPress admin panel</li>
            <li>Enter your site URL and API key in the setup form above</li>
            <li>Configure your monitoring and notification preferences</li>
            <li>Run your first accessibility scan to find and fix issues</li>
          </ol>
          <p className="mt-4">
            For more detailed instructions, please visit our{" "}
            <Link to="/docs/wordpress" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
              complete WordPress integration guide
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}