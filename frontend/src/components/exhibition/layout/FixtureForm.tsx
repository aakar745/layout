import React, { useState, useEffect, useRef } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, Slider, Space, ColorPicker, Upload, Typography, Row, Col, Segmented, Tabs, Card, message, Switch } from 'antd';
import { DeleteOutlined, UploadOutlined, InfoCircleOutlined, SaveOutlined, CloseOutlined, SettingOutlined, AppstoreOutlined, LinkOutlined, RotateRightOutlined, EnvironmentOutlined, ColumnWidthOutlined, PictureOutlined } from '@ant-design/icons';
import { Fixture } from '../../../services/exhibition';
import { Color } from 'antd/es/color-picker';
import api from '../../../services/api';
import type { UploadFile, UploadProps } from 'antd';
import { App } from 'antd';
import { getDirectBackendUrl, fetchAuthenticatedImage } from '../../../services/imageUtils';
import FixturePreview from './FixturePreview';
import { getTabItems } from './FixtureTab';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

interface FixtureFormProps {
  visible: boolean;
  fixture: Fixture | null;
  onCancel: () => void;
  onSubmit: (fixture: Fixture) => void;
  onDelete?: (fixture: Fixture) => void;
  exhibitionWidth: number;
  exhibitionHeight: number;
}

// Predefined fixture types
const fixtureTypes = [
  { value: 'sofa', label: 'Sofa' },
  { value: 'chair', label: 'Chair' },
  { value: 'table', label: 'Table' },
  { value: 'desk', label: 'Desk' },
  { value: 'plant', label: 'Plant' },
  { value: 'entrance', label: 'Entrance' },
  { value: 'exit', label: 'Exit' },
  { value: 'info', label: 'Information' },
  { value: 'restroom', label: 'Restroom' },
  { value: 'food', label: 'Food Area' },
  { value: 'custom', label: 'Custom' }
];

// Default dimensions by fixture type
const defaultDimensions: Record<string, { width: number; height: number }> = {
  sofa: { width: 2, height: 1 },
  chair: { width: 5, height: 5 },
  table: { width: 1, height: 1 },
  desk: { width: 2, height: 0.8 },
  plant: { width: 0.5, height: 0.5 },
  entrance: { width: 1.5, height: 0.2 },
  exit: { width: 1.5, height: 0.2 },
  info: { width: 1, height: 1 },
  restroom: { width: 1, height: 1 },
  food: { width: 2, height: 2 },
  custom: { width: 1, height: 1 }
};

// Default colors by fixture type
const defaultColors: Record<string, string> = {
  sofa: '#a0d0ff',
  chair: '#a0d0ff',
  table: '#e0e0e0',
  desk: '#e0e0e0',
  plant: '#90ee90',
  entrance: '#98fb98',
  exit: '#ffcccb',
  info: '#add8e6',
  restroom: '#d8bfd8',
  food: '#ffe4b5',
  custom: '#f0f0f0'
};

// Icons or emojis for fixture types
const fixtureIcons: Record<string, string> = {
  sofa: '🛋️',
  chair: '🪑',
  table: '🪟',
  desk: '🖥️',
  plant: '🪴',
  entrance: '🚪',
  exit: '🚪',
  info: 'ℹ️',
  restroom: '🚻',
  food: '🍽️',
  custom: '📦'
};

const FixtureForm: React.FC<FixtureFormProps> = ({
  visible,
  fixture,
  onCancel,
  onSubmit,
  onDelete,
  exhibitionWidth,
  exhibitionHeight
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('basic');
  const [iconUrl, setIconUrl] = useState<string>('');
  const [iconFileList, setIconFileList] = useState<UploadFile[]>([]);
  const [iconPreviewVisible, setIconPreviewVisible] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const { message } = App.useApp();
  
  // Track preview states separately from form
  const [effectiveColor, setEffectiveColor] = useState<string>('#f0f0f0');
  const [previewName, setPreviewName] = useState<string>('New Fixture');
  const [previewType, setPreviewType] = useState<string>('chair');
  const [previewRotation, setPreviewRotation] = useState<number>(0);
  const [showName, setShowName] = useState<boolean>(true);
  const [borderColor, setBorderColor] = useState<string | null>(null);
  const [borderRadius, setBorderRadius] = useState<number>(0);

  // Initialize preview state when modal or fixture changes
  useEffect(() => {
    if (visible) {
      if (fixture) {
        const normalizedColor = normalizeColor(fixture.color);
        const fallbackColor = defaultColors[fixture.type] || '#f0f0f0';
        const finalColor = normalizedColor || fallbackColor;
        
        console.log('Setting up fixture colors:', {
          original: fixture.color,
          normalized: normalizedColor,
          fallback: fallbackColor,
          final: finalColor
        });
        
        setEffectiveColor(finalColor);
        setPreviewName(fixture.name);
        setPreviewType(fixture.type);
        setPreviewRotation(fixture.rotation || 0);
        setSelectedType(fixture.type);
        setShowName(fixture.showName !== false);
        
        // Set border properties if they exist
        setBorderColor(fixture.borderColor || null);
        setBorderRadius(fixture.borderRadius || 0);
      } else {
        const defaultType = 'chair';
        const defaultColor = defaultColors[defaultType];
        
        setEffectiveColor(defaultColor);
        setPreviewName('New Fixture');
        setPreviewType(defaultType);
        setPreviewRotation(0);
        setSelectedType(defaultType);
        setShowName(true);
        setBorderColor(null);
        setBorderRadius(0);
      }
    }
  }, [visible, fixture]);

  // Reset form when modal becomes visible or fixture changes
  useEffect(() => {
    if (visible && form) {
      if (fixture) {
        const normalizedColor = normalizeColor(fixture.color);
        const fallbackColor = defaultColors[fixture.type] || '#f0f0f0';
        const finalColor = normalizedColor || fallbackColor;
        
        form.setFieldsValue({
          name: fixture.name,
          type: fixture.type,
          position: {
            x: fixture.position.x,
            y: fixture.position.y
          },
          dimensions: {
            width: fixture.dimensions.width,
            height: fixture.dimensions.height
          },
          rotation: fixture.rotation || 0,
          color: finalColor,
          icon: fixture.icon || '',
          showName: fixture.showName !== false,
          borderColor: fixture.borderColor || null,
          borderRadius: fixture.borderRadius || 0
        });
        
        // Set icon URL and file list if fixture has an icon
        const authIconUrl = fixture.icon ? getDirectBackendUrl(fixture.icon) : '';
        setIconUrl(authIconUrl);
        if (fixture.icon) {
          setIconFileList([{
            uid: '-1',
            name: fixture.icon.split('/').pop() || 'icon',
            status: 'done',
            url: authIconUrl,
            thumbUrl: authIconUrl
          }]);
        } else {
          setIconFileList([]);
        }
      } else {
        // Set default values for new fixture
        const defaultType = 'chair';
        const defaultColor = defaultColors[defaultType];
        
        form.setFieldsValue({
          name: 'New Fixture',
          type: defaultType,
          position: {
            x: Math.floor(exhibitionWidth / 2),
            y: Math.floor(exhibitionHeight / 2)
          },
          dimensions: defaultDimensions[defaultType],
          rotation: 0,
          color: defaultColor,
          icon: '',
          showName: true,
          borderColor: null,
          borderRadius: 0
        });
        setIconUrl('');
        setIconFileList([]);
      }
      setActiveTab('basic');
    }
  }, [visible, fixture, form, exhibitionWidth, exhibitionHeight]);

  // Update preview when form fields change
  const updatePreviewFromForm = () => {
    if (form && visible) {
      try {
        // Get current form values without validation
        const values = form.getFieldsValue(true);
        
        // Update preview states if values have changed
        if (values.name) setPreviewName(values.name);
        if (values.type) setPreviewType(values.type);
        if (values.rotation !== undefined) setPreviewRotation(values.rotation);
        if (values.color) {
          const normalizedColor = normalizeColor(values.color);
          if (normalizedColor) setEffectiveColor(normalizedColor);
        }
        if (values.showName !== undefined) setShowName(values.showName);
        
        // Update border properties
        if (values.borderColor !== undefined) {
          const normalizedBorderColor = values.borderColor ? normalizeColor(values.borderColor) : null;
          setBorderColor(normalizedBorderColor);
        }
        if (values.borderRadius !== undefined) {
          setBorderRadius(values.borderRadius);
        }
      } catch (error) {
        // Fail silently - don't break the form if we can't update the preview
        console.log('Error updating preview', error);
      }
    }
  };

  // Setup field change listeners
  useEffect(() => {
    if (form && visible) {
      // Listen for form field changes
      const unsubscribe = form.getFieldsValue;
      // Initial update
      updatePreviewFromForm();
      
      return () => {
        // No cleanup needed
      };
    }
  }, [form, visible]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setPreviewType(type); // Update preview immediately
    
    // If it's a new fixture, update dimensions and color based on type
    if (!fixture) {
      const typeColor = defaultColors[type] || defaultColors.custom;
      form.setFieldsValue({
        dimensions: defaultDimensions[type] || defaultDimensions.custom,
        color: typeColor
      });
      
      // Update effective color for preview
      setEffectiveColor(typeColor);
    }
  };

  // Simplified handler for color changes
  const handleColorChange = (color: any) => {
    // Convert color to simple hex string to avoid circular references
    const normalizedColor = normalizeColor(color);
    
    // Update form field with string value, not the complex color object
    form.setFieldValue('color', normalizedColor);
    
    // Immediately update the effective color for preview
    setEffectiveColor(normalizedColor);
    
    // If type is not set and this is a known color, set the fixture type
    const matchingType = Object.entries(defaultColors).find(
      ([_, typeColor]) => typeColor.toLowerCase() === normalizedColor.toLowerCase()
    );
    
    if (matchingType && !fixture) {
      form.setFieldValue('type', matchingType[0]);
      setSelectedType(matchingType[0]);
      setPreviewType(matchingType[0]);
    }
  };

  // Using the new FixturePreview component instead of the renderFixturePreview function
  const renderFixturePreview = () => {
    console.log('Rendering fixture preview with:', {
      name: previewName,
      type: previewType,
      color: effectiveColor,
      rotation: previewRotation,
      showName: showName,
      iconUrl,
      borderColor,
      borderRadius
    });
    
    return (
      <FixturePreview
        name={previewName}
        type={previewType}
        color={effectiveColor}
        rotation={previewRotation}
        showName={showName}
        iconUrl={iconUrl}
        defaultIcons={fixtureIcons}
        borderColor={borderColor}
        borderRadius={borderRadius}
      />
    );
  };

  // Handle icon upload
  const handleIconUpload: UploadProps['onChange'] = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      setIconFileList(fileList);
    }
    
    if (file.status === 'done') {
      message.success(`${file.name} uploaded successfully`);
      
      // Extract path from response - the server returns { url: "/api/uploads/fixtures/filename.jpg", success: true }
      const responsePath = file.response?.url || '';
      
      // Store path in a consistent format - ensure it starts with 'fixtures/'
      let iconPath = responsePath.replace(/^\/api\/uploads\//, '');
      
      // Ensure path has the 'fixtures/' prefix
      if (iconPath && !iconPath.startsWith('fixtures/')) {
        iconPath = `fixtures/${iconPath.replace(/^\//, '')}`;
      }
      
      console.log('Icon path stored in form:', iconPath);
      
      // Explicitly set the form value for the icon field
      form.setFieldValue('icon', iconPath);
      
      // Get direct backend URL for display
      const directIconUrl = getDirectBackendUrl(iconPath);
      console.log('Using direct backend URL:', directIconUrl);
      setIconUrl(directIconUrl);
      
      // Check if this is an SVG file
      const isSvg = file.name.toLowerCase().endsWith('.svg');
      
      // Update file list with direct backend URL
      const updatedFileList = fileList.map(f => {
        if (f.uid === file.uid) {
          // For SVG files, set a special attribute for rendering
          return {
            ...f,
            url: directIconUrl,
            thumbUrl: directIconUrl,
            type: isSvg ? 'image/svg+xml' : f.type
          };
        }
        return f;
      });
      setIconFileList(updatedFileList);
      
      // Log form values after icon upload for debugging
      console.log('Form values after icon upload:', form.getFieldsValue(true));
    }
    
    if (file.status === 'error') {
      message.error(`${file.name} upload failed.`);
      setIconFileList(fileList.filter(f => f.uid !== file.uid));
    }
  };
  
  // Configure upload props
  const uploadProps: UploadProps = {
    name: 'file',
    action: `${api.defaults.baseURL}/fixtures/upload/icons`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    accept: 'image/png,image/jpeg,image/jpg,image/svg+xml',
    listType: 'picture-card',
    fileList: iconFileList,
    onChange: handleIconUpload,
    onPreview: (file) => {
      setPreviewImage(file.url || file.thumbUrl || '');
      setIconPreviewVisible(true);
    },
    onRemove: () => {
      // Clear icon URL and form field value when icon is removed
      setIconUrl('');
      setIconFileList([]);
      
      // Explicitly set the icon field to empty string
      form.setFieldValue('icon', '');
      
      // Check form values after icon removal
      console.log('Form values after icon removal:', form.getFieldsValue(true));
      return true;
    },
    maxCount: 1,
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
      removeIcon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
    }
  };

  // Helper function to normalize color values to valid hex
  const normalizeColor = (color: any): string => {
    try {
      // Handle null or undefined
      if (!color) return '#f0f0f0';
      
      // If it's a Color object from Ant Design ColorPicker
      if (typeof color === 'object' && color !== null) {
        // Use toHexString if available (Ant Design Color object)
        if (typeof color.toHexString === 'function') {
          return color.toHexString();
        }
        
        // If it has an RGB or HEX representation
        if (color.rgb || color.hex) {
          return color.hex || `rgb(${color.rgb.r},${color.rgb.g},${color.rgb.b})`;
        }
      }
      
      // If it's a string, ensure it's a valid color format
      if (typeof color === 'string') {
        // If it's already a valid hex color with # prefix
        if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
          return color;
        }
        
        // If it's a hex without #, add it
        if (/^([0-9A-F]{3}){1,2}$/i.test(color)) {
          return `#${color}`;
        }
        
        // If it's a valid RGB format, keep it as is
        if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) {
          return color;
        }
      }
      
      // Default fallback color
      return '#f0f0f0';
    } catch (error) {
      console.error('Error normalizing color:', error);
      return '#f0f0f0';
    }
  };

  // Group colors by category for better organization
  const colorPresets = [
    {
      label: 'Primary Colors',
      colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']
    },
    {
      label: 'Neutrals',
      colors: ['#000000', '#262626', '#595959', '#8c8c8c', '#bfbfbf', '#d9d9d9', '#f0f0f0', '#ffffff']
    }
  ];

  const memoizedHandleDelete = React.useCallback(() => {
    if (fixture && onDelete) {
      onDelete(fixture);
    }
  }, [fixture, onDelete]);

  // Handle tab changes with proper focus management
  const handleTabChange = (key: string) => {
    // First change the tab
    setActiveTab(key);
    
    // Then blur any potentially focused elements to avoid accessibility issues
    // This prevents the warning about aria-hidden on elements with focus
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Function to get the tab items
  const tabItems = getTabItems({
    form,
    fixture,
    exhibitionWidth,
    exhibitionHeight,
    selectedType,
    showName,
    iconFileList,
    fixtureTypes,
    fixtureIcons,
    defaultColors,
    defaultDimensions,
    colorPresets,
    uploadProps,
    iconPreviewVisible,
    previewImage,
    onTypeChange: handleTypeChange,
    onColorChange: handleColorChange,
    onShowNameChange: (checked) => setShowName(checked),
    onIconPreviewCancel: () => setIconPreviewVisible(false),
    activeKey: activeTab
  });

  const handleSubmit = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      
      // Update preview with final values
      setPreviewName(values.name);
      setPreviewType(values.type);
      setPreviewRotation(values.rotation || 0);
      setEffectiveColor(normalizeColor(values.color));
      setShowName(values.showName);
      
      // Update border properties
      setBorderColor(values.borderColor ? normalizeColor(values.borderColor) : null);
      setBorderRadius(values.borderRadius || 0);
      
      // Use the helper function to clean the icon path
      // Preserve original icon if the form field is empty but we had an icon before
      let iconPath = '';
      if (values.icon) {
        iconPath = cleanIconPath(values.icon);
      } else if (fixture?.icon) {
        // If editing and no new icon specified, keep original icon
        iconPath = fixture.icon;
      }
      
      // Log before submission for debugging
      console.log('Form values being submitted:', {
        name: values.name,
        type: values.type,
        color: values.color,
        icon: values.icon,
        originalIcon: fixture?.icon,
        cleanedIcon: iconPath,
        showName: values.showName,
        borderColor: values.borderColor,
        borderRadius: values.borderRadius
      });
      
      // Use the most consistent ID approach
      const fixtureId = fixture?._id || fixture?.id || '';
      
      // Normalize color to ensure valid format
      // Make sure we preserve the original color if normalizing returns a default
      const normalizedColor = values.color ? normalizeColor(values.color) : (fixture?.color || '#f0f0f0');
      const normalizedBorderColor = values.borderColor ? normalizeColor(values.borderColor) : null;
      
      // Base fixture data without the new showName property
      const fixtureData: any = {
        ...fixture,
        id: fixtureId,
        _id: fixtureId,
        name: values.name,
        type: values.type,
        position: values.position,
        dimensions: values.dimensions,
        rotation: values.rotation,
        color: normalizedColor,
        icon: iconPath,
        zIndex: fixture?.zIndex || 1,
        isActive: fixture?.isActive !== undefined ? fixture.isActive : true,
        borderColor: normalizedBorderColor,
        borderRadius: values.borderRadius || 0
      };
      
      // Only include showName when updating an existing fixture to maintain
      // backward compatibility with the backend API
      if (fixtureId) {
        fixtureData.showName = values.showName;
      }
      
      console.log('Submitting fixture with icon path:', iconPath);
      console.log('Color being submitted:', normalizedColor);
      
      // Submit data but don't show message from here - let Redux/API response show the message
      await onSubmit(fixtureData);
      
      // Close the form modal
      onCancel();
    } catch (error) {
      console.error('Fixture submission failed:', error);
      message.error('Failed to save fixture. Please check the form and try again.');
    } finally {
      setConfirmLoading(false);
    }
  };

  // Helper function to clean icon paths
  const cleanIconPath = (path: any): string => {
    if (!path) return '';
    
    // Handle non-string values
    if (typeof path !== 'string') return '';
    
    // Skip cleaning if path is already a clean fixture path format
    if (path.startsWith('fixtures/') && !path.includes('?') && !path.includes('http')) {
      return path;
    }
    
    // Remove API uploads prefix if present
    let cleanPath = path.replace(/^\/api\/uploads\//, '');
    
    // Remove any leading slash
    cleanPath = cleanPath.replace(/^\//, '');
    
    // Handle URLs and query parameters
    if (cleanPath.includes('?') || cleanPath.includes('http')) {
      const filename = cleanPath.split('?')[0].split('/').pop() || '';
      if (filename) {
        return `fixtures/${filename}`;
      }
    }
    
    // If we have a clean path that doesn't start with fixtures/, add it
    if (cleanPath && !cleanPath.startsWith('fixtures/')) {
      return `fixtures/${cleanPath}`;
    }
    
    return cleanPath;
  };

  return (
    <Modal
      title={
        <div style={{ padding: '8px 0', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: 24, marginRight: 8 }}>
            {fixture ? fixtureIcons[fixture.type] : '🪑'}
          </span>
          <span>
            {fixture ? `Edit ${fixture.name}` : 'Add New Fixture'}
          </span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {fixture && onDelete && (
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={memoizedHandleDelete}
                style={{ borderRadius: '6px' }}
              >
                Delete
              </Button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              onClick={onCancel}
              icon={<CloseOutlined />}
              style={{ borderRadius: '6px' }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleSubmit}
              icon={<SaveOutlined />}
              style={{ borderRadius: '6px' }}
            >
              {fixture ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      }
      width={560}
      centered
      styles={{ 
        header: { 
          borderBottom: '1px solid #f0f0f0', 
          padding: '16px 24px'
        },
        body: { backgroundColor: '#fff', borderRadius: '0 0 8px 8px', padding: '0' },
        footer: { 
          borderTop: '1px solid #f0f0f0', 
          padding: '12px 24px',
          margin: 0 
        }
      }}
    >
      {/* Add SVG specific style and touch-action styles to fix passive event listener issues */}
      <style dangerouslySetInnerHTML={{ __html: `
        .svg-icon {
          filter: drop-shadow(0px 1px 2px rgba(0,0,0,0.2));
        }
        
        /* Fix for passive event listener warnings */
        .ant-slider, .ant-slider-handle, .ant-color-picker-trigger, .ant-color-picker-dropdown {
          touch-action: none !important;
        }
        
        .ant-slider-rail, .ant-slider-track {
          touch-action: pan-y !important;
        }
        
        .ant-tabs-tab, .ant-select-selector, .ant-input-number-input, .ant-color-picker-slider, .ant-color-picker-palette {
          touch-action: manipulation !important;
        }
        
        /* Fix circular references warning */
        .ant-color-picker-trigger-disabled .ant-color-picker-clear {
          display: none;
        }
      `}} />
      
      {renderFixturePreview()}
      
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: 'New Fixture',
          type: 'chair',
          position: { x: 0, y: 0 },
          dimensions: { width: 1, height: 1 },
          rotation: 0,
          color: '#f0f0f0',
          icon: '',
          showName: true,
          borderColor: null,
          borderRadius: 0
        }}
        style={{ padding: '0 24px 20px' }}
        onValuesChange={updatePreviewFromForm}
      >
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          tabBarStyle={{ marginBottom: 16 }}
          centered
        />
      </Form>
    </Modal>
  );
};

export default FixtureForm; 