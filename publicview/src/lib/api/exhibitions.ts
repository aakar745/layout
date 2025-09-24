import { Exhibition, ExhibitionWithStats, ServiceChargeConfig } from '@/lib/types/exhibitions';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ExhibitionApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = 'ExhibitionApiError';
  }
}

// Enhanced fetch with error handling and retries
async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  maxRetries = 3
): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        next: { 
          revalidate: 15, // 15 seconds cache for faster updates
          tags: ['exhibitions']
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ExhibitionApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status,
          errorData.code
        );
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof ExhibitionApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Exponential backoff for retries
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Fetch all published exhibitions with optional filtering
 */
export async function getExhibitions(): Promise<Exhibition[]> {
  try {
    const response = await fetchWithRetry(`${API_URL}/public/exhibitions`);
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Failed to fetch exhibitions:', error);
    throw error;
  }
}

/**
 * Fetch single exhibition by ID or slug with enhanced data
 */
export async function getExhibition(idOrSlug: string): Promise<ExhibitionWithStats> {
  try {
    const response = await fetchWithRetry(`${API_URL}/public/exhibitions/${idOrSlug}`);
    const exhibition = await response.json();
    
    // Fetch additional data in parallel
    const [layoutData, serviceChargeData] = await Promise.allSettled([
      getExhibitionLayout(idOrSlug).catch(() => null),
      getServiceChargeConfig(idOrSlug).catch((err) => {
        // Service charges might not be available for all exhibitions
        console.warn('Service charges not available:', err.message);
        return null;
      })
    ]);
    
    // Calculate stall statistics if layout data is available
    let stallStats = undefined;
    if (layoutData.status === 'fulfilled' && layoutData.value) {
      const allStalls = layoutData.value.layout?.flatMap((hall: { stalls?: { status: string }[] }) => hall.stalls || []) || [];
      const total = allStalls.length;
      const available = allStalls.filter((stall: { status: string }) => stall.status === 'available').length;
      const booked = allStalls.filter((stall: { status: string }) => stall.status === 'booked').length;
      const reserved = allStalls.filter((stall: { status: string }) => stall.status === 'reserved').length;
      const percentage = total > 0 ? Math.round((available / total) * 100) : 0;
      
      stallStats = { total, available, booked, reserved, percentage };
    }
    
    // Extract discount and tax config from layout data if available
    let discountAndTaxConfig = {};
    if (layoutData.status === 'fulfilled' && layoutData.value?.exhibition) {
      const layoutExhibition = layoutData.value.exhibition;
      discountAndTaxConfig = {
        publicDiscountConfig: layoutExhibition.publicDiscountConfig || [],
        taxConfig: layoutExhibition.taxConfig || []
      };
    }

    return {
      ...exhibition,
      ...discountAndTaxConfig,
      stallStats,
      serviceCharges: serviceChargeData.status === 'fulfilled' ? serviceChargeData.value : null
    };
  } catch (error) {
    console.error(`Failed to fetch exhibition ${idOrSlug}:`, error);
    throw error;
  }
}

/**
 * Fetch exhibition layout data for stall information
 */
export async function getExhibitionLayout(idOrSlug: string) {
  try {
    const response = await fetchWithRetry(`${API_URL}/public/exhibitions/${idOrSlug}/layout`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch layout for exhibition ${idOrSlug}:`, error);
    throw error;
  }
}

/**
 * Fetch service charge configuration for an exhibition
 */
export async function getServiceChargeConfig(idOrSlug: string): Promise<ServiceChargeConfig | null> {
  try {
    const response = await fetchWithRetry(`${API_URL}/service-charges/${idOrSlug}/config`);
    const data = await response.json();
    return data.data?.config || null;
  } catch {
    // Service charges might not be configured, which is okay
    return null;
  }
}

/**
 * Get optimized image URL with proper fallbacks
 */
export function getImageUrl(path?: string, type: 'logo' | 'background' | 'sponsor' = 'logo'): string {
  if (!path) {
    // Return appropriate placeholder based on type
    switch (type) {
      case 'background':
        return '/images/placeholders/exhibition-hero.jpg';
      case 'sponsor':
        return '/images/placeholders/sponsor-logo.png';
      default:
        return '/images/placeholders/exhibition-logo.jpg';
    }
  }
  
  // Handle absolute URLs
  if (path.startsWith('http')) {
    return path;
  }
  
  // Clean path
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Use public endpoint for logos and sponsors (no auth required)
  if (normalizedPath.includes('logos/') || normalizedPath.includes('sponsors/')) {
    return `${API_URL}/public/images/${normalizedPath}`;
  }
  
  // For other images, use regular endpoint
  return `${API_URL}/uploads/${normalizedPath}`;
}

/**
 * Prefetch exhibition data for performance
 */
export async function prefetchExhibition(idOrSlug: string): Promise<void> {
  try {
    // Use Next.js router prefetch if available
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = `/exhibitions/${idOrSlug}`;
      document.head.appendChild(link);
    }
  } catch (error) {
    // Prefetch failures shouldn't break the app
    console.warn('Failed to prefetch exhibition:', error);
  }
}
