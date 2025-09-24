export interface Stall {
  _id: string;
  id?: string; // Backend uses 'id' field
  stallNumber: string;
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
    x?: number;
    y?: number;
    shapeType?: string;
    lShape?: any;
  };
  status: 'available' | 'booked' | 'reserved' | 'unavailable';
  price: number;
  ratePerSqm?: number;
  type?: string;
  amenities?: string[];
  category?: string;
  companyName?: string; // For booked stalls
  hallId?: string;
  hallName?: string;
  bookingInfo?: {
    exhibitorName?: string;
    companyName?: string;
    bookingDate?: string;
  };
}

export interface Hall {
  _id?: string;
  id?: string; // Backend uses 'id' field
  name: string;
  dimensions: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
  position?: {
    x: number;
    y: number;
  };
  stalls: Stall[];
  paths?: Path[];
  amenities?: Amenity[];
}

export interface Path {
  _id: string;
  type: 'path' | 'entrance' | 'exit' | 'emergency';
  points: { x: number; y: number }[];
  width?: number;
  color?: string;
}

export interface Amenity {
  _id?: string;
  id?: string; // Backend uses 'id' field
  type: 'restroom' | 'food' | 'parking' | 'info' | 'medical' | 'security';
  name: string;
  position: {
    x: number;
    y: number;
  };
  icon?: string;
}

export interface Fixture {
  _id?: string;
  id?: string;
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
  rotation?: number;
  color?: string;
  icon?: string;
  showName?: boolean;
  borderColor?: string;
  borderRadius?: number;
}

export interface Layout {
  _id: string;
  exhibitionId: string;
  name: string;
  dimensions: {
    width: number;
    height: number;
  };
  halls: Hall[];
  fixtures?: Fixture[];
  createdAt: string;
  updatedAt: string;
}

export interface StallBookingData {
  stallIds: string[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    companyName?: string;
    address?: string;
    gstNumber?: string;
  };
  selectedAmenities?: string[];
  totalAmount: number;
  notes?: string;
}

export interface BookingResponse {
  success: boolean;
  bookingId?: string;
  paymentUrl?: string;
  message: string;
  orderId?: string;
}

// Canvas related types
export interface CanvasState {
  scale: number;
  position: { x: number; y: number };
  selectedStalls: string[];
  hoveredStall: string | null;
  isSelecting: boolean;
  // Phase 3: Drag state for performance optimizations
  isDragging?: boolean;
  selectionBox?: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
}

export interface StallColors {
  available: string;
  booked: string;
  reserved: string;
  unavailable: string;
  selected: string;
  hovered: string;
}

export interface ViewportDimensions {
  width: number;
  height: number;
}

// Real-time update types
export interface StallUpdate {
  stallId: string;
  status: Stall['status'];
  exhibitorName?: string;
  companyName?: string;
  timestamp: string;
}

export interface LayoutUpdate {
  type: 'STALL_STATUS_CHANGED' | 'STALL_BOOKED' | 'STALL_RELEASED';
  exhibitionId: string;
  data: StallUpdate;
}

// Filter and search types
export interface StallFilters {
  status: Stall['status'] | 'all';
  priceRange: {
    min: number;
    max: number;
  };
  category?: string;
  hasAmenities?: string[];
  minSize?: number;
}

export interface LayoutViewConfig {
  showGrid: boolean;
  showStallNumbers: boolean;
  showPrices: boolean;
  showAmenities: boolean;
  colorScheme: 'default' | 'accessibility' | 'custom';
}

// Statistics
export interface LayoutStats {
  totalStalls: number;
  availableStalls: number;
  bookedStalls: number;
  reservedStalls: number;
  unavailableStalls: number;
  totalRevenue: number;
  averagePrice: number;
  occupancyRate: number;
}
