/**
 * Booking Creation Component
 * 
 * This component handles the creation of new bookings with improved organization:
 * - Separated components for better maintainability
 * - Utility functions for calculations
 * - Cleaner code structure
 * - Better UI/UX with enhanced form design
 */

import React, { useEffect, useState } from 'react';
import { Card, Form, Select, Button, Space, Typography, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { createBooking, CreateBookingData } from '../../../store/slices/bookingSlice';
import { fetchExhibitions } from '../../../store/slices/exhibitionSlice';
import { fetchExhibitors } from '../../../store/slices/exhibitorSlice';
import exhibitionService, { Exhibition, Stall } from '../../../services/exhibition';
import { invoiceApi } from '../../../store/services/invoice';

// Components
import ExhibitorModal from './components/ExhibitorModal';
import StallSelectionTable from './components/StallSelectionTable';
import AmenitiesSection from './components/AmenitiesSection';
import PriceCalculation from './components/PriceCalculation';

// Utils
import { 
  calculateBaseAmount, 
  calculateDiscountAmount, 
  calculateAmounts,
  calculateBasicAmenitiesQuantities,
  AmountCalculation 
} from './utils/calculations';
import { calculateStallArea } from '../../../utils/stallUtils';

const { Title, Text } = Typography;

/**
 * Main booking creation component with improved structure
 */
const CreateBooking: React.FC = () => {
  const [form] = Form.useForm();
  const [exhibitorForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [stallsLoading, setStallsLoading] = useState(false);
  const [selectedStalls, setSelectedStalls] = useState<Stall[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<Exhibition | null>(null);
  const [selectedDiscountId, setSelectedDiscountId] = useState<string | undefined>();
  const [selectedExtraAmenities, setSelectedExtraAmenities] = useState<string[]>([]);
  const [extraAmenityQuantities, setExtraAmenityQuantities] = useState<Record<string, number>>({});
  const [basicAmenitiesWithQuantities, setBasicAmenitiesWithQuantities] = useState<any[]>([]);
  const [totalStallArea, setTotalStallArea] = useState<number>(0);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading } = useSelector((state: RootState) => state.booking);
  const { exhibitions = [], loading: exhibitionsLoading } = useSelector((state: RootState) => state.exhibition);
  const { exhibitors = [], loading: exhibitorsLoading } = useSelector((state: RootState) => state.exhibitor);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      message.error('Please login to create a booking');
      navigate('/login');
      return;
    }
    dispatch(fetchExhibitions());
    dispatch(fetchExhibitors({}));
  }, [dispatch, isAuthenticated, navigate]);

  /**
   * Handles exhibition selection and loads related data
   */
  const handleExhibitionChange = async (exhibitionId: string) => {
    try {
      setStallsLoading(true);
      // Clear previous selections
      form.setFieldValue('stallIds', []);
      form.setFieldValue('discountId', undefined);
      form.setFieldValue('extraAmenities', []);
      setSelectedStalls([]);
      setSelectedExtraAmenities([]);
      setBasicAmenitiesWithQuantities([]);
      setTotalStallArea(0);
      setSelectedDiscountId(undefined);
      
      // Fetch exhibition details and stalls
      const [exhibitionResponse, stallsResponse] = await Promise.all([
        exhibitionService.getExhibition(exhibitionId),
        exhibitionService.getStalls(exhibitionId)
      ]);
      
      setSelectedExhibition(exhibitionResponse.data);
      const availableStalls = stallsResponse.data.stalls.filter((stall: any) => stall.status === 'available');
      setStalls(availableStalls);
    } catch (error) {
      console.error('Failed to fetch exhibition data:', error);
      message.error('Failed to fetch exhibition data');
    } finally {
      setStallsLoading(false);
    }
  };

  /**
   * Handles stall selection changes
   */
  const handleStallChange = (stallIds: string[]) => {
    const selected = stalls.filter(s => {
      const id = s._id || s.id;
      return id && stallIds.includes(id);
    });
    setSelectedStalls(selected);

    // Calculate total area
    const totalArea = selected.reduce(
      (sum, stall) => sum + calculateStallArea(stall.dimensions),
      0
    );
    setTotalStallArea(totalArea);

    // Calculate basic amenities quantities
    if (selectedExhibition?.basicAmenities?.length) {
      const amenitiesWithQuantities = calculateBasicAmenitiesQuantities(
        selectedExhibition.basicAmenities,
        totalArea
      );
      setBasicAmenitiesWithQuantities(amenitiesWithQuantities);
    }
  };

  /**
   * Handles form submission with improved error handling
   */
  const onFinish = async (values: any) => {
    try {
      const exhibitor = exhibitors.find(e => e._id === values.exhibitorId);
      if (!exhibitor) {
        throw new Error('Selected exhibitor not found');
      }

      const selectedDiscount = selectedExhibition?.discountConfig?.find(d => {
        const compositeKey = `${d.name}-${d.value}-${d.type}`;
        return compositeKey === selectedDiscountId;
      });
      
      // Calculate amounts using utility function
      const amounts = calculateAmounts(selectedStalls, selectedExhibition, selectedDiscountId);
      
      // Prepare stall calculations
      const stallsWithBase = selectedStalls.map(stall => {
        const stallId = stall._id || stall.id;
        if (!stallId) {
          throw new Error(`Invalid stall ID for stall number ${stall.number}`);
        }
        return {
          stall,
          stallId,
          baseAmount: calculateBaseAmount(stall)
        };
      });
      
      const totalBaseAmount = stallsWithBase.reduce((sum, { baseAmount }) => sum + baseAmount, 0);

      const stallCalculations = stallsWithBase.map(({ stall, stallId, baseAmount }) => {
        const discountAmount = selectedDiscount ? 
          calculateDiscountAmount(baseAmount, totalBaseAmount, selectedDiscount) : 0;

        return {
          stallId,
          number: stall.number,
          baseAmount,
          discount: selectedDiscount ? {
            name: selectedDiscount.name,
            type: selectedDiscount.type,
            value: selectedDiscount.value,
            amount: discountAmount
          } : null,
          amountAfterDiscount: Math.round((baseAmount - discountAmount) * 100) / 100
        };
      });

      // Create booking data
      const bookingData: any = {
        exhibitionId: values.exhibitionId,
        exhibitorId: values.exhibitorId,
        stallIds: stallCalculations.map(s => s.stallId),
        customerName: exhibitor.contactPerson,
        customerEmail: exhibitor.email,
        customerPhone: exhibitor.phone,
        customerAddress: exhibitor.address || 'N/A',
        customerGSTIN: exhibitor.gstNumber || 'N/A',
        customerPAN: exhibitor.panNumber || 'N/A',
        companyName: exhibitor.companyName,
        discount: selectedDiscount ? {
          name: selectedDiscount.name,
          type: selectedDiscount.type,
          value: selectedDiscount.value
        } : null,
        amount: amounts.totalAmount,
        calculations: {
          stalls: stallCalculations,
          totalBaseAmount,
          totalDiscountAmount: amounts.discountAmount,
          totalAmountAfterDiscount: amounts.amountAfterDiscount,
          taxes: amounts.taxes,
          totalTaxAmount: amounts.totalTaxAmount,
          totalAmount: amounts.totalAmount
        }
      };

      // Add amenities
      if (basicAmenitiesWithQuantities.length) {
        bookingData.basicAmenities = basicAmenitiesWithQuantities
          .filter(amenity => amenity.calculatedQuantity > 0)
          .map(amenity => ({
            name: amenity.name,
            type: amenity.type,
            perSqm: amenity.perSqm,
            quantity: amenity.quantity,
            calculatedQuantity: amenity.calculatedQuantity,
            description: amenity.description
          }));
      }

      if (selectedExtraAmenities.length) {
        bookingData.extraAmenities = getSelectedExtraAmenities();
      }

      const result = await dispatch(createBooking(bookingData)).unwrap();
      
      // Invalidate cache and redirect
      dispatch(invoiceApi.util.invalidateTags(['Invoice']));
      
      if (result && result.invoiceId) {
        message.success('Booking created successfully! Redirecting to invoice...');
        setTimeout(() => {
          navigate(`/invoice/${result.invoiceId}`);
        }, 2000);
      } else {
        message.success('Booking created successfully');
        dispatch(invoiceApi.util.invalidateTags(['Invoice']));
        navigate('/bookings');
      }
      
      if (result && result.warning) {
        message.warning(result.warning);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      message.error('Failed to create booking');
    }
  };

  // Event handlers
  const handleDiscountChange = (discountId: string | undefined) => {
    setSelectedDiscountId(discountId);
    form.setFieldValue('discountId', discountId);
  };

  const handleExtraAmenitiesChange = (selectedIds: string[]) => {
    const updatedQuantities = { ...extraAmenityQuantities };
    
    selectedIds.forEach(id => {
      if (!selectedExtraAmenities.includes(id)) {
        updatedQuantities[id] = 1;
      }
    });
    
    Object.keys(updatedQuantities).forEach(id => {
      if (!selectedIds.includes(id)) {
        delete updatedQuantities[id];
      }
    });
    
    setExtraAmenityQuantities(updatedQuantities);
    setSelectedExtraAmenities(selectedIds);
  };

  const handleExtraAmenityQuantityChange = (amenityId: string, quantity: number) => {
    setExtraAmenityQuantities(prev => ({
      ...prev,
      [amenityId]: quantity
    }));
  };

  const handleExhibitorAdded = (exhibitorId: string) => {
    form.setFieldValue('exhibitorId', exhibitorId);
  };

  // Utility functions
  const getSelectedExtraAmenities = () => {
    if (!selectedExhibition?.amenities?.length) return [];
    
    return selectedExhibition.amenities
      .filter((amenity: any) => {
        const amenityId = amenity._id || amenity.id;
        return amenityId && selectedExtraAmenities.includes(amenityId.toString());
      })
      .map((amenity: any) => {
        const amenityId = (amenity._id || amenity.id).toString();
        return {
          id: amenityId,
          name: amenity.name,
          type: amenity.type,
          rate: amenity.rate,
          description: amenity.description,
          quantity: extraAmenityQuantities[amenityId] || 1
        };
      });
  };

  const getCalculateAmounts = (): AmountCalculation => {
    return calculateAmounts(selectedStalls, selectedExhibition, selectedDiscountId);
  };

  // Options for selects
  const exhibitionOptions = exhibitions
    .filter(exhibition => 
      exhibition.status === 'published' && exhibition.isActive
    )
    .map(exhibition => ({
      label: exhibition.name,
      value: exhibition._id || exhibition.id
    }));

  const exhibitorOptions = exhibitors.map(exhibitor => ({
    label: `${exhibitor.companyName} (${exhibitor.contactPerson})`,
    value: exhibitor._id
  }));

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        {/* Header */}
        <Col span={24}>
          <Space direction="vertical" size={4}>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              Create Booking
            </Title>
            <Text type="secondary">
              Create a new stall booking with enhanced interface
            </Text>
          </Space>
        </Col>

        {/* Main Form */}
        <Col span={24}>
          <Card 
            style={{ 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              size="large"
            >
              {/* Basic Information */}
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={12}>
                  <Form.Item
                    name="exhibitionId"
                    label="Exhibition"
                    rules={[{ required: true, message: 'Please select an exhibition' }]}
                  >
                    <Select
                      placeholder="Select exhibition"
                      loading={exhibitionsLoading}
                      options={exhibitionOptions}
                      onChange={handleExhibitionChange}
                      style={{ borderRadius: '8px' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="exhibitorId"
                    label={
                      <Space>
                        <span>Exhibitor</span>
                        <Button
                          type="link"
                          icon={<PlusOutlined />}
                          onClick={() => setIsModalVisible(true)}
                          style={{ padding: 0, fontSize: '12px' }}
                        >
                          Add New
                        </Button>
                      </Space>
                    }
                    rules={[{ required: true, message: 'Please select an exhibitor' }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select exhibitor"
                      loading={exhibitorsLoading}
                      options={exhibitorOptions}
                      style={{ borderRadius: '8px' }}
                      filterOption={(input, option) =>
                        (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Stall Selection */}
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={24}>
                  <Form.Item
                    name="stallIds"
                    label="Select Stalls"
                    rules={[{ required: true, message: 'Please select at least one stall' }]}
                  >
                    <Select
                      mode="multiple"
                      placeholder={stallsLoading ? 'Loading stalls...' : 'Select stalls'}
                      loading={stallsLoading}
                      onChange={handleStallChange}
                      style={{ borderRadius: '8px' }}
                      options={stalls.map(stall => {
                        const area = calculateStallArea(stall.dimensions);
                        const shapeInfo = stall.dimensions.shapeType === 'l-shape' 
                          ? `L-Shape = ${area.toFixed(2)} sqm`
                          : `${stall.dimensions.width}m x ${stall.dimensions.height}m = ${area.toFixed(2)} sqm`;
                        return {
                          label: `${stall.number} (${shapeInfo}) - ₹${stall.ratePerSqm.toLocaleString()}/sq.m`,
                          value: stall._id || stall.id
                        };
                      })}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Selected Stalls Summary */}
              <StallSelectionTable
                selectedStalls={selectedStalls}
                calculateBaseAmount={calculateBaseAmount}
              />

              {/* Amenities Section */}
              {selectedStalls.length > 0 && (
                <AmenitiesSection
                  selectedExhibition={selectedExhibition}
                  basicAmenitiesWithQuantities={basicAmenitiesWithQuantities}
                  totalStallArea={totalStallArea}
                  selectedExtraAmenities={selectedExtraAmenities}
                  extraAmenityQuantities={extraAmenityQuantities}
                  onExtraAmenitiesChange={handleExtraAmenitiesChange}
                  onExtraAmenityQuantityChange={handleExtraAmenityQuantityChange}
                  getSelectedExtraAmenities={getSelectedExtraAmenities}
                />
              )}

              {/* Price Calculation */}
              {selectedStalls.length > 0 && (
                <PriceCalculation
                  selectedExhibition={selectedExhibition}
                  selectedDiscountId={selectedDiscountId}
                  onDiscountChange={handleDiscountChange}
                  calculateAmounts={getCalculateAmounts}
                />
              )}

              {/* Hidden form field for discount to ensure it's submitted */}
              <Form.Item name="discountId" style={{ display: 'none' }}>
                <input type="hidden" />
              </Form.Item>

              {/* Submit Button */}
              <Row justify="center" style={{ marginTop: 32 }}>
                <Col>
                  <Space size="middle">
                    <Button
                      onClick={() => navigate('/bookings')}
                      size="large"
                      style={{ 
                        borderRadius: '8px',
                        minWidth: '120px'
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        minWidth: '140px',
                        boxShadow: '0 4px 15px 0 rgba(116, 79, 168, 0.75)'
                      }}
                    >
                      Create Booking
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Exhibitor Modal */}
      <ExhibitorModal
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          exhibitorForm.resetFields();
        }}
        onExhibitorAdded={handleExhibitorAdded}
        form={exhibitorForm}
      />
    </div>
  );
};

export default CreateBooking; 