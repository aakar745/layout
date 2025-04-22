/**
 * Utility to suppress specific React warnings in development
 * This helps reduce console noise from third-party libraries
 */

export const suppressFindDOMNodeWarning = () => {
  // Only apply in development
  if (process.env.NODE_ENV !== 'production') {
    // Save the original console.error
    const originalError = console.error;
    
    // Override console.error
    console.error = (...args: any[]) => {
      // Check if this is a findDOMNode warning
      const message = args[0] || '';
      if (typeof message === 'string' && message.includes('findDOMNode')) {
        // Suppress this warning
        return;
      }
      
      // Pass through all other errors
      originalError.apply(console, args);
    };
    
    return () => {
      // Return a function to restore the original console.error if needed
      console.error = originalError;
    };
  }
  
  // Return empty function for production
  return () => {};
};

export default suppressFindDOMNodeWarning; 