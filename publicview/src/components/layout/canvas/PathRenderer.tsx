'use client';

import React from 'react';
import { Line } from 'react-konva';
import { Path, LayoutViewConfig } from '@/lib/types/layout';

interface PathRendererProps {
  path: Path;
  viewConfig: LayoutViewConfig;
}

const PATH_COLORS = {
  path: '#d1d5db',
  entrance: '#10b981',
  exit: '#ef4444',
  emergency: '#f59e0b',
};

export default function PathRenderer({ path, viewConfig }: PathRendererProps) {
  const color = PATH_COLORS[path.type] || PATH_COLORS.path;
  const width = path.width || 10;
  
  // Convert points to flat array for Konva
  const points = path.points.flatMap(point => [point.x, point.y]);

  return (
    <Line
      points={points}
      stroke={color}
      strokeWidth={width}
      opacity={0.6}
      lineCap="round"
      lineJoin="round"
      listening={false}
    />
  );
}
