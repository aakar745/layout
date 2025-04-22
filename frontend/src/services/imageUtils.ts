import api from './api';

/**
 * Constructs an image URL pointing directly to the backend (with authentication if needed)
 * @param path Relative path to the image
 * @returns Full URL (with authentication token if required)
 */
export const getDirectBackendUrl = (path: string): string => {
  if (!path) return '';
  
  // Use direct backend URL instead of relying on proxy
  const backendDirectUrl = process.env.NODE_ENV === 'production' 
    ? window.location.origin 
    : 'http://localhost:5000';
  
  // Clean the path - remove any leading slashes and /api/uploads/ prefix
  const cleanPath = path.replace(/^\/?(api\/uploads\/)?/, '');
  
  // If this is a fixture icon, allow public access without token
  if (cleanPath.includes('fixtures/')) {
    return `${backendDirectUrl}/api/uploads/${cleanPath}`;
  }
  
  // For other resources, require authentication token
  const token = localStorage.getItem('token');
  if (!token) return '';
  
  // Return direct URL to backend with authentication token as query parameter
  return `${backendDirectUrl}/api/uploads/${cleanPath}?token=${token}`;
};

/**
 * Fetches an image with authentication if needed and returns a blob URL
 * @param path Relative path to the image
 * @returns Promise resolving to a blob URL
 */
export const fetchAuthenticatedImage = async (path: string): Promise<string> => {
  if (!path) return '';
  
  try {
    // Construct URL to the backend API
    const backendUrl = api.defaults.baseURL || '';
    const cleanPath = path.replace(/^\/?(api\/uploads\/)?/, '');
    const url = `${backendUrl}/uploads/${cleanPath}`;
    
    // For fixture icons, fetch without authentication
    if (cleanPath.includes('fixtures/')) {
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to load image ${path}: ${response.status} ${response.statusText}`);
        return '';
      }
      
      // Convert to blob and create object URL
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    
    // For other resources, fetch with authentication
    const token = localStorage.getItem('token');
    if (!token) return '';
    
    // Fetch with proper authentication
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to load image ${path}: ${response.status} ${response.statusText}`);
      return '';
    }
    
    // Convert to blob and create object URL
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching image:', error);
    return '';
  }
}; 