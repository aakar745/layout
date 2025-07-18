import React from 'react';
import { Select, Input, Card, Row, Col, Tag, Typography, Alert } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { ServiceChargeStall, ExhibitionConfig } from '../types';
import { formatDimensions, calculateServiceCharge, getPricingInfo } from '../utils/serviceChargeCalculator';

const { Option } = Select;
const { Title, Text } = Typography;

interface StallSelectorProps {
  stalls: ServiceChargeStall[];
  selectedStall: ServiceChargeStall | null;
  exhibition: ExhibitionConfig | null;
  onStallSelection: (stallNumber: string) => void;
  formData: any;
}

const StallSelector: React.FC<StallSelectorProps> = ({
  stalls,
  selectedStall,
  exhibition,
  onStallSelection,
  formData
}) => {
  const pricingInfo = getPricingInfo(exhibition);

  const renderStallInput = () => {
    if (stalls.length > 0) {
      return (
        <Select 
          placeholder="Choose your stall number"
          showSearch
          allowClear
          size="large"
          onChange={onStallSelection}
          filterOption={(input, option) =>
            (option?.children && option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0) || false
          }
        >
          {stalls.map(stall => (
            <Option key={stall.stallNumber} value={stall.stallNumber}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>{stall.stallNumber}</strong></span>
                <Tag color="blue" style={{ marginLeft: '8px' }}>{stall.stallArea} sqm</Tag>
              </div>
            </Option>
          ))}
        </Select>
      );
    } else {
      return (
        <Input 
          placeholder="Enter stall number" 
          size="large"
          onChange={(e) => onStallSelection(e.target.value)}
        />
      );
    }
  };

  const renderStallDetails = () => {
    if (!selectedStall) return null;

    const serviceCharge = calculateServiceCharge(exhibition, stalls, selectedStall, formData);

    return (
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px', fontSize: '16px' }} />
              <Title level={5} style={{ margin: 0, color: '#389e0d' }}>Stall Details</Title>
            </div>
            <Row gutter={[16, 8]}>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Stall Number:</Text>
                <br />
                <Text>{selectedStall.stallNumber}</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Area:</Text>
                <br />
                <Text>{selectedStall.stallArea} sqm</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Dimensions:</Text>
                <br />
                <Text>{formatDimensions(selectedStall.dimensions)}</Text>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Text strong>Service Charge:</Text>
                <br />
                <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                  ₹{serviceCharge.toLocaleString()}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: '10px', color: '#666' }}>
                  (Inclusive of GST)
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    );
  };

  const renderPricingInfo = () => {
    if (selectedStall || stalls.length === 0) return null;

    return (
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Alert
            message="Service Charge Information"
            description={
              <div>
                <p>• Stalls with area ≤ {pricingInfo.threshold} sqm: <strong>₹{pricingInfo.smallPrice.toLocaleString()}</strong></p>
                <p style={{ margin: 0 }}>• Stalls with area &gt; {pricingInfo.threshold} sqm: <strong>₹{pricingInfo.largePrice.toLocaleString()}</strong></p>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}><em>(All prices inclusive of GST)</em></p>
              </div>
            }
            type="info"
            showIcon
          />
        </Col>
      </Row>
    );
  };

  return (
    <>
      {renderStallInput()}
      {renderStallDetails()}
      {renderPricingInfo()}
    </>
  );
};

export default StallSelector; 