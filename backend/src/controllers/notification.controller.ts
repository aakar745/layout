import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Notification, { NotificationType, NotificationPriority, INotification } from '../models/notification.model';
import { getSocketInstance } from '../services/socket.service';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const userType = req.user.isExhibitor ? 'exhibitor' : 'admin';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const unreadOnly = req.query.unreadOnly === 'true';
    
    let query: any = {
      recipient: userId,
      recipientType: userType
    };
    
    if (unreadOnly) {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      recipientType: userType,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        },
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications'
    });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
    const userType = req.user.isExhibitor ? 'exhibitor' : 'admin';

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOneAndUpdate(
      { 
        _id: notificationId, 
        recipient: userId,
        recipientType: userType
      },
      {
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or you do not have permission to update it'
      });
    }

    // Get updated unread count
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      recipientType: userType,
      isRead: false
    });

    // Emit update to the user
    const socket = getSocketInstance();
    if (socket) {
      const userRoom = `user-${userId}`;
      socket.to(userRoom).emit('notification_update', { unreadCount });
    }

    return res.status(200).json({
      success: true,
      data: {
        notification,
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating notification'
    });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const userType = req.user.isExhibitor ? 'exhibitor' : 'admin';

    await Notification.updateMany(
      { 
        recipient: userId,
        recipientType: userType,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    // Emit update to the user
    const socket = getSocketInstance();
    if (socket) {
      const userRoom = `user-${userId}`;
      socket.to(userRoom).emit('notification_update', { unreadCount: 0 });
    }

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        unreadCount: 0
      }
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating notifications'
    });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
    const userType = req.user.isExhibitor ? 'exhibitor' : 'admin';

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification ID'
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
      recipientType: userType
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found or you do not have permission to delete it'
      });
    }

    // Get updated unread count if the deleted notification was unread
    let unreadCount = 0;
    if (!(notification as any).isRead) {
      unreadCount = await Notification.countDocuments({
        recipient: userId,
        recipientType: userType,
        isRead: false
      });
      
      // Emit update to the user
      const socket = getSocketInstance();
      if (socket) {
        const userRoom = `user-${userId}`;
        socket.to(userRoom).emit('notification_update', { unreadCount });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
      data: {
        unreadCount
      }
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting notification'
    });
  }
};

export const deleteAllNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const userType = req.user.isExhibitor ? 'exhibitor' : 'admin';

    // Delete all notifications for this user
    const result = await Notification.deleteMany({
      recipient: userId,
      recipientType: userType
    });

    if (result.deletedCount === 0) {
      return res.status(200).json({
        success: true,
        message: 'No notifications found to delete',
        data: {
          unreadCount: 0
        }
      });
    }

    // Emit update to the user
    const socket = getSocketInstance();
    if (socket) {
      const userRoom = `user-${userId}`;
      socket.to(userRoom).emit('notification_update', { unreadCount: 0 });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} notifications`,
      data: {
        unreadCount: 0
      }
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting notifications'
    });
  }
};

// Helper function to create a notification (for internal use by other controllers)
export const createNotification = async (
  recipient: string | mongoose.Types.ObjectId,
  recipientType: 'admin' | 'exhibitor',
  title: string,
  message: string,
  type: NotificationType,
  options: {
    priority?: NotificationPriority,
    entityId?: string | mongoose.Types.ObjectId,
    entityType?: string,
    data?: any
  } = {}
): Promise<INotification> => {
  try {
    console.log(`Creating notification for ${recipientType} ${recipient}: ${title}`);
    
    const notification = await Notification.create({
      recipient,
      recipientType,
      title,
      message,
      type,
      priority: options.priority || NotificationPriority.MEDIUM,
      entityId: options.entityId,
      entityType: options.entityType,
      data: options.data
    });

    // Emit to the specific user's room
    const socket = getSocketInstance();
    if (socket) {
      const userRoom = `user-${recipient}`;
      
      // Count unread notifications for the user
      const unreadCount = await Notification.countDocuments({
        recipient,
        recipientType,
        isRead: false
      });
      
      console.log(`Emitting notification to ${recipientType} ${recipient} in room ${userRoom}. Unread count: ${unreadCount}`);
      
      // Emit both the new notification and updated unread count
      socket.to(userRoom).emit('new_notification', {
        notification,
        unreadCount
      });
      
      // Also try a direct broadcast to the user's room
      socket.in(userRoom).emit('new_notification', {
        notification,
        unreadCount
      });
    } else {
      console.warn('Socket instance not available for notification emission');
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// For bulk operations
export const createBulkNotifications = async (
  notifications: Array<{
    recipient: string | mongoose.Types.ObjectId,
    recipientType: 'admin' | 'exhibitor',
    title: string,
    message: string,
    type: NotificationType,
    priority?: NotificationPriority,
    entityId?: string | mongoose.Types.ObjectId,
    entityType?: string,
    data?: any
  }>
): Promise<INotification[]> => {
  try {
    const formattedNotifications = notifications.map(n => ({
      recipient: n.recipient,
      recipientType: n.recipientType,
      title: n.title,
      message: n.message,
      type: n.type,
      priority: n.priority || NotificationPriority.MEDIUM,
      entityId: n.entityId,
      entityType: n.entityType,
      data: n.data,
      isRead: false
    }));

    const createdNotifications = await Notification.insertMany(formattedNotifications);
    const typedNotifications = createdNotifications as unknown as INotification[];
    
    // Group notifications by recipient for emitting
    const socket = getSocketInstance();
    if (socket) {
      const recipientGroups = notifications.reduce((acc, n) => {
        const key = `${n.recipient.toString()}-${n.recipientType}`;
        if (!acc[key]) {
          acc[key] = {
            recipient: n.recipient,
            recipientType: n.recipientType,
            count: 0
          };
        }
        acc[key].count++;
        return acc;
      }, {} as Record<string, { recipient: string | mongoose.Types.ObjectId, recipientType: string, count: number }>);
      
      // Emit to each recipient
      for (const key in recipientGroups) {
        const { recipient, recipientType } = recipientGroups[key];
        const userRoom = `user-${recipient}`;
        
        const unreadCount = await Notification.countDocuments({
          recipient,
          recipientType,
          isRead: false
        });
        
        socket.to(userRoom).emit('notification_update', { 
          unreadCount,
          newNotifications: typedNotifications.filter(
            n => n.recipient.toString() === recipient.toString() && n.recipientType === recipientType
          )
        });
      }
    }

    return typedNotifications;
  } catch (error) {
    console.error('Error creating bulk notifications:', error);
    throw error;
  }
}; 