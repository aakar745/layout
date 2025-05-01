import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Space, Button, Input, Typography, Card, Row, Col, Avatar, 
  Dropdown, Badge, Tooltip, Tabs, Statistic, Modal, Divider, Menu,
  App
} from 'antd';
import { 
  UserAddOutlined, SearchOutlined, EditOutlined, DeleteOutlined, 
  MoreOutlined, FilterOutlined, EyeOutlined, DownloadOutlined,
  UserOutlined, CheckCircleFilled, ClockCircleOutlined, ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchUsers, removeUser, setSelectedUser } from '../../store/slices/userSlice';
import { User } from '../../services/user.service';
import ViewUserModal from './ViewUserModal';
import EditUserModal from './EditUserModal';
import NewUserModal from './NewUserModal';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

// Extended User interface for UI components
interface ExtendedUser extends User {
  avatar?: string;
  lastLogin?: string;
}

export default function UsersPage() {
  const { message, notification } = App.useApp();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get users from Redux store
  const { users, loading, error, selectedUser } = useSelector((state: RootState) => state.user);
  
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newModalVisible, setNewModalVisible] = useState(false);

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: error,
      });
    }
  }, [error, notification]);

  // Close modals when selected user is null
  useEffect(() => {
    if (!selectedUser) {
      setViewModalVisible(false);
      setEditModalVisible(false);
    }
  }, [selectedUser]);

  const showDeleteConfirm = (userId: string, userName: string) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete ${userName}'s account. This action cannot be undone.`,
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        dispatch(removeUser(userId))
          .unwrap()
          .then(() => {
            message.success(`${userName} has been deleted successfully.`);
          })
          .catch((err: any) => {
            message.error(`Failed to delete user: ${err}`);
          });
      },
    });
  };

  const handleViewUser = (user: User) => {
    dispatch(setSelectedUser(user));
    setViewModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    dispatch(setSelectedUser(user));
    setEditModalVisible(true);
  };

  const handleAddUser = () => {
    setNewModalVisible(true);
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: ExtendedUser) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="large" />
          <Space direction="vertical" size={0}>
            <Text strong>{record.name || record.username}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: any) => {
        const roleName = getRoleName(role);
        
        let color = roleName.toLowerCase() === 'admin' || roleName.toLowerCase() === 'administrator' ? '#1677ff' : 
                  roleName.toLowerCase() === 'manager' ? '#52c41a' : '#faad14';
        
        return (
          <Tag color={color} style={{ fontWeight: 500, borderRadius: '4px' }}>
            {roleName.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Manager', value: 'manager' },
        { text: 'Agent', value: 'agent' },
      ],
      onFilter: (value: React.Key | boolean, record: User) => {
        const roleName = getRoleName(record.role).toLowerCase();
        return roleName.indexOf((value as string).toLowerCase()) === 0;
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: User) => (
        <Space>
          {record.isActive ? (
            <Badge status="success" text={<Text style={{ color: '#52c41a' }}>Active</Text>} />
          ) : (
            <Badge status="default" text={<Text type="secondary">Inactive</Text>} />
          )}
        </Space>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: React.Key | boolean, record: User) => record.isActive === value,
    },
    {
      title: 'Last Active',
      key: 'lastLogin',
      render: (_: any, record: ExtendedUser) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary">{record.lastLogin || 'Never'}</Text>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="small">
          <Tooltip title="View details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              size="small" 
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Edit user">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              size="small" 
              onClick={() => handleEditUser(record)}
            />
          </Tooltip>
          <Tooltip title="Delete user">
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
              onClick={() => showDeleteConfirm(record._id, record.name || record.username)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getStatusFromUser = (user: User): 'active' | 'inactive' => {
    return user.isActive ? 'active' : 'inactive';
  };

  const filteredData = users.filter((item) =>
    (activeTab === 'all' || 
    (activeTab === 'active' && getStatusFromUser(item) === 'active') ||
    (activeTab === 'inactive' && getStatusFromUser(item) === 'inactive')) &&
    (Object.values(item).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(searchText.toLowerCase())
    ))
  );

  const getRoleName = (role: any): string => {
    return typeof role === 'string' ? role : 
           (role && typeof role === 'object' && role.name) ? role.name : 'Unknown';
  }

  const roleStats = {
    admin: users.filter(user => {
      const roleName = getRoleName(user.role).toLowerCase();
      return roleName === 'admin' || roleName === 'administrator';
    }).length,
    manager: users.filter(user => {
      const roleName = getRoleName(user.role).toLowerCase();
      return roleName === 'manager';
    }).length,
    agent: users.filter(user => {
      const roleName = getRoleName(user.role).toLowerCase();
      return roleName === 'agent';
    }).length,
  };

  const statusStats = {
    active: users.filter(user => user.isActive).length,
    inactive: users.filter(user => !user.isActive).length,
  };

  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>User Management</Title>
        <Paragraph>Manage user accounts, permissions, and access control.</Paragraph>
      </div>

      {/* User statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
            <Statistic 
              title="Total Users" 
              value={users.length} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#1677ff' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
            <Statistic 
              title="Active Users" 
              value={statusStats.active} 
              prefix={<CheckCircleFilled />} 
              valueStyle={{ color: '#52c41a' }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
            <Statistic 
              title="Admin Users" 
              value={roleStats.admin} 
              prefix={<UserOutlined />} 
              valueStyle={{ color: '#faad14' }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters & Actions */}
      <Card 
        style={{ 
          marginBottom: 24,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
        }}
      >
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} md={12}>
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              size="middle"
            />
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Tooltip title="Refresh data">
                <Button 
                  icon={loading ? <LoadingOutlined /> : <SearchOutlined />} 
                  onClick={() => dispatch(fetchUsers())}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Tooltip>
              <Button 
                type="primary" 
                icon={<UserAddOutlined />}
                onClick={handleAddUser}
              >
                Add User
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tabs & Table */}
      <Card 
        style={{ 
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)'
        }}
      >
        <Tabs 
          defaultActiveKey="all"
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane tab={`All Users (${users.length})`} key="all" />
          <TabPane tab={`Active (${statusStats.active})`} key="active" />
          <TabPane tab={`Inactive (${statusStats.inactive})`} key="inactive" />
        </Tabs>

        <Table 
          columns={columns} 
          dataSource={filteredData}
          rowKey="_id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
          }}
          loading={loading}
        />
      </Card>

      {/* View User Modal */}
      <ViewUserModal
        user={users.find(u => u._id === selectedUser?._id) || null}
        visible={viewModalVisible}
        onClose={() => dispatch(setSelectedUser(null))}
      />

      {/* Edit User Modal */}
      <EditUserModal
        user={users.find(u => u._id === selectedUser?._id) || null}
        visible={editModalVisible}
        onClose={() => dispatch(setSelectedUser(null))}
        onSuccess={() => dispatch(fetchUsers())}
      />

      {/* New User Modal */}
      <NewUserModal
        visible={newModalVisible}
        onClose={() => setNewModalVisible(false)}
        onSuccess={() => dispatch(fetchUsers())}
      />
    </div>
  );
} 