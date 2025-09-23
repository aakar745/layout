import mongoose, { Document, Schema } from 'mongoose';
import CounterService from '../services/counter.service';

export interface IServiceCharge extends Document {
  exhibitionId: mongoose.Types.ObjectId;
  
  // Vendor Information
  vendorName: string;
  vendorPhone: string;
  companyName: string;
  exhibitorCompanyName?: string;
  stallNumber: string;
  stallArea?: number; // Stall area for new pricing system
  uploadedImage?: string; // Path to uploaded image
  
  // Service Details
  serviceType: string;
  amount: number;
  
  // Payment Gateway Integration
  paymentGateway: 'phonepe';
  
  // PhonePe Integration
  phonePeOrderId?: string;
  phonePeTransactionId?: string;
  phonePeMerchantTransactionId?: string;
  
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled';
  paidAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  
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
  uploadedImage: {
    type: String,
    required: false,
    trim: true,
    maxlength: [255, 'Image path cannot exceed 255 characters']
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
    maxlength: [70, 'Stall number cannot exceed 70 characters']
  },
  stallArea: {
    type: Number,
    required: false,
    min: [0, 'Stall area must be positive']
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

  
  // Payment Gateway Integration
  paymentGateway: {
    type: String,
    enum: ['phonepe'],
    required: true
  },
  
  // PhonePe Integration
  phonePeOrderId: {
    type: String,
    trim: true
  },
  phonePeTransactionId: {
    type: String,
    trim: true
  },
  phonePeMerchantTransactionId: {
    type: String,
    trim: true
  },
  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paidAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Cancellation reason cannot exceed 500 characters']
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
serviceChargeSchema.index({ uploadedImage: 1 });
serviceChargeSchema.index({ phonePeMerchantTransactionId: 1 });

// 🔒 RACE CONDITION FIX: Index for atomic receipt generation operations
serviceChargeSchema.index({ receiptGenerated: 1 });

// Compound indexes for common query combinations
serviceChargeSchema.index({ exhibitionId: 1, paymentStatus: 1 });
serviceChargeSchema.index({ exhibitionId: 1, status: 1 });
serviceChargeSchema.index({ exhibitionId: 1, createdAt: -1 });

// 🔒 ATOMIC OPERATIONS: Compound index for receipt generation race condition prevention
serviceChargeSchema.index({ _id: 1, receiptGenerated: 1 });

// Generate receipt number before saving using atomic counter
serviceChargeSchema.pre('save', async function(next) {
  if (this.isNew && !this.receiptNumber) {
    try {
      console.log('[Service Charge] Generating receipt number for new service charge...');
      // Use atomic counter service to prevent race conditions
      this.receiptNumber = await CounterService.generateReceiptNumber();
      console.log('[Service Charge] Generated receipt number:', this.receiptNumber);
    } catch (error) {
      console.error('[Service Charge] Error generating receipt number:', error);
      console.error('[Service Charge] Error stack:', (error as Error).stack);
      
      // Create a more descriptive error message
      const errorMessage = `Failed to generate receipt number: ${(error as Error).message}`;
      return next(new Error(errorMessage));
    }
  }
  next();
});

export default mongoose.model<IServiceCharge>('ServiceCharge', serviceChargeSchema); 