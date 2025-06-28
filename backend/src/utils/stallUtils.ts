interface StallDimensions {
  width: number;
  height: number;
  shapeType?: 'rectangle' | 'l-shape';
  lShape?: {
    rect1Width: number;
    rect1Height: number;
    rect2Width: number;
    rect2Height: number;
    orientation: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'horizontal' | 'vertical';
  };
}

/**
 * Calculate the total area of a stall (rectangle or L-shape)
 */
export const calculateStallArea = (dimensions: StallDimensions): number => {
  if (!dimensions) return 0;
  
  const shapeType = dimensions.shapeType || 'rectangle';
  
  if (shapeType === 'rectangle') {
    return dimensions.width * dimensions.height;
  }
  
  if (shapeType === 'l-shape' && dimensions.lShape) {
    const { rect1Width, rect1Height, rect2Width, rect2Height } = dimensions.lShape;
    return (rect1Width * rect1Height) + (rect2Width * rect2Height);
  }
  
  // Fallback to rectangle
  return dimensions.width * dimensions.height;
};

/**
 * Calculate the price of a stall based on its area and rate per sqm
 */
export const calculateStallPrice = (dimensions: StallDimensions, ratePerSqm: number): number => {
  const area = calculateStallArea(dimensions);
  return area * ratePerSqm;
};