import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Booking } from '../../types/booking';

export interface CreateBookingData {
  exhibitionId: string;
  exhibitorId: string;
  stallIds: string[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
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

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => '/bookings',
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => `/bookings/${id}`,
    }),
    createBooking: builder.mutation<Booking, CreateBookingData>({
      query: (data) => ({
        url: '/bookings',
        method: 'POST',
        body: data,
      }),
    }),
    updateBookingStatus: builder.mutation<Booking, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
} = bookingApi; 