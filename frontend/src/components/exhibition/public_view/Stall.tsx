import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { Group, Rect, Text, Circle, Label, Tag } from 'react-konva';
import { Stall as StallType } from '../../../services/exhibition';
import Konva from 'konva';
import StallRenderer from '../layout/StallRenderer';
import { calculateStallArea } from '../../../utils/stallUtils';

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
  onChange?: (stall: ExtendedStallType) => void;
  hallWidth?: number;
  hallHeight?: number;
  hallX?: number;
  hallY?: number;
  scale?: number;
  isDragging?: boolean;
  isLargeDataset?: boolean; // New prop for performance optimization
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
  scale = 1,
  isDragging = false,
  isLargeDataset = false
}) => {
  const shapeRef = useRef<Konva.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile for optimizations
  useEffect(() => {
    if (isLargeDataset) return; // Skip unnecessary effects for large datasets
    
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLargeDataset]);
  
  // Optimize tooltip visibility with debouncing - disabled for large datasets
  useEffect(() => {
    if (isLargeDataset) return;
    
    if (isHovered && !isDragging) {
      // Show tooltip immediately when hovered (but not during dragging)
      setTooltipVisible(true);
    } else {
      // Hide tooltip immediately during dragging
      if (isDragging) {
        setTooltipVisible(false);
      } else {
        // Normal behavior when not dragging
        const timer = setTimeout(() => {
          setTooltipVisible(false);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isHovered, isDragging, isLargeDataset]);

  // Optimize top layer management - disabled for large datasets
  useEffect(() => {
    if (isLargeDataset) return;
    
    if (isHovered && shapeRef.current && !isDragging) {
      // Skip during dragging for better performance
      // On mobile, only move to top if actually selected
      if (isMobile && !isSelected) return;
      
      const stage = shapeRef.current.getStage();
      if (stage) {
        shapeRef.current.moveToTop();
      }
    }
  }, [isHovered, isSelected, isMobile, isDragging, isLargeDataset]);

  // Use either the prop or the stall object's isSelected property
  const isStallSelected = isSelected || stall.isSelected;

  const getStatusColor = useCallback((status: string) => {
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
  }, []);

  const getStatusFillColor = useCallback((status: string) => {
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
  }, []);

  // Helper function to snap to half-grid positions (0.5m intervals)
  const snapToHalfGrid = useCallback((value: number) => {
    return Math.round(value * 2) / 2;
  }, []);

  const handleDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    
    const node = e.target;
    
    // Calculate position relative to hall
    const localX = node.x() - hallX;
    const localY = node.y() - hallY;

    // Ensure stall stays within hall bounds
    const boundedX = Math.max(0, Math.min(localX, hallWidth - stall.dimensions.width));
    const boundedY = Math.max(0, Math.min(localY, hallHeight - stall.dimensions.height));

    // Snap to half-grid positions (0.5m intervals)
    const snappedX = snapToHalfGrid(boundedX);
    const snappedY = snapToHalfGrid(boundedY);

    // Update node position immediately
    node.x(snappedX + hallX);
    node.y(snappedY + hallY);
  }, [hallX, hallY, hallWidth, hallHeight, stall.dimensions.width, stall.dimensions.height, snapToHalfGrid]);

  const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    
    if (!onChange) return;
    
    const node = e.target;
    
    // Calculate final position relative to hall
    const localX = node.x() - hallX;
    const localY = node.y() - hallY;

    // Ensure stall stays within hall bounds
    const boundedX = Math.max(0, Math.min(localX, hallWidth - stall.dimensions.width));
    const boundedY = Math.max(0, Math.min(localY, hallHeight - stall.dimensions.height));

    // Snap to half-grid positions (0.5m intervals)
    const snappedX = snapToHalfGrid(boundedX);
    const snappedY = snapToHalfGrid(boundedY);

    // Preserve both id and _id in the update
    onChange({
      ...stall,
      id: stall.id || stall._id,
      _id: stall._id || stall.id,
      dimensions: {
        ...stall.dimensions,
        x: snappedX,
        y: snappedY
      }
    });
  }, [onChange, hallX, hallY, hallWidth, hallHeight, stall, snapToHalfGrid]);

  const handleDragStart = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
  }, []);

  const handleClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    if (onSelect && !isDragging) {
      onSelect();
    }
  }, [onSelect, isDragging]);
  
  // Optimize hover behavior especially for mobile - simplified for large datasets
  const handleMouseEnter = useCallback(() => {
    if (isLargeDataset) return; // Disable hover for large datasets
    if ((isMobile && !isStallSelected) || isDragging) return;
    setIsHovered(true);
  }, [isMobile, isStallSelected, isDragging, isLargeDataset]);
  
  const handleMouseLeave = useCallback(() => {
    if (isLargeDataset) return; // Disable hover for large datasets
    setIsHovered(false);
  }, [isLargeDataset]);

  const defaultDimensions = {
    x: 0,
    y: 0,
    width: 10,
    height: 10
  };

  const dimensions = stall.dimensions || defaultDimensions;
  const stallType = stall.typeName || stall.stallType?.name || (typeof stall.stallTypeId === 'object' ? stall.stallTypeId?.name : null) || 'Standard';
  
  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  const area = calculateStallArea(dimensions);
  const price = stall.ratePerSqm * area;

  // Always reset rotation to 0 regardless of what's passed in
  const stallRotation = 0;
  
  // Optimize tooltip content with memoization
  const tooltipText = useMemo(() => {
    const shapeInfo = (dimensions as any).shapeType === 'l-shape' 
      ? `L-Shape (${area.toFixed(1)} sqm)`
      : `${dimensions.width}m x ${dimensions.height}m`;
    
    return stall.status !== 'available' && stall.companyName 
      ? `${stallType} - ${shapeInfo} - ${stall.companyName}`
      : `${stallType} - ${shapeInfo}`;
  }, [stallType, dimensions, area, stall.status, stall.companyName]);

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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      listening={isDragging ? false : (!isMobile || stall.status === 'available')} // Disable listening during drag
      transformsEnabled={isDragging ? 'position' : (isMobile ? 'position' : 'all')} // Simplify transforms during drag
    >
      <StallRenderer
        dimensions={dimensions}
        fill={isStallSelected ? "rgba(24, 144, 255, 0.1)" : getStatusFillColor(stall.status)}
        stroke={isStallSelected ? "#1890ff" : getStatusColor(stall.status)}
        strokeWidth={isStallSelected ? 2 / scale : 1 / scale}
        shadowColor={isLargeDataset ? "transparent" : "rgba(0,0,0,0.1)"}
        shadowBlur={isLargeDataset ? 0 : (isDragging ? 0 : (isMobile ? 2 : 3))} // Disable shadows for large datasets
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={isLargeDataset ? 0 : (isDragging ? 0 : 0.3)} // Disable shadows for large datasets
        rotation={stallRotation}
        perfectDrawEnabled={!isDragging && !isLargeDataset} // Disable perfect drawing for large datasets
        transformsEnabled={isDragging ? 'position' : 'all'} // Simplify transforms during drag
        cornerRadius={isLargeDataset ? 0 : 0.05} // Remove corner radius for large datasets
      />
      <Text
        text={stall.number}
        fontSize={Math.min(dimensions.width, dimensions.height) * (isLargeDataset ? 0.2 : 0.25)} // Smaller text for large datasets
        fill="#000000"
        width={dimensions.width}
        height={dimensions.height}
        align="center"
        verticalAlign="middle"
        transformsEnabled="position"
        perfectDrawEnabled={!isDragging && !isLargeDataset} // Disable perfect drawing for large datasets
        fontStyle={isLargeDataset ? "normal" : "bold"} // Normal weight for large datasets
        listening={false} // Text doesn't need to listen for events
        visible={!isLargeDataset || dimensions.width > 2} // Hide text for small stalls in large datasets
      />
      
      {/* Only show selection indicator when not dragging and not in large dataset mode */}
      {isStallSelected && !isDragging && !isLargeDataset && (
        <Circle
          x={dimensions.width - 2}
          y={2}
          radius={Math.min(0.8, dimensions.width * 0.05)} // Smaller radius that scales with stall size
          fill="#1890ff"
          stroke="#ffffff"
          strokeWidth={0.2 / scale}
          transformsEnabled="position"
          listening={false} // Circle doesn't need to listen for events
        />
      )}

      {/* Only show tooltip when not dragging and not in large dataset mode */}
      {tooltipVisible && !isDragging && !isLargeDataset && (
        <Label
          x={dimensions.width / 2}
          y={-5 / scale} // Scale the vertical offset
          opacity={0.9}
          listening={false}
        >
          <Tag
            fill="#333"
            cornerRadius={3 / scale} // Scale the corner radius
            pointerDirection="down"
            pointerWidth={6 / scale} // Scale the pointer width
            pointerHeight={4 / scale} // Scale the pointer height
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={2 / scale} // Scale the shadow blur
            shadowOffset={{ x: 1 / scale, y: 1 / scale }} // Scale shadow offset
            shadowOpacity={0.8}
          />
          <Text
            text={tooltipText}
            fontFamily="Arial"
            fontSize={Math.max(16 / scale, Math.min(22 / scale, (dimensions.width * 0.25) / scale))} // Further increased font size
            padding={12 / scale} // Further increased padding
            fill="white"
            align="center"
            width={Math.max(100 / scale, (tooltipText.length * 10) / scale)} // Further increased width
            listening={false}
          />
        </Label>
      )}
    </Group>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(Stall); 