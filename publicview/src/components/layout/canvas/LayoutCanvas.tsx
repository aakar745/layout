'use client';

import React, { useRef, useEffect, useState, useCallback, memo, useMemo } from 'react';
import { Stage, Layer, Line, Rect, Text, Group } from 'react-konva';
import { useLayoutStore } from '@/store/layoutStore';
import StallRenderer from './StallRenderer';
import HallRenderer from './HallRenderer';
import GridRenderer from './GridRenderer';
import AmenityRenderer from './AmenityRenderer';
import PathRenderer from './PathRenderer';
import FixtureRenderer from './FixtureRenderer';
import SelectionBox from './SelectionBox';
import { ViewportDimensions } from '@/lib/types/layout';
import Konva from 'konva';

// Canvas constants
const CANVAS_PADDING = 50;
const MIN_SCALE = 0.1;
const MAX_SCALE = 20; // Match old frontend max scale
const ZOOM_FACTOR = 1.15; // Match old frontend zoom factor

// Performance optimization constants
const VIEWPORT_CULLING_BUFFER = 100; // Extra pixels around viewport to render
const EVENT_THROTTLE_MS = 16; // ~60fps event throttling

// Viewport culling utilities
const isStallInViewport = (stall: any, viewportBounds: any, hallX = 0, hallY = 0) => {
  const stallLeft = (stall.dimensions.x || 0) + hallX;
  const stallTop = (stall.dimensions.y || 0) + hallY;
  const stallRight = stallLeft + (stall.dimensions.width || 0);
  const stallBottom = stallTop + (stall.dimensions.height || 0);
  
  return !(stallRight < viewportBounds.left || 
           stallLeft > viewportBounds.right ||
           stallBottom < viewportBounds.top ||
           stallTop > viewportBounds.bottom);
};

const LayoutCanvas = memo(function LayoutCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [viewport, setViewport] = useState<ViewportDimensions>({ width: 1200, height: 800 }); // Larger default to match container
  
  // Performance: throttling refs for event handling
  const lastUpdateTime = useRef<number>(0);
  
  const {
    layout,
    canvas,
    viewConfig,
    updateCanvasState,
    setScale,
    setPosition,
    selectStall,
    deselectStall,
    toggleStallSelection,
    setHoveredStall,
    clearSelection
  } = useLayoutStore();

  // Performance: Calculate viewport bounds for culling
  const viewportBounds = useMemo(() => {
    if (!viewport.width || !viewport.height || !canvas.scale) {
      return { left: -Infinity, top: -Infinity, right: Infinity, bottom: Infinity };
    }
    
    const buffer = VIEWPORT_CULLING_BUFFER;
    return {
      left: (-canvas.position.x - buffer) / canvas.scale,
      top: (-canvas.position.y - buffer) / canvas.scale, 
      right: (-canvas.position.x + viewport.width + buffer) / canvas.scale,
      bottom: (-canvas.position.y + viewport.height + buffer) / canvas.scale
    };
  }, [canvas.position.x, canvas.position.y, canvas.scale, viewport.width, viewport.height]);

  // Update viewport dimensions
  const updateViewport = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setViewport({
        width: rect.width,
        height: rect.height
      });
    }
  }, []);

  // Initialize and handle resize
  useEffect(() => {
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, [updateViewport]);

  // Auto-fit layout to canvas
  const fitToCanvas = useCallback(() => {
    if (!layout || !layout.dimensions || !viewport.width || !viewport.height) return;

    const layoutWidth = layout.dimensions.width;
    const layoutHeight = layout.dimensions.height;
    
    // Calculate scale to fit layout within viewport with padding
    const scaleX = (viewport.width - CANVAS_PADDING * 2) / layoutWidth;
    const scaleY = (viewport.height - CANVAS_PADDING * 2) / layoutHeight;
    let newScale = Math.min(scaleX, scaleY);
    
    // Clamp to reasonable bounds - allow more zoom than before
    newScale = Math.max(MIN_SCALE, Math.min(newScale, MAX_SCALE));
    
    // Center the layout in the viewport
    const centerX = (viewport.width - layoutWidth * newScale) / 2;
    const centerY = (viewport.height - layoutHeight * newScale) / 2;
    
    // Auto-fit completed
    
    setScale(newScale);
    setPosition({ x: centerX, y: centerY });
  }, [layout, viewport, setScale, setPosition]);

  // Auto-fit layout when first loaded or viewport size changes significantly
  useEffect(() => {
    if (layout && viewport.width && viewport.height) {
      // Auto-fit on initial load or significant viewport changes
      fitToCanvas();
    }
  }, [layout?.name, viewport.width, viewport.height, fitToCanvas]); // Trigger on layout change and viewport resize

  // Handle wheel zoom (Performance: throttled for smooth interaction)
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    
    // Performance: Throttle zoom events to ~60fps
    const now = performance.now();
    if (now - lastUpdateTime.current < EVENT_THROTTLE_MS) return;
    lastUpdateTime.current = now;
    
    const stage = stageRef.current;
    if (!stage) return;

    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const oldScale = canvas.scale;
    const newScale = e.evt.deltaY > 0 
      ? Math.max(oldScale / ZOOM_FACTOR, MIN_SCALE)
      : Math.min(oldScale * ZOOM_FACTOR, MAX_SCALE);

    if (newScale === oldScale) return;

    // Calculate new position to zoom toward pointer
    const mousePointTo = {
      x: (pointer.x - canvas.position.x) / oldScale,
      y: (pointer.y - canvas.position.y) / oldScale,
    };

    const newPosition = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };

    setScale(newScale);
    setPosition(newPosition);
  }, [canvas.scale, canvas.position, setScale, setPosition]);

  // Handle pan/drag
  const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target;
    setPosition({
      x: stage.x(),
      y: stage.y()
    });
  }, [setPosition]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+0 or Cmd+0 for fit to screen
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        fitToCanvas();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fitToCanvas]);

  // Handle background click (deselect all)
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only deselect if clicking on the stage background
    if (e.target === stageRef.current) {
      clearSelection();
    }
  }, [clearSelection]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          clearSelection();
          break;
        case '0':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            fitToCanvas();
          }
          break;
        case '+':
        case '=':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const newScale = Math.min(canvas.scale * ZOOM_FACTOR, MAX_SCALE);
            setScale(newScale);
          }
          break;
        case '-':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const newScale = Math.max(canvas.scale / ZOOM_FACTOR, MIN_SCALE);
            setScale(newScale);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas.scale, clearSelection, fitToCanvas, setScale]);

  if (!layout || !layout.halls || !Array.isArray(layout.halls)) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500 mb-2">No layout data available</p>
          <p className="text-xs text-gray-400">
            {!layout ? 'Layout not loaded' : `Invalid layout structure - halls: ${typeof layout.halls}`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={canvasRef}
      className="relative w-full bg-gray-50 overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ 
        height: 'min(80vh, 1000px)', // Match old frontend: 80% viewport height, max 1000px
        minHeight: '600px' // Minimum height for usability
      }}
    >
      <Stage
        ref={stageRef}
        width={viewport.width}
        height={viewport.height}
        x={canvas.position.x}
        y={canvas.position.y}
        scaleX={canvas.scale}
        scaleY={canvas.scale}
        draggable
        onWheel={handleWheel}
        onDragEnd={handleDragEnd}
        onClick={handleStageClick}
      >
        <Layer>
          {/* Exhibition Space Background */}
          {layout.dimensions && (
            <Group>
              <Rect
                x={0}
                y={0}
                width={layout.dimensions.width}
                height={layout.dimensions.height}
                fill="#ffffff"
                stroke="#d9d9d9"
                strokeWidth={1 / canvas.scale}
                shadowColor="rgba(0,0,0,0.1)"
                shadowBlur={10 / canvas.scale}
                shadowOffset={{ x: 0, y: 0 }}
                shadowOpacity={0.5}
                cornerRadius={4 / canvas.scale}
              />
              
              {/* Dimension label */}
              <Text
                text={`${layout.dimensions.width}m × ${layout.dimensions.height}m`}
                fontSize={14 / canvas.scale}
                fill="#666666"
                x={5}
                y={5}
              />
            </Group>
          )}

          {/* Background grid */}
          {viewConfig.showGrid && layout.dimensions && (
            <GridRenderer 
              width={layout.dimensions.width}
              height={layout.dimensions.height}
              scale={canvas.scale}
            />
          )}

          {/* Halls */}
          {layout.halls.map(hall => (
            <HallRenderer
              key={hall.id || hall._id || Math.random()}
              hall={hall}
              viewConfig={viewConfig}
              scale={canvas.scale}
            />
          ))}

          {/* Paths */}
          {layout.halls.map(hall => 
            (hall.paths || []).map(path => (
              <PathRenderer
                key={path._id || Math.random()}
                path={path}
                viewConfig={viewConfig}
              />
            ))
          )}

          {/* Stalls (Performance: Only render visible stalls) */}
          {layout.halls.map(hall =>
            (hall.stalls || [])
              .filter(stall => {
                // Performance: Viewport culling - only render visible stalls
                const hallX = hall.dimensions.x || 0;
                const hallY = hall.dimensions.y || 0;
                return isStallInViewport(stall, viewportBounds, hallX, hallY);
              })
              .map(stall => {
                // Use consistent ID: backend always provides 'id' field
                const stallId = stall.id || stall._id || '';
                if (!stallId) {
                  console.warn('Stall missing ID:', stall);
                  return null;
                }
                
                // Use old frontend pattern - pass hall position to StallRenderer
                const hallX = hall.dimensions.x || 0;
                const hallY = hall.dimensions.y || 0;
                
                // Keep stall dimensions structure exactly like old frontend
                const stallWithDimensions = {
                  ...stall,
                  dimensions: {
                    ...stall.dimensions,
                    x: stall.position?.x || stall.dimensions?.x || 0,
                    y: stall.position?.y || stall.dimensions?.y || 0
                  }
                };
                
                return (
                  <StallRenderer
                    key={stallId}
                    stall={stallWithDimensions}
                    isSelected={canvas.selectedStalls.includes(stallId)}
                    isHovered={canvas.hoveredStall === stallId}
                    viewConfig={viewConfig}
                    onSelect={toggleStallSelection}
                    onHover={setHoveredStall}
                    scale={canvas.scale}
                    hallX={hallX}
                    hallY={hallY}
                  />
                );
              })
          )}

          {/* Amenities */}
          {layout.halls.map(hall =>
            (hall.amenities || []).map(amenity => (
              <AmenityRenderer
                key={amenity.id || amenity._id || Math.random()}
                amenity={amenity}
                viewConfig={viewConfig}
              />
            ))
          )}

          {/* Fixtures */}
          {(layout.fixtures || []).map(fixture => (
            <FixtureRenderer
              key={fixture.id || fixture._id || Math.random()}
              fixture={fixture}
              viewConfig={viewConfig}
              scale={canvas.scale}
            />
          ))}

          {/* Selection box */}
          {canvas.isSelecting && canvas.selectionBox && (
            <SelectionBox selectionBox={canvas.selectionBox} />
          )}
        </Layer>
      </Stage>
      
      
      {/* Help text */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs text-gray-600 max-w-xs">
        <p className="font-medium mb-1">Navigation:</p>
        <p>• Mouse wheel: Zoom in/out</p>
        <p>• Drag: Pan around</p>
        <p>• Click stalls: Select/deselect</p>
        <p>• Ctrl+0: Fit to screen</p>
      </div>
    </div>
  );
});

export default LayoutCanvas;

