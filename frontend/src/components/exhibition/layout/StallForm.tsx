import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Button, Space, Select, Divider, Typography, message, Row, Col, Card } from 'antd';
import { DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import { Stall, Hall, Exhibition } from '../../../services/exhibition';
import stallService, { StallType } from '../../../services/stall';
import { calculateStallArea } from '../../../utils/stallUtils';

const { Title } = Typography;

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
  const [form] = Form.useForm();
  const [stallTypes, setStallTypes] = useState<StallType[]>([]);
  const [loading, setLoading] = useState(false);
  const [shapeType, setShapeType] = useState<'rectangle' | 'l-shape'>('rectangle');
  const [previewArea, setPreviewArea] = useState<number>(0);

  // Helper function to snap to half-grid positions (0.5m intervals)
  const snapToHalfGrid = (value: number) => {
    return Math.round(value * 2) / 2;
  };

  // Function to find next available position for a new stall
  const findNextAvailablePosition = (
    width: number,
    height: number,
    existingStalls: any[],
    hallWidth: number,
    hallHeight: number
  ) => {
    // Grid size for snapping - use 2.5m to align with half-grid system
    const GRID_SIZE = 2.5;
    
    // Sort existing stalls by position for efficient placement
    const sortedStalls = [...existingStalls].sort((a, b) => {
      const aY = Math.floor(a.dimensions.y / GRID_SIZE);
      const bY = Math.floor(b.dimensions.y / GRID_SIZE);
      if (aY === bY) {
        return a.dimensions.x - b.dimensions.x;
      }
      return a.dimensions.y - b.dimensions.y;
    });

    // Function to check if a position is valid
    const isPositionValid = (x: number, y: number) => {
      // Check hall boundaries
      if (x + width > hallWidth || y + height > hallHeight) {
        return false;
      }

      // Check collision with existing stalls
      return !sortedStalls.some(stall => {
        const sx = stall.dimensions.x;
        const sy = stall.dimensions.y;
        const sw = stall.dimensions.width;
        const sh = stall.dimensions.height;

        // Add a small gap between stalls (1 meter)
        const GAP = 1;
        
        return !(x + width + GAP <= sx || x >= sx + sw + GAP ||
                y + height + GAP <= sy || y >= sy + sh + GAP);
      });
    };

    // Try to place next to existing stalls first
    for (const stall of sortedStalls) {
      // Try right side with half-grid snapping
      const rightX = snapToHalfGrid(stall.dimensions.x + stall.dimensions.width + 0.5);
      const rightY = snapToHalfGrid(stall.dimensions.y);
      if (isPositionValid(rightX, rightY)) {
        return { x: rightX, y: rightY };
      }

      // Try below with half-grid snapping
      const bottomX = snapToHalfGrid(stall.dimensions.x);
      const bottomY = snapToHalfGrid(stall.dimensions.y + stall.dimensions.height + 0.5);
      if (isPositionValid(bottomX, bottomY)) {
        return { x: bottomX, y: bottomY };
      }
    }

    // If no position found next to existing stalls, try grid positions with half-grid increments
    for (let y = 0; y < hallHeight; y += 0.5) {
      for (let x = 0; x < hallWidth; x += 0.5) {
        const snappedX = snapToHalfGrid(x);
        const snappedY = snapToHalfGrid(y);
        if (isPositionValid(snappedX, snappedY)) {
          return { x: snappedX, y: snappedY };
        }
      }
    }

    // If no position found, return default position
    return { x: 0, y: 0 };
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
      const stallPosition = stall ? {
        x: stall.dimensions.x,
        y: stall.dimensions.y
      } : findNextAvailablePosition(
        values.width,
        values.height,
        exhibition.stalls?.filter((s: Stall) => s.hallId === hallId) || [],
        hall.dimensions.width,
        hall.dimensions.height
      );

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