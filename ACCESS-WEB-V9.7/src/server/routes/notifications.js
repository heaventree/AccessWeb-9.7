const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { storage } = require('../storage');
const router = express.Router();

// Get user notifications
router.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    
    const notifications = await storage.getUserNotifications(
      userId, 
      parseInt(limit),
      (parseInt(page) - 1) * parseInt(limit),
      unreadOnly === 'true'
    );
    
    const totalCount = await storage.getUserNotificationCount(userId, unreadOnly === 'true');
    
    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        hasMore: (parseInt(page) * parseInt(limit)) < totalCount
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id);
    
    const notification = await storage.markNotificationAsRead(notificationId, userId);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Mark all notifications as read
router.put('/api/notifications/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const updatedCount = await storage.markAllNotificationsAsRead(userId);
    
    res.json({ message: `${updatedCount} notifications marked as read` });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to update notifications' });
  }
});

// Delete notification
router.delete('/api/notifications/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = parseInt(req.params.id);
    
    const success = await storage.deleteNotification(notificationId, userId);
    
    if (!success) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

// Create notification (for internal use, admin, or system-generated)
router.post('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { userId, type, title, message, action } = req.body;
    
    // Only allow admins to create notifications for other users
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to create notifications for other users' });
    }
    
    const notification = await storage.createNotification({
      userId: userId || req.user.id,
      type,
      title,
      message,
      action
    });
    
    res.status(201).json({ notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Get notification stats (unread count, etc.)
router.get('/api/notifications/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const unreadCount = await storage.getUserNotificationCount(userId, true);
    const totalCount = await storage.getUserNotificationCount(userId, false);
    
    res.json({
      unreadCount,
      totalCount,
      readCount: totalCount - unreadCount
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({ error: 'Failed to fetch notification stats' });
  }
});

module.exports = router;