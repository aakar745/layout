import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  }, [scale]);

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
  }, [scale, position]);

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
  }, [scale, position]);

  const handleDragStart = useCallback((e: any) => {
    if (e.target === stageRef.current) {
      setContextMenu({ ...contextMenu, visible: false });
      setIsDragging(true);
      
      if (layerRef.current) {
        // Disable hit detection during drag for better performance
        layerRef.current.hitGraphEnabled(false);
        
        // Apply performance optimizations for public view
        if (isPublicView) {
          // Set lower quality settings for faster dragging
          if (stageRef.current) {
            stageRef.current.container().style.cursor = 'grabbing';
            
            // Set all Konva nodes to use lower quality settings
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
            });
          }
        }
      }
    }
  }, [contextMenu, isPublicView]);

  // Optimize drag move by avoiding re-renders
  const handleDragMove = useCallback((e: any) => {
    // Skip processing in public view for maximum performance
    if (isPublicView && e.target === stageRef.current) {
      return; // Just let the drag happen naturally without any additional processing
    }
    
    // For non-public view, maintain existing behavior
    if (e.target === stageRef.current) {
      if (isMobile && layerRef.current) {
        e.cancelBubble = true;
      }
    }
  }, [isMobile, isPublicView]);

  const handleDragEnd = useCallback((e: any) => {
    if (e.target === stageRef.current) {
      // Update position state only at the end of drag
      setPosition({
        x: e.target.x(),
        y: e.target.y()
      });
      
      // Re-enable hit detection
      if (layerRef.current) {
        layerRef.current.hitGraphEnabled(true);
        
        // Restore quality settings in public view
        if (isPublicView) {
          if (stageRef.current) {
            stageRef.current.container().style.cursor = '';
            
            // Restore quality settings of Konva nodes
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
            });
          }
        }
      }
      
      // Draw everything at full quality after drag ends
      if (stageRef.current) {
        stageRef.current.batchDraw();
      }
      
      setIsDragging(false);
    }
  }, [isPublicView]);

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

  // Create the background exhibition space element for FastLayer
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
        perfectDrawEnabled={!isDragging && !isPublicView} // Disable perfect drawing during drag in public view
        hitGraphEnabled={!isDragging} // Disable hit detection during drag
        pixelRatio={Math.min(1.5, window.devicePixelRatio || 1)} // Limit pixel ratio for better performance
        dragDistance={isPublicView ? 0 : 3} // Optimize drag threshold for public view
      >
        {/* FastLayer for static background in public view */}
        {isPublicView && (
          <FastLayer 
            ref={fastLayerRef}
            listening={false} // FastLayer doesn't support events
          >
            {backgroundExhibitionSpace}
          </FastLayer>
        )}

        <Layer 
          ref={layerRef}
          imageSmoothingEnabled={!isDragging || !isPublicView} // Disable image smoothing during public view drag
        >
          {/* Only render ExhibitionSpace in Layer if not using FastLayer */}
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
          
          {stalls.map((stall) => {
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
          
          {fixtures.map((fixture) => {
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