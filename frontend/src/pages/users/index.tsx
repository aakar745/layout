import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Space, Button, Input, Typography, Card, Row, Col, Avatar, 
  Dropdown, Badge, Tooltip, Tabs, Statistic, Modal, Divider, Menu,
  message
} from 'antd';
import { 
  UserAddOutlined, SearchOutlined, EditOutlined, DeleteOutlined, 
  MoreOutlined, FilterOutlined, EyeOutlined, DownloadOutlined,
  UserOutlined, CheckCircleFilled, ClockCircleOutlined, ExclamationCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { getAllUsers, deleteUser, User, getRoleName } from '../../services/user.service';
import ViewUserModal from './ViewUserModal';
import EditUserModal from './EditUserModal';
import NewUserModal from './NewUserModal';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

export default function UsersPage() {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newModalVisible, setNewModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const showDeleteConfirm = (userId: string, userName: string) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete ${userName}'s account. This action cannot be undone.`,
      okText: 'Yes, delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteUser(userId);
          message.success(`${userName} has been deleted successfully.`);
          fetchUsers(); // Refresh the user list
        } catch (error) {
          console.error('Error deleting user:', error);
          message.error('Failed to delete user. Please try again.');
        }
      },
    });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewModalVisible(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const handleAddUser = () => {
    setNewModalVisible(true);
  };

  const columns = [
    {
      title: 'User',
      key: 'user',
      render: (_: any, record: User) => (
        <Space>
          <Avatar src={record.avatar} icon={!record.avatar && <UserOutlined />} size="large" />
          <Space direction="vertical" size={0}>
            <Text strong>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
          </Space>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department: string) => <Text>{department}</Text>,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: any) => {
        const roleName = typeof role === 'string' ? role : 
                       (role && typeof role === 'object' && role.name) ? role.name : 'Unknown';
        
        let color = roleName.toLowerCase() === 'admin' ? '#1677ff' : 
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
        const role = record.role;
        const roleName = typeof role === 'string' ? role.toLowerCase() :
                       (role && typeof role === 'object' && role.name) ? role.name.toLowerCase() : '';
        
        return roleName.indexOf((value as string).toLowerCase()) === 0;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: 'active' | 'inactive') => (
        <Space>
          {status === 'active' ? (
            <Badge status="success" text={<Text style={{ color: '#52c41a' }}>Active</Text>} />
          ) : (
            <Badge status="default" text={<Text type="secondary">Inactive</Text>} />
          )}
        </Space>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value: React.Key | boolean, record: User) => record.status === value,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin: string) => (
        <Space>
          <ClockCircleOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary">{lastLogin}</Text>
        </Space>
      ),
      sorter: (a: User, b: User) => {
        const dateA = new Date(a.lastLogin || '');
        const dateB = new Date(b.lastLogin || '');
        return dateA.getTime() - dateB.getTime();
      },
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
              onClick={() => showDeleteConfirm(record.id, record.name)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredData = users.filter((item) =>
    (activeTab === 'all' || 
    (activeTab === 'active' && item.status === 'active') ||
    (activeTab === 'inactive' && item.status === 'inactive')) &&
    (Object.values(item).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(searchText.toLowerCase())
    ))
  );

  const roleStats = {
    admin: users.filter(user => {
      const role = user.role;
      const roleName = typeof role === 'string' ? role.toLowerCase() :
                     (role && typeof role === 'object' && role.name) ? role.name.toLowerCase() : '';
      return roleName === 'admin';
    }).length,
    manager: users.filter(user => {
      const role = user.role;
      const roleName = typeof role === 'string' ? role.toLowerCase() :
                     (role && typeof role === 'object' && role.name) ? role.name.toLowerCase() : '';
      return roleName === 'manager';
    }).length,
    agent: users.filter(user => {
      const role = user.role;
      const roleName = typeof role === 'string' ? role.toLowerCase() :
                     (role && typeof role === 'object' && role.name) ? role.name.toLowerCase() : '';
      return roleName === 'agent';
    }).length,
  };

  const statusStats = {
    active: users.filter(user => user.status === 'active').length,
    inactive: users.filter(user => user.status === 'inactive').length,
  };

  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>User Management</Title>
        <Paragraph>Manage user accounts, permissions, and access control.</Paragraph>
      </div>

      {/* User Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input 
          placeholder="Search users..." 
          prefix={<SearchOutlined />} 
          style={{ width: 250 }}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <Button 
          type="primary" 
          icon={<UserAddOutlined />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
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
          <Col xs={24} md={8}>
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
              onChange={e => setSearchText(e.target.value)}
              allowClear
              size="middle"
            />
          </Col>
          <Col xs={24} md={16} style={{ textAlign: 'right' }}>
            <Space wrap>
              <Tooltip title="Refresh data">
                <Button 
                  icon={loading ? <LoadingOutlined /> : <SearchOutlined />} 
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  Refresh
                </Button>
              </Tooltip>
              <Button icon={<DownloadOutlined />}>Export</Button>
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
          rowKey="id"
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
        user={selectedUser}
        visible={viewModalVisible}
        onClose={() => setViewModalVisible(false)}
      />

      {/* Edit User Modal */}
      <EditUserModal
        user={selectedUser}
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSuccess={fetchUsers}
      />

      {/* New User Modal */}
      <NewUserModal
        visible={newModalVisible}
        onClose={() => setNewModalVisible(false)}
        onSuccess={fetchUsers}
      />
    </div>
  );
} 