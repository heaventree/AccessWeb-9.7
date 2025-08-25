import React, { createContext, useContext } from 'react';
import { useNotifications } from '../hooks/useNotifications';

interface NotificationContextType {
  notifications: any[];
  unreadCount: number;
  totalCount: number;
  isLoading: boolean;
  loadNotifications: (params?: { limit?: number; page?: number; unreadOnly?: boolean }) => Promise<any>;
  markAsRead: (notificationId: number) => Promise<any>;
  markAllAsRead: () => Promise<any>;
  deleteNotification: (notificationId: number) => Promise<any>;
  refresh: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const notificationData = useNotifications();
  
  return (
    <NotificationContext.Provider value={notificationData}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}