import React, { useEffect } from 'react';
import { Card, Button, Row, Col, Space } from 'antd';
import { LayoutOutlined, AppstoreOutlined, ShopOutlined, TableOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';
import { fetchExhibition, fetchHalls } from '../../../../store/slices/exhibitionSlice';
import { getExhibitionUrl } from '../../../../utils/url';


// Reusable BackButton component
const BackButton: React.FC<{ exhibitionId: string }> = ({ exhibitionId }) => {
  const navigate = useNavigate();
  const { currentExhibition } = useSelector((state: RootState) => state.exhibition);
  
  return (
    <div 
      style={{ 
        marginBottom: '24px',
        position: 'sticky',
        top: '16px',
        zIndex: 10
      }}
    >
      <Button 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(getExhibitionUrl(currentExhibition), { state: { exhibitionId } })}
        type="default"
        size="large"
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          background: 'white',
          borderColor: 'transparent',
          fontWeight: 500,
          padding: '0 16px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease'
        }}
        className="back-button-hover"
      >
        <span style={{ marginLeft: 8 }}>Back to Exhibition</span>
      </Button>
      <style>{`
        .back-button-hover:hover {
          transform: translateX(-5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          background: #f0f5ff;
          border-color: #d6e4ff;
        }
      `}</style>
    </div>
  );
};

const LayoutBuilder: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const exhibitionId = location.state?.exhibitionId || id;
  const { currentExhibition, halls } = useSelector((state: RootState) => state.exhibition);

  useEffect(() => {
    if (exhibitionId) {
      dispatch(fetchExhibition(exhibitionId));
      dispatch(fetchHalls(exhibitionId));
    }
  }, [exhibitionId, dispatch]);

  return (
    <div style={{ padding: '24px' }}>
      <BackButton exhibitionId={exhibitionId} />

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{ height: '100%', background: '#fff', borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ 
              height: 140, 
              background: '#f0f2f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <LayoutOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Card.Meta
              title="Exhibition Space"
              description="Set up and manage the exhibition space dimensions"
              style={{ marginBottom: '16px' }}
            />
            <Button 
              type="primary" 
              onClick={() => navigate(getExhibitionUrl(currentExhibition, 'space'), { state: { exhibitionId } })}
              style={{ background: '#7828C8', borderColor: '#7828C8' }}
            >
              Manage
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{ height: '100%', background: '#fff', borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ 
              height: 140, 
              background: '#f0f2f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <AppstoreOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Card.Meta
              title="Hall Management"
              description="Create and manage exhibition halls"
              style={{ marginBottom: '16px' }}
            />
            <Button 
              type="primary"
              disabled={!currentExhibition?.dimensions?.width || !currentExhibition?.dimensions?.height}
              onClick={() => navigate(getExhibitionUrl(currentExhibition, 'halls'), { state: { exhibitionId } })}
              style={{ background: '#7828C8', borderColor: '#7828C8' }}
            >
              Manage
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{ height: '100%', background: '#fff', borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ 
              height: 140, 
              background: '#f0f2f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <ShopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Card.Meta
              title="Stall Management"
              description="Create and manage stalls within halls"
              style={{ marginBottom: '16px' }}
            />
            <Button 
              type="primary"
              disabled={!halls.length}
              onClick={() => navigate(getExhibitionUrl(currentExhibition, 'stalls'), { state: { exhibitionId } })}
              style={{ background: '#7828C8', borderColor: '#7828C8' }}
            >
              Manage
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            style={{ height: '100%', background: '#fff', borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ 
              height: 140, 
              background: '#f0f2f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <TableOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            </div>
            <Card.Meta
              title="Fixture Management"
              description="Add sofas, chairs, entrances and other fixtures to the layout"
              style={{ marginBottom: '16px' }}
            />
            <Button 
              type="primary"
              disabled={!currentExhibition?.dimensions?.width || !currentExhibition?.dimensions?.height}
              onClick={() => navigate(getExhibitionUrl(currentExhibition, 'fixtures'), { state: { exhibitionId } })}
              style={{ background: '#7828C8', borderColor: '#7828C8' }}
            >
              Manage
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LayoutBuilder; 