import React, { useEffect, useState, useRef } from 'react';
import { Card, Button, Form, InputNumber, message, Space } from 'antd';
import { SaveOutlined, ZoomInOutlined, ZoomOutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store/store';
import { fetchExhibition } from '../../../../store/slices/exhibitionSlice';
import exhibitionService from '../../../../services/exhibition';
import { Canvas } from '../../../../components/exhibition/layout';
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

const ExhibitionSpaceSetup: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const exhibitionId = location.state?.exhibitionId || id;
  const { currentExhibition } = useSelector((state: RootState) => state.exhibition);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  const [dimensions, setDimensions] = useState({ width: 100, height: 100 });
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [form] = Form.useForm();

  useEffect(() => {
    if (!exhibitionId) {
      message.error('Exhibition ID not found');
      navigate('/exhibition');
      return;
    }
    
    dispatch(fetchExhibition(exhibitionId));
  }, [exhibitionId, dispatch, navigate]);

  useEffect(() => {
    if (currentExhibition?.dimensions) {
      setDimensions(currentExhibition.dimensions);
      form.setFieldsValue(currentExhibition.dimensions);
    }
  }, [currentExhibition, form]);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        setCanvasSize({
          width: canvasContainerRef.current.clientWidth,
          height: canvasContainerRef.current.clientHeight
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await exhibitionService.updateExhibition(exhibitionId, {
        dimensions: values
      });
      message.success('Exhibition space saved successfully');
      // Refresh exhibition data before navigating
      await dispatch(fetchExhibition(exhibitionId)).unwrap();
      navigate(getExhibitionUrl(currentExhibition, 'layout'), {
        state: { exhibitionId }
      });
    } catch (error) {
      message.error('Failed to save exhibition space');
    }
  };

  const handleDimensionsChange = (newDimensions: { width?: number; height?: number }) => {
    setDimensions(prev => ({
      ...prev,
      ...newDimensions
    }));
    form.setFieldsValue(newDimensions);
  };

  return (
    <div style={{ padding: '24px' }}>
      <BackButton exhibitionId={exhibitionId} />

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Exhibition Space Setup</span>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              Save and Continue
            </Button>
          </div>
        }
      >
        <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 200px)' }}>
          <div style={{ flex: '0 0 300px' }}>
            <Form
              form={form}
              layout="vertical"
              initialValues={dimensions}
            >
              <Form.Item
                name="width"
                label="Width (meters)"
                rules={[
                  { required: true, message: 'Please enter width' },
                  { type: 'number', min: 10, message: 'Width must be at least 10 meters' }
                ]}
              >
                <InputNumber
                  min={10}
                  max={1000}
                  style={{ width: '100%' }}
                  onChange={(value) => handleDimensionsChange({ width: value || 10 })}
                />
              </Form.Item>

              <Form.Item
                name="height"
                label="Height (meters)"
                rules={[
                  { required: true, message: 'Please enter height' },
                  { type: 'number', min: 10, message: 'Height must be at least 10 meters' }
                ]}
              >
                <InputNumber
                  min={10}
                  max={1000}
                  style={{ width: '100%' }}
                  onChange={(value) => handleDimensionsChange({ height: value || 10 })}
                />
              </Form.Item>
            </Form>
          </div>

          <div 
            ref={canvasContainerRef}
            style={{ 
              flex: '1', 
              border: '1px solid #d9d9d9', 
              borderRadius: '8px', 
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <ErrorBoundary>
              <Canvas
                width={canvasSize.width}
                height={canvasSize.height}
                exhibitionWidth={dimensions.width}
                exhibitionHeight={dimensions.height}
                onExhibitionChange={handleDimensionsChange}
              />
            </ErrorBoundary>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExhibitionSpaceSetup; 