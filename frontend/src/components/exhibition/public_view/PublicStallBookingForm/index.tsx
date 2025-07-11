import React, { useState, useEffect } from 'react';
import { Steps, Form, message, Button, Spin, Row, Col, Modal } from 'antd';
import { CheckCircleOutlined, FormOutlined, AppstoreOutlined, ExclamationCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import StallDetailsStep from './steps/StallDetailsStep';
import AmenitiesStep from './steps/AmenitiesStep';
import ReviewStep from './steps/ReviewStep';
import { StyledModal, StepsNav, StepContent, StyledButton } from './styles';

// Inline utility function to calculate stall area
const calculateStallArea = (dimensions: any) => {
  if (!dimensions) return 0;
  
  const shapeType = dimensions.shapeType || 'rectangle';
  
  if (shapeType === 'rectangle') {
    return dimensions.width * dimensions.height;
  }
  
  if (shapeType === 'l-shape' && dimensions.lShape) {
    const { rect1Width, rect1Height, rect2Width, rect2Height } = dimensions.lShape;
    return (rect1Width * rect1Height) + (rect2Width * rect2Height);
  }
  
  // Fallback to rectangle
  return dimensions.width * dimensions.height;
};

interface PublicStallBookingFormProps {
  visible: boolean;
  stallDetails: any;
  selectedStallId: string | null;
  selectedStallIds: string[];
  loading: boolean;
  exhibition: any;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const { confirm } = Modal;

const PublicStallBookingForm: React.FC<PublicStallBookingFormProps> = ({
  visible,
  stallDetails,
  selectedStallId,
  selectedStallIds,
  loading,
  exhibition,
  onCancel,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps] = useState(3); // Now including amenities step
  const [formValues, setFormValues] = useState<any>({});
  const [formChanged, setFormChanged] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  
  // Get exhibitor profile from Redux store
  const exhibitor = useSelector((state: RootState) => state.exhibitorAuth.exhibitor);
  
  // On mount, set up the form
  useEffect(() => {
    if (visible) {
      // Always start from step 0 when modal is opened
      setCurrentStep(0);
      setFormChanged(false);
      setFormValues({}); // Reset form values
      
      // First, reset the form completely
      form.resetFields();
      
      // Convert IDs to strings for consistency
      const normalizedIds = selectedStallIds.map(id => String(id));
      if (selectedStallId) {
        normalizedIds.push(String(selectedStallId));
      }
      
      // Remove duplicates
      const uniqueIds = [...new Set(normalizedIds)];
      
      // Set initial form values with exhibitor profile information
      const initialValues: any = {
        selectedStalls: uniqueIds,
        exhibitionId: exhibition?._id
      };
      
      // Add exhibitor profile information if available
      if (exhibitor) {
        initialValues.customerName = exhibitor.contactPerson || '';
        initialValues.companyName = exhibitor.companyName || '';
        initialValues.email = exhibitor.email || '';
        initialValues.customerPhone = exhibitor.phone || '';
      }
      
      form.setFieldsValue(initialValues);
      
      // Store these values in formValues state as well
      setFormValues(initialValues);
      
      console.log('Booking form initialized with stalls:', uniqueIds);
      console.log('Exhibitor profile data:', exhibitor);
    }
  }, [visible, form, selectedStallId, selectedStallIds, exhibition, exhibitor]);

  // Listen for form changes
  const onFieldsChange = () => {
    setFormChanged(true);
  };

  const handleCancel = () => {
    if (formChanged) {
      setShowDiscardModal(true);
    } else {
      onCancel();
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscardModal(false);
    onCancel();
  };

  const handleDiscardCancel = () => {
    setShowDiscardModal(false);
  };

  const nextStep = () => {
    setStepLoading(true);
    form.validateFields()
      .then(values => {
        // Save all form values from the current step
        const updatedFormValues = { ...formValues, ...values };
        
        // Make sure exhibitor info is preserved when moving between steps
        const currentExhibitorInfo = {
          customerName: form.getFieldValue('customerName'),
          companyName: form.getFieldValue('companyName'),
          email: form.getFieldValue('email'),
          customerPhone: form.getFieldValue('customerPhone')
        };
        
        // Combine with updated values
        const finalValues = { ...updatedFormValues, ...currentExhibitorInfo };
        setFormValues(finalValues);
        
        // Log what's being saved for debugging
        console.log('Step completed, saving form values:', finalValues);
        console.log('Selected stalls are:', finalValues.selectedStalls || []);
        console.log('Exhibitor info:', currentExhibitorInfo);
        
        setCurrentStep(currentStep + 1);
        setStepLoading(false);
      })
      .catch(error => {
        setStepLoading(false);
        console.error('Form validation failed:', error);
        message.error('Please complete all required fields');
      });
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    form.validateFields()
      .then(values => {
        // Get current exhibitor info from the form
        const currentExhibitorInfo = {
          customerName: form.getFieldValue('customerName'),
          companyName: form.getFieldValue('companyName'),
          email: form.getFieldValue('email'),
          customerPhone: form.getFieldValue('customerPhone')
        };
        
        // Calculate amenities based on current form values
        const selectedStalls = form.getFieldValue('selectedStalls') || [];
        const amenitiesData = form.getFieldValue('amenities') || [];
        
        // Find the matching stalls in stallDetails
        const selectedStallDetails = stallDetails.filter((stall: any) => 
          selectedStalls.includes(String(stall.id))
        );
        
        // Calculate total stall area
        const totalStallArea = selectedStallDetails.reduce((total: number, stall: any) => 
          total + calculateStallArea(stall.dimensions),
          0
        );
        
        // Calculate basic amenities quantities based on total area
        let basicAmenities: any[] = [];
        if (exhibition?.basicAmenities && exhibition.basicAmenities.length > 0) {
          basicAmenities = exhibition.basicAmenities
            .filter((amenity: any) => {
              const calculatedQuantity = Math.floor(totalStallArea / amenity.perSqm) * amenity.quantity;
              return calculatedQuantity > 0;
            })
            .map((amenity: any) => {
              const calculatedQuantity = Math.floor(totalStallArea / amenity.perSqm) * amenity.quantity;
              return {
                name: amenity.name,
                type: amenity.type,
                perSqm: amenity.perSqm,
                quantity: amenity.quantity,
                calculatedQuantity,
                description: amenity.description || ''
              };
            });
        }
        
        // Format the extra amenities
        let extraAmenities: any[] = [];
        if (amenitiesData && amenitiesData.length > 0) {
          extraAmenities = amenitiesData.map((item: any) => {
            const amenity = exhibition?.amenities?.find((a: any) => 
              String(a._id || a.id) === String(item.id)
            );
            
            if (!amenity) return null;
            
            return {
              id: String(amenity._id || amenity.id),
              name: amenity.name,
              type: amenity.type,
              rate: amenity.rate,
              quantity: item.quantity || 1,
              description: amenity.description || ''
            };
          }).filter(Boolean);
        }
        
        // Combine with all accumulated form values
        const finalValues = { 
          ...formValues, 
          ...values, 
          ...currentExhibitorInfo,
          basicAmenities,
          extraAmenities
        };
        
        // Log the final submission values
        console.log('Submitting booking with values:', finalValues);
        console.log('Basic amenities:', basicAmenities);
        console.log('Extra amenities:', extraAmenities);
        
        onSubmit(finalValues);
      })
      .catch(error => {
        console.error('Form validation failed:', error);
        message.error('Please complete all required fields');
      });
  };

  const stepTitles = ['Stall Details', 'Amenities', 'Review'];

  const steps = [
    {
      title: 'Stall Details',
      icon: <FormOutlined />,
      content: (
        <StallDetailsStep 
          form={form}
          stallDetails={stallDetails}
          selectedStallId={selectedStallId}
          selectedStallIds={selectedStallIds}
          exhibition={exhibition}
          // Remove onNext to avoid duplicate buttons
        />
      )
    },
    {
      title: 'Amenities',
      icon: <AppstoreOutlined />,
      content: (
        <AmenitiesStep 
          form={form}
          stallDetails={stallDetails}
          selectedStallIds={form.getFieldValue('selectedStalls') || []}
          exhibition={exhibition}
          formValues={formValues}
          // Remove onNext and onPrev to avoid duplicate buttons
        />
      )
    },
    {
      title: 'Review',
      icon: <CheckCircleOutlined />,
      content: (
        <ReviewStep 
          form={form}
          formValues={formValues}
          loading={loading}
          exhibition={exhibition}
          selectedStalls={form.getFieldValue('selectedStalls') || []}
          selectedStallIds={form.getFieldValue('selectedStalls') || []}
          stallDetails={stallDetails}
          // Remove onPrev and onFinish to avoid duplicate buttons
        />
      )
    }
  ];

  // Add a useEffect to log form field values when the step changes
  useEffect(() => {
    // This helps us debug what values are in the form at each step
    const selectedStallsValue = form.getFieldValue('selectedStalls');
    console.log(`Step ${currentStep} - Form has selectedStalls:`, selectedStallsValue);
  }, [currentStep, form]);

  // Make sure the steps content is updated with the latest form values
  const getStepContent = (step: number) => {
    // Always get the latest selected stalls from the form
    const currentSelectedStalls = form.getFieldValue('selectedStalls') || [];
    
    // Get the current exhibitor information from the form
    const currentExhibitorInfo = {
      customerName: form.getFieldValue('customerName'),
      companyName: form.getFieldValue('companyName'),
      email: form.getFieldValue('email'),
      customerPhone: form.getFieldValue('customerPhone')
    };
    
    // Combine form values with current exhibitor info
    const currentFormValues = { ...formValues, ...currentExhibitorInfo };
    
    // Log what's being passed to each step
    console.log(`Rendering step ${step} with:`, {
      selectedStalls: currentSelectedStalls,
      exhibitorInfo: currentExhibitorInfo
    });
    
    switch(step) {
      case 0:
        return (
          <StallDetailsStep 
            form={form}
            stallDetails={stallDetails}
            selectedStallId={selectedStallId}
            selectedStallIds={selectedStallIds}
            exhibition={exhibition}
          />
        );
      case 1:
        return (
          <AmenitiesStep 
            form={form}
            stallDetails={stallDetails}
            selectedStallIds={currentSelectedStalls}
            exhibition={exhibition}
            formValues={currentFormValues}
          />
        );
      case 2:
        // For the review step, pass all necessary props including exhibitor info
        return (
          <ReviewStep 
            form={form}
            formValues={currentFormValues}
            loading={loading}
            exhibition={exhibition}
            selectedStalls={currentSelectedStalls}
            selectedStallIds={currentSelectedStalls}
            stallDetails={stallDetails}
            onPrev={prevStep}
            onFinish={handleFinish}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <StyledModal
        title={`Book Exhibition Stall - ${stepTitles[currentStep]}`}
        open={visible}
        onCancel={handleCancel}
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px' }}>
            {currentStep > 0 && (
              <StyledButton onClick={prevStep} disabled={stepLoading || loading} size="large">
                Back
              </StyledButton>
            )}
            <div>
              {currentStep < totalSteps - 1 ? (
                <StyledButton type="primary" onClick={nextStep} loading={stepLoading} disabled={loading} size="large">
                  Next
                </StyledButton>
              ) : (
                <StyledButton type="primary" onClick={handleFinish} loading={loading} disabled={stepLoading} size="large">
                  Submit Booking
                </StyledButton>
              )}
            </div>
          </div>
        }
        width={900}
        destroyOnClose
        maskClosable={false}
        className="booking-modal"
      >
        <Spin spinning={loading || stepLoading} tip={loading ? "Processing your booking..." : "Validating..."}>
          <StepsNav>
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`step-item ${currentStep === index ? 'active' : ''} ${currentStep > index ? 'completed' : ''}`}
                onClick={() => currentStep > index ? setCurrentStep(index) : null}
                style={{ cursor: currentStep > index ? 'pointer' : 'default' }}
              >
                <span className="step-icon">
                  {currentStep > index ? <CheckOutlined /> : index + 1}
                </span>
                {step.title}
              </div>
            ))}
          </StepsNav>
          
          <Form 
            form={form} 
            layout="vertical" 
            preserve={true}
            onFieldsChange={onFieldsChange}
            key={`form-step-${currentStep}`}
          >
            {getStepContent(currentStep)}
          </Form>
        </Spin>
      </StyledModal>

      {/* Custom Discard Changes Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '18px' }} />
            <span>Discard Changes?</span>
          </div>
        }
        open={showDiscardModal}
        onCancel={handleDiscardCancel}
        footer={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '8px',
            padding: '8px 0'
          }}>
            <Button 
              onClick={handleDiscardCancel}
              size="large"
              style={{ minWidth: '100px' }}
            >
              Keep Editing
            </Button>
            <Button 
              type="primary" 
              danger 
              onClick={handleDiscardConfirm}
              size="large"
              style={{ minWidth: '100px' }}
            >
              Discard Changes
            </Button>
          </div>
        }
        width={480}
        centered
        maskClosable={false}
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
            You have unsaved changes in your booking form. If you close now, all your progress will be lost.
          </p>
          <p style={{ margin: '12px 0 0 0', fontSize: '14px', lineHeight: '1.6', color: '#666' }}>
            Are you sure you want to discard your changes and close the form?
          </p>
        </div>
      </Modal>
    </>
  );
};

export default PublicStallBookingForm; 