import React, { useState, useEffect } from 'react';

interface Subscription {
  id: number;
  userId: number;
  userEmail: string;
  userName: string | null;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  autoRenew: boolean;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
}

const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch('/api/admin/subscriptions');
        // const data = await response.json();
        
        // For now, we'll simulate some data
        setTimeout(() => {
          const mockSubscriptions: Subscription[] = [
            {
              id: 1,
              userId: 1,
              userEmail: 'john.doe@example.com',
              userName: 'John Doe',
              planName: 'Professional Plan',
              startDate: '2025-01-15T00:00:00Z',
              endDate: '2026-01-15T00:00:00Z',
              status: 'active',
              autoRenew: true,
              price: 49.99,
              billingPeriod: 'monthly'
            },
            {
              id: 2,
              userId: 2,
              userEmail: 'jane.smith@example.com',
              userName: 'Jane Smith',
              planName: 'Basic Plan',
              startDate: '2025-02-20T00:00:00Z',
              endDate: '2025-05-20T00:00:00Z',
              status: 'active',
              autoRenew: true,
              price: 19.99,
              billingPeriod: 'monthly'
            },
            {
              id: 3,
              userId: 5,
              userEmail: 'mike.johnson@example.com',
              userName: 'Mike Johnson',
              planName: 'Enterprise Plan',
              startDate: '2025-01-10T00:00:00Z',
              endDate: '2025-04-10T00:00:00Z',
              status: 'cancelled',
              autoRenew: false,
              price: 149.99,
              billingPeriod: 'monthly'
            },
            {
              id: 4,
              userId: 6,
              userEmail: 'lisa.brown@example.com',
              userName: 'Lisa Brown',
              planName: 'Basic Plan',
              startDate: '2025-04-05T00:00:00Z',
              endDate: '2025-05-05T00:00:00Z',
              status: 'trial',
              autoRenew: true,
              price: 0,
              billingPeriod: 'monthly'
            },
            {
              id: 5,
              userId: 7,
              userEmail: 'david.miller@example.com',
              userName: 'David Miller',
              planName: 'Professional Plan',
              startDate: '2024-11-15T00:00:00Z',
              endDate: '2025-02-15T00:00:00Z',
              status: 'expired',
              autoRenew: false,
              price: 49.99,
              billingPeriod: 'monthly'
            }
          ];
          
          setSubscriptions(mockSubscriptions);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  // Filter subscriptions based on search term and status filter
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      subscription.userEmail.toLowerCase().includes(searchLower) ||
      (subscription.userName && subscription.userName.toLowerCase().includes(searchLower)) ||
      subscription.planName.toLowerCase().includes(searchLower);
    
    const matchesFilter = filterStatus === 'all' || subscription.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription({...subscription});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
  };

  const saveSubscriptionChanges = () => {
    if (!selectedSubscription) return;
    
    // In a real implementation, this would be an API call
    // await fetch(`/api/admin/subscriptions/${selectedSubscription.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(selectedSubscription)
    // });
    
    // Update the subscriptions array with the edited subscription
    const updatedSubscriptions = subscriptions.map(subscription => 
      subscription.id === selectedSubscription.id ? selectedSubscription : subscription
    );
    
    setSubscriptions(updatedSubscriptions);
    closeModal();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'trial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-10 h-10 border-4 border-[#0fae96] border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Subscription Management
      </h1>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-gray-300 dark:border-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by user or plan..."
              className="ml-2 w-full bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="min-w-[200px]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>
      
      {/* Subscriptions table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">User</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Plan</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Period</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Auto-Renew</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Expiry</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map(subscription => (
                <tr key={subscription.id} className="border-b border-gray-200 dark:border-slate-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#0fae96] flex items-center justify-center text-white mr-3">
                        {subscription.userName ? subscription.userName.charAt(0).toUpperCase() : subscription.userEmail.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{subscription.userName || 'N/A'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{subscription.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {subscription.planName}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    ${subscription.price.toFixed(2)} / {subscription.billingPeriod === 'monthly' ? 'month' : 'year'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {subscription.autoRenew ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditSubscription(subscription)}
                        className="px-2 py-1 text-xs font-medium text-[#0fae96] hover:text-[#0d9a85] transition-colors focus:outline-none"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSubscriptions.length === 0 && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No subscriptions found matching your criteria.
          </div>
        )}
      </div>
      
      {/* Edit subscription modal */}
      {isModalOpen && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Edit Subscription
            </h2>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-[#0fae96] flex items-center justify-center text-white mr-3">
                  {selectedSubscription.userName ? selectedSubscription.userName.charAt(0).toUpperCase() : selectedSubscription.userEmail.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedSubscription.userName || 'N/A'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSubscription.userEmail}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subscription Plan
              </label>
              <select
                value={selectedSubscription.planName}
                onChange={(e) => setSelectedSubscription({...selectedSubscription, planName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              >
                <option value="Basic Plan">Basic Plan</option>
                <option value="Professional Plan">Professional Plan</option>
                <option value="Enterprise Plan">Enterprise Plan</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                value={selectedSubscription.status}
                onChange={(e) => setSelectedSubscription({...selectedSubscription, status: e.target.value as 'active' | 'cancelled' | 'expired' | 'trial'})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              >
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="expired">Expired</option>
                <option value="trial">Trial</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Billing Period
              </label>
              <select
                value={selectedSubscription.billingPeriod}
                onChange={(e) => setSelectedSubscription({...selectedSubscription, billingPeriod: e.target.value as 'monthly' | 'yearly'})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 dark:text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={selectedSubscription.price}
                  onChange={(e) => setSelectedSubscription({...selectedSubscription, price: parseFloat(e.target.value) || 0})}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={new Date(selectedSubscription.endDate).toISOString().split('T')[0]}
                onChange={(e) => setSelectedSubscription({...selectedSubscription, endDate: new Date(e.target.value).toISOString()})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="auto-renew"
                  type="checkbox"
                  checked={selectedSubscription.autoRenew}
                  onChange={(e) => setSelectedSubscription({...selectedSubscription, autoRenew: e.target.checked})}
                  className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
                />
                <label htmlFor="auto-renew" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Auto-renew subscription
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
              >
                Cancel
              </button>
              <button
                onClick={saveSubscriptionChanges}
                className="px-4 py-2 bg-[#0fae96] text-white rounded-full hover:bg-[#0d9a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManagement;