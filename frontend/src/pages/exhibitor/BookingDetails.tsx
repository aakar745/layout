import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Tag,
  Divider,
  Space,
  Spin,
  Typography,
  Row,
  Col,
  Table,
  message
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../services/api';

const { Title, Text } = Typography;

const ExhibitorBookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/exhibitor-bookings/${id}`);
      setBooking(response.data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      message.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoice = async () => {
    try {
      navigate(`/exhibitor/invoice/${id}`);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      message.error('Failed to retrieve invoice');
    }
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

  const columns = [
    {
      title: 'Stall Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Dimensions',
      key: 'dimensions',
      render: (stall: any) => `${stall.dimensions.width}m × ${stall.dimensions.height}m`,
    },
    {
      title: 'Size',
      key: 'size',
      render: (stall: any) => `${stall.dimensions.width * stall.dimensions.height} m²`,
    },
    {
      title: 'Rate per m²',
      dataIndex: 'ratePerSqm',
      key: 'ratePerSqm',
      render: (rate: number) => `₹${rate.toLocaleString()}`,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (stall: any, _: any, index: number) => {
        const stallCalc = booking.calculations?.stalls[index];
        return stallCalc ? `₹${stallCalc.baseAmount.toLocaleString()}` : 'N/A';
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!booking) {
    return (
      <Card>
        <div style={{ textAlign: 'center', margin: '50px 0' }}>
          <Title level={3}>Booking Not Found</Title>
          <Text type="secondary">The requested booking could not be found or you don't have permission to view it.</Text>
          <div style={{ marginTop: 20 }}>
            <Button type="primary" onClick={() => navigate('/exhibitor/bookings')}>
              Back to Bookings
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/exhibitor/bookings')}
          style={{ marginRight: 16 }}
        >
          Back to Bookings
        </Button>
        
        {['approved', 'confirmed'].includes(booking.status) && (
          <Button 
            type="primary" 
            icon={<FileTextOutlined />} 
            onClick={handleViewInvoice}
          >
            View Invoice
          </Button>
        )}
      </div>

      <Card title="Booking Details" style={{ marginBottom: 20 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Booking ID">{booking._id}</Descriptions.Item>
          <Descriptions.Item label="Exhibition">{booking.exhibitionId?.name || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Venue">{booking.exhibitionId?.venue || 'N/A'}</Descriptions.Item>
          <Descriptions.Item label="Booking Date">
            {dayjs(booking.createdAt).format('MMM D, YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Exhibition Dates">
            {dayjs(booking.exhibitionId?.startDate).format('MMM D, YYYY')} - 
            {dayjs(booking.exhibitionId?.endDate).format('MMM D, YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {getStatusTag(booking.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            {getPaymentStatusTag(booking.paymentStatus || 'pending')}
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount">
            ₹{booking.amount?.toLocaleString() || 'N/A'}
          </Descriptions.Item>
        </Descriptions>

        {booking.rejectionReason && (
          <div style={{ marginTop: 16 }}>
            <Title level={5} style={{ color: '#f5222d' }}>Rejection Reason:</Title>
            <Text>{booking.rejectionReason}</Text>
          </div>
        )}
      </Card>

      <Card title="Stall Details" style={{ marginBottom: 20 }}>
        <Table 
          dataSource={booking.stallIds || []} 
          columns={columns} 
          rowKey="_id"
          pagination={false}
        />
      </Card>

      <Card title="Calculation Summary">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Base Amount">
                ₹{booking.calculations?.totalBaseAmount.toLocaleString() || 'N/A'}
              </Descriptions.Item>
              
              {booking.calculations?.totalDiscountAmount > 0 && (
                <Descriptions.Item label="Discount">
                  - ₹{booking.calculations?.totalDiscountAmount.toLocaleString() || 'N/A'}
                </Descriptions.Item>
              )}
              
              {booking.calculations?.totalDiscountAmount > 0 && (
                <Descriptions.Item label="Amount After Discount">
                  ₹{booking.calculations?.totalAmountAfterDiscount.toLocaleString() || 'N/A'}
                </Descriptions.Item>
              )}
              
              {booking.calculations?.taxes?.map((tax: any) => (
                <Descriptions.Item label={`${tax.name} (${tax.rate}%)`} key={tax.name}>
                  + ₹{tax.amount.toLocaleString() || 'N/A'}
                </Descriptions.Item>
              ))}
              
              <Descriptions.Item label="Total Amount">
                <Text strong style={{ fontSize: '16px' }}>
                  ₹{booking.amount?.toLocaleString() || 'N/A'}
                </Text>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>

      <Card title="Customer Information" style={{ marginTop: 20 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Company Name">{booking.companyName}</Descriptions.Item>
          <Descriptions.Item label="Contact Person">{booking.customerName}</Descriptions.Item>
          <Descriptions.Item label="Email">{booking.customerEmail}</Descriptions.Item>
          <Descriptions.Item label="Phone">{booking.customerPhone}</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ExhibitorBookingDetails; 