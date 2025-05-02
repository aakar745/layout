import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Typography, 
  Tag, 
  Space, 
  Button, 
  Input, 
  Select, 
  Tabs,
  message,
  Modal,
  Dropdown,
  Menu,
  Alert,
  Empty,
  Tooltip,
  Badge,
  Skeleton,
  Row,
  Col
} from 'antd';
import { 
  SearchOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  InfoCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import publicExhibitionService from '../../services/publicExhibition';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;
const { Search } = Input;

// Define a proper interface for our booking type
interface Booking {
  _id: string;
  exhibitionId: {
    _id: string;
    name: string;
    venue: string;
    startDate: string;
    endDate: string;
  };
  stallIds: Array<{
    _id: string;
    number: string;
    dimensions: {
      width: number;
      height: number;
    };
    ratePerSqm: number;
    status: string;
    stallTypeId?: {
      name: string;
      _id: string;
    };
  }>;
  status: 'pending' | 'approved' | 'rejected' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  rejectionReason?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
}

const ExhibitorBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchBookings();
  }, []);

  // Extract initial tab from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status) {
      setFilterStatus(status);
    }
  }, [location]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await publicExhibitionService.getExhibitorBookings();
      setBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    confirm({
      title: 'Are you sure you want to cancel this booking?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. Once cancelled, the stalls will be available for others to book.',
      okText: 'Yes, Cancel Booking',
      okType: 'danger',
      cancelText: 'No, Keep Booking',
      onOk: async () => {
        try {
          await publicExhibitionService.cancelExhibitorBooking(bookingId);
          message.success('Booking cancelled successfully');
          fetchBookings(); // Refresh the list
        } catch (error) {
          console.error('Error cancelling booking:', error);
          message.error('Failed to cancel booking');
        }
      }
    });
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'approved':
        return <Tag color="success"><CheckCircleOutlined /> Approved</Tag>;
      case 'pending':
        return <Tag color="warning"><ClockCircleOutlined /> Pending</Tag>;
      case 'rejected':
        return <Tag color="error"><CloseCircleOutlined /> Rejected</Tag>;
      case 'confirmed':
        return <Tag color="blue"><CheckCircleOutlined /> Confirmed</Tag>;
      case 'cancelled':
        return <Tag color="default"><CloseCircleOutlined /> Cancelled</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const getPaymentStatusTag = (status: string) => {
    switch (status) {
      case 'paid':
        return <Tag color="success"><DollarOutlined /> Paid</Tag>;
      case 'pending':
        return <Tag color="warning"><ClockCircleOutlined /> Pending</Tag>;
      case 'refunded':
        return <Tag color="default"><DollarOutlined /> Refunded</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const handleViewInvoice = async (recordId: string) => {
    try {
      navigate(`/exhibitor/invoice/${recordId}`);
    } catch (error) {
      console.error('Error navigating to invoice:', error);
      message.error('Failed to access invoice. Please try again.');
    }
  };

  // Enhanced column definitions
  const columns = [
    {
      title: 'Exhibition',
      dataIndex: ['exhibitionId', 'name'],
      key: 'exhibitionName',
      render: (_: string, record: Booking) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.exhibitionId?.name || 'N/A'}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.exhibitionId?.venue || 'N/A'}</Text>
        </Space>
      ),
      sorter: (a: Booking, b: Booking) => 
        (a.exhibitionId?.name || '').localeCompare(b.exhibitionId?.name || ''),
    },
    {
      title: 'Stall(s)',
      dataIndex: 'stallIds',
      key: 'stallNumbers',
      render: (stallIds: Booking['stallIds']) => (
        <Space direction="vertical" size={4}>
          {stallIds?.map(stall => (
            <Tag key={stall._id}>
              {stall.number}
            </Tag>
          )) || 'N/A'}
        </Space>
      ),
    },
    {
      title: 'Type',
      key: 'stallType',
      render: (_: string, record: Booking) => (
        <Space direction="vertical" size={4}>
          {record.stallIds?.map(stall => (
            stall.stallTypeId?.name ? (
              <Tag key={stall._id} color="blue">
                {stall.stallTypeId.name}
              </Tag>
            ) : (
              <Text key={stall._id} type="secondary">N/A</Text>
            )
          )) || 'N/A'}
        </Space>
      ),
    },
    {
      title: 'Dimensions',
      key: 'dimensions',
      render: (_: string, record: Booking) => (
        <Space direction="vertical" size={4}>
          {record.stallIds?.map(stall => (
            <Text key={stall._id}>
              {stall.dimensions.width}m x {stall.dimensions.height}m
            </Text>
          )) || 'N/A'}
        </Space>
      ),
    },
    {
      title: 'Dates',
      key: 'dates',
      render: (_: string, record: Booking) => (
        <Space direction="vertical" size={0}>
          <Text>
            <CalendarOutlined style={{ marginRight: 4 }} /> 
            {dayjs(record.exhibitionId?.startDate).format('MMM D')} - {dayjs(record.exhibitionId?.endDate).format('MMM D, YYYY')}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Booked: {dayjs(record.createdAt).format('MMM D, YYYY')}
          </Text>
        </Space>
      ),
      sorter: (a: Booking, b: Booking) => 
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong>₹{amount.toLocaleString()}</Text>
      ),
      sorter: (a: Booking, b: Booking) => a.amount - b.amount,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: string, record: Booking) => {
        if (status === 'rejected' && record.rejectionReason) {
          return (
            <Tooltip title={record.rejectionReason}>
              {getStatusTag(status)}
              <InfoCircleOutlined style={{ marginLeft: 4, color: '#ff4d4f' }} />
            </Tooltip>
          );
        }
        return getStatusTag(status);
      },
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value: any, record: Booking) => record.status === value,
    },
    {
      title: 'Payment',
      key: 'paymentStatus',
      dataIndex: 'paymentStatus',
      render: (paymentStatus: string) => getPaymentStatusTag(paymentStatus),
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Pending', value: 'pending' },
        { text: 'Refunded', value: 'refunded' },
      ],
      onFilter: (value: any, record: Booking) => record.paymentStatus === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: string, record: Booking) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/exhibitor/bookings/${record._id}`)}
          >
            Details
          </Button>

          {(record.status === 'approved' || record.status === 'confirmed') && (
            <Button 
              type="link" 
              icon={<FilePdfOutlined />} 
              onClick={() => handleViewInvoice(record._id)}
            >
              Invoice
            </Button>
          )}

          {record.status === 'pending' && (
            <Button 
              type="link" 
              danger
              onClick={() => handleCancelBooking(record._id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking.exhibitionId?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
      booking.stallIds.some(stall => stall.number.toLowerCase().includes(searchText.toLowerCase())) ||
      (booking.exhibitionId?.venue || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (booking.customerName || '').toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Get counts for each tab
  const getTotalCount = () => bookings.length;
  const getPendingCount = () => bookings.filter(b => b.status === 'pending').length;
  const getApprovedCount = () => bookings.filter(b => b.status === 'approved').length;
  const getConfirmedCount = () => bookings.filter(b => b.status === 'confirmed').length;
  const getRejectedCount = () => bookings.filter(b => b.status === 'rejected').length;
  const getCancelledCount = () => bookings.filter(b => b.status === 'cancelled').length;

  return (
    <div>
      <Title level={2}>My Bookings</Title>
      <Text type="secondary">Manage all your exhibition stall bookings in one place</Text>
      
      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: 24, marginBottom: 24 }}
          action={
            <Button type="primary" onClick={fetchBookings}>
              Retry
            </Button>
          }
        />
      )}
      
      <Card style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col flex="auto">
            <Search
              placeholder="Search bookings by exhibition name, stall number, or venue"
              onSearch={handleSearch}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: '100%', maxWidth: 400 }}
              allowClear
            />
          </Col>
          <Col>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchBookings}
            >
              Refresh
            </Button>
          </Col>
        </Row>
        
        <Tabs 
          defaultActiveKey={filterStatus} 
          onChange={status => setFilterStatus(status)}
        >
          <TabPane tab={`All Bookings (${getTotalCount()})`} key="all">
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : filteredBookings.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredBookings}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
                size="middle"
              />
            ) : (
              <Empty 
                description={searchText ? "No bookings match your search criteria" : "No bookings found"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </TabPane>
          <TabPane tab={`Pending (${getPendingCount()})`} key="pending">
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={columns}
                dataSource={bookings.filter(b => b.status === 'pending')}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: <Empty description="No pending bookings" /> }}
                scroll={{ x: true }}
                size="middle"
              />
            )}
          </TabPane>
          <TabPane tab={`Approved (${getApprovedCount()})`} key="approved">
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={columns}
                dataSource={bookings.filter(b => b.status === 'approved')}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: <Empty description="No approved bookings" /> }}
                scroll={{ x: true }}
                size="middle"
              />
            )}
          </TabPane>
          <TabPane tab={`Confirmed (${getConfirmedCount()})`} key="confirmed">
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={columns}
                dataSource={bookings.filter(b => b.status === 'confirmed')}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: <Empty description="No confirmed bookings" /> }}
                scroll={{ x: true }}
                size="middle"
              />
            )}
          </TabPane>
          <TabPane tab={`Rejected (${getRejectedCount()})`} key="rejected">
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={columns}
                dataSource={bookings.filter(b => b.status === 'rejected')}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: <Empty description="No rejected bookings" /> }}
                scroll={{ x: true }}
                size="middle"
              />
            )}
          </TabPane>
          <TabPane tab={`Cancelled (${getCancelledCount()})`} key="cancelled">
            {loading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                columns={columns}
                dataSource={bookings.filter(b => b.status === 'cancelled')}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                locale={{ emptyText: <Empty description="No cancelled bookings" /> }}
                scroll={{ x: true }}
                size="middle"
              />
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ExhibitorBookings; 