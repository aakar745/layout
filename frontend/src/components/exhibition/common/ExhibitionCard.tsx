import React from 'react';
import { Card, Tag, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Exhibition } from '../../../services/exhibition';
import { getExhibitionUrl } from '../../../utils/url';

interface ExhibitionCardProps {
  exhibition: Exhibition;
}

const ExhibitionCard: React.FC<ExhibitionCardProps> = ({ exhibition }) => {
  const navigate = useNavigate();

  return (
    <Card
      title={
        <Space>
          <span>{exhibition.name}</span>
          <Tag color={
            exhibition.status === 'published' ? 'green' :
            exhibition.status === 'draft' ? 'gold' : 'blue'
          }>
            {exhibition.status.toUpperCase()}
          </Tag>
        </Space>
      }
      actions={[
        <Button 
          key="view" 
          type="link" 
          onClick={() => navigate(getExhibitionUrl(exhibition))}
        >
          View Details
        </Button>,
        <Button 
          key="layout" 
          type="link" 
          onClick={() => navigate(getExhibitionUrl(exhibition, 'builder'))}
        >
          Layout Builder
        </Button>,
      ]}
    >
      <p>{exhibition.description}</p>
      <p>
        <strong>Dates: </strong>
        {new Date(exhibition.startDate).toLocaleDateString()} - 
        {new Date(exhibition.endDate).toLocaleDateString()}
      </p>
    </Card>
  );
};

export default ExhibitionCard; 