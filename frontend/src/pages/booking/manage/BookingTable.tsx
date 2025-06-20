import React from 'react';
import { 
  Button, Table, Tag, Space, Tooltip, Menu, Dropdown, Pagination, message, Modal
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { 
  EyeOutlined, FileTextOutlined, CheckCircleOutlined, 
  DeleteOutlined, MoreOutlined, MailOutlined, MessageOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { BookingType } from './types';
import { useGetInvoicesQuery, useShareViaEmailMutation, useShareViaWhatsAppMutation } from '../../../store/services/invoice';

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
 * Displays a delete confirmation modal with styled UI
 */
const showDeleteConfirm = (record: BookingType, handleDelete: (id: string) => void, formatBookingNumber: (id: string, createdAt: string) => string) => {
  Modal.confirm({
    title: (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        color: '#101828',
        padding: '20px 24px',
        borderBottom: '1px solid #EAECF0'
      }}>
        <DeleteOutlined style={{ 
          color: '#F04438',
          fontSize: '22px'
        }} />
        <span style={{ 
          fontSize: '18px',
          fontWeight: 600,
          lineHeight: '28px'
        }}>
          Delete Booking
        </span>
      </div>
    ),
    content: (
      <div style={{ 
        padding: '20px 24px',
        color: '#475467'
      }}>
        <p style={{ 
          fontSize: '14px',
          lineHeight: '20px',
          marginBottom: '8px' 
        }}>
          Are you sure you want to delete booking <strong>{formatBookingNumber(record._id, record.createdAt)}</strong>?
        </p>
        <p style={{ 
          color: '#667085',
          fontSize: '14px',
          lineHeight: '20px',
          marginBottom: 0 
        }}>
          This action cannot be undone and will permanently delete all associated data including invoices.
        </p>
      </div>
    ),
    footer: (
      <div style={{ 
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        padding: '20px 24px',
        borderTop: '1px solid #EAECF0',
        marginTop: 0
      }}>
        <Button
          onClick={() => Modal.destroyAll()}
          style={{ 
            height: '40px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid #D0D5DD',
            color: '#344054',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
          }}
        >
          Cancel
        </Button>
        <Button
          danger
          type="primary"
          onClick={() => {
            handleDelete(record._id);
            Modal.destroyAll();
          }}
          style={{ 
            height: '40px',
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#D92D20',
            color: 'white',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '20px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)'
          }}
        >
          Delete
        </Button>
      </div>
    ),
    centered: true,
    icon: null,
    width: 400,
    closable: true,
    maskClosable: true,
    className: 'delete-confirmation-modal',
    styles: {
      mask: { 
        backgroundColor: 'rgba(52, 64, 84, 0.7)' 
      },
      content: {
        padding: 0,
        borderRadius: '12px',
        boxShadow: '0px 4px 6px -2px rgba(16, 24, 40, 0.05), 0px 12px 16px -4px rgba(16, 24, 40, 0.1)'
      },
      body: {
        padding: 0
      },
      footer: {
        display: 'none'
      }
    }
  });
};

/**
 * Gets columns configuration for the booking table
 */
export const getTableColumns = (
  props: BookingTableProps
): ColumnsType<BookingType> => {
  const navigate = useNavigate();
  const { data: invoices, isLoading: isLoadingInvoices, error: invoiceError, refetch: refetchInvoices } = useGetInvoicesQuery({ 
    page: 1, 
    limit: 200 // Increased to ensure we get all invoices for better matching
  }, {
    // Reduce cache time to get fresher data
    refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
    refetchOnFocus: true, // Refetch when window regains focus
  });
  
  // Hook for sending invoice via email
  const [shareViaEmail, { isLoading: isSendingEmail }] = useShareViaEmailMutation();
  
  // Hook for sending invoice via WhatsApp
  const [shareViaWhatsApp, { isLoading: isSendingWhatsApp }] = useShareViaWhatsAppMutation();
  
  // Handle sending invoice via email
  const handleSendInvoice = async (record: BookingType) => {
    try {
      // Check if booking is approved before allowing invoice email
      if (record.status !== 'approved' && record.status !== 'confirmed') {
        message.warning('Booking must be approved or confirmed before sending invoice.');
        return;
      }

      // Get the invoice ID for this booking
      const invoiceId = getInvoiceId(record._id);
      if (!invoiceId) {
        message.error('Invoice not found for this booking.');
        return;
      }

      // Determine recipient email - prioritize exhibitor email, fallback to customer email
      const recipientEmail = record.exhibitorId?.email || record.customerEmail;
      if (!recipientEmail) {
        message.error('No email address found for this booking.');
        return;
      }

      // Get customer/company name for personalized message
      const customerName = record.exhibitorId?.contactPerson || record.customerName;
      const companyName = record.exhibitorId?.companyName || record.companyName;
      
      // Create personalized message
      const personalizedMessage = `Dear ${customerName},

Please find attached the invoice for your stall booking${companyName ? ` for ${companyName}` : ''}.

Booking Details:
- Booking ID: ${props.formatBookingNumber(record._id, record.createdAt)}
- Exhibition: ${record.exhibitionId.name}
- Total Amount: ₹${record.amount.toLocaleString()}
- Status: ${record.status.toUpperCase()}

Thank you for your business!

Best regards,
Exhibition Management Team`;

      // Send the email
      await shareViaEmail({
        id: invoiceId,
        email: recipientEmail,
        message: personalizedMessage
      }).unwrap();

      message.success(`Invoice sent successfully to ${recipientEmail}`);
    } catch (error: any) {
      console.error('Error sending invoice:', error);
      message.error(error?.data?.message || 'Failed to send invoice. Please try again.');
    }
  };
  
  // Handle sending invoice via WhatsApp
  const handleSendWhatsAppInvoice = async (record: BookingType) => {
    try {
      // Check if booking is approved before allowing invoice WhatsApp
      if (record.status !== 'approved' && record.status !== 'confirmed') {
        message.warning('Booking must be approved or confirmed before sending invoice.');
        return;
      }

      // Get the invoice ID for this booking
      const invoiceId = getInvoiceId(record._id);
      if (!invoiceId) {
        message.error('Invoice not found for this booking.');
        return;
      }

      // Determine recipient phone - prioritize exhibitor phone, fallback to customer phone
      const recipientPhone = record.exhibitorId?.phone || record.customerPhone;
      if (!recipientPhone) {
        message.error('No phone number found for this booking.');
        return;
      }

      // Send the WhatsApp message
      await shareViaWhatsApp({
        id: invoiceId,
        phoneNumber: recipientPhone
      }).unwrap();

      message.success(`Invoice sent successfully via WhatsApp to ${recipientPhone}`);
    } catch (error: any) {
      console.error('Error sending invoice via WhatsApp:', error);
      message.error(error?.data?.message || 'Failed to send invoice via WhatsApp. Please try again.');
    }
  };
  
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
  
  // Handles the invoice viewing functionality with improved retry logic
  const handleInvoiceClick = async (record: BookingType) => {
    // Check if booking is approved before allowing invoice access
    if (record.status !== 'approved' && record.status !== 'confirmed') {
      message.warning('First approve the stall, then view the invoice.');
      return;
    }

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
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000); // Reduced from 30 minutes to 5 minutes
      const isRecentOrApproved = bookingDate > fiveMinutesAgo || record.status === 'approved';
      
      if (isRecentOrApproved) {
        message.info({ 
          content: 'Invoice is being generated. Please wait...', 
          key: messageKey 
        });
        
        // Reduced retry attempts and shorter intervals for better UX
        let retryCount = 0;
        const maxRetries = 3; // Reduced from 5 to 3
        const retryIntervals = [1500, 2500, 4000]; // Shorter intervals
        
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
            // Continue retrying with less verbose messaging
            const nextInterval = retryIntervals[retryCount] || 3000;
            
            message.loading({ 
              content: `Checking invoice availability... (${retryCount}/${maxRetries})`, 
              key: messageKey 
            });
            setTimeout(attemptFetch, nextInterval);
          } else {
            message.warning({ 
              content: 'Invoice is still being processed. Please refresh the page in a moment or try again later.', 
              key: messageKey,
              duration: 4
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
      width: 190,
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
      render: (_: string, record: BookingType) => (
        <span>{record.exhibitionId.name}</span>
      )
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
      title: 'Booked By',
      dataIndex: 'bookedBy',
      key: 'bookedBy',
      width: 200,
      render: (_, record) => {
        if (record.bookingSource === 'exhibitor' && record.exhibitorId) {
          const exhibitor = record.exhibitorId;
          return (
            <Tooltip title={`${exhibitor.email} - Exhibitor Portal`}>
              <div>
                <div className="font-medium">{exhibitor.contactPerson}</div>
                <div className="text-xs text-gray-500">Exhibitor Portal</div>
              </div>
            </Tooltip>
          );
        } else if (record.bookingSource === 'admin' && record.userId) {
          const user = record.userId;
          const roleName = user.role?.name || 'Admin';
          return (
            <Tooltip title={`${user.email} - ${roleName}`}>
              <div>
                <div className="font-medium">{user.name || user.username}</div>
                <div className="text-xs text-gray-500">{roleName}</div>
              </div>
            </Tooltip>
          );
        }
        return <span className="text-gray-400">System</span>;
      },
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 200,
      render: (date: string) => dayjs(date).format('MMM D, YYYY HH:mm')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      fixed: 'right' as const,
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
                    disabled={isLoadingInvoices || (record.status !== 'approved' && record.status !== 'confirmed')}
                    onClick={() => handleInvoiceClick(record)}
                  >
                    {record.status !== 'approved' && record.status !== 'confirmed' 
                      ? 'Approve First to View Invoice' 
                      : 'View Invoice'
                    }
                  </Menu.Item>
                )}
                {record.status !== 'cancelled' && props.hasPermission('view_bookings') && (
                  <Menu.Item 
                    key="sendInvoice" 
                    icon={<MailOutlined />}
                    disabled={isSendingEmail || (record.status !== 'approved' && record.status !== 'confirmed')}
                    onClick={() => handleSendInvoice(record)}
                  >
                    {isSendingEmail 
                      ? 'Sending...' 
                      : record.status !== 'approved' && record.status !== 'confirmed' 
                        ? 'Approve First to Send Invoice' 
                        : 'Send Invoice'
                    }
                  </Menu.Item>
                )}
                                  <Menu.Item 
                    key="sendWhatsApp" 
                    icon={<MessageOutlined />}
                    disabled={isSendingWhatsApp || (record.status !== 'approved' && record.status !== 'confirmed')}
                    onClick={() => handleSendWhatsAppInvoice(record)}
                  >
                    {isSendingWhatsApp 
                      ? 'Sending WhatsApp...' 
                      : record.status !== 'approved' && record.status !== 'confirmed' 
                        ? 'Approve First to Send Invoice' 
                        : 'Send Invoice via WhatsApp'
                    }
                  </Menu.Item>
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
        scroll={{ x: 1950 }}
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