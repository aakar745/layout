import React from 'react';
import { Card, Typography, Form, Switch, Divider, Button, Row, Col, Space, Alert } from 'antd';
import { MailOutlined, SaveOutlined } from '@ant-design/icons';
import { EmailNotificationSettings } from '../types';

const { Title, Text, Paragraph } = Typography;

interface EmailSettingsProps {
  settings: EmailNotificationSettings;
  onSave: (settings: EmailNotificationSettings) => void;
  loading: boolean;
}

const EmailSettings: React.FC<EmailSettingsProps> = ({
  settings,
  onSave,
  loading,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(settings);
  }, [settings, form]);

  const handleSubmit = (values: EmailNotificationSettings) => {
    onSave(values);
  };

  return (
    <Card
      title={
        <Space>
          <MailOutlined />
          <span>Email Notifications</span>
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      <Paragraph>
        Configure which notifications you want to receive via email. Email notifications will be sent to your registered email address.
      </Paragraph>
      
      <Alert
        message="Email Notifications"
        description="Email notifications help you stay updated even when you're not logged into the system."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={settings}
        onFinish={handleSubmit}
      >
        <Row gutter={[24, 16]}>
          <Col span={24}>
            <Form.Item
              name="newLeads"
              valuePropName="checked"
              label={<Text strong>New Lead Notifications</Text>}
            >
              <Switch />
            </Form.Item>
            <Paragraph type="secondary" style={{ marginTop: -16, marginBottom: 16 }}>
              Receive email when new leads are created or assigned to you
            </Paragraph>
          </Col>

          <Col span={24}>
            <Form.Item
              name="followUpReminders"
              valuePropName="checked"
              label={<Text strong>Follow-up Reminders</Text>}
            >
              <Switch />
            </Form.Item>
            <Paragraph type="secondary" style={{ marginTop: -16, marginBottom: 16 }}>
              Receive reminders for upcoming follow-ups
            </Paragraph>
          </Col>

          <Col span={24}>
            <Form.Item
              name="statusChanges"
              valuePropName="checked"
              label={<Text strong>Status Change Notifications</Text>}
            >
              <Switch />
            </Form.Item>
            <Paragraph type="secondary" style={{ marginTop: -16, marginBottom: 16 }}>
              Receive notifications when lead statuses are updated
            </Paragraph>
          </Col>

          <Col span={24}>
            <Form.Item
              name="leadAssignments"
              valuePropName="checked"
              label={<Text strong>Lead Assignment Notifications</Text>}
            >
              <Switch />
            </Form.Item>
            <Paragraph type="secondary" style={{ marginTop: -16, marginBottom: 16 }}>
              Receive notifications when leads are assigned to you
            </Paragraph>
          </Col>
        </Row>

        <Divider />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={loading}
          >
            Save Email Preferences
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EmailSettings; 