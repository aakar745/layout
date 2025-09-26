import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, InputNumber, Modal, Button, Space, Select, Divider, Typography, App, Row, Col, Card } from 'antd';
import { DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import { Stall, Hall, Exhibition } from '../../../services/exhibition';
import stallService, { StallType } from '../../../services/stall';
import { calculateStallArea } from '../../../utils/stallUtils';

const { Title, Text } = Typography;

interface StallFormProps {
  visible: boolean;
  stall: Stall | null;
  hall: Hall | null;
  exhibition: Exhibition;
  onCancel: () => void;
  onSubmit: (stall: Stall) => void;
  onDelete?: (stall: Stall) => void;
}

const StallForm: React.FC<StallFormProps> = ({
  visible,
  stall,
  hall,
  exhibition,
  onCancel,
  onSubmit,
  onDelete
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [stallTypes, setStallTypes] = useState<StallType[]>([]);
  const [loading, setLoading] = useState(false);
  const [shapeType, setShapeType] = useState<'rectangle' | 'l-shape'>('rectangle');
  const [previewArea, setPreviewArea] = useState<number>(0);

  // Helper function to snap to half-grid positions (0.5m intervals)
  const snapToHalfGrid = (value: number) => {
    return Math.round(value * 2) / 2;
  };

  // Calculate hall space utilization
  const calculateHallUtilization = useCallback((hallStalls: any[], hallWidth: number, hallHeight: number) => {
    const totalHallArea = hallWidth * hallHeight;
    const occupiedArea = hallStalls.reduce((total, stall) => {
      const sw = stall.dimensions?.width || 0;
      const sh = stall.dimensions?.height || 0;
      return total + (sw * sh);
    }, 0);
    const utilizationPercent = totalHallArea > 0 ? (occupiedArea / totalHallArea) * 100 : 0;
    
    return {
      totalArea: totalHallArea,
      occupiedArea,
      freeArea: totalHallArea - occupiedArea,
      utilizationPercent,
      isNearlyFull: utilizationPercent > 85, // Warning threshold
      isFull: utilizationPercent > 95 // Critical threshold
    };
  }, []);

  // Debug utility to visualize stall placement (development only)
  const debugVisualizeHallLayout = (stalls: any[], hallWidth: number, hallHeight: number, newStall?: { x: number, y: number, width: number, height: number }) => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const grid = Array(Math.ceil(hallHeight * 2)).fill(null).map(() => Array(Math.ceil(hallWidth * 2)).fill('·'));
    
    // Mark existing stalls
    stalls.forEach((stall, index) => {
      const startX = Math.floor(stall.dimensions.x * 2);
      const startY = Math.floor(stall.dimensions.y * 2);
      const endX = Math.floor((stall.dimensions.x + stall.dimensions.width) * 2);
      const endY = Math.floor((stall.dimensions.y + stall.dimensions.height) * 2);
      
      for (let y = startY; y < endY && y < grid.length; y++) {
        for (let x = startX; x < endX && x < grid[0].length; x++) {
          grid[y][x] = (index % 10).toString();
        }
      }
    });
    
    // Mark new stall position if provided
    if (newStall) {
      const startX = Math.floor(newStall.x * 2);
      const startY = Math.floor(newStall.y * 2);
      const endX = Math.floor((newStall.x + newStall.width) * 2);
      const endY = Math.floor((newStall.y + newStall.height) * 2);
      
      for (let y = startY; y < endY && y < grid.length; y++) {
        for (let x = startX; x < endX && x < grid[0].length; x++) {
          grid[y][x] = 'N'; // N for New stall
        }
      }
    }
    
    console.log('🗺️ Hall Layout Visualization (0.5m grid):');
    console.log('Legend: · = empty, 0-9 = existing stalls, N = new stall');
    grid.forEach((row, y) => {
      console.log(`${(y * 0.5).toFixed(1).padStart(4)}m | ${row.join('')}`);
    });
  };

  // Enhanced function to find next available position for a new stall - intelligent space management
  const findNextAvailablePosition = (
    width: number,
    height: number,
    existingStalls: any[],
    hallWidth: number,
    hallHeight: number
  ): { position: { x: number; y: number }; hasSpace: boolean; reason?: string } => {
    // Minimum gap between stalls (0.5m for better space utilization)
    const MIN_GAP = 0.5;
    
    // Safe area around stalls for proper spacing
    const SAFE_MARGIN = MIN_GAP;
    
    console.log(`🔍 Finding position for ${width}m × ${height}m stall in hall ${hallWidth}m × ${hallHeight}m`);
    console.log(`📊 Existing stalls in hall: ${existingStalls.length}`);

    // Function to check if a position is valid (no overlaps and within bounds)
    const isPositionValid = (x: number, y: number, debugLog = false) => {
      if (debugLog) {
        console.log(`🧪 Testing position (${x}, ${y}) for ${width}×${height}m stall`);
      }
      
      // Check hall boundaries with margin
      if (x < 0 || y < 0 || x + width > hallWidth || y + height > hallHeight) {
        if (debugLog) console.log(`❌ Out of bounds: (${x}, ${y}) + ${width}×${height} exceeds hall ${hallWidth}×${hallHeight}m`);
        return false;
      }

      // Check collision with existing stalls
      for (const stall of existingStalls) {
        const sx = stall.dimensions?.x || 0;
        const sy = stall.dimensions?.y || 0;
        const sw = stall.dimensions?.width || 0;
        const sh = stall.dimensions?.height || 0;

        // Check if rectangles overlap with gap consideration
        const overlap = !(
          x + width + SAFE_MARGIN <= sx ||   // New stall is completely to the left
          x >= sx + sw + SAFE_MARGIN ||      // New stall is completely to the right
          y + height + SAFE_MARGIN <= sy ||  // New stall is completely above
          y >= sy + sh + SAFE_MARGIN         // New stall is completely below
        );

        if (overlap) {
          if (debugLog) {
            console.log(`❌ Overlaps with existing stall at (${sx}, ${sy}) ${sw}×${sh}m`);
          }
          return false;
        }
      }

      if (debugLog) {
        console.log(`✅ Position (${x}, ${y}) is valid!`);
      }
      return true;
    };
    
    // DEBUG: Test origin position early to detect existing overlaps
    const originAvailable = isPositionValid(0, 0, false);
    console.log(`🎯 Origin (0,0) available: ${originAvailable ? '✅ YES' : '❌ NO (already occupied)'}`);

    // Strategy 1: Try optimal placement next to existing stalls (for clustering)
    if (existingStalls.length > 0) {
      console.log('🎯 Attempting optimal placement next to existing stalls...');
      
      // Sort stalls for systematic placement
      const sortedStalls = [...existingStalls].sort((a, b) => {
        if (Math.abs(a.dimensions.y - b.dimensions.y) < 0.1) {
          return a.dimensions.x - b.dimensions.x; // Same row, sort by x
        }
        return a.dimensions.y - b.dimensions.y; // Sort by y first
      });

      for (const stall of sortedStalls) {
        const sx = stall.dimensions.x;
        const sy = stall.dimensions.y;
        const sw = stall.dimensions.width;
        const sh = stall.dimensions.height;

        // Try multiple positions around each existing stall (right, below, left, above)
        const candidatePositions = [
          // Right of stall (preferred - natural reading order)
          { x: snapToHalfGrid(sx + sw + MIN_GAP), y: snapToHalfGrid(sy), priority: 1 },
          
          // Below stall (second preference)
          { x: snapToHalfGrid(sx), y: snapToHalfGrid(sy + sh + MIN_GAP), priority: 2 },
          
          // Below stall, aligned to left edge of hall
          { x: 0, y: snapToHalfGrid(sy + sh + MIN_GAP), priority: 3 },
          
          // Right of stall, but aligned to top of hall
          { x: snapToHalfGrid(sx + sw + MIN_GAP), y: 0, priority: 4 },
          
          // Left of stall (if there's space)
          { x: snapToHalfGrid(sx - width - MIN_GAP), y: snapToHalfGrid(sy), priority: 5 },
          
          // Above stall (least preferred)
          { x: snapToHalfGrid(sx), y: snapToHalfGrid(sy - height - MIN_GAP), priority: 6 }
        ];

        // Try positions in order of preference
        candidatePositions.sort((a, b) => a.priority - b.priority);
        
        for (const pos of candidatePositions) {
          if (isPositionValid(pos.x, pos.y)) {
            console.log(`✅ Found optimal position: (${pos.x}, ${pos.y}) - Priority ${pos.priority}`);
            debugVisualizeHallLayout(existingStalls, hallWidth, hallHeight, { x: pos.x, y: pos.y, width, height });
            return { 
              position: { x: pos.x, y: pos.y }, 
              hasSpace: true 
            };
          }
        }
      }
    }

    // Strategy 2: Systematic grid search for any available space
    console.log('🔍 Performing systematic grid search...');
    
    // Use smaller increments for better space utilization but with reasonable performance
    const GRID_INCREMENT = 0.5;
    let foundPositions = [];

    // Row-by-row search (top to bottom, left to right)
    for (let y = 0; y <= hallHeight - height; y += GRID_INCREMENT) {
      for (let x = 0; x <= hallWidth - width; x += GRID_INCREMENT) {
        const snappedX = snapToHalfGrid(x);
        const snappedY = snapToHalfGrid(y);
        
        if (isPositionValid(snappedX, snappedY)) {
          foundPositions.push({ 
            x: snappedX, 
            y: snappedY,
            // Prefer positions closer to origin (top-left)
            distance: Math.sqrt(snappedX * snappedX + snappedY * snappedY)
          });
          
          // For performance, limit search and return first good position
          if (foundPositions.length >= 10) break;
        }
      }
      if (foundPositions.length >= 10) break;
    }

    if (foundPositions.length > 0) {
      // Sort by distance to origin and return closest
      foundPositions.sort((a, b) => a.distance - b.distance);
      const bestPosition = foundPositions[0];
      console.log(`✅ Found grid position: (${bestPosition.x}, ${bestPosition.y})`);
      debugVisualizeHallLayout(existingStalls, hallWidth, hallHeight, { x: bestPosition.x, y: bestPosition.y, width, height });
      return { 
        position: { x: bestPosition.x, y: bestPosition.y }, 
        hasSpace: true 
      };
    }

    // Strategy 3: Fallback - try to fit anywhere with minimal constraints
    console.log('⚠️ Performing fallback search with relaxed constraints...');
    
    // Reduce gap requirement for emergency placement
    const EMERGENCY_GAP = 0.25;
    
    for (let y = 0; y <= hallHeight - height; y += 1) {
      for (let x = 0; x <= hallWidth - width; x += 1) {
        const snappedX = snapToHalfGrid(x);
        const snappedY = snapToHalfGrid(y);
        
        // Emergency check with reduced gap
        let canPlace = true;
        for (const stall of existingStalls) {
          const sx = stall.dimensions.x;
          const sy = stall.dimensions.y;
          const sw = stall.dimensions.width;
          const sh = stall.dimensions.height;

          const overlap = !(
            snappedX + width + EMERGENCY_GAP <= sx ||
            snappedX >= sx + sw + EMERGENCY_GAP ||
            snappedY + height + EMERGENCY_GAP <= sy ||
            snappedY >= sy + sh + EMERGENCY_GAP
          );

          if (overlap) {
            canPlace = false;
            break;
          }
        }
        
        if (canPlace) {
          console.log(`⚠️ Emergency position found: (${snappedX}, ${snappedY})`);
          debugVisualizeHallLayout(existingStalls, hallWidth, hallHeight, { x: snappedX, y: snappedY, width, height });
          return { 
            position: { x: snappedX, y: snappedY }, 
            hasSpace: true 
          };
        }
      }
    }

    // Last resort: Test if origin is actually available
    if (isPositionValid(0, 0, true)) {
      console.log('⚠️ Using origin (0,0) as fallback position');
      debugVisualizeHallLayout(existingStalls, hallWidth, hallHeight, { x: 0, y: 0, width, height });
      return { 
        position: { x: 0, y: 0 }, 
        hasSpace: true 
      };
    } else {
      console.error('❌ CRITICAL: Hall is completely full! No space for new stall.');
      console.error('🔧 DEBUG: Existing stalls that fill the hall:');
      existingStalls.forEach((stall, index) => {
        const sx = stall.dimensions?.x || 0;
        const sy = stall.dimensions?.y || 0;
        const sw = stall.dimensions?.width || 0;
        const sh = stall.dimensions?.height || 0;
        console.error(`   ${index + 1}. Stall at (${sx}, ${sy}) ${sw}×${sh}m`);
      });
      debugVisualizeHallLayout(existingStalls, hallWidth, hallHeight, { x: 0, y: 0, width, height });
      
      // Calculate hall utilization for informative error message
      const totalHallArea = hallWidth * hallHeight;
      const occupiedArea = existingStalls.reduce((total, stall) => {
        const sw = stall.dimensions?.width || 0;
        const sh = stall.dimensions?.height || 0;
        return total + (sw * sh);
      }, 0);
      const utilizationPercent = ((occupiedArea / totalHallArea) * 100).toFixed(1);
      
      return { 
        position: { x: 0, y: 0 }, // Dummy position
        hasSpace: false,
        reason: `Hall is ${utilizationPercent}% occupied. Not enough space for a ${width}×${height}m stall.`
      };
    }
  };

  // Update form values when stall or hall changes
  useEffect(() => {
    if (stall && visible) {
      console.log('Setting form values for stall:', stall); // Added logging
      
      // When editing existing stall
      const currentShapeType = stall.dimensions.shapeType || 'rectangle';
      setShapeType(currentShapeType);
      
      // Handle stallTypeId - it might be an object or string
      let stallTypeIdValue: string;
      if (typeof stall.stallTypeId === 'string') {
        stallTypeIdValue = stall.stallTypeId;
      } else if (stall.stallTypeId && typeof stall.stallTypeId === 'object') {
        stallTypeIdValue = (stall.stallTypeId as any)._id || (stall.stallTypeId as any).id;
      } else {
        stallTypeIdValue = '';
      }
      
      const formValues = {
        number: stall.number,
        stallTypeId: stallTypeIdValue,
        shapeType: currentShapeType,
        width: stall.dimensions.width,
        height: stall.dimensions.height,
        // L-shape values - handle both new corner-based and old orientation values
        rect1Width: stall.dimensions.lShape?.rect1Width || 0,
        rect1Height: stall.dimensions.lShape?.rect1Height || 0,
        rect2Width: stall.dimensions.lShape?.rect2Width || 0,
        rect2Height: stall.dimensions.lShape?.rect2Height || 0,
        orientation: stall.dimensions.lShape?.orientation || 'bottom-left',
        ratePerSqm: stall.ratePerSqm,
        status: stall.status
      };
      console.log('Form values to set:', formValues); // Added logging
      
      // Use setTimeout to ensure form is rendered before setting values
      setTimeout(() => {
        form.setFieldsValue(formValues);
        // Ensure shape type state is properly set after form values
        setShapeType(currentShapeType);
      }, 0);
      
      // Calculate initial area
      setPreviewArea(calculateStallArea(stall.dimensions));
    } else if (hall && visible && !stall) {
      // Only set defaults for new stalls
      const defaultWidth = Math.min(20, hall.dimensions.width / 4);
      const defaultHeight = Math.min(20, hall.dimensions.height / 4);
      
      form.setFieldsValue({
        shapeType: 'rectangle',
        status: 'available',
        width: defaultWidth,
        height: defaultHeight,
        // L-shape defaults
        rect1Width: Math.floor(defaultWidth * 0.6),
        rect1Height: defaultHeight,
        rect2Width: Math.floor(defaultWidth * 0.4),
        rect2Height: Math.floor(defaultHeight * 0.6),
        orientation: 'bottom-left',
        ratePerSqm: 0
      });
      
      setShapeType('rectangle');
      setPreviewArea(defaultWidth * defaultHeight);
    }
  }, [stall, hall, form, visible]);

  // Clean up form when modal is closed
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setShapeType('rectangle');
      setPreviewArea(0);
    }
  }, [visible, form]);

  // Fetch stall types when form is opened
  useEffect(() => {
    const fetchStallTypes = async () => {
      try {
        setLoading(true);
        const response = await stallService.getStallTypes();
        console.log('Fetched stall types:', response.data); // Added logging
        
        // Filter stall types to only show those configured in the exhibition
        const configuredStallTypeIds = exhibition.stallRates?.map(rate => rate.stallTypeId) || [];
        console.log('Configured stall type IDs:', configuredStallTypeIds); // Added logging
        
        const filteredStallTypes = response.data.filter(type => 
          type.status === 'active' && type._id && configuredStallTypeIds.includes(type._id)
        );
        console.log('Filtered stall types:', filteredStallTypes); // Added logging
        setStallTypes(filteredStallTypes);
      } catch (error) {
        console.error('Failed to fetch stall types:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchStallTypes();
    }
  }, [visible, exhibition.stallRates]);

  // Show rate when stall type is selected
  const handleStallTypeChange = (stallTypeId: string) => {
    console.log('Stall type changed to:', stallTypeId); // Added logging
    const stallRate = exhibition.stallRates?.find(rate => rate.stallTypeId === stallTypeId);
    console.log('Found stall rate:', stallRate); // Added logging
    if (stallRate) {
      form.setFieldsValue({ ratePerSqm: stallRate.rate });
    }
  };

  // Handle shape type change
  const handleShapeTypeChange = (newShapeType: 'rectangle' | 'l-shape') => {
    setShapeType(newShapeType);
    updatePreviewArea();
  };

  // Update area preview when dimensions change
  const updatePreviewArea = () => {
    const values = form.getFieldsValue();
    const currentShapeType = values.shapeType || 'rectangle';
    
    if (currentShapeType === 'rectangle') {
      const area = (values.width || 0) * (values.height || 0);
      setPreviewArea(area);
    } else if (currentShapeType === 'l-shape') {
      const rect1Area = (values.rect1Width || 0) * (values.rect1Height || 0);
      const rect2Area = (values.rect2Width || 0) * (values.rect2Height || 0);
      setPreviewArea(rect1Area + rect2Area);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setShapeType('rectangle');
    setPreviewArea(0);
    onCancel();
  };

  const handleSubmit = () => {
    console.log('Hall data:', hall); // Debug log

    if (!hall || (!hall._id && !hall.id)) {
      message.error('Invalid hall selected. Please try again.');
      return;
    }

    form.validateFields().then(values => {
      const hallId = hall._id || hall.id;
      if (!hallId) {
        message.error('Hall ID is missing. Please select a hall again.');
        return;
      }

      // For new stalls, find the next available position
      // For existing stalls, keep their position
      let stallPosition;
      if (stall) {
        // Editing existing stall - keep current position
        stallPosition = {
          x: stall.dimensions.x,
          y: stall.dimensions.y
        };
      } else {
        // Creating new stall - find optimal position
        console.log('🏗️ Creating new stall - finding optimal placement...');
        
        // Filter stalls by current hall and ensure we have valid data
        console.log('🔍 Debug - All available stalls:', exhibition.stalls?.length || 0);
        console.log('🔍 Debug - Target hall ID:', hallId);
        console.log('🔍 Debug - Hall object:', { id: hall.id, _id: hall._id, name: hall.name });
        
        const hallStalls = exhibition.stalls?.filter((s: Stall) => {
          const stallHallId = s.hallId;
          console.log(`🔍 Debug - Stall ${s.number} hall ID: "${stallHallId}" vs target: "${hallId}"`);
          return stallHallId === hallId;
        }) || [];
        
        console.log(`📋 Hall ${hall.name || 'Unnamed'} (${hallId}) dimensions: ${hall.dimensions.width}m × ${hall.dimensions.height}m`);
        console.log(`🏢 Found ${hallStalls.length} existing stalls in this hall`);
        
        if (hallStalls.length > 0) {
          console.log('🏢 Existing stalls positions:');
          hallStalls.forEach((stall, index) => {
            console.log(`   ${index + 1}. Stall ${stall.number}: (${stall.dimensions?.x || 0}, ${stall.dimensions?.y || 0}) ${stall.dimensions?.width || 0}×${stall.dimensions?.height || 0}m`);
          });
        }
        
        // Check hall utilization before attempting placement
        const utilization = calculateHallUtilization(
          hallStalls,
          hall.dimensions.width,
          hall.dimensions.height
        );
        
        console.log(`📊 Hall utilization: ${utilization.utilizationPercent.toFixed(1)}% (${utilization.occupiedArea}m² / ${utilization.totalArea}m²)`);
        
        // Early warning for nearly full halls
        if (utilization.isNearlyFull && !utilization.isFull) {
          message.warning(`Hall is ${utilization.utilizationPercent.toFixed(1)}% occupied. Limited space remaining.`);
        }
        
        const spaceResult = findNextAvailablePosition(
          values.width,
          values.height,
          hallStalls,
          hall.dimensions.width,
          hall.dimensions.height
        );
        
        // Check if there's enough space in the hall
        if (!spaceResult.hasSpace) {
          message.error(spaceResult.reason || 'Not enough space in the hall for this stall.');
          return;
        }
        
        stallPosition = spaceResult.position;
        console.log(`📍 Selected position for new stall: (${stallPosition.x}m, ${stallPosition.y}m)`);
      }

      const currentShapeType = values.shapeType || 'rectangle';
      
      const stallData: Stall = {
        id: stall?.id,
        _id: stall?._id,
        number: values.number,
        stallTypeId: values.stallTypeId,
        dimensions: {
          x: stallPosition.x,
          y: stallPosition.y,
          width: currentShapeType === 'rectangle' ? values.width : Math.max(values.rect1Width, values.rect2Width),
          height: currentShapeType === 'rectangle' ? values.height : Math.max(values.rect1Height, values.rect2Height),
          shapeType: currentShapeType,
          ...(currentShapeType === 'l-shape' && {
            lShape: {
              rect1Width: values.rect1Width,
              rect1Height: values.rect1Height,
              rect2Width: values.rect2Width,
              rect2Height: values.rect2Height,
              orientation: values.orientation
            }
          })
        },
        ratePerSqm: values.ratePerSqm,
        status: values.status,
        hallId
      };

      console.log('Submitting stall data:', stallData);
      onSubmit(stallData);
    });
  };

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

  return (
    <>
      <Modal
        title={
          <Space>
            <ShopOutlined style={{ fontSize: '20px' }} />
            <Title level={4} style={{ margin: 0 }}>
              {stall ? 'Edit Stall' : 'Add Stall'}
            </Title>
          </Space>
        }
        open={visible}
        onCancel={handleCancel}
        destroyOnHidden={true}
        forceRender
        width={480}
        centered
        footer={[
          <Space key="footer-buttons" size="middle">
            {stall && onDelete && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(stall)}
              >
                Delete
              </Button>
            )}
            <Button onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              {stall ? 'Save Changes' : 'Create'}
            </Button>
          </Space>
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          preserve={false}
          requiredMark="optional"
          style={{ padding: '12px 0' }}
        >
          <Form.Item
            name="number"
            label="Stall Number"
            rules={[{ required: true, message: 'Please enter stall number' }]}
          >
            <Input 
              placeholder="Enter stall number"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="stallTypeId"
            label="Stall Type"
            rules={[{ required: true, message: 'Please select stall type' }]}
          >
            <Select
              loading={loading}
              placeholder="Select stall type"
              size="large"
              onChange={handleStallTypeChange}
            >
              {stallTypes.map(type => (
                <Select.Option key={type._id} value={type._id}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {/* Hall Utilization Display - Only show for new stalls */}
          {!stall && hall && exhibition.stalls && (
            <>
              <Divider orientation="left" plain style={{ margin: '20px 0 16px 0' }}>
                Hall Space Utilization
              </Divider>
              
              {(() => {
                const hallId = hall._id || hall.id;
                const hallStalls = exhibition.stalls?.filter((s: Stall) => s.hallId === hallId) || [];
                const utilization = calculateHallUtilization(
                  hallStalls,
                  hall.dimensions.width,
                  hall.dimensions.height
                );
                
                return (
                  <Card 
                    size="small" 
                    style={{ 
                      marginBottom: '20px',
                      background: utilization.isFull ? '#fff2f0' : utilization.isNearlyFull ? '#fffbe6' : '#f6ffed'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <Text strong>
                        {hall.name || 'Hall'} ({hall.dimensions.width}m × {hall.dimensions.height}m)
                      </Text>
                      <Text 
                        style={{ 
                          color: utilization.isFull ? '#ff4d4f' : utilization.isNearlyFull ? '#faad14' : '#52c41a',
                          fontWeight: 'bold'
                        }}
                      >
                        {utilization.utilizationPercent.toFixed(1)}% occupied
                      </Text>
                    </div>
                    
                    <div style={{ 
                      width: '100%', 
                      height: '6px', 
                      background: '#f0f0f0', 
                      borderRadius: '3px',
                      marginBottom: '8px'
                    }}>
                      <div 
                        style={{ 
                          width: `${Math.min(utilization.utilizationPercent, 100)}%`, 
                          height: '100%', 
                          background: utilization.isFull ? '#ff4d4f' : utilization.isNearlyFull ? '#faad14' : '#52c41a',
                          borderRadius: '3px',
                          transition: 'all 0.3s ease'
                        }} 
                      />
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
                      <span>{utilization.occupiedArea.toFixed(1)}m² occupied</span>
                      <span>{utilization.freeArea.toFixed(1)}m² free</span>
                    </div>
                    
                    {utilization.isNearlyFull && (
                      <div style={{ 
                        marginTop: '8px', 
                        padding: '6px 10px', 
                        background: utilization.isFull ? '#ffccc7' : '#fff1b8',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: utilization.isFull ? '#a8071a' : '#ad6800'
                      }}>
                        {utilization.isFull ? (
                          '⚠️ Hall is nearly full. Placement may be limited.'
                        ) : (
                          '⚠️ Hall space is running low. Consider dimensions carefully.'
                        )}
                      </div>
                    )}
                  </Card>
                );
              })()}
            </>
          )}

          <Divider orientation="left" plain style={{ margin: '24px 0' }}>
            Shape & Dimensions
          </Divider>

          <Form.Item
            name="shapeType"
            label="Stall Shape"
            rules={[{ required: true, message: 'Please select shape type' }]}
          >
            <Select
              placeholder="Select stall shape"
              size="large"
              onChange={handleShapeTypeChange}
            >
              <Select.Option value="rectangle">
                <Space>
                  <span>📐</span>
                  Rectangle
                </Space>
              </Select.Option>
              <Select.Option value="l-shape">
                <Space>
                  <span>📐</span>
                  L-Shape
                </Space>
              </Select.Option>
            </Select>
          </Form.Item>

          {shapeType === 'rectangle' && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="width"
                  label="Width (meters)"
                  rules={[
                    { required: true, message: 'Please enter width' },
                    { type: 'number', min: 1, message: 'Width must be at least 1 meter' },
                    { type: 'number', max: hall?.dimensions.width || 100, message: 'Width cannot exceed hall width' }
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={hall?.dimensions.width || 100}
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="Width"
                    addonAfter="m"
                    onChange={updatePreviewArea}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="height"
                  label="Height (meters)"
                  rules={[
                    { required: true, message: 'Please enter height' },
                    { type: 'number', min: 1, message: 'Height must be at least 1 meter' },
                    { type: 'number', max: hall?.dimensions.height || 100, message: 'Height cannot exceed hall height' }
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={hall?.dimensions.height || 100}
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="Height"
                    addonAfter="m"
                    onChange={updatePreviewArea}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {shapeType === 'l-shape' && (
            <>
              <Card 
                size="small" 
                title="Rectangle 1 Dimensions" 
                style={{ marginBottom: '16px' }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="rect1Width"
                      label="Width (meters)"
                      rules={[
                        { required: true, message: 'Please enter width' },
                        { type: 'number', min: 1, message: 'Width must be at least 1 meter' }
                      ]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        size="large"
                        placeholder="Width"
                        addonAfter="m"
                        onChange={updatePreviewArea}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="rect1Height"
                      label="Height (meters)"
                      rules={[
                        { required: true, message: 'Please enter height' },
                        { type: 'number', min: 1, message: 'Height must be at least 1 meter' }
                      ]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        size="large"
                        placeholder="Height"
                        addonAfter="m"
                        onChange={updatePreviewArea}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Card 
                size="small" 
                title="Rectangle 2 Dimensions" 
                style={{ marginBottom: '16px' }}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="rect2Width"
                      label="Width (meters)"
                      rules={[
                        { required: true, message: 'Please enter width' },
                        { type: 'number', min: 1, message: 'Width must be at least 1 meter' }
                      ]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        size="large"
                        placeholder="Width"
                        addonAfter="m"
                        onChange={updatePreviewArea}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="rect2Height"
                      label="Height (meters)"
                      rules={[
                        { required: true, message: 'Please enter height' },
                        { type: 'number', min: 1, message: 'Height must be at least 1 meter' }
                      ]}
                    >
                      <InputNumber
                        min={1}
                        style={{ width: '100%' }}
                        size="large"
                        placeholder="Height"
                        addonAfter="m"
                        onChange={updatePreviewArea}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="orientation"
                  label="L-Shape Corner Placement"
                  rules={[{ required: true, message: 'Please select corner placement' }]}
                >
                  <Select
                    placeholder="Select corner placement"
                    size="large"
                  >
                    <Select.Option value="top-left">
                      <Space>
                        <span>┌</span>
                        Top-Left Corner
                      </Space>
                    </Select.Option>
                    <Select.Option value="top-right">
                      <Space>
                        <span>┐</span>
                        Top-Right Corner
                      </Space>
                    </Select.Option>
                    <Select.Option value="bottom-left">
                      <Space>
                        <span>└</span>
                        Bottom-Left Corner
                      </Space>
                    </Select.Option>
                    <Select.Option value="bottom-right">
                      <Space>
                        <span>┘</span>
                        Bottom-Right Corner
                      </Space>
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Card>
            </>
          )}

          {/* Area Preview */}
          <Card 
            size="small" 
            style={{ 
              background: '#f6ffed', 
              border: '1px solid #b7eb8f',
              marginBottom: '16px'
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Space>
                  <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                    📐 Total Area:
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#389e0d' }}>
                    {previewArea.toFixed(2)} sqm
                  </span>
                </Space>
              </Col>
              <Col>
                <span style={{ color: '#73d13d' }}>
                  Real-time calculation
                </span>
              </Col>
            </Row>
          </Card>

          <Divider orientation="left" plain style={{ margin: '24px 0' }}>
            Details
          </Divider>

          <Form.Item
            name="ratePerSqm"
            label="Rate per sq.m (₹)"
            rules={[
              { required: true, message: 'Please select a stall type to set the rate' }
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              size="large"
              placeholder="Rate will be set based on stall type"
              prefix="₹"
              disabled
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: string | undefined) => {
                const parsed = value ? Number(value.replace(/\₹\s?|(,*)/g, '')) : 0;
                return isNaN(parsed) ? 0 : parsed;
              }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select 
              placeholder="Select status"
              size="large"
              style={{ borderRadius: '6px' }}
            >
              <Select.Option value="available">
                <Space>
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    background: getStatusColor('available') 
                  }} />
                  Available
                </Space>
              </Select.Option>
              <Select.Option value="booked">
                <Space>
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    background: getStatusColor('booked') 
                  }} />
                  Booked
                </Space>
              </Select.Option>
              <Select.Option value="reserved">
                <Space>
                  <div style={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    background: getStatusColor('reserved') 
                  }} />
                  Reserved
                </Space>
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default StallForm; 