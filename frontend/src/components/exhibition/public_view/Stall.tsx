import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
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
  isDragging?: boolean;
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
  isDragging = false
}) => {
  const shapeRef = useRef<Konva.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile for optimizations
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Optimize tooltip visibility with debouncing
  useEffect(() => {
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
  }, [isHovered, isDragging]);

  // Optimize top layer management
  useEffect(() => {
    if (isHovered && shapeRef.current && !isDragging) {
      // Skip during dragging for better performance
      // On mobile, only move to top if actually selected
      if (isMobile && !isSelected) return;
      
      const stage = shapeRef.current.getStage();
      if (stage) {
        shapeRef.current.moveToTop();
      }
    }
  }, [isHovered, isSelected, isMobile, isDragging]);

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

  const handleDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
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
  }, [hallX, hallY, hallWidth, hallHeight, stall.dimensions.width, stall.dimensions.height]);

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
  }, [onChange, hallX, hallY, hallWidth, hallHeight, stall]);

  const handleDragStart = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
  }, []);

  const handleClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    if (onSelect && !isDragging) {
      onSelect();
    }
  }, [onSelect, isDragging]);
  
  // Optimize hover behavior especially for mobile
  const handleMouseEnter = useCallback(() => {
    if ((isMobile && !isStallSelected) || isDragging) return;
    setIsHovered(true);
  }, [isMobile, isStallSelected, isDragging]);
  
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

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
  
  const price = stall.ratePerSqm * dimensions.width * dimensions.height;

  // Always reset rotation to 0 regardless of what's passed in
  const stallRotation = 0;
  
  // Optimize tooltip content with memoization
  const tooltipText = useMemo(() => {
    return stall.status !== 'available' && stall.companyName 
      ? `${stallType} - ${dimensions.width}×${dimensions.height}m - ${stall.companyName}`
      : `${stallType} - ${dimensions.width}×${dimensions.height}m`;
  }, [stallType, dimensions.width, dimensions.height, stall.status, stall.companyName]);

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
      <Rect
        width={dimensions.width}
        height={dimensions.height}
        fill={isStallSelected ? "rgba(24, 144, 255, 0.1)" : getStatusFillColor(stall.status)}
        stroke={isStallSelected ? "#1890ff" : getStatusColor(stall.status)}
        strokeWidth={isStallSelected ? 2 / scale : 1 / scale}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={isDragging ? 0 : (isMobile ? 2 : 3)} // Disable shadows during dragging for better performance
        shadowOffset={{ x: 1, y: 1 }}
        shadowOpacity={isDragging ? 0 : 0.3} // Disable shadows during dragging
        rotation={stallRotation}
        perfectDrawEnabled={!isDragging} // Disable perfect drawing during dragging
        transformsEnabled={isDragging ? 'position' : 'all'} // Simplify transforms during drag
        cornerRadius={0.05} // Slight corner rounding for better appearance
      />
      <Text
        text={stall.number}
        fontSize={Math.min(dimensions.width, dimensions.height) * 0.25}
        fill="#000000"
        width={dimensions.width}
        height={dimensions.height}
        align="center"
        verticalAlign="middle"
        transformsEnabled="position"
        perfectDrawEnabled={!isDragging} // Disable perfect drawing during dragging
        fontStyle="bold" // Make text more readable
        listening={false} // Text doesn't need to listen for events
      />
      
      {/* Only show selection indicator when not dragging */}
      {isStallSelected && !isDragging && (
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

      {/* Only show tooltip when not dragging */}
      {tooltipVisible && !isDragging && (
        <Label
          x={dimensions.width / 2}
          y={0}
          opacity={1}
          listening={false} // Label doesn't need to listen for events
        >
          <Tag
            fill="rgba(0, 0, 0, 1.0)"
            cornerRadius={0.5}
            pointerDirection="down"
            pointerWidth={4}
            pointerHeight={2}
            lineJoin="round"
            y={-7}
            listening={false} // Tag doesn't need to listen for events
          />
          <Text
            text={tooltipText}
            fontSize={1.2}
            fill="#ffffff"
            align="center"
            padding={2}
            y={-7}
            offsetY={0}
            width={Math.max(
              tooltipText.length * 0.7,
              25
            )}
            height={3}
            verticalAlign="middle"
            listening={false} // Text doesn't need to listen for events
          />
        </Label>
      )}
    </Group>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(Stall); 