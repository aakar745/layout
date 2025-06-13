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
      footer={null}
      width={800}
      styles={{
        body: { padding: '16px' }
      }}
    >
      {selectedBooking && (
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Card title="Booking Information" size="small" styles={{ body: { padding: '16px' } }}>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {/* Booking Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#fafafa',
                borderRadius: '6px',
                border: '1px solid #f0f0f0'
              }}>
                <div>
                  <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                    {formatBookingNumber(selectedBooking._id, selectedBooking.createdAt)}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    {selectedBooking.exhibitionId.name}
                  </Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Tag color={
                    selectedBooking.status === 'confirmed' ? 'success' :
                    selectedBooking.status === 'approved' ? 'blue' :
                    selectedBooking.status === 'pending' ? 'warning' :
                    selectedBooking.status === 'rejected' ? 'error' :
                    'default'
                  } style={{ fontSize: '12px', fontWeight: 500 }}>
                    {selectedBooking.status.toUpperCase()}
                  </Tag>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(selectedBooking.createdAt).toLocaleDateString()}
                  </Text>
                </div>
              </div>

              {/* Rejection Reason (if applicable) */}
              {selectedBooking.rejectionReason && (
                <div style={{ 
                  padding: '8px 12px',
                  backgroundColor: '#fff2f0',
                  border: '1px solid #ffccc7',
                  borderRadius: '4px'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>
                    Rejection Reason:
                  </Text>
                  <br />
                  <Text style={{ fontSize: '13px' }}>{selectedBooking.rejectionReason}</Text>
                </div>
              )}

              {/* Customer Information */}
              <div>
                <Text strong style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Customer Details
                </Text>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Name</Text>
                    <Text style={{ fontSize: '13px' }}>{selectedBooking.customerName}</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Company</Text>
                    <Text style={{ fontSize: '13px' }}>{selectedBooking.companyName}</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Email</Text>
                    <Text style={{ fontSize: '13px' }}>{selectedBooking.customerEmail}</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Phone</Text>
                    <Text style={{ fontSize: '13px' }}>{selectedBooking.customerPhone}</Text>
                  </div>
                </div>
              </div>

              {/* Booking Source */}
              <div>
                <Text strong style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  Booking Source
                </Text>
                <div style={{ 
                  padding: '8px 12px',
                  backgroundColor: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {selectedBooking.bookingSource === 'exhibitor' && selectedBooking.exhibitorId ? (
                    <>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: '13px' }}>
                          {selectedBooking.exhibitorId.contactPerson}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {selectedBooking.exhibitorId.email}
                        </Text>
                      </div>
                      <Tag color="blue" style={{ fontSize: '11px' }}>Exhibitor Portal</Tag>
                    </>
                  ) : selectedBooking.bookingSource === 'admin' && selectedBooking.userId ? (
                    <>
                      <div style={{ flex: 1 }}>
                        <Text strong style={{ fontSize: '13px' }}>
                          {selectedBooking.userId.name || selectedBooking.userId.username}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {selectedBooking.userId.email}
                        </Text>
                      </div>
                      <Tag color="green" style={{ fontSize: '11px' }}>
                        {selectedBooking.userId.role?.name || 'Admin'}
                      </Tag>
                    </>
                  ) : (
                    <Text type="secondary" style={{ fontSize: '13px' }}>System Generated</Text>
                  )}
                </div>
              </div>
            </Space>
          </Card>

          <Card title="Stall Details" size="small" styles={{ body: { padding: '12px' } }}>
            <Table
              dataSource={selectedBooking.stallIds}
              pagination={false}
              rowKey="_id"
              size="small"
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

          <Card title="Financial Summary" size="small" styles={{ body: { padding: '12px' } }}>
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
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

      // Refetch invoices when booking is approved or confirmed (both create invoices)
      if (newStatus === 'approved' || newStatus === 'confirmed') {
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