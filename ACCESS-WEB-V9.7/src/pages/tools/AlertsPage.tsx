import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, X, Settings, Eye, EyeOff, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  action?: string;
  createdAt: string;
}

interface NotificationStats {
  unreadCount: number;
  totalCount: number;
  readCount: number;
}

interface UsageAlert {
  id: string;
  feature_key: string;
  message: string;
  type: 'warning' | 'critical' | 'info';
  acknowledged: boolean;
  created_at: string;
}

const mockUsageAlerts: UsageAlert[] = [
  {
    id: '1',
    feature_key: 'Scan Limit',
    message: 'You have used 85% of your monthly scans (85/100)',
    type: 'warning',
    acknowledged: false,
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    feature_key: 'API Calls',
    message: 'You have exceeded your API call limit (1050/1000)',
    type: 'critical',
    acknowledged: false,
    created_at: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: '3',
    feature_key: 'Storage',
    message: 'You have used 60% of your storage limit (600MB/1GB)',
    type: 'info',
    acknowledged: true,
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

export function AlertsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [usageAlerts, setUsageAlerts] = useState<UsageAlert[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ unreadCount: 0, totalCount: 0, readCount: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'usage' | 'scans'>('all');
  const { user } = useAuth();

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      
      // Fetch notifications from API
      const notificationsResponse = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData.notifications || []);
      }
      
      // Fetch notification stats
      const statsResponse = await fetch('/api/notifications/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
      
      // Load mock usage alerts for now
      setUsageAlerts(mockUsageAlerts);
      
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true } 
              : notification
          )
        );
        setStats(prev => ({
          ...prev,
          unreadCount: prev.unreadCount - 1,
          readCount: prev.readCount + 1
        }));
        toast.success('Notification marked as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setStats(prev => ({
          ...prev,
          unreadCount: 0,
          readCount: prev.totalCount
        }));
        toast.success('All notifications marked as read');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to update notifications');
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        setStats(prev => ({
          ...prev,
          totalCount: prev.totalCount - 1,
          unreadCount: notification && !notification.isRead ? prev.unreadCount - 1 : prev.unreadCount,
          readCount: notification && notification.isRead ? prev.readCount - 1 : prev.readCount
        }));
        toast.success('Notification deleted');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const acknowledgeUsageAlert = (alertId: string) => {
    setUsageAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
    toast.success('Alert acknowledged');
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getFilteredAlerts = () => {
    switch (activeTab) {
      case 'system':
        return notifications.filter(n => ['system', 'security', 'update'].includes(n.type));
      case 'usage':
        return notifications.filter(n => ['usage', 'billing', 'limit'].includes(n.type));
      case 'scans':
        return notifications.filter(n => ['scan', 'accessibility', 'compliance'].includes(n.type));
      default:
        return notifications;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Alerts & Notifications
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Manage all your alerts, notifications, and system messages
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <Bell className="w-8 h-8 text-blue-600 mb-2" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Alerts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.unreadCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Unread</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.readCount}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <Settings className="w-8 h-8 text-gray-600 mb-2" />
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{usageAlerts.filter(a => !a.acknowledged).length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Usage Alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All Alerts', count: notifications.length + usageAlerts.length },
            { key: 'system', label: 'System', count: notifications.filter(n => ['system', 'security', 'update'].includes(n.type)).length },
            { key: 'usage', label: 'Usage', count: usageAlerts.length },
            { key: 'scans', label: 'Scans', count: notifications.filter(n => ['scan', 'accessibility', 'compliance'].includes(n.type)).length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Actions */}
      {stats.unreadCount > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All as Read
          </button>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {/* System Notifications */}
        {(activeTab === 'all' || activeTab === 'system' || activeTab === 'usage' || activeTab === 'scans') && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                System Notifications
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {getFilteredAlerts().length === 0 ? (
                <div className="p-6 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You're all caught up!
                  </p>
                </div>
              ) : (
                getFilteredAlerts().map((notification) => (
                  <div key={notification.id} className={`p-6 ${
                    !notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        {getAlertIcon(notification.type)}
                        <div className="ml-3 flex-1">
                          <h3 className={`text-sm font-medium ${
                            notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`mt-1 text-sm ${
                            notification.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                            title="Mark as read"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete notification"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Usage Alerts */}
        {(activeTab === 'all' || activeTab === 'usage') && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Usage Alerts
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {usageAlerts.length === 0 ? (
                <div className="p-6 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No usage alerts</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    You're within your usage limits
                  </p>
                </div>
              ) : (
                usageAlerts.map((alert) => (
                  <div key={alert.id} className={`p-6 ${
                    !alert.acknowledged ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        {getAlertIcon(alert.type)}
                        <div className="ml-3">
                          <h3 className={`text-sm font-medium ${
                            alert.acknowledged ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {alert.feature_key}
                          </h3>
                          <p className={`mt-1 text-sm ${
                            alert.acknowledged ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {alert.message}
                          </p>
                          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                            {new Date(alert.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeUsageAlert(alert.id)}
                          className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="Acknowledge alert"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}