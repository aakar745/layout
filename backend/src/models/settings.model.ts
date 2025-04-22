import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  adminEmail: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  logo: string;
  footerText?: string;
  createdBy: mongoose.Types.ObjectId;
}

const settingsSchema = new Schema({
  siteName: {
    type: String,
    required: true,
    trim: true,
  },
  adminEmail: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  language: {
    type: String,
    default: 'en',
    enum: ['en', 'es', 'fr'],
  },
  timezone: {
    type: String,
    default: 'UTC',
  },
  emailNotifications: {
    type: Boolean,
    default: true,
  },
  logo: {
    type: String,
    trim: true,
  },
  footerText: {
    type: String,
    trim: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<ISettings>('Settings', settingsSchema); 