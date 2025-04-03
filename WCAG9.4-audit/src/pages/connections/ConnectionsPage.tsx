import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Store, Globe, ArrowRight, ArrowLeft, Plus, PlugZap } from 'lucide-react';

export function ConnectionsPage() {
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
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link to="/my-account" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">API Connections</h1>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Connect your platforms for seamless accessibility monitoring and automated fixes
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add New Connection
          </button>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-6">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <PlugZap className="h-5 w-5 mr-2 text-blue-500" />
              Available Integrations
            </h2>
          </div>
          <ul className="divide-y divide-gray-200">
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
                        <h3 className="text-lg font-medium text-gray-900">{connection.name}</h3>
                        <p className="text-sm text-gray-500">{connection.description}</p>
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
                        className={`inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50`}
                      >
                        Configure
                        <ArrowRight className="ml-2 -mr-0.5 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {connection.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}