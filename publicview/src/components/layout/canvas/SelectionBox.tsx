'use client';

import React from 'react';
import { Rect } from 'react-konva';

interface SelectionBoxProps {
  selectionBox: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  };
}

export default function SelectionBox({ selectionBox }: SelectionBoxProps) {
  const x = Math.min(selectionBox.startX, selectionBox.endX);
  const y = Math.min(selectionBox.startY, selectionBox.endY);
  const width = Math.abs(selectionBox.endX - selectionBox.startX);
  const height = Math.abs(selectionBox.endY - selectionBox.startY);

  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      stroke="#3b82f6"
      strokeWidth={1}
      fill="#3b82f6"
      opacity={0.1}
      dash={[5, 5]}
      listening={false}
    />
  );
}
