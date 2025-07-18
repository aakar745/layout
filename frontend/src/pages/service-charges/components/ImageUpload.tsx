import React from 'react';
import { Upload, message, Typography } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { UploadOutlined } from '@ant-design/icons';
import heic2any from 'heic2any';
import api from '../../../services/api';
import { UploadState } from '../types';

const { Text } = Typography;

interface ImageUploadProps extends UploadState {
  // No additional props needed as UploadState contains all required props
}

const ImageUpload: React.FC<ImageUploadProps> = ({ fileList, setFileList, setFormData }) => {
  const uploadProps: UploadProps = {
    name: 'uploadedImage',
    action: `${api.defaults.baseURL}/public/service-charge/upload`,
    headers: {
      // No authorization needed for public uploads
    },
    accept: 'image/*,.heic,.HEIC',
    maxCount: 1,
    fileList,
    listType: 'picture-card',
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
    onPreview: (file) => {
      const imageUrl = file.url || file.thumbUrl;
      if (imageUrl) {
        window.open(imageUrl, '_blank');
      }
    },
    customRequest: async (options) => {
      const { file, onSuccess, onError, onProgress } = options;
      
      // Ensure we have a File object
      if (typeof file === 'string') {
        onError?.(new Error('Invalid file type'));
        return;
      }
      
      let fileToUpload = file as File;
      const originalName = (file as any).name || fileToUpload.name;
      
      // Check if this is a HEIC file and convert it
      if (originalName && originalName.toLowerCase().endsWith('.heic')) {
        try {
          console.log('[HEIC Conversion] Converting HEIC to JPEG...');
          message.loading('Converting HEIC to JPEG...', 0);
          
          const convertedBlob = await heic2any({
            blob: fileToUpload,
            toType: 'image/jpeg',
            quality: 0.8
          }) as Blob;
          
          fileToUpload = new File(
            [convertedBlob], 
            originalName.replace(/\.heic$/i, '.jpg'), 
            { type: 'image/jpeg' }
          );
          
          console.log('[HEIC Conversion] Successfully converted to JPEG');
          message.destroy();
        } catch (error) {
          console.error('[HEIC Conversion] Error:', error);
          message.destroy();
          message.error('Failed to convert HEIC file. Please try a different image.');
          onError?.(error as Error);
          return;
        }
      }
      
      // Upload the file (original or converted)
      const formData = new FormData();
      formData.append('uploadedImage', fileToUpload);
      
      try {
        const response = await fetch(`${api.defaults.baseURL}/public/service-charge/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          onSuccess?.(result, fileToUpload);
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } catch (error) {
        console.error('[Upload Error]:', error);
        onError?.(error as Error);
      }
    },
    beforeUpload: (file) => {
      console.log('[Frontend Upload] File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Check file size - 10MB limit
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('Image must be smaller than 10MB!');
        return false;
      }
      
      // Check file extension (more reliable than MIME type for HEIC)
      const fileName = file.name.toLowerCase();
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.heic'];
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      
      // Check MIME type for non-HEIC files (HEIC files can have various MIME types)
      const isStandardImage = file.type.startsWith('image/');
      const isHeicFile = fileName.endsWith('.heic');
      
      if (!hasValidExtension) {
        message.error('Please upload a valid image file (JPG, PNG, GIF, SVG, HEIC)!');
        return false;
      }
      
      // For non-HEIC files, also check MIME type
      if (!isHeicFile && !isStandardImage) {
        message.error('Invalid file type. Please upload an image file!');
        return false;
      }
      
      console.log('[Frontend Upload] File validation passed:', fileName);
      return true;
    },
    onChange(info) {
      const { status, name, response } = info.file;
      
      if (status === 'uploading') {
        setFileList([...info.fileList]);
        return;
      }
      
      if (status === 'done' && response && response.success) {
        console.log('[File Upload] Upload successful:', response);
        
        // Create the file list item with proper URL for display
        const fileListItem = {
          uid: info.file.uid,
          name,
          status: 'done' as const,
          response,
          // Always set the URL since HEIC files are now converted to JPEG
          url: `${api.defaults.baseURL}/public/uploads/${response.path}`,
          thumbUrl: `${api.defaults.baseURL}/public/uploads/${response.path}`
        };
        
        setFileList([fileListItem]);
        setFormData(prev => ({ ...prev, uploadedImage: response.path }));
        
        // Show specific message for HEIC files that were converted
        if (name.toLowerCase().includes('heic') && name.toLowerCase().endsWith('.jpg')) {
          message.success(`HEIC file uploaded successfully! Converted to JPEG for web display.`);
        } else {
          message.success(`${name} uploaded successfully`);
        }
      } else if (status === 'error') {
        console.error('[Upload Error] Details:', {
          name,
          response,
          error: info.file.error
        });
        
        // Handle structured error responses from backend
        if (response?.error === 'LIMIT_FILE_SIZE') {
          message.error(`${name} is too large. Maximum file size is 10MB.`);
        } else if (response?.error === 'INVALID_FILE_TYPE') {
          message.error(`${name} is not a supported file type. Please upload JPG, PNG, GIF, SVG, or HEIC files.`);
        } else if (response?.message) {
          // Use the specific error message from backend
          message.error(response.message);
        } else {
          // Fallback for other errors
          message.error(`${name} upload failed. Please try again.`);
        }
        setFileList([]);
      } else if (status === 'removed') {
        setFileList([]);
        setFormData(prev => ({ ...prev, uploadedImage: '' }));
      }
    },
    onRemove() {
      setFileList([]);
      setFormData(prev => ({ ...prev, uploadedImage: '' }));
      return true;
    }
  };

  return (
    <div>
      <Upload {...uploadProps}>
        {fileList.length < 1 && (
          <div style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
            <UploadOutlined style={{ fontSize: '24px', color: '#999', marginBottom: '8px' }} />
            <div style={{ color: '#666' }}>Click to upload image</div>
          </div>
        )}
      </Upload>
      <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
        Supported formats: JPG, PNG, GIF, SVG, HEIC (Max size: 10MB)
      </Text>
    </div>
  );
};

export default ImageUpload; 