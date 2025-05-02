/**
 * Booking Management Component
 * 
 * This component provides a comprehensive interface for managing stall bookings with features:
 * - Booking list with filtering and search
 * - Booking status management
 * - Statistics dashboard
 * - Detailed booking information
 * - Actions (View, Update Status, Delete)
 */

import React, { useEffect, useState } from 'react';
import { 
  Card, Table, Tag, Space, Button, Row, Col, DatePicker,
  Typography, Modal, Form, message, Descriptions, Divider, Tooltip,
  Menu, Dropdown, Input, Select, Radio, Alert
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  CheckCircleOutlined, CloseCircleOutlined, PlusOutlined,
  DeleteOutlined, EyeOutlined, MoreOutlined,
  FileTextOutlined, ExclamationCircleOutlined, ClockCircleOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchBookings, deleteBooking, updateBookingStatus, Exhibition } from '../../../store/slices/bookingSlice';
import { fetchExhibition, fetchExhibitions } from '../../../store/slices/exhibitionSlice';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useGetInvoicesQuery } from '../../../store/services/invoice';
import BookingStatistics from './BookingStatistics';
import BookingFilters from './BookingFilters';
import { BookingType, BookingStatus, FilterState, Stall } from './types';
import '../../dashboard/Dashboard.css';
import { usePermission } from '../../../hooks/reduxHooks';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

/**
 * Main booking management component
 * Provides functionality for:
 * - Viewing and filtering bookings
 * - Managing booking statuses
 * - Accessing detailed booking information
 * - Generating statistics
 */
const StallBookingManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading } = useSelector((state: RootState) => state.booking);
  const { exhibitions } = useSelector((state: RootState) => state.exhibition);
  const [selectedBooking, setSelectedBooking] = useState<BookingType | null>(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: [],
    dateRange: null,
    exhibition: null
  });
  const navigate = useNavigate();
  const { data: invoices, isLoading: isLoadingInvoices, error: invoiceError, refetch: refetchInvoices } = useGetInvoicesQuery({ page: 1, limit: 100 });
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('pending');
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const { hasPermission } = usePermission();

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // First, fetch all exhibitions to ensure we have the complete list
  useEffect(() => {
    dispatch(fetchExhibitions());
  }, [dispatch]);

  // Then fetch details for the current exhibition when needed
  useEffect(() => {
    if (bookings.length > 0) {
      // Get unique exhibition IDs from all bookings
      const uniqueExhibitionIds = [...new Set(bookings.map(b => b.exhibitionId._id))];
      
      // Fetch details for each unique exhibition
      uniqueExhibitionIds.forEach(exhibitionId => {
        dispatch(fetchExhibition(exhibitionId));
      });
    }
  }, [bookings, dispatch]);

  /**
   * Handles booking status updates
   * - Validates status transitions
   * - Updates stall availability based on status
   * - Refreshes booking list after update
   */
  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus, rejectionReason?: string) => {
    try {
      setUpdateLoading(true);
      await dispatch(updateBookingStatus({ 
        id: bookingId, 
        status: newStatus,
        ...(rejectionReason && { rejectionReason })
      })).unwrap();
      
      message.success(`Booking ${newStatus} successfully`);
      dispatch(fetchBookings());
      
      // If booking is being approved, refetch invoices since a new invoice will be generated
      if (newStatus === 'approved') {
        // Give the backend a moment to generate the invoice
        setTimeout(async () => {
          await refetchInvoices();
        }, 1000);
      }
      
      setIsDetailsModalVisible(false);
      setIsStatusModalVisible(false);
      setSelectedBooking(null);
    } catch (error) {
      message.error('Failed to update booking status');
    } finally {
      setUpdateLoading(false);
    }
  };

  /**
   * Deletes a booking
   * - Requires confirmation
   * - Updates stall availability
   * - Removes booking and related invoice
   */
  const handleDelete = async (bookingId: string) => {
    try {
      await dispatch(deleteBooking(bookingId)).unwrap();
      message.success('Booking deleted successfully');
      dispatch(fetchBookings());
    } catch (error: any) {
      message.error(error?.message || 'Failed to delete booking');
    }
  };

  /**
   * Applies filters to the booking list
   * - Company name search
   * - Status filtering
   * - Date range filtering
   * - Exhibition filtering
   */
  const handleFilter = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const filteredBookings = (bookings as BookingType[]).filter((booking: BookingType) => {
    // Search filter
    if (filters.search && !booking.companyName?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Status filter
    if (filters.status.length > 0 && !filters.status.includes(booking.status)) {
      return false;
    }

    // Exhibition filter
    if (filters.exhibition && booking.exhibitionId._id !== filters.exhibition) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const [start, end] = filters.dateRange;
      const bookingDate = new Date(booking.createdAt);
      if (bookingDate < new Date(start) || bookingDate > new Date(end)) {
        return false;
      }
    }

    return true;
  });

  /**
   * Formats a booking ID into a user-friendly booking number using the exhibition's invoice prefix
   * @param id MongoDB ObjectId
   * @param createdAt Booking creation date
   * @returns Formatted booking number (e.g., AEPL/2024/01)
   */
  const formatBookingNumber = (id: string, createdAt: string): string => {
    const year = new Date(createdAt).getFullYear();
    
    // Find the current booking's exhibition
    const booking = bookings.find(b => b._id === id) as BookingType | undefined;
    if (!booking) return `--/${year}/--`;

    // Get all bookings for this specific exhibition, sorted by creation date
    const exhibitionBookings = (bookings as BookingType[])
      .filter(b => b.exhibitionId._id === booking.exhibitionId._id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Find the sequence number by getting this booking's position in the sorted array
    const sequenceNum = exhibitionBookings.findIndex(b => b._id === id) + 1;
    // Pad the sequence number to 2 digits (01, 02, etc.)
    const sequence = sequenceNum.toString().padStart(2, '0');
    
    // Get the exhibition details from the Redux store
    const exhibition = exhibitions.find(e => e._id === booking.exhibitionId._id) as Exhibition | undefined;
    
    // Use exhibition's invoice prefix or fall back to booking's exhibition prefix or 'BK'
    const prefix = exhibition?.invoicePrefix || (booking.exhibitionId as Exhibition).invoicePrefix || 'BK';
    
    return `${prefix}/${year}/${sequence}`;
  };

  const getInvoiceId = (bookingId: string) => {
    if (isLoadingInvoices) {
      console.log('Loading invoices...');
      return null;
    }

    if (invoiceError) {
      console.error('Error loading invoices:', invoiceError);
      return null;
    }

    if (!invoices) {
      console.log('No invoices available');
      return null;
    }

    // Access the data array from the paginated response
    const invoicesData = invoices.data || [];

    console.log('Looking for invoice with booking ID:', bookingId);
    const invoice = invoicesData.find(invoice => 
      invoice.bookingId && 
      typeof invoice.bookingId === 'object' && 
      invoice.bookingId._id === bookingId
    );
    
    console.log('Found invoice:', invoice);
    return invoice?._id;
  };

  const handleInvoiceClick = async (record: BookingType) => {
    if (isLoadingInvoices) {
      message.loading('Loading invoice data...');
      return;
    }

    // Try to find the invoice first
    let invoiceId = getInvoiceId(record._id);
    
    // If not found, refetch and try again
    if (!invoiceId) {
      const messageKey = 'invoice-loading';
      message.loading({ content: 'Checking for invoice...', key: messageKey });
      
      // Force a refetch from backend with skip cache option
      await refetchInvoices();
      invoiceId = getInvoiceId(record._id);

      if (invoiceId) {
        message.success({ content: 'Invoice found!', key: messageKey, duration: 1 });
        navigate(`/invoice/${invoiceId}`);
        return;
      }

      // Check if the booking is recent or if it's an approved booking
      const bookingDate = new Date(record.createdAt);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const isRecentOrApproved = bookingDate > thirtyMinutesAgo || record.status === 'approved';
      
      if (isRecentOrApproved) {
        message.info({ 
          content: 'Invoice is still being generated. Checking again in a moment...', 
          key: messageKey 
        });
        
        // Implement multiple retries with increasing intervals
        let retryCount = 0;
        const maxRetries = 5;
        const retryIntervals = [2000, 3000, 5000, 8000, 10000]; // Increasing intervals
        
        const attemptFetch = async () => {
          retryCount++;
          
          // Use skipCache option to force a network request instead of using cached data
          await refetchInvoices();
          const retryInvoiceId = getInvoiceId(record._id);
          
          if (retryInvoiceId) {
            message.success({ 
              content: 'Invoice is ready!', 
              key: messageKey,
              duration: 1
            });
            navigate(`/invoice/${retryInvoiceId}`);
          } else if (retryCount < maxRetries) {
            // Continue retrying with countdown and increasing intervals
            const nextInterval = retryIntervals[retryCount] || 5000;
            const secondsToWait = nextInterval / 1000;
            
            message.info({ 
              content: `Attempt ${retryCount}/${maxRetries}: Invoice not ready yet. Trying again in ${secondsToWait} seconds...`, 
              key: messageKey 
            });
            setTimeout(attemptFetch, nextInterval);
          } else {
            message.warning({ 
              content: 'Invoice generation is taking longer than expected. Please try refreshing the page in a few moments.', 
              key: messageKey 
            });
          }
        };
        
        // Start the retry process with the first interval
        setTimeout(attemptFetch, retryIntervals[0]);
      } else {
        message.error({ 
          content: 'No invoice found for this booking. Please contact support if this persists.', 
          key: messageKey 
        });
      }
    } else {
      // Invoice was found immediately
      navigate(`/invoice/${invoiceId}`);
    }
  };

  const columns: ColumnsType<BookingType> = [
    {
      title: 'Booking Number',
      dataIndex: '_id',
      key: '_id',
      fixed: 'left' as const,
      width: 200,
      render: (_id: string, record: BookingType) => (
        <Button type="link" onClick={() => {
          setSelectedBooking(bookings.find(b => b._id === _id) || null);
          setIsDetailsModalVisible(true);
        }}>
          {formatBookingNumber(_id, record.createdAt)}
        </Button>
      )
    },
    {
      title: 'Exhibition',
      dataIndex: ['exhibitionId', 'name'],
      key: 'exhibition',
      width: 250,
      render: (_: string, record: BookingType) => record.exhibitionId.name
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'company',
      width: 250,
      render: (companyName: string) => companyName || 'N/A'
    },
    {
      title: 'Stalls',
      key: 'stalls',
      width: 150,
      render: (_: any, record: BookingType) => record.stallIds.map(stall => stall.number).join(', ')
    },
    
    {
      title: 'Base Amount',
      dataIndex: ['calculations', 'totalBaseAmount'],
      key: 'baseAmount',
      width: 150,
      render: (amount: number) => `₹${amount.toLocaleString()}`
    },
    {
      title: 'Discount',
      key: 'discount',
      width: 150,
      render: (_: any, record: BookingType) => {
        const totalDiscount = record.calculations.totalDiscountAmount;
        if (!totalDiscount || totalDiscount === 0) return '-';

        const discountDetails = record.calculations.stalls
          .filter(stall => stall.discount)
          .map(stall => stall.discount);

        if (discountDetails.length === 0) return '-';

        const firstDiscount = discountDetails[0];
        return (
          <Tooltip title={
            <div>
              {discountDetails.map((discount, index) => (
                <div key={index}>
                  {discount?.name}: {discount?.type === 'percentage' ? `${discount?.value}%` : `₹${discount?.value}`}
                  <br />
                  Amount: ₹{discount?.amount.toLocaleString()}
                </div>
              ))}
            </div>
          }>
            <Tag color="red">
              -₹{totalDiscount.toLocaleString()}
              {firstDiscount?.type === 'percentage' && ` (${firstDiscount.value}%)`}
              {discountDetails.length > 1 && ' +'}
            </Tag>
          </Tooltip>
        );
      }
    },
    {
      title: 'Total Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount: number) => `₹${amount.toLocaleString()}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={
          status === 'confirmed' ? 'success' :
          status === 'approved' ? 'blue' :
          status === 'pending' ? 'warning' :
          status === 'rejected' ? 'error' :
          'default'
        }>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (date: string) => dayjs(date).format('MMM D, YYYY HH:mm')
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 220,
      render: (_, record: BookingType) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedBooking(record);
                setIsDetailsModalVisible(true);
              }}
            />
          </Tooltip>
          <Dropdown
            overlay={
              <Menu>
                {record.status !== 'cancelled' && hasPermission('view_bookings') && (
                  <Menu.Item 
                    key="invoice" 
                    icon={<FileTextOutlined />}
                    disabled={isLoadingInvoices}
                    onClick={() => handleInvoiceClick(record)}
                  >
                    View Invoice
                  </Menu.Item>
                )}
                <Menu.Item 
                  key="updateStatus" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => {
                    setSelectedBooking(record);
                    setSelectedStatus(record.status);
                    setRejectionReasonText(record.rejectionReason || '');
                    setIsStatusModalVisible(true);
                  }}
                >
                  Update Status
                </Menu.Item>
                {hasPermission('bookings_delete') && (
                  <Menu.Item 
                    key="delete" 
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => {
                      Modal.confirm({
                        title: 'Delete Booking',
                        content: 'Are you sure you want to delete this booking? This action cannot be undone.',
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk: () => handleDelete(record._id)
                      });
                    }}
                  >
                    Delete
                  </Menu.Item>
                )}
              </Menu>
            }
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
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
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/bookings/create')}
            >
              Create Booking
            </Button>
          </Col>
        </Row>
      </div>

      {/* Statistics */}
      <BookingStatistics bookings={bookings as BookingType[]} />

      {/* Filters */}
      <BookingFilters 
        filters={filters} 
        exhibitions={exhibitions as any[]}
        onFilterChange={handleFilter}
        onRefresh={() => dispatch(fetchBookings())}
      />

      {/* Table */}
      <Card 
        className="info-card"
        styles={{ 
          body: { padding: 0, overflow: 'auto' }
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredBookings as any[]}
          loading={loading}
          rowKey="_id"
          scroll={{ x: 1500 }}
          pagination={{
            total: filteredBookings.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            position: ['bottomRight']
          }}
        />
      </Card>

      {/* Booking Details Modal */}
      <Modal
        title="Booking Details"
        open={isDetailsModalVisible}
        onCancel={() => {
          setIsDetailsModalVisible(false);
          setSelectedBooking(null);
        }}
        footer={[
          <Button 
            key="updateStatus"
            type="primary"
            disabled={!selectedBooking}
            onClick={() => {
              if (selectedBooking) {
                setSelectedStatus(selectedBooking.status);
                setRejectionReasonText(selectedBooking.rejectionReason || '');
                setIsStatusModalVisible(true);
              }
            }}
          >
            Update Status
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setIsDetailsModalVisible(false);
              setSelectedBooking(null);
            }}
          >
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedBooking && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Booking Number" span={2}>
                {formatBookingNumber(selectedBooking._id, selectedBooking.createdAt)}
                <Text type="secondary" style={{ marginLeft: 8, fontSize: '12px' }}>
                  (ID: {selectedBooking._id})
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Exhibition" span={2}>
                {selectedBooking.exhibitionId.name}
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                <Tag color={
                  selectedBooking.status === 'confirmed' ? 'success' :
                  selectedBooking.status === 'approved' ? 'blue' :
                  selectedBooking.status === 'pending' ? 'warning' :
                  selectedBooking.status === 'rejected' ? 'error' :
                  'default'
                }>
                  {selectedBooking.status.toUpperCase()}
                </Tag>
                {selectedBooking.rejectionReason && (
                  <div style={{ marginTop: 8 }}>
                    <Text type="secondary">Rejection Reason:</Text>
                    <br />
                    <Text>{selectedBooking.rejectionReason}</Text>
                  </div>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Name">
                {selectedBooking.customerName}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Email">
                {selectedBooking.customerEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Phone">
                {selectedBooking.customerPhone}
              </Descriptions.Item>
              <Descriptions.Item label="Company Name">
                {selectedBooking.companyName}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Stall Details" size="small">
              <Table
                dataSource={selectedBooking.stallIds}
                pagination={false}
                rowKey="_id"
                columns={[
                  {
                    title: 'Stall Number',
                    dataIndex: 'number',
                    key: 'number'
                  },
                  {
                    title: 'Dimensions',
                    key: 'dimensions',
                    render: (record: Stall) => (
                      <Tag color="blue">
                        {record.dimensions.width}x{record.dimensions.height}m
                      </Tag>
                    )
                  },
                  {
                    title: 'Rate (per sqm)',
                    dataIndex: 'ratePerSqm',
                    key: 'rate',
                    render: (rate: number) => `₹${rate.toLocaleString()}`
                  },
                  {
                    title: 'Base Amount',
                    key: 'baseAmount',
                    render: (stall: Stall) => {
                      const stallCalc = selectedBooking.calculations.stalls.find(
                        s => s.stallId === stall._id
                      );
                      return stallCalc ? `₹${stallCalc.baseAmount.toLocaleString()}` : '-';
                    }
                  },
                  {
                    title: 'Discount',
                    key: 'discount',
                    render: (stall: Stall) => {
                      const stallCalc = selectedBooking.calculations.stalls.find(
                        s => s.stallId === stall._id
                      );
                      if (!stallCalc?.discount) return '-';
                      return (
                        <Tag color="red">
                          -₹{stallCalc.discount.amount.toLocaleString()}
                          {stallCalc.discount.type === 'percentage' && 
                            ` (${stallCalc.discount.value}%)`}
                        </Tag>
                      );
                    }
                  }
                ]}
              />
            </Card>

            <Card title="Financial Summary" size="small">
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Total Base Amount:</Text>
                  <Text>₹{selectedBooking.calculations.totalBaseAmount.toLocaleString()}</Text>
                </div>
                {selectedBooking.calculations.totalDiscountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Total Discount:</Text>
                    <Text type="danger">
                      -₹{selectedBooking.calculations.totalDiscountAmount.toLocaleString()}
                    </Text>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Amount after Discount:</Text>
                  <Text>₹{selectedBooking.calculations.totalAmountAfterDiscount.toLocaleString()}</Text>
                </div>
                <Divider style={{ margin: '8px 0' }} />
                {selectedBooking.calculations.taxes.map(tax => (
                  <div key={tax.name} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>{tax.name} ({tax.rate}%):</Text>
                    <Text>₹{tax.amount.toLocaleString()}</Text>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <Text strong>Total Amount (incl. Taxes):</Text>
                  <Text strong>₹{selectedBooking.amount.toLocaleString()}</Text>
                </div>
              </Space>
            </Card>
          </Space>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal
        title="Update Booking Status"
        open={isStatusModalVisible}
        onCancel={() => {
          setIsStatusModalVisible(false);
          setRejectionReasonText('');
        }}
        footer={null}
        width={600}
      >
        {selectedBooking && (
          <div>
            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileTextOutlined style={{ fontSize: '18px' }} />
                  <span>Booking Information</span>
                </div>
              }
              style={{ marginBottom: 16 }}
              bordered={false}
              size="small"
            >
              <Row gutter={[16, 8]}>
                <Col span={8}>
                  <Text strong>Booking Number:</Text>
                </Col>
                <Col span={16}>
                  <Text>{formatBookingNumber(selectedBooking._id, selectedBooking.createdAt)}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Company:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedBooking.companyName}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Exhibition:</Text>
                </Col>
                <Col span={16}>
                  <Text>{selectedBooking.exhibitionId.name}</Text>
                </Col>
                
                <Col span={8}>
                  <Text strong>Current Status:</Text>
                </Col>
                <Col span={16}>
                  <Tag color={
                    selectedBooking.status === 'confirmed' ? 'success' :
                    selectedBooking.status === 'approved' ? 'blue' :
                    selectedBooking.status === 'pending' ? 'warning' :
                    selectedBooking.status === 'rejected' ? 'error' :
                    'default'
                  }>
                    {selectedBooking.status.toUpperCase()}
                  </Tag>
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
                      value={selectedStatus} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      buttonStyle="solid"
                      style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto' }}
                    >
                      <Radio.Button value="pending" style={{ flex: '0 0 auto' }}>
                        <Space>
                          <ClockCircleOutlined style={{ color: '#faad14' }} />
                          Pending
                        </Space>
                      </Radio.Button>
                      <Radio.Button value="approved" style={{ flex: '0 0 auto' }}>
                        <Space>
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          Approved
                        </Space>
                      </Radio.Button>
                      <Radio.Button value="rejected" style={{ flex: '0 0 auto' }}>
                        <Space>
                          <CloseCircleOutlined style={{ color: '#f5222d' }} />
                          Rejected
                        </Space>
                      </Radio.Button>
                      <Radio.Button value="confirmed" style={{ flex: '0 0 auto' }}>
                        <Space>
                          <CheckCircleOutlined style={{ color: '#1890ff' }} />
                          Confirmed
                        </Space>
                      </Radio.Button>
                      <Radio.Button value="cancelled" style={{ flex: '0 0 auto' }}>
                        <Space>
                          <CloseCircleOutlined style={{ color: '#ff7875' }} />
                          Cancelled
                        </Space>
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
                
                {selectedStatus === 'rejected' && (
                  <div>
                    <Form.Item 
                      label={<Text strong>Rejection Reason:</Text>}
                      required={selectedStatus === 'rejected'}
                      rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
                      help="This will be visible to the customer"
                    >
                      <Input.TextArea
                        rows={4}
                        value={rejectionReasonText}
                        onChange={e => setRejectionReasonText(e.target.value)}
                        placeholder="Provide a reason for rejection"
                        style={{ marginTop: 8 }}
                      />
                    </Form.Item>
                  </div>
                )}
                
                {selectedStatus === 'approved' && (
                  <Alert
                    message="Approval Confirmation"
                    description="By approving this booking, the stalls will be reserved but not yet confirmed. Customer will be notified."
                    type="success"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
                
                {selectedStatus === 'confirmed' && (
                  <Alert
                    message="Confirmation Notice"
                    description="By confirming this booking, the stalls will be marked as booked. This should be done after payment is received."
                    type="info"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
                
                {selectedStatus === 'cancelled' && (
                  <Alert
                    message="Cancellation Warning"
                    description="By cancelling this booking, all stalls will be marked as available again."
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
                
                {selectedStatus === 'pending' && (
                  <Alert
                    message="Return to Pending"
                    description="This booking will be moved back to pending status."
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                  />
                )}
              </div>
              
              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={() => {
                  setIsStatusModalVisible(false);
                  setRejectionReasonText('');
                }}>
                  Cancel
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => {
                    if (selectedStatus === 'rejected' && !rejectionReasonText.trim()) {
                      message.error('Rejection reason is required when rejecting a booking');
                      return;
                    }
                    
                    handleStatusUpdate(
                      selectedBooking._id, 
                      selectedStatus,
                      selectedStatus === 'rejected' ? rejectionReasonText : undefined
                    );
                  }}
                  loading={updateLoading}
                  disabled={selectedStatus === 'rejected' && !rejectionReasonText.trim()}
                >
                  Update Status
                </Button>
              </div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StallBookingManager; 