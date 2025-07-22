import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Key, Plus, Copy, Trash2, Eye, EyeOff, AlertTriangle, Info } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import apiClient from '../../lib/apiClient';

interface ApiKey {
  id: number;
  name: string;
  keyId: string;
  lastUsed: string | null;
  usageCount: number;
  rateLimit: number;
  createdAt: string;
  isActive: boolean;
}

export default function APIIntegrationPage(): JSX.Element {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({});
  const [generatedKey, setGeneratedKey] = useState<string>('');

  const { user } = useAuth();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await apiClient.get('/user/api-keys');
      setApiKeys(response.data);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!keyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    setCreating(true);
    try {
      const response = await apiClient.post('/user/api-keys', { name: keyName });

      setGeneratedKey(response.data.apiKey);
      setApiKeys(prev => [...prev, response.data.keyInfo]);
      setShowCreateForm(false);
      setKeyName('');
      toast.success('API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.delete(`/user/api-keys/${keyId}`);

      setApiKeys(prev => prev.filter(key => key.keyId !== keyId));
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0fae96]"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>API Integration - AccessWeb</title>
        <meta name="description" content="Manage your API keys and integrate AccessWeb with your applications" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Integration</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Generate and manage API keys to integrate AccessWeb's WCAG compliance checking into your applications.
          </p>
        </div>

        {/* Generated Key Modal */}
        {generatedKey && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border dark:border-gray-700">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your API Key</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Please copy this API key now. You won't be able to see it again for security reasons.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                <code className="text-sm break-all font-mono text-gray-900 dark:text-gray-100 bg-transparent">{generatedKey}</code>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(generatedKey)}
                  className="flex items-center"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  onClick={() => setGeneratedKey('')}
                  className="bg-[#0fae96] hover:bg-[#0fae96]/90"
                >
                  I've saved it
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* API Documentation */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">API Usage</h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                Use your API key to check WCAG compliance programmatically:
              </p>
              <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm border dark:border-gray-600">
                <code className="block text-gray-900 dark:text-gray-100">
                  <span className="text-green-600 dark:text-green-400 font-semibold">POST</span> https://your-replit-domain.repl.co/api/public/wcag-check<br />
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Headers:</span><br />
                  <span className="text-blue-600 dark:text-blue-400">Authorization:</span> Bearer YOUR_API_KEY<br />
                  <span className="text-blue-600 dark:text-blue-400">Content-Type:</span> application/json<br /><br />
                  <span className="text-gray-500 dark:text-gray-400 font-medium">Body:</span><br />
                  <span className="text-purple-600 dark:text-purple-400">
                  {JSON.stringify({
                    url: "https://example.com",
                    region: "us",
                    tag: "WCAG2A"
                  }, null, 2)}
                  </span>
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* API Keys List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your API Keys</h2>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-[#0fae96] hover:bg-[#0fae96]/90 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </div>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-3">
                <Input
                  placeholder="Enter a name for your API key"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createApiKey()}
                  className="flex-1"
                />
                <Button
                  onClick={createApiKey}
                  disabled={creating}
                  className="bg-[#0fae96] hover:bg-[#0fae96]/90"
                >
                  {creating ? 'Creating...' : 'Create'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setKeyName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Keys List */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {apiKeys.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <Key className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No API keys</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Create your first API key to start integrating with AccessWeb.
                </p>
              </div>
            ) : (
              apiKeys.map((apiKey) => (
                <div key={apiKey.keyId} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {apiKey.name}
                        </h3>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          apiKey.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>Key ID: {apiKey.keyId}</span>
                        <span>Usage: {apiKey.usageCount} requests</span>
                        <span>Rate limit: {apiKey.rateLimit}/hour</span>
                        {apiKey.lastUsed && (
                          <span>Last used: {formatDate(apiKey.lastUsed)}</span>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                        Created: {formatDate(apiKey.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteApiKey(apiKey.keyId)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Rate Limits</h3>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm mt-1">
                API keys are limited to 1000 requests per hour by default. Contact support if you need higher limits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}