import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Exhibitor, { IExhibitor } from '../models/exhibitor.model';
import Booking from '../models/booking.model';
import Invoice from '../models/invoice.model';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import crypto from 'crypto';
import { getEmailTransporter, emailConfig } from '../config/email.config';
import User from '../models/user.model';
import { createNotification } from './notification.controller';
import { NotificationType, NotificationPriority } from '../models/notification.model';
import bcrypt from 'bcryptjs';

// Cache directory for PDFs - must match the one in invoice.controller.ts
const PDF_CACHE_DIR = join(process.cwd(), 'pdf-cache');

// In-memory OTP storage (in a production environment, this would be in Redis or another datastore)
const otpStorage: Record<string, { otp: string; expiresAt: Date }> = {};

// In-memory password reset OTP storage
const passwordResetOtpStorage: Record<string, { otp: string; expiresAt: Date }> = {};

/**
 * Generate and send OTP for exhibitor registration
 * POST /api/exhibitors/send-otp
 * Public route
 */
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if email already exists in the system
    const existingExhibitor = await Exhibitor.findOne({ email });
    if (existingExhibitor) {
      return res.status(400).json({ message: 'An exhibitor with this email already exists' });
    }
    
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Store OTP with 10-minute expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    otpStorage[email] = { otp, expiresAt };
    
    // Always log the OTP in development for testing purposes
    console.log(`[OTP for ${email}]: ${otp}`);
    
    // Send email with OTP
    try {
      // Get email transport configuration
      const { transporter, isTestMode, getTestMessageUrl } = await getEmailTransporter();
      
      // Send mail with defined transport object
      const info = await transporter.sendMail({
        from: emailConfig.from,
        to: email,
        subject: 'Email Verification Code',
        text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h1 style="color: #333; text-align: center;">Email Verification</h1>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for registering with our Exhibition Management System. To verify your email address, please use the following code:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${otp}</div>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #777; margin-top: 30px;">If you didn't request this code, you can safely ignore this email.</p>
          </div>
        `
      });
      
      // Log test message URL if in test mode
      if (isTestMode && getTestMessageUrl) {
        console.log('Preview URL: %s', getTestMessageUrl(info));
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email sending fails in development
    }
    
    res.status(200).json({ 
      message: 'OTP sent successfully',
      expiresAt
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
};

/**
 * Verify OTP for exhibitor registration
 * POST /api/exhibitors/verify-otp
 * Public route
 */
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    
    // Check if OTP exists for this email
    const storedData = otpStorage[email];
    if (!storedData) {
      return res.status(400).json({ message: 'OTP not found or expired. Please request a new one.' });
    }
    
    // Check if OTP has expired
    if (new Date() > storedData.expiresAt) {
      delete otpStorage[email];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    
    // Check if OTP matches
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }
    
    // OTP is valid - remove it from storage to prevent reuse
    delete otpStorage[email];
    
    res.status(200).json({ 
      message: 'Email verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Server error while verifying OTP' });
  }
};

/**
 * Request password reset - send OTP for verification
 * POST /api/exhibitors/forgot-password
 * Public route
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if email exists in the system
    const existingExhibitor = await Exhibitor.findOne({ email });
    if (!existingExhibitor) {
      // For security reasons, don't reveal that the email doesn't exist
      // Instead, pretend we sent an email anyway
      return res.status(200).json({ 
        message: 'If an account with that email exists, a password reset code has been sent' 
      });
    }
    
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Store OTP with 10-minute expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    passwordResetOtpStorage[email] = { otp, expiresAt };
    
    // Always log the OTP in development for testing purposes
    console.log(`[Password Reset OTP for ${email}]: ${otp}`);
    
    // Send email with OTP
    try {
      // Get email transport configuration
      const { transporter, isTestMode, getTestMessageUrl } = await getEmailTransporter();
      
      // Send mail with defined transport object
      const info = await transporter.sendMail({
        from: emailConfig.from,
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h1 style="color: #333; text-align: center;">Password Reset</h1>
            <p style="font-size: 16px; line-height: 1.5;">You requested a password reset for your Exhibition Management System account. Please use the following code to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${otp}</div>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">This code will expire in 10 minutes.</p>
            <p style="font-size: 14px; color: #777; margin-top: 30px;">If you didn't request this code, you can safely ignore this email.</p>
          </div>
        `
      });
      
      // Log test message URL if in test mode
      if (isTestMode && getTestMessageUrl) {
        console.log('Preview URL: %s', getTestMessageUrl(info));
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Don't fail the request if email sending fails in development
    }
    
    res.status(200).json({
      message: 'Password reset code sent successfully',
      expiresAt
    });
  } catch (error) {
    console.error('Error sending password reset code:', error);
    res.status(500).json({ message: 'Server error while processing your request' });
  }
};

/**
 * Reset password with OTP verification
 * POST /api/exhibitors/reset-password
 * Public route
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }
    
    // Check if OTP exists for this email
    const storedData = passwordResetOtpStorage[email];
    if (!storedData) {
      return res.status(400).json({ message: 'Reset code not found or expired. Please request a new one.' });
    }
    
    // Check if OTP has expired
    if (new Date() > storedData.expiresAt) {
      delete passwordResetOtpStorage[email];
      return res.status(400).json({ message: 'Reset code has expired. Please request a new one.' });
    }
    
    // Check if OTP matches
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid reset code. Please try again.' });
    }
    
    // Find exhibitor by email
    const exhibitor = await Exhibitor.findOne({ email });
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }
    
    // Update password
    exhibitor.password = newPassword;
    await exhibitor.save();
    
    // OTP is valid and password updated - remove OTP from storage to prevent reuse
    delete passwordResetOtpStorage[email];
    
    res.status(200).json({ 
      message: 'Password has been reset successfully',
      success: true
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error while resetting password' });
  }
};

/**
 * Register a new exhibitor
 * POST /api/exhibitors/register
 * Public route
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { companyName, contactPerson, email, phone, address, password } = req.body;

    // Check if exhibitor with this email already exists
    const existingExhibitor = await Exhibitor.findOne({ email });
    if (existingExhibitor) {
      return res.status(400).json({ message: 'Exhibitor with this email already exists' });
    }

    // Create new exhibitor
    const exhibitor = await Exhibitor.create({
      companyName,
      contactPerson,
      email,
      phone,
      address,
      password,
      status: 'pending', // New exhibitors start with pending status
      isActive: true
    });

    // Create JWT token with exhibitor ID
    const token = jwt.sign(
      { id: exhibitor._id, type: 'exhibitor' },
      process.env.EXHIBITOR_JWT_SECRET || 'exhibitorsecret',
      { expiresIn: '7d' }
    );

    // Don't send password in response
    const exhibitorResponse = {
      _id: exhibitor._id,
      companyName: exhibitor.companyName,
      contactPerson: exhibitor.contactPerson,
      email: exhibitor.email,
      phone: exhibitor.phone,
      address: exhibitor.address,
      status: exhibitor.status,
      isActive: exhibitor.isActive,
      createdAt: exhibitor.createdAt
    };

    // Send notification to all admin users about the new exhibitor registration
    try {
      // Find all admin users
      const adminUsers = await User.find({ isActive: true });
      
      if (adminUsers && adminUsers.length > 0) {
        // Notify each admin
        for (const admin of adminUsers) {
          await createNotification(
            admin._id,
            'admin',
            'New Exhibitor Registration',
            `A new exhibitor "${companyName}" has registered and is pending approval.`,
            NotificationType.EXHIBITOR_REGISTERED,
            {
              priority: NotificationPriority.HIGH,
              entityId: exhibitor._id,
              entityType: 'Exhibitor',
              data: {
                exhibitorId: exhibitor._id.toString(),
                companyName: exhibitor.companyName,
                contactPerson: exhibitor.contactPerson,
                email: exhibitor.email,
                phone: exhibitor.phone,
                registeredAt: exhibitor.createdAt
              }
            }
          );
        }
      }
    } catch (notificationError) {
      console.error('Error sending exhibitor registration notification:', notificationError);
      // Continue even if notification fails
    }

    res.status(201).json({
      exhibitor: exhibitorResponse,
      token,
      message: 'Registration successful. Your account is pending approval from the administrator.'
    });
  } catch (error) {
    console.error('Error registering exhibitor:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Authenticate exhibitor and get token
 * POST /api/exhibitors/login
 * Public route
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find exhibitor and include password for verification
    const exhibitor = await Exhibitor.findOne({ email }).select('+password');
    
    if (!exhibitor) {
      return res.status(401).json({ message: 'Email is not registered. Please register first.' });
    }

    // Check if exhibitor is active
    if (!exhibitor.isActive) {
      return res.status(401).json({ message: 'Your account has been deactivated. Please contact admin.' });
    }

    // Check if exhibitor is approved
    if (exhibitor.status !== 'approved') {
      return res.status(403).json({ 
        message: exhibitor.status === 'pending' 
          ? 'Your account is pending approval. Please wait for admin approval.'
          : 'Your account has been rejected. Please contact admin for more details.',
        status: exhibitor.status,
        rejectionReason: exhibitor.status === 'rejected' ? exhibitor.rejectionReason : undefined
      });
    }

    // Check if password matches
    const isMatch = await exhibitor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password. Please try again.' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: exhibitor._id, type: 'exhibitor' },
      process.env.EXHIBITOR_JWT_SECRET || 'exhibitorsecret',
      { expiresIn: '7d' }
    );

    // Don't send password in response
    const exhibitorResponse = {
      _id: exhibitor._id,
      companyName: exhibitor.companyName,
      contactPerson: exhibitor.contactPerson,
      email: exhibitor.email,
      phone: exhibitor.phone,
      status: exhibitor.status,
      isActive: exhibitor.isActive,
      createdAt: exhibitor.createdAt
    };

    res.json({
      exhibitor: exhibitorResponse,
      token
    });
  } catch (error) {
    console.error('Error during exhibitor login:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Get current exhibitor profile
 * GET /api/exhibitors/profile
 * Private route (requires exhibitor authentication)
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.exhibitor should be set by the auth middleware
    const exhibitor = await Exhibitor.findById(req.exhibitor?.id);
    
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }

    res.json(exhibitor);
  } catch (error) {
    console.error('Error fetching exhibitor profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

/**
 * Update exhibitor profile
 * PUT /api/exhibitors/profile
 * Private route (requires exhibitor authentication)
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { 
      companyName, 
      contactPerson, 
      phone, 
      address, 
      website, 
      description,
      panNumber,
      gstNumber,
      city,
      state,
      pinCode
    } = req.body;

    // Find exhibitor by ID
    const exhibitor = await Exhibitor.findById(req.exhibitor?.id);
    
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }

    // Update fields if provided
    if (companyName) exhibitor.companyName = companyName;
    if (contactPerson) exhibitor.contactPerson = contactPerson;
    if (phone) exhibitor.phone = phone;
    if (address !== undefined) exhibitor.address = address;
    if (website !== undefined) exhibitor.website = website;
    if (description !== undefined) exhibitor.description = description;
    if (panNumber !== undefined) exhibitor.panNumber = panNumber;
    if (gstNumber !== undefined) exhibitor.gstNumber = gstNumber;
    if (city !== undefined) exhibitor.city = city;
    if (state !== undefined) exhibitor.state = state;
    if (pinCode !== undefined) exhibitor.pinCode = pinCode;

    // Save updated exhibitor
    await exhibitor.save();

    // Update all associated bookings with new exhibitor data
    const bookings = await Booking.find({ exhibitorId: exhibitor._id });
    console.log(`[INFO] Updating ${bookings.length} bookings for exhibitor ${exhibitor._id}`);
    
    // For each booking, update the data and invalidate the invoice cache
    for (const booking of bookings) {
      const bookingUpdates: any = {};
      
      if (companyName) bookingUpdates.companyName = companyName;
      if (address !== undefined) bookingUpdates.customerAddress = address;
      if (phone) bookingUpdates.customerPhone = phone;
      if (contactPerson) bookingUpdates.customerName = contactPerson;
      if (panNumber !== undefined) bookingUpdates.customerPAN = panNumber;
      if (gstNumber !== undefined) bookingUpdates.customerGSTIN = gstNumber;
      
      if (Object.keys(bookingUpdates).length > 0) {
        console.log(`[INFO] Updating booking ${booking._id} with new exhibitor data`);
        await Booking.findByIdAndUpdate(booking._id, bookingUpdates);
        
        // Find the invoice for this booking
        const invoice = await Invoice.findOne({ bookingId: booking._id });
        if (invoice) {
          console.log(`[INFO] Invalidating cache for invoice ${invoice._id}`);
          
          // Find all cached files for this invoice
          try {
            // This logic mimics the invalidateInvoiceCache function
            // Try different key patterns to ensure all possible cached files are cleared
            const possiblePrefixes = [
              invoice._id.toString(),
              booking._id.toString()
            ];
            
            if (existsSync(PDF_CACHE_DIR)) {
              const files = require('fs').readdirSync(PDF_CACHE_DIR);
              for (const file of files) {
                for (const prefix of possiblePrefixes) {
                  if (file.includes(prefix) || file.startsWith(prefix)) {
                    const filePath = join(PDF_CACHE_DIR, file);
                    console.log(`[INFO] Removing cached file: ${file}`);
                    try {
                      unlinkSync(filePath);
                    } catch (err) {
                      console.error(`[ERROR] Failed to remove cache file: ${file}`, err);
                    }
                  }
                }
              }
            }
          } catch (cacheError) {
            console.error(`[ERROR] Error invalidating cache for invoice ${invoice._id}:`, cacheError);
          }
        }
      }
    }

    res.json(exhibitor);
  } catch (error) {
    console.error('Error updating exhibitor profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

/**
 * Get all exhibitors (admin only)
 * GET /api/admin/exhibitors
 * Private route (requires admin authentication)
 */
export const getAllExhibitors = async (req: Request, res: Response) => {
  try {
    const exhibitors = await Exhibitor.find().sort({ createdAt: -1 });
    res.json(exhibitors);
  } catch (error) {
    console.error('Error fetching all exhibitors:', error);
    res.status(500).json({ message: 'Server error fetching exhibitors' });
  }
};

/**
 * Update exhibitor status (admin only)
 * PUT /api/admin/exhibitors/:id/status
 * Private route (requires admin authentication)
 */
export const updateExhibitorStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    
    // Validate status
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find exhibitor
    const exhibitor = await Exhibitor.findById(id);
    
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }

    // Update fields
    exhibitor.status = status;
    
    // Set rejection reason if status is rejected
    if (status === 'rejected') {
      exhibitor.rejectionReason = rejectionReason || 'No reason provided';
    } else {
      exhibitor.rejectionReason = undefined;
    }

    // Save updated exhibitor
    await exhibitor.save();

    // Send email notification when exhibitor is approved
    if (status === 'approved') {
      try {
        // Get email transport configuration
        const { transporter, isTestMode, getTestMessageUrl } = await getEmailTransporter();
        
        // Send mail with defined transport object
        const info = await transporter.sendMail({
          from: emailConfig.from,
          to: exhibitor.email,
          subject: 'Your Exhibition Account is Approved',
          text: `Congratulations! Your exhibitor account has been approved. You can now log in to your account.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <h1 style="color: #333; text-align: center;">Account Approved</h1>
              <p style="font-size: 16px; line-height: 1.5;">Congratulations! Your exhibitor account for the Exhibition Management System has been approved by the administrator.</p>
              <div style="text-align: center; margin: 30px 0;">
                <div style="font-size: 18px; font-weight: bold; background-color: #f5f5f5; padding: 15px; border-radius: 5px;">You can now log in to your account</div>
              </div>
              <p style="font-size: 16px; line-height: 1.5;">You can now access all the features available to exhibitors, including:</p>
              <ul style="font-size: 16px; line-height: 1.5;">
                <li>Booking exhibition stalls</li>
                <li>Managing your bookings</li>
                <li>Updating your company profile</li>
                <li>Viewing exhibition details</li>
              </ul>
              <p style="font-size: 16px; line-height: 1.5;">Thank you for joining our platform.</p>
              <p style="font-size: 14px; color: #777; margin-top: 30px;">If you have any questions, please contact our support team.</p>
            </div>
          `
        });
        
        // Log test message URL if in test mode
        if (isTestMode && getTestMessageUrl) {
          console.log('Preview URL: %s', getTestMessageUrl(info));
        }
        
        // Also send a notification through the app
        await createNotification(
          exhibitor._id,
          'exhibitor',
          'Account Approved',
          'Your exhibitor account has been approved. You can now log in and access all features.',
          NotificationType.ACCOUNT_STATUS_CHANGE,
          {
            priority: NotificationPriority.HIGH,
            entityId: exhibitor._id,
            entityType: 'Exhibitor',
            data: {
              status: 'approved'
            }
          }
        );
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't fail the request if email sending fails
      }
    }
    // Send rejection notification
    else if (status === 'rejected') {
      try {
        // Send notification through the app
        await createNotification(
          exhibitor._id,
          'exhibitor',
          'Account Rejected',
          `Your exhibitor account has been rejected. Reason: ${exhibitor.rejectionReason}`,
          NotificationType.ACCOUNT_STATUS_CHANGE,
          {
            priority: NotificationPriority.HIGH,
            entityId: exhibitor._id,
            entityType: 'Exhibitor',
            data: {
              status: 'rejected',
              reason: exhibitor.rejectionReason
            }
          }
        );
      } catch (notificationError) {
        console.error('Error sending rejection notification:', notificationError);
        // Don't fail the request if notification fails
      }
    }

    res.json(exhibitor);
  } catch (error) {
    console.error('Error updating exhibitor status:', error);
    res.status(500).json({ message: 'Server error updating exhibitor status' });
  }
};

/**
 * Simple test endpoint to verify exhibitor routes
 * GET /api/exhibitors/test
 * Public route
 */
export const testRoute = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Exhibitor routes are working' });
};

/**
 * Delete an exhibitor (admin only)
 * DELETE /api/admin/exhibitors/:id
 * Private route (requires admin authentication)
 */
export const deleteExhibitor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find and delete the exhibitor
    const exhibitor = await Exhibitor.findByIdAndDelete(id);
    
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }

    res.json({ message: 'Exhibitor deleted successfully' });
  } catch (error) {
    console.error('Error deleting exhibitor:', error);
    res.status(500).json({ message: 'Server error deleting exhibitor' });
  }
};

/**
 * Update exhibitor details (admin only)
 * PUT /api/admin/exhibitors/:id
 * Private route (requires admin authentication)
 */
export const updateExhibitorDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      companyName, 
      contactPerson, 
      email, 
      phone, 
      address, 
      website, 
      description,
      panNumber,
      gstNumber,
      city,
      state,
      pinCode,
      isActive 
    } = req.body;

    // Find exhibitor
    const exhibitor = await Exhibitor.findById(id);
    
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }

    // Update fields if provided
    if (companyName !== undefined) exhibitor.companyName = companyName;
    if (contactPerson !== undefined) exhibitor.contactPerson = contactPerson;
    if (email !== undefined) exhibitor.email = email;
    if (phone !== undefined) exhibitor.phone = phone;
    if (address !== undefined) exhibitor.address = address;
    if (website !== undefined) exhibitor.website = website;
    if (description !== undefined) exhibitor.description = description;
    if (panNumber !== undefined) exhibitor.panNumber = panNumber;
    if (gstNumber !== undefined) exhibitor.gstNumber = gstNumber;
    if (city !== undefined) exhibitor.city = city;
    if (state !== undefined) exhibitor.state = state;
    if (pinCode !== undefined) exhibitor.pinCode = pinCode;
    if (isActive !== undefined) exhibitor.isActive = isActive;

    // Save updated exhibitor
    await exhibitor.save();

    res.json(exhibitor);
  } catch (error) {
    console.error('Error updating exhibitor details:', error);
    res.status(500).json({ message: 'Server error updating exhibitor details' });
  }
}; 