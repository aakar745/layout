/**
 * Booking List Component
 * 
 * Provides a simplified view of all bookings with basic functionality:
 * - List of all bookings with key information
 * - Basic filtering and sorting
 * - Quick navigation to booking details
 * - Status indicators
 */

import React, { useEffect } from 'react';
import { Table, Tag, Space, Button, Typography, Card, Row, Col } from 'antd';
import { EditOutlined, FolderOpenOutlined, FileOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchBookings } from '../../../store/slices/bookingSlice';
import '../../dashboard/Dashboard.css';

const { Title, Text } = Typography;

/**
 * Exhibition reference interface
 */
interface Exhibition {
  _id: string;
  name: string;
}

/**
 * Stall details interface
 */
interface Stall {
  _id: string;
  number: string;
  dimensions: {
    width: number;
    height: number;
  };
  ratePerSqm: number;
}

/**
 * Booking interface defining the structure of booking data
 * Includes all booking details:
 * - Customer information
 * - Stall selections
 * - Financial calculations
 * - Status information
 */
interface Booking {
  _id: string;
  exhibitionId: Exhibition;
  stallIds: Stall[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
  amount: number;
  calculations: {
    stalls: Array<{
      stallId: string;
      number: string;
      baseAmount: number;
      /** Optional discount information */
      discount?: {
        name: string;
        type: string;
        value: number;
        amount: number;
      } | null;
      amountAfterDiscount: number;
    }>;
    totalBaseAmount: number;
    totalDiscountAmount: number;
    totalAmountAfterDiscount: number;
    taxes: Array<{
      name: string;
      rate: number;
      amount: number;
    }>;
    totalTaxAmount: number;
    totalAmount: number;
  };
  status: 'pending' | 'approved' | 'rejected' | 'confirmed' | 'cancelled';
  createdAt: string;
}

/**
 * BookingList Component
 * 
 * A simplified view for listing all bookings with basic information.
 * Features:
 * - Sortable columns
 * - Status indicators with distinct colors
 * - Quick access to booking details
 * - Automatic data refresh
 */
const BookingList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { bookings, loading } = useSelector((state: RootState) => state.booking);

  // Load bookings on component mount
  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  /**
   * Table columns configuration
   * Defines the structure and behavior of the booking list table
   */
  const columns = [
    {
      title: 'Exhibition',
      dataIndex: ['exhibitionId', 'name'],
      key: 'exhibition',
      sorter: (a: Booking, b: Booking) => 
        a.exhibitionId.name.localeCompare(b.exhibitionId.name)
    },
    {
      title: 'Company',
      dataIndex: 'companyName',
      key: 'company',
      sorter: (a: Booking, b: Booking) => 
        a.companyName.localeCompare(b.companyName)
    },
    {
      title: 'Stalls',
      key: 'stalls',
      render: (record: Booking) => (
        <span>
          {record.calculations.stalls.map(stall => stall.number).join(', ')}
        </span>
      )
    },
    {
      title: 'Amount',
      dataIndex: ['calculations', 'totalAmount'],
      key: 'amount',
      render: (amount: number) => `₹${amount.toLocaleString()}`,
      sorter: (a: Booking, b: Booking) => 
        a.calculations.totalAmount - b.calculations.totalAmount
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        switch (status) {
          case 'confirmed':
            color = 'success';
            break;
          case 'pending':
            color = 'warning';
            break;
          case 'cancelled':
            color = 'error';
            break;
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Booking) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/bookings/${record._id}`)}>
            View Details
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0 }}>Stall Bookings</Title>
              <Text type="secondary">Manage exhibition stall bookings</Text>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<FileOutlined />}
              onClick={() => navigate('/bookings/create')}
              size="large"
            >
              Create Booking
            </Button>
          </Col>
        </Row>
      </div>

      {/* Table Section */}
      <Card className="info-card">
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="_id"
          loading={loading}
          pagination={{
            total: bookings.length,
            pageSize: 10,
            showTotal: (total) => `Total ${total} bookings`
          }}
        />
      </Card>
    </div>
  );
};

export default BookingList; 