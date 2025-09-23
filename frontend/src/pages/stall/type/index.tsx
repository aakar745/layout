import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Input, Typography, Row, Col, Tag, Modal, Form, App, Select } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import stallService, { StallType } from '../../../services/stall';
import '../../dashboard/Dashboard.css';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Search } = Input;
const { Option } = Select;

const StallTypePage: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stallTypes, setStallTypes] = useState<StallType[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [editingStallType, setEditingStallType] = useState<StallType | null>(null);

  useEffect(() => {
    fetchStallTypes();
  }, []);

  useEffect(() => {
    console.log('Modal visibility changed:', isModalVisible);
    console.log('Editing stall type:', editingStallType);
    
    if (isModalVisible && editingStallType) {
      const features = editingStallType.features?.map(f => f.feature).join(', ') || '';
      console.log('Setting form values:', {
        name: editingStallType.name,
        description: editingStallType.description,
        features: features,
        status: editingStallType.status
      });
      
      setTimeout(() => {
        form.setFieldsValue({
          name: editingStallType.name,
          description: editingStallType.description,
          features: features,
          status: editingStallType.status
        });
      }, 0);
    } else if (isModalVisible) {
      form.resetFields();
      form.setFieldsValue({
        status: 'active'
      });
    }
  }, [editingStallType, form, isModalVisible]);

  const fetchStallTypes = async () => {
    try {
      setTableLoading(true);
      const response = await stallService.getStallTypes();
      setStallTypes(response.data);
    } catch (error: any) {
      message.error('Failed to fetch stall types: ' + error.message);
    } finally {
      setTableLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      console.log('Form values:', values);
      
      const data = {
        name: values.name,
        description: values.description,
        status: values.status,
        features: values.features ? values.features.split(',').map((feature: string) => ({
          feature: feature.trim()
        })) : []
      };

      console.log('Submitting data:', data);

      if (editingStallType) {
        await stallService.updateStallType(editingStallType._id!, data);
        message.success('Stall type updated successfully');
      } else {
        await stallService.createStallType(data);
        message.success('Stall type created successfully');
      }
      
      setIsModalVisible(false);
      setEditingStallType(null);
      form.resetFields();
      fetchStallTypes();
    } catch (error: any) {
      message.error(`Failed to ${editingStallType ? 'update' : 'create'} stall type: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record: StallType) => {
    console.log('Editing stall type:', record);
    setEditingStallType(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (record: StallType) => {
    try {
      await stallService.deleteStallType(record._id!);
      message.success('Stall type deleted successfully');
      fetchStallTypes();
    } catch (error: any) {
      message.error('Failed to delete stall type: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'Type Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: StallType, b: StallType) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Features',
      dataIndex: 'features',
      key: 'features',
      render: (features: Array<{ feature: string }>) => (
        <Space wrap>
          {features?.map(({ feature }) => (
            <Tag key={feature}>{feature}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: StallType) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
          <Button type="link" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingStallType(null);
    form.resetFields();
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0 }}>Stall Types</Title>
              <Text type="secondary">Manage your stall types and configurations</Text>
            </Space>
          </Col>
          <Col>
            <Space>
              <Search
                placeholder="Search stall types"
                style={{ width: 200 }}
                onSearch={(value) => console.log(value)}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
              >
                Add Stall Type
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Table Section */}
      <Card className="info-card">
        <Table 
          columns={columns}
          dataSource={stallTypes}
          rowKey={record => record._id!}
          loading={tableLoading}
        />
      </Card>

      <Modal
        title={editingStallType ? "Edit Stall Type" : "Add Stall Type"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: 'active' }}
          preserve={true}
        >
          <Form.Item
            name="name"
            label="Type Name"
            rules={[{ required: true, message: 'Please enter stall type name' }]}
          >
            <Input placeholder="e.g., 1 Side Open" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={4} placeholder="Enter description" />
          </Form.Item>

          <Form.Item
            name="features"
            label="Features"
          >
            <Input 
              placeholder="Enter features (comma-separated)" 
              allowClear
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {editingStallType ? 'Update' : 'Create'} Stall Type
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StallTypePage; 