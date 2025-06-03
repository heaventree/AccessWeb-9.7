import React, { useState, useEffect } from 'react';
import { Plus, Globe, Settings, Power, Key, Trash2, ExternalLink, Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getStoredAuth } from '../utils/auth';

interface SiteConnection {
  id: number;
  siteName: string;
  siteUrl: string;
  platform: string;
  apiToken?: string;
  status: string;
  isActive: boolean;
  lastScanAt?: string;
  scanFrequency: string;
  autoScanEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AddConnectionForm {
  siteName: string;
  siteUrl: string;
  platform: string;
}

const SiteConnectionsPage: React.FC = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<SiteConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<AddConnectionForm>({
    siteName: '',
    siteUrl: '',
    platform: 'wordpress'
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<SiteConnection | null>(null);
  const [showTokenModal, setShowTokenModal] = useState(false);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/site-connections', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setConnections(data.data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
      setConnections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/site-connections', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConnections(prev => [...prev, data.data]);
      setFormData({ siteName: '', siteUrl: '', platform: 'wordpress' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding connection:', error);
      alert('Failed to add site connection. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateToken = async (connectionId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/site-connections/${connectionId}/generate-token`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId ? data.data : conn
        )
      );

      setSelectedConnection(data.data);
      setShowTokenModal(true);
    } catch (error) {
      console.error('Error generating token:', error);
      alert('Failed to generate API token. Please try again.');
    }
  };

  const handleToggleConnection = async (connectionId: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/site-connections/${connectionId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConnections(prev => 
        prev.map(conn => 
          conn.id === connectionId ? data.data : conn
        )
      );
    } catch (error) {
      console.error('Error toggling connection:', error);
      alert('Failed to update connection status. Please try again.');
    }
  };

  const handleDeleteConnection = async (connectionId: number) => {
    if (!confirm('Are you sure you want to delete this connection? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/site-connections/${connectionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    } catch (error) {
      console.error('Error deleting connection:', error);
      alert('Failed to delete connection. Please try again.');
    }
  };

  const getStatusBadge = (connection: SiteConnection) => {
    if (connection.isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Activity className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    } else if (connection.apiToken) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Power className="w-3 h-3 mr-1" />
          Configured
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <Settings className="w-3 h-3 mr-1" />
          Setup Required
        </span>
      );
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'wordpress':
        return '🌐';
      case 'shopify':
        return '🛒';
      case 'custom':
        return '⚙️';
      default:
        return '🌍';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Site Connections</h1>
            <p className="mt-2 text-gray-600">
              Manage your website integrations and automated accessibility monitoring
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Connection
          </button>
        </div>
      </div>

      {/* Add Connection Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Site Connection</h3>
              <form onSubmit={handleAddConnection} className="space-y-4">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <input
                    type="text"
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="My WordPress Site"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
                    Site URL
                  </label>
                  <input
                    type="url"
                    id="siteUrl"
                    value={formData.siteUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteUrl: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                    Platform
                  </label>
                  <select
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="wordpress">WordPress</option>
                    <option value="shopify">Shopify</option>
                    <option value="custom">Custom Integration</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {submitting ? 'Adding...' : 'Add Connection'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* API Token Modal */}
      {showTokenModal && selectedConnection && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">API Token Generated</h3>
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <p className="text-sm text-gray-600 mb-2">Your API token for <strong>{selectedConnection.siteName}</strong>:</p>
                <div className="bg-white p-3 rounded border font-mono text-sm break-all">
                  {selectedConnection.apiToken}
                </div>
                <p className="text-xs text-red-600 mt-2">
                  Save this token securely. You won't be able to see it again.
                </p>
              </div>
              
              {selectedConnection.platform === 'wordpress' && (
                <div className="bg-blue-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">WordPress Setup Instructions:</h4>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Install the AccessWeb WCAG Checker plugin on your WordPress site</li>
                    <li>Go to WCAG Checker → Settings in your WordPress admin</li>
                    <li>Set API Endpoint to: <code className="bg-white px-1 rounded">http://localhost:3001/api</code></li>
                    <li>Paste your API token in the API Key field</li>
                    <li>Save settings and start testing your site</li>
                  </ol>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedConnection.apiToken || '');
                    alert('API token copied to clipboard!');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Copy Token
                </button>
                <button
                  onClick={() => {
                    setShowTokenModal(false);
                    setSelectedConnection(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connections List */}
      {connections.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No site connections</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first website connection.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Connection
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {connections.map((connection) => (
            <div key={connection.id} className="bg-white overflow-hidden shadow rounded-lg border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{getPlatformIcon(connection.platform)}</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{connection.siteName}</h3>
                      <p className="text-sm text-gray-500 capitalize">{connection.platform}</p>
                    </div>
                  </div>
                  {getStatusBadge(connection)}
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <a 
                      href={connection.siteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 truncate"
                    >
                      {connection.siteUrl}
                    </a>
                  </div>
                  
                  {connection.lastScanAt && (
                    <div className="text-sm text-gray-500">
                      Last scan: {new Date(connection.lastScanAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex space-x-2">
                    {!connection.apiToken ? (
                      <button
                        onClick={() => handleGenerateToken(connection.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <Key className="w-3 h-3 mr-1" />
                        Generate Token
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleConnection(connection.id)}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded ${
                          connection.isActive 
                            ? 'text-red-700 bg-red-100 hover:bg-red-200' 
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        }`}
                      >
                        <Power className="w-3 h-3 mr-1" />
                        {connection.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleDeleteConnection(connection.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteConnectionsPage;