'use client';

import React, { useMemo } from 'react';
import { Group, Line } from 'react-konva';

interface GridRendererProps {
  width: number;
  height: number;
  scale: number;
}

const GridRenderer = React.memo(function GridRenderer({ width, height, scale }: GridRendererProps) {
  // Create grid lines similar to old frontend ExhibitionSpace
  const gridLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    const gridSize = 5; // 5 meter grid size for more detail (same as old frontend)

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, height]}
          stroke="#e8e8e8"
          strokeWidth={1 / scale}
          dash={[5 / scale, 5 / scale]}
          listening={false}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <Line
          key={`h${y}`}
          points={[0, y, width, y]}
          stroke="#e8e8e8"
          strokeWidth={1 / scale}
          dash={[5 / scale, 5 / scale]}
          listening={false}
        />
      );
    }

    return lines;
  }, [width, height, scale]);

  return (
    <Group listening={false}>
      {gridLines}
    </Group>
  );
});

export default GridRenderer;
