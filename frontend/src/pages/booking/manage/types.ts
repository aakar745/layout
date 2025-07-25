import { Exhibition } from '../../../store/slices/bookingSlice';

/**
 * Stall interface defining the structure of booked stalls
 */
export interface Stall {
  _id: string;
  number: string;
  type?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  ratePerSqm: number;
}

/**
 * Discount interface for discount details
 */
export interface Discount {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

/**
 * Stall calculation interface for individual stall calculations
 */
export interface StallCalculation {
  stallId: string;
  number: string;
  baseAmount: number;
  discount: Discount | null;
  amountAfterDiscount: number;
}

/**
 * BookingStatus type for all possible booking statuses
 */
export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'confirmed' | 'cancelled';

/**
 * Comprehensive booking type interface including all booking details
 * - Basic booking information
 * - Stall details
 * - Financial calculations including discounts and taxes
 * - Status and timestamps
 */
export interface BookingType {
  _id: string;
  exhibitionId: Exhibition;
  stallIds: Stall[];
  userId?: User;
  exhibitorId?: {
    _id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
  amount: number;
  calculations: {
    stalls: StallCalculation[];
    totalBaseAmount: number;
    totalDiscountAmount: number;
    totalAmountAfterDiscount: number;
    taxes: Array<{
      name: string;
      rate: number;
      amount: number;
    }>;
    totalTaxAmount: number;
    totalAmount: number;
  };
  status: BookingStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  bookingSource?: 'admin' | 'exhibitor';
}

/**
 * Filter state interface for managing booking list filters
 */
export interface FilterState {
  search: string;
  status: string[];
  dateRange: [string, string] | null;
  exhibition: string | null;
}

export interface User {
  _id: string;
  username: string;
  name?: string;
  email: string;
  role?: {
    _id: string;
    name: string;
  };
} 