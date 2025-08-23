import React from 'react';
import { CheckCheck, Trash2, ExternalLink, Clock, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'wouter';

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, loading, markAsRead, markAllAsRead, deleteNotification, loadMore, pagination } = useNotifications();
  const [, setLocation] = useRouter();

  const handleNotificationClick = async (notification: any) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      setLocation(notification.actionUrl);
      onClose();
    }
  };

  const handleMarkAsRead = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    await markAsRead(notificationId);
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: number) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'normal':
        return <Info className="w-4 h-4 text-blue-600" />;
      case 'low':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'normal':
        return 'border-l-blue-500 bg-blue-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            Mark all read
          </button>
        )}
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {loading && notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2">Loading notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg font-medium">No notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors duration-200 ${
                  notification.isRead ? 'bg-white' : getPriorityColor(notification.priority)
                } ${notification.actionUrl ? 'hover:bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      {getPriorityIcon(notification.priority)}
                      <h4 className={`ml-2 text-sm font-medium truncate ${
                        notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className={`mt-1 text-sm ${
                      notification.isRead ? 'text-gray-600' : 'text-gray-700'
                    } line-clamp-2`}>
                      {notification.message}
                    </p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      {notification.actionUrl && (
                        <>
                          <span className="mx-1">•</span>
                          <ExternalLink className="w-3 h-3 mr-1" />
                          <span>{notification.actionLabel || 'View'}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="ml-4 flex items-center space-x-1 flex-shrink-0">
                    {!notification.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(e, notification.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded"
                        title="Mark as read"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {pagination && pagination.hasNext && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={loadMore}
              disabled={loading}
              className="w-full py-2 px-4 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;