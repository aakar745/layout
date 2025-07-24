import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Select,
  Input,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  message,
  Tooltip,
  DatePicker,
  Tabs,
  Alert,
  Popconfirm,
  Dropdown,
  MenuProps,
  Progress,
  Badge,
  Divider,
  Empty,
  Steps,
  Form,
  InputNumber,
  Checkbox,
  Result
} from 'antd';
import {
  MailOutlined,
  SendOutlined,
  ReloadOutlined,
  EyeOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DoubleRightOutlined,
  FilterOutlined,
  ClearOutlined,
  ThunderboltOutlined,
  FileTextOutlined,
  BulbOutlined,
  DashboardOutlined,
  InfoCircleOutlined,
  MoreOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import exhibitionLetterService, {
  ExhibitionLetter,
  LetterStatistics,
  UpcomingSchedule,
  ResendBothResult
} from '../../services/exhibitionLetter';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchExhibitions } from '../../store/slices/exhibitionSlice';
import { usePermission } from '../../hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Step } = Steps;

const LettersPage: React.FC = () => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  
  // Check if user has permission to view letters
  if (!hasPermission('view_letters')) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>}
      />
    );
  }
  
  // Initialize selectedExhibition from localStorage
  const [selectedExhibition, setSelectedExhibition] = useState<string>(() => {
    return localStorage.getItem('letters-selected-exhibition') || '';
  });
  const [letters, setLetters] = useState<ExhibitionLetter[]>([]);
  const [statistics, setStatistics] = useState<LetterStatistics | null>(null);
  const [upcomingSchedules, setUpcomingSchedules] = useState<UpcomingSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingLoading, setSendingLoading] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [sendingStatus, setSendingStatus] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Filters - Simplified
  const [quickFilter, setQuickFilter] = useState<'all' | 'failed' | 'pending' | 'sent'>('all');
  const [letterTypeFilter, setLetterTypeFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modal states
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<ExhibitionLetter | null>(null);
  const [bulkActionModalVisible, setBulkActionModalVisible] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { exhibitions } = useSelector((state: RootState) => state.exhibition);

  // Fetch exhibitions on component mount
  useEffect(() => {
    dispatch(fetchExhibitions());
  }, [dispatch]);

  // Handle exhibition selection with localStorage persistence
  const handleExhibitionChange = (exhibitionId: string) => {
    setSelectedExhibition(exhibitionId);
    if (exhibitionId) {
      localStorage.setItem('letters-selected-exhibition', exhibitionId);
    } else {
      localStorage.removeItem('letters-selected-exhibition');
    }
    // Reset pagination when changing exhibition
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  // Validate selected exhibition exists in available exhibitions
  useEffect(() => {
    if (selectedExhibition && exhibitions.length > 0) {
      const exhibitionExists = exhibitions.some(ex => ex._id === selectedExhibition);
      if (!exhibitionExists) {
        // Clear invalid selection
        setSelectedExhibition('');
        localStorage.removeItem('letters-selected-exhibition');
      }
    }
  }, [selectedExhibition, exhibitions]);

  // Fetch letters when filters change
  useEffect(() => {
    if (selectedExhibition) {
      fetchLetters();
      fetchStatistics();
    }
  }, [selectedExhibition, letterTypeFilter, quickFilter, searchQuery, pagination.current, pagination.pageSize]);

  // Fetch upcoming schedules on component mount
  useEffect(() => {
    fetchUpcomingSchedules();
  }, []);

  const fetchLetters = async () => {
    if (!selectedExhibition) return;

    setLoading(true);
    try {
      const result = await exhibitionLetterService.getLetters(selectedExhibition, {
        page: pagination.current,
        limit: pagination.pageSize,
        letterType: letterTypeFilter as 'standPossession' | 'transport' | undefined,
        status: quickFilter === 'all' ? '' : quickFilter,
        search: searchQuery
      });

      setLetters(result.letters);
      setPagination(prev => ({
        ...prev,
        total: result.pagination.total
      }));
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch letters');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    if (!selectedExhibition) return;

    try {
      const stats = await exhibitionLetterService.getStatistics(selectedExhibition);
      setStatistics(stats);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch statistics');
    }
  };

  const fetchUpcomingSchedules = async () => {
    try {
      const schedules = await exhibitionLetterService.getUpcomingSchedules();
      setUpcomingSchedules(schedules);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch upcoming schedules');
    }
  };

  // Enhanced bulk sending with progress tracking
  const handleBulkSendLetters = async (letterTypes: Array<'standPossession' | 'transport'>) => {
    if (!selectedExhibition) return;

    setSendingLoading(true);
    setSendingProgress(0);
    setBulkActionModalVisible(true);

    try {
      const results = [];
      for (let i = 0; i < letterTypes.length; i++) {
        const letterType = letterTypes[i];
        setSendingStatus(`Sending ${letterType === 'standPossession' ? 'Stand Possession' : 'Transport'} letters...`);
        setSendingProgress(((i) / letterTypes.length) * 100);
        
      const result = await exhibitionLetterService.sendLettersManually(selectedExhibition, letterType);
        results.push({ type: letterType, result: result.result });
        
        setSendingProgress(((i + 1) / letterTypes.length) * 100);
      }
      
      setSendingStatus('Complete!');
      
      // Show summary
      const totalSent = results.reduce((sum, r) => sum + r.result.sent, 0);
      const totalFailed = results.reduce((sum, r) => sum + r.result.failed, 0);
      
      if (totalSent > 0) {
        message.success(`Successfully sent ${totalSent} letters${totalFailed > 0 ? ` (${totalFailed} failed)` : ''}`);
      } else {
        message.warning('No letters were sent');
      }
      
      fetchLetters();
      fetchStatistics();
    } catch (error: any) {
      message.error(error.message || 'Failed to send letters');
    } finally {
      setSendingLoading(false);
      setTimeout(() => {
        setBulkActionModalVisible(false);
        setSendingProgress(0);
        setSendingStatus('');
      }, 2000);
    }
  };

  const handleSendLetters = async (letterType: 'standPossession' | 'transport') => {
    await handleBulkSendLetters([letterType]);
  };

  const handleSendBothLetters = async () => {
    await handleBulkSendLetters(['standPossession', 'transport']);
  };

  const handleResendLetter = async (letterId: string) => {
    try {
      await exhibitionLetterService.resendLetter(letterId);
      message.success('Letter resent successfully');
      fetchLetters();
      fetchStatistics();
    } catch (error: any) {
      message.error(error.message || 'Failed to resend letter');
    }
  };

  const handleDeleteLetter = async (letterId: string, letterStatus: string = '', force: boolean = false) => {
    try {
      const result = await exhibitionLetterService.deleteLetter(letterId, force);
      
      if (result.requiresForce) {
        // Show confirmation modal for sent letters
        Modal.confirm({
          title: 'Delete Sent Letter',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
              <Alert
                message="This letter has already been sent"
                description="Deleting a sent letter will remove it from your records but cannot unsend the email. Are you sure you want to proceed?"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
              <p><strong>Letter Details:</strong></p>
              <ul>
                <li>Type: {letterStatus === 'standPossession' ? 'Stand Possession' : 'Transport'}</li>
                <li>Status: {letterStatus}</li>
              </ul>
            </div>
          ),
          okText: 'Yes, Delete',
          okType: 'danger',
          cancelText: 'Cancel',
          onOk: () => handleDeleteLetter(letterId, letterStatus, true),
        });
        return;
      }

      message.success(result.message || 'Letter deleted successfully');
      fetchLetters();
      fetchStatistics();
    } catch (error: any) {
      message.error(error.message || 'Failed to delete letter');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (!selectedExhibition) return;
    
    Modal.confirm({
      title: 'Bulk Delete Letters',
      icon: <ExclamationCircleOutlined />,
      width: 650,
      content: (
        <BulkDeleteModal
          exhibitionId={selectedExhibition}
          onSuccess={() => {
            fetchLetters();
            fetchStatistics();
          }}
        />
      ),
      footer: null,
    });
  };

  // Handle quick cleanup
  const handleQuickCleanup = () => {
    if (!selectedExhibition) return;
    
    Modal.confirm({
      title: 'Quick Cleanup',
      icon: <ClearOutlined />,
      width: 550,
      content: (
        <QuickCleanupModal
          exhibitionId={selectedExhibition}
          onSuccess={() => {
            fetchLetters();
            fetchStatistics();
          }}
        />
      ),
      footer: null,
    });
  };

  const handleResendLetters = async (letter: ExhibitionLetter, letterTypes: string[]) => {
    if (!selectedExhibition) return;

    try {
      const letterTypeNames = letterTypes.map(type => 
        type === 'standPossession' ? 'Stand Possession' : 'Transport'
      ).join(' and ');
      
      message.loading({ content: `Sending ${letterTypeNames} letter(s)...`, key: 'resend-letters' });
      
      // Extract bookingId - it could be populated object or string
      const bookingId = typeof letter.bookingId === 'object' && letter.bookingId !== null 
        ? (letter.bookingId as any)._id 
        : letter.bookingId;
      
      const result = await exhibitionLetterService.resendBothLetters(selectedExhibition, bookingId, letterTypes);
      
      // Show detailed results
      const successCount = result.summary.sent;
      const failedCount = result.summary.failed;
      const total = result.summary.total;
      
      if (successCount > 0 && failedCount === 0) {
        message.success({ 
          content: `${letterTypeNames} letter(s) sent successfully (${successCount}/${total})`, 
          key: 'resend-letters' 
        });
      } else if (successCount > 0 && failedCount > 0) {
        message.warning({ 
          content: `Partially successful: ${successCount} sent, ${failedCount} failed`, 
          key: 'resend-letters' 
        });
      } else {
        message.error({ 
          content: `Failed to send ${letterTypeNames} letter(s): ${result.message}`, 
          key: 'resend-letters' 
        });
      }

      fetchLetters();
      fetchStatistics();
    } catch (error: any) {
      message.error({ 
        content: error.message || 'Failed to resend letters', 
        key: 'resend-letters' 
      });
    }
  };

  const handleViewLetter = async (letter: ExhibitionLetter) => {
    setSelectedLetter(letter);
    setPreviewModalVisible(true);
  };

  const handleDownloadLetter = async (letter: ExhibitionLetter) => {
    try {
      message.loading({ content: 'Generating PDF...', key: 'download' });
      
      const blob = await exhibitionLetterService.downloadLetterPDF(letter._id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename
      const letterTypeLabel = letter.letterType === 'standPossession' ? 'Stand_Possession' : 'Transport';
      const safeCompanyName = letter.companyName.replace(/[^a-zA-Z0-9\-_]/g, '_').substring(0, 20);
      const filename = `${letterTypeLabel}_Letter_${safeCompanyName}.pdf`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      message.success({ content: 'Letter downloaded successfully', key: 'download' });
    } catch (error: any) {
      message.error({ content: error.message || 'Failed to download letter', key: 'download' });
    }
  };

  const resetFilters = () => {
    setQuickFilter('all');
    setLetterTypeFilter('');
    setSearchQuery('');
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const hasActiveFilters = () => {
    return !!(quickFilter !== 'all' || letterTypeFilter || searchQuery);
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      sent: { color: 'green', icon: <CheckCircleOutlined /> },
      pending: { color: 'orange', icon: <ClockCircleOutlined /> },
      failed: { color: 'red', icon: <CloseCircleOutlined /> },
      scheduled: { color: 'blue', icon: <ClockCircleOutlined /> }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', icon: null };
    
    return (
      <Tag color={config.color} icon={config.icon}>
        {status.toUpperCase()}
      </Tag>
    );
  };

  // Bulk Delete Modal Component
  const BulkDeleteModal: React.FC<{ exhibitionId: string; onSuccess: () => void }> = ({ exhibitionId, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleBulkDeleteSubmit = async (values: any) => {
      try {
        setLoading(true);
        const result = await exhibitionLetterService.bulkDeleteLetters(exhibitionId, {
          status: values.status,
          letterType: values.letterType,
          olderThanDays: values.olderThanDays,
          force: values.force || false
        });

        if (result.requiresForce) {
          message.warning('Sent letters require force confirmation. Please check the force option and try again.');
          return;
        }

        message.success(`Successfully deleted ${result.deletedCount} letters`);
        onSuccess();
        Modal.destroyAll();
      } catch (error: any) {
        message.error(error.message || 'Failed to delete letters');
      } finally {
        setLoading(false);
      }
    };

    return (
      <Form form={form} layout="vertical" onFinish={handleBulkDeleteSubmit}>
        <Alert
          message="Bulk Delete Letters"
          description="Select criteria for letters to delete. This action cannot be undone."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form.Item name="status" label="Status to Delete">
          <Select
            mode="multiple"
            placeholder="Select status types"
            options={[
              { label: 'Failed Letters', value: 'failed' },
              { label: 'Pending Letters', value: 'pending' },
              { label: 'Sent Letters', value: 'sent' }
            ]}
          />
        </Form.Item>

        <Form.Item name="letterType" label="Letter Type (Optional)">
          <Select
            placeholder="All types"
            allowClear
            options={[
              { label: 'Stand Possession', value: 'standPossession' },
              { label: 'Transport', value: 'transport' }
            ]}
          />
        </Form.Item>

        <Form.Item name="olderThanDays" label="Older Than (Days)">
          <InputNumber min={1} placeholder="e.g., 30" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item name="force" valuePropName="checked">
          <Checkbox>
            Force delete sent letters (I understand this removes delivery records)
          </Checkbox>
        </Form.Item>

        <Row justify="end" gutter={8}>
          <Col>
            <Button onClick={() => Modal.destroyAll()}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" danger htmlType="submit" loading={loading}>
              Delete Letters
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // Quick Cleanup Modal Component
  const QuickCleanupModal: React.FC<{ exhibitionId: string; onSuccess: () => void }> = ({ exhibitionId, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleCleanupSubmit = async (values: any) => {
      try {
        setLoading(true);
        const result = await exhibitionLetterService.cleanOldLetters(exhibitionId, {
          daysOld: values.daysOld || 30,
          includeSent: values.includeSent || false
        });

        message.success(`Successfully cleaned ${result.deletedCount} old letters`);
        onSuccess();
        Modal.destroyAll();
      } catch (error: any) {
        message.error(error.message || 'Failed to clean letters');
      } finally {
        setLoading(false);
      }
    };

    return (
      <Form form={form} layout="vertical" onFinish={handleCleanupSubmit} initialValues={{ daysOld: 30 }}>
        <Alert
          message="Quick Cleanup"
          description="Remove old letters to keep your database clean. By default, only failed and pending letters are removed."
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form.Item name="daysOld" label="Remove letters older than" rules={[{ required: true }]}>
          <InputNumber 
            min={1} 
            max={365}
            style={{ width: '100%' }} 
            suffix="days"
            placeholder="30"
          />
        </Form.Item>

        <Form.Item name="includeSent" valuePropName="checked">
          <Checkbox>
            Also remove sent letters (not recommended unless archiving)
          </Checkbox>
        </Form.Item>

        <Row justify="end" gutter={8}>
          <Col>
            <Button onClick={() => Modal.destroyAll()}>Cancel</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit" loading={loading}>
              Clean Old Letters
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  // Enhanced status overview component
  const StatusOverview = () => {
    if (!statistics) return null;

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'sent': return '#52c41a';
        case 'pending': return '#faad14';
        case 'failed': return '#ff4d4f';
        default: return '#1890ff';
      }
    };

    const standTotal = statistics.standPossession.sent + statistics.standPossession.pending + statistics.standPossession.failed;
    const transportTotal = statistics.transport.sent + statistics.transport.pending + statistics.transport.failed;

    return (
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card size="small" title="Stand Possession Letters" extra={<Tag color="blue">Stand Possession</Tag>}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Sent"
                  value={statistics.standPossession.sent}
                  valueStyle={{ color: getStatusColor('sent'), fontSize: '20px' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Pending"
                  value={statistics.standPossession.pending}
                  valueStyle={{ color: getStatusColor('pending'), fontSize: '20px' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Failed"
                  value={statistics.standPossession.failed}
                  valueStyle={{ color: getStatusColor('failed'), fontSize: '20px' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Col>
            </Row>
            {standTotal > 0 && (
              <Progress 
                percent={Math.round((statistics.standPossession.sent / standTotal) * 100)} 
                strokeColor={getStatusColor('sent')}
                style={{ marginTop: '12px' }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card size="small" title="Transport Letters" extra={<Tag color="green">Transport</Tag>}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Sent"
                  value={statistics.transport.sent}
                  valueStyle={{ color: getStatusColor('sent'), fontSize: '20px' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Pending"
                  value={statistics.transport.pending}
                  valueStyle={{ color: getStatusColor('pending'), fontSize: '20px' }}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Failed"
                  value={statistics.transport.failed}
                  valueStyle={{ color: getStatusColor('failed'), fontSize: '20px' }}
                  prefix={<CloseCircleOutlined />}
                />
              </Col>
            </Row>
            {transportTotal > 0 && (
              <Progress 
                percent={Math.round((statistics.transport.sent / transportTotal) * 100)} 
                strokeColor={getStatusColor('sent')}
                style={{ marginTop: '12px' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    );
  };

  // Quick Action Panel Component
  const QuickActionPanel = () => {
    if (!selectedExhibition) return null;

    return (
      <Card 
        title={
          <Space>
            <ThunderboltOutlined />
            <span>Quick Actions</span>
          </Space>
        }
        size="small"
        style={{ marginBottom: '24px' }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Button
              type="primary"
              size="large"
              block
              icon={<DoubleRightOutlined />}
              loading={sendingLoading}
              onClick={handleSendBothLetters}
              style={{ height: '48px' }}
            >
              Send Both Letter Types
            </Button>
          </Col>
          <Col xs={12} sm={8}>
            <Button
              size="large"
              block
              icon={<FileTextOutlined />}
              loading={sendingLoading}
              onClick={() => handleSendLetters('standPossession')}
              style={{ height: '48px' }}
            >
              Stand Possession Only
            </Button>
          </Col>
          <Col xs={12} sm={8}>
            <Button
              size="large"
              block
              icon={<SendOutlined />}
              loading={sendingLoading}
              onClick={() => handleSendLetters('transport')}
              style={{ height: '48px' }}
            >
              Transport Only
            </Button>
          </Col>
        </Row>
        
        <Divider style={{ margin: '16px 0 12px 0' }} />
        
        <Row gutter={[8, 8]} style={{ marginTop: '12px' }}>
          <Col flex="auto">
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <InfoCircleOutlined style={{ marginRight: '4px' }} />
              Letters are sent to exhibitors automatically. Use manual sending for immediate delivery.
            </Text>
          </Col>
          <Col>
            <Space size="small">
              <Button
                icon={<ClearOutlined />}
                onClick={handleQuickCleanup}
                size="small"
                title="Quick cleanup old letters"
              >
                Quick Cleanup
              </Button>
              <Button
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
                size="small"
                danger
                title="Bulk delete letters"
              >
                Bulk Delete
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchLetters}
                size="small"
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    );
  };

  const columns: ColumnsType<ExhibitionLetter> = [
    {
      title: 'Type',
      dataIndex: 'letterType',
      key: 'letterType',
      width: 140,
      render: (type: string) => (
        <Tag 
          color={type === 'standPossession' ? 'blue' : 'green'}
          style={{ fontSize: '11px', padding: '2px 8px' }}
        >
          {type === 'standPossession' ? 'Stand Possession' : 'Transport'}
        </Tag>
      ),
    },
    {
      title: 'Recipient',
      key: 'recipient',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{record.recipientName}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>{record.companyName}</div>
          <div style={{ fontSize: '11px', color: '#999' }}>{record.recipientEmail}</div>
        </div>
      ),
    },
    {
      title: 'Stalls',
      dataIndex: 'stallNumbers',
      key: 'stallNumbers',
      width: 100,
      render: (stallNumbers: string[]) => (
        <Tag color="default" style={{ fontSize: '11px' }}>
          {stallNumbers.join(', ')}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record) => (
        <div>
          {getStatusTag(status)}
          {record.failureReason && (
            <Tooltip title={record.failureReason} placement="top">
              <ExclamationCircleOutlined 
                style={{ color: '#ff4d4f', marginLeft: '4px', cursor: 'help' }} 
              />
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: 'Sent',
      dataIndex: 'sentAt',
      key: 'sentAt',
      width: 140,
      render: (sentAt: string) => (
        <Text style={{ fontSize: '12px' }}>
          {sentAt ? dayjs(sentAt).format('MMM DD, HH:mm') : '-'}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewLetter(record)}
            />
          </Tooltip>
          
          <Tooltip title="Download PDF">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              size="small"
              onClick={() => handleDownloadLetter(record)}
            />
          </Tooltip>

          {record.status === 'failed' && (
            <Tooltip title="Retry Send">
              <Button
                type="text"
                icon={<SendOutlined />}
                size="small"
                onClick={() => handleResendLetter(record._id)}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          )}

          <Dropdown
            menu={{
              items: [
                {
                  key: 'both',
                  label: 'Resend Both Types',
                  icon: <DoubleRightOutlined />,
                  onClick: () => handleResendLetters(record, ['standPossession', 'transport'])
                },
                {
                  key: 'standPossession',
                  label: 'Resend Stand Possession',
                  icon: <FileTextOutlined />,
                  onClick: () => handleResendLetters(record, ['standPossession'])
                },
                {
                  key: 'transport',
                  label: 'Resend Transport', 
                  icon: <SendOutlined />,
                  onClick: () => handleResendLetters(record, ['transport'])
                },
                { type: 'divider' as const },
                {
                  key: 'delete',
                  label: record.status === 'sent' ? 'Delete Sent Letter' : 'Delete Letter',
                  icon: <DeleteOutlined />,
                  danger: true,
                  onClick: () => {
                    if (record.status === 'sent') {
                      // For sent letters, use the enhanced delete handler
                      handleDeleteLetter(record._id, record.status);
                    } else {
                      // For non-sent letters, show simple confirmation
                      Modal.confirm({
                        title: 'Delete Letter',
                        content: 'Are you sure you want to delete this letter?',
                        onOk: () => handleDeleteLetter(record._id, record.status),
                      });
                    }
                  }
                }
              ]
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      ),
    },
  ];

  const upcomingColumns: ColumnsType<UpcomingSchedule> = [
    {
      title: 'Exhibition',
      dataIndex: 'exhibitionName',
      key: 'exhibitionName',
    },
    {
      title: 'Letter Type',
      dataIndex: 'letterType',
      key: 'letterType',
      render: (type: string) => (
        <Tag color={type === 'standPossession' ? 'blue' : 'green'}>
          {type === 'standPossession' ? 'Stand Possession' : 'Transport'}
        </Tag>
      ),
    },
    {
      title: 'Scheduled Date',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Days Until Start',
      dataIndex: 'daysUntilStart',
      key: 'daysUntilStart',
      render: (days: number) => (
        <Badge 
          count={days} 
          style={{ backgroundColor: days <= 7 ? '#ff4d4f' : '#52c41a' }}
          overflowCount={99}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'due' ? 'red' : 'blue'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MailOutlined style={{ color: '#1890ff' }} />
          Exhibition Letters
      </Title>
        <Paragraph type="secondary" style={{ margin: '8px 0 0 0', fontSize: '16px' }}>
        Manage and monitor exhibition letters sent to exhibitors
        </Paragraph>
      </div>

      <Tabs defaultActiveKey="dashboard" style={{ background: 'white', borderRadius: '8px', padding: '24px' }}>
        <TabPane 
          tab={
                  <span>
              <DashboardOutlined />
              Dashboard
                  </span>
                }
          key="dashboard"
        >
          {/* Exhibition Selection */}
          <Card style={{ marginBottom: '24px' }} size="small">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                    Select Exhibition:
                </Text>
                <Select
                    style={{ width: '100%' }}
                    placeholder="Choose an exhibition to manage letters"
                  value={selectedExhibition || undefined}
                  onChange={handleExhibitionChange}
                  showSearch
                  optionFilterProp="children"
                  allowClear={!!selectedExhibition}
                    size="large"
                >
                  {exhibitions.map(exhibition => (
                    <Option key={exhibition._id} value={exhibition._id}>
                      {exhibition.name}
                    </Option>
                  ))}
                </Select>
                </div>
              </Col>
              {selectedExhibition && (
                <Col xs={24} md={12}>
                  <Alert
                    message={`Managing letters for: ${exhibitions.find(ex => ex._id === selectedExhibition)?.name}`}
                    type="info"
                    showIcon
                    style={{ margin: 0 }}
                  />
                </Col>
              )}
            </Row>
          </Card>

          {selectedExhibition ? (
            <>
              {/* Status Overview */}
              <StatusOverview />

              {/* Quick Actions */}
              <QuickActionPanel />

              {/* Simplified Filters */}
              <Card style={{ marginBottom: '24px' }} size="small">
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={6}>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>Quick Filter:</Text>
                <Select
                      style={{ width: '100%' }}
                      value={quickFilter}
                      onChange={setQuickFilter}
                    >
                      <Option value="all">All Letters</Option>
                      <Option value="sent">Sent Only</Option>
                      <Option value="pending">Pending Only</Option>
                      <Option value="failed">Failed Only</Option>
                    </Select>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>Letter Type:</Text>
                    <Select
                      style={{ width: '100%' }}
                  placeholder="All Types"
                  value={letterTypeFilter || undefined}
                  onChange={setLetterTypeFilter}
                      allowClear
                >
                  <Option value="standPossession">Stand Possession</Option>
                  <Option value="transport">Transport</Option>
                </Select>
              </Col>
                  <Col xs={24} sm={8}>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>Search:</Text>
                <Search
                  placeholder="Search by name, company, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                      allowClear
                />
              </Col>
                  <Col xs={24} sm={4}>
                <div style={{ marginTop: '32px' }}>
                  <Button 
                    onClick={resetFilters}
                    disabled={!hasActiveFilters()}
                    danger={hasActiveFilters()}
                        icon={<ClearOutlined />}
                        block
                  >
                        Clear Filters
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Letters Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={letters}
              rowKey="_id"
              loading={loading}
                  size="small"
                  scroll={{ x: 800 }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} letters`,
                onChange: (page, pageSize) => {
                  setPagination(prev => ({
                    ...prev,
                    current: page,
                    pageSize: pageSize || 10
                  }));
                }
              }}
            />
          </Card>
            </>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  Please select an exhibition to view and manage letters
                </span>
              }
            />
          )}
        </TabPane>

        <TabPane tab="Upcoming Schedules" key="schedules">
          <Alert
            message="Automatic Letter Schedules"
            description="These letters will be sent automatically based on exhibition dates and letter settings."
            type="info"
            showIcon
            style={{ marginBottom: '24px' }}
          />
          
          <Card>
            <Table
              columns={upcomingColumns}
              dataSource={upcomingSchedules}
              rowKey={(record) => `${record.exhibitionId}-${record.letterType}`}
              pagination={false}
              size="small"
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Bulk Action Progress Modal */}
      <Modal
        title="Sending Letters"
        open={bulkActionModalVisible}
        footer={null}
        closable={false}
        centered
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Progress
            type="circle"
            percent={sendingProgress}
            status={sendingProgress === 100 ? 'success' : 'active'}
            style={{ marginBottom: '16px' }}
          />
          <div style={{ marginTop: '16px' }}>
            <Text strong>{sendingStatus}</Text>
          </div>
        </div>
      </Modal>

      {/* Letter Preview Modal - Enhanced */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            Letter Details
          </Space>
        }
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            Close
          </Button>,
          selectedLetter && (
            <Button
              key="download"
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => selectedLetter && handleDownloadLetter(selectedLetter)}
            >
              Download PDF
          </Button>
          )
        ]}
        width={900}
      >
        {selectedLetter && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <Text strong>Type:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag color={selectedLetter.letterType === 'standPossession' ? 'blue' : 'green'}>
                    {selectedLetter.letterType === 'standPossession' ? 'Stand Possession' : 'Transport'}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <Text strong>Status:</Text>
                <div style={{ marginTop: '4px' }}>
                  {getStatusTag(selectedLetter.status)}
                </div>
              </Col>
              <Col span={12}>
                <Text strong>Recipient:</Text>
                <div style={{ marginTop: '4px' }}>
                  <div style={{ fontWeight: 'bold' }}>{selectedLetter.recipientName}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{selectedLetter.recipientEmail}</div>
                </div>
              </Col>
              <Col span={12}>
                <Text strong>Company:</Text>
                <div style={{ marginTop: '4px' }}>{selectedLetter.companyName}</div>
              </Col>
              <Col span={12}>
                <Text strong>Stalls:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag>{selectedLetter.stallNumbers.join(', ')}</Tag>
                </div>
              </Col>
              <Col span={12}>
                <Text strong>Sent At:</Text>
                <div style={{ marginTop: '4px' }}>
                  {selectedLetter.sentAt ? dayjs(selectedLetter.sentAt).format('MMM DD, YYYY HH:mm') : 'Not sent'}
                </div>
              </Col>
            </Row>
            
            <Divider />
            
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Subject:</Text>
              <div style={{ marginTop: '8px', padding: '12px', background: '#f5f5f5', borderRadius: '6px', border: '1px solid #d9d9d9' }}>
                {selectedLetter.subject}
              </div>
            </div>
            
            <div>
              <Text strong>Content:</Text>
              <div style={{ 
                marginTop: '8px', 
                padding: '16px', 
                background: '#f5f5f5', 
                borderRadius: '6px',
                border: '1px solid #d9d9d9',
                whiteSpace: 'pre-line',
                fontFamily: 'monospace',
                maxHeight: '400px',
                overflow: 'auto',
                fontSize: '13px',
                lineHeight: '1.6'
              }}>
                {selectedLetter.content}
              </div>
            </div>
            
            {selectedLetter.failureReason && (
              <div style={{ marginTop: '16px' }}>
                <Text strong>Failure Reason:</Text>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '12px', 
                  background: '#fff2f0', 
                  border: '1px solid #ffccc7',
                  borderRadius: '6px',
                  color: '#a8071a'
                }}>
                  <ExclamationCircleOutlined style={{ marginRight: '8px' }} />
                  {selectedLetter.failureReason}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LettersPage; 