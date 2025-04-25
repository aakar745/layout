import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  Dropdown, 
  Avatar, 
  Space, 
  message, 
  Button, 
  Drawer
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { 
  UserOutlined, 
  LoginOutlined, 
  ShopOutlined, 
  LogoutOutlined, 
  DashboardOutlined, 
  UserAddOutlined, 
  MenuOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { exhibitorLogout, setExhibitorCredentials, hideLoginModal, showLoginModal, showForgotPasswordModal } from '../../store/slices/exhibitorAuthSlice';
import api from '../../services/api';

// Import our separated components
import ExhibitorAuthModals from '../auth/ExhibitorAuthModals';
import ForgotPasswordModal from '../auth/ForgotPasswordModal';

const { Header } = Layout;

const StyledHeader = styled(Header)`
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 1000;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    position: static;
    transform: none;
    justify-content: flex-start;
  }
`;

const LogoBackground = styled.div`
  border-radius: 8px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const LogoImage = styled.img`
  height: auto;
  width: 100%;
  max-width: 140px;
  max-height: auto;
  object-fit: contain;
  
  @media (max-width: 768px) {
    max-width: 120px;
  }
`;

const ProfileAvatar = styled(Avatar)`
  background-color: #1890ff;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    background-color: #40a9ff;
    border-color: #e6f7ff;
    transform: scale(1.05);
    box-shadow: 0 0 10px rgba(24, 144, 255, 0.3);
  }
`;

const StyledMenu = styled(Menu)`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  
  .ant-dropdown-menu-item {
    padding: 10px 16px;
    transition: all 0.2s;
    
    &:hover {
      background-color: #fafafa;
    }
  }
`;

const DesktopMenu = styled(Menu)`
  border: none;
  display: flex;
  justify-content: center;
  font-size: 15px;
  
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const MobileMenuIcon = styled(Button)`
  display: none;
  font-size: 18px;
  background: transparent;
  border: none;
  padding: 8px;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }
  
  &:hover {
    transform: rotate(90deg);
    color: #4158D0;
  }
  
  &:active {
    transform: scale(0.9) rotate(90deg);
  }
`;

const MobileMenuWrapper = styled.div`
  .ant-drawer-header {
    padding: 16px 24px;
  }
  
  .ant-drawer-title {
    font-size: 16px;
    font-weight: 600;
  }
  
  .ant-drawer-body {
    padding: 24px 16px;
  }
  
  .ant-drawer-content-wrapper {
    max-width: 80%;
  }
`;

const MobileMenuItem = styled(Link)`
  display: block;
  padding: 16px 8px;
  margin-bottom: 8px;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    color: #1890ff;
  }
`;

const MobileMenuButton = styled(Button)`
  width: 100%;
  margin-bottom: 12px;
  height: auto;
  padding: 12px 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 10px;
    font-size: 18px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const CompanyName = styled.span`
  margin-right: 8px;
  display: none;
  
  @media (min-width: 768px) {
    display: inline;
  }
`;

const GlobalHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');
  const [siteName, setSiteName] = useState<string>('Exhibition Manager');
  
  // Get redux state
  const exhibitorAuth = useSelector((state: RootState) => state.exhibitorAuth);
  const { exhibitor, isAuthenticated, showLoginModal: loginModalVisible, showForgotPasswordModal: forgotPasswordModalVisible } = exhibitorAuth;
  
  // Load logo from public endpoint
  useEffect(() => {
    // Check if we have a cached logo URL first
    const cachedLogoUrl = localStorage.getItem('cachedLogoUrl');
    const logoTimestamp = localStorage.getItem('logoTimestamp');
    const now = new Date().getTime();
    
    // Use cached logo if it exists and is less than 1 hour old
    if (cachedLogoUrl && logoTimestamp && (now - parseInt(logoTimestamp)) < 3600000) {
      setLogoUrl(cachedLogoUrl);
    } else {
      // Set the logo URL directly
      const directLogoUrl = `${api.defaults.baseURL}/public/logo`;
      setLogoUrl(directLogoUrl);
      
      // Cache the logo URL
      localStorage.setItem('cachedLogoUrl', directLogoUrl);
      localStorage.setItem('logoTimestamp', now.toString());
      
      // Preload the image
      const img = new Image();
      img.src = directLogoUrl;
    }
    
    // Still fetch site info to get the site name
    fetch(`${api.defaults.baseURL}/public/site-info`)
      .then(response => response.json())
      .then(data => {
        if (data.siteName) {
          setSiteName(data.siteName);
        }
      })
      .catch(error => {
        console.error('Error fetching site info:', error);
      });
  }, []);

  /**
   * Configure global message positioning
   * Sets up the message component to display notifications in the correct position
   */
  useEffect(() => {
    // Configure the global message component to appear below the header
    message.config({
      top: 84, // Increased from 70 to ensure it's below the header shadow
      duration: 3,
      maxCount: 1 // Only show one message at a time
    });
    
    // Cleanup on component unmount
    return () => {
      message.destroy(); // Remove any active messages when component unmounts
    };
  }, []);

  const handleExhibitorLogout = () => {
    dispatch(exhibitorLogout());
    message.success('Successfully logged out');
    navigate('/');
    setDropdownVisible(false);
    setMobileMenuVisible(false);
  };
  
  const handleShowLoginModal = () => {
    dispatch(showLoginModal(undefined));
    setDropdownVisible(false);
    setMobileMenuVisible(false);
  };

  const showRegisterModal = () => {
    setRegisterModalVisible(true);
    setDropdownVisible(false);
    setMobileMenuVisible(false);
  };
  
  const handleShowForgotPasswordModal = () => {
    dispatch(showForgotPasswordModal());
  };
  
  const menuItems = [
    { key: 'exhibitions', label: 'Exhibitions', path: '/exhibitions' },
    { key: 'about', label: 'About', path: '/about' },
    { key: 'contact', label: 'Contact', path: '/contact' },
  ];
  
  // Guest menu when not logged in
  const guestMenu = (
    <StyledMenu
      items={[
        {
          key: 'exhibitor-login',
          icon: <LoginOutlined />,
          label: <a onClick={handleShowLoginModal}>Exhibitor Login</a>,
        },
        {
          key: 'exhibitor-register',
          icon: <UserAddOutlined />,
          label: <a onClick={showRegisterModal}>Register as Exhibitor</a>,
        }
      ]}
    />
  );

  // Exhibitor menu when logged in
  const exhibitorMenu = (
    <StyledMenu
      items={[
        {
          key: 'exhibitor-dashboard',
          icon: <DashboardOutlined />,
          label: <Link to="/exhibitor/dashboard">Dashboard</Link>,
        },
        {
          key: 'exhibitor-profile',
          icon: <UserOutlined />,
          label: <Link to="/exhibitor/profile">My Profile</Link>,
        },
        {
          key: 'exhibitor-bookings',
          icon: <ShopOutlined />,
          label: <Link to="/exhibitor/bookings">My Bookings</Link>,
        },
        {
          key: 'divider',
          type: 'divider',
        },
        {
          key: 'exhibitor-logout',
          icon: <LogoutOutlined />,
          label: <a onClick={handleExhibitorLogout}>Logout</a>,
        },
      ]}
    />
  );

  return (
    <>
      <StyledHeader>
        <HeaderContainer>
          {/* Logo */}
          <LogoContainer>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <LogoBackground>
                <LogoImage 
                  src={logoUrl} 
                  alt="Logo" 
                  onError={() => setLogoUrl('/logo.png')}
                />
              </LogoBackground>
            </Link>
          </LogoContainer>
          
          {/* Desktop navigation */}
          <DesktopMenu
            mode="horizontal"
            selectedKeys={[]}
            style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
            items={menuItems.map(item => ({
              key: item.key,
              label: <Link to={item.path}>{item.label}</Link>,
            }))}
          />
          
          {/* User profile/login for desktop */}
          <HeaderRight>
            <Dropdown 
              overlay={exhibitorAuth.isAuthenticated ? exhibitorMenu : guestMenu} 
              trigger={['click']} 
              placement="bottomRight"
              open={dropdownVisible}
              onOpenChange={setDropdownVisible}
              overlayStyle={{ 
                minWidth: '150px',
                marginTop: '10px'
              }}
            >
              {exhibitorAuth.isAuthenticated ? (
                <Space style={{ cursor: 'pointer' }}>
                  <CompanyName>
                    {exhibitorAuth.exhibitor?.companyName || 'Exhibitor'}
                  </CompanyName>
                  <ProfileAvatar 
                    icon={<UserOutlined />} 
                    size="large"
                  />
                </Space>
              ) : (
                <ProfileAvatar 
                  icon={<UserOutlined />} 
                  size="large"
                />
              )}
            </Dropdown>
          </HeaderRight>
          
          {/* Mobile menu toggle */}
          <MobileMenuIcon
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
          />
        </HeaderContainer>
      </StyledHeader>

      {/* Mobile Navigation Drawer */}
      <MobileMenuWrapper>
        <Drawer
          title="Exhibition Management System"
          placement="right"
          onClose={() => setMobileMenuVisible(false)}
          open={mobileMenuVisible}
          width={280}
          closeIcon={<span style={{ fontSize: '16px' }}>×</span>}
        >
          <div style={{ marginBottom: 24 }}>
            {menuItems.map(item => (
              <MobileMenuItem 
                key={item.key} 
                to={item.path}
                onClick={() => setMobileMenuVisible(false)}
              >
                {item.label}
              </MobileMenuItem>
            ))}
          </div>
          
          <div style={{ marginTop: 40 }}>
            {exhibitorAuth.isAuthenticated ? (
              <>
                <MobileMenuButton
                  type="primary"
                  icon={<DashboardOutlined />}
                  onClick={() => {
                    navigate('/exhibitor/dashboard');
                    setMobileMenuVisible(false);
                  }}
                >
                  Dashboard
                </MobileMenuButton>
                <MobileMenuButton
                  type="default"
                  icon={<LogoutOutlined />}
                  onClick={handleExhibitorLogout}
                >
                  Logout
                </MobileMenuButton>
              </>
            ) : (
              <>
                <MobileMenuButton
                  type="primary"
                  style={{ background: '#7E57C2', borderColor: '#7E57C2' }}
                  icon={<LoginOutlined />}
                  onClick={() => {
                    handleShowLoginModal();
                    setMobileMenuVisible(false);
                  }}
                >
                  Exhibitor Login
                </MobileMenuButton>
                <MobileMenuButton
                  type="default"
                  icon={<UserAddOutlined />}
                  onClick={() => {
                    showRegisterModal();
                    setMobileMenuVisible(false);
                  }}
                >
                  Register as Exhibitor
                </MobileMenuButton>
              </>
            )}
          </div>
        </Drawer>
      </MobileMenuWrapper>

      {/* Include the separated modal components */}
      <ExhibitorAuthModals 
        loginModalVisible={loginModalVisible}
        registerModalVisible={registerModalVisible}
        setRegisterModalVisible={setRegisterModalVisible}
        setExhibitorCredentials={(data) => dispatch(setExhibitorCredentials(data))}
        onForgotPassword={handleShowForgotPasswordModal}
      />
      
      <ForgotPasswordModal visible={forgotPasswordModalVisible} />
    </>
  );
};

export default GlobalHeader;