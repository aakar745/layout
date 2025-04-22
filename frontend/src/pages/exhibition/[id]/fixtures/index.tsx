import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Space, App, Tabs, Select } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';

import { 
  fetchExhibition, 
  fetchFixtures, 
  createFixture, 
  updateFixture, 
  deleteFixture,
  fetchHalls,
  fetchStalls 
} from '../../../../store/slices/exhibitionSlice';
import { Fixture as FixtureType } from '../../../../services/exhibition';
import ErrorBoundary from '../../../../components/common/ErrorBoundary';
import { Canvas, FixtureForm } from '../../../../components/exhibition/layout';
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

// Predefined fixture types
const fixtureTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'sofa', label: 'Sofas' },
  { value: 'chair', label: 'Chairs' },
  { value: 'table', label: 'Tables' },
  { value: 'desk', label: 'Desks' },
  { value: 'plant', label: 'Plants' },
  { value: 'entrance', label: 'Entrances' },
  { value: 'exit', label: 'Exits' },
  { value: 'info', label: 'Information' },
  { value: 'restroom', label: 'Restrooms' },
  { value: 'food', label: 'Food Areas' },
  { value: 'custom', label: 'Custom' }
];

const FixtureManager: React.FC = () => {
  const { message } = App.useApp();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const exhibitionId = location.state?.exhibitionId || id;
  const { currentExhibition, fixtures, halls, stalls, loading } = useSelector((state: RootState) => state.exhibition);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  const [isFixtureFormVisible, setIsFixtureFormVisible] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState<FixtureType | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [selectedType, setSelectedType] = useState<string>('all');
  const [filteredFixtures, setFilteredFixtures] = useState<FixtureType[]>([]);

  // Ensure we have a valid exhibitionId
  useEffect(() => {
    if (!exhibitionId) {
      message.error('Exhibition ID not found');
      navigate('/exhibitions');
      return;
    }
  }, [exhibitionId, navigate, message]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(fetchExhibition(exhibitionId)).unwrap();
        await dispatch(fetchFixtures({ exhibitionId })).unwrap();
        await dispatch(fetchHalls(exhibitionId)).unwrap();
        await dispatch(fetchStalls({ exhibitionId })).unwrap();
      } catch (error) {
        message.error('Failed to load data');
      }
    };

    loadData();
  }, [exhibitionId, dispatch, message]);

  // Filter fixtures when type changes
  useEffect(() => {
    if (selectedType === 'all') {
      setFilteredFixtures(fixtures);
    } else {
      setFilteredFixtures(fixtures.filter(fixture => fixture.type === selectedType));
    }
  }, [fixtures, selectedType]);

  // Update canvas size when container resizes
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

  const handleAddFixture = () => {
    setSelectedFixture(null);
    setIsFixtureFormVisible(true);
  };

  const handleSelectFixture = (fixture: FixtureType | null) => {
    setSelectedFixture(fixture);
    setIsFixtureFormVisible(!!fixture);
  };

  const handleFixtureSubmit = async (fixture: FixtureType) => {
    try {
      if (fixture.id || fixture._id) {
        // Update existing fixture
        await dispatch(updateFixture({ 
          exhibitionId, 
          id: fixture.id || fixture._id || '', 
          data: fixture 
        })).unwrap();
        message.success('Fixture updated successfully');
      } else {
        // Create new fixture
        await dispatch(createFixture({ 
          exhibitionId, 
          data: fixture 
        })).unwrap();
        message.success('Fixture created successfully');
      }
      
      // Refetch fixtures to ensure UI is up to date
      await dispatch(fetchFixtures({ exhibitionId })).unwrap();
      
      setIsFixtureFormVisible(false);
    } catch (error: any) {
      console.error('Failed to save fixture:', error);
      message.error(error.message || 'Failed to save fixture');
    }
  };

  const handleDeleteFixture = async (fixture: FixtureType) => {
    try {
      const fixtureId = fixture.id || fixture._id;
      if (!fixtureId) {
        throw new Error('Fixture ID is required');
      }
      
      await dispatch(deleteFixture({ exhibitionId, id: fixtureId })).unwrap();
      message.success('Fixture deleted successfully');
      setIsFixtureFormVisible(false);
      setSelectedFixture(null);
    } catch (error: any) {
      console.error('Failed to delete fixture:', error);
      message.error(error.message || 'Failed to delete fixture');
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div style={{ padding: '24px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BackButton exhibitionId={exhibitionId} />

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <span>Fixture Management</span>
            </Space>
            <Space>
              <Select
                style={{ width: 180 }}
                value={selectedType}
                onChange={handleTypeChange}
                options={fixtureTypes}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddFixture}
              >
                Add Fixture
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
        <div style={{
          padding: '8px 16px',
          background: '#f0f7ff',
          borderBottom: '1px solid #d6e8ff',
          color: '#0050b3',
          fontSize: '14px'
        }}>
          Halls and stalls are shown for reference. Place fixtures relative to these elements to enhance visitor navigation.
        </div>

        <div 
          ref={canvasContainerRef}
          style={{ 
            position: 'absolute',
            top: 33, // Adjusted to account for the notification bar
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
                stalls={stalls}
                fixtures={filteredFixtures}
                selectedFixture={selectedFixture}
                onSelectFixture={handleSelectFixture}
                onFixtureChange={handleFixtureSubmit}
                onAddFixture={handleAddFixture}
                isFixtureMode={true}
              />
            )}
          </ErrorBoundary>
        </div>
      </Card>

      <FixtureForm
        visible={isFixtureFormVisible}
        fixture={selectedFixture}
        onCancel={() => setIsFixtureFormVisible(false)}
        onSubmit={handleFixtureSubmit}
        onDelete={handleDeleteFixture}
        exhibitionWidth={currentExhibition?.dimensions?.width || 100}
        exhibitionHeight={currentExhibition?.dimensions?.height || 100}
      />
    </div>
  );
};

export default FixtureManager; 