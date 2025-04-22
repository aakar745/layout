import { useState, useEffect } from 'react';
import { fetchAuthenticatedImage } from '../services/imageUtils';

/**
 * Hook to load an image with authentication
 * Returns an HTML Image element and loading status
 * 
 * @param path Path to the image
 * @returns [Image object, status: 'loading' | 'loaded' | 'error']
 */
export const useAuthenticatedImage = (path: string | undefined): [HTMLImageElement | undefined, string] => {
  const [image, setImage] = useState<HTMLImageElement>();
  const [status, setStatus] = useState<string>('loading');

  useEffect(() => {
    if (!path) {
      setStatus('error');
      setImage(undefined);
      return;
    }

    setStatus('loading');
    let mounted = true;

    const loadImage = async () => {
      try {
        // Fetch authenticated image as blob URL
        const blobUrl = await fetchAuthenticatedImage(path);
        
        if (!blobUrl) {
          if (mounted) {
            setStatus('error');
            setImage(undefined);
          }
          return;
        }

        // Create new image from blob URL
        const img = new window.Image();
        
        img.onload = () => {
          if (mounted) {
            setImage(img);
            setStatus('loaded');
          }
        };
        
        img.onerror = () => {
          if (mounted) {
            console.error(`Failed to load image from blob URL: ${blobUrl}`);
            setStatus('error');
            setImage(undefined);
            
            // Clean up blob URL on error
            URL.revokeObjectURL(blobUrl);
          }
        };

        img.src = blobUrl;
      } catch (error) {
        if (mounted) {
          console.error('Error in useAuthenticatedImage:', error);
          setStatus('error');
          setImage(undefined);
        }
      }
    };

    loadImage();

    // Cleanup function
    return () => {
      mounted = false;
      // If we have an image with a blob URL, revoke it
      if (image?.src.startsWith('blob:')) {
        URL.revokeObjectURL(image.src);
      }
    };
  }, [path]);

  return [image, status];
}; 