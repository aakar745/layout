import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  name?: string;
  email: string;
  password: string;
  role: mongoose.Types.ObjectId;
  isActive: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    console.log('Password not modified, skipping hash');
    return next();
  }
  
  try {
    console.log('Hashing password for user:', this.username);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashed successfully:', this.password.substring(0, 10) + '...');
    next();
  } catch (error: any) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    if (!this.password) {
      console.error('No password hash stored for user');
      return false;
    }

    if (!candidatePassword) {
      console.error('No candidate password provided');
      return false;
    }

    console.log('Password comparison details:', {
      userId: this._id,
      username: this.username,
      email: this.email,
      storedHashLength: this.password.length,
      storedHashPreview: this.password.substring(0, 10) + '...',
      hashValid: this.password.startsWith('$2a$') || this.password.startsWith('$2b$'),
      candidatePasswordProvided: !!candidatePassword,
      candidatePasswordLength: candidatePassword.length
    });

    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison result:', {
      isMatch,
      username: this.username,
      email: this.email
    });

    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

export default mongoose.model<IUser>('User', userSchema); 