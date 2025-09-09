import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Alert,
  Table,
  Tag,
  Layout,
  Result,
  Spin,
  Divider,
  message
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  PhoneOutlined,
  ShopOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Components
import GlobalHeader from '../../../components/layout/GlobalHeader';
import GlobalFooter from '../../../components/layout/GlobalFooter';

// Services
import publicServiceChargeService from '../../../services/publicServiceCharge';
import { apiUrl } from '../../../config';

// Styles
import '../ServiceCharges.css';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

interface ServiceChargeResult {
  id: string;
  receiptNumber: string;
  vendorName: string;
  companyName: string;
  exhibitorCompanyName?: string;
  stallNumber: string;
  stallArea?: number;
  serviceType: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: string;
  paidAt?: string;
  createdAt: string;
  receiptGenerated: boolean;
  exhibition: {
    name: string;
    venue: string;
  };
}

interface ExhibitionInfo {
  name: string;
  venue: string;
  config: {
    title: string;
    description: string;
  };
}

const PaymentLookup: React.FC = () => {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  // State
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ServiceChargeResult[]>([]);
  const [exhibition, setExhibition] = useState<ExhibitionInfo | null>(null);
  const [exhibitionLoading, setExhibitionLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);

  // Load exhibition info
  useEffect(() => {
    if (exhibitionId) {
      loadExhibitionInfo();
    }
  }, [exhibitionId]);

  const loadExhibitionInfo = async () => {
    if (!exhibitionId) return;
    
    try {
      setExhibitionLoading(true);
      const response = await publicServiceChargeService.getServiceChargeConfig(exhibitionId);
      
      if (response.data.success) {
        setExhibition({
          name: response.data.data.name,
          venue: response.data.data.venue,
          config: response.data.data.config
        });
      } else {
        message.error('Exhibition not found or service charges not enabled');
      }
    } catch (error) {
      console.error('Error loading exhibition:', error);
      message.error('Error loading exhibition information');
    } finally {
      setExhibitionLoading(false);
    }
  };

  const handleSearch = async (values: { phone?: string; stallNumber?: string }) => {
    if (!exhibitionId) return;
    
    const { phone, stallNumber } = values;
    
    if (!phone && !stallNumber) {
      message.warning('Please enter either phone number or stall number');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      
      const searchData: { phone?: string; stallNumber?: string } = {};
      if (phone) searchData.phone = phone.trim();
      if (stallNumber) searchData.stallNumber = stallNumber.trim();
      
      console.log('🔍 [FRONTEND] Searching with:', searchData);
      
      const response = await publicServiceChargeService.lookupServiceCharges(exhibitionId, searchData);
      
      if (response.data.success) {
        setSearchResults(response.data.data);
        message.success(response.data.message);
      } else {
        setSearchResults([]);
        message.info(response.data.message);
      }
    } catch (error: any) {
      console.error('Error searching payments:', error);
      setSearchResults([]);
      
      if (error.response?.status === 404) {
        message.info('No service charges found for the provided information');
      } else {
        message.error('Error searching payments. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (serviceChargeId: string, receiptNumber: string) => {
    try {
      message.loading({ content: 'Preparing receipt for download...', key: 'receipt-download' });
      
      // ✅ FIX: Use correct backend URL instead of relative URL
      const response = await fetch(`${apiUrl}/public/service-charge/receipt/${serviceChargeId}`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = `receipt-${receiptNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        message.success({ content: 'Receipt downloaded successfully', key: 'receipt-download' });
      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to download receipt';
        
        if (response.status === 404) {
          errorMessage = 'Receipt not found or not yet generated';
        } else if (response.status === 403) {
          errorMessage = 'Access denied - insufficient permissions';
        }
        
        message.error({ content: errorMessage, key: 'receipt-download' });
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      message.error({ content: 'Network error - please try again', key: 'receipt-download' });
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'failed':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <InfoCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'orange';
      case 'failed':
        return 'red';
      case 'refunded':
        return 'purple';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Payment Details',
      key: 'details',
      width: '60%',
      render: (record: ServiceChargeResult) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <Text strong style={{ fontFamily: 'monospace', fontSize: '13px', color: '#1890ff' }}>
              {record.receiptNumber}
            </Text>
          </div>
          <div style={{ marginBottom: '2px' }}>
            <Text strong style={{ fontSize: '14px' }}>{record.vendorName}</Text>
          </div>
          <div style={{ marginBottom: '2px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.companyName}</Text>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#666' }}>
            <span>Stall: <Text strong>{record.stallNumber}</Text></span>
            <span>₹{record.amount.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ marginTop: '4px', fontSize: '11px', color: '#999' }}>
            {dayjs(record.createdAt).format('DD/MM/YY HH:mm')}
            {record.paidAt && (
              <span style={{ color: '#52c41a', marginLeft: '8px' }}>
                • Paid: {dayjs(record.paidAt).format('DD/MM/YY HH:mm')}
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      key: 'status',
      width: '20%',
      align: 'center' as const,
      render: (record: ServiceChargeResult) => (
        <div style={{ textAlign: 'center' }}>
          <Tag 
            icon={getPaymentStatusIcon(record.paymentStatus)} 
            color={getPaymentStatusColor(record.paymentStatus)}
            style={{ fontSize: '11px', marginBottom: '8px' }}
          >
            {record.paymentStatus.toUpperCase()}
          </Tag>
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: '20%',
      align: 'center' as const,
      render: (record: ServiceChargeResult) => {
        if (record.paymentStatus === 'paid' && record.receiptGenerated) {
          return (
            <Button
              type="primary"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadReceipt(record.id, record.receiptNumber)}
              style={{ fontSize: '12px' }}
            >
              Receipt
            </Button>
          );
        } else if (record.paymentStatus === 'failed') {
          return <Text type="danger" style={{ fontSize: '11px' }}>Failed</Text>;
        } else {
          return <Text type="secondary" style={{ fontSize: '11px' }}>Pending</Text>;
        }
      }
    }
  ];

  // Loading state
  if (exhibitionLoading) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '400px' 
          }}>
            <Spin size="large" />
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  // Exhibition not found
  if (!exhibition) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ padding: '50px' }}>
            <Result
              status="404"
              title="Exhibition Not Found"
              subTitle="The exhibition you're looking for doesn't exist or service charges are not enabled."
              extra={
                <Button type="primary" icon={<HomeOutlined />} onClick={() => navigate('/')}>
                  Back Home
                </Button>
              }
            />
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  return (
    <Layout>
      <GlobalHeader />
      <Content style={{ paddingTop: '64px', background: '#f5f5f5' }}>
        <div className="public-service-charge-form">
          <div className="form-container">
            {/* Header Card */}
            <Card className="header-card">
              <div style={{ textAlign: 'center' }}>
                <Title level={2}>Check Payment Status</Title>
                <Paragraph>
                  Enter your mobile number or stall number to check your service charge payment status and download receipt
                </Paragraph>
                <Space>
                  <InfoCircleOutlined />
                  <Text strong>{exhibition.name}</Text>
                  <Divider type="vertical" />
                  <Text>{exhibition.venue}</Text>
                </Space>
              </div>
            </Card>

            {/* Search Form */}
            <Card title="Search Your Payment" className="steps-card">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSearch}
                style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}
              >
                <Alert
                  message="Search Options"
                  description="You can search using either your mobile number OR stall number. For stall numbers, you can enter partial matches (e.g., 'A2' will find 'A2 (5x5)', 'A2-B', etc.). You don't need to provide both."
                  type="info"
                  showIcon
                  style={{ marginBottom: '24px' }}
                />

                <Form.Item
                  name="phone"
                  label="Mobile Number"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve(); // Optional field
                        if (!/^\d+$/.test(value)) {
                          return Promise.reject(new Error('Mobile number must contain only numbers'));
                        }
                        if (value.length !== 10) {
                          return Promise.reject(new Error('Mobile number must be exactly 10 digits'));
                        }
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter 10-digit mobile number"
                    size="large"
                    maxLength={10}
                    onKeyPress={(e) => {
                      // Allow only numbers
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      // Remove any non-numeric characters
                      const numericValue = e.target.value.replace(/\D/g, '');
                      e.target.value = numericValue;
                    }}
                  />
                </Form.Item>

                <div style={{ textAlign: 'center', margin: '16px 0' }}>
                  <Text type="secondary">OR</Text>
                </div>

                <Form.Item
                  name="stallNumber"
                  label="Stall Number"
                >
                  <Input
                    prefix={<ShopOutlined />}
                    placeholder="Enter stall number (e.g., A2, B15, etc.)"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                    loading={loading}
                    size="large"
                    block
                    style={{ borderRadius: '8px', height: '48px' }}
                  >
                    Search Payments
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {/* Search Results */}
            {hasSearched && (
              <Card title="Search Results">
                {searchResults.length > 0 ? (
                  <>
                    <Alert
                      message={`Found ${searchResults.length} service charge(s)`}
                      type="success"
                      showIcon
                      style={{ marginBottom: '16px' }}
                    />
                    <Table
                      columns={columns}
                      dataSource={searchResults}
                      rowKey="id"
                      pagination={false}
                      scroll={{ x: 400 }}
                      size="small"
                      className="mobile-payment-table"
                    />
                  </>
                ) : (
                  <Result
                    icon={<FileTextOutlined />}
                    title="No Payments Found"
                    subTitle="No service charges found for the provided information. Please check your mobile number or stall number and try again."
                    extra={
                      <Button type="primary" onClick={() => form.resetFields()}>
                        Search Again
                      </Button>
                    }
                  />
                )}
              </Card>
            )}

            {/* Help Section */}
            <Card title="Need Help?" style={{ marginTop: '24px' }}>
              <Paragraph>
                <Text strong>Can't find your payment?</Text>
              </Paragraph>
              <ul>
                <li>Make sure you're using the same mobile number used during payment</li>
                <li>For stall numbers, you can use partial matches (e.g., 'A2' will find 'A2 (5x5)', 'A2-Block1', etc.)</li>
                <li>Search is case-insensitive, so 'a2' and 'A2' will both work</li>
                <li>Check if you're searching in the correct exhibition</li>
                <li>If you just made a payment, please wait a few minutes for it to be processed</li>
                <li>For technical support, please contact the exhibition organizers</li>
              </ul>
            </Card>
          </div>
        </div>
      </Content>
      <GlobalFooter />
    </Layout>
  );
};

export default PaymentLookup; 