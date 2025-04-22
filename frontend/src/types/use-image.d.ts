declare module 'use-image' {
  type ImageStatus = 'loading' | 'loaded' | 'failed';
  
  /**
   * React hook to load images
   * @param url - Image URL to load
   * @param options - Image loading options
   * @returns [HTMLImageElement | undefined, ImageStatus]
   */
  export default function useImage(
    url: string,
    options?: {
      crossOrigin?: 'anonymous' | 'use-credentials' | '';
    }
  ): [HTMLImageElement | undefined, ImageStatus];
} 