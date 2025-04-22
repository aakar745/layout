import mongoose from 'mongoose';

const stallTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  features: [{
    feature: {
      type: String,
      trim: true
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

const StallType = mongoose.model('StallType', stallTypeSchema);

export default StallType; 