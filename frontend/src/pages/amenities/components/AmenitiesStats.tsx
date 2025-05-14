import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import { TableOutlined, AppstoreOutlined, BarChartOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface AmenitiesStatsProps {
  basicAmenities: any[];
  extraAmenities: any[];
  bookedStalls: number;
  calculatedAmenities: number;
}

const AmenitiesStats: React.FC<AmenitiesStatsProps> = ({
  basicAmenities,
  extraAmenities,
  bookedStalls,
  calculatedAmenities
}) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} md={6}>
        <Card className="stats-card stats-primary" bordered={false}>
          <TableOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <div className="stats-value">{basicAmenities.length}</div>
          <div className="stats-label">Basic Amenities</div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card className="stats-card stats-secondary" bordered={false}>
          <AppstoreOutlined style={{ fontSize: 24, color: '#52c41a' }} />
          <div className="stats-value">{extraAmenities.length}</div>
          <div className="stats-label">Extra Amenities</div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card className="stats-card stats-tertiary" bordered={false}>
          <ShoppingCartOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
          <div className="stats-value">{bookedStalls}</div>
          <div className="stats-label">Booked Stalls</div>
        </Card>
      </Col>
      
      <Col xs={24} sm={12} md={6}>
        <Card className="stats-card stats-quaternary" bordered={false}>
          <BarChartOutlined style={{ fontSize: 24, color: '#722ed1' }} />
          <div className="stats-value">{calculatedAmenities}</div>
          <div className="stats-label">Calculated Amenities</div>
        </Card>
      </Col>
    </Row>
  );
};

export default AmenitiesStats; 