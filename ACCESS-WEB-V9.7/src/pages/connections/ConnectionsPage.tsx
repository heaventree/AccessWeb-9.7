import { Link, useNavigate } from 'react-router-dom';
import { Code, Store, Globe, ArrowRight, Plus, PlugZap, FileText } from 'lucide-react';
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
  const navigate = useNavigate();
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
        
        // Navigate to the configuration page for the newly added connection
        const newConnection = response.data.data;
        navigate(`/my-account/connections/${formData.type}/${newConnection.id}`);
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

  // Platform configuration for icons and features (not static data)
  const platformConfig = {
    wordpress: {
      icon: Globe,
      features: [
        'Plugin-based integration',
        'Real-time monitoring',
        'Auto-fix suggestions',
        'Theme compatibility'
      ]
    },
    shopify: {
      icon: Store,
      features: [
        'Theme accessibility testing',
        'Product page monitoring',
        'Checkout flow analysis',
        'Custom fixes for Shopify themes'
      ]
    },
    custom: {
      icon: Code,
      features: [
        'RESTful API access',
        'Webhook notifications',
        'Detailed reporting',
        'Custom implementation support'
      ]
    }
  };

  // Get only real database connections
  const getAllConnections = (): UnifiedConnection[] => {
    const allConnections: UnifiedConnection[] = [];
    
    // Safely access userConnections with proper null checks
    const safeUserConnections = Array.isArray(userConnections) ? userConnections : [];
    
    // Add only user's actual connections from database
    safeUserConnections.forEach(connection => {
      if (!connection || !connection.platform || !connection.siteName) return;
      
      const config = platformConfig[connection.platform as keyof typeof platformConfig];
      allConnections.push({
        id: connection.id || `user-${Math.random()}`,
        platform: connection.platform || 'unknown',
        name: connection.siteName || 'Unnamed Connection',
        description: connection.siteUrl || 'No URL provided',
        icon: config?.icon || Globe,
        path: `/my-account/connections/${connection.platform}/${connection.id}`,
        status: connection.isActive ? 'Active' : 'Inactive',
        features: config?.features || [],
        hasApiToken: !!(connection.apiToken),
        isUserConnection: true,
        isActive: connection.isActive || false,
        apiToken: connection.apiToken || undefined
      });
    });

    return allConnections;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Your Connected Sites
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage your connected websites and their accessibility monitoring settings
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
        
        {getAllConnections().length === 0 ? (
          // Empty State
          <div className="text-center py-16 px-6">
            <div className="mx-auto mb-6">
              <div className="relative">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center mb-6">
                  <PlugZap className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              No connections yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Connect your websites to start monitoring their accessibility and get automated insights and improvements.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Connection
              </button>
              
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                <FileText className="h-5 w-5 mr-2" />
                View Documentation
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">WordPress Sites</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Plugin-based integration with real-time monitoring</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                  <Store className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Shopify Stores</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Theme accessibility testing and optimization</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                  <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Custom APIs</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">RESTful API access with custom implementation</p>
              </div>
            </div>
          </div>
        ) : (
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
        )}
      </div>

      {/* Add New Connection Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-200 ease-out">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                    <Plus className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Add New Connection
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Connect your website for accessibility monitoring
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Connection Type
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Select connection type</option>
                    <option value="wordpress">🔗 WordPress Site</option>
                    <option value="shopify">🛍️ Shopify Store</option>
                    <option value="custom">⚙️ Custom API</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Site Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter a descriptive name for your site"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    Site URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Enter your website URL including https://
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.type || !formData.name || !formData.url}
                  className="inline-flex items-center px-6 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Adding Connection...' : 'Add Connection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}