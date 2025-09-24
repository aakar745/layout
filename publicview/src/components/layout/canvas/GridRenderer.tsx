'use client';

import React, { useMemo } from 'react';
import { Group, Line } from 'react-konva';

interface GridRendererProps {
  width: number;
  height: number;
  scale: number;
}

const GridRenderer = React.memo(function GridRenderer({ width, height, scale }: GridRendererProps) {
  // PERFORMANCE: Optimized grid rendering with intelligent scaling
  const gridLines = useMemo(() => {
    const lines: React.ReactElement[] = [];
    
    // PERFORMANCE: Adaptive grid size based on scale for better performance
    // At high zoom: smaller grid (5m), at low zoom: larger grid (20m) to reduce line count
    const baseGridSize = scale > 0.5 ? 5 : (scale > 0.2 ? 10 : 20);
    
    // PERFORMANCE: Skip grid rendering when zoomed out too far (invisible anyway)
    if (scale < 0.1) {
      return [];
    }

    // PERFORMANCE: Simplified strokes - no dashes at low zoom for better performance
    const useSimpleStrokes = scale < 0.3;
    const strokeProps = useSimpleStrokes 
      ? { stroke: "#f0f0f0", strokeWidth: 0.5 / scale }  // Solid, thinner lines
      : { stroke: "#e8e8e8", strokeWidth: 1 / scale, dash: [5 / scale, 5 / scale] };

    // Vertical lines
    for (let x = 0; x <= width; x += baseGridSize) {
      lines.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, height]}
          {...strokeProps}
          listening={false}
          perfectDrawEnabled={false}  // PERFORMANCE: Disable pixel-perfect drawing
        />
      );
    }

    // Horizontal lines  
    for (let y = 0; y <= height; y += baseGridSize) {
      lines.push(
        <Line
          key={`h${y}`}
          points={[0, y, width, y]}
          {...strokeProps}
          listening={false}
          perfectDrawEnabled={false}  // PERFORMANCE: Disable pixel-perfect drawing
        />
      );
    }

    return lines;
  }, [width, height, scale]);

  return (
    <Group 
      perfectDrawEnabled={false}  // PERFORMANCE: Disable pixel-perfect drawing for entire group
      listening={false}           // PERFORMANCE: Disable event listening (grid is non-interactive)
    >
      {gridLines}
    </Group>
  );
});

export default GridRenderer;
