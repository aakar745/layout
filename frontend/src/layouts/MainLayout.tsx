import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  TableOutlined,
  TeamOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';
import type { MenuProps } from 'antd';
import '../styles/menu.css';
import NotificationBell from '../pages/notifications/components/NotificationBell';
import { fetchSettings } from '../store/slices/settingsSlice';
import styled from '@emotion/styled';
import api from '../services/api';

const { Header, Sider, Content } = Layout;

// Styled components for the logo
const LogoContainer = styled.div`
  height: 65px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #E5E7EB;
  transition: all 0.3s;
`;

const LogoBackground = styled.div`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
`;

const LogoImage = styled.img`
  height: auto;
  width: 100%;
  max-width: 150px;
  max-height: auto;
  object-fit: contain;
`;

const BrandText = styled.span`
  margin-left: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  transition: opacity 0.3s, margin-left 0.3s;
`;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const { settings } = useSelector((state: RootState) => state.settings);
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Update logo URL when settings are loaded
  useEffect(() => {
    // Check if we have a cached logo URL first
    const cachedLogoUrl = localStorage.getItem('cachedLogoUrl');
    const logoTimestamp = localStorage.getItem('logoTimestamp');
    const now = new Date().getTime();
    
    // Use cached logo if it exists and is less than 1 hour old
    if (cachedLogoUrl && logoTimestamp && (now - parseInt(logoTimestamp)) < 3600000) {
      setLogoUrl(cachedLogoUrl);
    } else if (settings?.logo) {
      // Set the logo URL directly first for faster rendering
      const directLogoUrl = `${api.defaults.baseURL}/public/logo`;
      setLogoUrl(directLogoUrl);
      
      // Cache the logo URL
      localStorage.setItem('cachedLogoUrl', directLogoUrl);
      localStorage.setItem('logoTimestamp', now.toString());
      
      // Preload the image
      const img = new Image();
      img.src = directLogoUrl;
    }
  }, [settings]);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ fontSize: '16px' }} />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'exhibition',
      icon: <ShopOutlined style={{ fontSize: '16px' }} />,
      label: 'Exhibitions',
      onClick: () => navigate('/exhibition'),
    },
    {
      key: 'stall',
      icon: <TableOutlined style={{ fontSize: '16px' }} />,
      label: 'Stalls',
      children: [
        {
          key: 'stall-list',
          icon: <TableOutlined style={{ fontSize: '16px' }} />,
          label: 'Stall List',
          onClick: () => navigate('/stall/list'),
        },
        {
          key: 'stall-type',
          icon: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
          label: 'Stall Types',
          onClick: () => navigate('/stall-types'),
        }
      ],
    },
    {
      key: 'bookings',
      icon: <ShopOutlined style={{ fontSize: '16px' }} />,
      label: 'Stall Bookings',
      onClick: () => navigate('/bookings'),
    },
    {
      key: 'exhibitors',
      icon: <TeamOutlined />,
      label: 'Exhibitors',
      onClick: () => navigate('/exhibitors'),
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/index'),
    },
    {
      key: 'roles',
      icon: <SafetyCertificateOutlined />,
      label: 'Roles',
      onClick: () => navigate('/roles'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
  ];

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: () => navigate('/account'),
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings'),
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
        dispatch(logout());
        navigate('/login');
      },
    },
  ];

  const getCurrentPageTitle = () => {
    const path = location.pathname.substring(1);
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
        <LogoContainer>
          <LogoBackground>
            <LogoImage 
              src={logoUrl} 
              alt="Logo" 
              onError={() => setLogoUrl('/logo.png')}
            />
          </LogoBackground>
        </LogoContainer>
        
        <Menu
          mode="inline"
          selectedKeys={[location.pathname.substring(1) || 'dashboard']}
          items={menuItems}
          style={{
            border: 'none',
            padding: collapsed ? '16px 0' : '16px 0',
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
          <Space size={16}>
            <Button 
              type="text" 
              icon={<SearchOutlined />} 
              style={{ fontSize: 16 }}
            />
            <NotificationBell />
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ 
                    backgroundColor: '#7C3AED',
                    cursor: 'pointer',
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
                <span style={{ 
                  color: '#111827',
                  fontWeight: 500,
                }}>
                  {user?.username}
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

export default MainLayout; 