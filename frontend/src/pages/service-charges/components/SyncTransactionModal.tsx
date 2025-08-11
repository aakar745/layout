import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Alert,
  Typography,
  Space,
  Card,
  Tag,
  Divider,
  Result
} from 'antd';
import {
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons';
import api from '../../../services/api';

const { Text } = Typography;

interface SyncTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedExhibition?: any;
}

interface SyncResult {
  success: boolean;
  message: string;
  data?: any;
  phonePeData?: any;
}

const SyncTransactionModal: React.FC<SyncTransactionModalProps> = ({
  visible,
  onClose,
  onSuccess,
  selectedExhibition
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  const handleClose = () => {
    console.log('🔍 [SYNC MODAL] Modal closing...');
    form.resetFields();
    setResult(null);
    onClose();
  };

  const handleSingleSync = async (values: any) => {
    console.log('🔍 [SYNC MODAL] Starting sync with values:', values);
    setLoading(true);
    
    try {
      const requestData = {
        receiptNumber: values.receiptNumber,
        phonePeTransactionId: values.phonePeTransactionId
      };

      console.log('🔍 [SYNC MODAL] Making API call...');
      const response = await api.post('/sync/phonepe/transaction', requestData);
      console.log('🔍 [SYNC MODAL] API response received:', response.data);
      
      setResult(response.data);
      console.log('🔍 [SYNC MODAL] Result set, modal should show result');
      
      // Don't call onSuccess() for status checks - we just want to display the result
      // The modal should only close when user manually closes it
    } catch (error: any) {
      console.log('🔍 [SYNC MODAL] API call failed:', error);
      const errorData = error.response?.data;
      
      setResult({
        success: false,
        message: errorData?.message || 'Failed to check transaction status',
        data: errorData,
        phonePeData: errorData?.phonePeData // Include PhonePe data for status display
      });
      console.log('🔍 [SYNC MODAL] Error result set, modal should show error');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    handleSingleSync(values);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'FAILED':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'PENDING':
      case 'INITIATED':
      case 'PROCESSING':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'PENDING':
      case 'INITIATED':
      case 'PROCESSING':
        return 'processing';
      default:
        return 'warning';
    }
  };

  return (
    <Modal
      title={
        <Space>
          <SyncOutlined />
          <span>Check PhonePe Transaction Status</span>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {!result && (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Alert
              message="Check Transaction Status"
              description="Enter either the receipt number (e.g., SC2025000189) or PhonePe transaction ID to check the payment status."
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Form.Item
              name="receiptNumber"
              label="Receipt Number"
              rules={[
                {
                  validator: (_, value) => {
                    const phonePeId = form.getFieldValue('phonePeTransactionId');
                    if (!value && !phonePeId) {
                      return Promise.reject('Please provide either receipt number or PhonePe transaction ID');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input
                placeholder="e.g., SC2025000189"
                prefix={<FileTextOutlined />}
              />
            </Form.Item>

            <Divider>OR</Divider>

            <Form.Item
              name="phonePeTransactionId"
              label="PhonePe Transaction ID"
            >
              <Input
                placeholder="e.g., OM2507311245055380005375"
                prefix={<DollarOutlined />}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SyncOutlined />}
                block
              >
                Check Status
              </Button>
            </Form.Item>
          </Form>
        )}

        {result && (
          <div>
            {result.success ? (
              <Result
                status="success"
                title="Transaction Status Retrieved"
                subTitle={result.message}
                extra={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {result.data && (
                      <Card>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text><strong>PhonePe Gateway Status:</strong> <Tag color={getStatusColor(result.data.currentStatus)}>{result.data.currentStatus}</Tag></Text>
                          {result.data.amount && <Text><strong>Amount:</strong> ₹{(result.data.amount / 100).toLocaleString()}</Text>}
                          {result.data.phonePeTransactionId && <Text><strong>PhonePe Transaction ID:</strong> {result.data.phonePeTransactionId}</Text>}
                          {result.data.merchantTransactionId && <Text><strong>Merchant Transaction ID:</strong> {result.data.merchantTransactionId}</Text>}
                          {result.data.paymentMethod && <Text><strong>Payment Method:</strong> {result.data.paymentMethod}</Text>}
                          {result.data.receiptNumber && <Text><strong>Receipt Number:</strong> {result.data.receiptNumber}</Text>}
                          {result.data.localStatus && <Text type="secondary"><strong>Local DB Status:</strong> {result.data.localStatus}</Text>}
                        </Space>
                      </Card>
                    )}
                    <Button onClick={() => setResult(null)}>Check Another Transaction</Button>
                  </Space>
                }
              />
            ) : (
              <Result
                status="error"
                title="Failed to Check Status"
                subTitle={result.message}
                extra={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {(result.data || result.phonePeData) && (
                      <Card>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text><strong>PhonePe Gateway Status:</strong> <Tag color={getStatusColor(result.data?.currentStatus || result.phonePeData?.state)}>
                            {result.data?.currentStatus || result.phonePeData?.state}
                          </Tag></Text>
                          <Text><strong>Amount:</strong> ₹{((result.data?.amount || result.phonePeData?.amount) / 100).toLocaleString()}</Text>
                          <Text><strong>Transaction ID:</strong> {result.data?.phonePeTransactionId || result.phonePeData?.transactionId}</Text>
                          <Text><strong>Merchant Transaction ID:</strong> {result.data?.merchantTransactionId || result.phonePeData?.merchantTransactionId}</Text>
                          <Text><strong>Payment Method:</strong> {result.data?.paymentMethod || result.phonePeData?.paymentInstrument?.type || 'N/A'}</Text>
                        </Space>
                      </Card>
                    )}
                    <Button onClick={() => setResult(null)}>Try Again</Button>
                  </Space>
                }
              />
            )}
          </div>
        )}
      </Space>
    </Modal>
  );
};

export default SyncTransactionModal;