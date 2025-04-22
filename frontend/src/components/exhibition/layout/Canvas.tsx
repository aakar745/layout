import React, { useState, useCallback, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
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
  isFixtureMode = false
}) => {
  const stageRef = React.useRef<any>(null);
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
    // Make sure this is a stage drag, not a hall or fixture drag
    if (e.target === stageRef.current) {
      // Always hide context menu when starting to drag
      setContextMenu({ ...contextMenu, visible: false });
      setIsDragging(true);
    }
  }, [contextMenu]);

  const handleDragEnd = useCallback((e: any) => {
    // Make sure this is a stage drag, not a hall or fixture drag
    if (e.target === stageRef.current) {
      setPosition({
        x: e.target.x(),
        y: e.target.y()
      });
      
      // Make sure to redraw to avoid visual glitches
      stageRef.current?.batchDraw();
      setIsDragging(false);
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsStageHovered(true);
    document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
  }, [isDragging]);

  const handleMouseLeave = useCallback(() => {
    setIsStageHovered(false);
    document.body.style.cursor = 'default';
  }, []);

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    // Get the target's class name
    const targetClass = e.target.getClassName();
    
    // If the click is directly on the stage or on the layer
    // allow dragging and just hide context menu
    if (targetClass === 'Stage' || targetClass === 'Layer') {
      setContextMenu({ ...contextMenu, visible: false });
      return;
    }
    
    // If we get here, we clicked on some object within the stage
    
    // Deselect halls/fixtures if clicking on exhibition space (not halls/fixtures)
    if (targetClass === 'Group' || targetClass === 'Rect') {
      onSelectHall(null);
      onSelectFixture(null);
      
      // Only show context menu if click is within exhibition boundaries
      const pointerPosition = stageRef.current?.getPointerPosition();
      if (pointerPosition && isWithinExhibitionBounds(pointerPosition)) {
        const { x, y } = pointerPosition;
        const { x: stageX, y: stageY } = stageRef.current?.position() || { x: 0, y: 0 };
        const { x: scaleX, y: scaleY } = stageRef.current?.scale() || { x: 1, y: 1 };
        
        // Convert screen coordinates to stage coordinates
        const menuX = (x - stageX) / scaleX;
        const menuY = (y - stageY) / scaleY;
        
        setContextMenu({ x: menuX, y: menuY, visible: true });
      } else {
        setContextMenu({ ...contextMenu, visible: false });
      }
    } else {
      // Hide context menu when clicking on specific elements (Hall, Fixture, etc.)
      setContextMenu({ ...contextMenu, visible: false });
    }
  };

  const isWithinExhibitionBounds = (position: { x: number; y: number }) => {
    if (!exhibitionWidth || !exhibitionHeight || !stageRef.current) return false;
    
    const { x, y } = position;
    const { x: stageX, y: stageY } = stageRef.current.position();
    const { x: scaleX } = stageRef.current.scale();
    
    // Convert screen coordinates to stage coordinates
    const stagePoint = {
      x: (x - stageX) / scaleX,
      y: (y - stageY) / scaleX,
    };
    
    // Check if point is within exhibition boundaries
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

  // Center the exhibition space initially and when dimensions change
  useEffect(() => {
    if (width > 0 && height > 0 && exhibitionWidth > 0 && exhibitionHeight > 0) {
      // Fixed padding for all modes (smaller for stall mode)
      const padding = isStallMode ? 20 : 40;
      
      // Calculate available space
      const availableWidth = width - padding * 2;
      const availableHeight = height - padding * 2;
      
      // Calculate scale to fit the exhibition in the available space
      const scaleX = availableWidth / exhibitionWidth;
      const scaleY = availableHeight / exhibitionHeight;
      
      // Use the minimum scale to ensure the entire exhibition fits
      const fitScale = Math.min(scaleX, scaleY);
      
      // Set the scale
      const newScale = fitScale;
      
      // Center the layout
      const centerX = (width - exhibitionWidth * newScale) / 2;
      const centerY = (height - exhibitionHeight * newScale) / 2;
      
      setScale(newScale);
      setPosition({ x: centerX, y: centerY });

      if (stageRef.current) {
        stageRef.current.batchDraw();
      }
    }
  }, [width, height, exhibitionWidth, exhibitionHeight, isStallMode]);

  // Clone children and pass scale and position props
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<CanvasChildProps>(child)) {
      return React.cloneElement(child, {
        scale,
        position
      });
    }
    return child;
  });

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
        onDragEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        x={position.x}
        y={position.y}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>
          <ExhibitionSpace
            width={exhibitionWidth}
            height={exhibitionHeight}
            scale={scale}
            position={{ x: 0, y: 0 }}
            isSelected={isExhibitionSelected}
            onSelect={isFixtureMode ? undefined : handleExhibitionSelect}
            onChange={isStallMode || isFixtureMode ? undefined : onExhibitionChange}
            isEditable={!isStallMode && !isFixtureMode}
          >
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
              // Find the hall this stall belongs to
              const hall = halls.find(h => h.id === stall.hallId || h._id === stall.hallId);
              
              if (!hall) return null; // Skip if hall not found
              
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
                />
              );
            })}
            
            {fixtures.map((fixture) => {
              // Normalize IDs for consistency
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
          </ExhibitionSpace>
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