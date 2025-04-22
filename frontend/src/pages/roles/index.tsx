import React, { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleFilled, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Table, Card, Typography, Tag, Avatar, Switch, Space, Modal, Tooltip, Badge, Input, Row, Col } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

interface Role {
  id: number;
  name: string;
  description: string;
  userCount: number;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
}

const DUMMY_ROLES: Role[] = [
  {
    id: 1,
    name: 'Administrator',
    description: 'Full access to all resources',
    userCount: 3,
    permissions: { read: true, write: true, delete: true },
  },
  {
    id: 2,
    name: 'Editor',
    description: 'Can edit and publish content',
    userCount: 8,
    permissions: { read: true, write: true, delete: false },
  },
  {
    id: 3,
    name: 'Viewer',
    description: 'Can view content only',
    userCount: 15,
    permissions: { read: true, write: false, delete: false },
  },
  {
    id: 4,
    name: 'Analyst',
    description: 'Can view and analyze data',
    userCount: 7,
    permissions: { read: true, write: false, delete: false },
  },
];

function PermissionIcon({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <CheckCircleFilled className="text-success" style={{ color: '#52c41a', fontSize: 16 }} />
  ) : (
    <CloseCircleFilled className="text-danger" style={{ color: '#f5222d', fontSize: 16 }} />
  );
}

export default function RolesPage() {
  const [searchText, setSearchText] = useState('');
  
  const showDeleteConfirm = (roleName: string) => {
    confirm({
      title: 'Are you sure you want to delete this role?',
      icon: <ExclamationCircleOutlined />,
      content: `This will permanently delete the ${roleName} role. This action cannot be undone.`,
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        console.log('Deleting role:', roleName);
      },
    });
  };

  const columns = [
    {
      title: 'Role',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Role) => (
        <Space>
          <Avatar 
            style={{ 
              backgroundColor: record.id === 1 ? '#1677ff' : 
                              record.id === 2 ? '#52c41a' : 
                              record.id === 3 ? '#faad14' : '#f5222d'
            }}
          >
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: 'Users',
      dataIndex: 'userCount',
      key: 'userCount',
      render: (count: number) => (
        <Badge count={count} color="#1677ff" showZero />
      ),
    },
    {
      title: 'Read',
      dataIndex: ['permissions', 'read'],
      key: 'read',
      align: 'center' as const,
      render: (allowed: boolean) => <PermissionIcon allowed={allowed} />,
    },
    {
      title: 'Write',
      dataIndex: ['permissions', 'write'],
      key: 'write',
      align: 'center' as const,
      render: (allowed: boolean) => <PermissionIcon allowed={allowed} />,
    },
    {
      title: 'Delete',
      dataIndex: ['permissions', 'delete'],
      key: 'delete',
      align: 'center' as const,
      render: (allowed: boolean) => <PermissionIcon allowed={allowed} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: Role) => (
        <Space>
          <Tooltip title="Edit role">
            <Button 
              type="primary" 
              shape="circle" 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => console.log('Edit role:', record.name)} 
            />
          </Tooltip>
          <Tooltip title="Delete role">
            <Button 
              danger 
              shape="circle" 
              icon={<DeleteOutlined />} 
              size="small"
              onClick={() => showDeleteConfirm(record.name)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const filteredRoles = DUMMY_ROLES.filter(
    role => role.name.toLowerCase().includes(searchText.toLowerCase()) || 
           role.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '12px 0' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>Roles & Permissions</Title>
        <Paragraph>Manage role-based access control and permissions for your users.</Paragraph>
      </div>

      <Card 
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
      >
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={16}>
            <Input 
              placeholder="Search roles..." 
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<Text type="secondary" style={{ fontSize: 16 }}>🔍</Text>}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              style={{ borderRadius: 6 }}
            >
              Add Role
            </Button>
          </Col>
        </Row>

        <Table 
          columns={columns} 
          dataSource={filteredRoles}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `Showing ${range[0]}-${range[1]} of ${total} roles`,
          }}
          style={{ marginTop: 8 }}
        />
      </Card>

      <Card 
        title={<Title level={4} style={{ margin: 0 }}>Role Management Tips</Title>}
        style={{ marginTop: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
      >
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Space direction="vertical" style={{ flex: 1, minWidth: 250 }}>
            <Title level={5}>Best Practices</Title>
            <ul style={{ paddingLeft: 20 }}>
              <li><Text>Follow the principle of least privilege</Text></li>
              <li><Text>Regularly audit user roles</Text></li>
              <li><Text>Document role responsibilities</Text></li>
            </ul>
          </Space>
          <Space direction="vertical" style={{ flex: 1, minWidth: 250 }}>
            <Title level={5}>Role Inheritance</Title>
            <Paragraph>
              Higher-level roles automatically include permissions from lower-level roles to ensure consistency.
            </Paragraph>
          </Space>
        </div>
      </Card>
    </div>
  );
} 