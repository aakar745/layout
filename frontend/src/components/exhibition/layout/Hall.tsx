import React from 'react';
import { Group, Rect, Text, Transformer, Line } from 'react-konva';
import Konva from 'konva';
import { Hall as HallType } from '../../../services/exhibition';

interface HallProps {
  hall: HallType;
  isSelected?: boolean;
  onSelect?: (hall: HallType) => void;
  onChange?: (hall: HallType) => void;
  scale?: number;
  position?: { x: number; y: number };
  exhibitionWidth?: number;
  exhibitionHeight?: number;
  isStallMode?: boolean;
}

const Hall: React.FC<HallProps> = ({
  hall,
  isSelected = false,
  onSelect,
  onChange,
  scale = 1,
  position = { x: 0, y: 0 },
  exhibitionWidth = 100,
  exhibitionHeight = 100,
  isStallMode = false
}) => {
  const shapeRef = React.useRef<Konva.Group>(null);
  const transformerRef = React.useRef<Konva.Transformer>(null);

  // Create grid lines
  const gridLines = React.useMemo(() => {
    const lines: JSX.Element[] = [];
    const { width, height } = hall.dimensions;
    const gridSize = 1; // 1 meter grid size

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, height]}
          stroke="#ddd"
          strokeWidth={1 / scale}
          dash={[2 / scale, 2 / scale]}
          listening={false}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <Line
          key={`h${y}`}
          points={[0, y, width, y]}
          stroke="#ddd"
          strokeWidth={1 / scale}
          dash={[2 / scale, 2 / scale]}
          listening={false}
        />
      );
    }

    return lines;
  }, [hall.dimensions.width, hall.dimensions.height, scale]);

  React.useEffect(() => {
    if (isSelected && transformerRef.current && shapeRef.current) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Stop event from bubbling up to exhibition space
    e.cancelBubble = true;
    
    const node = e.target;
    
    // Calculate position in local coordinates
    const localX = node.x();
    const localY = node.y();

    // Ensure hall stays within exhibition bounds
    const boundedX = Math.max(0, Math.min(localX, exhibitionWidth - hall.dimensions.width));
    const boundedY = Math.max(0, Math.min(localY, exhibitionHeight - hall.dimensions.height));

    // Update node position immediately
    node.x(Math.round(boundedX));
    node.y(Math.round(boundedY));
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Stop event from bubbling up to exhibition space
    e.cancelBubble = true;
    
    const node = e.target;
    
    // Get the final bounded position
    const boundedX = Math.max(0, Math.min(node.x(), exhibitionWidth - hall.dimensions.width));
    const boundedY = Math.max(0, Math.min(node.y(), exhibitionHeight - hall.dimensions.height));

    // Update the hall with new position while preserving ALL properties including IDs
    onChange?.({
      ...hall,
      _id: hall._id,
      id: hall.id || hall._id,
      exhibitionId: hall.exhibitionId,
      dimensions: {
        ...hall.dimensions,
        x: Math.round(boundedX),
        y: Math.round(boundedY)
      }
    });
  };

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Stop event from bubbling up to exhibition space
    e.cancelBubble = true;
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
    if (!shapeRef.current) return;

    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // Reset scale
    node.scaleX(1);
    node.scaleY(1);

    // Calculate new dimensions
    const newWidth = Math.round(node.width() * scaleX);
    const newHeight = Math.round(node.height() * scaleY);

    // Calculate position in local coordinates
    const localX = node.x();
    const localY = node.y();

    // Ensure hall stays within exhibition bounds
    const boundedX = Math.max(0, Math.min(localX, exhibitionWidth - newWidth));
    const boundedY = Math.max(0, Math.min(localY, exhibitionHeight - newHeight));

    onChange?.({
      ...hall,
      _id: hall._id,
      id: hall.id || hall._id,
      exhibitionId: hall.exhibitionId,
      dimensions: {
        x: boundedX,
        y: boundedY,
        width: Math.max(5, Math.min(newWidth, exhibitionWidth - boundedX)),
        height: Math.max(5, Math.min(newHeight, exhibitionHeight - boundedY))
      },
    });
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Stop event from bubbling up to exhibition space
    e.cancelBubble = true;
    onSelect?.(hall);
  };

  return (
    <Group
      ref={shapeRef}
      x={hall.dimensions.x}
      y={hall.dimensions.y}
      width={hall.dimensions.width}
      height={hall.dimensions.height}
      draggable={!isStallMode && !!onChange}
      onClick={handleClick}
      onTap={handleClick}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onTransformEnd={handleTransformEnd}
    >
      <Rect
        width={hall.dimensions.width}
        height={hall.dimensions.height}
        fill="#ffffff"
        stroke={isSelected ? "#1890ff" : "#d9d9d9"}
        strokeWidth={isSelected ? 2 / scale : 1 / scale}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={5 / scale}
        shadowOffset={{ x: 2 / scale, y: 2 / scale }}
        shadowOpacity={0.5}
      />
      
      {/* Grid lines */}
      <Group>
        {gridLines}
      </Group>

      <Text
        text={hall.name}
        fontSize={14 / scale}
        fill="#000000"
        width={hall.dimensions.width}
        align="center"
        y={hall.dimensions.height / 2 - 7 / scale}
      />
    </Group>
  );
};

export default Hall; 