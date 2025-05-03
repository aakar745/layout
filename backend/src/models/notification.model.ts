import mongoose, { Document, Schema } from 'mongoose';

export enum NotificationType {
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

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  recipientType: 'admin' | 'exhibitor';
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: Date;
  entityId?: mongoose.Types.ObjectId; // ID of related entity (booking, invoice, etc.)
  entityType?: string; // Type of related entity (booking, invoice, etc.)
  data?: any; // Additional data related to notification
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'recipientType'
    },
    recipientType: {
      type: String,
      required: true,
      enum: ['admin', 'exhibitor'],
      default: 'admin'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true
    },
    priority: {
      type: String,
      enum: Object.values(NotificationPriority),
      default: NotificationPriority.MEDIUM
    },
    isRead: {
      type: Boolean,
      default: false
    },
    readAt: {
      type: Date
    },
    entityId: {
      type: Schema.Types.ObjectId,
      refPath: 'entityType'
    },
    entityType: {
      type: String,
      enum: ['Booking', 'Exhibition', 'Invoice', 'User', 'Exhibitor']
    },
    data: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

// Add index for faster queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipientType: 1, type: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema); 