import { Link } from 'react-router-dom';
import { Code, Store, Globe, ArrowRight, Plus, PlugZap } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '../../lib/apiClient';

interface SiteConnection {
  id: number;
  siteName: string;
  siteUrl: string;
  platform: string;
  status: string;
  isActive: boolean;
  apiToken?: string;
  createdAt: string;
  updatedAt: string;
}

interface UnifiedConnection {
  id: string | number;
  name: string;
  description: string;
  icon: any;
  path: string;
  platform: string;
  status: string;
  isUserConnection: boolean;
  hasApiToken: boolean;
  features: string[];
  isActive?: boolean;
  apiToken?: string;
}

export function ConnectionsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [userConnections, setUserConnections] = useState<SiteConnection[]>([]);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    url: ''
  });
  const [loading, setLoading] = useState(false);
  const [generatingToken, setGeneratingToken] = useState<number | null>(null);

  // Fetch user connections on component mount
  useEffect(() => {
    fetchUserConnections();
  }, []);

  const fetchUserConnections = async () => {
    try {
      const response = await apiClient.get('/site-connections');
      setUserConnections(response.data.data || []);
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const handleSubmit = async () => {
    // Enhanced validation
    if (!formData.type || !formData.name || !formData.url) {
      alert('Please fill in all fields');
      return;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const isValidUrl = urlPattern.test(formData.url) || 
                      urlPattern.test(`https://${formData.url}`) ||
                      /^[\w\.-]+\.[\w]{2,}/.test(formData.url);
    
    if (!isValidUrl) {
      alert('Please enter a valid URL or domain name (e.g., example.com or https://example.com)');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/site-connections', {
        siteName: formData.name,
        siteUrl: formData.url,
        platform: formData.type
      });

      if (response.status === 201) {
        setShowAddModal(false);
        setFormData({ type: '', name: '', url: '' });
        fetchUserConnections();
        alert('Connection added successfully!');
      }
    } catch (error: any) {
      console.error('Error adding connection:', error);
      const errorMessage = error.response?.data?.error || 'Error adding connection. Please check your input and try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const generateApiToken = async (connectionId: number) => {
    setGeneratingToken(connectionId);
    try {
      const response = await apiClient.post(`/site-connections/${connectionId}/generate-token`);
      if (response.status === 200) {
        fetchUserConnections();
        alert('API token generated successfully!');
      }
    } catch (error) {
      console.error('Error generating API token:', error);
      alert('Error generating API token');
    } finally {
      setGeneratingToken(null);
    }
  };

  const toggleConnectionStatus = async (connectionId: number) => {
    try {
      const response = await apiClient.patch(`/site-connections/${connectionId}/toggle`);
      if (response.status === 200) {
        fetchUserConnections();
      }
    } catch (error) {
      console.error('Error toggling connection status:', error);
      alert('Error updating connection status');
    }
  };

  const deleteConnection = async (connectionId: number) => {
    if (window.confirm('Are you sure you want to delete this connection?')) {
      try {
        const response = await apiClient.delete(`/site-connections/${connectionId}`);
        if (response.status === 200) {
          fetchUserConnections();
          alert('Connection deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting connection:', error);
        alert('Error deleting connection');
      }
    }
  };

  const availableIntegrations = [
    {
      id: 'custom-api',
      name: 'Custom API',
      description: 'Configure custom API integration settings',
      icon: Code,
      path: '/my-account/connections/custom-api',
      platform: 'custom',
      features: [
        'RESTful API access',
        'Webhook notifications',
        'Detailed reporting',
        'Custom implementation support'
      ]
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Connect your Shopify store',
      icon: Store,
      path: '/my-account/connections/shopify',
      platform: 'shopify',
      features: [
        'Theme accessibility testing',
        'Product page monitoring',
        'Checkout flow analysis',
        'Custom fixes for Shopify themes'
      ]
    },
    {
      id: 'wordpress',
      name: 'WordPress',
      description: 'Connect your WordPress site',
      icon: Globe,
      path: '/my-account/connections/wordpress',
      platform: 'wordpress',
      features: [
        'Plugin-based integration',
        'Real-time monitoring',
        'Auto-fix suggestions',
        'Theme compatibility'
      ]
    }
  ];

  // Merge user connections with available integrations
  const getAllConnections = (): UnifiedConnection[] => {
    const allConnections: UnifiedConnection[] = [];
    
    // Safely access userConnections with proper null checks
    const safeUserConnections = Array.isArray(userConnections) ? userConnections : [];
    
    // Add user's actual connections
    safeUserConnections.forEach(connection => {
      if (!connection || !connection.platform || !connection.siteName) return;
      
      const integration = availableIntegrations.find(int => int.platform === connection.platform);
      allConnections.push({
        id: connection.id || `user-${Math.random()}`,
        platform: connection.platform || 'unknown',
        name: connection.siteName || 'Unnamed Connection',
        description: connection.siteUrl || 'No URL provided',
        icon: integration?.icon || Globe,
        path: `/my-account/connections/${connection.platform}/${connection.id}`,
        status: connection.isActive ? 'Active' : 'Inactive',
        features: Array.isArray(integration?.features) ? integration.features : [],
        hasApiToken: !!(connection.apiToken),
        isUserConnection: true,
        isActive: connection.isActive || false,
        apiToken: connection.apiToken || undefined
      });
    });

    // Add available integrations that user hasn't connected yet
    availableIntegrations.forEach(integration => {
      if (!integration || !integration.platform) return;
      
      const hasConnection = safeUserConnections.some(conn => 
        conn && conn.platform === integration.platform
      );
      
      if (!hasConnection) {
        allConnections.push({
          id: integration.id || `integration-${integration.platform}`,
          platform: integration.platform,
          name: integration.name || 'Unknown Integration',
          description: integration.description || '',
          icon: integration.icon || Globe,
          path: integration.path || `/my-account/connections/${integration.platform}`,
          status: 'Not Connected',
          features: Array.isArray(integration.features) ? integration.features : [],
          hasApiToken: false,
          isUserConnection: false
        });
      }
    });

    return allConnections;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          API Connections
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Connect your platforms for seamless accessibility monitoring and automated fixes
        </p>
      </div>
      <div className="sm:flex sm:justify-between sm:items-center mb-6">
        <div className="mb-4 sm:mb-0">
        </div>
        <div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Connection
          </button>
        </div>
      </div>

      {/* All Connections - Unified List */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <PlugZap className="h-5 w-5 mr-2 text-primary-500" />
            Your Connections & Available Integrations
          </h2>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {getAllConnections().map((connection) => (
            <li key={connection.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${
                      connection.platform === 'custom' ? 'bg-purple-100' : 
                      connection.platform === 'shopify' ? 'bg-green-100' : 
                      connection.platform === 'wordpress' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <connection.icon className={`h-6 w-6 ${
                        connection.platform === 'custom' ? 'text-purple-600' : 
                        connection.platform === 'shopify' ? 'text-green-600' : 
                        connection.platform === 'wordpress' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{connection.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{connection.description}</p>
                      {connection.isUserConnection && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          API Token: {connection.hasApiToken ? 'Generated' : 'Not Generated'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      connection.status === 'Not Connected' 
                        ? 'bg-orange-100 text-orange-800'
                        : connection.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {connection.status}
                    </span>
                    
                    {connection.isUserConnection ? (
                      <div className="flex items-center space-x-2">
                        {/* Toggle Active/Inactive */}
                        <button
                          onClick={() => toggleConnectionStatus(connection.id as number)}
                          className={`px-2 py-1 text-xs rounded ${
                            connection.isActive 
                              ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {connection.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        {/* Generate/Remove API Token */}
                        {connection.hasApiToken ? (
                          <button
                            onClick={() => deleteConnection(connection.id as number)}
                            className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                          >
                            Remove
                          </button>
                        ) : (
                          <button
                            onClick={() => generateApiToken(connection.id as number)}
                            disabled={generatingToken === connection.id}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
                          >
                            {generatingToken === connection.id ? 'Generating...' : 'Generate Token'}
                          </button>
                        )}
                        
                        <Link
                          to={connection.path}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          Configure
                          <ArrowRight className="ml-2 -mr-0.5 h-4 w-4" />
                        </Link>
                      </div>
                    ) : (
                      <Link
                        to={connection.path}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Configure
                        <ArrowRight className="ml-2 -mr-0.5 h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(connection.features || []).map((feature: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Add New Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Add New Connection
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Connection Type
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  >
                    <option value="">Select connection type</option>
                    <option value="wordpress">WordPress Site</option>
                    <option value="shopify">Shopify Store</option>
                    <option value="custom">Custom API</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter site name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end mt-6 space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Connection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}