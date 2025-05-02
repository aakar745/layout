import React, { useState, useEffect, useCallback } from 'react';
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
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, refreshUser } from '../store/slices/authSlice';
import { RootState, AppDispatch } from '../store/store';
import type { MenuProps } from 'antd';
import '../styles/menu.css';
import NotificationBell from '../pages/notifications/components/NotificationBell';
import { fetchSettings } from '../store/slices/settingsSlice';
import styled from '@emotion/styled';
import api from '../services/api';

// Import permission hook (based on the minified code we saw earlier)
// This hook should check if the current user has specific permissions
const usePermission = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const hasPermission = (permissionKey: string) => {
    if (!user || !user.role || !user.role.permissions) {
      console.log("[Permission Check] No user or missing role/permissions:", { user });
      return false;
    }
    
    const permissions = user.role.permissions;
    console.log(`[Permission Check] Checking ${permissionKey} against user permissions:`, permissions);
    
    // Direct match check
    if (permissions.includes(permissionKey)) {
      console.log(`[Permission Check] ${permissionKey}: true (exact match)`);
      return true;
    }
    
    // Wildcard check for admin/superuser
    if (
      permissions.includes('*') || 
      permissions.includes('all') || 
      permissions.includes('admin') || 
      permissions.includes('superadmin') || 
      permissions.includes('full_access') ||
      permissions.includes('manage_all')
    ) {
      console.log(`[Permission Check] ${permissionKey}: true (wildcard match)`);
      return true;
    }
    
    // Alternative pattern matching
    const parts = permissionKey.split('_');
    if (parts.length === 2) {
      const resource = parts[0];
      const action = parts[1];
      
      // Handle the mixed permission formats
      const alternatePatterns = [
        `${resource}.*`,
        `*.${action}`,
        `view_${resource}`,
        `${resource}_view`,
        `${resource}s_${action}`,
        `${action}_${resource}`,
        // Additional common variations
        `${resource}`,
        `${action}`,
        // Singular/plural variations
        resource.endsWith('s') ? `${resource.slice(0, -1)}_${action}` : `${resource}s_${action}`,
        // Add support for view/edit/create format
        `${resource}_${action === 'view' ? 'read' : action}`,
        `${action === 'view' ? 'read' : action}_${resource}`
      ];
      
      console.log(`[Permission Check] Trying alternate patterns for ${permissionKey}:`, alternatePatterns);
      
      for (const pattern of alternatePatterns) {
        if (permissions.includes(pattern)) {
          console.log(`[Permission Check] ${permissionKey}: true (alternate match: ${pattern})`);
          return true;
        }
      }
    }
    
    console.log(`[Permission Check] ${permissionKey}: false`, { available: permissions });
    return false;
  };
  
  return {
    hasPermission,
    hasAnyPermission: (permissionKeys: string[]) => permissionKeys.some(key => hasPermission(key)),
    hasAllPermissions: (permissionKeys: string[]) => permissionKeys.every(key => hasPermission(key))
  };
};

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
  const [refreshing, setRefreshing] = useState(false);
  const { hasPermission } = usePermission();

  // Function to refresh user data
  const refreshUserData = useCallback(async () => {
    try {
      setRefreshing(true);
      await dispatch(refreshUser()).unwrap();
      console.log('User data refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Refresh user data periodically (every 5 minutes)
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Running periodic user data refresh');
      refreshUserData();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    return () => clearInterval(intervalId);
  }, [refreshUserData]);

  // Refresh user data on location change
  useEffect(() => {
    refreshUserData();
  }, [location.pathname, refreshUserData]);

  // Debug user permissions on component mount
  useEffect(() => {
    if (user && user.role && user.role.permissions) {
      console.log('======== USER PERMISSIONS DEBUG ========');
      console.log('User:', user.username);
      console.log('Role:', user.role.name);
      console.log('Permissions:', user.role.permissions);
      
      // Test every permission for each menu item
      console.log('------ PERMISSION CHECKS FOR EACH MODULE ------');
      console.log('Dashboard permission:', hasPermission('dashboard_view'));
      console.log('Exhibitions permission:', hasPermission('exhibitions_view'));
      console.log('Stalls permission:', hasPermission('view_stalls'));
      console.log('Stall Types permission:', hasPermission('view_stall_types'));
      console.log('Bookings permission:', hasPermission('view_bookings'));
      console.log('Exhibitors permission:', hasPermission('view_exhibitors'));
      console.log('Users permission:', hasPermission('users_view'));
      console.log('Roles permission:', hasPermission('roles_view'));
      console.log('Settings permission:', hasPermission('settings_view'));
      console.log('=====================================');
      
      // Log available menu items after filtering
      setTimeout(() => {
        console.log('Available menu items after filtering:', menuItems);
      }, 100);
    }
  }, [user, hasPermission]);

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Define menu items with their required permissions
  const allMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined style={{ fontSize: '16px' }} />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
      requiredPermission: 'dashboard_view'
    },
    {
      key: 'exhibition',
      icon: <ShopOutlined style={{ fontSize: '16px' }} />,
      label: 'Exhibitions',
      onClick: () => navigate('/exhibition'),
      requiredPermission: 'exhibitions_view'
    },
    {
      key: 'stall',
      icon: <TableOutlined style={{ fontSize: '16px' }} />,
      label: 'Stalls',
      requiredPermission: 'view_stalls',
      children: [
        {
          key: 'stall-list',
          icon: <TableOutlined style={{ fontSize: '16px' }} />,
          label: 'Stall List',
          onClick: () => navigate('/stall/list'),
          requiredPermission: 'view_stalls'
        },
        {
          key: 'stall-type',
          icon: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
          label: 'Stall Types',
          onClick: () => navigate('/stall-types'),
          requiredPermission: 'view_stall_types'
        }
      ],
    },
    {
      key: 'bookings',
      icon: <ShopOutlined style={{ fontSize: '16px' }} />,
      label: 'Stall Bookings',
      onClick: () => navigate('/bookings'),
      requiredPermission: 'view_bookings'
    },
    {
      key: 'exhibitors',
      icon: <TeamOutlined />,
      label: 'Exhibitors',
      onClick: () => navigate('/exhibitors'),
      requiredPermission: 'view_exhibitors'
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/index'),
      requiredPermission: 'users_view'
    },
    {
      key: 'roles',
      icon: <SafetyCertificateOutlined />,
      label: 'Roles',
      onClick: () => navigate('/roles'),
      requiredPermission: 'roles_view'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
      requiredPermission: 'settings_view'
    },
  ];

  // Filter menu items based on user permissions
  const filterMenuItemsByPermission = (items: any[]) => {
    return items.filter(item => {
      // Debug log for each menu item permission check
      console.log(`Checking permission for ${item.label}: ${item.requiredPermission}`);
      
      if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
        console.log(`Permission denied for ${item.label}: ${item.requiredPermission}`);
        return false;
      }
      
      // For items with children, recursively filter children too
      if (item.children) {
        const filteredChildren = filterMenuItemsByPermission(item.children);
        
        // Only include parent item if it has visible children
        if (filteredChildren.length === 0) {
          console.log(`No accessible children for ${item.label}, hiding parent`);
          return false;
        }
        
        // Update the children array with filtered items
        item.children = filteredChildren;
      }
      
      console.log(`Permission granted for ${item.label}`);
      return true;
    });
  };

  // Get menu items filtered by user's permissions
  const menuItems = filterMenuItemsByPermission(allMenuItems);

  // Check current page authorization
  useEffect(() => {
    // Map paths to required permissions
    const pathPermissionMap: Record<string, string> = {
      'dashboard': 'dashboard_view',
      'exhibition': 'exhibitions_view',
      'stall/list': 'view_stalls',
      'stall-types': 'view_stall_types',
      'bookings': 'view_bookings',
      'exhibitors': 'view_exhibitors',
      'index': 'users_view',
      'roles': 'roles_view',
      'settings': 'settings_view'
    };
    
    const currentPath = location.pathname.substring(1) || 'dashboard';
    
    // Check if current path requires permission and user doesn't have it
    const requiredPermission = pathPermissionMap[currentPath];
    if (requiredPermission && !hasPermission(requiredPermission)) {
      console.log(`User doesn't have permission for ${currentPath}, redirecting...`);
      
      // Debug output to understand available menu items
      console.log('Available menu items:', menuItems);
      
      // Find first menu item user has permission for - make sure it actually exists
      const availableMenuItem = menuItems.length > 0 ? menuItems[0] : null;
      
      if (availableMenuItem) {
        // Navigate to allowed page
        console.log(`Redirecting to ${availableMenuItem.key}`);
        navigate(`/${availableMenuItem.key}`);
      } else {
        // If no menu items are available, logout
        console.log('No accessible pages, logging out');
        dispatch(logout());
        navigate('/login');
      }
    }
  }, [location.pathname, hasPermission, menuItems, navigate, dispatch]);

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
      key: 'refresh',
      label: 'Refresh Permissions',
      icon: <ReloadOutlined />,
      onClick: refreshUserData,
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
            <Button
              type="text"
              icon={<ReloadOutlined spin={refreshing} />}
              onClick={refreshUserData}
              title="Refresh Permissions"
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