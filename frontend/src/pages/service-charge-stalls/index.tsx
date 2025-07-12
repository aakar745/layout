import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  Popconfirm,
  Switch,
  InputNumber,
  Row,
  Col,
  Typography,
  Upload,
  Divider,
  Tag,
  Drawer
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import {
  getServiceChargeStalls,
  createServiceChargeStall,
  updateServiceChargeStall,
  deleteServiceChargeStall,
  importServiceChargeStalls,
  ServiceChargeStall
} from '../../services/serviceChargeStall';

const { Option } = Select;
const { Title, Text } = Typography;

interface Exhibition {
  _id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
}

const ServiceChargeStallsPage: React.FC = () => {
  const [stalls, setStalls] = useState<ServiceChargeStall[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [selectedStall, setSelectedStall] = useState<ServiceChargeStall | null>(null);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    active: undefined as boolean | undefined
  });
  
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [importForm] = Form.useForm();

  // Fetch exhibitions on mount
  useEffect(() => {
    fetchExhibitions();
  }, []);

  // Fetch stalls when exhibition changes
  useEffect(() => {
    if (selectedExhibition) {
      fetchStalls();
    }
  }, [selectedExhibition, pagination.current, pagination.pageSize, filters]);

  const fetchExhibitions = async () => {
    try {
      const response = await fetch('/api/exhibitions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle both direct array and wrapped data formats
        const exhibitions = Array.isArray(data) ? data : (data.data || []);
        setExhibitions(exhibitions);
        
        if (exhibitions.length === 0) {
          console.warn('No exhibitions found. User may not have access to any exhibitions.');
        }
      } else {
        console.error('Failed to fetch exhibitions:', response.status, response.statusText);
        message.error('Failed to load exhibitions. Please check your permissions.');
      }
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
      message.error('Error loading exhibitions');
    }
  };

  const fetchStalls = async () => {
    if (!selectedExhibition) return;
    
    setLoading(true);
    try {
      const response = await getServiceChargeStalls(selectedExhibition, {
        page: pagination.current,
        limit: pagination.pageSize,
        search: filters.search || undefined,
        active: filters.active
      });
      
      setStalls(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0
      }));
    } catch (error) {
      console.error('Error fetching stalls:', error);
      message.error('Failed to fetch stalls');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStall = async (values: any) => {
    try {
      await createServiceChargeStall(selectedExhibition, values);
      message.success('Service charge stall created successfully');
      setCreateModalVisible(false);
      form.resetFields();
      fetchStalls();
    } catch (error) {
      console.error('Error creating stall:', error);
      message.error('Failed to create stall');
    }
  };

  const handleUpdateStall = async (values: any) => {
    if (!selectedStall) return;
    
    try {
      await updateServiceChargeStall(selectedStall._id, values);
      message.success('Service charge stall updated successfully');
      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedStall(null);
      fetchStalls();
    } catch (error) {
      console.error('Error updating stall:', error);
      message.error('Failed to update stall');
    }
  };

  const handleDeleteStall = async (stallId: string) => {
    try {
      await deleteServiceChargeStall(stallId);
      message.success('Service charge stall deleted successfully');
      fetchStalls();
    } catch (error) {
      console.error('Error deleting stall:', error);
      message.error('Failed to delete stall');
    }
  };

  const handleFileUpload = (file: File) => {
    setImportFile(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Convert the data to expected format
        const processedData = jsonData.map((row: any) => ({
          stallNumber: row['Stall Number'] || row['stallNumber'] || '',
          exhibitorCompanyName: row['Exhibitor Company Name'] || row['exhibitorCompanyName'] || '',
          stallArea: parseFloat(row['Stall Area (sqm)'] || row['stallArea'] || '0'),
          dimensions: (row['Width'] && row['Height']) ? {
            width: parseFloat(row['Width'] || '0'),
            height: parseFloat(row['Height'] || '0')
          } : undefined
        }));
        
        setImportData(processedData);
        message.success(`File uploaded successfully. Found ${processedData.length} records.`);
      } catch (error) {
        console.error('Error reading file:', error);
        message.error('Error reading file. Please make sure it\'s a valid Excel file.');
      }
    };
    reader.readAsBinaryString(file);
    return false; // Prevent default upload
  };

  const handleImportStalls = async () => {
    if (!importData.length) {
      message.error('Please upload a file first');
      return;
    }

    setImportLoading(true);
    try {
      const result = await importServiceChargeStalls(selectedExhibition, {
        stalls: importData
      });
      
      message.success(`Successfully imported ${result.imported} service charge stalls`);
      setImportModalVisible(false);
      setImportFile(null);
      setImportData([]);
      importForm.resetFields();
      fetchStalls();
    } catch (error: any) {
      console.error('Error importing stalls:', error);
      
      // Handle validation errors
      if (error.message.includes('Validation failed')) {
        try {
          const errorData = JSON.parse(error.message.split('Validation failed')[1]);
          message.error(
            <div>
              <p>Import failed with validation errors:</p>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {errorData.errors?.slice(0, 5).map((err: string, index: number) => (
                  <li key={index}>{err}</li>
                ))}
                {errorData.errors?.length > 5 && <li>... and {errorData.errors.length - 5} more</li>}
              </ul>
            </div>
          );
        } catch {
          message.error('Import failed with validation errors');
        }
      } else {
        message.error('Error importing stalls');
      }
    } finally {
      setImportLoading(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Stall Number': 'A001',
        'Exhibitor Company Name': 'ABC Company Ltd',
        'Stall Area (sqm)': 30,
        'Width': 5,
        'Height': 6
      },
      {
        'Stall Number': 'B002',
        'Exhibitor Company Name': 'XYZ Exhibition Services',
        'Stall Area (sqm)': 60,
        'Width': 10,
        'Height': 6
      }
    ];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, 'Service Charge Stalls');
    XLSX.writeFile(wb, 'service-charge-stalls-template.xlsx');
  };

  const openEditModal = (stall: ServiceChargeStall) => {
    setSelectedStall(stall);
    editForm.setFieldsValue({
      stallNumber: stall.stallNumber,
      exhibitorCompanyName: stall.exhibitorCompanyName,
      stallArea: stall.stallArea,
      dimensions: stall.dimensions,
      isActive: stall.isActive
    });
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: 'Stall Number',
      dataIndex: 'stallNumber',
      key: 'stallNumber',
      width: 120,
      render: (text: string, record: ServiceChargeStall) => (
        <div>
          <Text strong style={{ fontSize: '14px' }}>{text}</Text>
          {!record.isActive && (
            <div><Tag color="red">Inactive</Tag></div>
          )}
        </div>
      )
    },
    {
      title: 'Exhibitor Company',
      dataIndex: 'exhibitorCompanyName',
      key: 'exhibitorCompanyName',
      width: 200,
      render: (text: string) => (
        <Text style={{ fontSize: '13px' }}>{text}</Text>
      )
    },
    {
      title: 'Stall Area',
      dataIndex: 'stallArea',
      key: 'stallArea',
      width: 100,
      align: 'center' as const,
      render: (area: number) => (
        <div style={{ lineHeight: '1.2' }}>
          <Text strong style={{ fontSize: '14px' }}>{area}</Text>
          <div style={{ fontSize: '11px', color: '#666' }}>sqm</div>
        </div>
      )
    },
    {
      title: 'Dimensions',
      key: 'dimensions',
      width: 120,
      align: 'center' as const,
      render: (record: ServiceChargeStall) => (
        <div>
          {record.dimensions ? (
            <div style={{ lineHeight: '1.2' }}>
              <Text style={{ fontSize: '13px' }}>
                {record.dimensions.width} × {record.dimensions.height}
              </Text>
              <div style={{ fontSize: '11px', color: '#666' }}>meters</div>
            </div>
          ) : (
            <Text type="secondary" style={{ fontSize: '12px' }}>-</Text>
          )}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      align: 'center' as const,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => (
        <Text style={{ fontSize: '12px' }}>
          {dayjs(date).format('DD/MM/YYYY')}
        </Text>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (record: ServiceChargeStall) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            size="small"
          />
          <Popconfirm
            title="Are you sure you want to delete this stall?"
            onConfirm={() => handleDeleteStall(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2}>Service Charge Stalls Management</Title>
        <Text type="secondary">
          Manage stall data for service charge auto-fill functionality
        </Text>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={8}>
            <Select
              placeholder="Select an exhibition"
              value={selectedExhibition}
              onChange={setSelectedExhibition}
              style={{ width: '100%' }}
              showSearch
              optionFilterProp="children"
            >
              {exhibitions.map(exhibition => (
                <Option key={exhibition._id} value={exhibition._id}>
                  {exhibition.name} - {exhibition.venue}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Input
              placeholder="Search stalls..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Status"
              value={filters.active}
              onChange={(value) => setFilters(prev => ({ ...prev, active: value }))}
              allowClear
            >
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
                disabled={!selectedExhibition}
              >
                Add Stall
              </Button>
              <Button
                icon={<UploadOutlined />}
                onClick={() => setImportModalVisible(true)}
                disabled={!selectedExhibition}
              >
                Import Excel
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {!selectedExhibition ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <InfoCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
            <Title level={4} type="secondary">Select an Exhibition</Title>
            <Text type="secondary">Please select an exhibition to view and manage its service charge stalls.</Text>
          </div>
        </Card>
      ) : (
        <Card>
          <Table
            columns={columns}
            dataSource={stalls}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} stalls`,
              onChange: (page, pageSize) => {
                setPagination(prev => ({
                  ...prev,
                  current: page,
                  pageSize: pageSize || 10
                }));
              }
            }}
            size="middle"
            scroll={{ x: 800 }}
          />
        </Card>
      )}

      {/* Create Stall Modal */}
      <Modal
        title="Add New Service Charge Stall"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateStall}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stallNumber"
                label="Stall Number"
                rules={[{ required: true, message: 'Please enter stall number' }]}
              >
                <Input placeholder="Enter stall number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stallArea"
                label="Stall Area (sqm)"
                rules={[
                  { required: true, message: 'Please enter stall area' },
                  { type: 'number', min: 1, message: 'Area must be at least 1 sqm' }
                ]}
              >
                <InputNumber 
                  placeholder="Enter area in sqm" 
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="exhibitorCompanyName"
            label="Exhibitor Company Name"
            rules={[{ required: true, message: 'Please enter exhibitor company name' }]}
          >
            <Input placeholder="Enter exhibitor company name" />
          </Form.Item>

          <Title level={5}>Dimensions (Optional)</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['dimensions', 'width']}
                label="Width (meters)"
              >
                <InputNumber 
                  placeholder="Enter width" 
                  style={{ width: '100%' }}
                  min={0.1}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['dimensions', 'height']}
                label="Height (meters)"
              >
                <InputNumber 
                  placeholder="Enter height" 
                  style={{ width: '100%' }}
                  min={0.1}
                  step={0.1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Stall
              </Button>
              <Button onClick={() => {
                setCreateModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Stall Modal */}
      <Modal
        title="Edit Service Charge Stall"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setSelectedStall(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateStall}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stallNumber"
                label="Stall Number"
                rules={[{ required: true, message: 'Please enter stall number' }]}
              >
                <Input placeholder="Enter stall number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="stallArea"
                label="Stall Area (sqm)"
                rules={[
                  { required: true, message: 'Please enter stall area' },
                  { type: 'number', min: 1, message: 'Area must be at least 1 sqm' }
                ]}
              >
                <InputNumber 
                  placeholder="Enter area in sqm" 
                  style={{ width: '100%' }}
                  min={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="exhibitorCompanyName"
            label="Exhibitor Company Name"
            rules={[{ required: true, message: 'Please enter exhibitor company name' }]}
          >
            <Input placeholder="Enter exhibitor company name" />
          </Form.Item>

          <Title level={5}>Dimensions (Optional)</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['dimensions', 'width']}
                label="Width (meters)"
              >
                <InputNumber 
                  placeholder="Enter width" 
                  style={{ width: '100%' }}
                  min={0.1}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['dimensions', 'height']}
                label="Height (meters)"
              >
                <InputNumber 
                  placeholder="Enter height" 
                  style={{ width: '100%' }}
                  min={0.1}
                  step={0.1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Stall
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                editForm.resetFields();
                setSelectedStall(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Import Modal */}
      <Modal
        title="Import Service Charge Stalls"
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false);
          setImportFile(null);
          setImportData([]);
          importForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <div style={{ marginBottom: '16px' }}>
          <Space>
            <Button 
              type="link" 
              icon={<DownloadOutlined />}
              onClick={downloadTemplate}
              style={{ padding: 0 }}
            >
              Download Template
            </Button>
            <Text type="secondary">|</Text>
            <Text type="secondary">
              Required columns: Stall Number, Exhibitor Company Name, Stall Area (sqm)
            </Text>
          </Space>
        </div>

        <Upload
          accept=".xlsx,.xls"
          beforeUpload={handleFileUpload}
          showUploadList={false}
        >
          <Button icon={<UploadOutlined />}>Select Excel File</Button>
        </Upload>

        {importFile && (
          <div style={{ 
            margin: '16px 0',
            padding: '12px', 
            background: '#f0f9ff', 
            border: '1px solid #bae6fd',
            borderRadius: '6px'
          }}>
            <Space>
              <FileTextOutlined style={{ color: '#0369a1' }} />
              <Text strong>{importFile.name}</Text>
              <Text type="secondary">({importData.length} records found)</Text>
            </Space>
          </div>
        )}

        {importData.length > 0 && (
          <div style={{ 
            margin: '16px 0',
            padding: '12px', 
            background: '#f6ffed', 
            border: '1px solid #b7eb8f',
            borderRadius: '6px'
          }}>
            <Space>
              <InfoCircleOutlined style={{ color: '#52c41a' }} />
              <Text strong>Preview:</Text>
              <Text>{importData.length} stalls ready to import</Text>
            </Space>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
              Sample: {importData[0]?.stallNumber} - {importData[0]?.exhibitorCompanyName} ({importData[0]?.stallArea} sqm)
            </div>
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <Space>
            <Button 
              type="primary" 
              onClick={handleImportStalls}
              loading={importLoading}
              disabled={!importData.length}
            >
              Import Stalls
            </Button>
            <Button onClick={() => {
              setImportModalVisible(false);
              setImportFile(null);
              setImportData([]);
              importForm.resetFields();
            }}>
              Cancel
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

export default ServiceChargeStallsPage; 