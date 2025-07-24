import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceChargeStall extends Document {
  exhibitionId: mongoose.Types.ObjectId;
  stallNumber: string;
  exhibitorCompanyName: string;
  stallArea: number; // in sqm
  dimensions?: {
    width: number;
    height: number;
  };
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const serviceChargeStallSchema = new Schema({
  exhibitionId: {
    type: Schema.Types.ObjectId,
    ref: 'Exhibition',
    required: true,
  },
  stallNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Stall number cannot exceed 50 characters']
  },
  exhibitorCompanyName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'Exhibitor company name cannot exceed 100 characters']
  },
  stallArea: {
    type: Number,
    required: true,
    min: [1, 'Stall area must be at least 1 sqm']
  },
  dimensions: {
    width: {
      type: Number,
      min: [0.1, 'Width must be at least 0.1 meters']
    },
    height: {
      type: Number,
      min: [0.1, 'Height must be at least 0.1 meters']
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create compound index for unique stall number per exhibition
serviceChargeStallSchema.index({ exhibitionId: 1, stallNumber: 1 }, { unique: true });

// Index for faster queries
serviceChargeStallSchema.index({ exhibitionId: 1, isActive: 1 });

export default mongoose.model<IServiceChargeStall>('ServiceChargeStall', serviceChargeStallSchema); 