import React from 'react';
import { 
  Modal, Tag, Space, Button, 
  Typography, Descriptions, Card, Table, Divider, Tooltip,
  Form, Input, Radio, Alert
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined,
  DeleteOutlined, ExclamationCircleOutlined, ClockCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { BookingType, BookingStatus, Stall } from './types';
import { deleteBooking, updateBookingStatus } from '../../../store/slices/bookingSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { message } from 'antd';
import { useGetInvoicesQuery } from '../../../store/services/invoice';

const { Title, Text } = Typography;

interface DetailsModalProps {
  selectedBooking: BookingType | null;
  isDetailsModalVisible: boolean;
  setIsDetailsModalVisible: (visible: boolean) => void;
  setSelectedBooking: (booking: BookingType | null) => void;
  setIsStatusModalVisible: (visible: boolean) => void;
  setSelectedStatus: (status: BookingStatus) => void;
  setRejectionReasonText: (text: string) => void;
  formatBookingNumber: (id: string, createdAt: string) => string;
}

/**
 * Details modal for viewing comprehensive booking information
 */
export const BookingDetailsModal: React.FC<DetailsModalProps> = ({ 
  selectedBooking, 
  isDetailsModalVisible,
  setIsDetailsModalVisible,
  setSelectedBooking,
  setIsStatusModalVisible,
  setSelectedStatus,
  setRejectionReasonText,
  formatBookingNumber
}) => {
  return (
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
          <Descriptions bordered={true} column={2}>
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
                  title: 'Stall Type',
                  key: 'type',
                  render: (stall: Stall) => stall.type || '-'
                },
                {
                  title: 'Dimensions',
                  key: 'dimensions',
                  render: (record: Stall) => (
                    <Tag color="blue">
                      {record.dimensions ? 
                       `${record.dimensions.width}x${record.dimensions.height}m` : 
                       'No dimensions'}
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
                      <Tooltip title={
                        <div>
                          {stallCalc.discount.type === 'percentage' && 
                            ` (${stallCalc.discount.value}%)`}
                        </div>
                      }>
                        <Tag color="red">
                          -₹{stallCalc.discount.amount.toLocaleString()}
                          {stallCalc.discount.type === 'percentage' && 
                            ` (${stallCalc.discount.value}%)`}
                        </Tag>
                      </Tooltip>
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
                <div key={`tax-${tax.name}-${tax.rate}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
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
  );
};

interface StatusModalProps {
  selectedBooking: BookingType | null;
  isStatusModalVisible: boolean;
  setIsStatusModalVisible: (visible: boolean) => void;
  selectedStatus: BookingStatus;
  setSelectedStatus: (status: BookingStatus) => void;
  rejectionReasonText: string;
  setRejectionReasonText: (text: string) => void;
  formatBookingNumber: (id: string, createdAt: string) => string;
  refreshAfterAction: () => void;
}

/**
 * Modal for updating booking status
 */
export const StatusUpdateModal: React.FC<StatusModalProps> = ({
  selectedBooking,
  isStatusModalVisible,
  setIsStatusModalVisible,
  selectedStatus,
  setSelectedStatus,
  rejectionReasonText,
  setRejectionReasonText,
  formatBookingNumber,
  refreshAfterAction
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [updateLoading, setUpdateLoading] = React.useState(false);
  const { refetch } = useGetInvoicesQuery({ page: 1, limit: 100 });

  /**
   * Handles status updates via API
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
      refreshAfterAction();
      
      setIsStatusModalVisible(false);
      setSelectedBooking(null);

      if (newStatus === 'approved') {
        setTimeout(async () => {
          await refetch();
        }, 1000);
      }
    } catch (error) {
      message.error('Failed to update booking status');
    } finally {
      setUpdateLoading(false);
    }
  };

  /**
   * Helper function to set selected booking to null
   */
  const setSelectedBooking = (booking: BookingType | null) => {
    // This is just a stub - the actual state is managed in the parent component
  };

  return (
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
            variant="borderless"
            size="small"
          >
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Tag color="processing">
                  {formatBookingNumber(selectedBooking._id, selectedBooking.createdAt)}
                </Tag>
                <Tag color="default">
                  {selectedBooking.exhibitionId.name}
                </Tag>
                <Tag color={
                  selectedBooking.status === 'confirmed' ? 'success' :
                  selectedBooking.status === 'approved' ? 'blue' :
                  selectedBooking.status === 'pending' ? 'warning' :
                  selectedBooking.status === 'rejected' ? 'error' :
                  'default'
                }>
                  {selectedBooking.status.toUpperCase()}
                </Tag>
              </div>
              
              <div style={{ marginTop: '8px' }}>
                <Text strong>Stall Details:</Text>
                <div style={{ marginTop: '4px' }}>
                  {selectedBooking.stallIds.map((stall, index) => (
                    <Tag key={stall._id} style={{ margin: '2px' }}>
                      #{stall.number} {stall.type && `(${stall.type})`}
                    </Tag>
                  ))}
                </div>
              </div>
              
              <Divider style={{ margin: '8px 0' }} />
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Text strong style={{ minWidth: '120px' }}>Company:</Text>
                <Text>{selectedBooking.companyName}</Text>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Text strong style={{ minWidth: '120px' }}>Current Status:</Text>
                <Tag color={
                  selectedBooking.status === 'confirmed' ? 'success' :
                  selectedBooking.status === 'approved' ? 'blue' :
                  selectedBooking.status === 'pending' ? 'warning' :
                  selectedBooking.status === 'rejected' ? 'error' :
                  'default'
                }>
                  {selectedBooking.status.toUpperCase()}
                </Tag>
              </div>
            </Space>
          </Card>

          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ExclamationCircleOutlined style={{ fontSize: '18px' }} />
                <span>Update Status</span>
              </div>
            }
            variant="borderless"
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
  );
};

/**
 * Displays a delete confirmation modal with styled UI
 */
export const showDeleteConfirm = (record: BookingType, handleDelete: (id: string) => void, formatBookingNumber: (id: string, createdAt: string) => string) => {
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