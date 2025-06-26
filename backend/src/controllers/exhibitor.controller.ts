import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import Exhibitor, { IExhibitor } from '../models/exhibitor.model';
import Booking from '../models/booking.model';
import Invoice from '../models/invoice.model';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import crypto from 'crypto';
import { getEmailTransporter, emailConfig } from '../config/email.config';
import { sendOTPViaWhatsApp, sendCredentialsViaWhatsApp } from '../services/whatsapp-otp.service';
import User from '../models/user.model';
import { createNotification } from './notification.controller';
import { NotificationType, NotificationPriority } from '../models/notification.model';
import bcrypt from 'bcryptjs';
import { logActivity } from '../services/activity.service';

// Cache directory for PDFs - must match the one in invoice.controller.ts
const PDF_CACHE_DIR = join(process.cwd(), 'pdf-cache');

// In-memory OTP storage (in a production environment, this would be in Redis or another datastore)
const otpStorage: Record<string, { otp: string; expiresAt: Date }> = {};

// In-memory password reset OTP storage
const passwordResetOtpStorage: Record<string, { otp: string; expiresAt: Date }> = {};

/**
 * Generate and send OTP for exhibitor registration (Email)
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
 * Generate and send OTP for exhibitor registration via WhatsApp
 * POST /api/exhibitors/send-whatsapp-otp
 * Public route
 */
export const sendWhatsAppOTP = async (req: Request, res: Response) => {
  try {
    const { phone, companyName } = req.body;
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // Clean phone number format
    const cleanPhoneNumber = phone.replace(/[\s+\-]/g, '');
    
    // Check if phone already exists in the system
    const existingExhibitor = await Exhibitor.findOne({ phone: cleanPhoneNumber });
    if (existingExhibitor) {
      return res.status(400).json({ message: 'An exhibitor with this phone number already exists' });
    }
    
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Store OTP with 10-minute expiration using phone as key
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    otpStorage[cleanPhoneNumber] = { otp, expiresAt };
    
    // Always log the OTP in development for testing purposes
    console.log(`[WhatsApp OTP for ${cleanPhoneNumber}]: ${otp}`);
    
    // Send OTP via WhatsApp
    try {
      const whatsappSuccess = await sendOTPViaWhatsApp(
        cleanPhoneNumber,
        companyName || 'Exhibitor',
        otp,
        10 // 10 minutes expiry
      );
      
      if (!whatsappSuccess) {
        console.error('Failed to send WhatsApp OTP');
        return res.status(500).json({ message: 'Failed to send OTP via WhatsApp. Please try again.' });
      }
    } catch (whatsappError) {
      console.error('Error sending WhatsApp OTP:', whatsappError);
      return res.status(500).json({ message: 'Failed to send OTP via WhatsApp. Please try again.' });
    }
    
    res.status(200).json({ 
      message: 'OTP sent successfully via WhatsApp',
      expiresAt,
      phone: cleanPhoneNumber
    });
  } catch (error) {
    console.error('Error sending WhatsApp OTP:', error);
    res.status(500).json({ message: 'Server error while sending OTP' });
  }
};

/**
 * Verify OTP for exhibitor registration (supports both email and phone)
 * POST /api/exhibitors/verify-otp
 * Public route
 */
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, phone, otp } = req.body;
    
    // Support both email and phone verification
    const identifier = email || phone;
    const verificationType = email ? 'email' : 'phone';
    
    if (!identifier || !otp) {
      return res.status(400).json({ message: `${verificationType === 'email' ? 'Email' : 'Phone number'} and OTP are required` });
    }
    
    // Clean phone number if provided
    const cleanIdentifier = phone ? phone.replace(/[\s+\-]/g, '') : identifier;
    
    // Check if OTP exists for this identifier
    const storedData = otpStorage[cleanIdentifier];
    if (!storedData) {
      return res.status(400).json({ message: 'OTP not found or expired. Please request a new one.' });
    }
    
    // Check if OTP has expired
    if (new Date() > storedData.expiresAt) {
      delete otpStorage[cleanIdentifier];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    
    // Check if OTP matches
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }
    
    // OTP is valid - remove it from storage to prevent reuse
    delete otpStorage[cleanIdentifier];
    
    res.status(200).json({ 
      message: `${verificationType === 'email' ? 'Email' : 'Phone number'} verified successfully`,
      verified: true,
      verificationType
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

    // Log activity
    await logActivity(req, {
      action: 'exhibitor_registered',
      resource: 'exhibitor',
      resourceId: exhibitor._id.toString(),
      description: `Exhibitor "${companyName}" registered successfully`,
      newValues: {
        companyName: exhibitor.companyName,
        contactPerson: exhibitor.contactPerson,
        email: exhibitor.email,
        phone: exhibitor.phone,
        status: exhibitor.status
      },
      success: true
    });

    res.status(201).json({
      exhibitor: exhibitorResponse,
      token,
      message: 'Registration successful. Your account is pending approval from the administrator.'
    });
  } catch (error) {
    console.error('Error registering exhibitor:', error);
    
    // Log failed registration attempt
    await logActivity(req, {
      action: 'exhibitor_registered',
      resource: 'exhibitor',
      description: `Failed to register exhibitor with email: ${req.body.email}`,
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Server error during registration'
    });
    
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
        await Booking.findByIdAndUpdate(booking._id, bookingUpdates, { new: true });
        
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
 * Get all exhibitors with pagination and filtering (admin only)
 * GET /api/admin/exhibitors
 * Private route (requires admin authentication)
 * 
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * - status: Filter by status (pending, approved, rejected)
 * - isActive: Filter by active status (true, false)
 * - search: Search in company name, contact person, or email
 * - sortBy: Sort field (createdAt, companyName, status)
 * - sortOrder: Sort direction (asc, desc) - default: desc
 */
export const getAllExhibitors = async (req: Request, res: Response) => {
  try {
    // Extract query parameters with defaults
    const { 
      page = '1', 
      limit = '10',
      status,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Parse pagination parameters
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    
    // Validate pagination parameters
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: 'Invalid limit. Must be between 1 and 100' });
    }
    
    // Build query conditions
    const conditions: any = {};
    
    // Filter by status if provided
    if (status && ['pending', 'approved', 'rejected'].includes(status as string)) {
      conditions.status = status;
    }
    
    // Filter by active status if provided
    if (isActive === 'true' || isActive === 'false') {
      conditions.isActive = isActive === 'true';
    }
    
    // Search functionality - case insensitive search across multiple fields
    if (search && typeof search === 'string' && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      conditions.$or = [
        { companyName: searchRegex },
        { contactPerson: searchRegex },
        { email: searchRegex },
        { phone: searchRegex }
      ];
    }
    
    // Build sort options
    const validSortFields = ['createdAt', 'companyName', 'status', 'contactPerson', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortOptions: { [key: string]: 1 | -1 } = { [sortField]: sortDirection };
    
    // Get total count for pagination metadata
    const totalCount = await Exhibitor.countDocuments(conditions);
    
    // Fetch exhibitors with pagination and sorting
    const exhibitors = await Exhibitor.find(conditions)
      .sort(sortOptions)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('-password') // Exclude password field for security
      .lean(); // Use lean() for better performance since we don't need mongoose document methods
    
    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limitNum);
    const hasNextPage = pageNum < totalPages;
    const hasPrevPage = pageNum > 1;
    
    // Return paginated results with comprehensive metadata
    res.json({
      data: exhibitors,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        pages: totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? pageNum + 1 : null,
        prevPage: hasPrevPage ? pageNum - 1 : null
      },
      filters: {
        status: status || null,
        isActive: isActive ? (isActive === 'true') : null,
        search: search || null,
        sortBy: sortField,
        sortOrder: sortOrder as string
      }
    });
  } catch (error) {
    console.error('Error fetching exhibitors:', error);
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

    // Store old values for logging
    const oldStatus = exhibitor.status;
    const oldRejectionReason = exhibitor.rejectionReason;

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

    // Log activity
    await logActivity(req, {
      action: 'exhibitor_status_updated',
      resource: 'exhibitor',
      resourceId: id,
      description: `Exhibitor "${exhibitor.companyName}" status changed from "${oldStatus}" to "${status}"`,
      oldValues: {
        status: oldStatus,
        rejectionReason: oldRejectionReason
      },
      newValues: {
        status: exhibitor.status,
        rejectionReason: exhibitor.rejectionReason
      },
      success: true
    });

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

    // Find the exhibitor first to get details for logging
    const exhibitor = await Exhibitor.findById(id);
    
    if (!exhibitor) {
      return res.status(404).json({ message: 'Exhibitor not found' });
    }

    // Store exhibitor details for logging
    const exhibitorDetails = {
      companyName: exhibitor.companyName,
      contactPerson: exhibitor.contactPerson,
      email: exhibitor.email,
      phone: exhibitor.phone,
      status: exhibitor.status
    };

    // Delete the exhibitor
    await Exhibitor.findByIdAndDelete(id);

    // Log activity
    await logActivity(req, {
      action: 'exhibitor_deleted',
      resource: 'exhibitor',
      resourceId: id,
      description: `Exhibitor "${exhibitorDetails.companyName}" deleted by admin`,
      oldValues: exhibitorDetails,
      success: true
    });

    res.json({ message: 'Exhibitor deleted successfully' });
  } catch (error) {
    console.error('Error deleting exhibitor:', error);
    
    // Log failed deletion attempt
    await logActivity(req, {
      action: 'exhibitor_deleted',
      resource: 'exhibitor',
      resourceId: req.params.id,
      description: `Failed to delete exhibitor`,
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Server error deleting exhibitor'
    });
    
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

    // Store old values for logging
    const oldValues = {
      companyName: exhibitor.companyName,
      contactPerson: exhibitor.contactPerson,
      email: exhibitor.email,
      phone: exhibitor.phone,
      address: exhibitor.address,
      website: exhibitor.website,
      description: exhibitor.description,
      panNumber: exhibitor.panNumber,
      gstNumber: exhibitor.gstNumber,
      city: exhibitor.city,
      state: exhibitor.state,
      pinCode: exhibitor.pinCode,
      isActive: exhibitor.isActive
    };

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

    // Update all associated bookings with new exhibitor data
    const bookings = await Booking.find({ exhibitorId: exhibitor._id });
    console.log(`[INFO] Updating ${bookings.length} bookings for exhibitor ${exhibitor._id}`);
    
    // For each booking, update the data and invalidate the invoice cache
    for (const booking of bookings) {
      const bookingUpdates: any = {};
      
      if (companyName !== undefined) bookingUpdates.companyName = companyName;
      if (address !== undefined) bookingUpdates.customerAddress = address;
      if (phone !== undefined) bookingUpdates.customerPhone = phone;
      if (contactPerson !== undefined) bookingUpdates.customerName = contactPerson;
      if (panNumber !== undefined) bookingUpdates.customerPAN = panNumber;
      if (gstNumber !== undefined) bookingUpdates.customerGSTIN = gstNumber;
      
      if (Object.keys(bookingUpdates).length > 0) {
        console.log(`[INFO] Updating booking ${booking._id} with new exhibitor data`);
        await Booking.findByIdAndUpdate(booking._id, bookingUpdates, { new: true });
        
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

    // Store new values for logging
    const newValues = {
      companyName: exhibitor.companyName,
      contactPerson: exhibitor.contactPerson,
      email: exhibitor.email,
      phone: exhibitor.phone,
      address: exhibitor.address,
      website: exhibitor.website,
      description: exhibitor.description,
      panNumber: exhibitor.panNumber,
      gstNumber: exhibitor.gstNumber,
      city: exhibitor.city,
      state: exhibitor.state,
      pinCode: exhibitor.pinCode,
      isActive: exhibitor.isActive
    };

    // Log activity
    await logActivity(req, {
      action: 'exhibitor_updated',
      resource: 'exhibitor',
      resourceId: id,
      description: `Exhibitor "${exhibitor.companyName}" updated by admin`,
      oldValues,
      newValues,
      success: true
    });

    res.json(exhibitor);
  } catch (error) {
    console.error('Error updating exhibitor details:', error);
    
    // Log failed update attempt
    await logActivity(req, {
      action: 'exhibitor_updated',
      resource: 'exhibitor',
      resourceId: req.params.id,
      description: `Failed to update exhibitor details`,
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Server error updating exhibitor details'
    });
    
    res.status(500).json({ message: 'Server error updating exhibitor details' });
  }
};

/**
 * Create a new exhibitor (admin only)
 * POST /api/admin/exhibitors
 * Private route (requires admin authentication)
 */
export const createExhibitor = async (req: Request, res: Response) => {
  try {
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
      isActive = true 
    } = req.body;

    // Check if exhibitor with this email already exists
    const existingExhibitor = await Exhibitor.findOne({ email });
    if (existingExhibitor) {
      return res.status(400).json({ message: 'Exhibitor with this email already exists' });
    }

    // Generate a secure temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

    // Create new exhibitor with approved status (since admin is creating)
    const exhibitor = await Exhibitor.create({
      companyName,
      contactPerson,
      email,
      phone,
      address: address || '',
      website,
      description,
      panNumber,
      gstNumber,
      city,
      state,
      pinCode,
      password: tempPassword,
      status: 'approved', // Admin-created exhibitors are pre-approved
      isActive
    });

    // Send email with login credentials
    try {
      // Get email transport configuration
      const { transporter, isTestMode, getTestMessageUrl } = await getEmailTransporter();
      
      // Send mail with login credentials
      const info = await transporter.sendMail({
        from: emailConfig.from,
        to: exhibitor.email,
        subject: 'Your Exhibition Account Has Been Created',
        text: `Your exhibitor account has been created. Email: ${email}, Temporary Password: ${tempPassword}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h1 style="color: #333; text-align: center;">Account Created</h1>
            <p style="font-size: 16px; line-height: 1.5;">Your exhibitor account has been created by the administrator.</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Login Credentials:</h3>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Temporary Password:</strong> <code style="background-color: #e0e0e0; padding: 2px 4px; border-radius: 3px;">${tempPassword}</code></p>
            </div>
            <p style="font-size: 16px; line-height: 1.5; color: #d9534f;"><strong>Important:</strong> Please change your password after your first login for security.</p>
            <p style="font-size: 16px; line-height: 1.5;">You can now access all exhibitor features including:</p>
            <ul style="font-size: 16px; line-height: 1.5;">
              <li>Booking exhibition stalls</li>
              <li>Managing your bookings</li>
              <li>Updating your company profile</li>
              <li>Viewing exhibition details</li>
            </ul>
            <p style="font-size: 14px; color: #777; margin-top: 30px;">If you have any questions, please contact our support team.</p>
          </div>
        `
      });
      
      // Log test message URL if in test mode
      if (isTestMode && getTestMessageUrl) {
        console.log('Preview URL: %s', getTestMessageUrl(info));
      }
      
      console.log('Login credentials email sent to:', email);
    } catch (emailError) {
      console.error('Error sending credentials email:', emailError);
      // Continue even if email fails - admin can manually share credentials
    }

    // Send notification to all admin users about the new exhibitor
    try {
      // Find all admin users
      const adminUsers = await User.find({ isActive: true });
      
      if (adminUsers && adminUsers.length > 0) {
        // Notify each admin (except the one who created it)
        for (const admin of adminUsers) {
          if (admin._id.toString() !== req.user?._id?.toString()) {
            await createNotification(
              admin._id,
              'admin',
              'New Exhibitor Created',
              `A new exhibitor "${companyName}" has been created by admin.`,
              NotificationType.EXHIBITOR_REGISTERED,
              {
                priority: NotificationPriority.MEDIUM,
                entityId: exhibitor._id,
                entityType: 'Exhibitor',
                data: {
                  exhibitorId: exhibitor._id.toString(),
                  companyName: exhibitor.companyName,
                  contactPerson: exhibitor.contactPerson,
                  email: exhibitor.email,
                  phone: exhibitor.phone,
                  createdBy: 'admin',
                  createdAt: exhibitor.createdAt
                }
              }
            );
          }
        }
      }
    } catch (notificationError) {
      console.error('Error sending admin notification:', notificationError);
      // Continue even if notification fails
    }

    // Log activity
    await logActivity(req, {
      action: 'exhibitor_created',
      resource: 'exhibitor',
      resourceId: exhibitor._id.toString(),
      description: `Exhibitor "${companyName}" created by admin`,
      newValues: {
        companyName: exhibitor.companyName,
        contactPerson: exhibitor.contactPerson,
        email: exhibitor.email,
        phone: exhibitor.phone,
        address: exhibitor.address,
        status: exhibitor.status,
        isActive: exhibitor.isActive
      },
      success: true
    });

    // Don't send password in response for security
    const exhibitorResponse = {
      _id: exhibitor._id,
      companyName: exhibitor.companyName,
      contactPerson: exhibitor.contactPerson,
      email: exhibitor.email,
      phone: exhibitor.phone,
      address: exhibitor.address,
      website: exhibitor.website,
      description: exhibitor.description,
      panNumber: exhibitor.panNumber,
      gstNumber: exhibitor.gstNumber,
      city: exhibitor.city,
      state: exhibitor.state,
      pinCode: exhibitor.pinCode,
      status: exhibitor.status,
      isActive: exhibitor.isActive,
      createdAt: exhibitor.createdAt
    };

    res.status(201).json({
      exhibitor: exhibitorResponse,
      message: 'Exhibitor created successfully. Login credentials have been sent via email.',
      tempPasswordSent: true
    });
  } catch (error) {
    console.error('Error creating exhibitor:', error);
    
    // Log failed creation attempt
    await logActivity(req, {
      action: 'exhibitor_created',
      resource: 'exhibitor',
      description: `Failed to create exhibitor with email: ${req.body.email}`,
      metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
      success: false,
      errorMessage: error instanceof Error ? error.message : 'Server error creating exhibitor'
    });
    
    res.status(500).json({ message: 'Server error creating exhibitor' });
  }
}; 