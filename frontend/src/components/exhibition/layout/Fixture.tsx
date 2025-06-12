import React, { useEffect, useState } from 'react';
import { Group, Rect, Text, Transformer, Image } from 'react-konva';
import Konva from 'konva';
import { Fixture as FixtureType } from '../../../services/exhibition';
import useImage from 'use-image';

// Helper function to get image URL (with or without authentication)
const getAuthenticatedImageUrl = (path: string): string => {
  if (!path) return '';
  
  // Use direct backend URL instead of relying on proxy
  const backendUrl = process.env.NODE_ENV === 'production' 
    ? window.location.origin 
    : 'http://localhost:5000';
  
  // Clean the path - remove any leading slashes and /api/uploads/ prefix
  const cleanPath = path.replace(/^\/?(api\/uploads\/)?/, '');
  
  // If this is a fixture icon, allow public access without token
  if (cleanPath.includes('fixtures/')) {
    return `${backendUrl}/api/uploads/${cleanPath}`;
  }
  
  // For other resources, require authentication token
  const token = localStorage.getItem('token');
  if (!token) return '';
  
  // Return direct URL to backend with authentication token as query parameter
  return `${backendUrl}/api/uploads/${cleanPath}?token=${token}`;
};

interface FixtureProps {
  fixture: FixtureType;
  isSelected?: boolean;
  onSelect?: (fixture: FixtureType) => void;
  onChange?: (fixture: FixtureType) => void;
  scale?: number;
  position?: { x: number; y: number };
  exhibitionWidth?: number;
  exhibitionHeight?: number;
  isEditable?: boolean;
}

const Fixture: React.FC<FixtureProps> = ({
  fixture,
  isSelected = false,
  onSelect,
  onChange,
  scale = 1,
  position = { x: 0, y: 0 },
  exhibitionWidth = 100,
  exhibitionHeight = 100,
  isEditable = true
}) => {
  const shapeRef = React.useRef<Konva.Group>(null);
  const transformerRef = React.useRef<Konva.Transformer>(null);
  
  // Get authenticated image URL
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Set up the authenticated image URL when fixture icon changes
  useEffect(() => {
    if (fixture.icon) {
      const authenticatedUrl = getAuthenticatedImageUrl(fixture.icon);
      setImageUrl(authenticatedUrl);
    } else {
      setImageUrl('');
    }
  }, [fixture.icon]);
  
  // Use the authenticated image URL 
  const [image] = useImage(imageUrl);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Stop event from bubbling up
    e.cancelBubble = true;
    
    // Instead of preventDefault, use stopPropagation on the Konva event
    // which doesn't trigger the passive event listener warning
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Stop event from bubbling up
    e.cancelBubble = true;
    
    // Get target node
    const node = e.target;
    
    // Calculate position
    const x = node.x();
    const y = node.y();

    // Ensure fixture stays within exhibition bounds
    const boundedX = Math.max(0, Math.min(x, exhibitionWidth - fixture.dimensions.width));
    const boundedY = Math.max(0, Math.min(y, exhibitionHeight - fixture.dimensions.height));

    // Update node position
    node.x(Math.round(boundedX));
    node.y(Math.round(boundedY));
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Stop event from bubbling up
    e.cancelBubble = true;
    
    // Get target node
    const node = e.target;
    
    // Get final position
    const x = node.x();
    const y = node.y();

    // Ensure fixture stays within exhibition bounds
    const boundedX = Math.max(0, Math.min(x, exhibitionWidth - fixture.dimensions.width));
    const boundedY = Math.max(0, Math.min(y, exhibitionHeight - fixture.dimensions.height));

    // Create a single consistent ID for the fixture
    const fixtureId = fixture._id || fixture.id;

    // Update the fixture with new position
    onChange?.({
      ...fixture,
      _id: fixtureId,
      id: fixtureId,
      exhibitionId: fixture.exhibitionId,
      position: {
        x: Math.round(boundedX),
        y: Math.round(boundedY)
      }
    });
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    if (!shapeRef.current) return;

    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();

    // Reset scale and apply to width/height instead
    node.scaleX(1);
    node.scaleY(1);

    // Calculate new dimensions
    const newWidth = Math.round(fixture.dimensions.width * scaleX);
    const newHeight = Math.round(fixture.dimensions.height * scaleY);

    // Calculate position in local coordinates
    const localX = node.x();
    const localY = node.y();

    // Ensure fixture stays within exhibition bounds
    const boundedX = Math.max(0, Math.min(localX, exhibitionWidth - newWidth));
    const boundedY = Math.max(0, Math.min(localY, exhibitionHeight - newHeight));

    // Create a single consistent ID for the fixture
    const fixtureId = fixture._id || fixture.id;

    onChange?.({
      ...fixture,
      _id: fixtureId,
      id: fixtureId,
      exhibitionId: fixture.exhibitionId,
      position: {
        x: boundedX,
        y: boundedY,
      },
      dimensions: {
        width: Math.max(0.5, Math.min(newWidth, exhibitionWidth - boundedX)),
        height: Math.max(0.5, Math.min(newHeight, exhibitionHeight - boundedY))
      },
      rotation: rotation,
    });
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Stop event from bubbling up
    e.cancelBubble = true;
    onSelect?.(fixture);
  };

  const renderFixture = () => {
    // Define border properties with defaults
    const borderColor = fixture.borderColor || (isSelected ? "#1890ff" : "#d9d9d9");
    const borderRadius = fixture.borderRadius !== undefined ? fixture.borderRadius / scale : 3 / scale;
    
    // If we have an icon, render an image, otherwise render a basic shape
    if (image) {
      return (
        <Image
          image={image}
          width={fixture.dimensions.width}
          height={fixture.dimensions.height}
          fill={fixture.color || '#ffffff'}
          stroke={borderColor}
          strokeWidth={isSelected ? 2 / scale : 1 / scale}
          cornerRadius={borderRadius}
          shadowColor="rgba(0,0,0,0.1)"
          shadowBlur={5 / scale}
          shadowOffset={{ x: 2 / scale, y: 2 / scale }}
          shadowOpacity={0.5}
        />
      );
    }

    // Fallback to rectangle for fixtures without icons
    return (
      <Rect
        width={fixture.dimensions.width}
        height={fixture.dimensions.height}
        fill={fixture.color || '#f0f2f5'}
        stroke={borderColor}
        strokeWidth={isSelected ? 2 / scale : 1 / scale}
        cornerRadius={borderRadius}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={5 / scale}
        shadowOffset={{ x: 2 / scale, y: 2 / scale }}
        shadowOpacity={0.5}
      />
    );
  };

  // Helper function to format dimensions for display
  const formatDimensions = (width: number, height: number): string => {
    return `${Math.round(width)} m x ${Math.round(height)} m`;
  };

  // Helper function to calculate appropriate font size based on fixture size
  const calculateFontSize = (width: number, height: number): number => {
    const baseSize = Math.min(width, height) * 0.12; // 12% of smaller dimension
    const minSize = 8 / scale; // Minimum readable size
    const maxSize = 16 / scale; // Maximum size to prevent oversized text
    return Math.max(minSize, Math.min(maxSize, baseSize));
  };

  return (
    <>
      <Group
        ref={shapeRef}
        x={fixture.position.x}
        y={fixture.position.y}
        width={fixture.dimensions.width}
        height={fixture.dimensions.height}
        rotation={fixture.rotation || 0}
        draggable={isEditable && !!onChange}
        onClick={handleClick}
        onTap={handleClick}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
      >
        {renderFixture()}
        
        {/* For fixtures WITH icons, show name based on showName setting */}
        {image && fixture.name && fixture.showName !== false && (
          <Text
            text={fixture.name}
            fontSize={12 / scale}
            fill="#000000"
            width={fixture.dimensions.width}
            align="center"
            y={-16 / scale}
          />
        )}
        
        {/* For fixtures WITHOUT icons, always show name and dimensions */}
        {!image && (
          <>
            {/* Fixture Name */}
            {fixture.name && (
              <Text
                text={fixture.name}
                fontSize={calculateFontSize(fixture.dimensions.width, fixture.dimensions.height)}
                fill="#333333"
                fontStyle="bold"
                width={fixture.dimensions.width}
                height={fixture.dimensions.height * 0.6}
                align="center"
                verticalAlign="middle"
                wrap="word"
                x={0}
                y={fixture.dimensions.height * 0.2}
              />
            )}
            
            {/* Fixture Dimensions */}
            <Text
              text={formatDimensions(fixture.dimensions.width, fixture.dimensions.height)}
              fontSize={calculateFontSize(fixture.dimensions.width, fixture.dimensions.height) * 0.8}
              fill="#666666"
              width={fixture.dimensions.width}
              align="center"
              x={0}
              y={fixture.dimensions.height * 0.75}
            />
          </>
        )}
      </Group>
      {isSelected && isEditable && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit size to reasonable values
            if (newBox.width < 0.5 || newBox.height < 0.5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default Fixture; 