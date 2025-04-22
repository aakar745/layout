// Notification type enum
export enum NotificationType {
  NEW_LEAD = 'New Lead',
  FOLLOWUP_DUE = 'Follow-up Due',
  STATUS_CHANGE = 'Status Changed',
  ASSIGNMENT = 'Lead Assigned',
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
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

// Notification read status
export enum NotificationStatus {
  READ = 'Read',
  UNREAD = 'Unread',
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  source?: NotificationSource;
  priority: NotificationPriority;
  status: NotificationStatus;
  entityId?: string; // ID of related entity (lead, followup, etc.)
  entityType?: string; // Type of related entity (lead, followup, etc.)
  createdAt: string;
  readAt?: string;
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