import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { axiosInstance } from '../../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

interface Subscription {
  id: string;
  customerId: string;
  status: string;
  currentPeriodEnd: string;
  plan: {
    id: string;
    name: string;
    amount: number;
    interval: string;
  };
  user: {
    id: number;
    email: string;
    username: string;
  };
}

const AdminSubscriptions: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!isAuthenticated) {
      navigate('/login?redirect=/admin/subscriptions');
      return;
    }

    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    fetchSubscriptions();
  }, [isAuthenticated, user, navigate]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosInstance.get('/api/v1/admin/subscriptions');
      setSubscriptions(response.data.subscriptions);
    } catch (err: any) {
      console.error('Error fetching subscriptions:', err);
      setError(err.response?.data?.error || 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return;
    }

    try {
      await axiosInstance.post(`/api/v1/admin/subscriptions/${subscriptionId}/cancel`);
      
      // Update the subscription in the list
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(sub => 
          sub.id === subscriptionId 
            ? { ...sub, status: 'canceled' } 
            : sub
        )
      );
      
      alert('Subscription cancelled successfully');
    } catch (err: any) {
      console.error('Error cancelling subscription:', err);
      alert(err.response?.data?.error || 'Failed to cancel subscription');
    }
  };

  // Filter subscriptions based on search term and status filter
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      sub.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Management</h1>
          <button
            onClick={fetchSubscriptions}
            className="mt-3 md:mt-0 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md"
          >
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="w-full rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                placeholder="Search by email, username, or subscription ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                className="rounded-md border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="past_due">Past Due</option>
                <option value="canceled">Canceled</option>
                <option value="incomplete">Incomplete</option>
              </select>
            </div>
          </div>

          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No subscriptions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Plan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Renewal Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  {filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{subscription.user.username}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{subscription.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {subscription.plan.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          ${(subscription.plan.amount / 100).toFixed(2)}/{subscription.plan.interval}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          ${subscription.status === 'past_due' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${subscription.status === 'canceled' ? 'bg-red-100 text-red-800' : ''}
                          ${subscription.status === 'incomplete' ? 'bg-gray-100 text-gray-800' : ''}
                        `}>
                          {subscription.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/admin/subscriptions/${subscription.id}`)}
                          className="text-primary hover:text-primary-dark mr-3"
                        >
                          View
                        </button>
                        
                        {subscription.status === 'active' && (
                          <button
                            onClick={() => handleCancelSubscription(subscription.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;