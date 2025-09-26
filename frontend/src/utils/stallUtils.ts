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
 * Format stall dimensions for display (handles both rectangle and L-shape)
 */
export const formatStallDimensions = (dimensions: StallDimensions): string => {
  if (!dimensions) return '-';
  
  const shapeType = dimensions.shapeType || 'rectangle';
  
  if (shapeType === 'l-shape' && dimensions.lShape) {
    const { rect1Width, rect1Height, rect2Width, rect2Height } = dimensions.lShape;
    return `L-Shape (${rect1Width}×${rect1Height} + ${rect2Width}×${rect2Height})`;
  }
  
  // Rectangle or fallback
  return `${dimensions.width}×${dimensions.height}m`;
};

// Utility functions for stall positioning and validation

/**
 * Check if two rectangles overlap with optional gap consideration
 */
export const doStallsOverlap = (
  stall1: { x: number; y: number; width: number; height: number },
  stall2: { x: number; y: number; width: number; height: number },
  gap: number = 0
): boolean => {
  return !(
    stall1.x + stall1.width + gap <= stall2.x ||   // stall1 is completely to the left
    stall1.x >= stall2.x + stall2.width + gap ||   // stall1 is completely to the right
    stall1.y + stall1.height + gap <= stall2.y ||  // stall1 is completely above
    stall1.y >= stall2.y + stall2.height + gap     // stall1 is completely below
  );
};

/**
 * Check if a stall position is valid within hall boundaries
 */
export const isStallWithinHall = (
  stallDimensions: { x: number; y: number; width: number; height: number },
  hallDimensions: { width: number; height: number }
): boolean => {
  return (
    stallDimensions.x >= 0 &&
    stallDimensions.y >= 0 &&
    stallDimensions.x + stallDimensions.width <= hallDimensions.width &&
    stallDimensions.y + stallDimensions.height <= hallDimensions.height
  );
};

/**
 * Validate stall placement against existing stalls and hall boundaries
 */
export const validateStallPlacement = (
  newStall: { x: number; y: number; width: number; height: number },
  existingStalls: Array<{ dimensions: { x: number; y: number; width: number; height: number } }>,
  hallDimensions: { width: number; height: number },
  minGap: number = 0.5
): { isValid: boolean; reason?: string } => {
  // Check hall boundaries
  if (!isStallWithinHall(newStall, hallDimensions)) {
    return {
      isValid: false,
      reason: 'Stall extends beyond hall boundaries'
    };
  }

  // Check overlaps with existing stalls
  for (let i = 0; i < existingStalls.length; i++) {
    const existingStall = existingStalls[i].dimensions;
    if (doStallsOverlap(newStall, existingStall, minGap)) {
      return {
        isValid: false,
        reason: `Stall overlaps with existing stall at (${existingStall.x}, ${existingStall.y})`
      };
    }
  }

  return { isValid: true };
};

/**
 * Snap coordinate to half-grid positions (0.5m intervals)
 */
export const snapToHalfGrid = (value: number): number => {
  return Math.round(value * 2) / 2;
}; 