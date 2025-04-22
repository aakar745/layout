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
  Menu
} from 'antd';
import { 
  SearchOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import publicExhibitionService from '@services/publicExhibition';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;

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
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await publicExhibitionService.getExhibitorBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      message.error('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    confirm({
      title: 'Are you sure you want to cancel this booking?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. Once cancelled, the stalls will be available for others to book.',
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
        return <Tag color="error">Rejected</Tag>;
      case 'confirmed':
        return <Tag color="blue"><CheckCircleOutlined /> Confirmed</Tag>;
      case 'cancelled':
        return <Tag color="default">Cancelled</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const getPaymentStatusTag = (status: string) => {
    switch (status) {
      case 'paid':
        return <Tag color="success">Paid</Tag>;
      case 'pending':
        return <Tag color="warning">Pending</Tag>;
      case 'refunded':
        return <Tag color="default">Refunded</Tag>;
      default:
        return <Tag>Unknown</Tag>;
    }
  };

  const handleViewInvoice = async (recordId: string) => {
    try {
      const response = await publicExhibitionService.getExhibitorBookingInvoice(recordId);
      if (response && response.data && response.data._id) {
        navigate(`/exhibitor/invoice/${recordId}`);
      } else {
        message.error('Invoice not found or not available');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      message.error('Failed to retrieve invoice details');
    }
  };

  const columns = [
    {
      title: 'Exhibition',
      dataIndex: ['exhibitionId', 'name'],
      key: 'exhibitionName',
      render: (_: string, record: Booking) => record.exhibitionId?.name || 'N/A',
      sorter: (a: Booking, b: Booking) => 
        (a.exhibitionId?.name || '').localeCompare(b.exhibitionId?.name || ''),
    },
    {
      title: 'Stall(s)',
      dataIndex: 'stallIds',
      key: 'stallNumbers',
      render: (stallIds: Booking['stallIds']) => 
        stallIds?.map(stall => stall.number).join(', ') || 'N/A',
    },
    {
      title: 'Booking Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a: Booking, b: Booking) => 
        dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: 'Exhibition Date',
      key: 'exhibitionDate',
      render: (_: string, record: Booking) => {
        const startDate = dayjs(record.exhibitionId?.startDate).format('MMM D');
        const endDate = dayjs(record.exhibitionId?.endDate).format('MMM D, YYYY');
        return `${startDate} - ${endDate}`;
      },
      sorter: (a: Booking, b: Booking) => 
        dayjs(a.exhibitionId?.startDate).unix() - dayjs(b.exhibitionId?.startDate).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
      filters: [
        { text: 'Approved', value: 'approved' },
        { text: 'Pending', value: 'pending' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Confirmed', value: 'confirmed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value: any, record: { status: string }) => record.status === value,
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => getPaymentStatusTag(status),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `₹${amount.toLocaleString()}`,
      sorter: (a: Booking, b: Booking) => a.amount - b.amount,
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: any) => {
        const menuItems = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: 'View Details',
            onClick: () => navigate(`/exhibitor/bookings/${record._id}`)
          }
        ];

        // Add invoice option if the booking is approved or confirmed
        if (['approved', 'confirmed'].includes(record.status)) {
          menuItems.push({
            key: 'invoice',
            icon: <FileTextOutlined />,
            label: 'View Invoice',
            onClick: () => handleViewInvoice(record._id)
          });
        }
        
        // Add cancel option if the booking is pending
        if (record.status === 'pending') {
          menuItems.push({
            key: 'cancel',
            icon: <ExclamationCircleOutlined />,
            label: 'Cancel Booking',
            onClick: () => handleCancelBooking(record._id)
          });
        }

        return (
          <Space size="middle">
            <Dropdown 
              overlay={
                <Menu items={menuItems} />
              } 
              trigger={['click']}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      (booking.exhibitionId?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
      booking.stallIds.some(stall => stall.number.toLowerCase().includes(searchText.toLowerCase())) ||
      (booking.exhibitionId?.venue || '').toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <Title level={2}>My Bookings</Title>
      <Text type="secondary">Manage all your exhibition stall bookings in one place</Text>
      
      <Card style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="all">
          <TabPane tab="All Bookings" key="all">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <Input
                  placeholder="Search by exhibition, stall, or venue"
                  prefix={<SearchOutlined />}
                  style={{ width: 300 }}
                  onChange={e => handleSearch(e.target.value)}
                  value={searchText}
                />
                <Select 
                  defaultValue="all" 
                  style={{ width: 120 }}
                  onChange={value => setFilterStatus(value)}
                >
                  <Option value="all">All Status</Option>
                  <Option value="approved">Approved</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="rejected">Rejected</Option>
                  <Option value="confirmed">Confirmed</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Space>
              <Link to="/exhibitions">
                <Button type="primary">Book New Stall</Button>
              </Link>
            </div>
            
            <Table
              columns={columns}
              dataSource={filteredBookings}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Pending" key="pending">
            <Table
              columns={columns}
              dataSource={bookings.filter(b => b.status === 'pending')}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Approved" key="approved">
            <Table
              columns={columns}
              dataSource={bookings.filter(b => b.status === 'approved')}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Confirmed" key="confirmed">
            <Table
              columns={columns}
              dataSource={bookings.filter(b => b.status === 'confirmed')}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Rejected" key="rejected">
            <Table
              columns={columns}
              dataSource={bookings.filter(b => b.status === 'rejected')}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </TabPane>
          <TabPane tab="Cancelled" key="cancelled">
            <Table
              columns={columns}
              dataSource={bookings.filter(b => b.status === 'cancelled')}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              loading={loading}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ExhibitorBookings; 