import axios from 'axios';
import { apiUrl } from '../config';

// Create axios instances for authenticated and public requests
const api = axios.create({
  baseURL: apiUrl
});

const publicApi = axios.create({
  baseURL: apiUrl
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Use exhibitor token for exhibitor-specific endpoints
    const token = localStorage.getItem('exhibitor_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Create a separate instance for admin-only exhibitor operations
const adminApi = axios.create({
  baseURL: apiUrl
});

// Add interceptor to add admin auth token to admin requests
adminApi.interceptors.request.use(
  (config) => {
    // Use the admin token for admin endpoints
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Define interfaces for exhibitor data
export interface ExhibitorProfile {
  _id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  contactEmail?: string;   // Added for compatibility with booking page
  contactPhone?: string;   // Added for compatibility with booking page
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
  createdAt: string;
  updatedAt: string;
}

export interface ExhibitorRegistrationData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export interface ExhibitorLoginData {
  email: string;
  password: string;
}

/**
 * OTP verification data interface
 */
export interface OTPVerificationData {
  email: string;
  otp: string;
}

/**
 * Password reset request data
 */
export interface PasswordResetRequestData {
  email: string;
}

/**
 * Password reset completion data
 */
export interface PasswordResetData {
  email: string;
  otp: string;
  newPassword: string;
}

/**
 * Exhibitor Service
 * 
 * Provides API methods for exhibitor-related operations
 */
const exhibitorService = {
  /**
   * Send OTP to email for registration verification
   * @param email Email address to send OTP to
   * @returns API response
   */
  sendRegistrationOTP: async (email: string) => {
    return await publicApi.post('/exhibitors/send-otp', { email });
  },
  
  /**
   * Verify OTP for registration
   * @param data Email and OTP for verification
   * @returns API response with verification status
   */
  verifyOTP: async (data: OTPVerificationData) => {
    return await publicApi.post('/exhibitors/verify-otp', data);
  },

  /**
   * Register a new exhibitor account
   * @param data Registration data
   * @returns API response
   */
  register: async (data: ExhibitorRegistrationData) => {
    return await publicApi.post('/exhibitors/register', data);
  },
  
  /**
   * Login as an exhibitor
   * @param data Login credentials
   * @returns API response with token and exhibitor data
   */
  login: async (data: ExhibitorLoginData) => {
    return await publicApi.post('/exhibitors/login', data);
  },
  
  /**
   * Request password reset (sends OTP to email)
   * @param data Email address for password reset
   * @returns API response
   */
  requestPasswordReset: async (data: PasswordResetRequestData) => {
    return await publicApi.post('/exhibitors/forgot-password', data);
  },
  
  /**
   * Reset password using OTP and new password
   * @param data Email, OTP and new password
   * @returns API response
   */
  resetPassword: async (data: PasswordResetData) => {
    return await publicApi.post('/exhibitors/reset-password', data);
  },
  
  /**
   * Get the current exhibitor's profile (authenticated)
   * @returns Exhibitor profile data
   */
  getProfile: async () => {
    return await api.get('/exhibitors/profile');
  },
  
  /**
   * Update exhibitor profile
   * @param data Updated profile data
   * @returns Updated exhibitor profile
   */
  updateProfile: async (data: Partial<ExhibitorProfile>) => {
    return await api.put('/exhibitors/profile', data);
  },
  
  /**
   * Get all exhibitors (admin only)
   * @returns List of all exhibitors
   */
  getExhibitors: async () => {
    return await adminApi.get('/exhibitors/admin/exhibitors');
  },
  
  /**
   * Get exhibitor by ID (admin only)
   * @param id Exhibitor ID
   * @returns Exhibitor details
   */
  getExhibitor: async (id: string) => {
    return await adminApi.get(`/exhibitors/admin/exhibitors/${id}`);
  },
  
  /**
   * Create a new exhibitor (admin only)
   * @param data New exhibitor data
   * @returns Created exhibitor data
   */
  createExhibitor: async (data: Partial<ExhibitorProfile>) => {
    return await adminApi.post('/exhibitors/admin/exhibitors', data);
  },
  
  /**
   * Update exhibitor status (admin only)
   * @param id Exhibitor ID
   * @param status New status (approved, rejected)
   * @param rejectionReason Optional reason for rejection
   * @returns Updated exhibitor data
   */
  updateStatus: async (id: string, status: string, rejectionReason?: string) => {
    return await adminApi.put(`/exhibitors/admin/exhibitors/${id}/status`, { 
      status, 
      rejectionReason 
    });
  },
  
  /**
   * Update exhibitor details (admin only)
   * @param id Exhibitor ID
   * @param data Updated exhibitor data
   * @returns Updated exhibitor data
   */
  updateExhibitor: async (id: string, data: Partial<ExhibitorProfile>) => {
    return await adminApi.put(`/exhibitors/admin/exhibitors/${id}`, data);
  },
  
  /**
   * Delete exhibitor (admin only)
   * @param id Exhibitor ID
   * @returns Deletion status
   */
  deleteExhibitor: async (id: string) => {
    return await adminApi.delete(`/exhibitors/admin/exhibitors/${id}`);
  }
};

export default exhibitorService;
