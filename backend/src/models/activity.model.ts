import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  userId?: mongoose.Types.ObjectId;
  exhibitorId?: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: mongoose.Types.ObjectId;
  details: {
    description: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    metadata?: Record<string, any>;
  };
  ipAddress?: string;
  userAgent?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

const activitySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  exhibitorId: {
    type: Schema.Types.ObjectId,
    ref: 'Exhibitor',
    required: false,
  },
  action: {
    type: String,
    required: true,
    enum: [
      // User actions
      'user_created', 'user_updated', 'user_deleted', 'user_login', 'user_logout',
      // Exhibitor actions
      'exhibitor_registered', 'exhibitor_updated', 'exhibitor_deleted', 'exhibitor_created',
      'exhibitor_login', 'exhibitor_status_updated',
      // Exhibition actions
      'exhibition_created', 'exhibition_updated', 'exhibition_deleted', 'exhibition_published',
      'exhibition_completed',
      // Booking actions
      'booking_created', 'booking_updated', 'booking_cancelled', 'booking_approved',
      'booking_rejected', 'booking_confirmed', 'booking_deleted',
      // Invoice actions
      'invoice_created', 'invoice_updated', 'invoice_deleted', 'invoice_downloaded',
      'invoice_sent',
      // Stall actions
      'stall_created', 'stall_updated', 'stall_deleted', 'stall_status_changed',
      // Hall actions
      'hall_created', 'hall_updated', 'hall_deleted',
      // Letter actions
      'letter_sent', 'letter_scheduled', 'letter_cancelled',
      // Settings actions
      'settings_updated',
      // Role actions
      'role_created', 'role_updated', 'role_deleted',
      // General actions
      'data_exported', 'bulk_operation', 'system_backup'
    ],
  },
  resource: {
    type: String,
    required: true,
    enum: [
      'user', 'exhibitor', 'exhibition', 'booking', 'invoice', 'stall', 'hall',
      'letter', 'settings', 'role', 'system', 'auth'
    ],
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  details: {
    description: {
      type: String,
      required: true,
    },
    oldValues: {
      type: Schema.Types.Mixed,
      required: false,
    },
    newValues: {
      type: Schema.Types.Mixed,
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  ipAddress: {
    type: String,
    required: false,
  },
  userAgent: {
    type: String,
    required: false,
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
  endpoint: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
  errorMessage: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
activitySchema.index({ timestamp: -1 }); // Most recent first
activitySchema.index({ userId: 1, timestamp: -1 }); // User activities
activitySchema.index({ exhibitorId: 1, timestamp: -1 }); // Exhibitor activities
activitySchema.index({ action: 1, timestamp: -1 }); // Action-based queries
activitySchema.index({ resource: 1, timestamp: -1 }); // Resource-based queries
activitySchema.index({ resourceId: 1, timestamp: -1 }); // Specific resource activities
activitySchema.index({ success: 1, timestamp: -1 }); // Success/failure queries

export default mongoose.model<IActivity>('Activity', activitySchema); 