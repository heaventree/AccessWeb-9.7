import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: string;
  pdfUrl: string;
}

interface SubscriptionData {
  id: string;
  plan: string;
  price: number;
  billingPeriod: string;
  startDate: string;
  nextBillingDate: string;
  status: string;
}

export default function BillingPage() {
  const { user } = useAuth();
  const [showBillingPortal, setShowBillingPortal] = useState(false);
  const [activeTab, setActiveTab] = useState('subscription');
  
  // Subscription data from API would be fetched here in a real implementation
  const subscription: SubscriptionData = {
    id: 'sub_123456',
    plan: 'Professional Plan',
    price: 49.99,
    billingPeriod: 'monthly',
    startDate: '2025-01-15T00:00:00Z',
    nextBillingDate: '2025-06-15T00:00:00Z',
    status: 'active'
  };
  
  // Invoice data from API would be fetched in a real implementation
  const invoices: Invoice[] = [
    { 
      id: 'inv_001', 
      number: 'INV-001', 
      date: '2025-05-15T00:00:00Z', 
      amount: 49.99, 
      status: 'paid',
      pdfUrl: '#'
    },
    { 
      id: 'inv_002', 
      number: 'INV-002', 
      date: '2025-04-15T00:00:00Z', 
      amount: 49.99, 
      status: 'paid',
      pdfUrl: '#'
    },
    { 
      id: 'inv_003', 
      number: 'INV-003', 
      date: '2025-03-15T00:00:00Z', 
      amount: 49.99, 
      status: 'paid',
      pdfUrl: '#'
    }
  ];
  
  const handleManageSubscription = () => {
    setShowBillingPortal(true);
  };
  
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your subscription and billing details
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('subscription')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subscription'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Current Subscription
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invoices'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Billing History
            </button>
          </div>
        </div>

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Subscription Details</h2>
            </div>
            <div className="px-6 py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Plan</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{subscription.plan}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    ${subscription.price}/{subscription.billingPeriod}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                  <dd className="mt-1 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {subscription.status}
                    </span>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Billing Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(subscription.nextBillingDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscription ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{subscription.id}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <button
                  onClick={handleManageSubscription}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:bg-teal-500 dark:hover:bg-teal-600"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Billing History</h2>
            </div>
            {invoices.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No invoices found.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-slate-700">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Invoice #{invoice.number}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(invoice.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${invoice.amount.toFixed(2)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${invoice.status === 'paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                          {invoice.status}
                        </span>
                        <a
                          href={invoice.pdfUrl}
                          className="text-sm font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Billing Portal Modal */}
      {showBillingPortal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowBillingPortal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Manage Your Subscription
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You'll be redirected to our secure payment portal where you can:
                      </p>
                      <ul className="mt-2 list-disc pl-5 text-sm text-gray-500 dark:text-gray-400">
                        <li>Update your payment method</li>
                        <li>Change your subscription plan</li>
                        <li>Download past invoices</li>
                        <li>Update billing information</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-full border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm dark:bg-teal-500 dark:hover:bg-teal-600"
                  onClick={() => setShowBillingPortal(false)}
                >
                  Continue to Billing Portal
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-full border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowBillingPortal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Billing & Subscription" 
        description="Manage your subscription and billing details"
      />
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SubscriptionOverview onManage={handleManageSubscription} />
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Account Details</h3>
            </div>
            
            {user && (
              <div className="px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                  </div>
                  
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Account Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {user.role === 'admin' ? 'Administrator' : 'Standard User'}
                    </dd>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          {invoicesLoading ? (
            <div className="px-4 py-16 text-center">
              <div className="animate-pulse flex justify-center">
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Loading invoice history...</p>
            </div>
          ) : invoicesError ? (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-red-500">{invoicesError}</p>
              <button
                onClick={() => fetchInvoices()}
                className="mt-2 text-sm text-blue-600 hover:text-blue-500"
              >
                Try Again
              </button>
            </div>
          ) : invoices.length === 0 ? (
            <div className="px-4 py-6 text-center border-t border-gray-200">
              <p className="text-sm text-gray-500">No invoices found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <li key={invoice.id}>
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-blue-600 truncate">
                            Invoice {invoice.number}
                          </p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            from {new Date(invoice.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <p>
                              ${invoice.amount} • {invoice.status}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0">
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {showBillingPortal && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
            <div className="px-4 pt-5 pb-4 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Manage Billing
                  </h3>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      You'll be redirected to our secure payment portal where you can:
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                      <li>Update your payment method</li>
                      <li>Change your subscription plan</li>
                      <li>Download past invoices</li>
                      <li>Update billing information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse bg-gray-50">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  // In a real application, we would redirect to the Stripe billing portal
                  console.log('Redirecting to billing portal...');
                  // In development mode, just close the modal
                  setShowBillingPortal(false);
                }}
              >
                Continue to Billing Portal
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setShowBillingPortal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}