'use client';

import React from 'react';
import { Circle, Text, Group, Rect } from 'react-konva';
import { Amenity, LayoutViewConfig } from '@/lib/types/layout';

interface AmenityRendererProps {
  amenity: Amenity;
  viewConfig: LayoutViewConfig;
}

const AMENITY_COLORS = {
  restroom: '#3b82f6',
  food: '#f59e0b',
  parking: '#10b981',
  info: '#8b5cf6',
  medical: '#ef4444',
  security: '#374151',
};

const AMENITY_ICONS = {
  restroom: '🚻',
  food: '🍽️',
  parking: '🅿️',
  info: 'ℹ️',
  medical: '🏥',
  security: '🛡️',
};

export default function AmenityRenderer({ amenity, viewConfig }: AmenityRendererProps) {
  if (!viewConfig.showAmenities) return null;

  const color = AMENITY_COLORS[amenity.type] || '#6b7280';
  const icon = AMENITY_ICONS[amenity.type] || '📍';

  return (
    <Group>
      {/* Amenity background circle */}
      <Circle
        x={amenity.position.x}
        y={amenity.position.y}
        radius={16}
        fill={color}
        opacity={0.8}
        stroke="white"
        strokeWidth={2}
        listening={false}
      />

      {/* Amenity icon */}
      <Text
        x={amenity.position.x}
        y={amenity.position.y}
        text={icon}
        fontSize={16}
        align="center"
        verticalAlign="middle"
        offsetX={8}
        offsetY={8}
        listening={false}
      />

      {/* Amenity label */}
      <Text
        x={amenity.position.x}
        y={amenity.position.y + 25}
        text={amenity.name}
        fontSize={10}
        fontFamily="Inter, Arial, sans-serif"
        fill="#374151"
        align="center"
        verticalAlign="middle"
        width={60}
        offsetX={30}
        listening={false}
      />
    </Group>
  );
}
