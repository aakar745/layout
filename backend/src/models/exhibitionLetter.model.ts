import mongoose, { Document, Schema } from 'mongoose';

export interface IExhibitionLetter extends Document {
  exhibitionId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  exhibitorId: mongoose.Types.ObjectId;
  letterType: 'standPossession' | 'transport';
  
  // Letter Content
  subject: string;
  content: string;
  
  // Recipient Information
  recipientEmail: string;
  recipientName: string;
  companyName: string;
  stallNumbers: string[]; // Array of stall numbers
  
  // Sending Information
  status: 'pending' | 'sent' | 'failed' | 'scheduled';
  sentAt?: Date;
  scheduledFor?: Date;
  failureReason?: string;
  retryCount: number;
  
  // Sending Method
  sendingMethod: 'automatic' | 'manual';
  sentBy?: mongoose.Types.ObjectId; // User who manually sent (if manual)
  
  // Email Details
  emailMessageId?: string;
  isTestMode?: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const exhibitionLetterSchema = new Schema({
  exhibitionId: {
    type: Schema.Types.ObjectId,
    ref: 'Exhibition',
    required: true,
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  exhibitorId: {
    type: Schema.Types.ObjectId,
    ref: 'Exhibitor',
    required: true,
  },
  letterType: {
    type: String,
    enum: ['standPossession', 'transport'],
    required: true,
  },
  
  // Letter Content
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  
  // Recipient Information
  recipientEmail: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  recipientName: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  stallNumbers: [{
    type: String,
    required: true,
    trim: true,
  }],
  
  // Sending Information
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed', 'scheduled'],
    default: 'pending',
  },
  sentAt: {
    type: Date,
  },
  scheduledFor: {
    type: Date,
  },
  failureReason: {
    type: String,
    trim: true,
  },
  retryCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Sending Method
  sendingMethod: {
    type: String,
    enum: ['automatic', 'manual'],
    required: true,
  },
  sentBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Email Details
  emailMessageId: {
    type: String,
    trim: true,
  },
  isTestMode: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
exhibitionLetterSchema.index({ exhibitionId: 1, letterType: 1 });
exhibitionLetterSchema.index({ bookingId: 1 });
exhibitionLetterSchema.index({ exhibitorId: 1 });
exhibitionLetterSchema.index({ status: 1 });
exhibitionLetterSchema.index({ scheduledFor: 1 });
exhibitionLetterSchema.index({ createdAt: -1 });

// Compound indexes for common queries
exhibitionLetterSchema.index({ exhibitionId: 1, status: 1 });
exhibitionLetterSchema.index({ exhibitionId: 1, letterType: 1, status: 1 });

export default mongoose.model<IExhibitionLetter>('ExhibitionLetter', exhibitionLetterSchema); 