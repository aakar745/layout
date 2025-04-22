/**
 * Booking Details Component
 * 
 * Displays comprehensive information about a specific booking:
 * - Customer and exhibition details
 * - Stall information with calculations
 * - Financial breakdown including discounts and taxes
 * - Status management
 * - Actions (Update Status, Generate Invoice)
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Tag, Table, Typography, Modal, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchBooking, updateBookingStatus } from '../../../store/slices/bookingSlice';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { confirm } = Modal;

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
 * Comprehensive booking interface with all details
 * Includes:
 * - Basic booking information
 * - Customer details
 * - Financial calculations
 * - Stall information
 * - Status tracking
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
    /** Array of stall bookings with individual calculations */
    stalls: Array<{
      stallId: string;
      number: string;
      baseAmount: number;
      /** Optional discount applied to the stall */
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
    /** Tax calculations for the booking */
    taxes: Array<{
      name: string;
      rate: number;
      amount: number;
    }>;
    totalTaxAmount: number;
    totalAmount: number;
  };
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

/**
 * BookingDetails Component
 * 
 * Displays detailed information about a specific booking and provides
 * functionality to manage its status.
 * 
 * Features:
 * - Comprehensive booking information display
 * - Status management with confirmation
 * - Financial calculations breakdown
 * - Stall details with dimensions and rates
 */
const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentBooking, loading } = useSelector((state: RootState) => state.booking);

  useEffect(() => {
    if (id) {
      dispatch(fetchBooking(id));
    }
  }, [dispatch, id]);

  /**
   * Shows confirmation dialog before status update
   * Prevents accidental status changes
   * @param status - New status to be applied
   */
  const showStatusConfirm = (status: 'confirmed' | 'cancelled') => {
    confirm({
      title: `Are you sure you want to ${status} this booking?`,
      icon: <ExclamationCircleOutlined />,
      content: `This will ${status === 'confirmed' ? 'confirm the booking and mark stalls as sold' : 'cancel the booking and make stalls available again'}.`,
      okText: 'Yes',
      okType: status === 'confirmed' ? 'primary' : 'danger',
      cancelText: 'No',
      onOk() {
        handleStatusUpdate(status);
      },
    });
  };

  /**
   * Updates booking status and handles related changes
   * - Updates stall availability
   * - Updates payment status
   * - Refreshes booking data
   * @param status - New status to be applied
   */
  const handleStatusUpdate = (status: 'confirmed' | 'cancelled') => {
    if (id) {
      dispatch(updateBookingStatus({ id, status }));
    }
  };

  /**
   * Table columns configuration for stall details
   * Shows individual stall calculations including discounts
   */
  const stallColumns = [
    {
      title: 'Stall Number',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Base Amount',
      dataIndex: 'baseAmount',
      key: 'baseAmount',
      render: (amount: number) => `₹${amount.toLocaleString()}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (discount: any) => discount ? (
        <Text type="danger">
          -₹{discount.amount.toLocaleString()}
          {' '}
          ({discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`})
        </Text>
      ) : '-',
    },
    {
      title: 'Amount After Discount',
      dataIndex: 'amountAfterDiscount',
      key: 'amountAfterDiscount',
      render: (amount: number) => `₹${amount.toLocaleString()}`,
    },
  ];

  if (loading || !currentBooking) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card
          title={
            <Space direction="vertical" size={4}>
              <Typography.Title level={2} style={{ margin: 0 }}>Booking Details</Typography.Title>
              <Typography.Text type="secondary">View and manage booking information</Typography.Text>
            </Space>
          }
          extra={
            <Space>
              <Button onClick={() => navigate(`/invoice/${id}`)}>
                View Invoice
              </Button>
              {currentBooking.status === 'pending' && (
                <>
                  <Button
                    type="primary"
                    onClick={() => showStatusConfirm('confirmed')}
                  >
                    Confirm Booking
                  </Button>
                  <Button
                    danger
                    onClick={() => showStatusConfirm('cancelled')}
                  >
                    Cancel Booking
                  </Button>
                </>
              )}
            </Space>
          }
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Basic Information */}
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Booking ID" span={2}>
                {currentBooking._id}
              </Descriptions.Item>
              <Descriptions.Item label="Exhibition" span={2}>
                {currentBooking.exhibitionId.name}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={
                  currentBooking.status === 'confirmed' ? 'green' :
                  currentBooking.status === 'pending' ? 'gold' :
                  'red'
                }>
                  {currentBooking.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(currentBooking.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>

            {/* Exhibitor Information */}
            <Card title="Exhibitor Information" size="small">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Company Name" span={2}>
                  {currentBooking.companyName}
                </Descriptions.Item>
                <Descriptions.Item label="Contact Person">
                  {currentBooking.customerName}
                </Descriptions.Item>
                <Descriptions.Item label="Contact Email">
                  {currentBooking.customerEmail}
                </Descriptions.Item>
                <Descriptions.Item label="Contact Phone" span={2}>
                  {currentBooking.customerPhone}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Stalls and Financial Information */}
            <Card title="Stalls and Financial Details" size="small">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Table
                  dataSource={currentBooking.calculations.stalls}
                  columns={stallColumns}
                  pagination={false}
                  rowKey="stallId"
                />

                <Divider />

                <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    {/* Base Amount */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Total Base Amount:</Text>
                      <Text>₹{currentBooking.calculations.totalBaseAmount.toLocaleString()}</Text>
                    </div>

                    {/* Discount */}
                    {currentBooking.calculations.totalDiscountAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>Total Discount:</Text>
                        <Text type="danger">
                          -₹{currentBooking.calculations.totalDiscountAmount.toLocaleString()}
                        </Text>
                      </div>
                    )}

                    {/* Amount after Discount */}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Amount after Discount:</Text>
                      <Text>₹{currentBooking.calculations.totalAmountAfterDiscount.toLocaleString()}</Text>
                    </div>

                    <Divider style={{ margin: '8px 0' }} />

                    {/* Taxes */}
                    {currentBooking.calculations.taxes.map(tax => (
                      <div key={tax.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>{tax.name} ({tax.rate}%):</Text>
                        <Text>₹{tax.amount.toLocaleString()}</Text>
                      </div>
                    ))}

                    {/* Total Amount */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <Text strong>Total Amount (incl. Taxes):</Text>
                      <Text strong>₹{currentBooking.amount.toLocaleString()}</Text>
                    </div>
                  </Space>
                </div>
              </Space>
            </Card>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default BookingDetails; 