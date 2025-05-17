import { publicApi, exhibitorApi } from './api';
import api from './api';

const API_BASE_URL = 'http://localhost:5000/api';

export interface PublicDiscount {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

export interface PublicExhibition {
  _id: string;
  name: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  headerLogo?: string;
  sponsorLogos?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  taxConfig?: Array<{
    name: string;
    rate: number;
    isActive: boolean;
  }>;
  publicDiscountConfig?: Array<PublicDiscount>;
  
  // Amenities
  amenities?: Array<{
    type: 'facility' | 'service' | 'equipment' | 'other';
    name: string;
    description: string;
    rate: number;
  }>;
  
  // Basic amenities are included with stall booking - calculated based on stall size
  basicAmenities?: Array<{
    type: 'facility' | 'service' | 'equipment' | 'other';
    name: string;
    description: string;
    perSqm: number; // How many square meters per 1 unit (e.g., 1 table per 9 sqm)
    quantity: number; // The default quantity to provide per calculation
  }>;
  
  // Other exhibition properties
}

export interface PublicLayout {
  exhibition: PublicExhibition;
  layout: {
    id: string;
    name: string;
    dimensions: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    stalls: {
      id: string;
      stallNumber: string;
      type: string;
      typeName: string;
      position: {
        x: number;
        y: number;
      };
      dimensions: {
        width: number;
        height: number;
      };
      rotation: number;
      status: 'available' | 'booked' | 'reserved' | 'maintenance';
      price: number;
      companyName?: string;
    }[];
  }[];
  fixtures?: {
    id: string;
    _id?: string;
    name: string;
    type: string;
    position: {
      x: number;
      y: number;
    };
    dimensions: {
      width: number;
      height: number;
    };
    rotation: number;
    color?: string;
    icon?: string;
    showName?: boolean;
  }[];
}

export interface PublicExhibitor {
  _id: string;
  companyName: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  panNumber: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
}

const publicExhibitionService = {
  getExhibitions: () => 
    publicApi.get<PublicExhibition[]>('/public/exhibitions'),
  
  getExhibition: (id: string) => 
    publicApi.get<PublicExhibition>(`/public/exhibitions/${id}`),
  
  getLayout: (id: string) => 
    publicApi.get<PublicLayout>(`/public/exhibitions/${id}/layout`),
  
  getStallDetails: (exhibitionId: string, stallId: string) => 
    publicApi.get(`/public/exhibitions/${exhibitionId}/stalls/${stallId}`),

  bookStall: (exhibitionId: string, stallId: string, bookingData: any) =>
    publicApi.post(`/public/exhibitions/${exhibitionId}/stalls/${stallId}/book`, bookingData),
  
  // Simplified guest booking without authentication
  bookMultipleStalls: (exhibitionId: string, bookingData: any) =>
    publicApi.post(`/public/exhibitions/${exhibitionId}/stalls/book-multiple`, bookingData),
    
  searchExhibitors: (query: string) =>
    // Simplified implementation that returns an empty array
    publicApi.get<PublicExhibitor[]>('/public/exhibitors/search', { params: { query } }),

  // New methods for authenticated exhibitor booking
  exhibitorBookStalls: (bookingData: any) =>
    exhibitorApi.post(`/exhibitor-bookings/${bookingData.exhibitionId}`, bookingData),
    
  getExhibitorBookings: () =>
    exhibitorApi.get('/exhibitor-bookings/my-bookings'),
    
  getExhibitorBooking: (bookingId: string) =>
    exhibitorApi.get(`/exhibitor-bookings/${bookingId}`),
    
  cancelExhibitorBooking: (bookingId: string) =>
    exhibitorApi.patch(`/exhibitor-bookings/${bookingId}/cancel`),
    
  getExhibitorBookingInvoice: (bookingId: string) =>
    exhibitorApi.get(`/exhibitor-bookings/${bookingId}/invoice`),
};

export default publicExhibitionService; 