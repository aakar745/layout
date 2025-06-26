import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Invoice } from '../../types/booking';

// Define pagination response interface
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Get the base URL from environment or use default
const baseUrl = process.env.NODE_ENV === 'production' 
  ? '/api'
  : 'http://localhost:5000/api';

export const invoiceApi = createApi({
  reducerPath: 'invoiceApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    }
  }),
  tagTypes: ['Invoice'],
  endpoints: (builder) => ({
    getInvoices: builder.query<PaginatedResponse<Invoice>, { page?: number; limit?: number }>({
      query: (params = { page: 1, limit: 10 }) => ({
        url: '/invoices',
        method: 'GET',
        params
      }),
      transformResponse: (response: unknown) => {
        console.log('Raw invoice response:', response);
        // Now we expect a paginated response format
        if (typeof response === 'object' && response !== null && 'data' in response) {
          return response as PaginatedResponse<Invoice>;
        }
        
        // Fallback for backward compatibility
        if (Array.isArray(response)) {
          return {
            success: true,
            data: response as Invoice[],
            pagination: {
              total: response.length,
              page: 1,
              limit: response.length,
              pages: 1
            }
          };
        }
        
        // Default error case
        console.error('Invalid invoice response:', response);
        return {
          success: false,
          data: [],
          pagination: {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0
          }
        };
      },
      transformErrorResponse: (response: { status: number, data: any }) => {
        console.error('Invoice API Error:', response);
        return response;
      },
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Invoice' as const, id: _id })),
              { type: 'Invoice', id: 'LIST' },
            ]
          : [{ type: 'Invoice', id: 'LIST' }],
    }),
    getInvoice: builder.query<Invoice, string>({
      query: (id) => ({
        url: `/invoices/${id}`,
        method: 'GET'
      }),
      transformErrorResponse: (response: { status: number, data: any }) => {
        console.error('Get Invoice Error:', response);
        return response;
      },
      providesTags: (_result, _err, id) => [{ type: 'Invoice', id }]
    }),
    downloadInvoice: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `/invoices/${id}/download`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
    shareViaEmail: builder.mutation<void, { id: string; email: string; message?: string }>({
      query: ({ id, ...body }) => ({
        url: `/invoices/${id}/share/email`,
        method: 'POST',
        body,
      }),
    }),
    shareViaWhatsApp: builder.mutation<void, { id: string; phoneNumber: string }>({
      query: ({ id, ...body }) => ({
        url: `/invoices/${id}/share/whatsapp`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetInvoicesQuery,
  useGetInvoiceQuery,
  useDownloadInvoiceMutation,
  useShareViaEmailMutation,
  useShareViaWhatsAppMutation,
} = invoiceApi; 