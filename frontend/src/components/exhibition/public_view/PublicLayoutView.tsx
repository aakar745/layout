/**
 * PublicLayoutView Component
 * 
 * This component is responsible for displaying the public view of an exhibition layout.
 * It handles:
 * - Displaying the exhibition layout with halls and stalls
 * - Interactive canvas for stall selection
 * - Stall booking modal integration
 * - Responsive layout sizing
 * 
 * Key Features:
 * 1. Dynamic canvas sizing based on container dimensions
 * 2. Real-time stall status display (available, booked, reserved, sold)
 * 3. Interactive stall selection
 * 4. Booking modal integration with multi-step form
 * 
 * State Management:
 * - layout: Stores the complete exhibition layout data
 * - selectedHall: Tracks currently selected hall
 * - selectedStall: Tracks currently selected stall
 * - selectedStalls: Tracks multiple selected stalls
 * - selectedStallDetails: Stores detailed information about selected stall
 * - canvasSize: Manages responsive canvas dimensions
 */

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Card, Space, Tag, Tooltip, Modal, Button, Form, Input, message, Spin, Alert, Row, Col, Descriptions, Empty, Result, Typography, Badge, Affix, Layout, notification, Image, Divider } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import publicExhibitionService, { PublicLayout } from '../../../services/publicExhibition';
import { Canvas, Hall } from '../layout';
import { Stall } from './';
import Fixture from '../layout/Fixture';
import PublicStallBookingForm from './PublicStallBookingForm/index';
import { CalendarOutlined, ShoppingCartOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { GlobalHeader } from '../../../components/layout';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../store/store';
import { showLoginModal } from '../../../store/slices/exhibitorAuthSlice';
import api from '../../../services/api';

const { Content } = Layout;
const { Title } = Typography;

// Helper to get optimized image URL
const getOptimizedImageUrl = (path: string | undefined): string => {
  if (!path) return '';
  
  // Check if the path is a relative path to the API or an absolute URL
  if (path.startsWith('http')) {
    return path;
  }
  
  // Clean any leading slashes
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Check if the path includes logos directory - use public endpoint with no auth
  if (normalizedPath.includes('logos/')) {
    return `${api.defaults.baseURL}/public/images/${normalizedPath}`;
  }
  
  // For non-logo images, use the regular authenticated endpoint
  // Get auth token from localStorage if available
  const token = localStorage.getItem('token');
  
  // Check if the path already includes the 'uploads/' prefix
  const imagePath = `uploads/${normalizedPath}`;
    
  // For authenticated images, include the token
  if (token) {
    return `${api.defaults.baseURL}/${imagePath}?token=${token}`;
  } else {
    return `${api.defaults.baseURL}/${imagePath}`;
  }
};

const PublicLayoutView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [layout, setLayout] = useState<PublicLayout | null>(null);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [selectedStall, setSelectedStall] = useState<string | null>(null);
  const [selectedStalls, setSelectedStalls] = useState<string[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedStallDetails, setSelectedStallDetails] = useState<any>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 }); // Default size
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();
  
  // Get exhibitor auth state from Redux
  const { isAuthenticated } = useSelector((state: RootState) => state.exhibitorAuth);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Check if stall is already booked
  const isStallBooked = useCallback((stall: any) => {
    return stall.status === 'booked' || stall.status === 'reserved';
  }, []);

  /**
   * Updates canvas dimensions based on container size
   * Ensures responsive layout while maintaining minimum dimensions
   * Optimized with throttling to prevent excessive updates
   */
  const updateCanvasSize = useCallback(() => {
    if (canvasContainerRef.current) {
      const { clientWidth, clientHeight } = canvasContainerRef.current;
      
      // Use device-specific min dimensions
      const minWidth = isMobile ? 320 : 800;
      const minHeight = isMobile ? 480 : 600;
      
      const width = Math.max(clientWidth || minWidth, minWidth);
      const height = Math.max(clientHeight || minHeight, minHeight);
      
      // Only update if dimensions have actually changed
      if (Math.abs(width - canvasSize.width) > 5 || Math.abs(height - canvasSize.height) > 5) {
        setCanvasSize({ width, height });
      }
    }
  }, [canvasSize.width, canvasSize.height, isMobile]);

  /**
   * Effect: Handle canvas size updates
   * Sets up resize observer with throttling for better performance
   */
  useEffect(() => {
    let resizeTimeout: number | null = null;
    const throttledResize = () => {
      if (resizeTimeout === null) {
        resizeTimeout = window.setTimeout(() => {
          resizeTimeout = null;
          updateCanvasSize();
        }, isMobile ? 100 : 50); // More throttling on mobile
      }
    };

    // Initial size update
    updateCanvasSize();

    // Use ResizeObserver with throttling
    const resizeObserver = new ResizeObserver(throttledResize);

    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }

    // Window resize event with throttling
    window.addEventListener('resize', throttledResize);
    
    return () => {
      if (resizeTimeout !== null) {
        window.clearTimeout(resizeTimeout);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', throttledResize);
    };
  }, [updateCanvasSize, isMobile]);

  /**
   * Effect: Fetch exhibition layout data
   * Loads initial layout data and handles loading/error states
   */
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        if (!id) {
          setError('Exhibition ID is missing');
          setLoading(false);
          return;
        }
        
        setLoading(true);
        setError(null);
        const response = await publicExhibitionService.getLayout(id);
        setLayout(response.data);
      } catch (error: any) {
        setError(error.message || 'Failed to fetch layout');
        console.error('Error fetching exhibition:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLayout();
  }, [id]);

  /**
   * Effect: Update canvas on layout load
   * Ensures canvas dimensions are updated when layout data is received
   */
  useEffect(() => {
    if (layout) {
      updateCanvasSize();
    }
  }, [layout]);

  /**
   * Effect: Listen for authentication state changes
   * Ensures UI updates properly when user logs in
   */
  useEffect(() => {
    // When auth state changes, check if we need to update UI
    console.log("Authentication state changed:", isAuthenticated);
    
    // If the user just logged in and there are stalls in the layout, update the canvas
    if (isAuthenticated && layout) {
      // Reset selection state when authentication changes
      setSelectedStall(null);
      setSelectedStalls([]);
      
      // Force canvas to redraw
      updateCanvasSize();
      
      // Show message to guide user
      message.info('You can now select stalls to book.', 3);
    }
  }, [isAuthenticated]);

  // Handle stall click with improved performance
  const handleStallClick = useCallback(async (stall: any) => {
    if (isStallBooked(stall)) {
      message.info(`This stall (${stall.stallNumber}) is already booked.`);
      return;
    }

    // Check if user is authenticated
    const isLoggedIn = isAuthenticated;
    if (!isLoggedIn) {
      // Show the global login modal with stall booking context
      dispatch(showLoginModal("stall-booking"));
      return;
    }

    // Toggle selection of the stall
    const stallId = stall._id || stall.id;
    setSelectedStalls(prevSelected => {
      if (prevSelected.includes(stallId)) {
        // Remove stall from selection
        message.info(`Stall ${stall.stallNumber} removed from selection`);
        return prevSelected.filter(id => id !== stallId);
      } else {
        // Add stall to selection
        message.success(`Stall ${stall.stallNumber} added to selection`);
        return [...prevSelected, stallId];
      }
    });
  }, [isStallBooked, isAuthenticated, dispatch]);

  const handleBookStall = async (values: any) => {
    try {
      setBookingLoading(true);
      
      // Log all form values to debug
      console.log('BOOKING - Form values:', JSON.stringify(values, null, 2));
      console.log('BOOKING - DiscountId:', values.discountId);
      console.log('BOOKING - Selected stalls:', values.selectedStalls);
      
      const bookingData = {
        ...values,
        exhibitionId: layout?.exhibition._id,
        stallIds: values.selectedStalls // Add stallIds property which the backend expects
      };
      
      console.log('BOOKING - Final data being sent:', JSON.stringify(bookingData, null, 2));
      
      // If user is authenticated as an exhibitor, use the authenticated booking endpoint
      if (isAuthenticated) {
        const response = await publicExhibitionService.exhibitorBookStalls(bookingData);
        console.log('BOOKING - Response:', response.data);
        message.success('Your booking request has been submitted successfully! It is pending review by the admin.');
      } else {
        // Use the public/guest booking endpoint
        const response = await publicExhibitionService.bookMultipleStalls(id!, bookingData);
        console.log('BOOKING - Response:', response.data);
        message.success('Your booking request has been submitted successfully!');
      }
      
      // Close modal and clear selection
      setShowBookingModal(false);
      setSelectedStalls([]);
      
      // Refresh the layout data to get updated stall statuses
      if (id) {
        try {
          const response = await publicExhibitionService.getLayout(id);
          setLayout(response.data);
          console.log('Layout refreshed with updated stall statuses');
        } catch (error) {
          console.error('Error refreshing layout data:', error);
        }
      }
    } catch (error) {
      console.error('Error booking stall', error);
      message.error('Failed to book stall. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  /**
   * Opens the booking modal with selected stalls
   */
  const openBookingModal = async () => {
    if (selectedStalls.length === 0) {
      message.warning('Please select at least one stall to book');
      return;
    }

    try {
      setBookingLoading(true);
      
      // Get details of the first selected stall to ensure API communication is working
      await publicExhibitionService.getStallDetails(id!, selectedStalls[0]);
      
      // Create an array of stall details to pass to the form
      const mappedStallDetails = layout?.layout.flatMap(hall => 
        hall.stalls.map(s => ({
          id: s.id,
          number: s.stallNumber,
          stallNumber: s.stallNumber,
          price: s.price || 0,
          ratePerSqm: s.dimensions?.width && s.dimensions?.height 
            ? (s.price || 0) / (s.dimensions.width * s.dimensions.height) 
            : 0,
          dimensions: s.dimensions,
          status: s.status,
          hallId: hall.id,
          hallName: hall.name
        }))
      ) || [];
      
      setSelectedStallDetails(mappedStallDetails);
      setShowBookingModal(true);
    } catch (error) {
      console.error('Error preparing booking modal', error);
      message.error('Failed to load stall details. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBookingSuccess = (bookingData: any) => {
    setShowBookingModal(false);
    setSelectedStalls([]);
    message.success('Booking submitted successfully!');
    
    // Refresh the layout data to get updated stall statuses
    if (id) {
      publicExhibitionService.getLayout(id)
        .then(response => {
          setLayout(response.data);
          console.log('Layout refreshed with updated stall statuses');
        })
        .catch(error => {
          console.error('Error refreshing layout data:', error);
        });
    }
  };

  // Prevent context menu and admin actions in public view
  const handleStageClick = useCallback((e: any) => {
    // Allow only stall selection in public view
    // This effectively prevents the context menu
    e.cancelBubble = true;
  }, []);

  // Memoize the layout halls and stalls for better rendering performance
  const memoizedLayout = useMemo(() => {
    if (!layout) return null;
    
    return {
      halls: layout.layout.map(hall => (
        <Hall
          key={hall.id}
          hall={{
            ...hall,
            exhibitionId: id || ''
          }}
          isSelected={false}
          onSelect={() => {}}
          isStallMode={true}
        />
      )),
      stalls: layout.layout.flatMap(hall => 
        hall.stalls.map(stall => (
          <Stall
            key={stall.id}
            stall={{
              ...stall,
              hallId: hall.id,
              hallName: hall.name,
              isSelected: selectedStalls.includes(stall.id),
              stallTypeId: 'default',
              number: stall.stallNumber,
              typeName: stall.type || 'Standard',
              ratePerSqm: stall.price || 0,
              rotation: 0, // Force rotation to 0 to fix diamond shape
              dimensions: {
                x: stall.position?.x || 0,
                y: stall.position?.y || 0,
                width: stall.dimensions?.width || 0,
                height: stall.dimensions?.height || 0
              },
              status: stall.status === 'maintenance' ? 'booked' : stall.status
            }}
            isSelected={selectedStall === stall.id || selectedStalls.includes(stall.id)}
            onSelect={stall.status === 'available' ? () => handleStallClick(stall) : undefined}
            hallWidth={hall.dimensions?.width || 0}
            hallHeight={hall.dimensions?.height || 0}
            hallX={hall.dimensions?.x || 0}
            hallY={hall.dimensions?.y || 0}
          />
        ))
      ),
      fixtures: layout.fixtures?.map(fixture => (
        <Fixture
          key={fixture.id || fixture._id}
          fixture={{
            ...fixture,
            id: fixture.id || fixture._id,
            _id: fixture._id || fixture.id,
            exhibitionId: id || '',
            isActive: true,
            zIndex: 5 // Ensure fixtures appear on top
          }}
          scale={1}
          position={{ x: 0, y: 0 }}
          exhibitionWidth={layout.exhibition.dimensions?.width || 0}
          exhibitionHeight={layout.exhibition.dimensions?.height || 0}
        />
      ))
    };
  }, [layout, id, selectedStall, selectedStalls, handleStallClick]);

  if (loading) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
            <p style={{ marginTop: 16 }}>Loading exhibition layout...</p>
          </div>
        </Content>
      </Layout>
    );
  }

  if (error || !layout) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <Result
            status="error"
            title="Failed to load exhibition layout"
            subTitle={error || "The exhibition layout couldn't be loaded."}
            extra={[
              <Button type="primary" key="back" onClick={() => navigate('/exhibitions')}>
                Back to Exhibitions
              </Button>
            ]}
          />
        </Content>
      </Layout>
    );
  }

  if (!layout.exhibition.dimensions?.width || !layout.exhibition.dimensions?.height) {
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <Card>
            <Result
              status="error"
              title="Invalid Exhibition Layout"
              subTitle="Exhibition dimensions are not properly configured"
            />
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <GlobalHeader />
      <Content style={{ paddingTop: '64px', background: '#f7f8fa' }}>
        <Card 
          className="exhibition-card"
          style={{
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            margin: '10px 0px',
            border: 'none'
          }}
        >
          <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
            {/* Left column: Exhibition logo and details */}
            <Col xs={24} md={12}>
              <div style={{ 
                padding: '16px',
                background: 'linear-gradient(145deg, #ffffff, #f8faff)',
                borderRadius: '8px',
                border: '1px solid rgba(230, 235, 245, 0.8)',
                height: '100%',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}>
                {/* Logo on the left */}
                <div style={{ flexShrink: 0 }}>
                  {layout.exhibition.headerLogo ? (
                    <Image 
                      src={getOptimizedImageUrl(layout.exhibition.headerLogo)} 
                      alt={`${layout.exhibition.name} logo`}
                      style={{ maxHeight: 90, maxWidth: 250, objectFit: 'contain' }}
                      preview={false}
                      fallback="/exhibition-placeholder.jpg"
                      placeholder={
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          width: 250, 
                          height: 90,
                          backgroundColor: '#f5f5f5',
                          borderRadius: '8px'
                        }}>
                          <Spin size="small" />
                        </div>
                      }
                    />
                  ) : (
                    <div style={{ 
                      width: 90, 
                      height: 90, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      background: 'linear-gradient(145deg, #f0f0f0, #e6e6e6)',
                      borderRadius: '8px',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <CalendarOutlined style={{ fontSize: 32, color: '#aaa' }} />
                    </div>
                  )}
                </div>
                
                {/* Vertical divider */}
                <Divider type="vertical" style={{ height: '90px', margin: '0 16px', opacity: 0.6 }} />
                
                {/* Exhibition details on the right */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: '22px', 
                    fontWeight: 600,
                    background: 'linear-gradient(90deg, #333, #666)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{layout.exhibition.name}</h3>
                  <p style={{ 
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#555',
                    fontSize: '14px'
                  }}>
                    <CalendarOutlined style={{ 
                      fontSize: '16px',
                      color: '#1890ff'
                    }} />
                    <span>
                      {new Date(layout.exhibition.startDate).toLocaleDateString()} - 
                      {new Date(layout.exhibition.endDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p style={{ 
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#555',
                    fontSize: '14px'
                  }}>
                    <InfoCircleOutlined style={{ 
                      fontSize: '16px',
                      color: '#1890ff'
                    }} />
                    <span>{layout.exhibition.venue}</span>
                  </p>
                </div>
              </div>
            </Col>
            
            {/* Right column: Stall status information */}
            <Col xs={24} md={12}>
              <div style={{ 
                padding: '24px',
                background: 'linear-gradient(145deg, #ffffff, #f9fbfd)',
                borderRadius: '12px',
                border: '1px solid rgba(230, 235, 245, 0.8)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}>
                <div style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 500, color: '#444' }}>Stall Status:</div>
                <Space size="middle" wrap>
                  <Tag color="#87d068" style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                    <Badge status="success" text="Available" />
                  </Tag>
                  <Tag color="#ffd591" style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                    <Badge status="warning" text="Booked" />
                  </Tag>
                  <Tag color="#ffadd2" style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}>
                    <Badge status="processing" text="Reserved" />
                  </Tag>
                  {selectedStalls.length > 0 && (
                    <Tag color="#1890ff" style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                      <Badge status="processing" color="#1890ff" text={`Selected (${selectedStalls.length})`} />
                    </Tag>
                  )}
                </Space>
              </div>
            </Col>
          </Row>

          <div 
            ref={canvasContainerRef}
            style={{ 
              width: '100%',
              height: '80vh',  // Consistent height for exhibition display
              minHeight: '600px', 
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid rgba(230, 235, 245, 0.8)',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.03)',
              willChange: 'transform' // Hint for browser optimization
            }}
          >
            {/* CSS to hide context menu in public view */}
            <style>
              {`
                /* Hide only canvas context menu in public view */
                .konvajs-content .ant-menu {
                  display: none !important;
                }
                
                /* Optimize rendering */
                .konvajs-content {
                  will-change: transform;
                }
              `}
            </style>
            <Canvas
              width={canvasSize.width}
              height={canvasSize.height}
              exhibitionWidth={layout?.exhibition.dimensions?.width || 0}
              exhibitionHeight={layout?.exhibition.dimensions?.height || 0}
              halls={layout?.layout || []}
              selectedHall={null}
              onSelectHall={() => {}}
              isStallMode={true}
              onAddHall={() => {}}
              onAddStall={() => {}}
              onAddFixture={() => {}}
              onExhibitionChange={() => {}}
            >
              {memoizedLayout?.halls}
              {memoizedLayout?.stalls}
              {memoizedLayout?.fixtures}
            </Canvas>
          </div>
        </Card>
      </Content>
      
      {selectedStalls.length > 0 && (
        <Affix offsetBottom={20}>
          <div style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}>
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={openBookingModal}
              loading={bookingLoading}
              style={{
                borderRadius: '30px',
                boxShadow: '0 6px 16px rgba(24, 144, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0 22px',
                height: '48px',
                fontSize: '16px',
                fontWeight: 500,
                background: 'linear-gradient(145deg, #1890ff, #40a9ff)',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              Book Selected Stalls ({selectedStalls.length})
            </Button>
          </div>
        </Affix>
      )}

      <PublicStallBookingForm
        visible={showBookingModal}
        stallDetails={selectedStallDetails}
        selectedStallId={selectedStall}
        selectedStallIds={selectedStalls}
        loading={bookingLoading}
        exhibition={layout?.exhibition}
        onCancel={() => {
          setShowBookingModal(false);
          // Don't clear the selection when closing the modal
        }}
        onSubmit={handleBookStall}
      />
    </Layout>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(PublicLayoutView); 