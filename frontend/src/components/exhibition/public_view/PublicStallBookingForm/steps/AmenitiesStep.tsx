import React from 'react';
import { Alert, Card, Divider, Empty, Typography, Form } from 'antd';
import { RocketOutlined, InboxOutlined } from '@ant-design/icons';
import { StepProps } from '../types';
import { StepContent } from '../styles';

const { Title, Paragraph, Text } = Typography;

const AmenitiesStep: React.FC<StepProps> = ({
  form,
  formValues,
  selectedStallIds = [],
  exhibition
}) => {
  // Get selected stalls from form
  const selectedStalls = form.getFieldValue('selectedStalls') || selectedStallIds || [];
  
  // Safely check for amenities without causing type errors
  const hasAmenities = exhibition && (exhibition as any).amenities && (exhibition as any).amenities.length > 0;
  
  console.log('AmenitiesStep - Selected stalls:', selectedStalls);
  
  return (
    <StepContent>
      <Title level={4}>Additional Amenities</Title>
      <Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Select additional amenities for your exhibition stalls.
      </Paragraph>
      
      <Alert
        message="Coming Soon"
        description="The amenities selection feature is currently under development and will be available soon. You can continue to the next step without selecting amenities."
        type="info"
        showIcon
        icon={<RocketOutlined />}
        style={{ marginBottom: 24 }}
      />
      
      <Card title={`Selected Stalls: ${selectedStalls.length}`}>
        {selectedStalls.length > 0 ? (
          <Paragraph>
            You've selected {selectedStalls.length} stall(s). Additional amenities will be available
            for these stalls in the next update.
          </Paragraph>
        ) : (
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description="No stalls selected" 
          />
        )}
      </Card>
      
      <Divider />
      
      <Card title="Available Amenities" style={{ marginTop: 24 }}>
        <Empty
          image={<InboxOutlined style={{ fontSize: 60, color: '#cccccc' }} />}
          description={
            <span>
              <Text strong>Amenities Coming Soon</Text>
              <br />
              <Text type="secondary">Please check back later for available amenities.</Text>
            </span>
          }
        />
      </Card>
      
      {/* Hidden form field to pass selected amenities (empty for now) */}
      <Form.Item name="amenities" hidden initialValue={[]}>
        <input type="hidden" />
      </Form.Item>
      
      {/* Make sure to maintain the selectedStalls field to pass it to the next step */}
      <Form.Item name="selectedStalls" hidden>
        <input type="hidden" />
      </Form.Item>
    </StepContent>
  );
};

export default AmenitiesStep; 