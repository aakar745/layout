import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
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

  const getActiveMenuKey = () => {
    const path = location.pathname;
    if (path.includes('/exhibitor/dashboard')) return 'dashboard';
    if (path.includes('/exhibitor/bookings')) return 'bookings';
    if (path.includes('/exhibitor/profile')) return 'profile';
    if (path.includes('/exhibitions')) return 'exhibitions';
    if (path.includes('/exhibitor/support')) return 'help';
    return 'dashboard';
  };

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
      label: 'My Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/exhibitor/profile'),
    },
    {
      key: 'bookings',
      label: 'My Bookings',
      icon: <ShopOutlined />,
      onClick: () => navigate('/exhibitor/bookings'),
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
    if (path === 'dashboard') return 'Dashboard';
    if (path.startsWith('bookings')) return path.includes('/') ? 'Booking Details' : 'My Bookings';
    if (path === 'profile') return 'My Profile';
    if (path === 'support') return 'Help & Support';
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
          overflow: 'hidden',
        }}
        width={256}
        collapsedWidth={80}
      >
        <div style={{ 
          height: 65,
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
          selectedKeys={[getActiveMenuKey()]}
          items={menuItems}
          style={{
            border: 'none',
            padding: collapsed ? '16px 0' : '16px 8px',
            background: 'transparent',
          }}
          className="main-nav-menu"
          inlineCollapsed={collapsed}
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
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space align="center" style={{ cursor: 'pointer' }}>
              <Avatar 
                size="small"
                style={{ 
                  backgroundColor: '#5046e5',
                }}
              >
                {exhibitor?.companyName?.charAt(0).toUpperCase() || 'E'}
              </Avatar>
              <span style={{ 
                maxWidth: 120,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {exhibitor?.companyName || 'Exhibitor'}
              </span>
            </Space>
          </Dropdown>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          minHeight: 280, 
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default ExhibitorLayout; 