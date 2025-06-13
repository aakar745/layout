import React from 'react';
import { Form, Input, Typography, FormInstance, Card, Row, Col, Switch, InputNumber, Tabs, Space, Tooltip, Alert } from 'antd';
import { InfoCircleOutlined, MailOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface LetterSettingsProps {
  form: FormInstance;
}

const LetterSettings: React.FC<LetterSettingsProps> = ({ form }) => {
  // Default templates
  const defaultStandPossessionTemplate = `STAND POSSESSION FOR EXHIBITOR

Please hand over possession of space allotted to us, to our Representative.

Company Name: {{COMPANY_NAME}}

Name of Representative: {{REPRESENTATIVE_NAME}}

Stall No.: {{STALL_NO}}

Mobile: {{MOBILE}}

We have paid all the dues as per the Debit Note.

Authorized Signature: _________________________

Date: {{CURRENT_DATE}}`;

  const defaultTransportTemplate = `TRANSPORT LETTER

Dear {{CUSTOMER_NAME}},

This letter is to inform you about the transportation arrangements for the upcoming exhibition.

Exhibition: {{EXHIBITION_NAME}}
Venue: {{EXHIBITION_VENUE}}
Dates: {{EXHIBITION_START_DATE}} to {{EXHIBITION_END_DATE}}

Company: {{COMPANY_NAME}}
Stall Numbers: {{STALL_NO}}
Contact: {{MOBILE}}

Please ensure all transportation arrangements are made according to the exhibition guidelines.

Thank you.`;

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
                    { min: 50, message: 'Template must be at least 50 characters' }
                  ]}
                >
                  <TextArea
                    rows={12}
                    placeholder={defaultStandPossessionTemplate}
                    showCount
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>
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
                    { min: 50, message: 'Template must be at least 50 characters' }
                  ]}
                >
                  <TextArea
                    rows={12}
                    placeholder={defaultTransportTemplate}
                    showCount
                    style={{ fontFamily: 'monospace' }}
                  />
                </Form.Item>
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
    </div>
  );
};

export default LetterSettings; 