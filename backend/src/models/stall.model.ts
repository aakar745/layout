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
  };
  ratePerSqm: number;
  status: 'available' | 'reserved' | 'booked';
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
}, {
  timestamps: true,
});

// Indexes for faster queries
stallSchema.index({ exhibitionId: 1, hallId: 1 });
stallSchema.index({ number: 1, exhibitionId: 1 }, { unique: true });

export default mongoose.model<IStall>('Stall', stallSchema); 