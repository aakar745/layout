import axios from 'axios';

// Base URL for API requests
const baseURL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || 'https://api.aakarbooking.com/api'  // Correct backend URL
  : 'http://localhost:5000/api';

// Create the authenticated API instance
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Create a separate instance for public routes that doesn't use auth
export const publicApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a response interceptor for public API
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // For booking endpoints, preserve the full error response for conflict handling
    if (error.config?.url?.includes('/book') || 
        error.config?.url?.includes('/booking') ||
        error.config?.url?.includes('/stalls/')) {
      return Promise.reject(error);
    }
    
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

// Create a separate instance for exhibitor-specific routes
export const exhibitorApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the auth token (only for authenticated routes)
api.interceptors.request.use(
  (config) => {
    // Get both tokens
    const adminToken = localStorage.getItem('token');
    const exhibitorToken = localStorage.getItem('exhibitor_token');
    
    // Admin-only endpoints always use admin token
    const isAdminOnlyEndpoint = 
      config.url?.startsWith('/bookings/') && config.method === 'patch' || // Booking status updates
      config.url?.includes('/exhibition/') || 
      config.url?.includes('/stalls/') || 
      config.url?.includes('/halls/') ||
      config.url?.includes('/users/') ||
      config.url?.includes('/roles/');
    
    // Exhibitor endpoints use exhibitor token
    const isExhibitorEndpoint = 
      config.url?.includes('/test-booking') || 
      config.url?.includes('/exhibitor-bookings') ||
      config.url?.startsWith('/exhibitors/');
    
    // For admin-only endpoints, use admin token only
    if (isAdminOnlyEndpoint) {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      } else {
        console.warn('Admin token required but not found for:', config.url);
      }
    }
    // For exhibitor endpoints, prioritize exhibitor token
    else if (isExhibitorEndpoint && exhibitorToken) {
      config.headers.Authorization = `Bearer ${exhibitorToken}`;
    } 
    // For admin or general endpoints, use admin token
    else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    // Fallback to exhibitor token if no admin token and not an admin-only endpoint
    else if (exhibitorToken) {
      config.headers.Authorization = `Bearer ${exhibitorToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a request interceptor for exhibitor API to always use exhibitor token
exhibitorApi.interceptors.request.use(
  (config) => {
    const exhibitorToken = localStorage.getItem('exhibitor_token');
    if (exhibitorToken) {
      config.headers.Authorization = `Bearer ${exhibitorToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors (only for authenticated routes)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403 && error.response?.data?.code === 'ACCOUNT_INACTIVE') {
      // Handle inactive account
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Show notification and redirect
      if (window.location.pathname !== '/login') {
        // Store the message to show on login page
        localStorage.setItem('loginMessage', error.response.data.message);
        window.location.href = '/login';
      }
    }
    
    // For sync endpoints, preserve the full error response for better error handling
    if (error.config?.url?.includes('/sync/')) {
      return Promise.reject(error);
    }
    
    // For booking endpoints, preserve the full error response for conflict handling
    if (error.config?.url?.includes('/book') || 
        error.config?.url?.includes('/booking') ||
        error.config?.url?.includes('/stalls/')) {
      return Promise.reject(error);
    }
    
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

// Add a response interceptor for exhibitor API
exhibitorApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem('exhibitor_token');
    }
    
    // For booking endpoints, preserve the full error response for conflict handling
    if (error.config?.url?.includes('/book') || 
        error.config?.url?.includes('/booking') ||
        error.config?.url?.includes('/stalls/')) {
      return Promise.reject(error);
    }
    
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

// Specialized function for blob responses (PDF, images, etc.)
export const downloadFile = async (url: string, isExhibitor = false, onProgress?: (progressEvent: any) => void) => {
  const token = isExhibitor 
    ? localStorage.getItem('exhibitor_token')
    : localStorage.getItem('token');
  
  return axios.get(`${baseURL}${url}`, {
    responseType: 'blob',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    onDownloadProgress: onProgress
  });
};

export { api as default }; 