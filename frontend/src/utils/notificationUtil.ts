import { 
  Notification, 
  NotificationType, 
  NotificationPriority, 
  NotificationStatus 
} from '../pages/notifications/types';
import dayjs from 'dayjs';
// Import the plugin without the .js extension
import relativeTime from 'dayjs/plugin/relativeTime';

// Enable relative time plugin
dayjs.extend(relativeTime);

/**
 * Get the appropriate icon color based on notification priority
 */
export const getPriorityColor = (priority: NotificationPriority): string => {
  switch (priority) {
    case NotificationPriority.HIGH:
      return '#f5222d'; // Red
    case NotificationPriority.MEDIUM:
      return '#faad14'; // Orange
    case NotificationPriority.LOW:
      return '#52c41a'; // Green
    default:
      return '#1677ff'; // Blue
  }
};

/**
 * Get the appropriate icon for notification type
 */
export const getNotificationTypeIcon = (type: NotificationType): string => {
  switch (type) {
    case NotificationType.NEW_LEAD:
      return 'user-add';
    case NotificationType.FOLLOWUP_DUE:
      return 'clock-circle';
    case NotificationType.STATUS_CHANGE:
      return 'swap';
    case NotificationType.ASSIGNMENT:
      return 'user';
    default:
      return 'bell';
  }
};

/**
 * Format the relative time for display
 */
export const formatRelativeTime = (dateString: string): string => {
  return dayjs(dateString).fromNow();
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

/**
 * Check if a notification is recent (less than 24 hours old)
 */
export const isRecentNotification = (notification: Notification): boolean => {
  const notificationDate = dayjs(notification.createdAt);
  const now = dayjs();
  return now.diff(notificationDate, 'hour') < 24;
};

/**
 * Get the count of unread notifications
 */
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => n.status === NotificationStatus.UNREAD).length;
};

/**
 * Get the appropriate route for a notification based on its entity type
 */
export const getNotificationRoute = (notification: Notification): string => {
  if (!notification.entityId || !notification.entityType) {
    return '/notifications';
  }

  switch (notification.entityType) {
    case 'lead':
      return `/leads/${notification.entityId}`;
    case 'followup':
      return `/followups/${notification.entityId}`;
    default:
      return '/notifications';
  }
}; 