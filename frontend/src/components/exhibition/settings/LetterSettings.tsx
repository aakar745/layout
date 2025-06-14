import React, { useState } from 'react';
import { Form, Input, Typography, FormInstance, Card, Row, Col, Switch, InputNumber, Tabs, Space, Tooltip, Alert, Button, Modal } from 'antd';
import { InfoCircleOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface LetterSettingsProps {
  form: FormInstance;
}

const LetterSettings: React.FC<LetterSettingsProps> = ({ form }) => {
  const [previewModal, setPreviewModal] = useState<{
    visible: boolean;
    type: 'standPossession' | 'transport' | null;
    content: string;
  }>({
    visible: false,
    type: null,
    content: ''
  });

  // Sample data for preview
  const sampleData = {
    COMPANY_NAME: 'ABC Technologies Pvt Ltd',
    CUSTOMER_NAME: 'John Smith',
    REPRESENTATIVE_NAME: 'John Smith',
    STALL_NO: 'A-101, A-102',
    MOBILE: '+91 9876543210',
    EMAIL: 'john.smith@abctech.com',
    EXHIBITION_NAME: 'Tech Expo 2024',
    EXHIBITION_VENUE: 'Convention Center, Mumbai',
    EXHIBITION_START_DATE: '15/03/2024',
    EXHIBITION_END_DATE: '18/03/2024',
    CURRENT_DATE: new Date().toLocaleDateString(),
    BOOKING_REFERENCE: 'BOOK1234',
    TOTAL_AMOUNT: '₹1,50,000',
    PAYMENT_STATUS: 'PAID IN FULL',
    STALL_AREA: '36',
    CONTACT_PERSON: 'Exhibition Manager',
    CONTACT_PHONE: '+91 9876543210'
  };

  const previewTemplate = (type: 'standPossession' | 'transport') => {
    const template = form.getFieldValue(['letterSettings', type === 'standPossession' ? 'standPossessionLetter' : 'transportLetter', 'template']);
    
    if (!template) {
      Modal.warning({
        title: 'No Template',
        content: 'Please enter a template first to preview it.'
      });
      return;
    }

    // Replace variables with sample data
    let previewContent = template;
    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      previewContent = previewContent.replace(regex, value);
    });

    setPreviewModal({
      visible: true,
      type,
      content: previewContent
    });
  };
  // Default templates
  const defaultStandPossessionTemplate = `STAND POSSESSION AUTHORIZATION

Exhibition: {{EXHIBITION_NAME}}
Venue: {{EXHIBITION_VENUE}}
Dates: {{EXHIBITION_START_DATE}} to {{EXHIBITION_END_DATE}}

Dear {{CUSTOMER_NAME}},

This letter authorizes the handover of stall possession for the above exhibition.

EXHIBITOR DETAILS:
Company Name: {{COMPANY_NAME}}
Representative: {{REPRESENTATIVE_NAME}}
Contact: {{MOBILE}} | {{EMAIL}}

STALL DETAILS:
Stall Number(s): {{STALL_NO}}
Total Area: {{STALL_AREA}} sq. meters
Booking Reference: {{BOOKING_REFERENCE}}

PAYMENT STATUS: {{PAYMENT_STATUS}}

Please hand over possession of the allocated space to our authorized representative. All dues have been settled as per the agreement.

For any queries, contact: {{CONTACT_PERSON}} at {{CONTACT_PHONE}}

Authorized Signature: _________________________

Date: {{CURRENT_DATE}}`;

  const defaultTransportTemplate = `TRANSPORT ARRANGEMENTS & GUIDELINES

Exhibition: {{EXHIBITION_NAME}}
Venue: {{EXHIBITION_VENUE}}
Dates: {{EXHIBITION_START_DATE}} to {{EXHIBITION_END_DATE}}

Dear {{CUSTOMER_NAME}},

This letter provides important information regarding transportation arrangements for your participation in the above exhibition.

EXHIBITOR DETAILS:
Company: {{COMPANY_NAME}}
Stall Number(s): {{STALL_NO}}
Total Area: {{STALL_AREA}} sq. meters
Booking Reference: {{BOOKING_REFERENCE}}
Contact: {{MOBILE}} | {{EMAIL}}

TRANSPORT GUIDELINES:
1. Material delivery is allowed 2 days before the exhibition start date
2. All vehicles must be registered at the main gate
3. Loading/unloading is permitted only during designated hours
4. Heavy machinery requires prior approval from the venue management
5. All materials must be removed within 24 hours after exhibition closure

IMPORTANT NOTES:
- Payment Status: {{PAYMENT_STATUS}}
- Setup begins: 2 days before {{EXHIBITION_START_DATE}}
- Breakdown deadline: 1 day after {{EXHIBITION_END_DATE}}

For transportation queries and vehicle registration, contact:
{{CONTACT_PERSON}} at {{CONTACT_PHONE}}

Best regards,
Exhibition Management Team

Date: {{CURRENT_DATE}}`;

  // Available template variables
  const templateVariables = [
    { key: 'COMPANY_NAME', description: 'Company name from booking' },
    { key: 'CUSTOMER_NAME', description: 'Customer name from booking' },
    { key: 'REPRESENTATIVE_NAME', description: 'Representative name (same as customer)' },
    { key: 'STALL_NO', description: 'Stall numbers (comma-separated)' },
    { key: 'MOBILE', description: 'Customer mobile number' },
    { key: 'EMAIL', description: 'Customer email address' },
    { key: 'EXHIBITION_NAME', description: 'Exhibition name' },
    { key: 'EXHIBITION_VENUE', description: 'Exhibition venue' },
    { key: 'EXHIBITION_START_DATE', description: 'Exhibition start date' },
    { key: 'EXHIBITION_END_DATE', description: 'Exhibition end date' },
    { key: 'CURRENT_DATE', description: 'Current date when letter is generated' },
    { key: 'BOOKING_REFERENCE', description: 'Unique booking reference number' },
    { key: 'TOTAL_AMOUNT', description: 'Total booking amount' },
    { key: 'PAYMENT_STATUS', description: 'Current payment status' },
    { key: 'STALL_AREA', description: 'Total stall area in square meters' },
    { key: 'CONTACT_PERSON', description: 'Exhibition contact person' },
    { key: 'CONTACT_PHONE', description: 'Exhibition contact phone number' },
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Alert
        message="Letter Settings"
        description="Configure letter templates and automatic sending for exhibitors. Letters will be sent to confirmed exhibitors based on your settings."
        type="info"
        showIcon
        style={{ marginBottom: '24px' }}
      />

      <Tabs defaultActiveKey="standPossession" type="card">
        <TabPane 
          tab={
            <span>
              <MailOutlined />
              Stand Possession Letter
            </span>
          } 
          key="standPossession"
        >
          <Card className="settings-card">
            <Title level={4}>Stand Possession Letter</Title>
            <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
              Configure the letter that will be sent to exhibitors for stall possession
            </Text>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name={['letterSettings', 'standPossessionLetter', 'isEnabled']}
                  valuePropName="checked"
                  style={{ marginBottom: '16px' }}
                >
                  <Switch 
                    checkedChildren="Enabled" 
                    unCheckedChildren="Disabled"
                  />
                </Form.Item>
                <Text type="secondary">Enable stand possession letter for this exhibition</Text>
              </Col>
            </Row>

            <Row gutter={24} style={{ marginTop: '24px' }}>
              <Col span={24}>
                <Form.Item
                  name={['letterSettings', 'standPossessionLetter', 'subject']}
                  label="Email Subject"
                  rules={[
                    { required: true, message: 'Please enter email subject' },
                    { max: 200, message: 'Subject cannot be longer than 200 characters' }
                  ]}
                >
                  <Input 
                    placeholder="Stand Possession Letter - {{EXHIBITION_NAME}}"
                    showCount
                    maxLength={200}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name={['letterSettings', 'standPossessionLetter', 'template']}
                  label={
                    <Space>
                      Letter Template
                      <Tooltip title="Use {{VARIABLE_NAME}} format to insert dynamic content">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                  rules={[
                    { required: true, message: 'Please enter letter template' },
                    { min: 50, message: 'Template must be at least 50 characters' },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        
                        // Check for required variables
                        const requiredVars = ['COMPANY_NAME', 'CUSTOMER_NAME', 'STALL_NO'];
                        const missingVars = requiredVars.filter(varName => 
                          !value.includes(`{{${varName}}}`)
                        );
                        
                        if (missingVars.length > 0) {
                          return Promise.reject(
                            new Error(`Template must include: ${missingVars.map(v => `{{${v}}}`).join(', ')}`)
                          );
                        }
                        
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <TextArea
                    rows={12}
                    placeholder={defaultStandPossessionTemplate}
                    showCount
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => previewTemplate('standPossession')}
                  style={{ marginTop: '8px' }}
                >
                  Preview Template
                </Button>
              </Col>
            </Row>

            {/* Automatic Sending Settings */}
            <Card 
              title={
                <Space>
                  <ClockCircleOutlined />
                  Automatic Sending
                </Space>
              }
              size="small"
              style={{ marginTop: '24px' }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={['letterSettings', 'standPossessionLetter', 'automaticSending', 'isEnabled']}
                    valuePropName="checked"
                    style={{ marginBottom: '16px' }}
                  >
                    <Switch 
                      checkedChildren="Auto Send" 
                      unCheckedChildren="Manual Only"
                    />
                  </Form.Item>
                  <Text type="secondary">Enable automatic sending based on exhibition date</Text>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['letterSettings', 'standPossessionLetter', 'automaticSending', 'daysBeforeExhibition']}
                    label="Days Before Exhibition"
                    rules={[
                      { required: true, message: 'Please enter days' },
                      { type: 'number', min: 1, max: 30, message: 'Must be between 1 and 30 days' }
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="20"
                      min={1}
                      max={30}
                      addonAfter="days"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <MailOutlined />
              Transport Letter
            </span>
          } 
          key="transport"
        >
          <Card className="settings-card">
            <Title level={4}>Transport Letter</Title>
            <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
              Configure the letter that will be sent to exhibitors for transportation arrangements
            </Text>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name={['letterSettings', 'transportLetter', 'isEnabled']}
                  valuePropName="checked"
                  style={{ marginBottom: '16px' }}
                >
                  <Switch 
                    checkedChildren="Enabled" 
                    unCheckedChildren="Disabled"
                  />
                </Form.Item>
                <Text type="secondary">Enable transport letter for this exhibition</Text>
              </Col>
            </Row>

            <Row gutter={24} style={{ marginTop: '24px' }}>
              <Col span={24}>
                <Form.Item
                  name={['letterSettings', 'transportLetter', 'subject']}
                  label="Email Subject"
                  rules={[
                    { required: true, message: 'Please enter email subject' },
                    { max: 200, message: 'Subject cannot be longer than 200 characters' }
                  ]}
                >
                  <Input 
                    placeholder="Transport Arrangements - {{EXHIBITION_NAME}}"
                    showCount
                    maxLength={200}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  name={['letterSettings', 'transportLetter', 'template']}
                  label={
                    <Space>
                      Letter Template
                      <Tooltip title="Use {{VARIABLE_NAME}} format to insert dynamic content">
                        <InfoCircleOutlined />
                      </Tooltip>
                    </Space>
                  }
                  rules={[
                    { required: true, message: 'Please enter letter template' },
                    { min: 50, message: 'Template must be at least 50 characters' },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        
                        // Check for required variables
                        const requiredVars = ['COMPANY_NAME', 'CUSTOMER_NAME', 'EXHIBITION_NAME'];
                        const missingVars = requiredVars.filter(varName => 
                          !value.includes(`{{${varName}}}`)
                        );
                        
                        if (missingVars.length > 0) {
                          return Promise.reject(
                            new Error(`Template must include: ${missingVars.map(v => `{{${v}}}`).join(', ')}`)
                          );
                        }
                        
                        return Promise.resolve();
                      }
                    }
                  ]}
                >
                  <TextArea
                    rows={12}
                    placeholder={defaultTransportTemplate}
                    showCount
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>
                <Button 
                  type="dashed" 
                  onClick={() => previewTemplate('transport')}
                  style={{ marginTop: '8px' }}
                >
                  Preview Template
                </Button>
              </Col>
            </Row>

            {/* Automatic Sending Settings */}
            <Card 
              title={
                <Space>
                  <ClockCircleOutlined />
                  Automatic Sending
                </Space>
              }
              size="small"
              style={{ marginTop: '24px' }}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name={['letterSettings', 'transportLetter', 'automaticSending', 'isEnabled']}
                    valuePropName="checked"
                    style={{ marginBottom: '16px' }}
                  >
                    <Switch 
                      checkedChildren="Auto Send" 
                      unCheckedChildren="Manual Only"
                    />
                  </Form.Item>
                  <Text type="secondary">Enable automatic sending based on exhibition date</Text>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={['letterSettings', 'transportLetter', 'automaticSending', 'daysBeforeExhibition']}
                    label="Days Before Exhibition"
                    rules={[
                      { required: true, message: 'Please enter days' },
                      { type: 'number', min: 1, max: 30, message: 'Must be between 1 and 30 days' }
                    ]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="25"
                      min={1}
                      max={30}
                      addonAfter="days"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <InfoCircleOutlined />
              Template Variables
            </span>
          } 
          key="variables"
        >
          <Card className="settings-card">
            <Title level={4}>Available Template Variables</Title>
            <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
              Use these variables in your letter templates. They will be automatically replaced with actual data when letters are sent.
            </Text>

            <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '6px', marginBottom: '24px' }}>
              <Text strong>Usage Format:</Text>
              <br />
              <Text code>{`{{VARIABLE_NAME}}`}</Text>
              <br />
                             <Text type="secondary">Example: "Dear {`{{CUSTOMER_NAME}}`}, your stall {`{{STALL_NO}}`} is ready."</Text>
            </div>

            <Row gutter={[16, 16]}>
              {templateVariables.map((variable) => (
                <Col span={12} key={variable.key}>
                  <Card size="small" style={{ height: '100%' }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong code>{`{{${variable.key}}}`}</Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {variable.description}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>

            <Alert
              message="Template Tips"
              description={
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>Variables are case-sensitive and must be in uppercase</li>
                  <li>Use double curly braces: {`{{VARIABLE_NAME}}`}</li>
                  <li>Variables will be replaced with actual data when letters are sent</li>
                  <li>If a variable has no data, it will be replaced with an empty string</li>
                </ul>
              }
              type="info"
              showIcon
              style={{ marginTop: '24px' }}
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* Template Preview Modal */}
      <Modal
        title={`${previewModal.type === 'standPossession' ? 'Stand Possession' : 'Transport'} Letter Preview`}
        open={previewModal.visible}
        onCancel={() => setPreviewModal({ visible: false, type: null, content: '' })}
        footer={[
          <Button key="close" onClick={() => setPreviewModal({ visible: false, type: null, content: '' })}>
            Close
          </Button>
        ]}
        width={800}
      >
        <Alert
          message="Template Preview"
          description="This is how your letter will look with sample data. Variables have been replaced with example values."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <div 
          style={{ 
            background: '#f9f9f9', 
            padding: '20px', 
            borderRadius: '6px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-line',
            maxHeight: '500px',
            overflow: 'auto',
            border: '1px solid #d9d9d9'
          }}
        >
          {previewModal.content}
        </div>
      </Modal>
    </div>
  );
};

export default LetterSettings; 