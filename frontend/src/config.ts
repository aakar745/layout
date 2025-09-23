// API URL based on environment
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
export const apiUrl = isProduction 
  ? (import.meta.env.VITE_API_URL || 'https://api.aakarbooking.com/api')
  : 'http://localhost:5000/api';

// Debug logging for production
if (isProduction) {
  console.log('Production API URL:', apiUrl);
  console.log('Environment variable VITE_API_URL:', import.meta.env.VITE_API_URL);
}

// Admin panel URL
export const adminUrl = isProduction 
  ? 'https://admin.aakarbooking.com'
  : 'http://localhost:5173';

// Public site URL  
export const publicUrl = isProduction
  ? 'https://aakarbooking.com'
  : 'http://localhost:3000';

// TinyMCE API Key - This is a default key for quick testing only!
// For production, replace this with your actual TinyMCE API key
export const tinyMCEApiKey = import.meta.env.VITE_TINYMCE_API_KEY || 'ma7o6bmjpok2nhnhq6jgcwrlg446a2hnyxqih70ni695pvm5'; 