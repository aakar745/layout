import React from 'react';
import { Form, InputNumber, Modal } from 'antd';

interface ExhibitionSpaceFormProps {
  visible: boolean;
  width: number;
  height: number;
  onCancel: () => void;
  onSubmit: (dimensions: { width: number; height: number }) => void;
}

const ExhibitionSpaceForm: React.FC<ExhibitionSpaceFormProps> = ({
  visible,
  width,
  height,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({ width, height });
    }
  }, [visible, width, height, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Edit Exhibition Space"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleSubmit}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ width, height }}
      >
        <Form.Item
          name="width"
          label="Width (meters)"
          rules={[
            { required: true, message: 'Please enter width' },
            { type: 'number', min: 10, message: 'Width must be at least 10 meters' }
          ]}
        >
          <InputNumber
            min={10}
            max={1000}
            style={{ width: '100%' }}
            placeholder="Enter width in meters"
          />
        </Form.Item>

        <Form.Item
          name="height"
          label="Height (meters)"
          rules={[
            { required: true, message: 'Please enter height' },
            { type: 'number', min: 10, message: 'Height must be at least 10 meters' }
          ]}
        >
          <InputNumber
            min={10}
            max={1000}
            style={{ width: '100%' }}
            placeholder="Enter height in meters"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExhibitionSpaceForm; 