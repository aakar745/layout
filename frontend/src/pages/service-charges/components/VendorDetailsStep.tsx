import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Card, 
  Row, 
  Col, 
  Typography,
  Divider
} from 'antd';
import { 
  ShoppingCartOutlined, 
  PhoneOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { ExhibitionConfig, ServiceChargeStall, FormData } from '../types';
import ImageUpload from './ImageUpload';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface VendorDetailsStepProps {
  form: any;
  formData: FormData;
  exhibition: ExhibitionConfig | null;
  stalls: ServiceChargeStall[];
  selectedStall: ServiceChargeStall | null;
  fileList: any[];
  setFileList: (files: any[]) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onStallSelection: (stallNumber: string) => void;
  onNext: () => void;
}

const VendorDetailsStep: React.FC<VendorDetailsStepProps> = ({
  form,
  formData,
  exhibition,
  stalls,
  selectedStall,
  fileList,
  setFileList,
  setFormData,
  onStallSelection,
  onNext
}) => {
  const navigate = useNavigate();

  const handleCheckPayment = () => {
    if (exhibition) {
      navigate(`/exhibitions/${exhibition._id}/service-charge/check-payment`);
    }
  };
  return (
    <Card className="step-card">
      <div className="step-header">
        <ShoppingCartOutlined className="step-icon" />
        <Title level={3}>Service Details</Title>
        <Paragraph type="secondary">
          Please provide your vendor details and select your stall.
        </Paragraph>
      </div>

      <Form form={form} layout="vertical" initialValues={formData}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="vendorName"
              label="Vendor Name"
              rules={[{ required: true, message: 'Please enter vendor name' }]}
            >
              <Input placeholder="Enter vendor name" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="companyName"
              label="Vendor Company Name"
              rules={[{ required: true, message: 'Please enter vendor company name' }]}
            >
              <Input placeholder="Enter vendor company name" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="vendorPhone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter phone number' },
                { 
                  pattern: /^[+]?[0-9\s\-()]{10,15}$/, 
                  message: 'Please enter a valid phone number (10-15 digits)' 
                }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            {stalls.length > 0 ? (
              <>
                <Form.Item
                  name="stallNumber"
                  label="Stall Number"
                  rules={[{ required: true, message: 'Please select a stall number' }]}
                >
                  <Select 
                    placeholder="Select stall number" 
                    size="large"
                    onChange={onStallSelection}
                    showSearch
                    filterOption={(input, option) => {
                      const stall = stalls.find(s => s.stallNumber === option?.value);
                      if (!stall) return false;
                      
                      const searchText = `${stall.stallNumber} ${stall.exhibitorCompanyName || ''} ${stall.stallArea || ''}`.toLowerCase();
                      return searchText.includes(input.toLowerCase());
                    }}
                  >
                    {stalls.map(stall => (
                      <Option key={stall._id} value={stall.stallNumber}>
                        {stall.stallNumber} - {stall.exhibitorCompanyName} ({stall.stallArea} sqm)
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </>
            ) : (
              <Form.Item
                name="stallNumber"
                label="Stall Number"
                rules={[{ required: false, message: 'Please enter stall number' }]}
              >
                <Input placeholder="Enter stall number (optional)" size="large" />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="exhibitorCompanyName"
              label={
                <span>
                  Exhibitor Company Name
                  {selectedStall && (
                    <span style={{ color: 'green', marginLeft: '8px', fontSize: '10px' }}>
                      Auto-filled
                    </span>
                  )}
                </span>
              }
              rules={stalls.length === 0 ? [
                { required: true, message: 'Please enter exhibitor company name' }
              ] : []}
              tooltip={stalls.length > 0 ? "This field is auto-filled when you select a stall" : "The company name of the exhibitor"}
            >
              <Input 
                placeholder="Enter exhibitor company name" 
                size="large"
                readOnly={selectedStall !== null}
                style={{ 
                  backgroundColor: selectedStall ? '#f6ffed' : 'white',
                  borderColor: selectedStall ? '#b7eb8f' : '#d9d9d9',
                  cursor: selectedStall ? 'not-allowed' : 'text'
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500,
                fontSize: '14px'
              }}>
                Upload Cheque Image
                <span style={{ 
                  color: '#666', 
                  fontWeight: 400, 
                  marginLeft: '4px' 
                }}>
                  (optional)
                </span>
              </label>
              <ImageUpload 
                fileList={fileList}
                setFileList={setFileList}
                setFormData={setFormData}
              />
            </div>
          </Col>
        </Row>

        {/* Selected Stall Details - positioned after image upload section */}
        {selectedStall && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: '#fafbfc', 
            border: '1px solid #e1e5e9', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '16px', borderBottom: '1px solid #e1e5e9', paddingBottom: '8px' }}>
              <Text strong style={{ fontSize: '16px', color: '#1d2939' }}>
                📋 Selected Stall Details
              </Text>
            </div>
            
            {/* Details in a clean layout */}
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Stall Number
                  </Text>
                  <Text strong style={{ fontSize: '16px', color: '#1d2939' }}>
                    {selectedStall.stallNumber}
                  </Text>
                </div>
              </Col>
              
              <Col xs={12} sm={6}>
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Area
                  </Text>
                  <Text strong style={{ fontSize: '16px', color: '#1d2939' }}>
                    {selectedStall.stallArea} sqm
                  </Text>
                </div>
              </Col>
              
              {selectedStall.dimensions && (
                <Col xs={12} sm={6}>
                  <div style={{ textAlign: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                      Dimensions
                    </Text>
                    <Text strong style={{ fontSize: '16px', color: '#1d2939' }}>
                      {selectedStall.dimensions.width} × {selectedStall.dimensions.height}m
                    </Text>
                  </div>
                </Col>
              )}
              
              <Col xs={selectedStall.dimensions ? 12 : 24} sm={selectedStall.dimensions ? 6 : 12}>
                <div style={{ 
                  textAlign: 'center',
                  backgroundColor: '#f0f9ff',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #bfdbfe'
                }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                    Service Charge
                  </Text>
                  <Text strong style={{ fontSize: '18px', color: '#1e40af' }}>
                    ₹{(() => {
                      // Calculate service charge inline
                      if (!exhibition?.config?.pricingRules) return '0';
                      const { smallStallThreshold = 50, smallStallPrice = 2000, largeStallPrice = 2500 } = exhibition.config.pricingRules;
                      const amount = selectedStall.stallArea <= smallStallThreshold ? smallStallPrice : largeStallPrice;
                      return amount.toLocaleString();
                    })()}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginTop: '2px' }}>
                    (Inclusive of GST)
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* Legacy service type selection - show only if no stalls available */}
        {stalls.length === 0 && exhibition?.config.serviceTypes && (
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24}>
              <Form.Item
                name="serviceType"
                label="Service Type"
                rules={[{ required: true, message: 'Please select service type' }]}
              >
                <Select placeholder="Select service type" size="large">
                  {exhibition.config.serviceTypes?.map(service => (
                    <Option key={service.type} value={service.type}>
                      {service.type} - ₹{service.amount.toLocaleString()} (Incl. GST)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Show pricing information for stall-based system when no stall selected */}
        {stalls.length > 0 && !selectedStall && exhibition?.config?.pricingRules && (
          <div style={{ 
            marginTop: '12px', 
            padding: '12px', 
            backgroundColor: '#f0f9ff', 
            border: '1px solid #bfdbfe', 
            borderRadius: '6px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)'
          }}>
            {/* Header */}
            <div style={{ marginBottom: '8px', borderBottom: '1px solid #bfdbfe', paddingBottom: '4px' }}>
              <Text strong style={{ fontSize: '13px', color: '#1e40af' }}>
                💰 Service Charge Pricing
              </Text>
            </div>
            
            {/* Pricing Grid - Mobile Responsive */}
            <Row gutter={[8, 6]}>
              <Col xs={24} sm={12}>
                <div style={{ 
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e0e7ff'
                }}>
                  <Text strong style={{ fontSize: '12px', color: '#374151', display: 'block', marginBottom: '2px' }}>
                    Small Stalls
                  </Text>
                  <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginBottom: '4px' }}>
                    (≤{exhibition.config.pricingRules.smallStallThreshold || 50} sqm)
                  </Text>
                  <Text strong style={{ fontSize: '16px', color: '#1e40af' }}>
                    ₹{(exhibition.config.pricingRules.smallStallPrice || 2000).toLocaleString()}
                  </Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div style={{ 
                  textAlign: 'center',
                  backgroundColor: '#ffffff',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #e0e7ff'
                }}>
                  <Text strong style={{ fontSize: '12px', color: '#374151', display: 'block', marginBottom: '2px' }}>
                    Large Stalls
                  </Text>
                  <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginBottom: '4px' }}>
                    (&gt;{exhibition.config.pricingRules.smallStallThreshold || 50} sqm)
                  </Text>
                  <Text strong style={{ fontSize: '16px', color: '#1e40af' }}>
                    ₹{(exhibition.config.pricingRules.largeStallPrice || 2500).toLocaleString()}
                  </Text>
                </div>
              </Col>
            </Row>
            
            <Text type="secondary" style={{ 
              fontSize: '10px', 
              marginTop: '6px', 
              display: 'block', 
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              All prices inclusive of GST
            </Text>
          </div>
        )}
      </Form>

      {/* Check Payment Link */}
      <Divider style={{ margin: '32px 0 24px 0' }}>
        <Text type="secondary" style={{ fontSize: '14px' }}>
          Already made a payment?
        </Text>
      </Divider>

      <div style={{ 
        textAlign: 'center',
        padding: '16px', 
        backgroundColor: '#fafbfc', 
        border: '1px solid #e1e5e9', 
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <Button
          type="link"
          icon={<SearchOutlined />}
          onClick={handleCheckPayment}
          style={{ 
            fontSize: '14px',
            padding: 0,
            height: 'auto'
          }}
        >
          Check Payment Status & Download Receipt
        </Button>
        <div style={{ marginTop: '4px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Search by mobile number or stall number
          </Text>
        </div>
      </div>

      <div className="step-actions" style={{ textAlign: 'center', marginTop: '32px' }}>
        <Button 
          type="primary" 
          onClick={onNext} 
          size="large"
          style={{ minWidth: '120px' }}
        >
          Next
        </Button>
      </div>
    </Card>
  );
};

export default VendorDetailsStep; 