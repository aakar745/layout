import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Alert,
  Typography,
  Statistic,
  Row,
  Col,
  List,
  Tag,
  Divider,
  Spin,
  Progress,
  Timeline,
  Select,
  DatePicker,
  Form,
  message,
  Tabs,
  Badge
} from 'antd';
import {
  SearchOutlined,
  WarningOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  BugOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import api from '../../../services/api';
import { formatCurrency } from '../../../utils/format';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

interface DetectionReport {
  summary: {
    totalChecked: number;
    missingCount: number;
    successfulInPhonePe: number;
    potentialRevenueLoss: number;
    checkDuration: string;
  };
  missingTransactions: Array<{
    receiptNumber: string;
    phonePeData: any;
    potentialAmount: number;
    status: string;
    missingReason: string;
  }>;
  recommendations: string[];
}

interface MissingTransactionDetectorProps {
  selectedExhibition?: any;
  onTransactionFound?: (receiptNumber: string) => void;
}

const MissingTransactionDetector: React.FC<MissingTransactionDetectorProps> = ({
  selectedExhibition,
  onTransactionFound
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [detectionType, setDetectionType] = useState<'gaps' | 'orphaned' | 'comprehensive' | 'daily'>('gaps');
  const [report, setReport] = useState<DetectionReport | null>(null);
  const [progress, setProgress] = useState(0);

  const runDetection = async (values: any) => {
    setLoading(true);
    setProgress(0);
    setReport(null);

    try {
      let endpoint = '';
      let requestData: any = {};

      switch (detectionType) {
        case 'gaps':
          endpoint = '/detector/receipt-gaps';
          requestData = {
            exhibitionId: selectedExhibition?._id,
            startDate: values.dateRange?.[0]?.toISOString(),
            endDate: values.dateRange?.[1]?.toISOString(),
            maxGapsToCheck: values.maxGapsToCheck || 50,
            autoCheckPhonePe: true
          };
          break;
        
        case 'orphaned':
          endpoint = '/detector/orphaned-receipts';
          requestData = {
            maxReceiptsToCheck: values.maxReceiptsToCheck || 50
          };
          break;
        
        case 'comprehensive':
          endpoint = '/detector/comprehensive';
          requestData = {
            exhibitionId: selectedExhibition?._id,
            days: values.days || 7,
            maxChecks: values.maxChecks || 30
          };
          break;
        
        case 'daily':
          endpoint = '/detector/daily';
          break;
      }

      // Simulate progress for user feedback
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 2000);

      const response = await api.post(endpoint, requestData);
      setProgress(100);
      clearInterval(progressInterval);
      
      setReport(response.data.data);
      
      if (response.data.data.summary?.missingCount > 0) {
        message.warning(`Found ${response.data.data.summary.missingCount} missing transactions!`);
      } else {
        message.success('No missing transactions detected');
      }

    } catch (error: any) {
      message.error(error.response?.data?.message || 'Detection failed');
      console.error('Detection error:', error);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'FAILED':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'error';
      default:
        return 'processing';
    }
  };

  const renderDetectionForm = () => (
    <Card title="Detection Configuration" style={{ marginBottom: 16 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={runDetection}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Detection Method">
              <Select
                value={detectionType}
                onChange={setDetectionType}
                style={{ width: '100%' }}
              >
                <Option value="gaps">
                  <Space>
                    <BugOutlined />
                    Receipt Gap Detection
                  </Space>
                </Option>
                <Option value="orphaned">
                  <Space>
                    <SearchOutlined />
                    Orphaned Receipt Scan
                  </Space>
                </Option>
                <Option value="comprehensive">
                  <Space>
                    <DashboardOutlined />
                    Comprehensive Analysis
                  </Space>
                </Option>
                <Option value="daily">
                  <Space>
                    <ClockCircleOutlined />
                    Daily Quick Check
                  </Space>
                </Option>
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            {detectionType === 'gaps' && (
              <Form.Item
                name="dateRange"
                label="Date Range"
                initialValue={[dayjs().subtract(7, 'days'), dayjs()]}
              >
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            )}
            
            {detectionType === 'comprehensive' && (
              <Form.Item
                name="days"
                label="Days to Check"
                initialValue={7}
              >
                <Select>
                  <Option value={1}>Last 1 day</Option>
                  <Option value={3}>Last 3 days</Option>
                  <Option value={7}>Last 7 days</Option>
                  <Option value={15}>Last 15 days</Option>
                  <Option value={30}>Last 30 days</Option>
                </Select>
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            {detectionType === 'gaps' && (
              <Form.Item
                name="maxGapsToCheck"
                label="Max Gaps to Check"
                initialValue={20}
              >
                <Select>
                  <Option value={10}>10 gaps (Fast)</Option>
                  <Option value={20}>20 gaps (Recommended)</Option>
                  <Option value={50}>50 gaps (Thorough)</Option>
                </Select>
              </Form.Item>
            )}
            
            {detectionType === 'orphaned' && (
              <Form.Item
                name="maxReceiptsToCheck"
                label="Future Receipts to Check"
                initialValue={20}
              >
                <Select>
                  <Option value={10}>Next 10 receipts</Option>
                  <Option value={20}>Next 20 receipts</Option>
                  <Option value={50}>Next 50 receipts</Option>
                </Select>
              </Form.Item>
            )}
          </Col>
          
          <Col span={12} style={{ display: 'flex', alignItems: 'end' }}>
            <Form.Item style={{ marginBottom: 0, width: '100%' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SearchOutlined />}
                block
                size="large"
              >
                {loading ? 'Scanning...' : 'Start Detection'}
              </Button>
            </Form.Item>
          </Col>
        </Row>

        {loading && (
          <div style={{ marginTop: 16 }}>
            <Progress 
              percent={Math.round(progress)} 
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
              Checking PhonePe API... This may take several minutes due to rate limits.
            </Text>
          </div>
        )}
      </Form>
    </Card>
  );

  const renderReport = () => {
    if (!report) return null;

    return (
      <div>
        {/* Summary Statistics */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Checked"
                value={report.summary.totalChecked}
                prefix={<SearchOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Missing Found"
                value={report.summary.missingCount}
                prefix={<BugOutlined />}
                valueStyle={{ color: report.summary.missingCount > 0 ? '#cf1322' : '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Successful in PhonePe"
                value={report.summary.successfulInPhonePe}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Potential Revenue Loss"
                value={report.summary.potentialRevenueLoss}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(value as number)}
                valueStyle={{ 
                  color: report.summary.potentialRevenueLoss > 0 ? '#cf1322' : '#3f8600',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              />
            </Card>
          </Col>
        </Row>

        {/* Alert for Issues */}
        {report.summary.missingCount > 0 && (
          <Alert
            message={`⚠️ ${report.summary.missingCount} Missing Transactions Detected`}
            description={`Found ${report.summary.successfulInPhonePe} successful payments in PhonePe that are missing from your database. Potential revenue loss: ${formatCurrency(report.summary.potentialRevenueLoss)}`}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            action={
              <Button size="small" danger>
                Generate Report
              </Button>
            }
          />
        )}

        {report.summary.missingCount === 0 && (
          <Alert
            message="✅ No Missing Transactions Found"
            description="All checked transactions are properly recorded in your database."
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Missing Transactions List */}
        {report.missingTransactions.length > 0 && (
          <Card title="Missing Transactions" style={{ marginBottom: 16 }}>
            <List
              dataSource={report.missingTransactions}
              renderItem={(transaction) => (
                <List.Item
                  actions={[
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => onTransactionFound?.(transaction.receiptNumber)}
                    >
                      Recover
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={getStatusIcon(transaction.status)}
                    title={
                      <Space>
                        <Text strong>{transaction.receiptNumber}</Text>
                        <Tag color={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Tag>
                        <Tag color="blue">
                          {formatCurrency(transaction.potentialAmount)}
                        </Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Text type="secondary">{transaction.missingReason}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Transaction ID: {transaction.phonePeData?.transactionId}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <Card title="Recommendations" style={{ marginBottom: 16 }}>
            <Timeline>
              {report.recommendations.map((recommendation, index) => (
                <Timeline.Item
                  key={index}
                  dot={
                    index === 0 ? (
                      <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                    ) : (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    )
                  }
                >
                  {recommendation}
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={4}>
          <Space>
            <SearchOutlined />
            Missing Transaction Detector
          </Space>
        </Title>
        <Paragraph type="secondary">
          Automatically scan for transactions that exist in PhonePe but are missing from your database.
          Perfect for finding transactions like SC2025000189 that got lost due to system issues.
        </Paragraph>
      </div>

      {renderDetectionForm()}
      {renderReport()}
    </div>
  );
};

export default MissingTransactionDetector;
