import React, { useState } from 'react';
import { Globe, RefreshCw, Save, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import type { WordPressSettings } from '../../types/integrations';
import { wordPressAPI } from '../../lib/integrations/wordpress';

interface WordPressSetupProps {
  settings?: WordPressSettings;
  onSave?: (settings: WordPressSettings) => void;
  onTestSuccess?: () => void;
}

/**
 * WordPress Setup Component
 * 
 * Allows users to configure and test their WordPress site connection
 */
export function WordPressSetup({ settings: initialSettings, onSave, onTestSuccess }: WordPressSetupProps) {
  const [settings, setSettings] = useState<WordPressSettings>(initialSettings || {
    siteUrl: '',
    apiKey: '',
    autofixEnabled: true,
    monitoringEnabled: true,
    monitoringInterval: 1440, // 24 hours in minutes
    scanLevel: 'AA',
    notifyOnIssue: true,
    emailNotifications: []
  });
  
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    tested: boolean;
  }>({
    success: false,
    message: '',
    tested: false
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Validate the URL format
      if (!isValidUrl(settings.siteUrl)) {
        throw new Error('Please enter a valid WordPress site URL');
      }
      
      // Validate the API key
      if (!settings.apiKey || settings.apiKey.length < 32) {
        throw new Error('Please enter a valid API key');
      }
      
      // Check if the API key has been tested
      if (!testResult.tested || !testResult.success) {
        // Automatically test the connection before saving
        const isValid = await wordPressAPI.validateAPIKey(settings.apiKey, settings.siteUrl);
        
        if (!isValid) {
          throw new Error('Connection test failed. Please check your site URL and API key.');
        }
      }
      
      // Save settings through the API
      const response = await wordPressAPI.saveSettings(settings);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to save settings');
      }
      
      toast.success('WordPress settings saved successfully');
      
      // Call the parent callback if provided
      if (onSave) {
        onSave(settings);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save settings';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  // Test WordPress connection
  const testConnection = async () => {
    setTesting(true);
    setTestResult({ ...testResult, tested: true, message: 'Testing connection...' });
    
    try {
      // Validate URL format first
      if (!isValidUrl(settings.siteUrl)) {
        throw new Error('Please enter a valid WordPress site URL');
      }
      
      // Validate API key format (basic validation)
      if (!settings.apiKey || settings.apiKey.length < 32) {
        throw new Error('Please enter a valid API key (at least 32 characters)');
      }
      
      // Test connection with the API
      const isValid = await wordPressAPI.validateAPIKey(settings.apiKey, settings.siteUrl);
      
      if (!isValid) {
        throw new Error('Connection test failed. Please check your WordPress site URL and API key.');
      }
      
      setTestResult({
        success: true,
        message: 'Connection successful! Your WordPress site is properly configured.',
        tested: true
      });
      
      toast.success('WordPress connection successful');
      
      // Call success callback if provided
      if (onTestSuccess) {
        onTestSuccess();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection test failed';
      setTestResult({
        success: false,
        message,
        tested: true
      });
      toast.error(message);
    } finally {
      setTesting(false);
    }
  };

  // Helper function to validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      // Add protocol if missing
      const urlWithProtocol = url.match(/^https?:\/\//i) ? url : `https://${url}`;
      new URL(urlWithProtocol);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle email list changes
  const handleEmailChange = (emails: string) => {
    const emailList = emails
      .split(',')
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    setSettings(prev => ({ ...prev, emailNotifications: emailList }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <Globe className="w-6 h-6 text-blue-600" />
          <h2 className="ml-3 text-lg font-medium text-gray-900">
            WordPress Integration Setup
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* WordPress Site URL */}
        <div>
          <label htmlFor="site-url" className="block text-sm font-medium text-gray-700">
            WordPress Site URL
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="site-url"
              value={settings.siteUrl}
              onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
              placeholder="example.com or https://example.com"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter your WordPress site URL without trailing slashes.
          </p>
        </div>

        {/* API Key */}
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="password"
              id="api-key"
              value={settings.apiKey}
              onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
              className="flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Enter your WordPress API key"
              required
            />
            <button
              type="button"
              onClick={testConnection}
              disabled={testing || !settings.siteUrl || !settings.apiKey}
              className="relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
            >
              {testing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                'Test Connection'
              )}
            </button>
          </div>
          
          {/* Connection test result message */}
          {testResult.tested && (
            <div className={`mt-2 text-sm flex items-center ${testResult.success ? 'text-green-600' : 'text-red-600'}`}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 mr-1" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-1" />
              )}
              {testResult.message}
            </div>
          )}
          
          <p className="mt-2 text-sm text-gray-500">
            Generate an API key in the AccessWeb plugin settings in your WordPress admin.
          </p>
        </div>

        {/* Scan Level */}
        <div>
          <label htmlFor="scan-level" className="block text-sm font-medium text-gray-700">
            WCAG Compliance Level
          </label>
          <select
            id="scan-level"
            value={settings.scanLevel}
            onChange={(e) => setSettings(prev => ({ ...prev, scanLevel: e.target.value as 'A' | 'AA' | 'AAA' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="A">WCAG A (Minimum Level)</option>
            <option value="AA">WCAG AA (Standard Level - Recommended)</option>
            <option value="AAA">WCAG AAA (Maximum Level)</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Select the WCAG level to test against. AA is the most common standard.
          </p>
        </div>

        {/* Monitoring Interval */}
        <div>
          <label htmlFor="monitoring-interval" className="block text-sm font-medium text-gray-700">
            Monitoring Interval (Minutes)
          </label>
          <input
            type="number"
            id="monitoring-interval"
            value={settings.monitoringInterval}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              monitoringInterval: parseInt(e.target.value) || 1440 
            }))}
            min="60"
            step="60"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-2 text-sm text-gray-500">
            How often should we check your site? (60 = hourly, 1440 = daily)
          </p>
        </div>

        {/* Email Notifications */}
        <div>
          <label htmlFor="email-notifications" className="block text-sm font-medium text-gray-700">
            Email Notifications
          </label>
          <div className="mt-1">
            <textarea
              id="email-notifications"
              value={settings.emailNotifications?.join(', ') || ''}
              onChange={(e) => handleEmailChange(e.target.value)}
              rows={2}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="email1@example.com, email2@example.com"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter email addresses separated by commas to receive notifications.
          </p>
        </div>

        {/* Feature Toggles */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="autofix-enabled"
              type="checkbox"
              checked={settings.autofixEnabled}
              onChange={(e) => setSettings(prev => ({ ...prev, autofixEnabled: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="autofix-enabled" className="ml-2 block text-sm text-gray-900">
              Enable automatic fixing of accessibility issues
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="monitoring-enabled"
              type="checkbox"
              checked={settings.monitoringEnabled}
              onChange={(e) => setSettings(prev => ({ ...prev, monitoringEnabled: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="monitoring-enabled" className="ml-2 block text-sm text-gray-900">
              Enable regular monitoring of your site
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="notify-on-issue"
              type="checkbox"
              checked={settings.notifyOnIssue}
              onChange={(e) => setSettings(prev => ({ ...prev, notifyOnIssue: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="notify-on-issue" className="ml-2 block text-sm text-gray-900">
              Send email notifications when new issues are detected
            </label>
          </div>
        </div>

        {/* WordPress Plugin Notice */}
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">WordPress Plugin Required</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This integration requires the AccessWeb WordPress Plugin to be installed on your site.
                  <a 
                    href="/docs/wordpress-plugin-installation" 
                    className="font-medium text-blue-700 underline hover:text-blue-600 ml-1"
                  >
                    View installation instructions
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !settings.siteUrl || !settings.apiKey}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {saving ? (
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
      </form>
    </div>
  );
}