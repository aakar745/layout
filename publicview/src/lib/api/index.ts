import { Exhibition } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error or server unavailable', 500);
  }
}

export const exhibitionApi = {
  // Get all public exhibitions
  getExhibitions: async (): Promise<{ data: Exhibition[] }> => {
    return fetchApi('/public/exhibitions');
  },

  // Get featured exhibitions for home page
  getFeaturedExhibitions: async (limit = 6): Promise<{ data: Exhibition[] }> => {
    return fetchApi(`/public/exhibitions?featured=true&limit=${limit}`);
  },

  // Get single exhibition by ID or slug
  getExhibition: async (id: string): Promise<{ data: Exhibition }> => {
    return fetchApi(`/public/exhibitions/${id}`);
  },

  // Get exhibition layout
  getExhibitionLayout: async (id: string) => {
    return fetchApi(`/public/exhibitions/${id}/layout`);
  },
};

export const statsApi = {
  // Get public statistics for home page
  getPublicStats: async () => {
    return fetchApi('/public/stats');
  },
};

export { ApiError };
