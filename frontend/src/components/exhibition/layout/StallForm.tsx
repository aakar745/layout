import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Modal, Button, Space, Select, Divider, Typography, message } from 'antd';
import { DeleteOutlined, ShopOutlined } from '@ant-design/icons';
import { Stall, Hall, Exhibition } from '../../../services/exhibition';
import stallService, { StallType } from '../../../services/stall';

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

  // Function to find next available position for a new stall
  const findNextAvailablePosition = (
    width: number,
    height: number,
    existingStalls: any[],
    hallWidth: number,
    hallHeight: number
  ) => {
    // Grid size for snapping
    const GRID_SIZE = 5;
    
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
      // Try right side
      const rightX = stall.dimensions.x + stall.dimensions.width + 1;
      const rightY = stall.dimensions.y;
      if (isPositionValid(rightX, rightY)) {
        return { x: rightX, y: rightY };
      }

      // Try below
      const bottomX = stall.dimensions.x;
      const bottomY = stall.dimensions.y + stall.dimensions.height + 1;
      if (isPositionValid(bottomX, bottomY)) {
        return { x: bottomX, y: bottomY };
      }
    }

    // If no position found next to existing stalls, try grid positions
    for (let y = 0; y < hallHeight; y += GRID_SIZE) {
      for (let x = 0; x < hallWidth; x += GRID_SIZE) {
        if (isPositionValid(x, y)) {
          return { x, y };
        }
      }
    }

    // If no position found, return default position
    return { x: 0, y: 0 };
  };

  // Update form values when stall or hall changes
  useEffect(() => {
    if (stall) {
      console.log('Setting form values for stall:', stall); // Added logging
      // When editing existing stall
      const formValues = {
        number: stall.number,
        stallTypeId: stall.stallTypeId,
        width: stall.dimensions.width,
        height: stall.dimensions.height,
        ratePerSqm: stall.ratePerSqm,
        status: stall.status
      };
      console.log('Form values to set:', formValues); // Added logging
      form.setFieldsValue(formValues);
    } else if (hall && !form.getFieldValue('status')) {
      // Only set defaults for new stalls
      form.setFieldsValue({
        status: 'available',
        width: Math.min(20, hall.dimensions.width / 4),
        height: Math.min(20, hall.dimensions.height / 4),
        ratePerSqm: 0
      });
    }
  }, [stall, hall, form]);

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

  const handleCancel = () => {
    form.resetFields();
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

      const stallData: Stall = {
        id: stall?.id,
        _id: stall?._id,
        number: values.number,
        stallTypeId: values.stallTypeId,
        dimensions: {
          x: stallPosition.x,
          y: stallPosition.y,
          width: values.width,
          height: values.height
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
        destroyOnClose={true}
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
            Dimensions
          </Divider>

          <Space style={{ width: '100%', gap: '16px' }}>
            <Form.Item
              name="width"
              label="Width (meters)"
              rules={[
                { required: true, message: 'Please enter width' },
                { type: 'number', min: 1, message: 'Width must be at least 1 meter' },
                { type: 'number', max: hall?.dimensions.width || 100, message: 'Width cannot exceed hall width' }
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                min={1}
                max={hall?.dimensions.width || 100}
                style={{ width: '100%' }}
                size="large"
                placeholder="Width"
                addonAfter="m"
              />
            </Form.Item>

            <Form.Item
              name="height"
              label="Height (meters)"
              rules={[
                { required: true, message: 'Please enter height' },
                { type: 'number', min: 1, message: 'Height must be at least 1 meter' },
                { type: 'number', max: hall?.dimensions.height || 100, message: 'Height cannot exceed hall height' }
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                min={1}
                max={hall?.dimensions.height || 100}
                style={{ width: '100%' }}
                size="large"
                placeholder="Height"
                addonAfter="m"
              />
            </Form.Item>
          </Space>

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