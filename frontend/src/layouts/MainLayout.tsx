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

// Permission hook to check if the current user has specific permissions
const usePermission = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const hasPermission = (permissionKey: string) => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    
    const permissions = user.role.permissions;
    
    // Direct match check
    if (permissions.includes(permissionKey)) {
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
      
      for (const pattern of alternatePatterns) {
        if (permissions.includes(pattern)) {
          return true;
        }
      }
    }
    
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
    } catch (error) {
      // Error handling without console.log
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  // Refresh user data periodically (every 5 minutes)
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshUserData();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    return () => clearInterval(intervalId);
  }, [refreshUserData]);

  // Refresh user data on location change
  useEffect(() => {
    refreshUserData();
  }, [location.pathname, refreshUserData]);

  // Debug user permissions on component mount - removing console.logs but keeping checks
  useEffect(() => {
    // Keeping just the permission check functionality without logging
  }, [user, hasPermission]);

  // Fetch settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Define menu items with their required permissions
  const allMenuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      requiredPermission: 'dashboard_view',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: 'exhibitions',
      icon: <TableOutlined />,
      label: 'Exhibitions',
      requiredPermission: 'exhibitions_view',
      onClick: () => navigate('/exhibition'),
    },
    {
      key: 'stalls',
      icon: <ShopOutlined />,
      label: 'Stalls',
      requiredPermission: 'view_stalls',
      children: [
        {
          key: 'stall/list',
          label: 'Stall List',
          requiredPermission: 'view_stalls',
          onClick: () => navigate('/stall/list'),
        },
        {
          key: 'stall-types',
          label: 'Stall Types',
          requiredPermission: 'view_stall_types',
          onClick: () => navigate('/stall-types'),
        },
      ],
    },
    {
      key: 'bookings',
      icon: <CheckCircleOutlined />,
      label: 'Stall Bookings',
      requiredPermission: 'view_bookings',
      onClick: () => navigate('/bookings'),
    },
    {
      key: 'exhibitors',
      icon: <TeamOutlined />,
      label: 'Exhibitors',
      requiredPermission: 'view_exhibitors',
      onClick: () => navigate('/exhibitors'),
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'Users',
      requiredPermission: 'users_view',
      onClick: () => navigate('/index'),
    },
    {
      key: 'roles',
      icon: <SafetyCertificateOutlined />,
      label: 'Roles',
      requiredPermission: 'roles_view',
      onClick: () => navigate('/roles'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      requiredPermission: 'settings_view',
      onClick: () => navigate('/settings'),
    },
  ];

  const filterMenuItemsByPermission = (items: any[]) => {
    return items.filter(item => {
      if (item.requiredPermission && !hasPermission(item.requiredPermission)) {
        return false;
      }
      
      // For items with children, recursively filter children too
      if (item.children) {
        const filteredChildren = filterMenuItemsByPermission(item.children);
        
        // Only include parent item if it has visible children
        if (filteredChildren.length === 0) {
          return false;
        }
        
        // Update the children array with filtered items
        item.children = filteredChildren;
      }
      
      return true;
    });
  };

  // Get menu items filtered by user's permissions
  const menuItems = filterMenuItemsByPermission(allMenuItems);

  // Clean up menu items to remove custom props before rendering
  const cleanMenuItems = (items: any[]) => {
    return items.map(item => {
      // Create a new object without the requiredPermission prop
      const { requiredPermission, ...cleanItem } = item;
      
      // Recursively clean children if they exist
      if (cleanItem.children) {
        cleanItem.children = cleanMenuItems(cleanItem.children);
      }
      
      return cleanItem;
    });
  };

  // Clean menu items before passing to Menu component
  const cleanedMenuItems = cleanMenuItems(menuItems);

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
      // Find first menu item user has permission for - make sure it actually exists
      const availableMenuItem = menuItems.length > 0 ? menuItems[0] : null;
      
      if (availableMenuItem) {
        // Navigate to allowed page
        navigate(`/${availableMenuItem.key}`);
      } else {
        // If no menu items are available, logout
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
          items={cleanedMenuItems}
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
              color: '#111827'
            }}>
              {getCurrentPageTitle()}
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: 20 }}>
              <NotificationBell />
            </div>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space align="center" style={{ cursor: 'pointer' }}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#5046e5' }}
                />
                <span style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.username || 'User'}
                </span>
              </Space>
            </Dropdown>
          </div>
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

export default MainLayout; 