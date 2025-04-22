import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Exhibition from '../models/exhibition.model';

/**
 * Middleware that rewrites URLs containing exhibition slugs to use their MongoDB IDs
 * This allows the rest of the application to continue using IDs while providing SEO-friendly URLs
 * 
 * Example:
 * /exhibition/smart-expo-2025/layout → /exhibition/67ffab2c00bf5c826f7401af/layout
 */
export const urlRewriteMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Only process URLs that contain exhibition paths
    if (req.path.includes('/exhibition/') || req.path.includes('/exhibitions/')) {
      const segments = req.path.split('/');
      
      // Find the exhibition segment index
      const index = segments.findIndex(s => s === 'exhibition' || s === 'exhibitions');
      
      // Make sure there's a slug/id after the exhibition segment
      if (index >= 0 && segments.length > index + 1) {
        const slugOrId = segments[index + 1];
        
        // If it's already a MongoDB ID, no need to rewrite
        if (mongoose.Types.ObjectId.isValid(slugOrId)) {
          return next();
        }
        
        // Look up the exhibition by slug
        const exhibition = await Exhibition.findOne({ slug: slugOrId });
        
        if (exhibition) {
          // Replace the slug with the MongoDB ID in the URL
          segments[index + 1] = exhibition._id.toString();
          
          // Rebuild the URL, preserving any query parameters
          const queryPart = req.url.includes('?') 
            ? req.url.substring(req.url.indexOf('?')) 
            : '';
            
          req.url = segments.join('/') + queryPart;
          
          console.log(`URL rewritten from ${req.originalUrl} to ${req.url}`);
        }
      }
    }
  } catch (error) {
    // Log error but don't block the request - fall back to original URL
    console.error('Error in URL rewrite middleware:', error);
  }
  
  // Always continue to next middleware
  next();
}; 