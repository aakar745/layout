import mongoose, { Document, Schema } from 'mongoose';

export interface IStall extends Document {
  number: string;
  hallId: mongoose.Types.ObjectId;
  exhibitionId: mongoose.Types.ObjectId;
  stallTypeId: mongoose.Types.ObjectId;
  dimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
    shapeType?: 'rectangle' | 'l-shape';
    lShape?: {
      rect1Width: number;
      rect1Height: number;
      rect2Width: number;
      rect2Height: number;
      orientation: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'horizontal' | 'vertical';
    };
  };
  ratePerSqm: number;
  status: 'available' | 'reserved' | 'booked';
  // Atomic booking lock fields for race condition prevention
  lockId?: string;
  lockExpiry?: Date;
  lockedBy?: string;
  lockType?: 'admin' | 'exhibitor';
}

const stallSchema = new Schema({
  number: {
    type: String,
    required: true,
    trim: true,
  },
  hallId: {
    type: Schema.Types.ObjectId,
    ref: 'Hall',
    required: true,
  },
  exhibitionId: {
    type: Schema.Types.ObjectId,
    ref: 'Exhibition',
    required: true,
  },
  stallTypeId: {
    type: Schema.Types.ObjectId,
    ref: 'StallType',
    required: true,
  },
  dimensions: {
    x: {
      type: Number,
      required: true,
      default: 0,
    },
    y: {
      type: Number,
      required: true,
      default: 0,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    shapeType: {
      type: String,
      enum: ['rectangle', 'l-shape'],
      default: 'rectangle'
    },
    lShape: {
      rect1Width: Number,
      rect1Height: Number,
      rect2Width: Number,
      rect2Height: Number,
      orientation: {
        type: String,
        enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'horizontal', 'vertical'],
        default: 'bottom-left'
      }
    }
  },
  ratePerSqm: {
    type: Number,
    required: true,
    min: 0,
    description: 'Rate per square meter'
  },
  status: {
    type: String,
    enum: ['available', 'reserved', 'booked'],
    default: 'available',
  },
  // Atomic booking lock fields for preventing race conditions
  lockId: {
    type: String,
    sparse: true, // Allow multiple nulls but unique non-null values
    index: true
  },
  lockExpiry: {
    type: Date,
    sparse: true,
    index: true
  },
  lockedBy: {
    type: String,
    sparse: true
  },
  lockType: {
    type: String,
    enum: ['admin', 'exhibitor'],
    sparse: true
  },
}, {
  timestamps: true,
});

// Indexes for faster queries
stallSchema.index({ exhibitionId: 1, hallId: 1 });
stallSchema.index({ number: 1, exhibitionId: 1 }, { unique: true });

// Additional indexes for common query patterns
stallSchema.index({ status: 1 }); // Frequent filtering by status
stallSchema.index({ stallTypeId: 1 }); // Queries by stall type
stallSchema.index({ createdAt: 1 }); // Sorting by creation date

// Enhanced compound indexes for common query combinations
stallSchema.index({ exhibitionId: 1, status: 1 }); // Available/booked stalls by exhibition
stallSchema.index({ hallId: 1, status: 1 }); // Available stalls by hall
stallSchema.index({ stallTypeId: 1, status: 1 }); // Available stalls by type
stallSchema.index({ exhibitionId: 1, stallTypeId: 1 }); // Stalls by exhibition and type
stallSchema.index({ exhibitionId: 1, status: 1, stallTypeId: 1 }); // Complex filtering

// Spatial/dimensional queries (for layout positioning)
stallSchema.index({ 'dimensions.x': 1, 'dimensions.y': 1 }); // Position-based queries

// Atomic booking lock indexes for race condition prevention
stallSchema.index({ lockExpiry: 1 }); // For cleanup of expired locks
stallSchema.index({ lockId: 1 }, { sparse: true, unique: true }); // Ensure unique locks
stallSchema.index({ status: 1, lockExpiry: 1 }); // For finding available/expired stalls
stallSchema.index({ lockedBy: 1, lockType: 1 }); // For user-specific lock queries

export default mongoose.model<IStall>('Stall', stallSchema); 