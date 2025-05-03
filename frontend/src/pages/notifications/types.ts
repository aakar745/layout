// Notification type enum
export enum NotificationType {
  NEW_LEAD = 'New Lead',
  FOLLOWUP_DUE = 'Follow-up Due',
  STATUS_CHANGE = 'Status Changed',
  ASSIGNMENT = 'Lead Assigned',
  NEW_BOOKING = 'NEW_BOOKING',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  INVOICE_GENERATED = 'INVOICE_GENERATED',
  EXHIBITION_UPDATE = 'EXHIBITION_UPDATE',
  SYSTEM_MESSAGE = 'SYSTEM_MESSAGE',
  EXHIBITOR_MESSAGE = 'EXHIBITOR_MESSAGE',
  EXHIBITOR_REGISTERED = 'EXHIBITOR_REGISTERED'
}

// Notification source enum
export enum NotificationSource {
  FACEBOOK = 'Facebook',
  WEBSITE = 'Website',
  MANUAL = 'Manual',
  SYSTEM = 'System',
}

// Notification priority enum
export enum NotificationPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

// Notification read status
export enum NotificationStatus {
  READ = 'Read',
  UNREAD = 'Unread',
}

// Notification interface matching the API service
export interface Notification {
  _id: string;
  recipient: string;
  recipientType: 'admin' | 'exhibitor';
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: string;
  entityId?: string;
  entityType?: string;
  data?: any;
  createdAt: string;
  updatedAt: string;
  // Support for legacy mock properties
  id?: string;
  userId?: string;
  status?: NotificationStatus;
  source?: NotificationSource;
}

// Email notification settings
export interface EmailNotificationSettings {
  newLeads: boolean;
  followUpReminders: boolean;
  statusChanges: boolean;
  leadAssignments: boolean;
}

// Notification preference interface
export interface NotificationPreferences {
  userId: string;
  inApp: {
    enabled: boolean;
    newLeads: boolean;
    followUpReminders: boolean;
    statusChanges: boolean;
    leadAssignments: boolean;
  };
  email: EmailNotificationSettings;
  pushNotifications: boolean;
} 