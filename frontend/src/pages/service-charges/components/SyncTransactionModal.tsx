import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Alert,
  Typography,
  Space,
  Card,
  Tag,
  Divider,
  Result,
  Spin,
  Steps,
  List
} from 'antd';
import {
  SyncOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  FileTextOutlined,
  DollarOutlined
} from '@ant-design/icons';
import api from '../../../services/api';
import { formatCurrency } from '../../../utils/format';
import MissingTransactionDetector from './MissingTransactionDetector';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;

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
  changes?: {
    wasCreated: boolean;
    wasUpdated: boolean;
    previousStatus: string;
    newStatus: string;
  };
  phonePeData?: any;
  suggestion?: string;
}

const SyncTransactionModal: React.FC<SyncTransactionModalProps> = ({
  visible,
  onClose,
  onSuccess,
  selectedExhibition
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [syncMode, setSyncMode] = useState<'single' | 'detect' | 'bulk' | 'autoDetect'>('single');
  const [result, setResult] = useState<SyncResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [detectionResults, setDetectionResults] = useState<any>(null);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [phonePeData, setPhonePeData] = useState<any>(null);

  const handleClose = () => {
    form.resetFields();
    setResult(null);
    setCurrentStep(0);
    setDetectionResults(null);
    setSyncMode('single');
    onClose();
  };

  const handleSingleSync = async (values: any) => {
    setLoading(true);
    setCurrentStep(1);
    
    try {
      const requestData: any = {
        receiptNumber: values.receiptNumber,
        phonePeTransactionId: values.phonePeTransactionId
      };
      
      // Add vendor details if provided
      if (values.vendorName) {
        requestData.vendorDetails = {
          vendorName: values.vendorName,
          companyName: values.companyName,
          vendorPhone: values.vendorPhone,
          stallNumber: values.stallNumber,
          exhibitionId: values.exhibitionId || selectedExhibition?._id,
          serviceType: values.serviceType,
          stallArea: values.stallArea,
          exhibitorCompanyName: values.exhibitorCompanyName
        };
      }

      const response = await api.post('/sync/phonepe/transaction', requestData);

      setResult(response.data);
      setCurrentStep(2);
      
      if (response.data.success) {
        onSuccess();
      }
    } catch (error: any) {
      console.log('🔍 [SYNC DEBUG] Full error object:', error);
      console.log('🔍 [SYNC DEBUG] Error response object:', error.response);
      
      const errorData = error.response?.data;
      
      // Check if this is a missing record that can be created
      if (error.response?.status === 404 && errorData?.phonePeData && errorData?.suggestion) {
        console.log('✅ [SYNC DEBUG] Conditions met - showing vendor form');
        console.log('📋 [SYNC DEBUG] PhonePe Data:', errorData.phonePeData);
        setPhonePeData(errorData.phonePeData);
        setShowVendorForm(true);
        setCurrentStep(0); // Go back to form to add vendor details
        setLoading(false);
        return;
      } else {
        console.log('❌ [SYNC DEBUG] Conditions not met:', {
          status: error.response?.status,
          hasPhonePeData: !!errorData?.phonePeData,
          hasSuggestion: !!errorData?.suggestion
        });
      }
      
      setResult({
        success: false,
        message: errorData?.message || 'Failed to sync transaction',
        data: errorData,
        suggestion: errorData?.suggestion
      });
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectMissing = async (values: any) => {
    setLoading(true);
    setCurrentStep(1);
    
    try {
      const response = await api.post('/sync/phonepe/detect-missing', {
        exhibitionId: selectedExhibition?._id,
        startDate: values.dateRange?.[0]?.toISOString(),
        endDate: values.dateRange?.[1]?.toISOString(),
        maxToCheck: values.maxToCheck || 10
      });

      setDetectionResults(response.data.data);
      setCurrentStep(2);
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Failed to detect missing transactions'
      });
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSync = async (values: any) => {
    setLoading(true);
    setCurrentStep(1);
    
    try {
      const receiptNumbers = values.receiptNumbers
        .split('\n')
        .map((r: string) => r.trim())
        .filter((r: string) => r.length > 0);

      const response = await api.post('/sync/phonepe/bulk-sync', {
        receiptNumbers
      });

      setResult(response.data);
      setCurrentStep(2);
      
      if (response.data.success) {
        onSuccess();
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.message || 'Failed to bulk sync transactions'
      });
      setCurrentStep(2);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    switch (syncMode) {
      case 'single':
        handleSingleSync(values);
        break;
      case 'detect':
        handleDetectMissing(values);
        break;
      case 'bulk':
        handleBulkSync(values);
        break;
    }
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

  const renderSingleSyncForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      {showVendorForm && phonePeData && (
        <Alert
          message="Transaction Found in PhonePe - Missing Record"
          description={
            <div>
              <p>Found successful payment in PhonePe but no record in database:</p>
              <p><strong>Amount:</strong> ₹{(phonePeData.amount / 100).toLocaleString()}</p>
              <p><strong>Transaction ID:</strong> {phonePeData.transactionId}</p>
              <p><strong>Status:</strong> {phonePeData.state}</p>
              <p>Please provide vendor details to create the missing record:</p>
            </div>
          }
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      {!showVendorForm && (
        <Alert
          message="Sync Single Transaction"
          description="Enter either the receipt number (e.g., SC2025000189) or PhonePe transaction ID to sync a specific transaction."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
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
          disabled={showVendorForm}
        />
      </Form.Item>

      {!showVendorForm && (
        <>
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
        </>
      )}

      {showVendorForm && (
        <>
          <Divider>Vendor Details</Divider>
          
          <Form.Item
            name="vendorName"
            label="Vendor Name"
            rules={[{ required: true, message: 'Vendor name is required' }]}
          >
            <Input placeholder="Enter vendor name" />
          </Form.Item>

          <Form.Item
            name="companyName"
            label="Company Name"
            rules={[{ required: true, message: 'Company name is required' }]}
            initialValue="ONEX INDUSTRIES (P) LTD"
          >
            <Input placeholder="Enter company name" />
          </Form.Item>

          <Form.Item
            name="vendorPhone"
            label="Vendor Phone"
          >
            <Input placeholder="Enter phone number (optional)" />
          </Form.Item>

          <Form.Item
            name="stallNumber"
            label="Stall Number"
            rules={[{ required: true, message: 'Stall number is required' }]}
          >
            <Select placeholder="Select stall number">
              <Option value="111A (16x8)">111A (16x8)</Option>
              <Option value="111 (17x13)">111 (17x13)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="serviceType"
            label="Service Type"
            initialValue="Service Charge"
          >
            <Input placeholder="Service type" />
          </Form.Item>

          <Form.Item
            name="exhibitorCompanyName"
            label="Exhibitor Company Name"
            initialValue="ONEX INDUSTRIES (P) LTD"
          >
            <Input placeholder="Exhibitor company name" />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Space style={{ width: '100%' }}>
          {showVendorForm && (
            <Button
              onClick={() => {
                setShowVendorForm(false);
                setPhonePeData(null);
                form.resetFields();
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SyncOutlined />}
            block={!showVendorForm}
            style={showVendorForm ? { flex: 1 } : {}}
          >
            {showVendorForm ? 'Create & Sync Transaction' : 'Sync Transaction'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );

  const renderDetectMissingForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Alert
        message="Detect Missing Transactions"
        description="This will scan for gaps in receipt numbers and check PhonePe for missing transactions. Due to API limits, only 10 transactions are checked at once."
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form.Item
        name="maxToCheck"
        label="Maximum Transactions to Check"
        initialValue={10}
      >
        <Select>
          <Option value={5}>5 transactions</Option>
          <Option value={10}>10 transactions</Option>
          <Option value={15}>15 transactions (slower)</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<SearchOutlined />}
          block
        >
          Detect Missing Transactions
        </Button>
      </Form.Item>
    </Form>
  );

  const renderBulkSyncForm = () => (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
    >
      <Alert
        message="Bulk Sync Transactions"
        description="Enter multiple receipt numbers (one per line) to sync them all. Maximum 10 transactions due to API rate limits."
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Form.Item
        name="receiptNumbers"
        label="Receipt Numbers (one per line)"
        rules={[
          { required: true, message: 'Please enter at least one receipt number' },
          {
            validator: (_, value) => {
              if (value) {
                const lines = value.split('\n').filter((l: string) => l.trim().length > 0);
                if (lines.length > 10) {
                  return Promise.reject('Maximum 10 receipt numbers allowed');
                }
              }
              return Promise.resolve();
            }
          }
        ]}
      >
        <Input.TextArea
          rows={8}
          placeholder="SC2025000189&#10;SC2025000190&#10;SC2025000191"
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
          Bulk Sync Transactions
        </Button>
      </Form.Item>
    </Form>
  );

  const renderResult = () => {
    if (!result && !detectionResults) return null;

    if (detectionResults) {
      return (
        <div>
          <Title level={4}>Detection Results</Title>
          <Card>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>
                <strong>Found:</strong> {detectionResults.foundCount} missing transactions in PhonePe
              </Text>
              <Text>
                <strong>Checked:</strong> {detectionResults.checkedCount} receipt numbers
              </Text>
              <Text>
                <strong>Remaining:</strong> {detectionResults.remainingToCheck} more to check
              </Text>
            </Space>
          </Card>

          {detectionResults.missing && detectionResults.missing.length > 0 && (
            <List
              style={{ marginTop: 16 }}
              header={<Title level={5}>Missing Transactions Found</Title>}
              bordered
              dataSource={detectionResults.missing.filter((item: any) => item.found)}
              renderItem={(item: any) => (
                <List.Item>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Tag color="orange">{item.receiptNumber}</Tag>
                      <Tag color={getStatusColor(item.status)} icon={getStatusIcon(item.status)}>
                        {item.status}
                      </Tag>
                      {item.amount && (
                        <Tag color="blue">
                          {formatCurrency(item.amount / 100)}
                        </Tag>
                      )}
                    </Space>
                    <Text type="secondary">
                      This transaction exists in PhonePe but is missing from your system
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          )}
        </div>
      );
    }

    return (
      <Result
        status={result?.success ? 'success' : 'error'}
        title={result?.success ? 'Sync Successful!' : 'Sync Failed'}
        subTitle={result?.message}
        extra={
          result?.success && result?.data && (
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Text strong>Receipt Number:</Text>
                  <Tag color="blue">{result.data.receiptNumber}</Tag>
                </Space>
                <Space>
                  <Text strong>Payment Status:</Text>
                  <Tag color={getStatusColor(result.data.paymentStatus)}>
                    {result.data.paymentStatus}
                  </Tag>
                </Space>
                <Space>
                  <Text strong>Amount:</Text>
                  <Text>{formatCurrency(result.data.amount)}</Text>
                </Space>
                <Space>
                  <Text strong>Vendor:</Text>
                  <Text>{result.data.vendorName}</Text>
                </Space>
                <Space>
                  <Text strong>Stall:</Text>
                  <Text>{result.data.stallNumber}</Text>
                </Space>
                {result.changes && (
                  <div>
                    <Divider />
                    <Text strong>Changes Made:</Text>
                    <br />
                    <Text>
                      Status changed from <Tag>{result.changes.previousStatus}</Tag> to{' '}
                      <Tag color={getStatusColor(result.changes.newStatus)}>
                        {result.changes.newStatus}
                      </Tag>
                    </Text>
                  </div>
                )}
              </Space>
            </Card>
          )
        }
      />
    );
  };

  const steps = [
    {
      title: 'Configure',
      description: 'Set sync parameters'
    },
    {
      title: 'Processing',
      description: 'Syncing with PhonePe'
    },
    {
      title: 'Results',
      description: 'View sync results'
    }
  ];

  return (
    <Modal
      title={
        <Space>
          <SyncOutlined />
          <span>Sync PhonePe Transactions - 2025 Enhanced</span>
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Steps current={currentStep} items={steps} />

        {currentStep === 0 && (
          <>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={5}>Select Sync Mode</Title>
                <Select
                  value={syncMode}
                  onChange={setSyncMode}
                  style={{ width: '100%' }}
                >
                  <Option value="single">
                    <Space>
                      <SyncOutlined />
                      Sync Single Transaction
                    </Space>
                  </Option>
                  <Option value="detect">
                    <Space>
                      <SearchOutlined />
                      Detect Missing Transactions
                    </Space>
                  </Option>
                  <Option value="bulk">
                    <Space>
                      <FileTextOutlined />
                      Bulk Sync Transactions
                    </Space>
                  </Option>
                  <Option value="autoDetect">
                    <Space>
                      <SearchOutlined />
                      Auto-Detect Missing
                    </Space>
                  </Option>
                </Select>
              </Space>
            </Card>

            {syncMode === 'single' && renderSingleSyncForm()}
            {syncMode === 'detect' && renderDetectMissingForm()}
            {syncMode === 'autoDetect' && (
              <MissingTransactionDetector
                selectedExhibition={selectedExhibition}
                onTransactionFound={(receiptNumber) => {
                  setSyncMode('single');
                  form.setFieldsValue({ receiptNumber });
                  setShowVendorForm(false);
                }}
              />
            )}
            {syncMode === 'bulk' && renderBulkSyncForm()}
          </>
        )}

        {currentStep === 1 && (
          <Card style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <br />
            <br />
            <Text>
              {syncMode === 'detect' 
                ? 'Scanning for missing transactions...' 
                : 'Syncing with PhonePe API...'}
            </Text>
            <br />
            <Text type="secondary">
              This may take up to 90 seconds due to 2025 API rate limits
            </Text>
          </Card>
        )}

        {currentStep === 2 && renderResult()}

        {currentStep === 2 && (
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleClose}>Close</Button>
            <Button
              type="primary"
              onClick={() => {
                setCurrentStep(0);
                setResult(null);
                setDetectionResults(null);
                form.resetFields();
              }}
            >
              Sync Another
            </Button>
          </Space>
        )}
      </Space>
    </Modal>
  );
};

export default SyncTransactionModal;
