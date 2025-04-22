import mongoose, { Document, Schema } from 'mongoose';

export interface IFixture extends Document {
  name: string;
  exhibitionId: mongoose.Types.ObjectId;
  type: string; // 'sofa', 'chair', 'table', 'exit', 'entrance', etc.
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  rotation: number;
  zIndex: number;
  icon?: string; // Path to the icon or SVG data
  color?: string; // Optional color override
  isActive: boolean;
  showName?: boolean; // Whether to display the fixture name on the layout
  borderColor?: string; // Optional border color
  borderRadius?: number; // Optional border radius in pixels
}

const fixtureSchema = new Schema({
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
  type: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
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
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
      min: 0.1,
    },
    height: {
      type: Number,
      required: true,
      min: 0.1,
    },
  },
  rotation: {
    type: Number,
    default: 0,
  },
  zIndex: {
    type: Number,
    default: 1,
  },
  icon: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  showName: {
    type: Boolean,
    default: true, // Default to showing names for backward compatibility
  },
  borderColor: {
    type: String,
    trim: true,
  },
  borderRadius: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true,
});

// Indexes for faster queries
fixtureSchema.index({ exhibitionId: 1 });
fixtureSchema.index({ type: 1, exhibitionId: 1 });

export default mongoose.model<IFixture>('Fixture', fixtureSchema); 