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
  MenuProps
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
  DoubleRightOutlined
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

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const LettersPage: React.FC = () => {
  // Initialize selectedExhibition from localStorage
  const [selectedExhibition, setSelectedExhibition] = useState<string>(() => {
    return localStorage.getItem('letters-selected-exhibition') || '';
  });
  const [letters, setLetters] = useState<ExhibitionLetter[]>([]);
  const [statistics, setStatistics] = useState<LetterStatistics | null>(null);
  const [upcomingSchedules, setUpcomingSchedules] = useState<UpcomingSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingLoading, setSendingLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Filters
  const [letterTypeFilter, setLetterTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // Modal states
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<ExhibitionLetter | null>(null);

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
  }, [selectedExhibition, letterTypeFilter, statusFilter, searchQuery, pagination.current, pagination.pageSize]);

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
        status: statusFilter,
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

  const handleSendLetters = async (letterType: 'standPossession' | 'transport') => {
    if (!selectedExhibition) return;

    setSendingLoading(true);
    try {
      const result = await exhibitionLetterService.sendLettersManually(selectedExhibition, letterType);
      message.success(`${result.result.sent} letters sent successfully`);
      fetchLetters();
      fetchStatistics();
    } catch (error: any) {
      message.error(error.message || 'Failed to send letters');
    } finally {
      setSendingLoading(false);
    }
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

  const handleDeleteLetter = async (letterId: string) => {
    try {
      await exhibitionLetterService.deleteLetter(letterId);
      message.success('Letter deleted successfully');
      fetchLetters();
      fetchStatistics();
    } catch (error: any) {
      message.error(error.message || 'Failed to delete letter');
    }
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

      // Show detailed breakdown for failed letters only
      if (letterTypes.includes('standPossession') && result.results.standPossession.message && !result.results.standPossession.success) {
        message.warning(result.results.standPossession.message);
      }
      if (letterTypes.includes('transport') && result.results.transport.message && !result.results.transport.success) {
        message.warning(result.results.transport.message);
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
    setLetterTypeFilter('');
    setStatusFilter('');
    setSearchQuery('');
    setDateRange(null);
    setPagination(prev => ({ ...prev, current: 1 }));
    // Note: We don't reset selectedExhibition here as it's the main context
    // Users can clear it using the allowClear button on the exhibition select
  };

  // Helper function to check if any filters are active (excluding exhibition)
  const hasActiveFilters = () => {
    return !!(letterTypeFilter || statusFilter || searchQuery || dateRange);
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

  const columns: ColumnsType<ExhibitionLetter> = [
    {
      title: 'Type',
      dataIndex: 'letterType',
      key: 'letterType',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'standPossession' ? 'blue' : 'green'}>
          {type === 'standPossession' ? 'Stand Possession' : 'Transport'}
        </Tag>
      ),
    },
    {
      title: 'Recipient',
      key: 'recipient',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.recipientName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.companyName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.recipientEmail}</div>
        </div>
      ),
    },
    {
      title: 'Stalls',
      dataIndex: 'stallNumbers',
      key: 'stallNumbers',
      width: 100,
      render: (stallNumbers: string[]) => stallNumbers.join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Method',
      dataIndex: 'sendingMethod',
      key: 'sendingMethod',
      width: 100,
      render: (method: string) => (
        <Tag color={method === 'automatic' ? 'purple' : 'cyan'}>
          {method.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Sent At',
      dataIndex: 'sentAt',
      key: 'sentAt',
      width: 150,
      render: (sentAt: string) => sentAt ? dayjs(sentAt).format('MMM DD, YYYY HH:mm') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Letter">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewLetter(record)}
            />
          </Tooltip>
          
          <Tooltip title="Download PDF">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadLetter(record)}
            />
          </Tooltip>

          <Dropdown
            menu={{
              items: [
                {
                  key: 'both',
                  label: 'Resend Both Letters',
                  icon: <DoubleRightOutlined />,
                  onClick: () => handleResendLetters(record, ['standPossession', 'transport'])
                },
                {
                  key: 'standPossession',
                  label: 'Resend Stand Possession Only',
                  icon: <SendOutlined />,
                  onClick: () => handleResendLetters(record, ['standPossession'])
                },
                {
                  key: 'transport',
                  label: 'Resend Transport Only', 
                  icon: <SendOutlined />,
                  onClick: () => handleResendLetters(record, ['transport'])
                }
              ]
            }}
            trigger={['click']}
            placement="bottomLeft"
          >
            <Tooltip title="Resend Letters" placement="top">
              <Button
                type="text"
                icon={<DoubleRightOutlined />}
                style={{ color: '#1890ff' }}
              />
            </Tooltip>
          </Dropdown>
          
          {record.status === 'failed' && (
            <Tooltip title="Resend This Letter">
              <Button
                type="text"
                icon={<SendOutlined />}
                onClick={() => handleResendLetter(record._id)}
              />
            </Tooltip>
          )}
          
          {['failed', 'pending'].includes(record.status) && (
            <Popconfirm
              title="Are you sure you want to delete this letter?"
              onConfirm={() => handleDeleteLetter(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete Letter">
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          )}
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
      render: (days: number) => `${days} days`,
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
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <MailOutlined /> Exhibition Letters Management
      </Title>
      <Text type="secondary">
        Manage and monitor exhibition letters sent to exhibitors
      </Text>

      <Tabs defaultActiveKey="letters" style={{ marginTop: '24px' }}>
        <TabPane tab="Letters" key="letters">
          {/* Filters */}
          <Card style={{ marginBottom: '24px' }}>
            {/* Filter Status Bar */}
            {(selectedExhibition || hasActiveFilters()) && (
              <Alert
                style={{ marginBottom: '16px' }}
                message={
                  <span>
                    <strong>Active Filters:</strong> {[
                      selectedExhibition ? `Exhibition: ${exhibitions.find(ex => ex._id === selectedExhibition)?.name || 'Selected'}` : null,
                      letterTypeFilter ? `Type: ${letterTypeFilter === 'standPossession' ? 'Stand Possession' : 'Transport'}` : null,
                      statusFilter ? `Status: ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}` : null,
                      searchQuery ? `Search: "${searchQuery}"` : null
                    ].filter(Boolean).join(' • ')}
                  </span>
                }
                type="info"
                showIcon
                closable={false}
              />
            )}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <Text strong>
                  Exhibition:
                  {selectedExhibition && <Tag color="blue" style={{ marginLeft: 8 }}>Selected</Tag>}
                </Text>
                <Select
                  style={{ width: '100%', marginTop: '8px' }}
                  placeholder="Select Exhibition"
                  value={selectedExhibition || undefined}
                  onChange={handleExhibitionChange}
                  showSearch
                  optionFilterProp="children"
                  allowClear={!!selectedExhibition}
                >
                  {exhibitions.map(exhibition => (
                    <Option key={exhibition._id} value={exhibition._id}>
                      {exhibition.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              
              <Col xs={24} md={4}>
                <Text strong>
                  Letter Type:
                  {letterTypeFilter && <Tag color="green" style={{ marginLeft: 8 }}>Filtered</Tag>}
                </Text>
                <Select
                  style={{ width: '100%', marginTop: '8px' }}
                  placeholder="All Types"
                  value={letterTypeFilter || undefined}
                  onChange={setLetterTypeFilter}
                  allowClear={!!letterTypeFilter}
                >
                  <Option value="standPossession">Stand Possession</Option>
                  <Option value="transport">Transport</Option>
                </Select>
              </Col>
              
              <Col xs={24} md={4}>
                <Text strong>
                  Status:
                  {statusFilter && <Tag color="orange" style={{ marginLeft: 8 }}>Filtered</Tag>}
                </Text>
                <Select
                  style={{ width: '100%', marginTop: '8px' }}
                  placeholder="All Statuses"
                  value={statusFilter || undefined}
                  onChange={setStatusFilter}
                  allowClear={!!statusFilter}
                >
                  <Option value="sent">Sent</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="failed">Failed</Option>
                  <Option value="scheduled">Scheduled</Option>
                </Select>
              </Col>
              
              <Col xs={24} md={6}>
                <Text strong>
                  Search:
                  {searchQuery && <Tag color="purple" style={{ marginLeft: 8 }}>Active</Tag>}
                </Text>
                <Search
                  style={{ marginTop: '8px' }}
                  placeholder="Search by name, company, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  allowClear={!!searchQuery}
                />
              </Col>
              
              <Col xs={24} md={4}>
                <div style={{ marginTop: '32px' }}>
                  <Button 
                    onClick={resetFilters}
                    disabled={!hasActiveFilters()}
                    type={hasActiveFilters() ? 'primary' : 'default'}
                    danger={hasActiveFilters()}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Statistics */}
          {selectedExhibition && statistics && (
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="Stand Possession - Sent"
                    value={statistics.standPossession.sent}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="Stand Possession - Pending"
                    value={statistics.standPossession.pending}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="Transport - Sent"
                    value={statistics.transport.sent}
                    valueStyle={{ color: '#3f8600' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card>
                  <Statistic
                    title="Transport - Pending"
                    value={statistics.transport.pending}
                    valueStyle={{ color: '#cf1322' }}
                    prefix={<ClockCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          )}

          {/* Actions */}
          {selectedExhibition && (
            <Card style={{ marginBottom: '24px' }}>
              <Space wrap>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  loading={sendingLoading}
                  onClick={() => handleSendLetters('standPossession')}
                >
                  Send Stand Possession Letters
                </Button>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  loading={sendingLoading}
                  onClick={() => handleSendLetters('transport')}
                >
                  Send Transport Letters
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchLetters}
                >
                  Refresh
                </Button>
              </Space>
              
              <Alert
                style={{ marginTop: '16px' }}
                message="Quick Actions"
                description="Click the double arrow (⏩) button in the table to choose which letters to resend: both types together, or individual Stand Possession or Transport letters."
                type="info"
                showIcon
                closable
              />
            </Card>
          )}

          {/* Letters Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={letters}
              rowKey="_id"
              loading={loading}
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
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Letter Preview Modal */}
      <Modal
        title="Letter Details"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedLetter && (
          <div>
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
              <Col span={12}>
                <Text strong>Type:</Text>
                <div>{selectedLetter.letterType === 'standPossession' ? 'Stand Possession' : 'Transport'}</div>
              </Col>
              <Col span={12}>
                <Text strong>Status:</Text>
                <div>{getStatusTag(selectedLetter.status)}</div>
              </Col>
              <Col span={12}>
                <Text strong>Recipient:</Text>
                <div>{selectedLetter.recipientName}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>{selectedLetter.recipientEmail}</div>
              </Col>
              <Col span={12}>
                <Text strong>Company:</Text>
                <div>{selectedLetter.companyName}</div>
              </Col>
              <Col span={12}>
                <Text strong>Stalls:</Text>
                <div>{selectedLetter.stallNumbers.join(', ')}</div>
              </Col>
              <Col span={12}>
                <Text strong>Sent At:</Text>
                <div>{selectedLetter.sentAt ? dayjs(selectedLetter.sentAt).format('MMM DD, YYYY HH:mm') : 'Not sent'}</div>
              </Col>
            </Row>
            
            <div style={{ marginBottom: '16px' }}>
              <Text strong>Subject:</Text>
              <div style={{ marginTop: '8px', padding: '8px', background: '#f5f5f5', borderRadius: '4px' }}>
                {selectedLetter.subject}
              </div>
            </div>
            
            <div>
              <Text strong>Content:</Text>
              <div style={{ 
                marginTop: '8px', 
                padding: '16px', 
                background: '#f5f5f5', 
                borderRadius: '4px',
                whiteSpace: 'pre-line',
                fontFamily: 'monospace',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                {selectedLetter.content}
              </div>
            </div>
            
            {selectedLetter.failureReason && (
              <div style={{ marginTop: '16px' }}>
                <Text strong>Failure Reason:</Text>
                <div style={{ 
                  marginTop: '8px', 
                  padding: '8px', 
                  background: '#fff2f0', 
                  border: '1px solid #ffccc7',
                  borderRadius: '4px',
                  color: '#a8071a'
                }}>
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