import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Space, App, Tag } from 'antd';
import { PlusOutlined, RollbackOutlined, CloseOutlined, ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';
import { fetchExhibition, fetchHalls, fetchStalls } from '../../../../store/slices/exhibitionSlice';
import { Hall as HallType, Stall as StallType } from '../../../../services/exhibition';
import exhibitionService from '../../../../services/exhibition';
import { Canvas, StallForm } from '../../../../components/exhibition/layout';
import { Stall } from '../../../../components/exhibition/public_view';
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

// Extended stall type to include optional fields
interface ExtendedStall extends StallType {
  stallType?: {
    name: string;
    description: string | null;
  };
}

const StallManager: React.FC = () => {
  const { message } = App.useApp();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const exhibitionId = location.state?.exhibitionId || id;
  const { currentExhibition, halls, stalls, loading } = useSelector((state: RootState) => state.exhibition);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  const [isStallFormVisible, setIsStallFormVisible] = useState(false);
  const [selectedHall, setSelectedHall] = useState<HallType | null>(null);
  const [selectedStall, setSelectedStall] = useState<ExtendedStall | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

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
    if (!exhibitionId) {
      message.error('Exhibition ID not found');
      navigate('/exhibition');
      return;
    }

    const loadData = async () => {
      try {
        await dispatch(fetchExhibition(exhibitionId)).unwrap();
        await dispatch(fetchHalls(exhibitionId)).unwrap();
        setHasLoadedInitialData(true);
      } catch (error) {
        message.error('Failed to load data');
      }
    };

    loadData();
  }, [exhibitionId, dispatch, navigate]);

  // Check exhibition dimensions
  useEffect(() => {
    if (!hasLoadedInitialData || !currentExhibition) return;

    if (!currentExhibition.dimensions?.width || !currentExhibition.dimensions?.height) {
      message.info('Please set up exhibition space first');
      navigate(getExhibitionUrl(currentExhibition, 'space'), {
        state: { exhibitionId }
      });
    }
  }, [currentExhibition, exhibitionId, navigate, hasLoadedInitialData]);

  // Check halls after data is loaded
  useEffect(() => {
    if (!hasLoadedInitialData || loading) return;

    if (halls.length === 0) {
      message.info('Please create halls first');
      navigate(getExhibitionUrl(currentExhibition, 'halls'), {
        state: { exhibitionId }
      });
    }
  }, [halls, exhibitionId, navigate, loading, hasLoadedInitialData]);

  // Load stalls for all halls initially
  useEffect(() => {
    if (hasLoadedInitialData && currentExhibition && halls.length > 0) {
      // Fetch stalls for all halls
      const fetchAllStalls = async () => {
        try {
          const allStallsPromises = halls.map(hall => 
            dispatch(fetchStalls({ 
              exhibitionId, 
              hallId: hall.id, 
              limit: 1000 // Ensure we get all stalls for each hall
            })).unwrap()
          );
          await Promise.all(allStallsPromises);
        } catch (error) {
          console.error('Error fetching stalls:', error);
          message.error('Failed to load stalls');
        }
      };
      fetchAllStalls();
    }
  }, [currentExhibition, exhibitionId, halls, dispatch, hasLoadedInitialData]);

  // Filter stalls based on selected hall
  const visibleStalls = stalls.filter(stall => {
    const stallHallId = typeof stall.hallId === 'string' ? stall.hallId : String(stall.hallId || '');
    const selectedHallId = String(selectedHall?.id || selectedHall?._id || '');
    return stallHallId === selectedHallId;
  });

  // Load selected hall from URL
  useEffect(() => {
    if (!hasLoadedInitialData || halls.length === 0) return;

    const hallId = searchParams.get('hallId');
    if (hallId) {
      const hall = halls.find(h => h.id === hallId || h._id === hallId);
      if (hall) {
        setSelectedHall(hall);
      } else if (halls.length > 0) {
        // If hall not found but we have halls, select the first one
        setSelectedHall(halls[0]);
        // Update URL with the correct ID
        const firstHallId = halls[0].id || halls[0]._id;
        if (firstHallId) {
          setSearchParams({ hallId: firstHallId.toString() });
        }
      }
    } else if (halls.length > 0) {
      // If no hall is selected, select the first one
      setSelectedHall(halls[0]);
      // Update URL with the hall ID
      const firstHallId = halls[0].id || halls[0]._id;
      if (firstHallId) {
        setSearchParams({ hallId: firstHallId.toString() });
      }
    }
  }, [halls, searchParams, hasLoadedInitialData, setSearchParams]);

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

  const handleAddStall = () => {
    if (!selectedHall) {
      message.warning('Please select a hall first');
      return;
    }
    setSelectedStall(null);
    setIsStallFormVisible(true);
  };

  const handleSelectHall = (hall: HallType | null) => {
    setSelectedHall(hall);
    setSelectedStall(null);
    // Update URL with selected hall
    if (hall) {
      const hallId = hall.id || hall._id;
      if (hallId) {
        setSearchParams({ hallId: hallId.toString() });
      } else {
        setSearchParams({});
      }
    } else {
      setSearchParams({});
    }
  };

  const handleSelectStall = (stall: ExtendedStall | null) => {
    // Ensure we have a clean copy of the stall data
    const selectedStallData = stall ? {
      ...stall,
      id: stall.id || stall._id,
      _id: stall._id || stall.id,
      // Ensure stallTypeId is preserved - handle both string and object types
      stallTypeId: typeof stall.stallTypeId === 'string' ? stall.stallTypeId : stall.stallTypeId?._id || stall.stallTypeId,
      // Keep the stall type information if available
      stallType: stall.stallType
    } : null;
    
    console.log('Selected stall data:', selectedStallData);
    setSelectedStall(selectedStallData);
    setIsStallFormVisible(!!selectedStallData);
  };

  const handleStallSubmit = async (stall: ExtendedStall) => {
    try {
      if (!selectedHall?.id && !selectedHall?._id) {
        message.error('No hall selected');
        return;
      }

      // Get the hall ID that's being used for fetching stalls
      const fetchHallId = selectedHall.id;
      // Get the hall ID for the stall data
      const hallId = selectedHall._id || selectedHall.id;

      // Validate that the stall belongs to the selected hall
      if (stall.hallId && stall.hallId !== hallId) {
        message.error('Cannot move stall to a different hall');
        return;
      }

      console.log('Submitting stall data:', stall);

      if (stall.id || stall._id) {
        // For updates, we need to preserve the ID fields
        const updateData = {
          ...stall,
          id: stall.id,
          _id: stall._id,
          hallId,
          // Ensure stallTypeId is included
          stallTypeId: stall.stallTypeId
        };
        console.log('Update data:', updateData);
        const stallId = stall.id || stall._id;
        if (!stallId) {
          throw new Error('Stall ID is missing');
        }
        await exhibitionService.updateStall(exhibitionId, stallId, updateData);
        message.success('Stall updated successfully');
      } else {
        // For new stalls, remove ID fields and ensure hallId is set
        const { id, _id, ...createData } = stall;
        const newStallData = {
          ...createData,
          hallId,
          // Ensure stallTypeId is included
          stallTypeId: stall.stallTypeId
        };
        console.log('Creating new stall with data:', newStallData);
        await exhibitionService.createStall(exhibitionId, newStallData);
        message.success('Stall created successfully');
      }

      setIsStallFormVisible(false);
      // Use the same hall ID that's used in the useEffect for fetching stalls
      dispatch(fetchStalls({ 
        exhibitionId, 
        hallId: fetchHallId, 
        limit: 1000 // Ensure we get all stalls
      }));
    } catch (error: any) {
      console.error('Error saving stall:', error);
      message.error(error.response?.data?.message || 'Failed to save stall');
    }
  };

  const handleDeleteStall = async (stallId: string) => {
    try {
      if (!exhibitionId) {
        message.error('Exhibition ID not found');
        return;
      }

      // Store current hall before any state changes
      const currentHall = selectedHall;
      if (!currentHall) {
        message.error('No hall selected');
        return;
      }

      // Get the hall ID that's being used for fetching stalls
      const hallId = currentHall.id || currentHall._id;
      if (!hallId) {
        message.error('Invalid hall ID');
        return;
      }

      await exhibitionService.deleteStall(exhibitionId, stallId);
      
      // Close form and clear selection first
      setIsStallFormVisible(false);
      setSelectedStall(null);
      
      // Fetch stalls only for the current hall
      // The Redux slice will now preserve stalls from other halls
      await dispatch(fetchStalls({ 
        exhibitionId, 
        hallId,
        limit: 1000 // Ensure we get all stalls
      })).unwrap();
      
      message.success('Stall deleted successfully');
    } catch (error: any) {
      console.error('Error deleting stall:', error);
      message.error(error.response?.data?.message || 'Failed to delete stall');
    }
  };

  const handleStallUpdate = async (updatedStall: ExtendedStall) => {
    if (!exhibitionId) {
      message.error('Exhibition ID not found');
      return;
    }

    const stallId = updatedStall.id || updatedStall._id;
    if (!stallId) {
      console.error('Stall data:', updatedStall);
      message.error('Stall ID not found');
      return;
    }

    if (!selectedHall?.id && !selectedHall?._id) {
      message.error('No hall selected');
      return;
    }

    // Get the hall IDs consistently with handleStallSubmit
    const fetchHallId = selectedHall.id;
    const hallId = selectedHall._id || selectedHall.id;

    try {
      await exhibitionService.updateStall(exhibitionId, stallId, {
        ...updatedStall,
        id: stallId, // Ensure the ID is included in the update
        hallId // Include the hall ID in the update
      });
      dispatch(fetchStalls({ 
        exhibitionId, 
        hallId: fetchHallId, 
        limit: 1000 // Ensure we get all stalls
      }));
    } catch (error: any) {
      console.error('Stall update error:', error);
      message.error(error.response?.data?.message || 'Failed to update stall position');
    }
  };

  const handleFormClose = () => {
    setIsStallFormVisible(false);
    setSelectedStall(null);
  };

  return (
    <ErrorBoundary>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <BackButton exhibitionId={exhibitionId} />
        </div>

        <Card
          title={
            <Space>
              <span>Stall Manager</span>
              {stalls.length > 100 && (
                <Tag color="orange" icon={<InfoCircleOutlined />}>
                  Performance Mode: {stalls.length} stalls (viewport culling active)
                </Tag>
              )}
            </Space>
          }
          extra={
            <Space>
              <Button
                icon={<RollbackOutlined />}
                onClick={() => navigate(`/exhibition/${exhibitionId}`, { state: { exhibitionId } })}
              >
                Back to Exhibition
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddStall}
                disabled={!selectedHall}
              >
                Add Stall
              </Button>
            </Space>
          }
          style={{ flex: 1 }}
          styles={{ body: { height: 'calc(100% - 57px)' } }}
        >
          {stalls.length > 500 && (
            <div style={{ 
              padding: '12px', 
              background: '#fff7e6', 
              border: '1px solid #ffd591', 
              borderRadius: '6px', 
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              <Space>
                <InfoCircleOutlined style={{ color: '#fa8c16' }} />
                <div>
                  <strong>Large Dataset Optimization Active</strong><br />
                  <span style={{ color: '#666' }}>
                    {stalls.length} stalls detected. Advanced performance optimizations are enabled including 
                    viewport culling and simplified rendering. Use zoom and pan to navigate efficiently.
                  </span>
                </div>
              </Space>
            </div>
          )}
          <div
            ref={canvasContainerRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '400px',
              background: '#f0f2f5',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {currentExhibition && (
              <Canvas
                width={canvasSize.width}
                height={canvasSize.height}
                exhibitionWidth={currentExhibition.dimensions?.width || 100}
                exhibitionHeight={currentExhibition.dimensions?.height || 100}
                halls={halls}
                selectedHall={selectedHall}
                onSelectHall={handleSelectHall}
                isStallMode={true}
              >
                {selectedHall && visibleStalls.map(stall => (
                  <Stall
                    key={stall.id || stall._id}
                    stall={stall}
                    isSelected={selectedStall?.id === stall.id || selectedStall?._id === stall._id}
                    onSelect={() => handleSelectStall(stall)}
                    onChange={handleStallUpdate}
                    hallWidth={selectedHall.dimensions.width}
                    hallHeight={selectedHall.dimensions.height}
                    hallX={selectedHall.dimensions.x}
                    hallY={selectedHall.dimensions.y}
                    isLargeDataset={stalls.length > 100}
                  />
                ))}
              </Canvas>
            )}
          </div>
        </Card>

        {currentExhibition && (
          <StallForm
            visible={isStallFormVisible}
            stall={selectedStall}
            hall={selectedHall}
            exhibition={{
              ...currentExhibition,
              // CRITICAL FIX: Include current stalls from Redux store for positioning logic
              stalls: stalls || []
            }}
            onCancel={handleFormClose}
            onSubmit={handleStallSubmit}
            onDelete={selectedStall ? () => handleDeleteStall(selectedStall.id || selectedStall._id!) : undefined}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default StallManager; 