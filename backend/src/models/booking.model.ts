import mongoose, { Document, Schema } from 'mongoose';

/**
 * Interface for discount validation properties
 */
interface IDiscountValidationProps {
  value: number;
}

/**
 * Interface for Mongoose document methods needed for validation
 */
interface IMongooseDocument {
  ownerDocument: () => any;
  parent: () => any;
}

/**
 * Interface for discount document structure
 * Discounts are optional in the booking system
 */
interface IDiscountDocument {
  discount?: {
    name: string;
    type: string;
    value: number;
    amount: number;
  };
}

/**
 * Main Booking interface that defines the structure of a booking document
 * @interface IBooking
 * @extends {Document}
 */
export interface IBooking extends Document {
  exhibitionId: mongoose.Types.ObjectId;
  stallIds: mongoose.Types.ObjectId[];
  userId: mongoose.Types.ObjectId;
  exhibitorId?: mongoose.Types.ObjectId; // ID of the exhibitor who made the booking
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerGSTIN?: string;
  customerPAN?: string;
  companyName: string;
  amount: number;
  calculations: {
    /** Array of stall bookings with their individual calculations */
    stalls: Array<{
      stallId: mongoose.Types.ObjectId;
      number: string;
      baseAmount: number;
      /** Optional discount that can be applied to each stall */
      discount?: {
        name: string;
        type: string;
        value: number;
        amount: number;
      } | null;
      amountAfterDiscount: number;
    }>;
    totalBaseAmount: number;
    totalDiscountAmount: number;
    totalAmountAfterDiscount: number;
    /** Array of applicable taxes with their calculations */
    taxes: Array<{
      name: string;
      rate: number;
      amount: number;
    }>;
    totalTaxAmount: number;
    totalAmount: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'approved' | 'rejected';
  rejectionReason?: string; // Reason for rejection if status is 'rejected'
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentDetails?: {
    method: string;
    transactionId: string;
    paidAt: Date;
  };
  bookingSource?: 'admin' | 'exhibitor'; // Indicates who created the booking
}

/**
 * Mongoose schema for the Booking model
 * Defines the structure and validation rules for bookings
 */
const bookingSchema = new Schema({
  exhibitionId: {
    type: Schema.Types.ObjectId,
    ref: 'Exhibition',
    required: true,
  },
  stallIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Stall',
    required: true,
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exhibitorId: {
    type: Schema.Types.ObjectId,
    ref: 'Exhibitor',
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  customerAddress: {
    type: String,
    required: true,
  },
  customerGSTIN: {
    type: String,
    required: false,
  },
  customerPAN: {
    type: String,
    required: false,
  },
  companyName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  calculations: {
    stalls: [{
      stallId: {
        type: Schema.Types.ObjectId,
        ref: 'Stall',
        required: true
      },
      number: String,
      baseAmount: Number,
      /** 
       * Discount configuration for each stall
       * - Can be null/undefined for bookings without discounts
       * - When present, must include name, type, value, and amount
       * - Supports both percentage and fixed amount discounts
       * - Percentage discounts must be <= 100%
       * - Fixed discounts must be <= stall base amount
       */
      discount: {
        type: new Schema({
          name: { type: String },
          type: { 
            type: String,
            enum: ['percentage', 'fixed']
          },
          value: {
            type: Number,
            min: 0,
            validate: {
              validator: function(this: any, v: number) {
                if (this.type === 'percentage') {
                  return v <= 100;
                }
                return true;
              },
              message: (props: IDiscountValidationProps) => 
                props.value > 100 ? 'Percentage discount cannot exceed 100%' : 'Discount value must be positive'
            }
          },
          amount: {
            type: Number,
            min: 0,
            validate: {
              validator: function(this: any, v: number) {
                const parent = this.ownerDocument?.();
                if (!parent?.baseAmount) return true;
                
                if (this.type === 'percentage') {
                  const percentage = Math.min(Math.max(0, this.value), 100);
                  const expectedAmount = Math.round((parent.baseAmount * percentage / 100) * 100) / 100;
                  return Math.abs(v - expectedAmount) <= 1;
                } else if (this.type === 'fixed') {
                  return v <= parent.baseAmount;
                }
                return true;
              },
              message: 'Invalid discount amount'
            }
          }
        }),
        required: false // Discounts are optional in the booking system
      },
      amountAfterDiscount: {
        type: Number,
        required: true,
        validate: {
          validator: function(v: number) {
            return v >= 0;
          },
          message: 'Amount after discount cannot be negative'
        }
      }
    }],
    totalBaseAmount: {
      type: Number,
      required: true
    },
    totalDiscountAmount: {
      type: Number,
      required: true
    },
    totalAmountAfterDiscount: {
      type: Number,
      required: true
    },
    taxes: [{
      name: String,
      rate: Number,
      amount: Number
    }],
    totalTaxAmount: {
      type: Number,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'confirmed', 'cancelled'],
    default: 'pending',
  },
  rejectionReason: {
    type: String,
    required: function(this: any) {
      return this.status === 'rejected';
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  paymentDetails: {
    method: String,
    transactionId: String,
    paidAt: Date,
  },
  bookingSource: {
    type: String,
    enum: ['admin', 'exhibitor'],
    default: 'admin'
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
bookingSchema.index({ exhibitionId: 1 });
bookingSchema.index({ stallIds: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });

// Ensure stalls can only be booked once per exhibition
bookingSchema.index(
  { exhibitionId: 1, stallIds: 1, status: 1 },
  { 
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } }
  }
);

export default mongoose.model<IBooking>('Booking', bookingSchema); 