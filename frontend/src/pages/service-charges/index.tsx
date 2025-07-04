import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Drawer,
  Statistic,
  Row,
  Col,
  Typography,
  Tabs,
  Dropdown,
  MenuProps
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  SettingOutlined,
  FileTextOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './ServiceCharges.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface ServiceCharge {
  _id: string;
  receiptNumber: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  companyName: string;
  stallNumber?: string;
  serviceType: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'submitted' | 'paid' | 'completed' | 'cancelled';
  paidAt?: string;
  createdAt: string;
  exhibitionId: {
    _id: string;
    name: string;
    venue: string;
  };
  adminNotes?: string;
  receiptGenerated: boolean;
}

interface ServiceChargeStats {
  totalCharges: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
}

interface Filters {
  exhibitionId?: string;
  paymentStatus?: string;
  status?: string;
  serviceType?: string;
  vendorName?: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs];
}

const ServiceChargesPage: React.FC = () => {
  const [serviceCharges, setServiceCharges] = useState<ServiceCharge[]>([]);
  const [stats, setStats] = useState<ServiceChargeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState<Filters>({});
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [selectedServiceCharge, setSelectedServiceCharge] = useState<ServiceCharge | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Fetch exhibitions for filter dropdown
  useEffect(() => {
    fetchExhibitions();
  }, []);

  // Fetch service charges when component mounts or filters change
  useEffect(() => {
    fetchServiceCharges();
    fetchStats();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchExhibitions = async () => {
    try {
      const response = await fetch('/api/exhibitions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setExhibitions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching exhibitions:', error);
    }
  };

  const fetchServiceCharges = async () => {
    setLoading(true);
    try {
      const queryParams: Record<string, string> = {
        page: pagination.current.toString(),
        limit: pagination.pageSize.toString(),
      };

      // Add defined filter values
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && key !== 'dateRange') {
          queryParams[key] = String(value);
        }
      });

      // Add date range if present
      if (filters.dateRange) {
        queryParams.startDate = filters.dateRange[0].toISOString();
        queryParams.endDate = filters.dateRange[1].toISOString();
      }

      const params = new URLSearchParams(queryParams);

      const response = await fetch(`/api/service-charges?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setServiceCharges(data.data || []);
        setPagination(prev => ({
          ...prev,
          total: data.pagination?.total || 0
        }));
      } else {
        message.error('Failed to fetch service charges');
      }
    } catch (error) {
      console.error('Error fetching service charges:', error);
      message.error('Error fetching service charges');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const queryParams: Record<string, string> = { period: 'all' };
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && key !== 'dateRange') {
          queryParams[key] = String(value);
        }
      });

      const params = new URLSearchParams(queryParams);

      const response = await fetch(`/api/service-charges/stats?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.data?.overview || null);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (values: any) => {
    if (!selectedServiceCharge) return;

    try {
      const response = await fetch(`/api/service-charges/${selectedServiceCharge._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        message.success('Status updated successfully');
        setStatusModalVisible(false);
        fetchServiceCharges();
        fetchStats();
      } else {
        message.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Error updating status');
    }
  };

  const handleExport = async () => {
    try {
      const queryParams: Record<string, string> = {};
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && key !== 'dateRange') {
          queryParams[key] = String(value);
        }
      });

      if (filters.dateRange) {
        queryParams.startDate = filters.dateRange[0].toISOString();
        queryParams.endDate = filters.dateRange[1].toISOString();
      }

      const params = new URLSearchParams(queryParams);

      const response = await fetch(`/api/service-charges/export?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Convert to CSV and download
        const csvContent = [
          Object.keys(data.data[0] || {}).join(','),
          ...data.data.map((row: any) => Object.values(row).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `service-charges-${dayjs().format('YYYY-MM-DD')}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        message.success('Export completed successfully');
      } else {
        message.error('Failed to export data');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      message.error('Error exporting data');
    }
  };

  const handleDownloadReceipt = async (serviceChargeId: string) => {
    try {
      const response = await fetch(`/api/service-charges/${serviceChargeId}/receipt`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `receipt-${serviceChargeId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        message.error('Failed to download receipt');
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      message.error('Error downloading receipt');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'green';
      case 'pending':
      case 'submitted':
        return 'orange';
      case 'cancelled':
      case 'failed':
        return 'red';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      case 'refunded':
        return 'purple';
      default:
        return 'default';
    }
  };

  const actionItems: MenuProps['items'] = [
    {
      key: 'view',
      label: 'View Details',
      icon: <EyeOutlined />,
    },
    {
      key: 'status',
      label: 'Update Status',
      icon: <EditOutlined />,
    },
    {
      key: 'receipt',
      label: 'Download Receipt',
      icon: <FileTextOutlined />,
    },
  ];

  const handleActionClick = (key: string, record: ServiceCharge) => {
    switch (key) {
      case 'view':
        setSelectedServiceCharge(record);
        setDetailsVisible(true);
        break;
      case 'status':
        setSelectedServiceCharge(record);
        setStatusModalVisible(true);
        form.setFieldsValue({
          status: record.status,
          adminNotes: record.adminNotes
        });
        break;
      case 'receipt':
        handleDownloadReceipt(record._id);
        break;
    }
  };

  const columns = [
    {
      title: 'Receipt #',
      dataIndex: 'receiptNumber',
      key: 'receiptNumber',
      width: 120,
      render: (text: string) => (
        <Text strong copyable>{text}</Text>
      )
    },
    {
      title: 'Vendor',
      key: 'vendor',
      width: 200,
      render: (record: ServiceCharge) => (
        <div>
          <div><Text strong>{record.vendorName}</Text></div>
          <div><Text type="secondary">{record.companyName}</Text></div>
          <div><Text type="secondary" style={{ fontSize: '12px' }}>{record.vendorEmail}</Text></div>
        </div>
      )
    },
    {
      title: 'Exhibition',
      dataIndex: ['exhibitionId', 'name'],
      key: 'exhibition',
      width: 150,
      render: (text: string, record: ServiceCharge) => (
        <div>
          <div><Text strong>{text}</Text></div>
          <div><Text type="secondary" style={{ fontSize: '12px' }}>{record.exhibitionId.venue}</Text></div>
        </div>
      )
    },
    {
      title: 'Service Type',
      dataIndex: 'serviceType',
      key: 'serviceType',
      width: 120,
      render: (text: string) => (
        <Tag>{text.charAt(0).toUpperCase() + text.slice(1)}</Tag>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number) => (
        <Text strong>₹{amount.toLocaleString('en-IN')}</Text>
      )
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 120,
      render: (status: string) => (
        <Tag color={getPaymentStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string, record: ServiceCharge) => (
        <div>
          <div>{dayjs(date).format('DD/MM/YYYY')}</div>
          {record.paidAt && (
            <div style={{ fontSize: '12px', color: '#52c41a' }}>
              Paid: {dayjs(record.paidAt).format('DD/MM/YYYY')}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (record: ServiceCharge) => (
        <Dropdown
          menu={{
            items: actionItems,
            onClick: ({ key }) => handleActionClick(key, record)
          }}
          trigger={['click']}
        >
          <Button size="small">Actions</Button>
        </Dropdown>
      )
    }
  ];

  return (
    <div className="service-charges-page">
      <div className="page-header">
        <Title level={2}>Service Charges</Title>
        <Space>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterDrawerVisible(true)}
          >
            Filters
          </Button>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            type="primary"
          >
            Export
          </Button>
          <Button
            icon={<SettingOutlined />}
            onClick={() => navigate('/service-charges/settings')}
          >
            Settings
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <Row gutter={16} className="stats-row">
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Charges"
                value={stats.totalCharges}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Amount"
                value={stats.totalAmount}
                prefix={<DollarOutlined />}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Paid Amount"
                value={stats.paidAmount}
                prefix={<CheckCircleOutlined />}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Pending Amount"
                value={stats.pendingAmount}
                prefix={<ClockCircleOutlined />}
                formatter={(value) => `₹${value?.toLocaleString('en-IN')}`}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={serviceCharges}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 10
              }));
            }
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Filter Drawer */}
      <Drawer
        title="Filters"
        placement="right"
        open={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        width={400}
      >
        <Form
          layout="vertical"
          onFinish={(values) => {
            setFilters(values);
            setFilterDrawerVisible(false);
            setPagination(prev => ({ ...prev, current: 1 }));
          }}
          initialValues={filters}
        >
          <Form.Item name="exhibitionId" label="Exhibition">
            <Select placeholder="Select exhibition" allowClear>
              {exhibitions.map(exhibition => (
                <Option key={exhibition._id} value={exhibition._id}>
                  {exhibition.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="paymentStatus" label="Payment Status">
            <Select placeholder="Select payment status" allowClear>
              <Option value="pending">Pending</Option>
              <Option value="paid">Paid</Option>
              <Option value="failed">Failed</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select placeholder="Select status" allowClear>
              <Option value="submitted">Submitted</Option>
              <Option value="paid">Paid</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item name="serviceType" label="Service Type">
            <Select placeholder="Select service type" allowClear>
              <Option value="positioning">Positioning</Option>
              <Option value="setup">Setup</Option>
              <Option value="maintenance">Maintenance</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item name="vendorName" label="Vendor Name">
            <Input placeholder="Search by vendor name" />
          </Form.Item>

          <Form.Item name="dateRange" label="Date Range">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Apply Filters
              </Button>
              <Button onClick={() => {
                setFilters({});
                setFilterDrawerVisible(false);
                setPagination(prev => ({ ...prev, current: 1 }));
              }}>
                Clear
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Status Update Modal */}
      <Modal
        title="Update Status"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleStatusUpdate}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select>
              <Option value="submitted">Submitted</Option>
              <Option value="paid">Paid</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Form.Item>

          <Form.Item name="adminNotes" label="Admin Notes">
            <Input.TextArea rows={4} placeholder="Add notes..." />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Status
              </Button>
              <Button onClick={() => setStatusModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal
        title="Service Charge Details"
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Close
          </Button>,
          selectedServiceCharge?.receiptGenerated && (
            <Button 
              key="download" 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={() => selectedServiceCharge && handleDownloadReceipt(selectedServiceCharge._id)}
            >
              Download Receipt
            </Button>
          )
        ]}
        width={800}
      >
        {selectedServiceCharge && (
          <div className="service-charge-details">
            <Tabs>
              <TabPane tab="Basic Info" key="basic">
                <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>Receipt Number:</strong> {selectedServiceCharge.receiptNumber}</p>
                    <p><strong>Vendor Name:</strong> {selectedServiceCharge.vendorName}</p>
                    <p><strong>Company:</strong> {selectedServiceCharge.companyName}</p>
                    <p><strong>Email:</strong> {selectedServiceCharge.vendorEmail}</p>
                    <p><strong>Phone:</strong> {selectedServiceCharge.vendorPhone}</p>
                    {selectedServiceCharge.stallNumber && (
                      <p><strong>Stall Number:</strong> {selectedServiceCharge.stallNumber}</p>
                    )}
                  </Col>
                  <Col span={12}>
                    <p><strong>Exhibition:</strong> {selectedServiceCharge.exhibitionId.name}</p>
                    <p><strong>Venue:</strong> {selectedServiceCharge.exhibitionId.venue}</p>
                    <p><strong>Service Type:</strong> {selectedServiceCharge.serviceType}</p>
                    <p><strong>Amount:</strong> ₹{selectedServiceCharge.amount.toLocaleString('en-IN')}</p>
                    <p><strong>Created:</strong> {dayjs(selectedServiceCharge.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                    {selectedServiceCharge.paidAt && (
                      <p><strong>Paid At:</strong> {dayjs(selectedServiceCharge.paidAt).format('DD/MM/YYYY HH:mm')}</p>
                    )}
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Status" key="status">
                <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>Payment Status:</strong> 
                      <Tag color={getPaymentStatusColor(selectedServiceCharge.paymentStatus)} style={{ marginLeft: 8 }}>
                        {selectedServiceCharge.paymentStatus.toUpperCase()}
                      </Tag>
                    </p>
                    <p><strong>Status:</strong> 
                      <Tag color={getStatusColor(selectedServiceCharge.status)} style={{ marginLeft: 8 }}>
                        {selectedServiceCharge.status.toUpperCase()}
                      </Tag>
                    </p>
                    <p><strong>Receipt Generated:</strong> 
                      <Tag color={selectedServiceCharge.receiptGenerated ? 'green' : 'orange'} style={{ marginLeft: 8 }}>
                        {selectedServiceCharge.receiptGenerated ? 'Yes' : 'No'}
                      </Tag>
                    </p>
                  </Col>
                </Row>
                {selectedServiceCharge.adminNotes && (
                  <div>
                    <p><strong>Admin Notes:</strong></p>
                    <p style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                      {selectedServiceCharge.adminNotes}
                    </p>
                  </div>
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ServiceChargesPage; 