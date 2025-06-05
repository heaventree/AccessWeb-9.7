import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Key, Download, FileText, Settings, Activity, RefreshCw, CheckCircle, AlertCircle, Info, HelpCircle, Book, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../../lib/apiClient';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface SiteConnection {
  id: number;
  siteName: string;
  siteUrl: string;
  platform: string;
  status: string;
  isActive: boolean;
  apiToken: string | null;
  scanFrequency: string;
  autoScanEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export function WordPressAPIPage() {
  const { id } = useParams();
  const [connection, setConnection] = useState<SiteConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [scanningInProgress, setScanningInProgress] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [settings, setSettings] = useState({
    scanFrequency: 'weekly',
    autoScanEnabled: true,
    notifyAdmin: true,
    autoFix: false
  });

  useEffect(() => {
    if (id) {
      fetchConnection();
    } else {
      fetchWordPressConnections();
    }
  }, [id]);

  const fetchConnection = async () => {
    try {
      const response = await apiClient.get(`/site-connections/${id}`);
      if (response.data.success) {
        const conn = response.data.data;
        setConnection(conn);
        setSettings({
          scanFrequency: conn.scanFrequency || 'weekly',
          autoScanEnabled: conn.autoScanEnabled || true,
          notifyAdmin: true,
          autoFix: false
        });
      }
    } catch (error) {
      console.error('Error fetching connection:', error);
      toast.error('Failed to load connection details');
    } finally {
      setLoading(false);
    }
  };

  const fetchWordPressConnections = async () => {
    try {
      const response = await apiClient.get('/site-connections');
      if (response.data.success) {
        const wordpressConnections = response.data.data.filter(
          (conn: SiteConnection) => conn.platform === 'wordpress'
        );
        if (wordpressConnections.length > 0) {
          setConnection(wordpressConnections[0]);
          const conn = wordpressConnections[0];
          setSettings({
            scanFrequency: conn.scanFrequency || 'weekly',
            autoScanEnabled: conn.autoScanEnabled || true,
            notifyAdmin: true,
            autoFix: false
          });
        }
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateApiKey = async () => {
    if (!connection) return;
    
    setGenerating(true);
    try {
      const response = await apiClient.post(`/site-connections/${connection.id}/generate-token`);
      if (response.data.success) {
        setConnection(prev => prev ? { ...prev, apiToken: response.data.data.apiToken } : null);
        toast.success('API key generated successfully');
      }
    } catch (error) {
      console.error('Error generating API key:', error);
      toast.error('Failed to generate API key');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!connection) return;
    
    setUpdating(true);
    try {
      const response = await apiClient.patch(`/site-connections/${connection.id}/toggle`);
      if (response.data.success) {
        setConnection(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
        toast.success(`Connection ${connection.isActive ? 'deactivated' : 'activated'}`);
      }
    } catch (error: any) {
      console.error('Error toggling status:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update connection status';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!connection) return;
    
    setUpdating(true);
    try {
      const response = await apiClient.patch(`/site-connections/${connection.id}`, {
        scanFrequency: settings.scanFrequency,
        autoScanEnabled: settings.autoScanEnabled
      });
      if (response.data.success) {
        setConnection(prev => prev ? { 
          ...prev, 
          scanFrequency: settings.scanFrequency,
          autoScanEnabled: settings.autoScanEnabled 
        } : null);
        toast.success('Settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setUpdating(false);
    }
  };

  const handleTriggerManualScan = async () => {
    if (!connection) return;
    
    setScanningInProgress(true);
    try {
      const response = await apiClient.post(`/scanner/trigger/${connection.id}`);
      if (response.data.success) {
        toast.success('Accessibility scan started! Results will be available shortly.');
      }
    } catch (error: any) {
      console.error('Error triggering scan:', error);
      const errorMessage = error.response?.data?.error || 'Failed to trigger accessibility scan';
      toast.error(errorMessage);
    } finally {
      setScanningInProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!connection) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/my-account/connections" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to My Connections
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No WordPress Connection Found</h3>
          <p className="text-gray-500 mb-6">
            Create a WordPress site connection first to manage your integration.
          </p>
          <Link
            to="/my-account/connections"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add WordPress Connection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link 
          to="/my-account/connections" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to My Connections
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              WordPress Integration
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {connection.siteName}
            </p>
            <p className="text-sm text-gray-500">
              {connection.siteUrl}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${connection.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${connection.isActive ? 'text-green-700' : 'text-red-700'}`}>
                {connection.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <button
              onClick={handleToggleStatus}
              disabled={updating}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                connection.isActive 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              } disabled:opacity-50`}
            >
              {updating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                connection.isActive ? 'Deactivate' : 'Activate'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Setup Instructions */}
        <div className="lg:col-span-2 space-y-8">
          {/* WordPress Plugin Setup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Download className="w-6 h-6 text-blue-600 mr-3" />
                  WordPress Plugin Setup
                </h2>
                <span className="text-sm text-gray-500">Step 1</span>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Before connecting your WordPress site, you'll need to install our WordPress plugin. Follow our comprehensive documentation to get started.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowInstructions(true)}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Setup Instructions
                </button>
                <Link
                  to="/docs/wordpress"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Book className="w-5 h-5 mr-2" />
                  View Documentation
                </Link>
              </div>
            </div>
          </motion.div>

          {/* API Key Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Key className="w-6 h-6 text-blue-600 mr-3" />
                  WordPress API Key
                </h2>
                <span className="text-sm text-gray-500">Step 2</span>
              </div>
            </div>

            <div className="p-6">
              {connection.apiToken ? (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-green-900">API Key Active</h3>
                        <p className="text-green-700 mb-4">
                          Your WordPress API key is ready to use. Copy this key and enter it in your WordPress plugin settings.
                        </p>
                        
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex items-center justify-between">
                            <code className="text-sm font-mono text-gray-800">
                              {showApiKey ? connection.apiToken : `${connection.apiToken.slice(0, 8)}...${connection.apiToken.slice(-8)}`}
                            </code>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setShowApiKey(!showApiKey)}
                                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                              >
                                {showApiKey ? 'Hide' : 'Show'}
                              </button>
                              <CopyToClipboard
                                text={connection.apiToken}
                                onCopy={() => toast.success('API key copied to clipboard')}
                              >
                                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                                  Copy
                                </button>
                              </CopyToClipboard>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleTriggerManualScan}
                      disabled={scanningInProgress}
                      className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {scanningInProgress ? (
                        <>
                          <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Search className="-ml-1 mr-2 h-5 w-5" />
                          Run Accessibility Scan
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleGenerateApiKey}
                      disabled={generating}
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      {generating ? (
                        <>
                          <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Regenerating...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
                          Regenerate API Key
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No API Key Generated</h3>
                  <p className="text-gray-500 mb-6">
                    Generate an API key to connect your WordPress site with our accessibility services.
                  </p>
                  <button
                    onClick={handleGenerateApiKey}
                    disabled={generating}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Key className="-ml-1 mr-2 h-5 w-5" />
                        Generate API Key
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* WordPress Configuration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Settings className="w-6 h-6 text-blue-600 mr-3" />
                  Configuration Settings
                </h2>
                <span className="text-sm text-gray-500">Step 3</span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="scanFrequency" className="block text-sm font-medium text-gray-700 mb-2">
                      Scan Frequency
                    </label>
                    <select
                      id="scanFrequency"
                      value={settings.scanFrequency}
                      onChange={(e) => setSettings({ ...settings, scanFrequency: e.target.value })}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="autoScan"
                          type="checkbox"
                          checked={settings.autoScanEnabled}
                          onChange={(e) => setSettings({ ...settings, autoScanEnabled: e.target.checked })}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="autoScan" className="font-medium text-gray-700">
                          Auto-scan Enabled
                        </label>
                        <p className="text-gray-500">Automatically scan for accessibility issues</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyAdmin"
                          type="checkbox"
                          checked={settings.notifyAdmin}
                          onChange={(e) => setSettings({ ...settings, notifyAdmin: e.target.checked })}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyAdmin" className="font-medium text-gray-700">
                          Notify Admin
                        </label>
                        <p className="text-gray-500">Send notifications when issues are found</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="autoFix"
                          type="checkbox"
                          checked={settings.autoFix}
                          onChange={(e) => setSettings({ ...settings, autoFix: e.target.checked })}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="autoFix" className="font-medium text-gray-700">
                          Auto-fix Issues
                        </label>
                        <p className="text-gray-500">Automatically apply fixes when possible</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateSettings}
                    disabled={updating}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating ? (
                      <>
                        <RefreshCw className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Saving...
                      </>
                    ) : (
                      'Save Settings'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 text-blue-600 mr-2" />
              Connection Status
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`text-sm font-medium ${connection.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {connection.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Platform</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{connection.platform}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Key</span>
                <span className={`text-sm font-medium ${connection.apiToken ? 'text-green-600' : 'text-red-600'}`}>
                  {connection.apiToken ? 'Generated' : 'Not Generated'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Scan Frequency</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{connection.scanFrequency}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <Link
                to="/docs/wordpress"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Documentation
              </Link>
              
              <button
                onClick={() => setShowInstructions(true)}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Setup Guide
              </button>
            </div>
          </div>

          {/* Connection Info */}
          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-start">
              <Info className="w-6 h-6 text-blue-600 mt-1" />
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Our WordPress integration provides real-time accessibility monitoring and automated fixes for your site.
                </p>
                <Link
                  to="/help"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}