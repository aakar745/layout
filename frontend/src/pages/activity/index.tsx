import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Tooltip,
  Modal,
  Descriptions,
  Alert,
  Spin,
  Empty,
  Badge
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  FilterOutlined,
  CalendarOutlined,
  UserOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import activityService, { Activity, ActivityStats, ActivityFilters, GetActivitiesParams } from '../../services/activity.service';
import './Activity.css';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ActivityPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0
  });
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [filters, setFilters] = useState<ActivityFilters | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [clearLogsModalVisible, setClearLogsModalVisible] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  
  // Filter states
  const [searchText, setSearchText] = useState('');
  const [selectedAction, setSelectedAction] = useState<string | undefined>(undefined);
  const [selectedResource, setSelectedResource] = useState<string | undefined>(undefined);
  const [selectedSuccess, setSelectedSuccess] = useState<boolean | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params: GetActivitiesParams = {
        page: pagination.current,
        limit: pagination.pageSize,
        search: searchText || undefined,
        action: selectedAction,
        resource: selectedResource,
        success: selectedSuccess,
        startDate: dateRange?.[0]?.toISOString(),
        endDate: dateRange?.[1]?.toISOString()
      };

      console.log('Fetching activities with params:', params);
      const response = await activityService.getActivities(params);
      console.log('Activities response:', response);
      
      setActivities(response.activities);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const statsData = await activityService.getStats(30);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch filter options
  const fetchFilters = async () => {
    try {
      const filtersData = await activityService.getFilters();
      setFilters(filtersData);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchStats();
    fetchFilters();
  }, []);

  // Check if any filters are active
  const hasActiveFilters = !!(searchText || selectedAction || selectedResource || selectedSuccess !== undefined || dateRange);

  // Note: Removed auto-fetch on filter change to avoid confusion
  // Users should click "Search" button to apply filters

  // Handle search and filters
  const handleSearch = () => {
    console.log('Applying filters:', {
      searchText,
      selectedAction,
      selectedResource,
      selectedSuccess,
      dateRange
    });
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchActivities();
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedAction(undefined);
    setSelectedResource(undefined);
    setSelectedSuccess(undefined);
    setDateRange(null);
    setPagination(prev => ({ ...prev, current: 1 }));
    setTimeout(fetchActivities, 100);
  };

  // Handle clear logs
  const handleClearLogs = async () => {
    if (confirmText !== 'CLEAR ALL LOGS') {
      return;
    }

    setClearingLogs(true);
    try {
      const result = await activityService.clearLogs({
        confirmText: confirmText
      });

      // Show success message
      Modal.success({
        title: 'Logs Cleared Successfully',
        content: `${result.deletedCount} activity logs have been cleared from the database.`,
        onOk() {
          setClearLogsModalVisible(false);
          setConfirmText('');
          fetchActivities();
          fetchStats();
        }
      });
    } catch (error: any) {
      console.error('Error clearing logs:', error);
      Modal.error({
        title: 'Error Clearing Logs',
        content: error.response?.data?.message || 'Failed to clear activity logs. Please try again.',
      });
    } finally {
      setClearingLogs(false);
    }
  };

  const handleClearLogsCancel = () => {
    setClearLogsModalVisible(false);
    setConfirmText('');
  };

  // Table columns
  const columns: ColumnsType<Activity> = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => (
        <div>
          <div>{dayjs(timestamp).format('MMM DD, YYYY')}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(timestamp).format('HH:mm:ss')}
          </Text>
        </div>
      ),
      sorter: true,
      defaultSortOrder: 'descend'
    },
    {
      title: 'User',
      key: 'user',
      width: 200,
      render: (_, record) => {
        if (record.userId) {
          return (
            <div>
              <div>
                <UserOutlined style={{ marginRight: 4 }} />
                {record.userId.username || record.userId.name}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.userId.email}
              </Text>
            </div>
          );
        } else if (record.exhibitorId) {
          return (
            <div>
              <div>
                <UserOutlined style={{ marginRight: 4 }} />
                {record.exhibitorId.contactPerson}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.exhibitorId.companyName}
              </Text>
            </div>
          );
        } else {
          return (
            <Tag color="default">System</Tag>
          );
        }
      }
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (action: string) => {
        const colors: Record<string, string> = {
          user_created: 'green',
          user_updated: 'blue',
          user_deleted: 'red',
          exhibitor_registered: 'green',
          exhibitor_updated: 'blue',
          exhibitor_deleted: 'red',
          exhibition_created: 'green',
          exhibition_updated: 'blue',
          exhibition_deleted: 'red',
          booking_created: 'green',
          booking_updated: 'blue',
          booking_cancelled: 'orange',
          booking_deleted: 'red',
          invoice_downloaded: 'purple',
          stall_created: 'green',
          stall_updated: 'blue',
          stall_deleted: 'red'
        };
        
        return (
          <Tag color={colors[action] || 'default'}>
            {action.replace(/_/g, ' ').toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Resource',
      dataIndex: 'resource',
      key: 'resource',
      width: 120,
      render: (resource: string) => (
        <Tag color="geekblue">{resource.toUpperCase()}</Tag>
      )
    },
    {
      title: 'Description',
      key: 'description',
      render: (_, record) => (
        <div>
          <div>{record.details.description}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.method} {record.endpoint}
          </Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'success',
      key: 'success',
      width: 100,
      render: (success: boolean) => (
        <Badge
          status={success ? 'success' : 'error'}
          text={success ? 'Success' : 'Failed'}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedActivity(record);
            setDetailsModalVisible(true);
          }}
        />
      )
    }
  ];

  return (
    <div className="activity-page">
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>System Activity</Title>
        <Text type="secondary">
          Monitor all user actions and system events in real-time
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Activities"
              value={stats?.totalActivities || 0}
              loading={statsLoading}
              prefix={<InfoCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Successful"
              value={stats?.successfulActivities || 0}
              loading={statsLoading}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Failed"
              value={stats?.failedActivities || 0}
              loading={statsLoading}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={stats?.successRate || 0}
              precision={1}
              suffix="%"
              loading={statsLoading}
              valueStyle={{ 
                color: (stats?.successRate || 0) > 95 ? '#3f8600' : 
                       (stats?.successRate || 0) > 80 ? '#faad14' : '#cf1322' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Search activities..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Action"
              value={selectedAction}
              onChange={setSelectedAction}
              allowClear
              style={{ width: '100%' }}
            >
              {filters?.actions.map(action => (
                <Option key={action} value={action}>
                  {action.replace(/_/g, ' ')}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Resource"
              value={selectedResource}
              onChange={setSelectedResource}
              allowClear
              style={{ width: '100%' }}
            >
              {filters?.resources.map(resource => (
                <Option key={resource} value={resource}>
                  {resource}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="Status"
              value={selectedSuccess}
              onChange={setSelectedSuccess}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value={true}>Success</Option>
              <Option value={false}>Failed</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates)}
              style={{ width: '100%' }}
              placeholder={['Start Date', 'End Date']}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: 16 }} justify="space-between" align="middle">
          <Col flex="auto">
            <Space wrap>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Search
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                Reset
              </Button>
              <Button icon={<ReloadOutlined />} onClick={fetchActivities}>
                Refresh
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              {hasActiveFilters && (
                <Tag color="blue" icon={<FilterOutlined />}>
                  Filters Active
                </Tag>
              )}
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => setClearLogsModalVisible(true)}
                style={{ 
                  borderRadius: '6px',
                  fontWeight: 500,
                  height: '36px',
                  paddingLeft: '16px',
                  paddingRight: '16px'
                }}
              >
                Clear Logs
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Activities Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={activities}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} activities`,
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize || 50
              }));
            }
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Activity Details Modal */}
      <Modal
        title="Activity Details"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>
        ]}
        width={800}
      >
        {selectedActivity && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Timestamp">
                {dayjs(selectedActivity.timestamp).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge
                  status={selectedActivity.success ? 'success' : 'error'}
                  text={selectedActivity.success ? 'Success' : 'Failed'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="Action">
                <Tag color="blue">{selectedActivity.action}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Resource">
                <Tag color="geekblue">{selectedActivity.resource}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Method">
                <Tag>{selectedActivity.method}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Endpoint">
                <code>{selectedActivity.endpoint}</code>
              </Descriptions.Item>
              <Descriptions.Item label="IP Address">
                {selectedActivity.ipAddress || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="User Agent" span={2}>
                <Text style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                  {selectedActivity.userAgent || 'N/A'}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 16 }}>
              <Title level={5}>Description</Title>
              <Text>{selectedActivity.details.description}</Text>
            </div>

            {selectedActivity.details.oldValues && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>Previous Values</Title>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: 12, 
                  borderRadius: 4,
                  fontSize: '12px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(selectedActivity.details.oldValues, null, 2)}
                </pre>
              </div>
            )}

            {selectedActivity.details.newValues && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>New Values</Title>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: 12, 
                  borderRadius: 4,
                  fontSize: '12px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(selectedActivity.details.newValues, null, 2)}
                </pre>
              </div>
            )}

            {selectedActivity.errorMessage && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  type="error"
                  message="Error Details"
                  description={selectedActivity.errorMessage}
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Clear Logs Confirmation Modal */}
      <Modal
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#ff4d4f',
            fontSize: '16px',
            fontWeight: 600
          }}>
            <ExclamationCircleOutlined 
              style={{ 
                marginRight: 12, 
                fontSize: '20px',
                padding: '8px',
                backgroundColor: '#fff2f0',
                borderRadius: '50%',
                border: '2px solid #ffccc7'
              }} 
            />
            Clear All Activity Logs
          </div>
        }
        open={clearLogsModalVisible}
        onCancel={handleClearLogsCancel}
        closable={!clearingLogs}
        maskClosable={!clearingLogs}
        width={650}
        centered
        className="clear-logs-modal"
        footer={[
          <Button 
            key="cancel" 
            size="large" 
            disabled={clearingLogs}
            onClick={handleClearLogsCancel}
            style={{ 
              minWidth: '100px',
              height: '40px',
              borderRadius: '6px'
            }}
          >
            Cancel
          </Button>,
          <Button 
            key="clear" 
            type="primary" 
            danger 
            size="large"
            loading={clearingLogs}
            disabled={confirmText !== 'CLEAR ALL LOGS'}
            onClick={handleClearLogs}
            style={{ 
              minWidth: '140px',
              height: '40px',
              borderRadius: '6px',
              fontWeight: 600
            }}
          >
            Clear All Logs
          </Button>
        ]}
      >
        <div style={{ padding: '8px 0' }}>
          {/* Warning Alert */}
          <Alert
            message="⚠️ Permanent Data Deletion Warning"
            description={
              <div style={{ marginTop: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  This action will <strong>permanently delete all activity logs</strong> from the database.
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  • This operation cannot be undone<br />
                  • The deletion action will be logged before clearing<br />
                  • Consider backing up your database first
                </div>
              </div>
            }
            type="warning"
            showIcon
            style={{ 
              marginBottom: 24,
              border: '1px solid #faad14',
              borderRadius: '8px'
            }}
          />
          
          {/* Statistics Card */}
          <div style={{ 
            backgroundColor: '#fafafa', 
            border: '1px solid #d9d9d9',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: 24
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: 12,
              fontSize: '14px',
              fontWeight: 600,
              color: '#262626'
            }}>
              <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              Current Activity Statistics
            </div>
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                    {stats?.totalActivities || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Total Activities</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                    {stats?.successfulActivities || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Successful</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>
                    {stats?.failedActivities || 0}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Failed</div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Confirmation Section */}
          <div style={{ 
            backgroundColor: '#fff2f0', 
            border: '1px solid #ffccc7',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: 16
          }}>
            <div style={{ 
              marginBottom: 16,
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              <Text strong style={{ color: '#262626' }}>
                To confirm this dangerous action, please type the following text exactly:
              </Text>
            </div>
            
            <div style={{ 
              textAlign: 'center',
              marginBottom: 16,
              padding: '12px',
              backgroundColor: '#ffffff',
              border: '2px dashed #ff4d4f',
              borderRadius: '6px'
            }}>
              <Text 
                code 
                style={{ 
                  color: '#ff4d4f', 
                  fontWeight: 'bold',
                  fontSize: '16px',
                  letterSpacing: '1px'
                }}
              >
                CLEAR ALL LOGS
              </Text>
            </div>

            <Input
              placeholder="Type the confirmation text here..."
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={clearingLogs}
              size="large"
              style={{ 
                borderColor: confirmText === 'CLEAR ALL LOGS' ? '#52c41a' : '#ff4d4f',
                borderWidth: '2px',
                borderRadius: '6px',
                fontSize: '14px',
                textAlign: 'center',
                fontWeight: confirmText === 'CLEAR ALL LOGS' ? 'bold' : 'normal'
              }}
              suffix={
                confirmText === 'CLEAR ALL LOGS' ? (
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '16px' }} />
                ) : confirmText ? (
                  <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '16px' }} />
                ) : null
              }
            />

            {confirmText && confirmText !== 'CLEAR ALL LOGS' && (
              <div style={{ 
                marginTop: 8,
                padding: '8px 12px',
                backgroundColor: '#fff1f0',
                border: '1px solid #ffccc7',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <Text type="danger" style={{ fontSize: '13px' }}>
                  <CloseCircleOutlined style={{ marginRight: 4 }} />
                  Please type exactly: <Text code strong>CLEAR ALL LOGS</Text>
                </Text>
              </div>
            )}

            {confirmText === 'CLEAR ALL LOGS' && (
              <div style={{ 
                marginTop: 8,
                padding: '8px 12px',
                backgroundColor: '#f6ffed',
                border: '1px solid #b7eb8f',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                <Text type="success" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  <CheckCircleOutlined style={{ marginRight: 4 }} />
                  Confirmation text verified. You may now proceed.
                </Text>
              </div>
            )}
          </div>

          {/* Final Warning */}
          <div style={{ 
            textAlign: 'center',
            padding: '12px',
            backgroundColor: '#fff7e6',
            border: '1px solid #ffd591',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#ad6800'
          }}>
            <ExclamationCircleOutlined style={{ marginRight: 4 }} />
            <strong>Last Warning:</strong> This action will permanently delete {stats?.totalActivities || 0} activity logs.
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ActivityPage; 