import mongoose, { Document, Schema } from 'mongoose';

export interface IWebhookEvent extends Document {
  eventId: string; // Idempotency key
  eventType: 'phonepe_callback' | 'phonepe_verify';
  merchantTransactionId: string;
  transactionId?: string;
  state: string;
  responseCode: string;
  rawPayload: any;
  processedAt: Date;
  processingStatus: 'processed' | 'failed' | 'skipped';
  serviceChargeId?: mongoose.Types.ObjectId;
  ipAddress?: string;
  userAgent?: string;
  retryCount: number;
  createdAt: Date;
}

const webhookEventSchema = new Schema({
  eventId: {
    type: String,
    required: true,
    unique: true, // Ensures idempotency
    trim: true,
    maxlength: [255, 'Event ID cannot exceed 255 characters']
  },
  eventType: {
    type: String,
    enum: ['phonepe_callback', 'phonepe_verify'],
    required: true
  },
  merchantTransactionId: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  transactionId: {
    type: String,
    trim: true,
    index: true
  },
  state: {
    type: String,
    required: true,
    enum: ['COMPLETED', 'FAILED', 'PENDING', 'INITIATED', 'PROCESSING', 'UNKNOWN'],
    default: 'PENDING'
  },
  responseCode: {
    type: String,
    required: true,
    enum: ['SUCCESS', 'FAILED', 'PENDING', 'UNKNOWN'],
    default: 'PENDING'
  },
  rawPayload: {
    type: Schema.Types.Mixed,
    required: true
  },
  processedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  processingStatus: {
    type: String,
    enum: ['processed', 'failed', 'skipped'],
    required: true,
    default: 'processed'
  },
  serviceChargeId: {
    type: Schema.Types.ObjectId,
    ref: 'ServiceCharge',
    index: true
  },
  ipAddress: {
    type: String,
    trim: true,
    maxlength: [45, 'IP address cannot exceed 45 characters'] // IPv6 support
  },
  userAgent: {
    type: String,
    trim: true,
    maxlength: [500, 'User agent cannot exceed 500 characters']
  },
  retryCount: {
    type: Number,
    default: 0,
    min: [0, 'Retry count cannot be negative']
  }
}, {
  timestamps: true
});

// Indexes for performance and deduplication
webhookEventSchema.index({ eventId: 1 }, { unique: true }); // Primary idempotency index
webhookEventSchema.index({ merchantTransactionId: 1 });
webhookEventSchema.index({ transactionId: 1 });
webhookEventSchema.index({ eventType: 1, createdAt: -1 });
webhookEventSchema.index({ processingStatus: 1, createdAt: -1 });

// Compound indexes for common queries
webhookEventSchema.index({ merchantTransactionId: 1, eventType: 1 });
webhookEventSchema.index({ serviceChargeId: 1, eventType: 1 });

// TTL index to automatically clean up old webhook events (keep for 90 days)
webhookEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.model<IWebhookEvent>('WebhookEvent', webhookEventSchema);
