import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Group, Rect, Text, Circle, Label, Tag } from 'react-konva';
import { Stall as StallType } from '../../../services/exhibition';
import Konva from 'konva';

// Extend the StallType to include optional properties
interface ExtendedStallType extends StallType {
  hallName?: string;
  isSelected?: boolean;
  typeName?: string;
  rotation?: number;
  companyName?: string;
}

interface StallProps {
  stall: ExtendedStallType;
  isSelected?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
  onChange?: (stall: StallType) => void;
  hallWidth?: number;
  hallHeight?: number;
  hallX?: number;
  hallY?: number;
  scale?: number;
}

const Stall: React.FC<StallProps> = ({
  stall,
  isSelected = false,
  onSelect,
  onChange,
  hallWidth = 0,
  hallHeight = 0,
  hallX = 0,
  hallY = 0,
  scale = 1
}) => {
  const shapeRef = React.useRef<Konva.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipOpacity, setTooltipOpacity] = useState(0);
  
  // Animation effect for the tooltip
  useEffect(() => {
    if (isHovered) {
      setTooltipOpacity(1);
    } else {
      setTooltipOpacity(0);
    }
  }, [isHovered]);

  // Move tooltip to top layer when hovered
  useEffect(() => {
    if (isHovered && shapeRef.current) {
      // Find the parent layer and move this group to the top
      const stage = shapeRef.current.getStage();
      if (stage) {
        // Move the group to the top when hovered
        shapeRef.current.moveToTop();
      }
    }
  }, [isHovered]);

  // Use either the prop or the stall object's isSelected property
  const isStallSelected = isSelected || stall.isSelected;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#52c41a';
      case 'booked':
        return '#faad14';
      case 'reserved':
        return '#1890ff';
      default:
        return '#d9d9d9';
    }
  };

  const getStatusFillColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'rgba(82, 196, 26, 0.2)'; // Light green
      case 'booked':
        return 'rgba(250, 173, 20, 0.2)'; // Light yellow/orange
      case 'reserved':
        return 'rgba(24, 144, 255, 0.2)'; // Light blue
      default:
        return 'rgba(217, 217, 217, 0.2)'; // Light gray
    }
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    
    const node = e.target;
    
    // Calculate position relative to hall
    const localX = node.x() - hallX;
    const localY = node.y() - hallY;

    // Ensure stall stays within hall bounds
    const boundedX = Math.max(0, Math.min(localX, hallWidth - stall.dimensions.width));
    const boundedY = Math.max(0, Math.min(localY, hallHeight - stall.dimensions.height));

    // Update node position immediately
    node.x(Math.round(boundedX + hallX));
    node.y(Math.round(boundedY + hallY));
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    
    const node = e.target;
    
    // Calculate final position relative to hall
    const localX = node.x() - hallX;
    const localY = node.y() - hallY;

    // Ensure stall stays within hall bounds
    const boundedX = Math.max(0, Math.min(localX, hallWidth - stall.dimensions.width));
    const boundedY = Math.max(0, Math.min(localY, hallHeight - stall.dimensions.height));

    if (onChange) {
      // Preserve both id and _id in the update
      onChange({
        ...stall,
        id: stall.id || stall._id,
        _id: stall._id || stall.id,
        dimensions: {
          ...stall.dimensions,
          x: Math.round(boundedX),
          y: Math.round(boundedY)
        }
      });
    }
  };

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    if (onSelect) {
      onSelect();
    }
  };

  const defaultDimensions = {
    x: 0,
    y: 0,
    width: 10,
    height: 10
  };

  const dimensions = stall.dimensions || defaultDimensions;
  const stallType = stall.typeName || 'Standard';
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const price = stall.ratePerSqm * dimensions.width * dimensions.height;

  // Always reset rotation to 0 regardless of what's passed in
  const stallRotation = 0;

  return (
    <Group
      ref={shapeRef}
      x={dimensions.x + hallX}
      y={dimensions.y + hallY}
      width={dimensions.width}
      height={dimensions.height}
      draggable={!!onChange}
      onClick={handleClick}
      onTap={handleClick}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      opacity={stall.status === 'available' ? 1 : 0.7}
      cursor={stall.status === 'available' ? 'pointer' : 'default'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Rect
        width={dimensions.width}
        height={dimensions.height}
        fill={isStallSelected ? "rgba(24, 144, 255, 0.1)" : getStatusFillColor(stall.status)}
        stroke={isStallSelected ? "#1890ff" : getStatusColor(stall.status)}
        strokeWidth={isStallSelected ? 2 / scale : 1 / scale}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={3}
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={0.3}
        rotation={stallRotation}
      />
      <Text
        text={stall.number}
        fontSize={Math.min(dimensions.width, dimensions.height) * 0.25}
        fill="#000000"
        width={dimensions.width}
        height={dimensions.height}
        align="center"
        verticalAlign="middle"
      />
      
      {/* Selection indicator */}
      {isStallSelected && (
        <Circle
          x={dimensions.width - 2}
          y={2}
          radius={1.5}
          fill="#1890ff"
          stroke="#ffffff"
          strokeWidth={0.3 / scale}
        />
      )}

      {/* Tooltip with Label which has built-in positioning */}
      {isHovered && (
        <Label
          x={dimensions.width / 2}
          y={0}
          opacity={1}
        >
          <Tag
            fill="rgba(0, 0, 0, 1.0)"
            cornerRadius={0.5}
            pointerDirection="down"
            pointerWidth={4}
            pointerHeight={2}
            lineJoin="round"
            y={-7}
          />
          <Text
            text={stall.status !== 'available' && stall.companyName 
              ? `${stallType} - ${dimensions.width}×${dimensions.height}m - ${stall.companyName}`
              : `${stallType} - ${dimensions.width}×${dimensions.height}m`}
            fontSize={1.2}
            fill="#ffffff"
            align="center"
            padding={2}
            y={-7}
            offsetY={0}
            width={Math.max(
              stall.status !== 'available' && stall.companyName
                ? `${stallType} - ${dimensions.width}×${dimensions.height}m - ${stall.companyName}`.length * 0.7
                : `${stallType} - ${dimensions.width}×${dimensions.height}m`.length * 0.7,
              25
            )}
            height={3}
            verticalAlign="middle"
          />
        </Label>
      )}
    </Group>
  );
};

export default Stall; 