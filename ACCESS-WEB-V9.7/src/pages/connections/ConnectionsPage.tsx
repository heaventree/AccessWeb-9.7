import { Link } from 'react-router-dom';
import { Code, Store, Globe, ArrowRight, Plus, PlugZap } from 'lucide-react';
import { useState, useEffect } from 'react';

export function ConnectionsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [userConnections, setUserConnections] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    url: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch user connections on component mount
  useEffect(() => {
    fetchUserConnections();
  }, []);

  const fetchUserConnections = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await fetch('http://localhost:3001/api/site-connections', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserConnections(data);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.name || !formData.url) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/site-connections', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          url: formData.url,
          type: formData.type
        })
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({ type: '', name: '', url: '' });
        fetchUserConnections(); // Refresh the list
      } else {
        alert('Error adding connection');
      }
    } catch (error) {
      console.error('Error adding connection:', error);
      alert('Error adding connection');
    } finally {
      setLoading(false);
    }
  };

  const connections = [
    {
      id: 'custom-api',
      name: 'Custom API',
      description: 'Configure custom API integration settings',
      icon: Code,
      path: '/my-account/connections/custom-api',
      status: 'Not Connected',
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
      status: 'Not Connected',
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
      status: 'Not Connected',
      features: [
        'Plugin-based integration',
        'Real-time monitoring',
        'Auto-fix suggestions',
        'Theme compatibility'
      ]
    }
  ];

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

      {/* User Connections Section */}
      {userConnections.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 flex items-center">
              <PlugZap className="h-5 w-5 mr-2 text-green-500" />
              Your Connections
            </h2>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {userConnections.map((connection) => (
              <li key={connection.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-green-100">
                        <Globe className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{connection.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{connection.url}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">Type: {connection.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Connected
                      </span>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <PlugZap className="h-5 w-5 mr-2 text-primary-500" />
            Available Integrations
          </h2>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {connections.map((connection) => (
            <li key={connection.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-md ${
                      connection.id === 'custom-api' ? 'bg-purple-100' : 
                      connection.id === 'shopify' ? 'bg-green-100' : 
                      connection.id === 'wordpress' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <connection.icon className={`h-6 w-6 ${
                        connection.id === 'custom-api' ? 'text-purple-600' : 
                        connection.id === 'shopify' ? 'text-green-600' : 
                        connection.id === 'wordpress' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{connection.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{connection.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      connection.status === 'Not Connected' 
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {connection.status}
                    </span>
                    <Link
                      to={connection.path}
                      className={`inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600`}
                    >
                      Configure
                      <ArrowRight className="ml-2 -mr-0.5 h-4 w-4" />
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {connection.features.map((feature, index) => (
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