import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Badge } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  ShopOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { exhibitorLogout } from '../store/slices/exhibitorAuthSlice';
import { RootState } from '../store/store';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

const ExhibitorLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const exhibitor = useSelector((state: RootState) => state.exhibitorAuth.exhibitor);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/exhibitor/dashboard'),
    },
    {
      key: 'bookings',
      icon: <ShopOutlined />,
      label: 'My Bookings',
      onClick: () => navigate('/exhibitor/bookings'),
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/exhibitor/profile'),
    },
    {
      key: 'exhibitions',
      icon: <FileTextOutlined />,
      label: 'Exhibitions',
      onClick: () => navigate('/exhibitions'),
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'Help & Support',
      onClick: () => navigate('/exhibitor/support'),
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/exhibitor/profile'),
    },
    {
      key: 'divider',
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: () => {
        dispatch(exhibitorLogout());
        navigate('/');
      },
    },
  ];

  const getCurrentPageTitle = () => {
    const path = location.pathname.replace('/exhibitor/', '');
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          background: '#fff',
          borderRight: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
        width={256}
      >
        <div style={{ 
          height: 72,
          padding: '0 24px',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid #E5E7EB',
        }}>
          <img 
            src="/logo.svg" 
            alt="Logo" 
            style={{ 
              height: 32,
              width: 'auto',
            }} 
          />
          {!collapsed && (
            <span style={{ 
              marginLeft: 12,
              fontSize: 18,
              fontWeight: 600,
              color: '#1890ff',
              whiteSpace: 'nowrap',
            }}>
              Exhibitor Portal
            </span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname.split('/').pop() || 'dashboard']}
          items={menuItems}
          style={{
            border: 'none',
            padding: '16px 8px',
            background: 'transparent',
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 256, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 0 0 rgb(0 0 0 / 0.05)',
          zIndex: 99,
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 16 }}
            />
            <span style={{ 
              marginLeft: 24, 
              fontSize: 20, 
              fontWeight: 600,
              color: '#111827',
            }}>
              {getCurrentPageTitle()}
            </span>
          </div>
          <Space size={16}>
            <Badge count={3} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                style={{ fontSize: 16 }}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ 
                    backgroundColor: '#1890ff',
                    cursor: 'pointer',
                  }}
                >
                  {exhibitor?.companyName?.charAt(0).toUpperCase() || 'E'}
                </Avatar>
                <span style={{ 
                  color: '#111827',
                  fontWeight: 500,
                }}>
                  {exhibitor?.companyName || 'Exhibitor'}
                </span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content style={{ 
          margin: '24px',
          padding: '24px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ExhibitorLayout; 