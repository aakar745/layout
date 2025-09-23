const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface SiteSettings {
  siteName: string;
  footerText: string;
  logoUrl?: string; // Will be constructed from the logo endpoint
}

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

/**
 * Fetch public site information (name, footer text)
 */
export const fetchSiteSettings = async (): Promise<SiteSettings> => {
  try {
    // Fetch site info from public endpoint
    const siteInfo = await fetchApi('/public/site-info');
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const logoUrl = `${apiUrl}/public/logo`;
    
    // Debug logging for logo URL construction
    console.log('🔍 Logo URL Debug:', {
      'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL,
      'apiUrl': apiUrl,
      'logoUrl': logoUrl,
      'isProduction': typeof window !== 'undefined' ? window.location.hostname !== 'localhost' : 'server-side'
    });
    
    return {
      siteName: siteInfo.siteName || 'Exhibition Management System',
      footerText: siteInfo.footerText || '',
      logoUrl: logoUrl, // Logo endpoint URL
    };
  } catch (error) {
    console.error('Error fetching site settings:', error);
    
    // Return default values if API fails
    return {
      siteName: 'Exhibition Management System',
      footerText: '',
      logoUrl: undefined,
    };
  }
};

/**
 * Check if logo exists by attempting to fetch it
 */
export const checkLogoExists = async (): Promise<boolean> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const response = await fetch(`${apiUrl}/public/logo`, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking logo existence:', error);
    return false;
  }
};
