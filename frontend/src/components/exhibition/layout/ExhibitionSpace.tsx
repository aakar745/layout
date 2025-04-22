import React from 'react';
import { Group, Rect, Line, Text } from 'react-konva';
import { Hall as HallType } from '../../../services/exhibition';

interface ExhibitionSpaceProps {
  width: number;  // width in meters
  height: number; // height in meters
  scale?: number;
  position?: { x: number; y: number };
  isSelected?: boolean;
  onSelect?: () => void;
  onChange?: (dimensions: { width: number; height: number }) => void;
  children?: React.ReactNode;
  isEditable?: boolean;
}

const ExhibitionSpace: React.FC<ExhibitionSpaceProps> = ({
  width,
  height,
  scale = 1,
  position = { x: 0, y: 0 },
  isSelected = false,
  onSelect = () => {},
  onChange = () => {},
  children,
  isEditable = true
}) => {
  const handleClick = (e: any) => {
    // Only trigger onSelect if the space is editable
    if (isEditable) {
      onSelect();
      
      // Only cancel the bubble if we're actually performing a selection
      // This allows click events to propagate to the Stage for dragging when clicking on empty areas
      e.cancelBubble = true;
    }
  };

  // Create grid lines
  const gridLines = React.useMemo(() => {
    const lines: JSX.Element[] = [];
    const gridSize = 5; // 5 meter grid size for more detail

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <Line
          key={`v${x}`}
          points={[x, 0, x, height]}
          stroke="#e8e8e8"
          strokeWidth={1 / scale}
          dash={[5 / scale]}
        />
      );
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <Line
          key={`h${y}`}
          points={[0, y, width, y]}
          stroke="#e8e8e8"
          strokeWidth={1 / scale}
          dash={[5 / scale]}
        />
      );
    }

    return lines;
  }, [width, height, scale]);

  return (
    <Group
      x={position.x}
      y={position.y}
      width={width}
      height={height}
      onClick={handleClick}
    >
      {/* Exhibition space background */}
      <Rect
        width={width}
        height={height}
        fill="#ffffff"
        stroke={isSelected && isEditable ? "#1890ff" : "#d9d9d9"}
        strokeWidth={isSelected && isEditable ? 2 / scale : 1 / scale}
        shadowColor="rgba(0,0,0,0.1)"
        shadowBlur={10 / scale}
        shadowOffset={{ x: 0, y: 0 }}
        shadowOpacity={0.5}
        cornerRadius={4 / scale}
      />

      {/* Grid lines */}
      <Group>
        {gridLines}
      </Group>

      {/* Dimensions labels */}
      <Text
        text={`${width}m × ${height}m`}
        fontSize={14 / scale}
        fill="#666666"
        x={5}
        y={5}
      />

      {/* Render halls and other children */}
      {children}
    </Group>
  );
};

export default ExhibitionSpace; 