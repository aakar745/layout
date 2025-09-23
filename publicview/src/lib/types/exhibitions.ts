export interface Exhibition {
  _id: string;
  name: string;
  description: string;
  venue?: string;
  startDate: string;
  endDate: string;
  headerLogo?: string;
  headerBackground?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  sponsorLogos?: string[];
  status: 'draft' | 'published' | 'completed';
  isActive: boolean;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicDiscount {
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

export interface TaxConfig {
  name: string;
  rate: number;
  isActive: boolean;
}

export interface BasicAmenity {
  _id?: string;
  id?: string;
  type: 'facility' | 'service' | 'equipment' | 'other';
  name: string;
  description: string;
  perSqm: number;
  quantity: number;
}

export interface ExtraAmenity {
  _id?: string;
  id?: string;
  type: 'facility' | 'service' | 'equipment' | 'other';
  name: string;
  description: string;
  rate: number;
}

export interface ExhibitionWithStats extends Exhibition {
  stallStats?: {
    total: number;
    available: number;
    booked: number;
    reserved: number;
    percentage: number;
  };
  publicDiscountConfig?: PublicDiscount[];
  taxConfig?: TaxConfig[];
  basicAmenities?: BasicAmenity[];
  amenities?: ExtraAmenity[];
}

export interface ExhibitionStatus {
  status: 'upcoming' | 'active' | 'completed';
  color: string;
  bgColor: string;
  textColor: string;
}

export interface ExhibitionFilters {
  status?: 'all' | 'upcoming' | 'active' | 'completed';
  search?: string;
  sortBy?: 'date' | 'name' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface ExhibitionListResponse {
  exhibitions: Exhibition[];
  total: number;
  page: number;
  limit: number;
}

export interface ServiceChargeConfig {
  isEnabled: boolean;
  title?: string;
  description?: string;
  serviceTypes?: ServiceType[];
}

export interface ServiceType {
  type: string;
  description: string;
  amount: number;
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
