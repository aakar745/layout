/**
 * Booking Slice
 * 
 * Redux slice for managing booking state in the application.
 * Handles all booking-related operations including:
 * - CRUD operations for bookings
 * - Status management
 * - Payment processing
 * - State management for booking lists and current booking
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/**
 * Exhibition interface
 * Represents basic exhibition information referenced in bookings
 */
export interface Exhibition {
  _id: string;
  name: string;
  venue: string;
  invoicePrefix?: string;
  companyName?: string;
  companyAddress?: string;
  companyContactNo?: string;
  companyEmail?: string;
  companyGST?: string;
  companyPAN?: string;
  companySAC?: string;
  bankName?: string;
  bankAccount?: string;
  bankIFSC?: string;
  bankBranch?: string;
}

/**
 * Stall interface
 * Defines the structure of exhibition stalls with dimensions and pricing
 */
interface Stall {
  _id: string;
  number: string;
  dimensions: {
    width: number;
    height: number;
  };
  ratePerSqm: number;
}

/**
 * StallDimensions interface
 * Helper interface for stall dimensions calculations
 */
interface StallDimensions {
  width: number;
  height: number;
}

/**
 * Tax interface
 * Represents tax calculations applied to bookings
 */
interface Tax {
  name: string;
  rate: number;
  amount: number;
}

/**
 * Discount interface
 * Defines discount structure supporting both percentage and fixed amounts
 */
interface Discount {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  amount: number;
}

/**
 * StallCalculation interface
 * Represents financial calculations for individual stalls
 */
interface StallCalculation {
  stallId: string;
  number: string;
  baseAmount: number;
  discount: Discount | null;
  amountAfterDiscount: number;
}

/**
 * BookingCalculations interface
 * Comprehensive financial calculations for a booking
 * Including stall-wise breakdowns, discounts, and taxes
 */
interface BookingCalculations {
  stalls: StallCalculation[];
  totalBaseAmount: number;
  totalDiscountAmount: number;
  totalAmountAfterDiscount: number;
  taxes: Tax[];
  totalTaxAmount: number;
  totalAmount: number;
}

/**
 * PaymentDetails interface
 * Tracks payment information for completed bookings
 */
interface PaymentDetails {
  method: string;
  transactionId: string;
  paidAt: string;
}

/**
 * Booking interface
 * Complete booking information including:
 * - Customer and exhibitor details
 * - Stall selections
 * - Financial calculations
 * - Status tracking
 * - Payment information
 */
export interface Booking {
  _id: string;
  exhibitionId: Exhibition;
  stallIds: Stall[];
  userId?: {
    _id: string;
    username: string;
    name?: string;
    email: string;
  };
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
  calculations: BookingCalculations;
  /** Included basic amenities based on stall area */
  basicAmenities?: Array<{
    name: string;
    type: string;
    perSqm: number;
    quantity: number;
    calculatedQuantity: number;
    description?: string;
  }>;
  /** Additional amenities selected by the user */
  extraAmenities?: Array<{
    id: string;
    name: string;
    type: string;
    rate: number;
    quantity: number;
    description?: string;
  }>;
  status: 'pending' | 'confirmed' | 'cancelled' | 'approved' | 'rejected';
  rejectionReason?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentDetails?: PaymentDetails;
  createdAt: string;
  updatedAt: string;
  // New properties for API response
  invoiceId?: string;
  warning?: string;
  bookingSource?: 'admin' | 'exhibitor';
}

/**
 * CreateBookingData interface
 * Data structure for creating new bookings
 * Includes all necessary information for booking creation
 */
export interface CreateBookingData {
  exhibitionId: string;
  exhibitorId: string;
  stallIds: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerGSTIN?: string;
  customerPAN?: string;
  companyName: string;
  discount?: {
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
  };
  /** Included basic amenities based on stall area */
  basicAmenities?: Array<{
    name: string;
    type: string;
    perSqm: number;
    quantity: number;
    calculatedQuantity: number;
    description?: string;
  }>;
  /** Additional amenities selected by the user */
  extraAmenities?: Array<{
    id: string;
    name: string;
    type: string;
    rate: number;
    quantity: number;
    description?: string;
  }>;
  amount: number;
  calculations: {
    stalls: Array<{
      stallId: string;
      number: string;
      baseAmount: number;
      discount?: {
        name: string;
        type: string;
        value: number;
        amount: number;
      };
      amountAfterDiscount: number;
    }>;
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
}

// Add a new interface for booking stats
export interface BookingStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  confirmed: number;
  cancelled: number;
  totalSQM: number;
  bookedSQM: number;
}

/**
 * BookingState interface
 * Redux state structure for booking management
 */
interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  statsLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  stats: BookingStats;
}

// Initial state for the booking slice
const initialState: BookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  statsLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  },
  stats: {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    confirmed: 0,
    cancelled: 0,
    totalSQM: 0,
    bookedSQM: 0
  }
};

/**
 * Async Thunks
 * Redux Thunk actions for handling asynchronous booking operations
 */

/**
 * Async thunk for fetching all bookings
 */
export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (params: { 
    page?: number; 
    limit?: number;
    search?: string;
    status?: string | string[];
    exhibitionId?: string;
    startDate?: string;
    endDate?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const queryParams: any = {};
      
      // Add all parameters if provided
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      if (params.search) queryParams.search = params.search;
      if (params.status) queryParams.status = params.status;
      if (params.exhibitionId) queryParams.exhibitionId = params.exhibitionId;
      if (params.startDate) queryParams.startDate = params.startDate;
      if (params.endDate) queryParams.endDate = params.endDate;
      
      const response = await api.get('/bookings', { 
        params: queryParams 
      });
      
      // Return both data and pagination metadata
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

/**
 * Fetches a single booking by ID
 * Used for viewing detailed booking information
 */
export const fetchBooking = createAsyncThunk(
  'booking/fetchBooking',
  async (id: string) => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  }
);

/**
 * Creates a new booking
 * Handles the creation of bookings with all necessary calculations
 */
export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (data: CreateBookingData) => {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  }
);

/**
 * Updates booking status
 * Manages transitions between pending, confirmed, cancelled, approved, and rejected states
 */
export const updateBookingStatus = createAsyncThunk(
  'booking/updateStatus',
  async ({ id, status, rejectionReason }: { 
    id: string; 
    status: Booking['status']; 
    rejectionReason?: string 
  }) => {
    const response = await api.patch<Booking>(`/bookings/${id}`, { 
      status,
      ...(rejectionReason && { rejectionReason })
    });
    return response.data;
  }
);

/**
 * Updates payment status and details
 * Handles payment processing and status updates
 */
export const updatePaymentStatus = createAsyncThunk(
  'booking/updatePaymentStatus',
  async ({ id, paymentStatus, paymentDetails }: { 
    id: string; 
    paymentStatus: Booking['paymentStatus'];
    paymentDetails?: PaymentDetails;
  }) => {
    const response = await api.patch<Booking>(`/bookings/${id}/payment`, { 
      paymentStatus,
      paymentDetails 
    });
    return response.data;
  }
);

/**
 * Deletes a booking
 * Removes booking and updates related resources
 */
export const deleteBooking = createAsyncThunk(
  'booking/deleteBooking',
  async (id: string) => {
    await api.delete(`/bookings/${id}`);
    return id;
  }
);

/**
 * Fetches booking statistics (counts by status, etc.) for dashboard display
 * Supports optional exhibition filter to get exhibition-specific stats
 */
export const fetchBookingStats = createAsyncThunk(
  'booking/fetchBookingStats',
  async (params: { exhibitionId?: string } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.exhibitionId) {
        queryParams.append('exhibitionId', params.exhibitionId);
      }
      
      const url = queryParams.toString() 
        ? `/bookings/stats?${queryParams.toString()}`
        : '/bookings/stats';
      
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || 'Failed to fetch booking statistics');
    }
  }
);

/**
 * Booking Slice
 * Redux slice containing reducers and extra reducers for booking state management
 */
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    /**
     * Clears the current booking selection
     */
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    /**
     * Clears any error messages in the booking state
     */
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings cases
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.data || [];
        // Update pagination if available
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      // Fetch single booking cases
      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch booking';
      })
      // Create booking cases
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload);
        state.currentBooking = action.payload;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      // Update booking status cases
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking?._id === action.payload._id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update booking status';
      })
      // Update payment status cases
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(b => b._id === action.payload._id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        if (state.currentBooking?._id === action.payload._id) {
          state.currentBooking = action.payload;
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update payment status';
      })
      // Fetch booking stats cases
      .addCase(fetchBookingStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(fetchBookingStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchBookingStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.error.message || 'Failed to fetch booking statistics';
      })
      // Delete booking
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(b => b._id !== action.payload);
        if (state.currentBooking?._id === action.payload) {
          state.currentBooking = null;
        }
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete booking';
      });
  },
});

export const { clearCurrentBooking, clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer; 