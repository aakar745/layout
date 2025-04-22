import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Switch, Button, Select, Space, Typography, Row, Col, Upload, App, Progress } from 'antd';
import { SaveOutlined, UndoOutlined, UploadOutlined } from '@ant-design/icons';
import '../dashboard/Dashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchSettings, updateSettings, uploadLogo } from '../../store/slices/settingsSlice';
import type { UploadProps, UploadFile } from 'antd/es/upload';
import type { UploadFileStatus } from 'antd/es/upload/interface';
import api from '../../services/api';

const { Option } = Select;
const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { settings, loading } = useSelector((state: RootState) => state.settings);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [logoProgress, setLogoProgress] = useState<number>(0);

  // Load settings on component mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Update form when settings are loaded
  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        siteName: settings.siteName,
        adminEmail: settings.adminEmail,
        language: settings.language,
        timezone: settings.timezone,
        emailNotifications: settings.emailNotifications,
        footerText: settings.footerText,
      });

      // Initialize logo file list if logo exists
      if (settings.logo) {
        const getImageUrl = (path: string) => {
          const token = localStorage.getItem('token');
          const url = `${api.defaults.baseURL}/uploads/${path}`;
          return { url, token };
        };
        
        const { url, token } = getImageUrl(settings.logo);
        
        // Fetch the image with authorization to create an object URL
        fetch(url, { headers: { authorization: `Bearer ${token}` } })
          .then(response => response.blob())
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            setFileList([{
              uid: '-1',
              name: settings.logo?.split('/').pop() || 'logo',
              status: 'done' as UploadFileStatus,
              url: objectUrl,
              thumbUrl: objectUrl,
              type: blob.type,
              response: { path: settings.logo },
            }]);
          })
          .catch(() => {
            // Handle error silently
            setFileList([]);
          });
      }
    }
  }, [settings, form]);

  const onFinish = (values: any) => {
    dispatch(updateSettings(values)).unwrap()
      .then(() => message.success('Settings updated successfully'))
      .catch((error) => message.error(`Failed to update settings: ${error}`));
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: `${api.defaults.baseURL}/settings/upload/logo`,
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    maxCount: 1,
    accept: 'image/*',
    fileList,
    listType: "picture-card",
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
    onChange(info) {
      const { status, name, response, uid } = info.file;
      
      if (status === 'uploading') {
        setFileList([...info.fileList]);
        return;
      }
      
      if (status === 'done' && response) {
        setLogoProgress(0);
        
        // Create object URL for the uploaded file
        const token = localStorage.getItem('token');
        const url = `${api.defaults.baseURL}/uploads/${response.path}`;
        
        fetch(url, { headers: { authorization: `Bearer ${token}` } })
          .then(response => response.blob())
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            setFileList([{
              uid: info.file.uid,
              name,
              status: 'done' as UploadFileStatus,
              url: objectUrl,
              thumbUrl: objectUrl,
              type: blob.type,
              response,
            }]);
            message.success(`${name} uploaded successfully`);
            form.setFieldValue('logo', response.path);
          })
          .catch(() => {
            message.error(`${name} preview failed to load`);
            setFileList([]);
          });
      } else if (status === 'error') {
        message.error(`${name} upload failed.`);
        setFileList([]);
        setLogoProgress(0);
      } else if (status === 'removed') {
        setFileList([]);
        form.setFieldValue('logo', null);
        setLogoProgress(0);
      }
    },
    onRemove() {
      setFileList([]);
      form.setFieldValue('logo', null);
      setLogoProgress(0);
      return true;
    },
    customRequest: async ({ file, onSuccess, onError, onProgress }) => {
      try {
        // Use the Redux action to upload the logo
        dispatch(uploadLogo(file as File))
          .unwrap()
          .then((result) => {
            if (onSuccess) {
              onSuccess(result);
            }
          })
          .catch((error) => {
            if (onError) {
              onError(new Error(error));
            }
          });
      } catch (err) {
        if (onError) {
          onError(err as Error);
        }
      }
    }
  };

  // Custom upload button with progress indicator
  const uploadButton = (
    <div>
      {logoProgress > 0 ? (
        <div style={{ textAlign: 'center' }}>
          <Progress type="circle" percent={logoProgress} width={80} />
          <div style={{ marginTop: 8 }}>Uploading...</div>
        </div>
      ) : (
        <>
          <UploadOutlined />
          <div style={{ marginTop: 8 }}>Upload Logo</div>
        </>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0 }}>Settings</Title>
              <Text type="secondary">Configure system settings and preferences</Text>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Settings Form Section */}
      <Card className="info-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            siteName: 'Exhibition Management System',
            emailNotifications: true,
            language: 'en',
            timezone: 'UTC',
          }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Site Name"
                name="siteName"
                rules={[{ required: true, message: 'Please input the site name!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Admin Email"
                name="adminEmail"
                rules={[
                  { required: true, message: 'Please input the admin email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Language"
                name="language"
              >
                <Select>
                  <Option value="en">English</Option>
                  <Option value="es">Spanish</Option>
                  <Option value="fr">French</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Timezone"
                name="timezone"
              >
                <Select>
                  <Option value="UTC">UTC</Option>
                  <Option value="EST">EST</Option>
                  <Option value="PST">PST</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Email Notifications"
                name="emailNotifications"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Site Logo"
                name="logo"
                tooltip="Upload your site logo (recommended size: 200x200px, max 2MB)"
              >
                <Upload {...uploadProps}>
                  {fileList.length < 1 && uploadButton}
                </Upload>
                {fileList.length > 0 && logoProgress > 0 && (
                  <Progress percent={logoProgress} status="active" style={{ marginTop: 8 }} />
                )}
              </Form.Item>

              <Form.Item
                label="Footer Text"
                name="footerText"
              >
                <Input.TextArea rows={4} placeholder="Enter footer text (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                icon={<SaveOutlined />}
                loading={loading}
              >
                Save Settings
              </Button>
              <Button onClick={() => form.resetFields()} icon={<UndoOutlined />}>
                Reset
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings; 