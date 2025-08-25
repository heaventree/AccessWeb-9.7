import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: number;
  type: string;
  category: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  isRead: boolean;
  actionUrl?: string;
  metadata?: any;
  createdAt: string;
}

interface NotificationStats {
  unreadCount: number;
  totalCount: number;
}

// Notification API functions
const notificationApi = {
  async getNotifications(params: { limit?: number; page?: number; unreadOnly?: boolean } = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.set('limit', params.limit.toString());
    if (params.page) queryParams.set('page', params.page.toString());
    if (params.unreadOnly) queryParams.set('unreadOnly', 'true');
    
    const response = await fetch(`/api/notifications?${queryParams}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },
  
  
  async markAsRead(id: number) {
    const response = await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },
  
  async markAllAsRead() {
    const response = await fetch('/api/notifications/mark-all-read', {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  },
  
  async deleteNotification(id: number) {
    const response = await fetch(`/api/notifications/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  }
};

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load unread count on mount and poll for updates
  useEffect(() => {
    if (user) {
      loadNotificationStats();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotificationStats, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotificationStats = async () => {
    try {
      // Use notifications API with minimal limit to get just the counts
      const response = await notificationApi.getNotifications({ limit: 1 });
      if (response.success) {
        setUnreadCount(response.unreadCount);
        setTotalCount(response.pagination.total);
      }
    } catch (error) {
      console.error('Error loading notification stats:', error);
    }
  };

  const loadNotifications = async (params: { limit?: number; page?: number; unreadOnly?: boolean } = {}) => {
    try {
      setIsLoading(true);
      const response = await notificationApi.getNotifications(params);
      if (response.success) {
        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
        setTotalCount(response.pagination.total);
      }
      return response;
    } catch (error) {
      console.error('Error loading notifications:', error);
      return { success: false, error: 'Failed to load notifications' };
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const response = await notificationApi.markAsRead(notificationId);
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: 'Failed to mark as read' };
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await notificationApi.markAllAsRead();
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      }
      return response;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error: 'Failed to mark all as read' };
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const response = await notificationApi.deleteNotification(notificationId);
      if (response.success) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setTotalCount(prev => Math.max(0, prev - 1));
      }
      return response;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: 'Failed to delete notification' };
    }
  };

  // Refresh notifications (useful for manual refresh)
  const refresh = () => {
    loadNotificationStats();
  };

  return {
    notifications,
    unreadCount,
    totalCount,
    isLoading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh
  };
}