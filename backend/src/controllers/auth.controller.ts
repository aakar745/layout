import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import Role from '../models/role.model';
import { APIError } from '../utils/errors';
import { logActivity } from '../services/activity.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Get default role (viewer)
    const defaultRole = await Role.findOne({ name: 'Viewer' });
    if (!defaultRole) {
      return res.status(500).json({ message: 'Default role not found' });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: defaultRole._id,
    });

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: defaultRole,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // Allow login with either username or email
    const loginIdentifier = email || username;
    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Please provide username/email and password' });
    }

    // Check if user exists by either username or email
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier },
        { username: loginIdentifier }
      ]
    }).populate('role');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ 
        message: 'Your account has been deactivated. Please contact the administrator for assistance.',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: (user.role as any).name },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    // Log successful login
    await logActivity(req, {
      action: 'user_login',
      resource: 'auth',
      resourceId: user._id.toString(),
      description: `User "${user.username}" logged in successfully`,
      metadata: {
        username: user.username,
        email: user.email,
        role: (user.role as any).name,
        loginMethod: email ? 'email' : 'username'
      }
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Log failed login attempt
    await logActivity(req, {
      action: 'user_login',
      resource: 'auth',
      description: `Failed login attempt for "${req.body.username || req.body.email}"`,
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Login failed',
      metadata: {
        attemptedUsername: req.body.username,
        attemptedEmail: req.body.email
      }
    });

    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const user = await User.findById(req.user.id).populate('role').select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error getting user profile', error });
  }
};

/**
 * Change password for logged-in user
 * POST /api/auth/change-password
 * Private route (requires authentication)
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    // Find user by ID (from auth middleware)
    const user = await User.findById(req.user?._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ 
      message: 'Password has been changed successfully',
      success: true
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
}; 