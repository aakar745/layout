import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceCharge extends Document {
  exhibitionId: mongoose.Types.ObjectId;
  
  // Vendor Information
  vendorName: string;
  vendorPhone: string;
  vendorEmail?: string;
  companyName: string;
  exhibitorCompanyName?: string;
  stallNumber: string;
  vendorAddress?: string;
  
  // Service Details
  serviceType: string;
  amount: number;
  description?: string;
  
  // Razorpay Integration
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paidAt?: Date;
  
  // Receipt Information
  receiptNumber?: string; // Auto-generated
  receiptGenerated: boolean;
  receiptPath?: string;
  
  // Status & Tracking
  status: 'submitted' | 'paid' | 'completed' | 'cancelled';
  adminNotes?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const serviceChargeSchema = new Schema({
  exhibitionId: {
    type: Schema.Types.ObjectId,
    ref: 'Exhibition',
    required: true,
  },
  
  // Vendor Information
  vendorName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Vendor name cannot exceed 100 characters']
  },
  vendorPhone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9-+()]*$/, 'Please enter a valid phone number']
  },
  vendorEmail: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Vendor company name cannot exceed 100 characters']
  },
  exhibitorCompanyName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Exhibitor company name cannot exceed 100 characters']
  },
  stallNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, 'Stall number cannot exceed 20 characters']
  },
  vendorAddress: {
    type: String,
    trim: true
  },
  
  // Service Details
  serviceType: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Service type cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Razorpay Integration
  razorpayOrderId: {
    type: String,
    trim: true
  },
  razorpayPaymentId: {
    type: String,
    trim: true
  },
  razorpaySignature: {
    type: String,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  },
  
  // Receipt Information
  receiptNumber: {
    type: String,
    unique: true,
    sparse: true // Allow null values to be non-unique
  },
  receiptGenerated: {
    type: Boolean,
    default: false
  },
  receiptPath: {
    type: String,
    trim: true
  },
  
  // Status & Tracking
  status: {
    type: String,
    enum: ['submitted', 'paid', 'completed', 'cancelled'],
    default: 'submitted'
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
serviceChargeSchema.index({ exhibitionId: 1 });
serviceChargeSchema.index({ paymentStatus: 1 });
serviceChargeSchema.index({ status: 1 });
serviceChargeSchema.index({ createdAt: -1 });
serviceChargeSchema.index({ vendorEmail: 1 });
serviceChargeSchema.index({ razorpayOrderId: 1 });

// Compound indexes for common query combinations
serviceChargeSchema.index({ exhibitionId: 1, paymentStatus: 1 });
serviceChargeSchema.index({ exhibitionId: 1, status: 1 });
serviceChargeSchema.index({ exhibitionId: 1, createdAt: -1 });

// Generate receipt number before saving
serviceChargeSchema.pre('save', async function(next) {
  if (this.isNew && !this.receiptNumber) {
    const count = await mongoose.model('ServiceCharge').countDocuments();
    const receiptNumber = `SC${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`;
    this.receiptNumber = receiptNumber;
  }
  next();
});

export default mongoose.model<IServiceCharge>('ServiceCharge', serviceChargeSchema); 