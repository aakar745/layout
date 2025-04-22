import React, { useState, useEffect } from 'react';
import { Form, Input, Typography, FormInstance, Card, Row, Col, Upload, App, Button, Divider, Progress } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { UploadProps, RcFile } from 'antd/es/upload';
import type { UploadFile, UploadFileStatus } from 'antd/es/upload/interface';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import api from '../../../services/api';

const { Title, Text } = Typography;

interface HeaderSettingsProps {
  form: FormInstance;
}

const HeaderSettings: React.FC<HeaderSettingsProps> = ({ form }) => {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [sponsorFileList, setSponsorFileList] = useState<UploadFile[]>([]);
  const [headerLogoProgress, setHeaderLogoProgress] = useState<number>(0);
  const [sponsorLogoProgress, setSponsorLogoProgress] = useState<{ [key: string]: number }>({});
  
  const getImageUrl = (path: string) => {
    const token = localStorage.getItem('token');
    const url = `${api.defaults.baseURL}/uploads/${path}`;
    return { url, token };
  };
  
  // Initialize fileList if there's an existing logo
  useEffect(() => {
    const existingLogo = form.getFieldValue('headerLogo');
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

  // Initialize sponsorFileList if there are existing sponsor logos
  useEffect(() => {
    const existingSponsorLogos = form.getFieldValue('sponsorLogos') || [];
    if (existingSponsorLogos.length > 0) {
      Promise.all(
        existingSponsorLogos.map(async (logo: string, index: number) => {
          const { url, token } = getImageUrl(logo);
          try {
            const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            return {
              uid: `-${index + 1}`,
              name: logo.split('/').pop() || `sponsor-${index + 1}`,
              status: 'done' as UploadFileStatus,
              url: objectUrl,
              thumbUrl: objectUrl,
              type: blob.type,
              response: { path: logo },
            };
          } catch {
            return null;
          }
        })
      ).then((files) => {
        setSponsorFileList(files.filter(Boolean) as UploadFile[]);
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
      const { status, name, response, uid } = info.file;
      
      if (status === 'uploading') {
        setFileList([...info.fileList]);
        return;
      }
      
      if (status === 'done' && response) {
        const { url, token } = getImageUrl(response.path);
        
        // Reset progress when done
        setHeaderLogoProgress(0);
        
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
            form.setFieldValue('headerLogo', response.path);
            
            // If thumbnail is available, store it as well
            if (response.thumbnail) {
              form.setFieldValue('headerLogoThumbnail', response.thumbnail);
            }
          })
          .catch(() => {
            message.error(`${name} preview failed to load`);
            setFileList([]);
          });
      } else if (status === 'error') {
        message.error(`${name} upload failed.`);
        setFileList([]);
        setHeaderLogoProgress(0);
      } else if (status === 'removed') {
        setFileList([]);
        form.setFieldValue('headerLogo', null);
        form.setFieldValue('headerLogoThumbnail', null);
        setHeaderLogoProgress(0);
      }
    },
    customRequest: async (options: UploadRequestOption) => {
      const { onProgress, onSuccess, onError, file, action, headers } = options;
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', action || '', true);
        
        // Set headers
        if (headers) {
          Object.keys(headers).forEach(key => {
            xhr.setRequestHeader(key, headers[key]);
          });
        }
        
        // Handle progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            onProgress({ percent: (event.loaded / event.total) * 100 });
            setHeaderLogoProgress(Math.round((event.loaded / event.total) * 100));
          }
        };
        
        // Handle completion
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.response);
              onSuccess?.(response, file);
              setHeaderLogoProgress(0);
            } catch (e) {
              onError?.(e as Error);
            }
          } else {
            onError?.(new Error('Upload failed'));
          }
        };
        
        // Handle error
        xhr.onerror = () => {
          setHeaderLogoProgress(0);
          onError?.(new Error('Upload request failed'));
        };
        
        // Send the request
        xhr.send(formData);
      } catch (err) {
        setHeaderLogoProgress(0);
        onError?.(err as Error);
      }
    },
    onRemove() {
      setFileList([]);
      form.setFieldValue('headerLogo', null);
      form.setFieldValue('headerLogoThumbnail', null);
      setHeaderLogoProgress(0);
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

  const sponsorUploadProps: UploadProps = {
    name: 'file',
    action: `${api.defaults.baseURL}/exhibitions/upload/sponsors`,
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    accept: 'image/*',
    fileList: sponsorFileList,
    listType: "picture-card",
    multiple: true,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
    },
    onChange(info) {
      const { status, name, response, uid } = info.file;
      
      if (status === 'uploading') {
        setSponsorFileList([...info.fileList]);
        return;
      }
      
      if (status === 'done' && response && response.paths && response.paths.length > 0) {
        // Reset progress when done
        setSponsorLogoProgress(prev => {
          const updated = { ...prev };
          delete updated[uid];
          return updated;
        });
        
        // Get the path for this specific file
        const path = response.paths[0];
        const { url, token } = getImageUrl(path);
        
        // Create object URL for the uploaded file
        fetch(url, { headers: { authorization: `Bearer ${token}` } })
          .then(response => response.blob())
          .then(blob => {
            const objectUrl = URL.createObjectURL(blob);
            const updatedFileList = [...sponsorFileList];
            const fileIndex = updatedFileList.findIndex(file => file.uid === info.file.uid);
            
            const newFile = {
              uid: info.file.uid,
              name,
              status: 'done' as UploadFileStatus,
              url: objectUrl,
              thumbUrl: objectUrl,
              type: blob.type,
              response: { path }, // Store just the path
            };

            if (fileIndex > -1) {
              updatedFileList[fileIndex] = newFile;
            } else {
              updatedFileList.push(newFile);
            }

            setSponsorFileList(updatedFileList);
            message.success(`${name} uploaded successfully`);
            
            // Update form field with all sponsor logo paths
            const sponsorLogos = updatedFileList
              .filter(file => file.status === 'done' && file.response?.path)
              .map(file => file.response.path);
            form.setFieldValue('sponsorLogos', sponsorLogos);
            
            // If thumbnails are available, store them as well
            if (response.thumbnails && response.thumbnails.length > 0) {
              const sponsorLogoThumbnails = form.getFieldValue('sponsorLogoThumbnails') || [];
              form.setFieldValue('sponsorLogoThumbnails', [...sponsorLogoThumbnails, ...response.thumbnails]);
            }
          })
          .catch(() => {
            message.error(`${name} preview failed to load`);
            // Remove the failed file from the list
            setSponsorFileList(prevList => prevList.filter(file => file.uid !== info.file.uid));
          });
      } else if (status === 'error') {
        message.error(`${name} upload failed.`);
        // Remove the failed file from the list
        setSponsorFileList(prevList => prevList.filter(file => file.uid !== info.file.uid));
        
        // Reset progress for this file
        setSponsorLogoProgress(prev => {
          const updated = { ...prev };
          delete updated[uid];
          return updated;
        });
      } else if (status === 'removed') {
        // Reset progress for this file
        setSponsorLogoProgress(prev => {
          const updated = { ...prev };
          delete updated[uid];
          return updated;
        });
      }
    },
    customRequest: async (options: UploadRequestOption) => {
      const { onProgress, onSuccess, onError, file, action, headers } = options;
      const fileId = typeof file === 'object' && 'uid' in file ? file.uid : String(Date.now());
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', action || '', true);
        
        // Set headers
        if (headers) {
          Object.keys(headers).forEach(key => {
            xhr.setRequestHeader(key, headers[key]);
          });
        }
        
        // Handle progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress({ percent });
            
            // Update our custom progress state
            setSponsorLogoProgress(prev => ({
              ...prev,
              [fileId]: Math.round(percent)
            }));
          }
        };
        
        // Handle completion
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.response);
              onSuccess?.(response, file);
              
              // Reset progress when done
              setSponsorLogoProgress(prev => {
                const updated = { ...prev };
                delete updated[fileId];
                return updated;
              });
            } catch (e) {
              onError?.(e as Error);
            }
          } else {
            onError?.(new Error('Upload failed'));
          }
        };
        
        // Handle error
        xhr.onerror = () => {
          // Reset progress on error
          setSponsorLogoProgress(prev => {
            const updated = { ...prev };
            delete updated[fileId];
            return updated;
          });
          onError?.(new Error('Upload request failed'));
        };
        
        // Send the request
        xhr.send(formData);
      } catch (err) {
        setSponsorLogoProgress(prev => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
        onError?.(err as Error);
      }
    },
    onRemove(file) {
      const updatedFileList = sponsorFileList.filter(item => item.uid !== file.uid);
      setSponsorFileList(updatedFileList);
      
      // Update logo paths
      const sponsorLogos = updatedFileList
        .filter(file => file.status === 'done' && file.response?.path)
        .map(file => file.response.path);
      form.setFieldValue('sponsorLogos', sponsorLogos);
      
      // Update thumbnails as well if they're being stored
      const existingThumbnails = form.getFieldValue('sponsorLogoThumbnails') || [];
      if (existingThumbnails.length > 0) {
        // Try to find the thumbnail based on the file path
        if (file.response?.path) {
          const filePathParts = file.response.path.split('/');
          const fileName = filePathParts[filePathParts.length - 1];
          
          // Remove the matching thumbnail
          const updatedThumbnails = existingThumbnails.filter((thumb: string) => 
            !thumb.includes(fileName)
          );
          form.setFieldValue('sponsorLogoThumbnails', updatedThumbnails);
        }
      }
      
      // Reset progress for this file
      setSponsorLogoProgress(prev => {
        const updated = { ...prev };
        delete updated[file.uid];
        return updated;
      });
      
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

  // Custom upload button with progress indicator
  const uploadButton = (
    <div>
      {headerLogoProgress > 0 ? (
        <div style={{ textAlign: 'center' }}>
          <Progress type="circle" percent={headerLogoProgress} width={80} />
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

  // Custom sponsor upload button with indicator
  const sponsorUploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Upload Sponsor Logos</div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Card className="settings-card">
        <Title level={4}>Header Settings</Title>
        <Text type="secondary" style={{ marginBottom: '24px', display: 'block' }}>
          Configure how the exhibition header appears to visitors
        </Text>

        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              name="headerLogo"
              label="Header Logo"
              tooltip="Upload your exhibition logo (recommended size: 200x200px, max 2MB)"
            >
              <Upload {...uploadProps}>
                {fileList.length < 1 && uploadButton}
              </Upload>
              {fileList.length > 0 && headerLogoProgress > 0 && (
                <Progress percent={headerLogoProgress} status="active" style={{ marginTop: 8 }} />
              )}
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="headerTitle"
              label="Header Title"
              rules={[
                { required: true, message: 'Please enter a header title' },
                { max: 100, message: 'Title cannot be longer than 100 characters' }
              ]}
              tooltip="This title will be prominently displayed at the top of your exhibition page"
            >
              <Input placeholder="Enter a title for your exhibition header" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="headerSubtitle"
              label="Header Subtitle"
              rules={[
                { max: 200, message: 'Subtitle cannot be longer than 200 characters' }
              ]}
              tooltip="A brief tagline or subtitle to provide additional context"
            >
              <Input placeholder="Enter a subtitle (optional)" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="headerDescription"
              label="Header Description"
              rules={[
                { max: 500, message: 'Description cannot be longer than 500 characters' }
              ]}
              tooltip="A detailed description that appears in the header section"
            >
              <Input.TextArea
                placeholder="Enter a description for your exhibition header (optional)"
                rows={4}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Divider />
            <Title level={5}>Sponsor Logos</Title>
            <Text type="secondary" style={{ marginBottom: '16px', display: 'block' }}>
              Add sponsor logos that will be displayed in the exhibition header
            </Text>
            <Form.Item
              name="sponsorLogos"
              tooltip="Upload sponsor logos (recommended size: 150x150px, max 2MB each)"
            >
              <Upload {...sponsorUploadProps}>
                {sponsorUploadButton}
              </Upload>
              
              {/* Progress indicators for sponsor logos */}
              {Object.entries(sponsorLogoProgress).map(([uid, percent]) => (
                <div key={uid} style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
                  <Text style={{ marginRight: 10, width: 150 }} ellipsis>
                    {sponsorFileList.find(f => f.uid === uid)?.name || 'File'}:
                  </Text>
                  <Progress percent={percent} status="active" style={{ flex: 1 }} />
                </div>
              ))}
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default HeaderSettings; 