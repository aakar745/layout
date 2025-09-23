import { Layout, StallBookingData, BookingResponse } from '@/lib/types/layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class LayoutApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'LayoutApiError';
  }
}

// Enhanced fetch with error handling
async function fetchLayoutApi(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  try {
    const finalOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };
    
    // Request processed with proper headers
    
    const response = await fetch(url, finalOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new LayoutApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData.code
      );
    }

    return response;
  } catch (error) {
    if (error instanceof LayoutApiError) {
      throw error;
    }
    throw new LayoutApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

/**
 * Fetch exhibition layout data
 */
export async function getExhibitionLayout(exhibitionId: string): Promise<Layout> {
  try {
    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/layout`
    );
    
    const backendData = await response.json();
    
    // Debug logging (minimal for production)
    console.log('Layout API: Loaded', backendData.layout?.length || 0, 'halls with', 
                (backendData.layout || []).reduce((total: number, hall: { stalls?: unknown[] }) => total + (hall.stalls?.length || 0), 0), 'stalls');
    
    // Transform backend response to match frontend Layout interface
    const transformedLayout: Layout = {
      _id: backendData.exhibition._id,
      exhibitionId: backendData.exhibition._id,
      name: backendData.exhibition.name || 'Exhibition Layout',
      dimensions: {
        width: backendData.exhibition.dimensions?.width || 1000,
        height: backendData.exhibition.dimensions?.height || 800
      },
      halls: (backendData.layout || []).map((hall: { id: string; name: string; dimensions?: any; stalls?: any[]; paths?: any[]; amenities?: any[] }) => ({
        _id: hall.id,
        id: hall.id,
        name: hall.name,
        dimensions: {
          x: hall.dimensions?.x || 0,
          y: hall.dimensions?.y || 0,
          width: hall.dimensions?.width || 0,
          height: hall.dimensions?.height || 0
        },
        stalls: (hall.stalls || []).map((stall: any) => ({
          _id: stall.id,
          id: stall.id,
          stallNumber: stall.stallNumber,
          position: {
            x: stall.position?.x || stall.dimensions?.x || 0,
            y: stall.position?.y || stall.dimensions?.y || 0
          },
          dimensions: {
            x: stall.dimensions?.x || 0,
            y: stall.dimensions?.y || 0,
            width: stall.dimensions?.width || 0,
            height: stall.dimensions?.height || 0,
            shapeType: stall.dimensions?.shapeType || 'rectangle',
            lShape: stall.dimensions?.lShape
          },
          status: stall.status || 'available',
          price: stall.price || 0,
          ratePerSqm: stall.ratePerSqm || 0,
          type: stall.type || 'Standard',
          companyName: stall.companyName,
          category: stall.category,
          amenities: stall.amenities || [],
          bookingInfo: stall.companyName ? {
            exhibitorName: stall.companyName,
            companyName: stall.companyName
          } : undefined
        })),
        paths: hall.paths || [],
        amenities: hall.amenities || []
      })),
      fixtures: (backendData.fixtures || []).map((fixture: any) => ({
        _id: fixture.id,
        id: fixture.id,
        name: fixture.name,
        type: fixture.type,
        position: {
          x: fixture.position?.x || 0,
          y: fixture.position?.y || 0
        },
        dimensions: {
          width: fixture.dimensions?.width || 0,
          height: fixture.dimensions?.height || 0
        },
        rotation: fixture.rotation || 0,
        color: fixture.color,
        icon: fixture.icon,
        showName: fixture.showName,
        borderColor: fixture.borderColor,
        borderRadius: fixture.borderRadius
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Debug transformed layout (minimal)
    console.log('Layout API: Transformed successfully');
    
    return transformedLayout;
  } catch (error) {
    console.error(`Failed to fetch layout for exhibition ${exhibitionId}:`, error);
    throw error;
  }
}

/**
 * Get specific stall details
 */
export async function getStallDetails(exhibitionId: string, stallId: string) {
  try {
    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/stalls/${stallId}`
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch stall ${stallId}:`, error);
    throw error;
  }
}

/**
 * Book multiple stalls for guest users
 */
export async function bookStallsAsGuest(
  exhibitionId: string, 
  bookingData: StallBookingData
): Promise<BookingResponse> {
  try {
    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/stalls/book-multiple`,
      {
        method: 'POST',
        body: JSON.stringify(bookingData),
      }
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to book stalls as guest:', error);
    throw error;
  }
}

/**
 * Book multiple stalls for authenticated exhibitors
 */
export async function bookStallsAsExhibitor(
  exhibitionId: string, 
  bookingData: StallBookingData,
  token: string
): Promise<BookingResponse> {
  try {
    // API request for exhibitor booking
    
    const response = await fetchLayoutApi(
      `${API_URL}/exhibitor-bookings/${exhibitionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      }
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to book stalls as exhibitor:', error);
    throw error;
  }
}

/**
 * Get real-time stall availability
 */
export async function getStallAvailability(exhibitionId: string) {
  try {
    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/stalls/availability`
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch stall availability:', error);
    throw error;
  }
}

/**
 * Validate stall selection before booking
 */
export async function validateStallSelection(
  exhibitionId: string, 
  stallIds: string[]
): Promise<{ valid: boolean; message?: string; invalidStalls?: string[] }> {
  try {
    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/stalls/validate`,
      {
        method: 'POST',
        body: JSON.stringify({ stallIds }),
      }
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to validate stall selection:', error);
    throw error;
  }
}

/**
 * Calculate booking total with discounts and amenities
 */
export async function calculateBookingTotal(
  exhibitionId: string,
  stallIds: string[],
  amenities?: string[]
): Promise<{
  stallsTotal: number;
  amenitiesTotal: number;
  discount: number;
  finalTotal: number;
  breakdown: Array<{
    stallId: string;
    stallNumber: string;
    price: number;
  }>;
}> {
  try {
    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/stalls/calculate-total`,
      {
        method: 'POST',
        body: JSON.stringify({ stallIds, amenities }),
      }
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to calculate booking total:', error);
    throw error;
  }
}

/**
 * Get layout statistics
 */
export async function getLayoutStatistics(exhibitionId: string) {
  try {
    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/layout/stats`
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch layout statistics:', error);
    throw error;
  }
}

/**
 * Search stalls by criteria
 */
export async function searchStalls(
  exhibitionId: string,
  filters: {
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    category?: string;
    minSize?: number;
    amenities?: string[];
  }
) {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/stalls/search?${queryParams}`
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to search stalls:', error);
    throw error;
  }
}

/**
 * Get nearby amenities for a stall
 */
export async function getNearbyAmenities(
  exhibitionId: string, 
  stallId: string,
  radius: number = 50
) {
  try {
    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/stalls/${stallId}/nearby-amenities?radius=${radius}`
    );
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch nearby amenities:', error);
    throw error;
  }
}

/**
 * Export layout as image (for sharing/printing)
 */
export async function exportLayoutImage(
  exhibitionId: string,
  options: {
    format?: 'png' | 'jpeg' | 'svg';
    quality?: number;
    width?: number;
    height?: number;
  } = {}
): Promise<Blob> {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetchLayoutApi(
      `${API_URL}/public/exhibitions/${exhibitionId}/layout/export?${queryParams}`
    );
    
    return await response.blob();
  } catch (error) {
    console.error('Failed to export layout image:', error);
    throw error;
  }
}
