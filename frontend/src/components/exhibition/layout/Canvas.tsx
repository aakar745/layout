import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Stage, Layer, FastLayer } from 'react-konva';
import { Button, Space } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';
import { Hall as HallType, Fixture as FixtureType, Stall as StallType } from '../../../services/exhibition';
import ExhibitionSpace from './ExhibitionSpace';
import ExhibitionSpaceForm from './ExhibitionSpaceForm';
import Hall from './Hall';
import Fixture from './Fixture';
import LayoutContextMenu from './LayoutContextMenu';
import Stall from '../public_view/Stall';
import { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';

interface CanvasProps {
  width: number;   // Canvas width in pixels
  height: number;  // Canvas height in pixels
  exhibitionWidth: number;  // Exhibition space width in meters
  exhibitionHeight: number; // Exhibition space height in meters
  halls?: HallType[];
  stalls?: StallType[];
  fixtures?: FixtureType[];
  selectedHall?: HallType | null;
  selectedFixture?: FixtureType | null;
  onSelectHall?: (hall: HallType | null) => void;
  onSelectFixture?: (fixture: FixtureType | null) => void;
  onHallChange?: (hall: HallType) => void;
  onFixtureChange?: (fixture: FixtureType) => void;
  onExhibitionChange?: (dimensions: { width: number; height: number }) => void;
  onAddHall?: () => void;
  onAddStall?: () => void;
  onAddFixture?: () => void;
  children?: React.ReactNode;
  isStallMode?: boolean;
  isFixtureMode?: boolean;
  isPublicView?: boolean; // Flag for public view optimizations
}

interface CanvasChildProps {
  scale: number;
  position: { x: number; y: number };
}

const Canvas: React.FC<CanvasProps> = ({
  width,
  height,
  exhibitionWidth = 100,
  exhibitionHeight = 100,
  halls = [],
  stalls = [],
  fixtures = [],
  selectedHall = null,
  selectedFixture = null,
  onSelectHall = () => {},
  onSelectFixture = () => {},
  onHallChange = () => {},
  onFixtureChange = () => {},
  onExhibitionChange = () => {},
  onAddHall = () => {},
  onAddStall = () => {},
  onAddFixture = () => {},
  children,
  isStallMode = false,
  isFixtureMode = false,
  isPublicView = false
}) => {
  const stageRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const fastLayerRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isStageHovered, setIsStageHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });
  const [isExhibitionSelected, setIsExhibitionSelected] = useState(false);
  const [isExhibitionFormVisible, setIsExhibitionFormVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [originalPixelRatio, setOriginalPixelRatio] = useState<number | undefined>(undefined);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Calculate which elements are visible in the current viewport
  const getVisibleBounds = useCallback(() => {
    if (!stageRef.current) return null;
    
    const stage = stageRef.current;
    const transform = stage.getAbsoluteTransform().copy().invert();
    
    // Get stage bounds in world coordinates
    const topLeft = transform.point({ x: 0, y: 0 });
    const bottomRight = transform.point({ 
      x: stage.width(), 
      y: stage.height() 
    });
    
    // Add padding for smooth scrolling
    const padding = Math.max(exhibitionWidth, exhibitionHeight) * 0.1;
    
    return {
      left: topLeft.x - padding,
      top: topLeft.y - padding,
      right: bottomRight.x + padding,
      bottom: bottomRight.y + padding
    };
  }, [exhibitionWidth, exhibitionHeight]);

  // Check if an element is visible in the viewport
  const isElementVisible = useCallback((x: number, y: number, width: number, height: number) => {
    const bounds = getVisibleBounds();
    if (!bounds) return true; // Render all if bounds can't be calculated
    
    return !(
      x + width < bounds.left ||
      x > bounds.right ||
      y + height < bounds.top ||
      y > bounds.bottom
    );
  }, [getVisibleBounds]);

  // Memoize visible stalls calculation
  const visibleStalls = useMemo(() => {
    if (!stalls || stalls.length === 0) return stalls;
    
    // For stall manager mode with many stalls, use viewport culling
    if (isStallMode && stalls.length > 50) {
      return stalls.filter(stall => {
        const hall = halls.find(h => h.id === stall.hallId || h._id === stall.hallId);
        if (!hall) return false;
        
        const x = hall.dimensions.x + stall.dimensions.x;
        const y = hall.dimensions.y + stall.dimensions.y;
        
        return isElementVisible(x, y, stall.dimensions.width, stall.dimensions.height);
      });
    }
    
    return stalls;
  }, [stalls, halls, isStallMode, isElementVisible]);

  // Optimize rendering for large datasets
  const shouldOptimizeForLargeDataset = stalls?.length > 100;

  // Update viewport visibility on transform changes
  const [, forceUpdate] = useState({});
  const updateViewport = useCallback(() => {
    if (shouldOptimizeForLargeDataset) {
      forceUpdate({});
    }
  }, [shouldOptimizeForLargeDataset]);

  // Debounced viewport update
  const debouncedUpdateViewport = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateViewport, 100);
      };
    })(),
    [updateViewport]
  );

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    if (!stageRef.current) return;

    const stage = stageRef.current;
    const oldScale = scale;
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const scaleBy = 1.15;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const limitedScale = Math.min(Math.max(0.1, newScale), 20);

    const newPos = {
      x: pointer.x - mousePointTo.x * limitedScale,
      y: pointer.y - mousePointTo.y * limitedScale,
    };

    setScale(limitedScale);
    setPosition(newPos);
    
    // Update viewport for culling
    debouncedUpdateViewport();
  }, [scale, debouncedUpdateViewport]);

  const handleZoomIn = useCallback(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const newScale = Math.min(scale * 1.15, 20);
    
    const centerX = stage.width() / 2;
    const centerY = stage.height() / 2;
    
    const pointTo = {
      x: (centerX - position.x) / scale,
      y: (centerY - position.y) / scale,
    };

    const newPos = {
      x: centerX - pointTo.x * newScale,
      y: centerY - pointTo.y * newScale,
    };
    
    setScale(newScale);
    setPosition(newPos);
    
    // Update viewport for culling
    debouncedUpdateViewport();
  }, [scale, position, debouncedUpdateViewport]);

  const handleZoomOut = useCallback(() => {
    if (!stageRef.current) return;
    const stage = stageRef.current;
    const newScale = Math.max(scale / 1.15, 0.1);
    
    const centerX = stage.width() / 2;
    const centerY = stage.height() / 2;
    
    const pointTo = {
      x: (centerX - position.x) / scale,
      y: (centerY - position.y) / scale,
    };

    const newPos = {
      x: centerX - pointTo.x * newScale,
      y: centerY - pointTo.y * newScale,
    };
    
    setScale(newScale);
    setPosition(newPos);
    
    // Update viewport for culling
    debouncedUpdateViewport();
  }, [scale, position, debouncedUpdateViewport]);

  const optimizeForDragging = useCallback((enable: boolean) => {
    if (enable) {
      setOriginalPixelRatio(Konva.pixelRatio);
      Konva.pixelRatio = isMobile ? 0.8 : 1;
    } else if (originalPixelRatio) {
      Konva.pixelRatio = originalPixelRatio;
    }
  }, [originalPixelRatio, isMobile]);

  const handleDragStart = useCallback((e: any) => {
    if (e.target === stageRef.current) {
      setContextMenu({ ...contextMenu, visible: false });
      setIsDragging(true);
      
      optimizeForDragging(true);
      
      if (layerRef.current) {
        if (isPublicView) {
          const cacheConfig = isMobile ? 
            { x: -10, y: -10, width: width + 20, height: height + 20 } : 
            undefined;
          layerRef.current.cache(cacheConfig);
        }
        
        layerRef.current.hitGraphEnabled(false);
        
        if (isPublicView) {
          if (stageRef.current) {
            const container = stageRef.current.container();
            container.style.cursor = 'grabbing';
            container.classList.add('dragging');
            
            stageRef.current.batchDraw();
            
            const nodes = layerRef.current.getChildren();
            nodes.forEach((node: any) => {
              if (node.shadowForStrokeEnabled) {
                node._savedShadowForStroke = node.shadowForStrokeEnabled();
                node.shadowForStrokeEnabled(false);
              }
              if (node.perfectDrawEnabled) {
                node._savedPerfectDraw = node.perfectDrawEnabled();
                node.perfectDrawEnabled(false);
              }
              if (node.cache && !node.isCached && node.width && node.height) {
                node._dragCached = true;
                try {
                  if (isMobile) {
                    const padding = 10;
                    node.cache({
                      offset: padding,
                      pixelRatio: 0.8
                    });
                  } else {
                    node.cache();
                  }
                } catch (e) {
                  node._dragCached = false;
                }
              }
            });
          }
        }
      }
    }
  }, [contextMenu, isPublicView, optimizeForDragging, isMobile, width, height]);

  const handleDragMove = useCallback((e: any) => {
    if (isPublicView && e.target === stageRef.current) {
      if (e.evt && e.evt._dragSkipUpdate) {
        return;
      }
      
      if (e.evt) {
        e.evt._dragSkipUpdate = true;
      }
      
      if (stageRef.current && layerRef.current) {
        const renderThreshold = isMobile ? 0.85 : 0.7;
        if (Math.random() > renderThreshold) {
          stageRef.current.batchDraw();
        }
      }
      
      return;
    }
    
    if (e.target === stageRef.current) {
      if (isMobile && layerRef.current) {
        e.cancelBubble = true;
      }
    }
  }, [isMobile, isPublicView]);

  const handleDragEnd = useCallback((e: any) => {
    if (e.target === stageRef.current) {
      setPosition({
        x: e.target.x(),
        y: e.target.y()
      });
      
      optimizeForDragging(false);
      
      if (layerRef.current) {
        layerRef.current.hitGraphEnabled(true);
        
        if (isPublicView) {
          layerRef.current.clearCache();
        }
        
        if (isPublicView) {
          if (stageRef.current) {
            const container = stageRef.current.container();
            container.style.cursor = '';
            container.classList.remove('dragging');
            
            const nodes = layerRef.current.getChildren();
            nodes.forEach((node: any) => {
              if (node._savedShadowForStroke !== undefined) {
                node.shadowForStrokeEnabled(node._savedShadowForStroke);
                delete node._savedShadowForStroke;
              }
              if (node._savedPerfectDraw !== undefined) {
                node.perfectDrawEnabled(node._savedPerfectDraw);
                delete node._savedPerfectDraw;
              }
              if (node._dragCached) {
                node.clearCache();
                delete node._dragCached;
              }
            });
          }
        }
      }
      
      setTimeout(() => {
        if (stageRef.current) {
          stageRef.current.batchDraw();
        }
      }, 50);
      
      setIsDragging(false);
      
      // Update viewport for culling after drag ends
      debouncedUpdateViewport();
    }
  }, [isPublicView, optimizeForDragging, debouncedUpdateViewport]);

  const handleMouseEnter = useCallback(() => {
    setIsStageHovered(true);
    document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
  }, [isDragging]);

  const handleMouseLeave = useCallback(() => {
    setIsStageHovered(false);
    document.body.style.cursor = 'default';
  }, []);

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const targetClass = e.target.getClassName();
    
    if (targetClass === 'Stage' || targetClass === 'Layer') {
      setContextMenu({ ...contextMenu, visible: false });
      return;
    }
    
    if (targetClass === 'Group' || targetClass === 'Rect') {
      onSelectHall(null);
      onSelectFixture(null);
      
      if (isFixtureMode) {
        setContextMenu({ ...contextMenu, visible: false });
        return;
      }
      
      const pointerPosition = stageRef.current?.getPointerPosition();
      if (pointerPosition && isWithinExhibitionBounds(pointerPosition)) {
        const { x, y } = pointerPosition;
        const { x: stageX, y: stageY } = stageRef.current?.position() || { x: 0, y: 0 };
        const { x: scaleX, y: scaleY } = stageRef.current?.scale() || { x: 1, y: 1 };
        
        const menuX = (x - stageX) / scaleX;
        const menuY = (y - stageY) / scaleY;
        
        setContextMenu({ x: menuX, y: menuY, visible: true });
      } else {
        setContextMenu({ ...contextMenu, visible: false });
      }
    } else {
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const isWithinExhibitionBounds = (position: { x: number; y: number }) => {
    if (!exhibitionWidth || !exhibitionHeight || !stageRef.current) return false;
    
    const { x, y } = position;
    const { x: stageX, y: stageY } = stageRef.current.position();
    const { x: scaleX } = stageRef.current.scale();
    
    const stagePoint = {
      x: (x - stageX) / scaleX,
      y: (y - stageY) / scaleX,
    };
    
    return (
      stagePoint.x >= 0 &&
      stagePoint.x <= exhibitionWidth &&
      stagePoint.y >= 0 &&
      stagePoint.y <= exhibitionHeight
    );
  };

  const handleExhibitionSelect = useCallback(() => {
    onSelectHall(null);
    onSelectFixture(null);
    setIsExhibitionSelected(true);
    setIsExhibitionFormVisible(true);
    setContextMenu({ ...contextMenu, visible: false });
  }, [onSelectHall, onSelectFixture, contextMenu]);

  const handleExhibitionFormSubmit = useCallback((dimensions: { width: number; height: number }) => {
    onExhibitionChange(dimensions);
    setIsExhibitionFormVisible(false);
  }, [onExhibitionChange]);

  const handleExhibitionSpaceClick = () => {
    setIsExhibitionSelected(true);
    setIsExhibitionFormVisible(true);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleHallClick = () => {
    onAddHall();
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleStallClick = () => {
    onAddStall();
    setContextMenu({ ...contextMenu, visible: false });
  };

  useEffect(() => {
    if (width > 0 && height > 0 && exhibitionWidth > 0 && exhibitionHeight > 0) {
      const padding = isStallMode ? 20 : 40;
      
      const availableWidth = width - padding * 2;
      const availableHeight = height - padding * 2;
      
      const scaleX = availableWidth / exhibitionWidth;
      const scaleY = availableHeight / exhibitionHeight;
      
      const fitScale = Math.min(scaleX, scaleY);
      
      const newScale = fitScale;
      
      const centerX = (width - exhibitionWidth * newScale) / 2;
      const centerY = (height - exhibitionHeight * newScale) / 2;
      
      setScale(newScale);
      setPosition({ x: centerX, y: centerY });

      if (stageRef.current) {
        stageRef.current.batchDraw();
      }
    }
  }, [width, height, exhibitionWidth, exhibitionHeight, isStallMode]);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<CanvasChildProps>(child)) {
      return React.cloneElement(child, {
        scale,
        position
      });
    }
    return child;
  });

  const backgroundExhibitionSpace = (
    <ExhibitionSpace
      width={exhibitionWidth}
      height={exhibitionHeight}
      scale={scale}
      position={{ x: 0, y: 0 }}
      isSelected={false}
      onSelect={undefined}
      onChange={undefined}
      isEditable={false}
    />
  );

  if (width <= 0 || height <= 0 || exhibitionWidth <= 0 || exhibitionHeight <= 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#fafafa'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden',
      background: '#fafafa',
      cursor: isStageHovered ? (isDragging ? 'grabbing' : 'grab') : 'default'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        zIndex: 1,
        display: 'flex',
        gap: '8px'
      }}>
        <Space style={{
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '8px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(8px)'
        }}>
          <Button 
            icon={<ZoomOutOutlined />} 
            onClick={handleZoomOut}
            disabled={scale <= 0.1}
            style={{
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
          <div style={{
            padding: '0 8px',
            fontSize: '14px',
            color: '#666',
            userSelect: 'none'
          }}>
            {Math.round(scale * 100)}%
          </div>
          <Button 
            icon={<ZoomInOutlined />} 
            onClick={handleZoomIn}
            disabled={scale >= 20}
            style={{
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
        </Space>
      </div>
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        onClick={handleStageClick}
        draggable={true}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        x={position.x}
        y={position.y}
        scaleX={scale}
        scaleY={scale}
        perfectDrawEnabled={!isDragging && !isPublicView && !shouldOptimizeForLargeDataset}
        hitGraphEnabled={!isDragging}
        pixelRatio={
          shouldOptimizeForLargeDataset 
            ? (isDragging ? 0.5 : 0.8) // Lower quality for large datasets
            : (isDragging ? (isMobile ? 0.8 : 1) : Math.min(1.5, window.devicePixelRatio || 1))
        }
        dragDistance={isPublicView ? (isMobile ? 5 : 3) : 0}
        listening={!shouldOptimizeForLargeDataset || !isDragging} // Reduce event listening for performance
      >
        {isPublicView && (
          <FastLayer 
            ref={fastLayerRef}
            listening={false}
          >
            {backgroundExhibitionSpace}
          </FastLayer>
        )}

        <Layer 
          ref={layerRef}
          imageSmoothingEnabled={!isDragging && !shouldOptimizeForLargeDataset}
          perfectDrawEnabled={!isDragging && !shouldOptimizeForLargeDataset}
          hitGraphEnabled={!isDragging}
        >
          {!isPublicView && (
            <ExhibitionSpace
              width={exhibitionWidth}
              height={exhibitionHeight}
              scale={scale}
              position={{ x: 0, y: 0 }}
              isSelected={isExhibitionSelected}
              onSelect={isFixtureMode ? undefined : handleExhibitionSelect}
              onChange={isStallMode || isFixtureMode ? undefined : onExhibitionChange}
              isEditable={!isStallMode && !isFixtureMode}
            />
          )}

          {halls.map((hall) => (
            <Hall
              key={hall._id || hall.id}
              hall={hall}
              isSelected={selectedHall?.id === hall.id}
              onSelect={() => onSelectHall(hall)}
              onChange={isStallMode || isFixtureMode ? undefined : onHallChange}
              scale={scale}
              position={{ x: 0, y: 0 }}
              exhibitionWidth={exhibitionWidth}
              exhibitionHeight={exhibitionHeight}
              isStallMode={isStallMode || isFixtureMode}
            />
          ))}
          
          {visibleStalls.map((stall) => {
            const stallId = stall._id || stall.id;
            const hall = halls.find(h => h.id === stall.hallId || h._id === stall.hallId);
            
            if (!hall) return null;
            
            return (
              <Stall
                key={stallId}
                stall={{
                  ...stall,
                  _id: stallId,
                  id: stallId
                }}
                hallX={hall.dimensions.x}
                hallY={hall.dimensions.y}
                hallWidth={hall.dimensions.width}
                hallHeight={hall.dimensions.height}
                scale={scale}
                isDragging={isDragging && isPublicView}
              />
            );
          })}
          
          {/* Sort fixtures by zIndex so higher zIndex appears on top */}
          {[...fixtures]
            .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
            .map((fixture) => {
              const fixtureId = fixture._id || fixture.id;
              const selectedId = selectedFixture?._id || selectedFixture?.id;
              const isFixtureSelected = selectedId === fixtureId;
              
              return (
                <Fixture
                  key={fixtureId}
                  fixture={{
                    ...fixture,
                    _id: fixtureId,
                    id: fixtureId
                  }}
                  isSelected={isFixtureSelected}
                  onSelect={() => onSelectFixture(fixture)}
                  onChange={isFixtureMode ? onFixtureChange : undefined}
                  scale={scale}
                  position={{ x: 0, y: 0 }}
                  exhibitionWidth={exhibitionWidth}
                  exhibitionHeight={exhibitionHeight}
                  isEditable={isFixtureMode}
                />
              );
            })}
          
          {childrenWithProps}
        </Layer>
      </Stage>

      <LayoutContextMenu
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onExhibitionClick={handleExhibitionSpaceClick}
        onHallClick={handleHallClick}
        onStallClick={handleStallClick}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
      />

      <ExhibitionSpaceForm
        visible={isExhibitionFormVisible}
        width={exhibitionWidth}
        height={exhibitionHeight}
        onCancel={() => setIsExhibitionFormVisible(false)}
        onSubmit={handleExhibitionFormSubmit}
      />
    </div>
  );
};

export default Canvas; 