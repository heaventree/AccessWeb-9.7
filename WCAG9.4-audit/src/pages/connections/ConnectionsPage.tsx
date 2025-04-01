import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Store, Globe, ArrowRight } from 'lucide-react';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { BackToTop } from '../../components/BackToTop';

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
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pt-[130px] pb-[130px]">
        <div className="content-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              My Connections
            </h1>
            <p className="text-lg text-gray-600">
              Manage your API connections and integration settings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {connections.map((connection) => (
              <div
                key={connection.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col h-full"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center">
                    <connection.icon className="w-8 h-8 text-blue-600" />
                    <div className="ml-3">
                      <h2 className="text-xl font-bold text-gray-900">{connection.name}</h2>
                      <p className="mt-1 text-gray-500">{connection.description}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-900">Key Features</h3>
                    <ul className="mt-2 space-y-2">
                      {connection.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="h-5 w-5 text-green-500 mr-2">•</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      connection.status === 'Not Connected' 
                        ? 'bg-orange-50 text-orange-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {connection.status}
                    </span>
                    <Link
                      to={connection.path}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Configure
                      <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  );
}