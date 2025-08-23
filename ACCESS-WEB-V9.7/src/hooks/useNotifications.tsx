import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../lib/apiClient';
import { useAuth } from '../contexts/AuthContext';

export interface Notification {
  id: number;
  type: string;
  category: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

export interface NotificationPagination {
  current: number;
  total: number;
  count: number;
  hasNext: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<NotificationPagination | null>(null);

  const fetchNotifications = useCallback(async (page = 1, limit = 20, unreadOnly = false) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await userApi.getNotifications(page, limit, unreadOnly);
      
      if (response.success) {
        if (page === 1) {
          setNotifications(response.notifications);
        } else {
          setNotifications(prev => [...prev, ...response.notifications]);
        }
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const response = await userApi.getUnreadNotificationCount();
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  }, [user]);

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const response = await userApi.markNotificationAsRead(notificationId);
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
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await userApi.markAllNotificationsAsRead();
      if (response.success) {
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      const response = await userApi.deleteNotification(notificationId);
      if (response.success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        // Update unread count if deleted notification was unread
        const deletedNotification = notifications.find(n => n.id === notificationId);
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  }, [notifications]);

  const loadMore = useCallback(() => {
    if (pagination && pagination.hasNext) {
      fetchNotifications(pagination.current + 1);
    }
  }, [pagination, fetchNotifications]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [user, fetchNotifications, fetchUnreadCount]);

  // Refresh data periodically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60000); // Check for new notifications every minute

    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  const refresh = useCallback(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    loading,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    refresh
  };
}

export default useNotifications;