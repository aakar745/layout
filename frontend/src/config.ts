// API URL based on environment
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
export const apiUrl = isProduction 
  ? (import.meta.env.VITE_API_URL || 'https://api.aakarbooking.com/api')
  : 'http://localhost:5000/api';

// TinyMCE API Key - This is a default key for quick testing only!
// For production, replace this with your actual TinyMCE API key
export const tinyMCEApiKey = import.meta.env.VITE_TINYMCE_API_KEY || 'ma7o6bmjpok2nhnhq6jgcwrlg446a2hnyxqih70ni695pvm5'; 