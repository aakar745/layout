import React, { useEffect, useState } from 'react';
import { 
  Table, Card, Button, Tag, Space, Modal, Select, Input, message, 
  Popconfirm, Form, Switch, DatePicker, Tooltip, Row, Col, Divider,
  Badge, Statistic, Dropdown, Menu, Typography, Radio, Alert
} from 'antd';
import { 
  Typography as AntTypography, 
  TableColumnsType
} from 'antd';
import { 
  EditOutlined, DeleteOutlined, ReloadOutlined, 
  SearchOutlined, FilterOutlined, UserOutlined, EyeOutlined,
  CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ExclamationCircleOutlined, MoreOutlined, ExportOutlined,
  DownloadOutlined, ClockCircleOutlined, UserAddOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchExhibitors, Exhibitor } from '../../store/slices/exhibitorSlice';
import exhibitorService from '../../services/exhibitor';
import dayjs from 'dayjs';
import '../dashboard/Dashboard.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea, Search } = Input;
const { RangePicker } = DatePicker;

// Extended interface with all fields we need
interface ExhibitorData extends Exhibitor {
  createdAt: string;
  rejectionReason?: string;
  address?: string;
  website?: string;
  description?: string;
}

const ExhibitorManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { exhibitors, loading } = useSelector((state: RootState) => state.exhibitor);
  const [selectedExhibitor, setSelectedExhibitor] = useState<ExhibitorData | null>(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    dispatch(fetchExhibitors());
  }, [dispatch]);
  
  useEffect(() => {
    if (exhibitors?.length) {
      // Cast exhibitors to ExhibitorData type (backend always includes these fields)
      setFilteredData(exhibitors as any[]);
      
      // Calculate stats
      const newStats = {
        total: exhibitors.length,
        pending: exhibitors.filter(ex => ex.status === 'pending').length,
        approved: exhibitors.filter(ex => ex.status === 'approved').length,
        rejected: exhibitors.filter(ex => ex.status === 'rejected').length
      };
      setStats(newStats);
    }
  }, [exhibitors]);
  
  useEffect(() => {
    if (selectedExhibitor && isEditModalVisible) {
      form.setFieldsValue({
        companyName: selectedExhibitor.companyName,
        contactPerson: selectedExhibitor.contactPerson,
        email: selectedExhibitor.email,
        phone: selectedExhibitor.phone,
        address: selectedExhibitor.address || '',
        website: selectedExhibitor.website || '',
        description: selectedExhibitor.description || '',
        isActive: selectedExhibitor.isActive
      });
    }
  }, [selectedExhibitor, isEditModalVisible, form]);

  const getStatusTag = (status: string) => {
    switch(status) {
      case 'approved':
        return <Tag color="success">Approved</Tag>;
      case 'pending':
        return <Tag color="warning">Pending</Tag>;
      case 'rejected':
        return <Tag color="error">Rejected</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedExhibitor) return;

    try {
      setUpdateLoading(true);
      await exhibitorService.updateStatus(
        selectedExhibitor._id,
        status,
        status === 'rejected' ? rejectionReason : undefined
      );
      message.success(`Exhibitor status updated to ${status}`);
      setIsUpdateModalVisible(false);
      // Refresh exhibitor list
      dispatch(fetchExhibitors());
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update exhibitor status');
    } finally {
      setUpdateLoading(false);
    }
  };
  
  const handleEditExhibitor = async (values: any) => {
    if (!selectedExhibitor) return;
    
    try {
      setEditLoading(true);
      await exhibitorService.updateExhibitor(selectedExhibitor._id, values);
      message.success('Exhibitor details updated successfully');
      setIsEditModalVisible(false);
      // Refresh exhibitor list
      dispatch(fetchExhibitors());
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update exhibitor details');
    } finally {
      setEditLoading(false);
    }
  };
  
  const handleDeleteExhibitor = async (id: string) => {
    try {
      setDeleteLoading(true);
      await exhibitorService.deleteExhibitor(id);
      message.success('Exhibitor deleted successfully');
      // Refresh exhibitor list
      dispatch(fetchExhibitors());
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to delete exhibitor');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    
    if (!value) {
      setFilteredData(exhibitors as any[]);
      return;
    }
    
    const searchLower = value.toLowerCase();
    const filtered = exhibitors.filter(
      (item) => 
        item.companyName.toLowerCase().includes(searchLower) || 
        item.contactPerson.toLowerCase().includes(searchLower) || 
        item.email.toLowerCase().includes(searchLower) || 
        item.phone.toLowerCase().includes(searchLower)
    );
    
    setFilteredData(filtered as any[]);
  };
  
  const handleFilterByStatus = (value: any) => {
    if (value === 'all') {
      setFilteredData(exhibitors as any[]);
      return;
    }
    
    const filtered = exhibitors.filter(item => item.status === value);
    setFilteredData(filtered as any[]);
  };
  
  const handleFilterByDate = (dates: any) => {
    if (!dates || dates.length !== 2) {
      setFilteredData(exhibitors as any[]);
      return;
    }
    
    const startDate = dates[0].startOf('day').toISOString();
    const endDate = dates[1].endOf('day').toISOString();
    
    const filtered = exhibitors.filter(item => {
      const createdAt = new Date((item as any).createdAt).toISOString();
      return createdAt >= startDate && createdAt <= endDate;
    });
    
    setFilteredData(filtered as any[]);
  };

  const handleExport = () => {
    // Convert data to CSV format
    const headers = ['Company Name', 'Contact Person', 'Email', 'Phone', 'Status', 'Active', 'Registration Date', 'Address', 'Website'];
    const csvData = filteredData.map(item => [
      item.companyName,
      item.contactPerson,
      item.email,
      item.phone,
      item.status,
      item.isActive ? 'Yes' : 'No',
      new Date(item.createdAt).toLocaleDateString(),
      item.address || '',
      item.website || ''
    ]);
    
    // Add headers to the beginning
    csvData.unshift(headers);
    
    // Convert to CSV string
    const csvString = csvData.map(row => row.map(cell => 
      typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
        ? `"${cell.replace(/"/g, '""')}"`
        : cell
    ).join(',')).join('\n');
    
    // Create a blob and download link
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `exhibitors-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('Exhibitor data exported successfully');
  };
  
  const handleDeleteMultiple = () => {
    Modal.confirm({
      title: 'Delete Selected Exhibitors',
      content: `Are you sure you want to delete ${selectedRowKeys.length} exhibitors? This action cannot be undone.`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          setDeleteLoading(true);
          
          // Delete each selected exhibitor
          const promises = selectedRowKeys.map(id => 
            exhibitorService.deleteExhibitor(id.toString())
          );
          
          await Promise.all(promises);
          message.success(`${selectedRowKeys.length} exhibitors deleted successfully`);
          
          // Clear selection and refresh list
          setSelectedRowKeys([]);
          dispatch(fetchExhibitors());
        } catch (error: any) {
          message.error('Failed to delete some exhibitors');
        } finally {
          setDeleteLoading(false);
        }
      }
    });
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  const columns: TableColumnsType<any> = [
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 220,
      fixed: 'left',
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search company or contact"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Filter
            </Button>
            <Button
              onClick={() => { 
                if (clearFilters) {
                  clearFilters();
                }
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => {
        const searchTerm = String(value).toLowerCase();
        return (
          record.companyName.toLowerCase().includes(searchTerm) ||
          record.contactPerson.toLowerCase().includes(searchTerm)
        );
      },
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Contact: {record.contactPerson}
          </div>
        </div>
      ),
    },
    {
      title: 'Contact',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      render: (text: string, record: any) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: '12px' }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => (
        <Tooltip title={new Date(date).toLocaleString()}>
          {new Date(date).toLocaleDateString()}
        </Tooltip>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      width: 180,
      render: (website: string) => (
        website ? (
          <a href={website} target="_blank" rel="noopener noreferrer">
            {website.replace(/^https?:\/\/(www\.)?/i, '')}
          </a>
        ) : '-'
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 220,
      render: (_: any, record: ExhibitorData) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedExhibitor(record);
                setIsViewModalVisible(true);
              }}
            />
          </Tooltip>
          <Button
            type="primary"
            onClick={() => {
              setSelectedExhibitor(record);
              setStatus(record.status as 'pending' | 'approved' | 'rejected');
              setRejectionReason(record.rejectionReason || '');
              setIsUpdateModalVisible(true);
            }}
          >
            Update Status
          </Button>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item 
                  key="edit" 
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedExhibitor(record);
                    setIsEditModalVisible(true);
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Item 
                  key="delete" 
                  icon={<DeleteOutlined />}
                  danger
                  onClick={(e) => {
                    e.domEvent.stopPropagation();
                    Modal.confirm({
                      title: 'Delete Exhibitor',
                      content: 'Are you sure you want to delete this exhibitor? This action cannot be undone.',
                      okText: 'Yes',
                      okType: 'danger',
                      cancelText: 'No',
                      onOk: () => handleDeleteExhibitor(record._id)
                    });
                  }}
                >
                  Delete
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0 }}>Exhibitors</Title>
              <Text type="secondary">Manage exhibitors and their information</Text>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsEditModalVisible(true)}
              size="large"
            >
              Add Exhibitor
            </Button>
          </Col>
        </Row>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Exhibitors" 
              value={stats.total}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Pending" 
              value={stats.pending}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Approved" 
              value={stats.approved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Rejected" 
              value={stats.rejected}
              prefix={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters Section */}
      <Card className="info-card" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} md={6} lg={4}>
              <Search
                placeholder="Search exhibitors"
                allowClear
                onSearch={handleSearch}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} sm={8} md={6} lg={4}>
              <Select
                placeholder="Filter by status"
                style={{ width: '100%' }}
                onChange={handleFilterByStatus}
                allowClear
              >
                <Option value="all">All Status</Option>
                <Option value="pending">Pending</Option>
                <Option value="approved">Approved</Option>
                <Option value="rejected">Rejected</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={6} lg={6}>
              <RangePicker 
                style={{ width: '100%' }}
                onChange={handleFilterByDate}
              />
            </Col>
          </Row>

          {selectedRowKeys.length > 0 && (
            <Row>
              <Space>
                <Text>Selected {selectedRowKeys.length} items</Text>
                <Button danger onClick={handleDeleteMultiple}>
                  Delete Selected
                </Button>
                <Button type="primary" onClick={handleExport}>
                  Export Selected
                </Button>
              </Space>
            </Row>
          )}
        </Space>
      </Card>

      {/* Table Section */}
      <Card className="info-card">
        <Table
          rowSelection={rowSelection}
          dataSource={filteredData}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 1500 }}
        />
      </Card>

      {/* View Exhibitor Modal */}
      <Modal
        title="Exhibitor Details"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsViewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={600}
      >
        {selectedExhibitor && (
          <div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Company Information">
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text strong>Company Name:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.companyName}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Contact Person:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.contactPerson}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Email:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.email}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Phone:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.phone}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Address:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.address || 'Not provided'}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Status:</Text>
                    </Col>
                    <Col span={12}>
                      {getStatusTag(selectedExhibitor.status)}
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Active:</Text>
                    </Col>
                    <Col span={12}>
                      <Badge status={selectedExhibitor.isActive ? 'success' : 'error'} 
                        text={selectedExhibitor.isActive ? 'Yes' : 'No'} />
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Registration Date:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{new Date(selectedExhibitor.createdAt).toLocaleString()}</Text>
                    </Col>
                  </Row>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card title="Additional Information">
                  <Row gutter={[16, 8]}>
                    <Col span={12}>
                      <Text strong>Address:</Text>
                    </Col>
                    <Col span={12}>
                      <Text>{selectedExhibitor.address || 'Not provided'}</Text>
                    </Col>
                    
                    <Col span={12}>
                      <Text strong>Website:</Text>
                    </Col>
                    <Col span={12}>
                      {selectedExhibitor.website ? (
                        <a href={selectedExhibitor.website} target="_blank" rel="noopener noreferrer">
                          {selectedExhibitor.website}
                        </a>
                      ) : 'Not provided'}
                    </Col>
                    
                    {selectedExhibitor.status === 'rejected' && (
                      <>
                        <Col span={12}>
                          <Text strong>Rejection Reason:</Text>
                        </Col>
                        <Col span={12}>
                          <Text type="danger">{selectedExhibitor.rejectionReason || 'No reason provided'}</Text>
                        </Col>
                      </>
                    )}
                  </Row>
                  
                  {selectedExhibitor.description && (
                    <>
                      <Divider />
                      <Text strong>Description:</Text>
                      <Paragraph style={{ marginTop: 8 }}>
                        {selectedExhibitor.description}
                      </Paragraph>
                    </>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title="Update Exhibitor Status"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedExhibitor && (
          <div>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <UserOutlined style={{ fontSize: '18px' }} />
                  <span>Exhibitor Information</span>
                </div>
              }
              style={{ marginBottom: 16 }}
              bordered={false}
              size="small"
            >
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Text strong>Company:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedExhibitor.companyName}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Contact Person:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedExhibitor.contactPerson}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Email:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedExhibitor.email}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Address:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedExhibitor.address || 'Not provided'}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Current Status:</Text>
                </Col>
                <Col span={16}>
                  {getStatusTag(selectedExhibitor.status)}
                </Col>
              </Row>
            </Card>

            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ExclamationCircleOutlined style={{ fontSize: '18px' }} />
                  <span>Update Status</span>
                </div>
              }
              bordered={false}
              size="small"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <Text strong>Select New Status:</Text>
                  <div style={{ marginTop: '16px' }}>
                    <Radio.Group 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value as 'pending' | 'approved' | 'rejected')}
                      buttonStyle="solid"
                    >
                      <Radio.Button value="pending">
                        <Space>
                          <ClockCircleOutlined style={{ color: '#faad14' }} />
                          Pending
                        </Space>
                      </Radio.Button>
                      <Radio.Button value="approved">
                        <Space>
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          Approved
                        </Space>
                      </Radio.Button>
                      <Radio.Button value="rejected">
                        <Space>
                          <CloseCircleOutlined style={{ color: '#f5222d' }} />
                          Rejected
                        </Space>
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                
                {status === 'rejected' && (
                  <div>
                    <Form.Item 
                      label={<Text strong>Rejection Reason:</Text>}
                      required={status === 'rejected'}
                      rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
                      help="This will be visible to the exhibitor"
                    >
                      <TextArea
                        rows={4}
                        value={rejectionReason}
                        onChange={e => setRejectionReason(e.target.value)}
                        placeholder="Provide a reason for rejection"
                        style={{ marginTop: 8 }}
                      />
                    </Form.Item>
                  </div>
                )}
                
                {status === 'approved' && (
                  <Alert
                    message="Approval Confirmation"
                    description="By approving this exhibitor, they will be able to log in and manage their exhibition space."
                    type="success"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
                
                {status === 'pending' && (
                  <Alert
                    message="Return to Pending"
                    description="This exhibitor will be moved back to pending status and will not be able to log in."
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
              </div>
              
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => setIsUpdateModalVisible(false)}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  onClick={handleUpdateStatus}
                  loading={updateLoading}
                  disabled={status === 'rejected' && !rejectionReason.trim()}
                >
                  Update Status
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Modal>
      
      {/* Edit Exhibitor Modal */}
      <Modal
        title="Edit Exhibitor Details"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditExhibitor}
        >
          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: 'Please enter company name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="contactPerson"
            label="Contact Person"
            rules={[{ required: true, message: 'Please enter contact person' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="address"
            label="Address"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="website"
            label="Website"
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="isActive"
            label="Active Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={editLoading}>
                Save Changes
              </Button>
              <Button onClick={() => setIsEditModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExhibitorManagement; 