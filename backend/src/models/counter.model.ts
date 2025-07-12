import mongoose, { Document, Schema } from 'mongoose';

export interface ICounter extends Document {
  _id: string;
  sequence: number;
  year: number;
}

const counterSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  sequence: {
    type: Number,
    default: 0
  },
  year: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
counterSchema.index({ _id: 1, year: 1 });

export default mongoose.model<ICounter>('Counter', counterSchema); 