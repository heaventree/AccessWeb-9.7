import React, { useState, useEffect } from 'react';

interface DashboardStat {
  label: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

interface RecentActivity {
  id: number;
  user: string;
  action: string;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, this would be API calls
        // const statsResponse = await fetch('/api/admin/stats');
        // const activityResponse = await fetch('/api/admin/recent-activity');
        
        // For now, we'll simulate some data
        setTimeout(() => {
          const mockStats: DashboardStat[] = [
            {
              label: 'Total Users',
              value: 1249,
              change: 12.5,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )
            },
            {
              label: 'Active Subscriptions',
              value: 847,
              change: 4.2,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                </svg>
              )
            },
            {
              label: 'Monthly Revenue',
              value: '$29,482',
              change: 8.7,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              label: 'Compliance Score',
              value: '94%',
              change: 2.1,
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )
            }
          ];
          
          const mockActivity: RecentActivity[] = [
            {
              id: 1,
              user: 'John Doe',
              action: 'Created a new account',
              timestamp: '2025-05-10T10:30:00Z'
            },
            {
              id: 2,
              user: 'Jane Smith',
              action: 'Upgraded to Professional Plan',
              timestamp: '2025-05-10T09:15:00Z'
            },
            {
              id: 3,
              user: 'Admin User',
              action: 'Added new subscription plan',
              timestamp: '2025-05-10T08:45:00Z'
            },
            {
              id: 4,
              user: 'Sarah Wilson',
              action: 'Cancelled subscription',
              timestamp: '2025-05-09T16:20:00Z'
            },
            {
              id: 5,
              user: 'Mike Johnson',
              action: 'Requested refund',
              timestamp: '2025-05-09T14:55:00Z'
            },
            {
              id: 6,
              user: 'Lisa Brown',
              action: 'Changed account settings',
              timestamp: '2025-05-09T11:10:00Z'
            }
          ];
          
          setStats(mockStats);
          setRecentActivity(mockActivity);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        Admin Dashboard
      </h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-[#ecfdf5] dark:bg-[#132f2b] flex items-center justify-center text-[#0fae96]">
                {stat.icon}
              </div>
              <div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  stat.change > 0 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Chart - Takes up 2/3 of the space on large screens */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Revenue Overview
          </h2>
          
          {/* Placeholder for chart - In a real app, you'd use a charting library like Chart.js or Recharts */}
          <div className="h-64 bg-gray-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Revenue Chart Placeholder</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">$94,251</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Growth</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">+8.7%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">12.4%</p>
            </div>
          </div>
        </div>
        
        {/* Recent Activity - Takes up 1/3 of the space on large screens */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h2>
          
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="border-b border-gray-200 dark:border-slate-700 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-[#0fae96] flex items-center justify-center text-white mr-3 mt-1">
                    {activity.user.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.user}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-sm text-[#0fae96] hover:text-[#0d9a85] transition-colors focus:outline-none">
              View All Activity
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-[#ecfdf5] dark:bg-[#132f2b] text-[#0fae96] p-4 rounded-xl hover:bg-[#d1fae5] dark:hover:bg-[#173a34] transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span className="block text-sm font-medium">Add New User</span>
          </button>
          
          <button className="bg-[#ecfdf5] dark:bg-[#132f2b] text-[#0fae96] p-4 rounded-xl hover:bg-[#d1fae5] dark:hover:bg-[#173a34] transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="block text-sm font-medium">Create Plan</span>
          </button>
          
          <button className="bg-[#ecfdf5] dark:bg-[#132f2b] text-[#0fae96] p-4 rounded-xl hover:bg-[#d1fae5] dark:hover:bg-[#173a34] transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="block text-sm font-medium">Generate Report</span>
          </button>
          
          <button className="bg-[#ecfdf5] dark:bg-[#132f2b] text-[#0fae96] p-4 rounded-xl hover:bg-[#d1fae5] dark:hover:bg-[#173a34] transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="block text-sm font-medium">System Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;