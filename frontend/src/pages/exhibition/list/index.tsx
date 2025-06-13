import React, { useEffect, useState, useMemo } from 'react';
import { 
  Table, Button, Space, Tag, App, Popconfirm, Input, Typography, Dropdown, 
  Tooltip, Card, DatePicker, Select, Badge, Progress, Segmented, Row, Col, Statistic, Modal 
} from 'antd';
import type { MenuProps, TableProps } from 'antd';
import { 
  EditOutlined, DeleteOutlined, EyeOutlined, LayoutOutlined, PlusOutlined, 
  SearchOutlined, MoreOutlined, CalendarOutlined, FilterOutlined, 
  CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, PoweroffOutlined, ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchExhibitions, deleteExhibition } from '../../../store/slices/exhibitionSlice';
import { Exhibition } from '../../../services/exhibition';
import exhibitionService from '../../../services/exhibition';
import { getExhibitionUrl, getPublicExhibitionUrl } from '../../../utils/url';
import dayjs from 'dayjs';
import '../../dashboard/Dashboard.css';
import { usePermission } from '../../../hooks/reduxHooks';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface FilterState {
  status: string[];
  dateRange: [string, string] | null;
  search: string;
  activeStatus?: boolean | null;
}

const ExhibitionList: React.FC = () => {
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { exhibitions, loading: exhibitionsLoading } = useSelector((state: RootState) => state.exhibition);
  const [selectedRows, setSelectedRows] = useState<Exhibition[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    dateRange: null,
    search: '',
    activeStatus: null
  });
  const [viewMode, setViewMode] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');
  const [progressData, setProgressData] = useState<Record<string, any>>({});
  const [progressLoading, setProgressLoading] = useState(false);
  const { hasPermission } = usePermission();

  useEffect(() => {
    dispatch(fetchExhibitions());
  }, [dispatch]);

  // Load progress data after exhibitions are loaded
  useEffect(() => {
    if (exhibitions.length > 0) {
      loadAllProgressData();
    }
  }, [exhibitions]);

  // Load progress data for all exhibitions
  const loadAllProgressData = async () => {
    if (exhibitions.length === 0) return;
    
    try {
      setProgressLoading(true);
      const progressPromises = exhibitions.map(async (exhibition) => {
        try {
          const id = exhibition._id || exhibition.id;
          const progressData = await exhibitionService.getExhibitionProgress(id);
          return { id, data: progressData };
        } catch (error) {
          console.warn(`Failed to load progress for exhibition ${exhibition.name}:`, error);
          return { id: exhibition._id || exhibition.id, data: null };
        }
      });
      
      const results = await Promise.all(progressPromises);
      const progressMap = results.reduce((acc, { id, data }) => {
        acc[id] = data;
        return acc;
      }, {} as Record<string, any>);
      
      setProgressData(progressMap);
    } catch (error) {
      console.error('Failed to load progress data:', error);
    } finally {
      setProgressLoading(false);
    }
  };

  // Refresh progress data
  const refreshProgressData = () => {
    loadAllProgressData();
  };

  // Update pagination total when exhibitions change
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredExhibitions.length
    }));
  }, [exhibitions, filters, viewMode]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = exhibitions.length;
    const active = exhibitions.filter(e => e.status === 'published').length;
    const upcoming = exhibitions.filter(e => new Date(e.startDate) > new Date()).length;
    const completed = exhibitions.filter(e => e.status === 'completed').length;
    const activeCount = exhibitions.filter(e => e.isActive).length;
    
    return { total, active, upcoming, completed, activeCount };
  }, [exhibitions]);

  const handleDelete = async (record: Exhibition) => {
    const id = record._id || record.id;
    try {
      setDeleteLoading(true);
      await dispatch(deleteExhibition(id)).unwrap();
      message.success('Exhibition deleted successfully');
    } catch (error: any) {
      message.error(error.message || 'Failed to delete exhibition');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    modal.confirm({
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
            Delete Selected Exhibitions
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
            Are you sure you want to delete <strong>{selectedRows.length} selected exhibitions</strong>?
          </p>
          <p style={{ 
            color: '#667085',
            fontSize: '14px',
            lineHeight: '20px',
            marginBottom: 0 
          }}>
            This action cannot be undone and will permanently delete all associated data for these exhibitions.
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
            onClick={async () => {
              try {
                setDeleteLoading(true);
                await Promise.all(
                  selectedRows.map(record => 
                    dispatch(deleteExhibition(record._id || record.id)).unwrap()
                  )
                );
                message.success(`Successfully deleted ${selectedRows.length} exhibitions`);
                setSelectedRows([]);
              } catch (error: any) {
                message.error(error.message || 'Failed to delete some exhibitions');
              } finally {
                setDeleteLoading(false);
                Modal.destroyAll();
              }
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
            Delete All
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

  const handleStatusChange = async (record: Exhibition, newStatus: 'draft' | 'published' | 'completed') => {
    try {
      setStatusLoading(true);
      const id = record._id || record.id;
      await exhibitionService.updateExhibition(id, {
        status: newStatus
      });
      
      // Update both local state and Redux store
      const updatedExhibitions = exhibitions.map(item => 
        (item._id || item.id) === id
          ? { ...item, status: newStatus }
          : item
      );
      
      // Dispatch to Redux store using the proper action
      dispatch(fetchExhibitions.fulfilled(updatedExhibitions, '', undefined));
      message.success('Status updated successfully');
    } catch (error) {
      message.error('Failed to update status');
      // Refresh the list in case of error
      dispatch(fetchExhibitions());
    } finally {
      setStatusLoading(false);
    }
  };

  const handleActiveStatusChange = async (record: Exhibition, newIsActive: boolean) => {
    try {
      setStatusLoading(true);
      const id = record._id || record.id;
      await exhibitionService.updateExhibition(id, {
        isActive: newIsActive
      });
      
      // Update both local state and Redux store
      const updatedExhibitions = exhibitions.map(item => 
        (item._id || item.id) === id
          ? { ...item, isActive: newIsActive }
          : item
      );
      
      // Dispatch to Redux store using the proper action
      dispatch(fetchExhibitions.fulfilled(updatedExhibitions, '', undefined));
      message.success(`Exhibition ${newIsActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      message.error('Failed to update active status');
      // Refresh the list in case of error
      dispatch(fetchExhibitions());
    } finally {
      setStatusLoading(false);
    }
  };

  const handleNavigation = (record: Exhibition, action: string) => {
    const id = record._id || record.id;
    
    if (action === '/layout') {
      // For layout, use the full path with subpath
      navigate(getExhibitionUrl(record, 'layout'), { state: { exhibitionId: id } });
    } else {
      // For others, use the utility function
      navigate(getExhibitionUrl(record) + action, {
        state: { exhibitionId: id }
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return '#52c41a'; // Green
      case 'draft':
        return '#faad14'; // Gold
      case 'completed':
        return '#1890ff'; // Blue
      default:
        return '#d9d9d9';
    }
  };

  const getStatusBadge = (status: string, isActive: boolean) => {
    const color = getStatusColor(status);
    return (
      <Space size={4} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <Tag
          color={color}
          style={{
            textTransform: 'capitalize',
            minWidth: '80px',
            textAlign: 'center',
            margin: 0
          }}
        >
          {status}
        </Tag>
        {!isActive && (
          <Tag
            color="red"
            style={{
              margin: 0
            }}
          >
            Inactive
          </Tag>
        )}
      </Space>
    );
  };

  const getExhibitionProgress = (exhibition: Exhibition) => {
    const id = exhibition._id || exhibition.id;
    const realProgressData = progressData[id];
    
    // Use real progress data if available
    if (realProgressData?.progress?.combinedProgress !== undefined) {
      return realProgressData.progress.combinedProgress;
    }
    
    // Fallback to stall booking progress if available
    if (realProgressData?.progress?.stallBookingProgress !== undefined) {
      return realProgressData.progress.stallBookingProgress;
    }
    
    // Use exhibition's own progress data if available
    if (exhibition.progress?.combinedProgress !== undefined) {
      return exhibition.progress.combinedProgress;
    }
    
    // Fallback to stall booking progress if available
    if (exhibition.progress?.stallBookingProgress !== undefined) {
      return exhibition.progress.stallBookingProgress;
    }
    
    // Final fallback to time-based progress (old behavior)
    const now = new Date();
    const start = new Date(exhibition.startDate);
    const end = new Date(exhibition.endDate);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const current = now.getTime() - start.getTime();
    return Math.round((current / total) * 100);
  };

  const showDeleteConfirm = (record: Exhibition) => {
    modal.confirm({
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
            Delete Exhibition
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
            Are you sure you want to delete <strong>{record.name}</strong>?
          </p>
          <p style={{ 
            color: '#667085',
            fontSize: '14px',
            lineHeight: '20px',
            marginBottom: 0 
          }}>
            This action cannot be undone and will permanently delete all associated data.
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
              handleDelete(record);
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

  const getActionMenu = (record: Exhibition): MenuProps['items'] => [
    {
      key: 'view',
      label: 'View Details',
      icon: <EyeOutlined />,
      onClick: () => handleNavigation(record, '')
    },
    {
      key: 'edit',
      label: 'Edit Exhibition',
      icon: <EditOutlined />,
      onClick: () => handleNavigation(record, '/edit')
    },
    {
      key: 'layout',
      label: 'Manage Layout',
      icon: <LayoutOutlined />,
      onClick: () => handleNavigation(record, '/layout')
    },
    {
      type: 'divider' as const
    },
    ...(record.status === 'published' ? [
      {
        key: 'public-view',
        label: 'Public View',
        icon: <EyeOutlined />,
        onClick: () => window.open(getPublicExhibitionUrl(record), '_blank')
      },
      {
        type: 'divider' as const
      }
    ] : []),
    {
      key: 'status',
      label: 'Change Status',
      icon: <FilterOutlined />,
      children: [
        {
          key: 'draft',
          label: (
            <Space>
              <Tag color="#faad14" style={{ margin: 0 }}>Draft</Tag>
              <span>Set as Draft</span>
            </Space>
          ),
          icon: <FileTextOutlined />,
          onClick: () => handleStatusChange(record, 'draft'),
          disabled: record.status === 'draft' || statusLoading
        },
        {
          key: 'published',
          label: (
            <Space>
              <Tag color="#52c41a" style={{ margin: 0 }}>Published</Tag>
              <span>Publish</span>
            </Space>
          ),
          icon: <CheckCircleOutlined />,
          onClick: () => handleStatusChange(record, 'published'),
          disabled: record.status === 'published' || statusLoading
        },
        {
          key: 'completed',
          label: (
            <Space>
              <Tag color="#1890ff" style={{ margin: 0 }}>Completed</Tag>
              <span>Mark as Completed</span>
            </Space>
          ),
          icon: <ClockCircleOutlined />,
          onClick: () => handleStatusChange(record, 'completed'),
          disabled: record.status === 'completed' || statusLoading
        }
      ]
    },
    {
      key: 'active-status',
      label: (
        <Space>
          {record.isActive ? (
            <Tag color="red" style={{ margin: 0 }}>Deactivate</Tag>
          ) : (
            <Tag color="#52c41a" style={{ margin: 0 }}>Activate</Tag>
          )}
          <span>{record.isActive ? 'Deactivate' : 'Activate'}</span>
        </Space>
      ),
      icon: <PoweroffOutlined />,
      onClick: () => handleActiveStatusChange(record, !record.isActive),
      disabled: statusLoading
    },
    {
      type: 'divider' as const
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => showDeleteConfirm(record)
    }
  ];

  const filteredExhibitions = useMemo(() => {
    return exhibitions.filter(exhibition => {
      // Search filter
      if (filters.search && !exhibition.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(exhibition.status)) {
        return false;
      }

      // Active status filter
      if (filters.activeStatus !== null && exhibition.isActive !== filters.activeStatus) {
        return false;
      }

      // Date range filter
      if (filters.dateRange) {
        const [start, end] = filters.dateRange;
        const exhibitionStart = new Date(exhibition.startDate);
        const exhibitionEnd = new Date(exhibition.endDate);
        if (exhibitionStart < new Date(start) || exhibitionEnd > new Date(end)) {
          return false;
        }
      }

      // View mode filter
      switch (viewMode) {
        case 'active':
          return exhibition.status === 'published';
        case 'upcoming':
          return new Date(exhibition.startDate) > new Date();
        case 'completed':
          return exhibition.status === 'completed';
        default:
          return true;
      }
    });
  }, [exhibitions, filters, viewMode]);

  const columns: TableProps<Exhibition>['columns'] = [
    {
      title: 'Exhibition Details',
      key: 'details',
      render: (_, record) => (
        <Text strong style={{ fontSize: '16px', cursor: 'pointer' }} onClick={() => handleNavigation(record, '')}>
          {record.name}
        </Text>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 180,
      align: 'center' as const,
      render: (_, record) => getStatusBadge(record.status, record.isActive),
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Published', value: 'published' },
        { text: 'Completed', value: 'completed' }
      ],
      onFilter: (value: any, record: Exhibition) => record.status === value
    },
    {
      title: 'Start Date',
      key: 'startDate',
      width: 130,
      render: (_, record) => (
        <Text>
          {dayjs(record.startDate).format('MMM D, YYYY')}
        </Text>
      ),
    },
    {
      title: 'End Date',
      key: 'endDate',
      width: 130,
      render: (_, record) => (
        <Text>
          {dayjs(record.endDate).format('MMM D, YYYY')}
        </Text>
      ),
    },
    {
      title: 'Create Date',
      key: 'createdAt',
      width: 130,
      render: (_, record) => (
        <Text>
          {dayjs(record.createdAt).format('MMM D, YYYY')}
        </Text>
      ),
    },
    {
      title: (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Progress</span>
          <Tooltip title="Refresh all progress data">
            <Button 
              type="text" 
              size="small" 
              icon={<ReloadOutlined />}
              loading={progressLoading}
              onClick={refreshProgressData}
              style={{ padding: '2px' }}
            />
          </Tooltip>
        </div>
      ),
      key: 'progress',
      width: 250,
      render: (_, record) => {
        const progress = getExhibitionProgress(record);
        const id = record._id || record.id;
        const realStats = progressData[id]?.stats;
        const realProgress = progressData[id]?.progress;
        
        // Determine progress type and color
        let progressType: 'success' | 'active' | 'exception' = 'active';
        let strokeColor = '#1890ff';
        
        if (record.status === 'completed') {
          progressType = 'success';
          strokeColor = '#52c41a';
        } else if (progress === 100) {
          strokeColor = '#faad14'; // Orange for fully booked but not completed
        }

        // Create tooltip content with real data
        const tooltipContent = realStats ? (
          <div>
            <div><strong>Real-time Stall Booking:</strong></div>
            <div>• Total Stalls: {realStats.totalStalls}</div>
            <div>• Booked Stalls: {realStats.bookedStalls}</div>
            <div>• Available Stalls: {realStats.availableStalls}</div>
            <div>• Booking Rate: {realStats.bookingRate}%</div>
            {realProgress && (
              <>
                <div style={{ marginTop: '8px' }}><strong>Progress Breakdown:</strong></div>
                <div>• Stall Booking: {realProgress.stallBookingProgress}%</div>
                <div>• Timeline: {realProgress.timeProgress}%</div>
                <div>• Combined: {realProgress.combinedProgress}%</div>
              </>
            )}
          </div>
        ) : (
          <div>
            <div>Progress: {progress}%</div>
            <div>Based on timeline calculation</div>
            <div style={{ color: '#faad14', marginTop: '4px' }}>
              ⚠️ Real-time data not available
            </div>
          </div>
        );

        return (
          <div>
            <Tooltip title={tooltipContent} placement="topLeft">
              <Progress 
                percent={progress} 
                size="small"
                status={progressType}
                strokeColor={strokeColor}
                format={(percent) => `${percent}%`}
              />
            </Tooltip>
            {realStats ? (
              <div style={{ fontSize: '12px', color: '#52c41a', marginTop: '4px' }}>
                <CheckCircleOutlined style={{ marginRight: '4px' }} />
                {realStats.bookedStalls}/{realStats.totalStalls} stalls booked
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: '#faad14', marginTop: '4px' }}>
                <ClockCircleOutlined style={{ marginRight: '4px' }} />
                Timeline-based progress
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          {hasPermission('exhibitions_view') && (
            <Tooltip title="View Details">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => handleNavigation(record, '')}
              />
            </Tooltip>
          )}
          {hasPermission('exhibitions_edit') && (
            <Tooltip title="Edit Exhibition">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleNavigation(record, '/edit')}
              />
            </Tooltip>
          )}
          {hasPermission('exhibitions_delete') && (
            <Dropdown
              menu={{ items: getActionMenu(record) }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0 }}>Exhibitions</Title>
              <Text type="secondary">Manage your exhibition spaces and layouts</Text>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/exhibition/create')}
              size="large"
            >
              Create Exhibition
            </Button>
          </Col>
        </Row>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Card>
            <Statistic
              title="Total Exhibitions"
              value={stats.total}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={5}>
          <Card>
            <Statistic
              title="Published Exhibitions"
              value={stats.active}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={5}>
          <Card>
            <Statistic
              title="Upcoming Exhibitions"
              value={stats.upcoming}
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={5}>
          <Card>
            <Statistic
              title="Completed Exhibitions"
              value={stats.completed}
              prefix={<CheckCircleOutlined style={{ color: '#8c8c8c' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6} lg={5}>
          <Card>
            <Statistic
              title="Active Status"
              value={stats.activeCount}
              prefix={<PoweroffOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters Section */}
      <Card 
        className="info-card"
        style={{ marginBottom: '16px' }}
        styles={{ body: { padding: '20px' } }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <Space size="middle" wrap>
                <Input
                  placeholder="Search exhibitions"
                  prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
                  style={{ width: '250px' }}
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  allowClear
                />
                <Select
                  mode="multiple"
                  placeholder="Filter by status"
                  style={{ minWidth: '200px' }}
                  value={filters.status}
                  onChange={status => setFilters(prev => ({ ...prev, status }))}
                  options={[
                    { label: 'Draft', value: 'draft' },
                    { label: 'Published', value: 'published' },
                    { label: 'Completed', value: 'completed' }
                  ]}
                />
                <Select
                  placeholder="Active Status"
                  style={{ width: '150px' }}
                  value={filters.activeStatus}
                  onChange={value => setFilters(prev => ({ ...prev, activeStatus: value }))}
                  allowClear
                >
                  <Select.Option value={true}>Active</Select.Option>
                  <Select.Option value={false}>Inactive</Select.Option>
                </Select>
                <RangePicker
                  onChange={(dates) => setFilters(prev => ({
                    ...prev,
                    dateRange: dates ? [dates[0]?.toISOString() || '', dates[1]?.toISOString() || ''] : null
                  }))}
                />
              </Space>
            </Col>
            <Col>
              <Segmented
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Active', value: 'active' },
                  { label: 'Upcoming', value: 'upcoming' },
                  { label: 'Completed', value: 'completed' }
                ]}
                value={viewMode}
                onChange={(value) => setViewMode(value as any)}
              />
            </Col>
          </Row>
          {selectedRows.length > 0 && (
            <Row>
              <Space>
                <Text>Selected {selectedRows.length} items</Text>
                <Button danger onClick={handleBulkDelete}>
                  Delete Selected
                </Button>
              </Space>
            </Row>
          )}
        </Space>
      </Card>

      {/* Table Section */}
      <Card 
        className="info-card"
        styles={{ 
          body: { padding: 0 }
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredExhibitions.map(exhibition => ({
            ...exhibition,
            key: exhibition._id || exhibition.id
          }))}
          rowKey={record => record._id || record.id}
          loading={exhibitionsLoading || deleteLoading || statusLoading || progressLoading}
          rowSelection={{
            selectedRowKeys: selectedRows.map(row => row._id || row.id),
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
            selections: [
              Table.SELECTION_ALL,
              Table.SELECTION_NONE,
            ]
          }}
          footer={() => selectedRows.length > 0 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 0'
            }}>
              <Text>
                Selected <strong>{selectedRows.length}</strong> {selectedRows.length === 1 ? 'exhibition' : 'exhibitions'}
              </Text>
              <Button
                danger
                onClick={handleBulkDelete}
                icon={<DeleteOutlined />}
                loading={deleteLoading}
              >
                Delete Selected
              </Button>
            </div>
          )}
          scroll={{ x: 1500 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            style: { marginTop: '16px' },
            onChange: (page, pageSize) => {
              setPagination(prev => ({
                ...prev,
                current: page,
                pageSize: pageSize
              }));
            }
          }}
        />
      </Card>
    </div>
  );
};

export default ExhibitionList; 