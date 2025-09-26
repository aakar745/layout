import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { Group, Rect, Text, Circle, Label, Tag } from 'react-konva';
import { Stall as StallType } from '../../../services/exhibition';
import Konva from 'konva';
import StallRenderer from '../layout/StallRenderer';
import { calculateStallArea } from '../../../utils/stallUtils';

// Phase 2: Level-of-Detail (LOD) thresholds for performance optimization
const LOD_THRESHOLDS = {
  HIGH_DETAIL: 0.8,     // Full detail - shadows, perfect text, all effects
  MEDIUM_DETAIL: 0.4,   // Medium detail - text visible, reduced shadows  
  LOW_DETAIL: 0.2,      // Low detail - basic shapes only
  MINIMAL_DETAIL: 0.1   // Minimal - simple rectangles, no text
};

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
  
  // PERFORMANCE: Cache mobile detection to prevent repeated calculations  
  const isMobileDevice = useMemo(() => {
    return typeof window !== 'undefined' && 
      (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(navigator.userAgent.toLowerCase()) || 
       'ontouchstart' in window || 
       window.innerWidth <= 768);
  }, []);

  // Phase 2: Determine Level-of-Detail based on current scale (Mobile optimized)
  const lodLevel = useMemo(() => {
    // Mobile gets more aggressive LOD to maintain 60fps
    const thresholds = isMobileDevice ? {
      HIGH_DETAIL: 1.2,     // Mobile: Higher threshold for high detail
      MEDIUM_DETAIL: 0.6,   // Mobile: Higher threshold for medium detail  
      LOW_DETAIL: 0.3,      // Mobile: Higher threshold for low detail
      MINIMAL_DETAIL: 0.1   // Same minimal threshold
    } : LOD_THRESHOLDS;
    
    if (scale >= thresholds.HIGH_DETAIL) return 'HIGH';
    if (scale >= thresholds.MEDIUM_DETAIL) return 'MEDIUM';
    if (scale >= thresholds.LOW_DETAIL) return 'LOW';
    return 'MINIMAL';
  }, [scale, isMobileDevice]);

  // Performance: LOD-based feature flags
  const shouldShowText = lodLevel !== 'MINIMAL';
  const shouldShowShadows = lodLevel === 'HIGH' || lodLevel === 'MEDIUM';
  const shouldShowTooltips = lodLevel !== 'MINIMAL' && !isLargeDataset;
  const allowInteractions = scale > 0.3; // Phase 3: Simplified interactions at distance

  // Detect mobile for optimizations - only when needed
  useEffect(() => {
    if (isLargeDataset) return; // Skip unnecessary effects for large datasets
    
    setIsMobile(isMobileDevice);
  }, [isLargeDataset, isMobileDevice]);
  
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
  
  // Phase 3: Simplified interactions at distance for smooth performance  
  const handleMouseEnter = useCallback(() => {
    if (!allowInteractions) return; // Skip interactions when zoomed out
    if (isLargeDataset) return; // Disable hover for large datasets
    if ((isMobile && !isStallSelected) || isDragging) return;
    setIsHovered(true);
  }, [allowInteractions, isLargeDataset, isMobile, isStallSelected, isDragging]);
  
  const handleMouseLeave = useCallback(() => {
    if (!allowInteractions) return; // Skip interactions when zoomed out
    if (isLargeDataset) return; // Disable hover for large datasets
    setIsHovered(false);
  }, [allowInteractions, isLargeDataset]);

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
      cursor={stall.status === 'available' && allowInteractions ? 'pointer' : 'default'}
      onMouseEnter={allowInteractions ? handleMouseEnter : undefined}
      onMouseLeave={allowInteractions ? handleMouseLeave : undefined}
      listening={allowInteractions} // Phase 3: Disable listening when interactions not allowed
      transformsEnabled={isDragging ? 'position' : (isMobile ? 'position' : 'all')} // Simplify transforms during drag
    >
      <StallRenderer
        dimensions={dimensions}
        fill={isStallSelected ? "rgba(24, 144, 255, 0.1)" : getStatusFillColor(stall.status)}
        stroke={isStallSelected ? "#1890ff" : getStatusColor(stall.status)}
        strokeWidth={isStallSelected ? 2 / scale : 1 / scale}
        // Phase 2: More aggressive shadow culling for better performance
        shadowColor={shouldShowShadows && scale > 0.8 ? "rgba(0,0,0,0.1)" : undefined}
        shadowBlur={shouldShowShadows && scale > 0.8 ? 3 : 0}
        shadowOffset={shouldShowShadows && scale > 0.8 ? { x: 1, y: 1 } : undefined}
        shadowOpacity={shouldShowShadows && scale > 0.8 ? 0.3 : 0}
        rotation={stallRotation}
        perfectDrawEnabled={false} // Phase 1: Disable pixel-perfect drawing (invisible difference)
        transformsEnabled={isDragging ? 'position' : 'all'} // Simplify transforms during drag
        cornerRadius={0.05} // Sharp rectangles for performance
      />
      {/* Phase 2: Stall number text (only show when readable and enabled) */}
      {shouldShowText && (
        <Text
          text={stall.number}
          fontSize={Math.min(dimensions.width, dimensions.height) * 0.25}
          fill="#000000"
          width={dimensions.width}
          height={dimensions.height}
          align="center"
          verticalAlign="middle"
          fontStyle="bold"
          listening={false} // Performance: Text doesn't need event listeners
        />
      )}
      
      {/* Selection indicator (always show when selected for UX) */}
      {isStallSelected && (
        <Circle
          x={dimensions.width - 2}
          y={2}
          radius={Math.min(0.8, dimensions.width * 0.05)}
          fill="#1890ff"
          stroke="#ffffff"
          strokeWidth={0.2 / scale}
          listening={false} // Performance: Selection indicator doesn't need events
        />
      )}

      {/* Phase 2: Tooltip (only show when scale allows) */}
      {tooltipVisible && shouldShowTooltips && (
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
            fontSize={Math.max(16 / scale, Math.min(22 / scale, (dimensions.width * 0.25) / scale))}
            padding={12 / scale}
            fill="white"
            align="center"
            width={Math.max(100 / scale, (tooltipText.length * 10) / scale)}
            listening={false} // Performance: Tooltip text doesn't need events
          />
        </Label>
      )}
    </Group>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(Stall); 