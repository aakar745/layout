import React from 'react';
import { Form, Input, Button, Select, InputNumber, Slider, Space, ColorPicker, Upload, Typography, Row, Col, Card, Switch, Modal } from 'antd';
import { DeleteOutlined, UploadOutlined, InfoCircleOutlined, LinkOutlined, RotateRightOutlined, EnvironmentOutlined, AppstoreOutlined, PictureOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { Fixture } from '../../../services/exhibition';

const { Text } = Typography;

interface FixtureTabProps {
  activeKey: string;
  form: any;
  fixture: Fixture | null;
  exhibitionWidth: number; 
  exhibitionHeight: number;
  selectedType: string;
  showName: boolean;
  iconFileList: UploadFile[];
  fixtureTypes: { value: string; label: string }[];
  fixtureIcons: Record<string, string>;
  defaultColors: Record<string, string>;
  defaultDimensions: Record<string, { width: number; height: number }>;
  colorPresets: { label: string; colors: string[] }[];
  uploadProps: UploadProps;
  iconPreviewVisible?: boolean;
  previewImage?: string;
  onTypeChange: (type: string) => void;
  onColorChange: (color: any) => void;
  onShowNameChange: (checked: boolean) => void;
  onIconPreviewCancel?: () => void;
}

const FixtureTab: React.FC<FixtureTabProps> = ({
  activeKey,
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
  iconPreviewVisible = false,
  previewImage = '',
  onTypeChange,
  onColorChange,
  onShowNameChange,
  onIconPreviewCancel = () => {}
}) => {
  // Render the correct tab content based on activeKey
  switch (activeKey) {
    case 'basic':
      return renderBasicTab();
    case 'position':
      return renderPositionTab();
    case 'appearance':
      return renderAppearanceTab();
    default:
      return renderBasicTab();
  }

  function renderBasicTab() {
    return (
      <div className="tab-content">
        <Form.Item
          name="name"
          label="Fixture Name"
          rules={[{ required: true, message: 'Please enter fixture name' }]}
        >
          <Input 
            placeholder="Enter fixture name" 
            prefix={<InfoCircleOutlined style={{ color: '#aaa' }} />}
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>

        <Form.Item
          name="showName"
          label="Show Name on Layout"
          tooltip="Toggle whether the fixture name appears on the layout"
          valuePropName="checked"
        >
          <Switch 
            defaultChecked 
            checkedChildren="Visible" 
            unCheckedChildren="Hidden"
            onChange={(checked) => {
              // Only update the preview state, don't modify other form values
              onShowNameChange(checked);
              
              // Log the current form values for debugging
              console.log('Form values after showName toggle:', form.getFieldsValue(true));
            }}
          />
        </Form.Item>

        <Form.Item
          name="type"
          label="Fixture Type"
          rules={[{ required: true, message: 'Please select fixture type' }]}
        >
          <Select 
            placeholder="Select fixture type"
            onChange={onTypeChange}
            options={fixtureTypes.map(type => ({
              ...type,
              label: (
                <Space>
                  <span style={{ fontSize: 16 }}>{fixtureIcons[type.value]}</span>
                  <span>{type.label}</span>
                </Space>
              )
            }))}
            style={{ width: '100%', borderRadius: '8px' }}
            listHeight={300}
            dropdownStyle={{ borderRadius: '8px' }}
          />
        </Form.Item>
      </div>
    );
  }

  function renderPositionTab() {
    return (
      <div className="tab-content">
        <Card
          size="small"
          title="Position (meters)"
          style={{ marginBottom: 16, borderRadius: 8 }}
          styles={{ body: { padding: '12px 16px' } }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['position', 'x']}
                label="X Position"
                rules={[{ required: true, message: 'X position is required' }]}
              >
                <InputNumber
                  style={{ width: '100%', borderRadius: '8px' }}
                  min={0}
                  max={exhibitionWidth}
                  step={0.1}
                  precision={1}
                  placeholder="X position"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['position', 'y']}
                label="Y Position"
                rules={[{ required: true, message: 'Y position is required' }]}
              >
                <InputNumber
                  style={{ width: '100%', borderRadius: '8px' }}
                  min={0}
                  max={exhibitionHeight}
                  step={0.1}
                  precision={1}
                  placeholder="Y position"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card
          size="small"
          title="Dimensions (meters)"
          style={{ marginBottom: 16, borderRadius: 8 }}
          styles={{ body: { padding: '12px 16px' } }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name={['dimensions', 'width']}
                label="Width"
                rules={[{ required: true, message: 'Width is required' }]}
              >
                <InputNumber
                  style={{ width: '100%', borderRadius: '8px' }}
                  min={0.5}
                  max={20}
                  step={0.1}
                  precision={1}
                  placeholder="Width"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name={['dimensions', 'height']}
                label="Height"
                rules={[{ required: true, message: 'Height is required' }]}
              >
                <InputNumber
                  style={{ width: '100%', borderRadius: '8px' }}
                  min={0.5}
                  max={20}
                  step={0.1}
                  precision={1}
                  placeholder="Height"
                >
                </InputNumber>
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card
          size="small"
          title={
            <span>
              <RotateRightOutlined /> Rotation (degrees)
            </span>
          }
          style={{ borderRadius: 8 }}
          styles={{ body: { padding: '12px 16px' } }}
        >
          <Form.Item
            name="rotation"
            noStyle
          >
            <Slider 
              min={0} 
              max={360} 
              marks={{ 0: '0°', 90: '90°', 180: '180°', 270: '270°', 360: '360°' }}
              tooltip={{ formatter: value => `${value}°` }}
              style={{ marginTop: 10 }}
              keyboard={false}
            />
          </Form.Item>
        </Card>
      </div>
    );
  }

  function renderAppearanceTab() {
    return (
      <div className="tab-content">
        <Form.Item
          name="color"
          label="Color"
          tooltip="Choose a color for the fixture. This affects the background color and tint applied to SVG icons."
          rules={[{ 
            validator: (_, value) => {
              try {
                if (value) return Promise.resolve();
                return Promise.reject('Please select a color');
              } catch (error) {
                return Promise.reject('Please enter a valid color value');
              }
            } 
          }]}
        >
          <ColorPicker 
            format="hex" 
            allowClear 
            showText
            disabledAlpha
            presets={colorPresets}
            onChange={onColorChange}
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item
          name="borderColor"
          label="Border Color"
          tooltip="Choose a border color for the fixture. Leave empty for default borders."
        >
          <ColorPicker 
            format="hex" 
            allowClear 
            showText
            disabledAlpha
            presets={colorPresets}
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item
          name="borderRadius"
          label="Border Radius"
          tooltip="Set the corner radius in pixels. Higher values make more rounded corners."
        >
          <InputNumber
            min={0}
            max={20}
            step={1}
            style={{ width: '100%', borderRadius: '8px' }}
            addonAfter="px"
          />
        </Form.Item>
        
        <Card
          size="small"
          title="Icon Upload"
          style={{ borderRadius: 8, marginBottom: 16, marginTop: 16 }}
          styles={{ body: { padding: '16px' } }}
        >
          <div style={{ marginBottom: 0 }}>
            <Upload {...uploadProps}>
              {iconFileList.length < 1 && (
                <div>
                  <PictureOutlined style={{ fontSize: 20 }} />
                  <div style={{ marginTop: 8 }}>Upload Icon</div>
                </div>
              )}
            </Upload>
          </div>
          
          <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
            Upload a custom icon or use the default icon for the selected fixture type.
            Supported formats: PNG, JPG, SVG. SVG icons are preferred for better quality at all sizes.
          </Text>
        </Card>
        
        <Form.Item
          name="icon"
          label="Icon URL"
          tooltip="URL to an icon image for this fixture. Will be used if no icon is uploaded."
        >
          <Input 
            placeholder="https://example.com/icon.png" 
            prefix={<LinkOutlined style={{ color: '#aaa' }} />}
            style={{ borderRadius: '8px' }}
          />
        </Form.Item>
        
        <Modal
          open={iconPreviewVisible}
          title="Icon Preview"
          footer={null}
          onCancel={onIconPreviewCancel}
        >
          <img alt="Icon Preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
};

// Create a higher-level component that includes tab labels and configuration
export const getTabItems = (props: FixtureTabProps) => [
  {
    key: 'basic',
    label: (
      <span>
        <AppstoreOutlined />
        Basic Info
      </span>
    ),
    children: <FixtureTab {...props} activeKey="basic" />
  },
  {
    key: 'position',
    label: (
      <span>
        <EnvironmentOutlined />
        Position
      </span>
    ),
    children: <FixtureTab {...props} activeKey="position" />
  },
  {
    key: 'appearance',
    label: (
      <span>
        <UploadOutlined />
        Appearance
      </span>
    ),
    children: <FixtureTab {...props} activeKey="appearance" />
  }
];

export default FixtureTab; 