import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Space, message as antMessage } from 'antd';
import { PlusOutlined, SaveOutlined, RollbackOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';
import { fetchExhibition, fetchHalls } from '../../../../store/slices/exhibitionSlice';
import { Hall as HallType } from '../../../../services/exhibition';
import exhibitionService from '../../../../services/exhibition';
import { Canvas, HallForm } from '../../../../components/exhibition/layout';
import ErrorBoundary from '../../../../components/common/ErrorBoundary';
import { getExhibitionUrl } from '../../../../utils/url';

// Reusable BackButton component
const BackButton: React.FC<{ exhibitionId: string; destination?: string; label?: string }> = ({ 
  exhibitionId,
  destination = 'layout',
  label = 'Back to Layout'
}) => {
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
        onClick={() => navigate(getExhibitionUrl(currentExhibition, destination), { state: { exhibitionId } })}
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
        <span style={{ marginLeft: 8 }}>{label}</span>
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

const HallManager: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const exhibitionId = location.state?.exhibitionId || id;
  const { currentExhibition, halls } = useSelector((state: RootState) => state.exhibition);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = antMessage.useMessage();
  
  const [isHallFormVisible, setIsHallFormVisible] = useState(false);
  const [selectedHall, setSelectedHall] = useState<HallType | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        const { clientWidth, clientHeight } = canvasContainerRef.current;
        setCanvasSize({
          width: Math.max(clientWidth || 400, 400),
          height: Math.max(clientHeight || 400, 400)
        });
      }
    };

    updateCanvasSize();
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  useEffect(() => {
    if (!exhibitionId) {
      messageApi.error('Exhibition ID not found');
      navigate('/exhibition');
      return;
    }

    dispatch(fetchExhibition(exhibitionId));
  }, [exhibitionId, dispatch, navigate, messageApi]);

  useEffect(() => {
    if (currentExhibition) {
      if (!currentExhibition.dimensions?.width || !currentExhibition.dimensions?.height) {
        messageApi.info('Please set up exhibition space first');
        navigate(getExhibitionUrl(currentExhibition, 'space'), {
          state: { exhibitionId }
        });
        return;
      }
      dispatch(fetchHalls(exhibitionId));
    }
  }, [currentExhibition, exhibitionId, dispatch, navigate, messageApi]);

  const handleAddHall = () => {
    setSelectedHall(null);
    setIsHallFormVisible(true);
  };

  const handleSelectHall = (hall: HallType | null) => {
    setSelectedHall(hall);
    setIsHallFormVisible(!!hall);
  };

  const handleHallSubmit = async (hall: HallType) => {
    try {
      if (hall.id) {
        await exhibitionService.updateHall(exhibitionId, hall.id, hall);
        messageApi.success('Hall updated successfully');
        setIsHallFormVisible(false);
      } else {
        await exhibitionService.createHall(exhibitionId, hall);
        messageApi.success('Hall created successfully');
        setIsHallFormVisible(false);
      }
      dispatch(fetchHalls(exhibitionId));
    } catch (error: any) {
      console.error('Hall operation failed:', error);
      if (error.response?.status === 409) {
        messageApi.warning({
          content: error.response.data.message,
          duration: 6,
          style: {
            marginTop: '20vh'
          }
        });
      } else {
        messageApi.error(error.message || 'Failed to save hall');
        setIsHallFormVisible(false);
      }
    }
  };

  const handleDeleteHall = async (hall: HallType) => {
    try {
      const hallId = hall._id || hall.id;
      if (!hallId) {
        throw new Error('Hall ID is required');
      }
      await exhibitionService.deleteHall(exhibitionId, hallId);
      messageApi.success('Hall deleted successfully');
      setIsHallFormVisible(false);
      setSelectedHall(null);
      dispatch(fetchHalls(exhibitionId));
    } catch (error: any) {
      console.error('Failed to delete hall:', error);
      messageApi.error(error.response?.data?.message || 'Failed to delete hall');
    }
  };

  const handleSaveLayout = async () => {
    try {
      await exhibitionService.saveLayout(exhibitionId, halls);
      messageApi.success('Layout saved successfully');
    } catch (error) {
      messageApi.error('Failed to save layout');
    }
  };

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BackButton exhibitionId={exhibitionId} />

      {contextHolder}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <span>Hall Management</span>
              <Button
                icon={<RollbackOutlined />}
                onClick={() => navigate(getExhibitionUrl(currentExhibition, 'space'), { state: { exhibitionId } })}
              >
                Back to Space Setup
              </Button>
            </Space>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddHall}
              >
                Add Hall
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveLayout}
                disabled={!halls.length}
              >
                Save Layout
              </Button>
            </Space>
          </div>
        }
        styles={{
          body: { 
            flex: 1,
            padding: 0,
            overflow: 'hidden',
            minHeight: '400px',
            position: 'relative',
            background: '#fafafa'
          }
        }}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: '500px'
        }}
      >
        <div 
          ref={canvasContainerRef}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden'
          }}
        >
          <ErrorBoundary>
            {canvasSize.width > 0 && canvasSize.height > 0 && currentExhibition?.dimensions && (
              <Canvas
                width={canvasSize.width}
                height={canvasSize.height}
                exhibitionWidth={currentExhibition.dimensions.width}
                exhibitionHeight={currentExhibition.dimensions.height}
                halls={halls}
                selectedHall={selectedHall}
                onSelectHall={handleSelectHall}
                onHallChange={handleHallSubmit}
                onAddHall={handleAddHall}
              />
            )}
          </ErrorBoundary>
        </div>
      </Card>

      <HallForm
        visible={isHallFormVisible}
        hall={selectedHall}
        onCancel={() => setIsHallFormVisible(false)}
        onSubmit={handleHallSubmit}
        onDelete={handleDeleteHall}
        exhibitionWidth={currentExhibition?.dimensions?.width || 100}
        exhibitionHeight={currentExhibition?.dimensions?.height || 100}
      />
    </div>
  );
};

export default HallManager; 