'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Rect, Text, Group, Label, Tag, Circle } from 'react-konva';
import { Stall, LayoutViewConfig } from '@/lib/types/layout';
import { useAuthStore } from '@/store/authStore';

// Performance: Level-of-Detail (LOD) thresholds
const LOD_THRESHOLDS = {
  HIGH_DETAIL: 0.8,     // Full detail - shadows, perfect text, all effects
  MEDIUM_DETAIL: 0.4,   // Medium detail - text visible, reduced shadows  
  LOW_DETAIL: 0.2,      // Low detail - basic shapes only
  MINIMAL_DETAIL: 0.1   // Minimal - simple rectangles, no text
};

interface StallRendererProps {
  stall: Stall;
  isSelected: boolean;
  isHovered: boolean;
  viewConfig: LayoutViewConfig;
  onSelect: (stallId: string) => void;
  onHover: (stallId: string | null) => void;
  scale?: number;
  hallX?: number;
  hallY?: number;
}

// Exact colors from old frontend
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

export default function StallRenderer({ 
  stall, 
  isSelected, 
  isHovered, 
  viewConfig, 
  onSelect, 
  onHover, 
  scale = 1,
  hallX = 0,
  hallY = 0
}: StallRendererProps) {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const { isAuthenticated, openLoginModal } = useAuthStore();

  // Use exact old frontend logic
  const isStallSelected = isSelected;
  const dimensions = stall.dimensions;

  // Performance: Determine Level-of-Detail based on current scale
  const lodLevel = useMemo(() => {
    if (scale >= LOD_THRESHOLDS.HIGH_DETAIL) return 'HIGH';
    if (scale >= LOD_THRESHOLDS.MEDIUM_DETAIL) return 'MEDIUM';
    if (scale >= LOD_THRESHOLDS.LOW_DETAIL) return 'LOW';
    return 'MINIMAL';
  }, [scale]);

  // Performance: LOD-based feature flags
  const shouldShowText = lodLevel !== 'MINIMAL';
  const shouldShowShadows = lodLevel === 'HIGH' || lodLevel === 'MEDIUM';
  const shouldShowTooltips = lodLevel !== 'MINIMAL'; // Keep tooltips even at low detail for UX
  const shouldShowSelection = isStallSelected; // Always show selection for UX

  // Handle interactions - matching old frontend exactly
  const handleClick = useCallback(() => {
    const stallId = stall.id || stall._id || '';
    
    // Check if stall is available
    if (stall.status !== 'available' || !stallId) {
      if (stall.status === 'booked') {
        console.log(`Stall ${stall.stallNumber} is already booked.`);
      }
      return;
    }

    // Check if user is authenticated (matching old frontend logic)
    if (!isAuthenticated) {
      // Show the login modal with stall booking context
      openLoginModal('stall-booking');
      return;
    }

    // User is authenticated and stall is available - proceed with selection
    onSelect(stallId);
  }, [stall.id, stall._id, stall.status, stall.stallNumber, isAuthenticated, openLoginModal, onSelect]);

  const handleMouseEnter = useCallback(() => {
    const stallId = stall.id || stall._id || '';
    onHover(stallId);
    setTooltipVisible(true);
  }, [stall.id, stall._id, onHover]);

  const handleMouseLeave = useCallback(() => {
    onHover(null);
    setTooltipVisible(false);
  }, [onHover]);

  // Calculate stall area exactly like old frontend
  const calculateStallArea = () => {
    if (dimensions.shapeType === 'l-shape' && dimensions.lShape) {
      const lShape = dimensions.lShape;
      return (lShape.rect1Width * lShape.rect1Height) + (lShape.rect2Width * lShape.rect2Height);
    }
    return dimensions.width * dimensions.height;
  };

  // Tooltip text exactly like old frontend
  const tooltipText = useMemo(() => {
    const area = calculateStallArea();
    const shapeInfo = dimensions.shapeType === 'l-shape' 
      ? `L-Shape (${area.toFixed(1)} sqm)`
      : `${dimensions.width}m x ${dimensions.height}m`;
    
    const stallType = stall.type || 'Standard';
    
    // Create comprehensive tooltip text based on stall status
    let tooltip = `Stall ${stall.stallNumber} - ${stallType} - ${shapeInfo}`;
    
    // Add status information
    const statusText = stall.status.charAt(0).toUpperCase() + stall.status.slice(1);
    tooltip += ` - ${statusText}`;
    
    // Add company information for booked/reserved stalls
    if (stall.status === 'booked' || stall.status === 'reserved') {
      const companyName = stall.companyName || stall.bookingInfo?.companyName || stall.bookingInfo?.exhibitorName;
      if (companyName) {
        tooltip += ` by ${companyName}`;
      }
    }
    
    // Add price information for available stalls
    if (stall.status === 'available' && stall.price) {
      tooltip += ` - ₹${stall.price.toLocaleString()}`;
    }
    
    return tooltip;
  }, [dimensions, stall.stallNumber, stall.type, stall.status, stall.companyName, stall.bookingInfo, stall.price]);

  // Simple shape renderer exactly like old frontend StallRenderer
  const renderStallShape = () => {
    const shapeType = dimensions.shapeType || 'rectangle';
    const fill = isStallSelected ? "rgba(24, 144, 255, 0.1)" : getStatusFillColor(stall.status);
    const stroke = isStallSelected ? "#1890ff" : getStatusColor(stall.status);
    const strokeWidth = isStallSelected ? 2 / scale : 1 / scale;

    if (shapeType === 'rectangle') {
      return (
        <Rect
          width={dimensions.width}
          height={dimensions.height}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          // Performance: Conditional shadows based on LOD
          shadowColor={shouldShowShadows ? "rgba(0,0,0,0.1)" : undefined}
          shadowBlur={shouldShowShadows ? 3 : 0}
          shadowOffset={shouldShowShadows ? { x: 1, y: 1 } : undefined}
          shadowOpacity={shouldShowShadows ? 0.3 : 0}
          rotation={0}
          perfectDrawEnabled={false} // Performance: Disable pixel-perfect drawing (invisible difference)
          cornerRadius={0.05} // Sharp rectangles like old frontend!
        />
      );
    }

    if (shapeType === 'l-shape' && dimensions.lShape) {
      const { rect1Width, rect1Height, rect2Width, rect2Height, orientation } = dimensions.lShape;
      
      // Calculate positions for L-shape rectangles (same logic as old frontend)
      let rect1X = 0, rect1Y = 0, rect2X = 0, rect2Y = 0;
      
      switch (orientation) {
        case 'top-left':
          rect1X = 0; rect1Y = 0;
          rect2X = rect1Width; rect2Y = 0;
          break;
        case 'top-right':
          rect1X = rect2Width; rect1Y = 0;
          rect2X = 0; rect2Y = 0;
          break;
        case 'bottom-left':
          rect1X = 0; rect1Y = 0;
          rect2X = rect1Width; rect2Y = rect1Height - rect2Height;
          break;
        case 'bottom-right':
          rect1X = rect2Width - rect1Width; rect1Y = 0;
          rect2X = 0; rect2Y = rect1Height;
          break;
        default:
          rect1X = 0; rect1Y = rect2Height;
          rect2X = rect1Width; rect2Y = 0;
          break;
      }
      
      return (
        <Group>
          <Rect
            x={rect1X} y={rect1Y}
            width={rect1Width} height={rect1Height}
            fill={fill} stroke={stroke} strokeWidth={strokeWidth}
            // Performance: Conditional shadows based on LOD
            shadowColor={shouldShowShadows ? "rgba(0,0,0,0.1)" : undefined}
            shadowBlur={shouldShowShadows ? 3 : 0}
            shadowOffset={shouldShowShadows ? { x: 1, y: 1 } : undefined}
            shadowOpacity={shouldShowShadows ? 0.3 : 0}
            rotation={0} perfectDrawEnabled={false} // Performance: Disable pixel-perfect drawing (invisible difference)
            cornerRadius={0.05}
          />
          <Rect
            x={rect2X} y={rect2Y}
            width={rect2Width} height={rect2Height}
            fill={fill} stroke={stroke} strokeWidth={strokeWidth}
            // Performance: Conditional shadows based on LOD
            shadowColor={shouldShowShadows ? "rgba(0,0,0,0.1)" : undefined}
            shadowBlur={shouldShowShadows ? 3 : 0}
            shadowOffset={shouldShowShadows ? { x: 1, y: 1 } : undefined}
            shadowOpacity={shouldShowShadows ? 0.3 : 0}
            rotation={0} perfectDrawEnabled={false} // Performance: Disable pixel-perfect drawing (invisible difference)
            cornerRadius={0.05}
          />
        </Group>
      );
    }

    // Fallback to rectangle
    return (
      <Rect
        width={dimensions.width}
        height={dimensions.height}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        // Performance: Conditional shadows based on LOD
        shadowColor={shouldShowShadows ? "rgba(0,0,0,0.1)" : undefined}
        shadowBlur={shouldShowShadows ? 3 : 0}
        shadowOffset={shouldShowShadows ? { x: 1, y: 1 } : undefined}
        shadowOpacity={shouldShowShadows ? 0.3 : 0}
        rotation={0}
        perfectDrawEnabled={false} // Performance: Disable pixel-perfect drawing (invisible difference)
        cornerRadius={0.05}
      />
    );
  };

  return (
    <Group
      x={(dimensions.x || 0) + hallX}
      y={(dimensions.y || 0) + hallY}
      width={dimensions.width}
      height={dimensions.height}
      opacity={stall.status === 'available' ? 1 : 0.7}
      cursor={stall.status === 'available' ? 'pointer' : 'default'}
      onClick={stall.status === 'available' ? handleClick : undefined}
      onTap={stall.status === 'available' ? handleClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      listening={true} // Always listen for hover events to show tooltips
    >
      {/* Shape renderer (exactly like old frontend) */}
      {renderStallShape()}
      
      {/* Stall number text (Performance: Only show when readable) */}
      {shouldShowText && (
        <Text
          text={stall.stallNumber}
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
      
      {/* Selection indicator (exactly like old frontend) */}
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

      {/* Tooltip (Performance: Only show when scale allows) */}
      {tooltipVisible && shouldShowTooltips && (
        <Label
          x={dimensions.width / 2}
          y={-5 / scale}
          opacity={0.9}
          listening={false} // Performance: Tooltip doesn't need events
        >
          <Tag
            fill="#333"
            cornerRadius={3 / scale}
            pointerDirection="down"
            pointerWidth={6 / scale}
            pointerHeight={4 / scale}
            shadowColor="rgba(0,0,0,0.3)"
            shadowBlur={2 / scale}
            shadowOffset={{ x: 1 / scale, y: 1 / scale }}
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
}
