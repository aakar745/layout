import React, { useState, useEffect } from 'react';
import { Form, Input, Typography, FormInstance, Card, Row, Col, Button, Space, Upload, App } from 'antd';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd/es/upload';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import api from '../../../services/api';

const { Title, Text } = Typography;

interface FooterSettingsProps {
  form: FormInstance;
}

const FooterSettings: React.FC<FooterSettingsProps> = ({ form }) => {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const getImageUrl = (path: string) => {
    const token = localStorage.getItem('token');
    const url = `${api.defaults.baseURL}/uploads/${path}`;
    return { url, token };
  };

  // Initialize fileList if there's an existing logo
  useEffect(() => {
    const existingLogo = form.getFieldValue('footerLogo');
    if (existingLogo) {
      const { url, token } = getImageUrl(existingLogo);
      
      // Fetch the image with authorization to create an object URL
      fetch(url, { headers: { authorization: `Bearer ${token}` } })
        .then(response => response.blob())
        .then(blob => {
          const objectUrl = URL.createObjectURL(blob);
          setFileList([{
            uid: '-1',
            name: existingLogo.split('/').pop() || 'logo',
            status: 'done' as UploadFileStatus,
            url: objectUrl,
            thumbUrl: objectUrl,
            type: blob.type,
            response: { path: existingLogo },
          }]);
        })
        .catch(() => {
          // Handle error silently - the upload component will show a broken image icon
          setFileList([]);
        });
    }
  }, [form]);

  const uploadProps: UploadProps = {
    name: 'file',
    action: `${api.defaults.baseURL}/exhibitions/upload/logos`,
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
      const { status, name, response } = info.file;
      
      if (status === 'uploading') {
        setFileList([...info.fileList]);
        return;
      }
      
      if (status === 'done' && response) {
        const { url, token } = getImageUrl(response.path);
        
        // Create object URL for the uploaded file
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
            form.setFieldValue('footerLogo', response.path);
          })
          .catch(() => {
            message.error(`${name} preview failed to load`);
            setFileList([]);
          });
      } else if (status === 'error') {
        message.error(`${name} upload failed.`);
        setFileList([]);
      } else if (status === 'removed') {
        setFileList([]);
        form.setFieldValue('footerLogo', null);
      }
    },
    onRemove() {
      setFileList([]);
      form.setFieldValue('footerLogo', null);
      return true;
    },
    onPreview: async (file) => {
      if (!file.url) return;
      
      const imgWindow = window.open('');
      if (imgWindow) {
        imgWindow.document.write(`
          <img src="${file.url}" style="max-width: 100%; height: auto;" 
               onload="this.style.marginTop = Math.max(0, (window.innerHeight - this.height) / 2) + 'px'"
          />
        `);
        imgWindow.document.head.innerHTML = '<title>Image Preview</title>';
      }
    },
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Card className="settings-card">
        <Title level={4}>Footer Content</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Configure the footer content and contact information
        </Text>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="footerLogo"
              label="Footer Logo"
              tooltip="Upload your footer logo (recommended size: 200x200px, max 2MB)"
            >
              <Upload {...uploadProps}>
                {fileList.length < 1 && (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload Logo</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="footerText"
              label="Footer Text"
              rules={[
                { required: true, message: 'Please enter footer text' },
                { max: 500, message: 'Text cannot be longer than 500 characters' }
              ]}
              tooltip="This text will appear in the footer section of your exhibition page"
            >
              <Input.TextArea 
                rows={4} 
                placeholder="Enter footer text"
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="contactEmail"
              label="Contact Email"
              rules={[
                { type: 'email', message: 'Please enter a valid email' },
                { max: 100, message: 'Email cannot be longer than 100 characters' }
              ]}
            >
              <Input placeholder="Enter contact email" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="contactPhone"
              label="Contact Phone"
              rules={[
                { pattern: /^[0-9-+()]*$/, message: 'Please enter a valid phone number' },
                { max: 20, message: 'Phone number cannot be longer than 20 characters' }
              ]}
            >
              <Input placeholder="Enter contact phone number" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card className="settings-card" style={{ marginTop: '24px' }}>
        <Title level={4}>Footer Links</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Add useful links to the footer section
        </Text>

        <Form.List name="footerLinks">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} style={{ marginBottom: '16px' }}>
                  <Col span={11}>
                    <Form.Item
                      {...restField}
                      name={[name, 'label']}
                      rules={[{ required: true, message: 'Please enter link label' }]}
                    >
                      <Input placeholder="Link Label" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'url']}
                      rules={[
                        { required: true, message: 'Please enter URL' },
                        { type: 'url', message: 'Please enter a valid URL' }
                      ]}
                    >
                      <Input placeholder="URL (e.g., https://example.com)" />
                    </Form.Item>
                  </Col>
                  <Col span={1} style={{ display: 'flex', alignItems: 'center' }}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Footer Link
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>
    </div>
  );
};

export default FooterSettings; 