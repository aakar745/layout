import React from 'react';
import { Group, Rect } from 'react-konva';

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

interface StallRendererProps {
  dimensions: StallDimensions;
  fill: string;
  stroke: string;
  strokeWidth: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffset?: { x: number; y: number };
  shadowOpacity?: number;
  rotation?: number;
  perfectDrawEnabled?: boolean;
  transformsEnabled?: string;
  cornerRadius?: number;
}

const StallRenderer: React.FC<StallRendererProps> = ({
  dimensions,
  fill,
  stroke,
  strokeWidth,
  shadowColor = "rgba(0,0,0,0.1)",
  shadowBlur = 3,
  shadowOffset = { x: 1, y: 1 },
  shadowOpacity = 0.3,
  rotation = 0,
  perfectDrawEnabled = true,
  transformsEnabled = 'all',
  cornerRadius = 0.05
}) => {
  const shapeType = dimensions.shapeType || 'rectangle';

  if (shapeType === 'rectangle') {
    return (
      <Rect
        width={dimensions.width}
        height={dimensions.height}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        shadowColor={shadowColor}
        shadowBlur={shadowBlur}
        shadowOffset={shadowOffset}
        shadowOpacity={shadowOpacity}
        rotation={rotation}
        perfectDrawEnabled={perfectDrawEnabled}
        transformsEnabled={transformsEnabled}
        cornerRadius={cornerRadius}
      />
    );
  }

  if (shapeType === 'l-shape' && dimensions.lShape) {
    const { rect1Width, rect1Height, rect2Width, rect2Height, orientation } = dimensions.lShape;
    
    // Calculate positions for L-shape rectangles based on corner placement
    let rect1X = 0, rect1Y = 0, rect2X = 0, rect2Y = 0;
    
    // Handle backward compatibility with old orientation values
    let cornerOrientation = orientation;
    if (orientation === 'horizontal') {
      cornerOrientation = 'bottom-left';
    } else if (orientation === 'vertical') {
      cornerOrientation = 'top-left';
    }
    
    switch (cornerOrientation) {
      case 'top-left':
        // L-corner at top-left: Rectangle 1 vertical on left, Rectangle 2 horizontal on top-right
        rect1X = 0;
        rect1Y = 0;
        rect2X = rect1Width;
        rect2Y = 0;
        break;
        
      case 'top-right':
        // L-corner at top-right: Rectangle 1 vertical on right, Rectangle 2 horizontal on top-left
        rect1X = rect2Width;
        rect1Y = 0;
        rect2X = 0;
        rect2Y = 0;
        break;
        
      case 'bottom-left':
        // L-corner at bottom-left: Rectangle 1 vertical extending up, Rectangle 2 horizontal extending right (no overlap)
        rect1X = 0;
        rect1Y = 0;
        rect2X = rect1Width;
        rect2Y = rect1Height - rect2Height;
        break;
        
      case 'bottom-right':
        // L-corner at bottom-right: Rectangle 1 vertical at right, Rectangle 2 horizontal at bottom-left (no overlap)
        rect1X = rect2Width - rect1Width;
        rect1Y = 0;
        rect2X = 0;
        rect2Y = rect1Height;
        break;
        
      default:
        // Fallback to bottom-left for any unknown values
        rect1X = 0;
        rect1Y = rect2Height;
        rect2X = rect1Width;
        rect2Y = 0;
        break;
    }
    
    return (
      <Group>
        {/* Rectangle 1 */}
        <Rect
          x={rect1X}
          y={rect1Y}
          width={rect1Width}
          height={rect1Height}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          shadowColor={shadowColor}
          shadowBlur={shadowBlur}
          shadowOffset={shadowOffset}
          shadowOpacity={shadowOpacity}
          rotation={rotation}
          perfectDrawEnabled={perfectDrawEnabled}
          transformsEnabled={transformsEnabled}
          cornerRadius={cornerRadius}
        />
        
        {/* Rectangle 2 */}
        <Rect
          x={rect2X}
          y={rect2Y}
          width={rect2Width}
          height={rect2Height}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          shadowColor={shadowColor}
          shadowBlur={shadowBlur}
          shadowOffset={shadowOffset}
          shadowOpacity={shadowOpacity}
          rotation={rotation}
          perfectDrawEnabled={perfectDrawEnabled}
          transformsEnabled={transformsEnabled}
          cornerRadius={cornerRadius}
        />
      </Group>
    );
  }

  // Fallback to rectangle
  return (
    <Rect
      width={dimensions.width}
      height={dimensions.height}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      shadowColor={shadowColor}
      shadowBlur={shadowBlur}
      shadowOffset={shadowOffset}
      shadowOpacity={shadowOpacity}
      rotation={rotation}
      perfectDrawEnabled={perfectDrawEnabled}
      transformsEnabled={transformsEnabled}
      cornerRadius={cornerRadius}
    />
  );
};

export default StallRenderer; 