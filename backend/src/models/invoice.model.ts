import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
  bookingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  invoiceNumber: string;
  items: {
    description: string;
    amount: number;
  }[];
  paymentDetails?: {
    method: string;
    transactionId: string;
    paidAt: Date;
  };
  dueDate: Date;
}

const invoiceSchema = new Schema({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  invoiceNumber: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled', 'refunded'],
    default: 'pending',
  },
  items: [{
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  }],
  paymentDetails: {
    method: String,
    transactionId: String,
    paidAt: Date,
  },
  dueDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
invoiceSchema.index({ userId: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ dueDate: 1 });

// Additional indexes for common query patterns
invoiceSchema.index({ createdAt: 1 }); // Sorting by creation date
invoiceSchema.index({ updatedAt: 1 }); // Recently updated invoices

// Enhanced compound indexes for common query combinations
invoiceSchema.index({ userId: 1, status: 1 }); // User invoices by status
invoiceSchema.index({ status: 1, dueDate: 1 }); // Overdue invoices
invoiceSchema.index({ status: 1, createdAt: -1 }); // Invoices by status sorted by date
invoiceSchema.index({ userId: 1, createdAt: -1 }); // User invoices sorted by date
invoiceSchema.index({ dueDate: 1, status: 1 }); // Due invoices by status

// Date range query optimization
invoiceSchema.index({ createdAt: -1, status: 1 }); // Latest invoices by status
invoiceSchema.index({ dueDate: 1, status: 1, createdAt: -1 }); // Complex date and status queries

export default mongoose.model<IInvoice>('Invoice', invoiceSchema); 