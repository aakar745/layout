import React, { useState } from 'react';
import { 
  Card, 
  Typography, 
  Collapse, 
  Row, 
  Col, 
  Button, 
  Space, 
  Divider,
  Form,
  Input,
  Select,
  message,
  Alert,
  Steps,
  Tag
} from 'antd';
import { 
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  ClockCircleOutlined,
  SendOutlined,
  BookOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

const ExhibitorSupport: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSupportSubmit = async (values: any) => {
    try {
      setLoading(true);
      // In a real implementation, this would send the support request
      console.log('Support request:', values);
      message.success('Your support request has been submitted successfully. We will get back to you within 24 hours.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to submit support request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqData = [
    {
      key: '1',
      question: 'How do I book a stall for an exhibition?',
      answer: 'To book a stall: 1) Navigate to "Exhibitions" from the menu, 2) Select the exhibition you want to participate in, 3) Click "View Layout" to see available stalls, 4) Click on an available stall (shown in green), 5) Fill in the booking details, 6) Submit your booking request. Once approved by the admin, you can proceed with payment.'
    },
    {
      key: '2',
      question: 'What are the different booking statuses?',
      answer: 'Pending: Your booking is under review. Approved: Your booking has been approved and awaits payment. Confirmed: Payment has been received and your stall is confirmed. Rejected: Your booking was not approved (reason will be provided). Cancelled: The booking has been cancelled.'
    },
    {
      key: '3',
      question: 'How can I download my invoice?',
      answer: 'You can download your invoice from: 1) Dashboard - click "Invoice" next to approved bookings, 2) My Bookings - click "View Details" then "View Invoice", 3) The invoice page has download, email, and WhatsApp sharing options.'
    },
    {
      key: '4',
      question: 'Can I modify my booking after submission?',
      answer: 'Once submitted, bookings cannot be directly modified through the portal. Please contact support with your booking ID and required changes. We will assist you based on the exhibition policies and availability.'
    },
    {
      key: '5',
      question: 'What payment methods are accepted?',
      answer: 'We accept various payment methods including bank transfers, online payments, and cheques. Specific payment instructions will be provided in your invoice once your booking is approved.'
    },
    {
      key: '6',
      question: 'How do I update my company profile?',
      answer: 'Go to "My Profile" from the menu. You can update your company information, contact details, and business documents. Make sure to save your changes after editing.'
    },
    {
      key: '7',
      question: 'What if I need to cancel my booking?',
      answer: 'You can cancel pending bookings directly from the "My Bookings" page. For approved or confirmed bookings, please contact support as cancellation policies may apply.'
    },
    {
      key: '8',
      question: 'How do I get exhibition updates and notifications?',
      answer: 'Important updates are sent to your registered email address. Make sure your email is correct in your profile. You can also check the dashboard for recent updates on your bookings.'
    }
  ];

  const gettingStartedSteps = [
    {
      title: 'Complete Your Profile',
      description: 'Update your company information, contact details, and business documents in the "My Profile" section.',
      icon: <UserOutlined />
    },
    {
      title: 'Browse Exhibitions',
      description: 'Explore available exhibitions from the "Exhibitions" menu to find events that match your business.',
      icon: <BookOutlined />
    },
    {
      title: 'Book Your Stall',
      description: 'Select an exhibition, view the layout, choose your preferred stall, and submit your booking request.',
      icon: <ShopOutlined />
    },
    {
      title: 'Track Your Booking',
      description: 'Monitor your booking status in "My Bookings" and download invoices once approved.',
      icon: <FileTextOutlined />
    }
  ];

  return (
    <div>
      <Title level={2}>Help & Support</Title>
      <Text type="secondary">Get help with your exhibitor account and bookings</Text>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Quick Contact */}
        <Col xs={24} lg={8}>
          <Card title="Contact Us" style={{ height: '100%' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Space>
                  <PhoneOutlined style={{ color: '#1890ff' }} />
                  <div>
                    <Text strong>Phone Support</Text>
                    <br />
                    <Text>+91 12345 67890</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Mon-Fri, 9:00 AM - 6:00 PM
                    </Text>
                  </div>
                </Space>
              </div>
              
              <div>
                <Space>
                  <MailOutlined style={{ color: '#1890ff' }} />
                  <div>
                    <Text strong>Email Support</Text>
                    <br />
                    <Text>support@exhibitions.com</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      Response within 24 hours
                    </Text>
                  </div>
                </Space>
              </div>
              
              <div>
                <Space>
                  <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  <div>
                    <Text strong>Business Hours</Text>
                    <br />
                    <Text>Monday - Friday</Text>
                    <br />
                    <Text>9:00 AM - 6:00 PM IST</Text>
                  </div>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Support Request Form */}
        <Col xs={24} lg={16}>
          <Card title="Submit Support Request">
            <Alert
              message="Need Help?"
              description="Fill out the form below and our support team will get back to you within 24 hours."
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSupportSubmit}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[{ required: true, message: 'Please enter a subject' }]}
                  >
                    <Input placeholder="Brief description of your issue" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                  >
                    <Select placeholder="Select issue category">
                      <Option value="booking">Booking Issues</Option>
                      <Option value="payment">Payment & Invoices</Option>
                      <Option value="profile">Profile & Account</Option>
                      <Option value="technical">Technical Issues</Option>
                      <Option value="general">General Inquiry</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item
                name="message"
                label="Message"
                rules={[{ required: true, message: 'Please describe your issue' }]}
              >
                <TextArea 
                  rows={4} 
                  placeholder="Please provide detailed information about your issue or question..."
                />
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SendOutlined />}
                  loading={loading}
                >
                  Submit Request
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Getting Started Guide */}
      <Card title="Getting Started Guide" style={{ marginTop: 24 }}>
        <Paragraph>
          New to our platform? Follow these simple steps to get started with booking exhibition stalls.
        </Paragraph>
        
        <Steps 
          direction="horizontal"
          responsive={false}
          style={{ marginTop: 24 }}
        >
          {gettingStartedSteps.map((step, index) => (
            <Step
              key={index}
              title={step.title}
              description={step.description}
              icon={step.icon}
            />
          ))}
        </Steps>
      </Card>

      {/* FAQ Section */}
      <Card title="Frequently Asked Questions" style={{ marginTop: 24 }}>
        <Collapse 
          bordered={false}
          expandIcon={({ isActive }) => <QuestionCircleOutlined rotate={isActive ? 90 : 0} />}
        >
          {faqData.map(faq => (
            <Panel header={faq.question} key={faq.key}>
              <Text>{faq.answer}</Text>
            </Panel>
          ))}
        </Collapse>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginTop: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Button type="primary" block icon={<BookOutlined />}>
              View Tutorials
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block icon={<FileTextOutlined />}>
              Download User Guide
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block icon={<InfoCircleOutlined />}>
              Terms & Conditions
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button block icon={<CheckCircleOutlined />}>
              System Status
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Emergency Contact */}
      <Card style={{ marginTop: 24, background: '#fff2f0', border: '1px solid #ffccc7' }}>
        <Row align="middle">
          <Col span={2}>
            <PhoneOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
          </Col>
          <Col span={22}>
            <Text strong style={{ color: '#ff4d4f' }}>Emergency Support</Text>
            <br />
            <Text>For urgent issues during exhibitions: +91 98765 43210 (24/7)</Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ExhibitorSupport; 