/**
 * Booking Creation Component
 * 
 * This component handles the creation of new bookings with the following features:
 * - Exhibition selection
 * - Stall selection (multiple stalls supported)
 * - Exhibitor selection or creation
 * - Optional discount application
 * - Real-time price calculations
 * - Tax calculations based on exhibition configuration
 */

import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Select, InputNumber, Button, Space, Typography, Row, Col, Modal, message, Descriptions, Divider, Table, Tag, Tooltip, Layout, Radio, Switch, DatePicker } from 'antd';
import { PlusOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { createBooking, CreateBookingData } from '../../../store/slices/bookingSlice';
import { fetchExhibitions } from '../../../store/slices/exhibitionSlice';
import { fetchExhibitors } from '../../../store/slices/exhibitorSlice';
import exhibitionService, { Exhibition, Stall } from '../../../services/exhibition';
import exhibitorService, { ExhibitorProfile } from '../../../services/exhibitor';

const { Title, Text } = Typography;

/**
 * Main booking creation component
 * Manages the entire booking creation workflow including:
 * - Form state and validation
 * - Stall selection and availability checks
 * - Discount application (optional)
 * - Price calculations
 * - Exhibitor management
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
   * - Fetches exhibition details
   * - Loads available stalls
   * - Resets form state for new selection
   */
  const handleExhibitionChange = async (exhibitionId: string) => {
    try {
      setStallsLoading(true);
      form.setFieldValue('stallIds', []); // Clear previous stall selection
      form.setFieldValue('discountId', undefined); // Clear previous discount selection
      form.setFieldValue('extraAmenities', []); // Clear extra amenities selection
      setSelectedStalls([]); // Clear selected stall details
      setSelectedExtraAmenities([]); // Clear selected extra amenities
      setBasicAmenitiesWithQuantities([]); // Clear basic amenities
      setTotalStallArea(0); // Reset total stall area
      
      // Fetch exhibition details
      const exhibitionResponse = await exhibitionService.getExhibition(exhibitionId);
      setSelectedExhibition(exhibitionResponse.data);
      
      // Fetch available stalls
      const stallsResponse = await exhibitionService.getStalls(exhibitionId);
      // Filter only available stalls
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
   * Calculates the base amount for a stall
   * Base amount = Rate per square meter × Width × Height
   */
  const calculateBaseAmount = (stall: Stall): number => {
    return Math.round(stall.ratePerSqm * stall.dimensions.width * stall.dimensions.height * 100) / 100;
  };

  /**
   * Handles stall selection changes
   * Updates the selected stalls state and form values
   */
  const handleStallChange = (stallIds: string[]) => {
    const selected = stalls.filter(s => {
      const id = s._id || s.id;
      return id && stallIds.includes(id);
    });
    setSelectedStalls(selected);

    // Calculate total area of selected stalls
    const totalArea = selected.reduce(
      (sum, stall) => sum + (stall.dimensions.width * stall.dimensions.height),
      0
    );
    setTotalStallArea(totalArea);

    // Calculate basic amenities quantities based on total area
    if (selectedExhibition?.basicAmenities?.length) {
      const amenitiesWithQuantities = selectedExhibition.basicAmenities.map((amenity: any) => {
        // Calculate quantity based on square meters and perSqm rate
        // e.g., 1 table per 9 sqm with total area of 27 sqm = 3 tables
        const calculatedQuantity = Math.floor(totalArea / amenity.perSqm) * amenity.quantity;
        
        return {
          ...amenity,
          calculatedQuantity: calculatedQuantity > 0 ? calculatedQuantity : 0,
          key: amenity._id || amenity.id // Add key for table
        };
      });
      setBasicAmenitiesWithQuantities(amenitiesWithQuantities);
    }
  };

  /**
   * Calculates discount amount based on the type and value
   * Supports two types of discounts:
   * 1. Percentage: Applied as a percentage of the base amount
   * 2. Fixed: Distributed proportionally across selected stalls
   */
  const calculateDiscountAmount = (
    baseAmount: number,
    totalBaseAmount: number,
    discount: { type: 'percentage' | 'fixed'; value: number; isActive: boolean }
  ): number => {
    if (!discount?.isActive) return 0;

    let amount = 0;
    if (discount.type === 'percentage') {
      amount = baseAmount * (Math.max(0, Math.min(100, discount.value)) / 100);
    } else {
      // For fixed discount, calculate proportional amount but ensure it doesn't exceed base amount
      const proportionalAmount = (baseAmount / totalBaseAmount) * discount.value;
      amount = Math.min(proportionalAmount, baseAmount);
    }
    return Math.round(amount * 100) / 100;
  };

  /**
   * Handles form submission
   * - Validates all inputs
   * - Calculates final amounts
   * - Creates booking and invoice
   * - Handles success/error states
   */
  const onFinish = async (values: any) => {
    try {
      const exhibitor = exhibitors.find(e => e._id === values.exhibitorId);
      if (!exhibitor) {
        throw new Error('Selected exhibitor not found');
      }

      // Extract discount information if selected
      const [discountName, discountValue, discountType] = values.discountId ? values.discountId.split('-') : [];

      const selectedDiscount = selectedExhibition?.discountConfig?.find(d => {
        const compositeKey = `${d.name}-${d.value}-${d.type}`;
        return compositeKey === values.discountId;
      });
      
      // Calculate base amounts first
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

      // Calculate amounts for each stall including optional discounts
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
          } : undefined,
          amountAfterDiscount: Math.round((baseAmount - discountAmount) * 100) / 100
        };
      });

      // Calculate final amounts including taxes
      const totalDiscountAmount = stallCalculations.reduce((sum, stall) => sum + (stall.discount?.amount || 0), 0);
      const totalAmountAfterDiscount = Math.round((totalBaseAmount - totalDiscountAmount) * 100) / 100;

      // Apply taxes from exhibition configuration
      const taxes = selectedExhibition?.taxConfig
        ?.filter(tax => tax.isActive)
        .map(tax => ({
          name: tax.name,
          rate: tax.rate,
          amount: Math.round((totalAmountAfterDiscount * tax.rate / 100) * 100) / 100
        })) || [];

      const totalTaxAmount = taxes.reduce((sum, tax) => sum + tax.amount, 0);
      const totalAmount = Math.round((totalAmountAfterDiscount + totalTaxAmount) * 100) / 100;

      // Create booking with all calculated values
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
        } : undefined,
        amount: totalAmount,
        calculations: {
          stalls: stallCalculations,
          totalBaseAmount,
          totalDiscountAmount,
          totalAmountAfterDiscount,
          taxes,
          totalTaxAmount,
          totalAmount
        }
      };

      // Add amenities to booking data
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
      
      // Check if invoice ID is returned directly from the API
      if (result && result.invoiceId) {
        message.success('Booking created successfully! Redirecting to invoice...');
        // Give the backend a moment to finalize invoice generation
        setTimeout(() => {
          navigate(`/invoice/${result.invoiceId}`);
        }, 2000);
      } else {
        message.success('Booking created successfully');
        navigate('/bookings');
      }
      
      // Show warning if there was an issue with invoice generation
      if (result && result.warning) {
        message.warning(result.warning);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      message.error('Failed to create booking');
    }
  };

  const handleExhibitorSearch = async (value: string) => {
    // If value is not found in exhibitors list, show add exhibitor modal
    if (value && !exhibitors.some(e => e.companyName.toLowerCase() === value.toLowerCase())) {
      exhibitorForm.setFieldsValue({
        companyName: value,
        status: 'active'
      });
      setIsModalVisible(true);
    }
  };

  const handleExhibitorAdded = async (values: Partial<ExhibitorProfile>) => {
    try {
      // Transform form values to match backend expectations
      const exhibitorData = {
        companyName: values.companyName,
        contactPerson: values.contactPerson,
        email: values.email, // Changed from contactEmail
        phone: values.phone, // Changed from contactPhone
        address: values.address,
        city: values.city,
        state: values.state,
        pinCode: values.pinCode,
        website: values.website,
        description: values.description,
        panNumber: values.panNumber,
        gstNumber: values.gstNumber,
        isActive: values.isActive !== false // Convert to boolean, default true
      };

      const response = await exhibitorService.createExhibitor(exhibitorData);
      message.success({
        content: 'Exhibitor created successfully! Login credentials have been sent via email.',
        duration: 5
      });
      dispatch(fetchExhibitors({})); // Refresh exhibitors list
      form.setFieldsValue({ exhibitorId: response.data.exhibitor._id }); // Select the newly added exhibitor
      setIsModalVisible(false);
      exhibitorForm.resetFields();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error?.message || 'Failed to add exhibitor';
      message.error(errorMessage);
      
      // Handle specific error cases
      if (errorMessage.includes('email already exists')) {
        exhibitorForm.setFields([{
          name: 'email',
          errors: ['This email is already registered']
        }]);
      }
    }
  };

  const exhibitionOptions = exhibitions
    .filter(exhibition => 
      exhibition.status === 'published' && exhibition.isActive
    )
    .map(exhibition => ({
      label: exhibition.name,
      value: exhibition._id || exhibition.id
    }));

  const exhibitorOptions = exhibitors.map(exhibitor => ({
    label: exhibitor.companyName,
    value: exhibitor._id
  }));

  const stallOptions = stalls.map(stall => ({
    label: `Stall ${stall.number} (${stall.dimensions.width}m × ${stall.dimensions.height}m = ${(stall.dimensions.width * stall.dimensions.height).toFixed(2)} sqm) - ₹${stall.ratePerSqm.toLocaleString()}/sq.m`,
    value: stall._id || stall.id
  }));

  // Add this new function to handle discount changes
  const handleDiscountChange = (discountId: string | undefined) => {
    setSelectedDiscountId(discountId);
    form.setFieldValue('discountId', discountId);
  };

  // Calculate all amounts based on current state
  const calculateAmounts = () => {
    const baseAmount = selectedStalls.reduce(
      (sum, stall) => sum + calculateBaseAmount(stall),
      0
    );

    const selectedDiscount = selectedExhibition?.discountConfig?.find(
      d => `${d.name}-${d.value}-${d.type}` === selectedDiscountId && d.isActive
    );

    const discountAmount = selectedDiscount
      ? (selectedDiscount.type === 'percentage'
        ? Math.round((baseAmount * selectedDiscount.value / 100) * 100) / 100
        : Math.min(selectedDiscount.value, baseAmount))
      : 0;

    const amountAfterDiscount = Math.round((baseAmount - discountAmount) * 100) / 100;

    const taxes = selectedExhibition?.taxConfig
      ?.filter(tax => tax.isActive)
      .map(tax => ({
        name: tax.name,
        rate: tax.rate,
        amount: Math.round((amountAfterDiscount * tax.rate / 100) * 100) / 100
      })) || [];

    const totalTaxAmount = taxes.reduce((sum, tax) => sum + tax.amount, 0);
    const totalAmount = Math.round((amountAfterDiscount + totalTaxAmount) * 100) / 100;

    return {
      baseAmount,
      selectedDiscount,
      discountAmount,
      amountAfterDiscount,
      taxes,
      totalTaxAmount,
      totalAmount
    };
  };

  // Function to get selected extra amenities data
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

  // Handle extra amenities selection
  const handleExtraAmenitiesChange = (selectedIds: string[]) => {
    // Initialize quantity of 1 for newly selected amenities
    const updatedQuantities = { ...extraAmenityQuantities };
    
    // Set quantity = 1 for any newly selected amenities
    selectedIds.forEach(id => {
      if (!selectedExtraAmenities.includes(id)) {
        updatedQuantities[id] = 1;
      }
    });
    
    // Remove quantities for deselected amenities
    Object.keys(updatedQuantities).forEach(id => {
      if (!selectedIds.includes(id)) {
        delete updatedQuantities[id];
      }
    });
    
    setExtraAmenityQuantities(updatedQuantities);
    setSelectedExtraAmenities(selectedIds);
  };

  // Handle quantity change for extra amenities
  const handleExtraAmenityQuantityChange = (amenityId: string, quantity: number) => {
    setExtraAmenityQuantities(prev => ({
      ...prev,
      [amenityId]: quantity
    }));
  };

  const handleInvoiceClick = (bookingId: string) => {
    navigate(`/invoice/${bookingId}`);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Space direction="vertical" size={4}>
            <Title level={2} style={{ margin: 0 }}>Create Booking</Title>
            <Typography.Text type="secondary">Create a new stall booking</Typography.Text>
          </Space>
        </Col>
        <Col span={24}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              style={{ maxWidth: 800 }}
            >
              <Row gutter={16}>
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
                          style={{ padding: 0 }}
                        >
                          Add Exhibitor
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
                      filterOption={(input, option) =>
                        (option?.label?.toString() ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                    />
                  </Form.Item>
                </Col>
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
                      options={stalls.map(stall => ({
                        label: `Stall ${stall.number} (${stall.dimensions.width}m × ${stall.dimensions.height}m = ${(stall.dimensions.width * stall.dimensions.height).toFixed(2)} sqm) - ₹${stall.ratePerSqm.toLocaleString()}/sq.m`,
                        value: stall._id || stall.id
                      }))}
                    />
                  </Form.Item>
                </Col>

                {selectedStalls.length > 0 && (
                  <>
                    <Col span={24}>
                      <Card title="Selected Stalls Summary" size="small">
                        <Table
                          dataSource={selectedStalls.map(stall => ({
                            ...stall,
                            key: stall._id || stall.id
                          }))}
                          pagination={false}
                          size="small"
                          columns={[
                            {
                              title: 'Stall Number',
                              dataIndex: 'number',
                              key: 'number'
                            },
                            {
                              title: 'Stall Type',
                              key: 'type',
                              render: (_, stall) => stall.stallType?.name || (typeof stall.stallTypeId === 'object' ? stall.stallTypeId?.name : 'Not specified')
                            },
                            {
                              title: 'Dimensions',
                              key: 'dimensions',
                              render: (_, stall) => `${stall.dimensions.width}m × ${stall.dimensions.height}m`
                            },
                            {
                              title: 'Area (sqm)',
                              key: 'area',
                              render: (_, stall) => (stall.dimensions.width * stall.dimensions.height).toFixed(2)
                            },
                            {
                              title: 'Rate/sq.m',
                              dataIndex: 'ratePerSqm',
                              key: 'rate',
                              render: (rate) => `₹${rate.toLocaleString()}`
                            },
                            {
                              title: 'Base Amount',
                              key: 'baseAmount',
                              render: (_, stall) => `₹${calculateBaseAmount(stall).toLocaleString()}`
                            }
                          ]}
                          summary={() => {
                            const totalBaseAmount = selectedStalls.reduce(
                              (sum, stall) => sum + calculateBaseAmount(stall),
                              0
                            );
                            return (
                              <Table.Summary.Row key="summary">
                                <Table.Summary.Cell index={0} colSpan={5}>
                                  <strong>Total Base Amount</strong>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={1}>
                                  <strong>₹{totalBaseAmount.toLocaleString()}</strong>
                                </Table.Summary.Cell>
                              </Table.Summary.Row>
                            );
                          }}
                        />
                      </Card>
                    </Col>

                    {/* Amenities Section */}
                    <Col span={24}>
                      <Card title="Stall Amenities" size="small">
                        <Row gutter={[16, 24]}>
                          {/* Basic Amenities Section */}
                          <Col span={24}>
                            <div style={{ marginBottom: 16 }}>
                              <Typography.Title level={5} style={{ margin: 0 }}>
                                <Space>
                                  <span>Included Basic Amenities</span>
                                  <Tag color="green">Based on stall area</Tag>
                                </Space>
                              </Typography.Title>
                              <Typography.Text type="secondary">
                                The following amenities are included based on your total stall area of {totalStallArea.toFixed(2)} sqm.
                              </Typography.Text>
                            </div>
                            
                            {selectedExhibition?.basicAmenities?.length ? (
                              <Table 
                                dataSource={basicAmenitiesWithQuantities.filter(a => a.calculatedQuantity > 0)} 
                                columns={[
                                  {
                                    title: 'Name',
                                    dataIndex: 'name',
                                    key: 'name',
                                    render: (text, record: any) => (
                                      <Space>
                                        <Typography.Text strong>{text}</Typography.Text>
                                        <Tag color="blue">{record.type}</Tag>
                                      </Space>
                                    )
                                  },
                                  {
                                    title: 'Quantity',
                                    dataIndex: 'calculatedQuantity',
                                    key: 'calculatedQuantity',
                                    width: 120,
                                    render: (quantity: number) => (
                                      <Tag color="green">{quantity} {quantity === 1 ? 'unit' : 'units'}</Tag>
                                    )
                                  },
                                  {
                                    title: 'Allocation',
                                    dataIndex: 'perSqm',
                                    key: 'perSqm',
                                    width: 180,
                                    render: (perSqm: number, record: any) => (
                                      <Tooltip title={record.description}>
                                        <Typography.Text type="secondary">
                                          <InfoCircleOutlined style={{ marginRight: 5 }} />
                                          1 {record.quantity > 1 ? `set of ${record.quantity}` : 'unit'} per {perSqm} sqm
                                        </Typography.Text>
                                      </Tooltip>
                                    )
                                  },
                                  {
                                    title: 'Status',
                                    key: 'status',
                                    width: 100,
                                    align: 'right' as 'right',
                                    render: () => <Typography.Text type="success">Included</Typography.Text>
                                  }
                                ]}
                                pagination={false}
                                size="small"
                                locale={{
                                  emptyText: <Typography.Text>No basic amenities qualify based on the selected stall area.</Typography.Text>
                                }}
                              />
                            ) : (
                              <Typography.Text type="secondary">
                                No basic amenities have been configured for this exhibition.
                              </Typography.Text>
                            )}
                          </Col>
                          
                          {/* Extra Amenities Section */}
                          <Col span={24}>
                            <Divider style={{ margin: '12px 0 24px' }} />
                            <div style={{ marginBottom: 16 }}>
                              <Typography.Title level={5} style={{ margin: 0 }}>
                                <Space>
                                  <span>Additional Amenities</span>
                                  <Tag color="blue">Optional</Tag>
                                </Space>
                              </Typography.Title>
                              <Typography.Text type="secondary">
                                Select any additional amenities for the booking.
                              </Typography.Text>
                            </div>
                            
                            {selectedExhibition?.amenities?.length ? (
                              <>
                                <Form.Item
                                  name="extraAmenities"
                                  label="Select Additional Amenities"
                                >
                                  <Select
                                    mode="multiple"
                                    placeholder="Select amenities"
                                    style={{ width: '100%' }}
                                    onChange={handleExtraAmenitiesChange}
                                    optionLabelProp="label"
                                    options={selectedExhibition.amenities.map((amenity: any) => ({
                                      label: `${amenity.name} (${amenity.rate ? `₹${amenity.rate.toLocaleString()}` : 'N/A'})`,
                                      value: amenity._id || amenity.id,
                                      key: amenity._id || amenity.id
                                    }))}
                                  />
                                </Form.Item>
                                
                                {selectedExtraAmenities.length > 0 && (
                                  <div style={{ marginTop: 16 }}>
                                    <Typography.Text strong>Selected Amenities:</Typography.Text>
                                    <Table 
                                      dataSource={getSelectedExtraAmenities()} 
                                      columns={[
                                        {
                                          title: 'Name',
                                          dataIndex: 'name',
                                          key: 'name',
                                          render: (text, record: any) => (
                                            <Space align="center">
                                              <Typography.Text strong>{text}</Typography.Text>
                                              <Tag color="blue">{record.type}</Tag>
                                              <Typography.Text type="secondary" style={{ fontSize: '13px' }}>
                                                {record.description || ''}
                                              </Typography.Text>
                                            </Space>
                                          )
                                        },
                                        {
                                          title: 'Rate',
                                          dataIndex: 'rate',
                                          key: 'rate',
                                          width: 120,
                                          align: 'right' as 'right',
                                          render: (rate: number) => (
                                            <Typography.Text strong style={{ color: '#1890ff' }}>
                                              ₹{rate.toLocaleString('en-IN')}
                                            </Typography.Text>
                                          )
                                        },
                                        {
                                          title: 'Quantity',
                                          dataIndex: 'quantity',
                                          key: 'quantity',
                                          width: 120,
                                          render: (_: any, record: any) => (
                                            <InputNumber
                                              min={1}
                                              value={extraAmenityQuantities[record.id] || 1}
                                              onChange={(value) => handleExtraAmenityQuantityChange(record.id, value || 1)}
                                              style={{ width: '100%' }}
                                            />
                                          )
                                        },
                                        {
                                          title: 'Total',
                                          key: 'total',
                                          width: 120,
                                          align: 'right' as 'right',
                                          render: (_: any, record: any) => {
                                            const quantity = extraAmenityQuantities[record.id] || 1;
                                            const total = record.rate * quantity;
                                            return (
                                              <Typography.Text strong style={{ color: '#1890ff' }}>
                                                ₹{total.toLocaleString('en-IN')}
                                              </Typography.Text>
                                            );
                                          }
                                        }
                                      ]}
                                      pagination={false}
                                      size="small"
                                    />
                                  </div>
                                )}
                              </>
                            ) : (
                              <Typography.Text type="secondary">
                                No additional amenities have been configured for this exhibition.
                              </Typography.Text>
                            )}
                          </Col>
                        </Row>
                      </Card>
                    </Col>

                    <Col span={24}>
                      <Card title="Price Calculations" size="small">
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <Form.Item
                              name="discountId"
                              label="Available Discounts"
                            >
                              <Select
                                placeholder="Select discount"
                                allowClear
                                onChange={handleDiscountChange}
                                options={selectedExhibition?.discountConfig
                                  ?.map(d => ({
                                    label: `${d.name} (${d.type === 'percentage' ? d.value + '%' : '₹' + d.value})${!d.isActive ? ' - Inactive' : ''}`,
                                    value: `${d.name}-${d.value}-${d.type}`,
                                    disabled: !d.isActive
                                  }))}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <div style={{ 
                          background: '#fafafa',
                          padding: '16px',
                          borderRadius: '8px',
                          marginTop: '16px'
                        }}>
                          <Space direction="vertical" style={{ width: '100%' }} size="small">
                            {(() => {
                              const {
                                baseAmount,
                                selectedDiscount,
                                discountAmount,
                                amountAfterDiscount,
                                taxes,
                                totalTaxAmount,
                                totalAmount
                              } = calculateAmounts();

                              return (
                                <>
                                  {/* Base Amount */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Total Base Amount:</Text>
                                    <Text>₹{baseAmount.toLocaleString()}</Text>
                                  </div>

                                  {/* Discount */}
                                  {selectedDiscount && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Text>
                                        Discount ({selectedDiscount.type === 'percentage' 
                                          ? `${selectedDiscount.value}%` 
                                          : `₹${selectedDiscount.value.toLocaleString()}`
                                        }):
                                      </Text>
                                      <Text type="danger">-₹{discountAmount.toLocaleString()}</Text>
                                    </div>
                                  )}

                                  {/* Amount after Discount */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text>Amount after Discount:</Text>
                                    <Text>₹{amountAfterDiscount.toLocaleString()}</Text>
                                  </div>

                                  {/* Divider for Taxes */}
                                  <Divider style={{ margin: '8px 0' }} />

                                  {/* Taxes */}
                                  {taxes.map(tax => (
                                    <div key={`tax-${tax.name}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <Text>{tax.name} ({tax.rate}%):</Text>
                                      <Text>₹{tax.amount.toLocaleString()}</Text>
                                    </div>
                                  ))}

                                  {/* Total Amount */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <Text strong>Total Amount (incl. Taxes):</Text>
                                    <Text strong>₹{totalAmount.toLocaleString()}</Text>
                                  </div>
                                </>
                              );
                            })()}
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  </>
                )}

                <Col span={24}>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" loading={loading}>
                        Create Booking
                      </Button>
                      <Button onClick={() => navigate('/bookings')}>
                        Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <span style={{ 
            fontSize: '18px', 
            fontWeight: 600,
            color: '#101828'
          }}>
            Add Exhibitor
          </span>
        }
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          exhibitorForm.resetFields();
        }}
        width={800}
        footer={
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'flex-end', 
            padding: '20px 24px',
            borderTop: '1px solid #E5E7EB'
          }}>
            <Button 
              onClick={() => {
                setIsModalVisible(false);
                exhibitorForm.resetFields();
              }}
              size="large"
              style={{ 
                height: '44px',
                padding: '12px 20px',
                borderRadius: '8px',
                border: '1px solid #D0D5DD',
                color: '#344054',
                fontWeight: 500,
                fontSize: '14px',
                backgroundColor: 'white',
                minWidth: '100px'
              }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={exhibitorForm.submit}
              size="large"
              style={{ 
                height: '44px',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#6941C6',
                color: 'white',
                fontWeight: 500,
                fontSize: '14px',
                boxShadow: '0px 1px 2px rgba(16, 24, 40, 0.05)',
                minWidth: '140px'
              }}
            >
              Create Exhibitor
            </Button>
          </div>
        }
        styles={{ 
          body: { 
            padding: '24px',
            maxHeight: 'calc(100vh - 200px)',
            overflowY: 'auto'
          },
          header: {
            borderBottom: '1px solid #E5E7EB',
            padding: '24px'
          },
          footer: {
            borderTop: '1px solid #E5E7EB',
            padding: 0
          }
        }}
        style={{
          top: 20
        }}
      >
        <Form
          form={exhibitorForm}
          layout="vertical"
          onFinish={handleExhibitorAdded}
          requiredMark={false}
          scrollToFirstError
        >
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '32px'
          }}>
            {/* Company Information Section */}
            <div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '2px solid #F3F4F6'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ fontSize: '16px' }}>🏢</span>
                </div>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#101828',
                  margin: 0
                }}>
                  Company Information
                </h3>
              </div>
              
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[
                  { required: true, message: 'Please enter company name' },
                  { min: 2, message: 'Company name must be at least 2 characters' },
                  { max: 100, message: 'Company name cannot exceed 100 characters' }
                ]}
              >
                <Input 
                  placeholder="Enter company name"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="Enter complete address"
                  showCount
                  maxLength={200}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: 'Please enter city' }]}
                  >
                    <Input placeholder="Enter city" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="state"
                    label="State"
                    rules={[{ required: true, message: 'Please enter state' }]}
                  >
                    <Input placeholder="Enter state" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="pinCode"
                label="PIN Code"
                rules={[
                  { required: true, message: 'Please enter PIN code' },
                  { pattern: /^\d{6}$/, message: 'Please enter a valid 6-digit PIN code' }
                ]}
              >
                <Input placeholder="123456" maxLength={6} />
              </Form.Item>

              <Form.Item
                name="website"
                label="Website"
                rules={[
                  { type: 'url', message: 'Please enter a valid website URL' }
                ]}
              >
                <Input placeholder="https://www.company.com" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Company Description"
              >
                <Input.TextArea 
                  rows={3} 
                  placeholder="Brief description about the company"
                  showCount
                  maxLength={500}
                />
              </Form.Item>
            </div>

            {/* Contact & Legal Information Section */}
            <div>
              <div style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '24px',
                paddingBottom: '12px',
                borderBottom: '2px solid #F3F4F6'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#FEF3F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <span style={{ fontSize: '16px' }}>👤</span>
                </div>
                <h3 style={{ 
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#101828',
                  margin: 0
                }}>
                  Contact & Legal Information
                </h3>
              </div>
              
              <Form.Item
                name="contactPerson"
                label="Contact Person"
                rules={[
                  { required: true, message: 'Please enter contact person' },
                  { min: 2, message: 'Name must be at least 2 characters' },
                  { max: 100, message: 'Name cannot exceed 100 characters' }
                ]}
              >
                <Input placeholder="Enter contact person name" size="large" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' }
                ]}
                extra="Login credentials will be sent to this email"
              >
                <Input 
                  placeholder="contact@company.com" 
                  size="large"
                  prefix={<span style={{ color: '#9CA3AF' }}>📧</span>}
                />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { pattern: /^[0-9-+()]*$/, message: 'Please enter a valid phone number' }
                ]}
              >
                <Input 
                  placeholder="9876543210" 
                  size="large"
                  prefix={<span style={{ color: '#9CA3AF' }}>📱</span>}
                />
              </Form.Item>

              <Form.Item
                name="panNumber"
                label="PAN Number"
                rules={[
                  { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Please enter a valid PAN number (e.g., ABCDE1234F)' }
                ]}
              >
                <Input 
                  placeholder="ABCDE1234F" 
                  style={{ textTransform: 'uppercase' }}
                  maxLength={10}
                />
              </Form.Item>

              <Form.Item
                name="gstNumber"
                label="GST Number"
                rules={[
                  { pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: 'Please enter a valid GST number' }
                ]}
              >
                <Input 
                  placeholder="27AAPFU0939F1ZV" 
                  style={{ textTransform: 'uppercase' }}
                  maxLength={15}
                />
              </Form.Item>

              <Form.Item
                name="isActive"
                label="Account Status"
                initialValue={true}
                valuePropName="checked"
              >
                <Switch 
                  checkedChildren="Active" 
                  unCheckedChildren="Inactive"
                  size="default"
                />
              </Form.Item>
            </div>
          </div>

          {/* Information Alert */}
          <div style={{ 
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#F0F9FF',
            border: '1px solid #BAE6FD',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ fontSize: '16px', marginTop: '2px' }}>ℹ️</span>
            <div>
              <div style={{ fontWeight: 600, color: '#0369A1', marginBottom: '4px' }}>
                Account Creation Notice
              </div>
              <div style={{ color: '#0369A1', fontSize: '14px', lineHeight: '1.5' }}>
                • A temporary password will be automatically generated and sent to the provided email<br/>
                • The exhibitor will be pre-approved and can log in immediately<br/>
                • They should change their password after first login for security
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateBooking; 