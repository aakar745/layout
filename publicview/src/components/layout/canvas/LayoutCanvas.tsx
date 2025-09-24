'use client';

import React, { useRef, useEffect, useState, useCallback, memo, useMemo } from 'react';
import { Stage, Layer, Line, Rect, Text, Group } from 'react-konva';
import { useLayoutStore } from '@/store/layoutStore';
import StallRenderer from './StallRenderer';
import HallRenderer from './HallRenderer';
import GridRenderer from './GridRenderer';
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
const DRAG_THROTTLE_MS = 8;   // Ultra-smooth drag throttling (120fps for drag operations)

// Performance monitoring (optional debug feature)
const ENABLE_PERF_MONITORING = process.env.NODE_ENV === 'development';

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
  const lastDragUpdateTime = useRef<number>(0);  // Separate throttling for drag events
  const isDragging = useRef<boolean>(false);
  const dragStartTime = useRef<number>(0);
  const pendingDragUpdate = useRef<boolean>(false);  // Prevent multiple drag updates
  
  // Mobile touch handling refs
  const lastTouchDistance = useRef<number>(0);
  const isMobile = useRef<boolean>(false);
  const touchStartTime = useRef<number>(0);
  
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

  // Export canvas as image function
  const exportCanvasAsImage = useCallback(async () => {
    if (!stageRef.current || !layout) return;

    const { updateViewConfig } = useLayoutStore.getState();
    const originalShowFixtures = viewConfig.showFixtures;

    try {
      // Get the stage
      const stage = stageRef.current;
      
      // Create filename with exhibition name and timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `layout-${layout.name || 'exhibition'}-${timestamp}.png`;
      
      try {
        // First attempt: Export with all elements
        const dataURL = stage.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          pixelRatio: 2, // Higher resolution for better quality
        });
        
        // Create download link
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Layout exported as ${filename}`);
        
      } catch (corsError) {
        // If CORS error, try again without fixtures (which may contain problematic images)
        console.warn('CORS error detected, attempting export without fixtures:', corsError);
        
        // Temporarily hide fixtures
        updateViewConfig({ showFixtures: false });
        
        // Wait for next frame to ensure re-render
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        // Try export again
        const dataURL = stage.toDataURL({
          mimeType: 'image/png',
          quality: 1,
          pixelRatio: 2,
        });
        
        // Restore fixtures visibility
        updateViewConfig({ showFixtures: originalShowFixtures });
        
        // Create download link
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`Layout exported as ${filename} (without fixtures due to CORS restrictions)`);
        alert('Layout exported successfully! Note: Some decorative elements were excluded due to security restrictions.');
      }
      
    } catch (error) {
      // Restore fixtures visibility in case of any error
      updateViewConfig({ showFixtures: originalShowFixtures });
      
      console.error('Failed to export layout:', error);
      alert('Failed to export layout. Please try again.');
    }
  }, [layout, viewConfig.showFixtures]);

  // Register export function globally for store access
  useEffect(() => {
    (window as any).__layoutCanvasExport = exportCanvasAsImage;
    
    // Cleanup on unmount
    return () => {
      delete (window as any).__layoutCanvasExport;
    };
  }, [exportCanvasAsImage]);

  // PERFORMANCE: Batch state updates to prevent multiple re-renders
  const updateCanvasTransform = useCallback((newScale: number, newPosition: { x: number; y: number }, isDragging?: boolean) => {
    requestAnimationFrame(() => {
      // Batch all canvas updates in a single call to prevent multiple re-renders
      updateCanvasState({
        scale: newScale,
        position: newPosition,
        ...(isDragging !== undefined && { isDragging })
      });
    });
  }, [updateCanvasState]);

  // Performance: Calculate viewport bounds for culling (Phase 3: Ultra-aggressive during interactions)
  const viewportBounds = useMemo(() => {
    if (!viewport.width || !viewport.height || !canvas.scale) {
      return { left: -Infinity, top: -Infinity, right: Infinity, bottom: Infinity };
    }
    
    // PERFORMANCE: Ultra-aggressive culling during interactions for 0-lag performance
    // Reduce buffer significantly during drag/zoom for mobile performance
    let buffer = VIEWPORT_CULLING_BUFFER;
    
    if (canvas.isDragging || isDragging.current) {
      // During drag: 80% less buffer for ultra-smooth performance 
      buffer = VIEWPORT_CULLING_BUFFER * 0.2;
    } else if (canvas.scale < 0.5) {
      // At low zoom: smaller buffer since objects are tiny anyway
      buffer = VIEWPORT_CULLING_BUFFER * 0.5;
    } else if (isMobile.current) {
      // Mobile: Always use smaller buffer for better performance
      buffer = VIEWPORT_CULLING_BUFFER * 0.7;
    }
    
    return {
      left: (-canvas.position.x - buffer) / canvas.scale,
      top: (-canvas.position.y - buffer) / canvas.scale, 
      right: (-canvas.position.x + viewport.width + buffer) / canvas.scale,
      bottom: (-canvas.position.y + viewport.height + buffer) / canvas.scale
    };
  }, [canvas.position.x, canvas.position.y, canvas.scale, canvas.isDragging, viewport.width, viewport.height]);

  // Performance: Monitor rendering statistics (development only)
  const performanceStats = useMemo(() => {
    if (!layout?.halls || !ENABLE_PERF_MONITORING) return null;
    
    const totalStalls = layout.halls.reduce((total, hall) => total + (hall.stalls?.length || 0), 0);
    const visibleStalls = layout.halls.reduce((total, hall) => {
      if (!hall.stalls) return total;
      const hallX = hall.dimensions.x || 0;
      const hallY = hall.dimensions.y || 0;
      return total + hall.stalls.filter(stall => 
        isStallInViewport(stall, viewportBounds, hallX, hallY)
      ).length;
    }, 0);
    
    const cullPercentage = totalStalls > 0 ? ((totalStalls - visibleStalls) / totalStalls * 100).toFixed(1) : 0;
    
    
    return { totalStalls, visibleStalls, cullPercentage };
  }, [layout?.halls, viewportBounds, canvas.scale]);

  // Mobile detection and viewport updates
  const updateViewport = useCallback(() => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      
      // Detect mobile device
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent) || 
                           'ontouchstart' in window || 
                           window.innerWidth <= 768;
      
      isMobile.current = isMobileDevice;
      
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

    // PERFORMANCE: Batch all updates in single call for ultra-smooth zoom
    updateCanvasTransform(newScale, newPosition);
  }, [canvas.scale, canvas.position, updateCanvasTransform]);

  // Phase 3: Enhanced drag handling for smooth performance with 1000+ stalls
  const handleDragStart = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    isDragging.current = true;
    dragStartTime.current = performance.now();
    
    // PERFORMANCE: Batch drag start state update
    updateCanvasTransform(canvas.scale, canvas.position, true);
  }, [canvas.scale, canvas.position, updateCanvasTransform]);

  const handleDragEnd = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
    const stage = e.target;
    const dragDuration = performance.now() - dragStartTime.current;
    
    isDragging.current = false;
    
    // PERFORMANCE: Batch all drag end updates in single call for ultra-smooth finish
    const newPosition = {
      x: stage.x(),
      y: stage.y()
    };
    
    updateCanvasTransform(canvas.scale, newPosition, false);

    // Performance monitoring for drag operations
  }, [canvas.scale, updateCanvasTransform]);

  // Mobile touch handlers for pinch-to-zoom
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: TouchList) => {
    if (touches.length === 0) return { x: 0, y: 0 };
    if (touches.length === 1) return { x: touches[0].clientX, y: touches[0].clientY };
    
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile.current) return;
    
    touchStartTime.current = performance.now();
    
    if (e.touches.length === 2) {
      // Two finger touch - prepare for pinch zoom
      e.preventDefault();
      lastTouchDistance.current = getTouchDistance(e.touches);
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isMobile.current || !stageRef.current) return;
    
    if (e.touches.length === 2) {
      // Two finger pinch-to-zoom
      e.preventDefault();
      
      // CRITICAL FIX: Throttle touch events to prevent lag
      const now = performance.now();
      if (now - lastUpdateTime.current < EVENT_THROTTLE_MS) return;
      lastUpdateTime.current = now;
      
      const currentDistance = getTouchDistance(e.touches);
      if (lastTouchDistance.current === 0) {
        lastTouchDistance.current = currentDistance;
        return;
      }

      const scaleChange = currentDistance / lastTouchDistance.current;
      const oldScale = canvas.scale;
      const newScale = Math.min(Math.max(oldScale * scaleChange, MIN_SCALE), MAX_SCALE);
      
      // PERFORMANCE: Skip if scale didn't change enough to matter
      if (Math.abs(newScale - oldScale) < 0.01) return;
      
      // Get touch center point
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const touchCenter = getTouchCenter(e.touches);
      const pointer = {
        x: touchCenter.x - rect.left,
        y: touchCenter.y - rect.top
      };

      // Calculate new position to zoom towards touch center
      const mousePointTo = {
        x: (pointer.x - canvas.position.x) / oldScale,
        y: (pointer.y - canvas.position.y) / oldScale,
      };

      const newPosition = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      // PERFORMANCE: Batch all touch updates in single call for ultra-smooth pinch-zoom
      updateCanvasTransform(newScale, newPosition);
      
      lastTouchDistance.current = currentDistance;
    }
  }, [canvas.scale, canvas.position, updateCanvasTransform]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isMobile.current) return;
    
    lastTouchDistance.current = 0;
    
    // Performance monitoring for touch operations
    if (ENABLE_PERF_MONITORING) {
      const touchDuration = performance.now() - touchStartTime.current;
    }
  }, []);

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

  // Setup touch event listeners for mobile pinch-to-zoom
  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    // Add touch event listeners with passive: false to prevent default
    canvasElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvasElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvasElement.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvasElement.removeEventListener('touchstart', handleTouchStart);
      canvasElement.removeEventListener('touchmove', handleTouchMove);
      canvasElement.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

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
      className="relative w-full bg-gray-50 overflow-hidden cursor-grab active:cursor-grabbing touch-pan-x touch-pan-y"
      style={{ 
        // Mobile-responsive height: adapt to screen size
        height: isMobile.current 
          ? 'min(70vh, 500px)' // Mobile: 70% viewport height, max 500px
          : 'min(80vh, 1000px)', // Desktop: 80% viewport height, max 1000px
        minHeight: isMobile.current ? '400px' : '600px', // Smaller min height for mobile
        // Prevent zoom on mobile browsers
        touchAction: 'none',
        // Disable text selection
        userSelect: 'none',
        WebkitUserSelect: 'none',
        // Optimize for mobile
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
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
        onDragStart={handleDragStart}
        onDragMove={useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
          // PERFORMANCE: Ultra-smooth drag with intelligent throttling
          const now = performance.now();
          if (now - lastDragUpdateTime.current < DRAG_THROTTLE_MS || pendingDragUpdate.current) return;
          
          lastDragUpdateTime.current = now;
          pendingDragUpdate.current = true;
          
          const stage = e.target;
          requestAnimationFrame(() => {
            // Only update position during drag, not full canvas state (for ultra-smooth performance)
            const newPosition = { x: stage.x(), y: stage.y() };
            updateCanvasState({ position: newPosition });
            pendingDragUpdate.current = false;
          });
        }, [])}
        onDragEnd={handleDragEnd}
        onClick={handleStageClick}
        // PERFORMANCE: Critical Konva performance settings for ultra-smooth interactions
        perfectDrawEnabled={false}        // Disable pixel-perfect drawing for speed
        clearBeforeDraw={true}            // Clear canvas before each frame for consistency
        imageSmoothingEnabled={false}     // Disable image smoothing for speed
      >
        <Layer
          // PERFORMANCE: Layer-specific optimizations for ultra-smooth rendering
          perfectDrawEnabled={false}
          clearBeforeDraw={true}
          imageSmoothingEnabled={false}
          listening={!canvas.isDragging}  // Disable event listening during drag for speed
        >
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

          {/* Phase 3: Batch Rendering by Status for 1000+ stalls */}
          {useMemo(() => {
            // Get all visible stalls first
            const visibleStalls = layout.halls.flatMap(hall => {
              const hallX = hall.dimensions.x || 0;
              const hallY = hall.dimensions.y || 0;
              
              return (hall.stalls || [])
                .filter(stall => isStallInViewport(stall, viewportBounds, hallX, hallY))
                .map(stall => ({
                  ...stall,
                  hallX,
                  hallY,
                  stallId: stall.id || stall._id || '',
                  dimensions: {
                    ...stall.dimensions,
                    x: stall.position?.x || stall.dimensions?.x || 0,
                    y: stall.position?.y || stall.dimensions?.y || 0
                  }
                }))
                .filter(stall => stall.stallId); // Remove invalid stalls
            });

            // MOBILE PERFORMANCE: Limit stalls during touch interactions for 0-lag
            const maxStallsForSmoothInteraction = isMobile.current ? 500 : 1000;
            const isInteracting = canvas.isDragging || isDragging.current;
            
            const finalStalls = isInteracting && visibleStalls.length > maxStallsForSmoothInteraction
              ? visibleStalls
                  .slice(0, maxStallsForSmoothInteraction)
                  .concat(
                    // Always include selected stalls even during interaction
                    visibleStalls
                      .slice(maxStallsForSmoothInteraction)
                      .filter(stall => canvas.selectedStalls.includes(stall.stallId))
                  )
              : visibleStalls;

            // Phase 3: Batch by status for better GPU utilization
            const stallBatches = {
              available: [] as any[],
              booked: [] as any[],
              reserved: [] as any[],
              unavailable: [] as any[]
            };

            finalStalls.forEach(stall => {
              if (stallBatches[stall.status as keyof typeof stallBatches]) {
                stallBatches[stall.status as keyof typeof stallBatches].push(stall);
              }
            });

            // Render batches in optimal order (available first for better UX)
            return ['available', 'booked', 'reserved', 'unavailable'].flatMap(status =>
              stallBatches[status as keyof typeof stallBatches].map(stall => (
                <StallRenderer
                  key={stall.stallId}
                  stall={stall}
                  isSelected={canvas.selectedStalls.includes(stall.stallId)}
                  isHovered={canvas.hoveredStall === stall.stallId}
                  viewConfig={viewConfig}
                  onSelect={toggleStallSelection}
                  onHover={setHoveredStall}
                  scale={canvas.scale}
                  hallX={stall.hallX}
                  hallY={stall.hallY}
                  // Phase 3: Simplified interactions at distance
                  allowInteractions={canvas.scale > 0.3}
                />
              ))
            );
          }, [
            layout.halls, 
            viewportBounds, 
            canvas.selectedStalls, 
            canvas.hoveredStall, 
            canvas.scale, 
            canvas.isDragging,  // PERFORMANCE: Only recalculate stalls when drag state changes
            viewConfig, 
            toggleStallSelection, 
            setHoveredStall
          ])}

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
      
      
      {/* Help text - Mobile adaptive */}
      <div className="absolute bottom-2 lg:bottom-4 left-2 lg:left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 lg:p-3 text-xs text-gray-600 max-w-xs">
        <p className="font-medium mb-1">Navigation:</p>
        {isMobile.current ? (
          <>
            <p>• Pinch: Zoom in/out</p>
            <p>• Drag: Pan around</p>
            <p>• Tap stalls: Select</p>
          </>
        ) : (
          <>
            <p>• Mouse wheel: Zoom in/out</p>
            <p>• Drag: Pan around</p>
            <p>• Click stalls: Select/deselect</p>
            <p>• Ctrl+0: Fit to screen</p>
          </>
        )}
      </div>
    </div>
  );
});

export default LayoutCanvas;

