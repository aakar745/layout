import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Invoice } from '../../types/booking';

// Get the base URL from environment or use default
import { apiUrl } from '../../config';
const baseUrl = apiUrl;

export const exhibitorInvoiceApi = createApi({
  reducerPath: 'exhibitorInvoiceApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Use exhibitor token instead of admin token
      const token = localStorage.getItem('exhibitor_token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['ExhibitorInvoice'],
  endpoints: (builder) => ({
    getExhibitorInvoice: builder.query<Invoice, string>({
      query: (bookingId) => ({
        url: `/exhibitor-bookings/${bookingId}/invoice`,
        method: 'GET'
      }),
      transformResponse: (response: any) => {
        // Check if critical fields are present
        return response;
      },
      transformErrorResponse: (response: { status: number, data: any }) => {
        return response;
      },
      providesTags: (_result, _err, id) => [{ type: 'ExhibitorInvoice', id }]
    }),
    downloadExhibitorInvoice: builder.mutation<Blob, string>({
      query: (bookingId) => ({
        url: `/exhibitor-bookings/${bookingId}/invoice/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    shareViaEmail: builder.mutation<void, { bookingId: string; email: string; message?: string }>({
      query: ({ bookingId, ...body }) => ({
        url: `/exhibitor-bookings/${bookingId}/invoice/share/email`,
        method: 'POST',
        body,
      }),
    }),
    shareViaWhatsApp: builder.mutation<void, { bookingId: string; phoneNumber: string }>({
      query: ({ bookingId, ...body }) => ({
        url: `/exhibitor-bookings/${bookingId}/invoice/share/whatsapp`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetExhibitorInvoiceQuery,
  useDownloadExhibitorInvoiceMutation,
  useShareViaEmailMutation,
  useShareViaWhatsAppMutation,
} = exhibitorInvoiceApi; 