import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Typography, Space, Divider, Input, Button, Form } from 'antd';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined, 
  SendOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined
} from '@ant-design/icons';
import api from '../../services/api';

const { Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const StyledFooter = styled(Footer)`
  background: linear-gradient(to right, #242a38, #1a1f2c);
  padding: 60px 0 20px;
  color: rgba(255, 255, 255, 0.8);

  @media (max-width: 768px) {
    padding: 40px 0 20px;
  }
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
`;

const FooterTitle = styled(Title)`
  color: white !important;
  font-size: 18px !important;
  margin-bottom: 20px !important;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #4158D0, #C850C0);
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  height: auto;
  width: 100%;
  max-width: 160px;
  margin-bottom: 16px;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.8);
  display: block;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateX(5px);
  }
`;

const ContactItem = styled.div`
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
`;

const ContactIcon = styled.div`
  margin-right: 10px;
  color: #4158D0;
`;

const SocialIcon = styled.a`
  font-size: 24px;
  margin-right: 16px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
  
  &:hover {
    color: white;
    transform: translateY(-3px);
  }
`;

const NewsletterInput = styled(Input)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    border-color: #4158D0;
    box-shadow: 0 0 0 2px rgba(65, 88, 208, 0.2);
  }
`;

const SubscribeButton = styled(Button)`
  background: linear-gradient(90deg, #4158D0, #C850C0);
  border: none;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const CopyrightText = styled(Text)`
  display: block;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 20px;
  font-size: 14px;
`;

const FooterDivider = styled(Divider)`
  background: rgba(255, 255, 255, 0.1);
  margin: 30px 0;
`;

const GlobalFooter: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string>('/logo.png');
  const [siteName, setSiteName] = useState<string>('Exhibition Manager');
  const currentYear = new Date().getFullYear();
  
  // Load logo and site info
  useEffect(() => {
    // Set the logo URL directly
    const directLogoUrl = `${api.defaults.baseURL}/public/logo`;
    setLogoUrl(directLogoUrl);
    
    // Fetch site info
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
  
  return (
    <StyledFooter>
      <FooterContainer>
        <Row gutter={[48, 40]}>
          {/* Logo and Description */}
          <Col xs={24} sm={24} md={8} lg={7}>
            <LogoContainer>
              <Link to="/">
                <LogoImage 
                  src={logoUrl} 
                  alt={siteName} 
                  onError={() => setLogoUrl('/logo.png')}
                />
              </Link>
            </LogoContainer>
            <Paragraph style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: 24 }}>
              The premier platform for exhibition stall booking. Connect exhibitors with event organizers and simplify the booking process.
            </Paragraph>
            <Space>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <FacebookOutlined />
              </SocialIcon>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <TwitterOutlined />
              </SocialIcon>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <InstagramOutlined />
              </SocialIcon>
              <SocialIcon href="#" target="_blank" rel="noopener noreferrer">
                <LinkedinOutlined />
              </SocialIcon>
            </Space>
          </Col>
          
          {/* Quick Links */}
          <Col xs={24} sm={12} md={5} lg={5}>
            <FooterTitle level={4}>Quick Links</FooterTitle>
            <FooterLink to="/exhibitions">Exhibitions</FooterLink>
            <FooterLink to="/about">About Us</FooterLink>
            <FooterLink to="/contact">Contact Us</FooterLink>
            <FooterLink to="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink to="/terms">Terms & Conditions</FooterLink>
          </Col>
          
          {/* For Exhibitors */}
          <Col xs={24} sm={12} md={5} lg={5}>
            <FooterTitle level={4}>For Exhibitors</FooterTitle>
            <FooterLink to="/exhibitor/login">Login</FooterLink>
            <FooterLink to="/exhibitor/register">Register</FooterLink>
            <FooterLink to="/exhibitor/dashboard">Dashboard</FooterLink>
            <FooterLink to="/exhibitor/bookings">My Bookings</FooterLink>
            <FooterLink to="/faq">FAQ</FooterLink>
          </Col>
          
          {/* Contact Info */}
          <Col xs={24} sm={24} md={6} lg={7}>
            <FooterTitle level={4}>Contact Us</FooterTitle>
            <ContactItem>
              <ContactIcon><EnvironmentOutlined /></ContactIcon>
              <div>123 Exhibition Street, New Delhi, India</div>
            </ContactItem>
            <ContactItem>
              <ContactIcon><PhoneOutlined /></ContactIcon>
              <div>+91 98765 43210</div>
            </ContactItem>
            <ContactItem>
              <ContactIcon><MailOutlined /></ContactIcon>
              <div>info@exhibitionmanager.com</div>
            </ContactItem>
            
            {/* Newsletter */}
            <div style={{ marginTop: 24 }}>
              <FooterTitle level={4}>Newsletter</FooterTitle>
              <Form>
                <Space.Compact style={{ width: '100%' }}>
                  <NewsletterInput placeholder="Your email address" />
                  <SubscribeButton type="primary" icon={<SendOutlined />}>
                    Subscribe
                  </SubscribeButton>
                </Space.Compact>
              </Form>
            </div>
          </Col>
        </Row>
        
        <FooterDivider />
        
        {/* Copyright */}
        <CopyrightText>
          © {currentYear} {siteName}. All rights reserved.
        </CopyrightText>
      </FooterContainer>
    </StyledFooter>
  );
};

export default GlobalFooter; 