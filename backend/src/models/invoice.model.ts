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

export default mongoose.model<IInvoice>('Invoice', invoiceSchema); 