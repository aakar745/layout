'use client';

import React, { useMemo, JSX } from 'react';
import { Rect, Text, Group, Line } from 'react-konva';
import { Hall, LayoutViewConfig } from '@/lib/types/layout';

interface HallRendererProps {
  hall: Hall;
  viewConfig: LayoutViewConfig;
  scale?: number;
}

export default function HallRenderer({ hall, viewConfig, scale = 1 }: HallRendererProps) {
  const x = hall.position?.x || hall.dimensions?.x || 0;
  const y = hall.position?.y || hall.dimensions?.y || 0;
  const width = hall.dimensions.width;
  const height = hall.dimensions.height;

  // Create internal grid lines similar to old frontend
  const gridLines = useMemo(() => {
    if (!viewConfig.showGrid) return [];
    
    const lines: JSX.Element[] = [];
    const majorGridSize = 1; // 1 meter major grid
    const minorGridSize = 0.5; // 0.5 meter minor grid for stall snapping

    // Major vertical lines (1m intervals)
    for (let lineX = 0; lineX <= width; lineX += majorGridSize) {
      lines.push(
        <Line
          key={`v-major-${lineX}`}
          points={[x + lineX, y, x + lineX, y + height]}
          stroke="#ddd"
          strokeWidth={1 / scale}
          dash={[2 / scale, 2 / scale]}
          listening={false}
        />
      );
    }

    // Minor vertical lines (0.5m intervals)
    for (let lineX = minorGridSize; lineX < width; lineX += majorGridSize) {
      lines.push(
        <Line
          key={`v-minor-${lineX}`}
          points={[x + lineX, y, x + lineX, y + height]}
          stroke="#e8e8e8"
          strokeWidth={0.5 / scale}
          dash={[1 / scale, 3 / scale]}
          listening={false}
        />
      );
    }

    // Major horizontal lines (1m intervals)
    for (let lineY = 0; lineY <= height; lineY += majorGridSize) {
      lines.push(
        <Line
          key={`h-major-${lineY}`}
          points={[x, y + lineY, x + width, y + lineY]}
          stroke="#ddd"
          strokeWidth={1 / scale}
          dash={[2 / scale, 2 / scale]}
          listening={false}
        />
      );
    }

    // Minor horizontal lines (0.5m intervals)
    for (let lineY = minorGridSize; lineY < height; lineY += majorGridSize) {
      lines.push(
        <Line
          key={`h-minor-${lineY}`}
          points={[x, y + lineY, x + width, y + lineY]}
          stroke="#e8e8e8"
          strokeWidth={0.5 / scale}
          dash={[1 / scale, 3 / scale]}
          listening={false}
        />
      );
    }

    return lines;
  }, [x, y, width, height, scale, viewConfig.showGrid]);

  return (
    <Group>
      {/* Hall background rectangle */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#ffffff"
        stroke="#d9d9d9"
        strokeWidth={1 / scale}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={5 / scale}
        shadowOffset={{ x: 2 / scale, y: 2 / scale }}
        shadowOpacity={0.5}
        listening={false}
      />
      
      {/* Internal grid lines */}
      {gridLines}

      {/* Hall name - centered */}
      <Text
        x={x}
        y={y + height / 2 - 7 / scale}
        width={width}
        text={hall.name}
        fontSize={14 / scale}
        fontFamily="Inter, Arial, sans-serif"
        fontStyle="bold"
        fill="#000000"
        align="center"
        listening={false}
      />
    </Group>
  );
}
