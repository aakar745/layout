import React from 'react';
import { Form, Input, InputNumber, Modal, Button, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Hall } from '../../../services/exhibition';

interface HallFormProps {
  visible: boolean;
  hall: Hall | null;
  exhibitionWidth: number;
  exhibitionHeight: number;
  onCancel: () => void;
  onSubmit: (hall: Hall) => void;
  onDelete?: (hall: Hall) => void;
}

const HallForm: React.FC<HallFormProps> = ({
  visible,
  hall,
  exhibitionWidth,
  exhibitionHeight,
  onCancel,
  onSubmit,
  onDelete
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      if (hall) {
        form.setFieldsValue({
          name: hall.name,
          width: hall.dimensions.width,
          height: hall.dimensions.height
        });
      } else {
        form.setFieldsValue({
          name: '',
          width: Math.min(10, exhibitionWidth),
          height: Math.min(10, exhibitionHeight)
        });
      }
    }
  }, [visible, hall, exhibitionWidth, exhibitionHeight, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    
    const newHall: Hall = hall 
      ? {
          ...hall,
          _id: hall._id,
          id: hall.id || hall._id,
          name: values.name,
          dimensions: {
            x: hall.dimensions?.x || 0,
            y: hall.dimensions?.y || 0,
            width: values.width,
            height: values.height
          },
          exhibitionId: hall.exhibitionId
        }
      : {
          name: values.name,
          dimensions: {
            x: 0,
            y: 0,
            width: values.width,
            height: values.height
          }
        };

    onSubmit(newHall);
    form.resetFields();
  };

  const handleDeleteClick = () => {
    if (hall && onDelete) {
      Modal.confirm({
        title: 'Delete Hall',
        content: `Are you sure you want to delete hall "${hall.name}"? This action cannot be undone.`,
        okText: 'Yes, Delete',
        cancelText: 'No, Cancel',
        okButtonProps: {
          className: 'confirm-delete-button'
        },
        centered: true,
        onOk: () => onDelete(hall)
      });
    }
  };

  return (
    <Modal
      title={hall ? 'Edit Hall' : 'Add New Hall'}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={400}
      destroyOnHidden
      className="hall-form-modal"
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '16px' }}
      >
        <Form.Item
          name="name"
          label={<span style={{ color: '#000' }}>Hall Name <span style={{ color: '#ff4d4f' }}>*</span></span>}
          rules={[{ required: true, message: 'Please enter hall name' }]}
        >
          <Input placeholder="Enter hall name" />
        </Form.Item>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '16px'
        }}>
          <Form.Item
            name="width"
            label={<span style={{ color: '#000' }}>Width (meters) <span style={{ color: '#ff4d4f' }}>*</span></span>}
            rules={[
              { required: true, message: 'Please enter width' },
              { type: 'number', min: 5, message: 'Width must be at least 5 meters' },
              { type: 'number', max: exhibitionWidth, message: `Width cannot exceed ${exhibitionWidth} meters` }
            ]}
          >
            <InputNumber
              min={5}
              max={exhibitionWidth}
              style={{ width: '100%' }}
              placeholder="Enter width"
            />
          </Form.Item>

          <Form.Item
            name="height"
            label={<span style={{ color: '#000' }}>Height (meters) <span style={{ color: '#ff4d4f' }}>*</span></span>}
            rules={[
              { required: true, message: 'Please enter height' },
              { type: 'number', min: 5, message: 'Height must be at least 5 meters' },
              { type: 'number', max: exhibitionHeight, message: `Height cannot exceed ${exhibitionHeight} meters` }
            ]}
          >
            <InputNumber
              min={5}
              max={exhibitionHeight}
              style={{ width: '100%' }}
              placeholder="Enter height"
            />
          </Form.Item>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '32px',
          gap: '8px'
        }}>
          <Space>
            {hall && onDelete && (
              <Button
                className="delete-button"
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
              >
                Delete Hall
              </Button>
            )}
          </Space>
          <Space>
            <Button 
              onClick={() => {
                form.resetFields();
                onCancel();
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary"
              onClick={handleSubmit}
              className="update-button"
            >
              {hall ? 'Update Hall' : 'Create Hall'}
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default HallForm; 