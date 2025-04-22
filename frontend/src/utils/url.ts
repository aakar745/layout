/**
 * Utility functions for URL handling and generation
 */

/**
 * Generates a URL for an exhibition page using the slug if available, falling back to ID
 * 
 * @param exhibition - The exhibition object containing either slug or _id
 * @param subpath - Optional subpath to append (e.g., 'layout', 'stalls', etc.)
 * @returns The URL string for the exhibition
 */
export const getExhibitionUrl = (exhibition: any, subpath?: string): string => {
  if (!exhibition) return '';
  
  // Use the slug if available, otherwise use the ID
  const identifier = exhibition.slug || exhibition._id || exhibition.id;
  
  // Construct the URL
  let url = `/exhibition/${identifier}`;
  
  // Add optional subpath
  if (subpath) {
    url += `/${subpath}`;
  }
  
  return url;
};

/**
 * Generates a URL for a public exhibition page using the slug if available, falling back to ID
 * This is specifically for public-facing pages that use /exhibitions/ (plural)
 * 
 * @param exhibition - The exhibition object containing either slug or _id
 * @param subpath - Optional subpath to append (e.g., 'layout', 'details', etc.)
 * @returns The URL string for the public exhibition
 */
export const getPublicExhibitionUrl = (exhibition: any, subpath?: string): string => {
  if (!exhibition) return '';
  
  // Use the slug if available, otherwise use the ID
  const identifier = exhibition.slug || exhibition._id || exhibition.id;
  
  // Construct the URL with exhibitions (plural) for public routes
  let url = `/exhibitions/${identifier}`;
  
  // Add optional subpath
  if (subpath) {
    url += `/${subpath}`;
  }
  
  return url;
};

/**
 * Generates a clean, URL-friendly slug from a string
 * 
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove consecutive hyphens
    .trim();
}; 