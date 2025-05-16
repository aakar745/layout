import React from 'react';
import { 
  Button, Table, Tag, Space, Tooltip, Menu, Dropdown, Pagination, message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  EyeOutlined, FileTextOutlined, CheckCircleOutlined, 
  DeleteOutlined, MoreOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { BookingType } from './types';
import { showDeleteConfirm } from './BookingModals';
import { useGetInvoicesQuery } from '../../../store/services/invoice';

interface BookingTableProps {
  bookings: BookingType[];
  loading: boolean;
  fetchBookingsWithPagination: (page: number, pageSize: number) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  setSelectedBooking: (booking: BookingType | null) => void;
  setIsDetailsModalVisible: (visible: boolean) => void;
  setIsStatusModalVisible: (visible: boolean) => void;
  setSelectedStatus: (status: BookingType['status']) => void;
  setRejectionReasonText: (text: string) => void;
  formatBookingNumber: (id: string, createdAt: string) => string;
  handleDelete: (id: string) => void;
  hasPermission: (permission: string) => boolean;
}

/**
 * Gets columns configuration for the booking table
 */
export const getTableColumns = (
  props: BookingTableProps
): ColumnsType<BookingType> => {
  const navigate = useNavigate();
  const { data: invoices, isLoading: isLoadingInvoices, error: invoiceError, refetch: refetchInvoices } = useGetInvoicesQuery({ page: 1, limit: 100 });
  
  // Gets the invoice ID for a booking
  const getInvoiceId = (bookingId: string) => {
    if (isLoadingInvoices || invoiceError || !invoices) {
      return null;
    }

    // Access the data array from the paginated response
    const invoicesData = invoices.data || [];

    const invoice = invoicesData.find(invoice => 
      invoice.bookingId && 
      typeof invoice.bookingId === 'object' && 
      invoice.bookingId._id === bookingId
    );
    
    return invoice?._id;
  };
  
  // Handles the invoice viewing functionality with retries
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

  return [
    {
      title: 'Booking Number',
      dataIndex: '_id',
      key: 'bookingNumber',
      fixed: 'left' as const,
      width: 170,
      render: (_id: string, record: BookingType) => (
        <Button type="link" onClick={() => {
          props.setSelectedBooking(record);
          props.setIsDetailsModalVisible(true);
        }}>
          {props.formatBookingNumber(_id, record.createdAt)}
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
      title: 'Stall No.',
      key: 'stallNumber',
      width: 120,
      render: (_: any, record: BookingType) => (
        <span>
          {record.stallIds.map((stall, index) => (
            <span key={`stall-${stall._id || index}`}>{stall.number}{index < record.stallIds.length - 1 ? ', ' : ''}</span>
          ))}
        </span>
      )
    },
    {
      title: 'Stall Type',
      key: 'stallType',
      width: 120,
      render: (_: any, record: BookingType) => {
        const types = Array.from(new Set(record.stallIds.map(stall => stall.type)));
        return (
          <span>
            {types.map((type, index) => (
              <span key={`type-${type}-${index}`}>
                {type}{index < types.length - 1 ? ', ' : ''}
              </span>
            ))}
          </span>
        );
      }
    },
    {
      title: 'Dimensions',
      key: 'dimensions',
      width: 150,
      render: (_: any, record: BookingType) => (
        <span>
          {record.stallIds.map((stall, index) => (
            <span key={`dim-${stall._id || index}`}>
              {stall.dimensions ? 
              `${stall.dimensions.width}m × ${stall.dimensions.height}m` : 
              'No dimensions'}
              {index < record.stallIds.length - 1 ? ', ' : ''}
            </span>
          ))}
        </span>
      )
    },
    {
      title: 'Area (sqm)',
      key: 'area',
      width: 120,
      render: (_: any, record: BookingType) => {
        const totalArea = record.stallIds.reduce(
          (sum, stall) => {
            if (!stall.dimensions) return sum;
            return sum + (stall.dimensions.width * stall.dimensions.height);
          }, 
          0
        );
        return <span>{Math.round(totalArea)} sqm</span>;
      }
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
                <div key={`discount-${index}-${discount?.name || 'unnamed'}`}>
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
                props.setSelectedBooking(record);
                props.setIsDetailsModalVisible(true);
              }}
            />
          </Tooltip>
          <Dropdown
            overlay={
              <Menu>
                {record.status !== 'cancelled' && props.hasPermission('view_bookings') && (
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
                    props.setSelectedBooking(record);
                    props.setSelectedStatus(record.status);
                    props.setRejectionReasonText(record.rejectionReason || '');
                    props.setIsStatusModalVisible(true);
                  }}
                >
                  Update Status
                </Menu.Item>
                {props.hasPermission('bookings_delete') && (
                  <Menu.Item 
                    key="delete" 
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => {
                      showDeleteConfirm(record, props.handleDelete, props.formatBookingNumber);
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
};

/**
 * BookingTable component that handles the main table display
 */
const BookingTable: React.FC<BookingTableProps> = (props) => {
  const {
    bookings,
    loading,
    pagination,
    fetchBookingsWithPagination
  } = props;

  // Get the columns configuration
  const columns = getTableColumns(props);

  // Custom render function for pagination toolbar
  const renderPaginationToolbar = (
    current: number, 
    pageSize: number, 
    total: number, 
    onChange: (page: number, pageSize: number) => void
  ) => {
    return (
      <div className="ant-table-pagination ant-table-pagination-right" 
        style={{ 
          padding: '16px 24px',
          margin: 0,
          display: 'flex',
          justifyContent: 'flex-end' 
        }}
      >
        <Pagination
          current={current}
          pageSize={pageSize}
          total={total}
          showTotal={(total) => `Total ${total} items`}
          showSizeChanger={true}
          pageSizeOptions={['5', '10', '20', '50', '100']}
          onChange={(page) => onChange(page, pageSize)}
          onShowSizeChange={(page, size) => onChange(page, size)}
          size="default"
        />
      </div>
    );
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={bookings}
        loading={loading}
        rowKey="_id"
        scroll={{ x: 1800 }}
        pagination={false}
      />
      {renderPaginationToolbar(
        pagination.page,
        pagination.limit,
        pagination.total,
        (page, pageSize) => fetchBookingsWithPagination(page, pageSize)
      )}
    </>
  );
};

export default BookingTable; 