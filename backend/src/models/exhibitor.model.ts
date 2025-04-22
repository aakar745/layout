import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IExhibitor extends Document {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  website?: string;
  logo?: string;
  description?: string;
  panNumber?: string;
  gstNumber?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const exhibitorSchema = new Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  contactPerson: {
    type: String,
    required: [true, 'Contact person name is required'],
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[0-9-+()]*$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  address: {
    type: String,
    trim: true
  },
  panNumber: {
    type: String,
    trim: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number']
  },
  gstNumber: {
    type: String,
    trim: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GST number']
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pinCode: {
    type: String,
    trim: true,
    match: [/^[0-9]{6}$/, 'Please enter a valid 6-digit PIN code']
  },
  website: {
    type: String,
    trim: true,
    match: [/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/, 'Please enter a valid URL']
  },
  logo: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
exhibitorSchema.pre('save', async function(next) {
  const exhibitor = this;
  
  // Only hash the password if it has been modified (or is new)
  if (!exhibitor.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    
    // Hash the password along with the new salt
    const hash = await bcrypt.hash(exhibitor.password, salt);
    
    // Override the cleartext password with the hashed one
    exhibitor.password = hash;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password for login
exhibitorSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    return false;
  }
};

// Create and export the model
export default mongoose.model<IExhibitor>('Exhibitor', exhibitorSchema); 