import mongoose, { Document, Schema } from 'mongoose';

export interface IHall extends Document {
  name: string;
  exhibitionId: mongoose.Types.ObjectId;
  dimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const hallSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  exhibitionId: {
    type: Schema.Types.ObjectId,
    ref: 'Exhibition',
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
}, {
  timestamps: true,
});

// Index for faster queries and unique constraint
hallSchema.index({ exhibitionId: 1 });
hallSchema.index({ name: 1, exhibitionId: 1 }, { unique: true });

export default mongoose.model<IHall>('Hall', hallSchema); 