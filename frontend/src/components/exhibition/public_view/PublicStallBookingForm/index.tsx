import React, { useState, useEffect } from 'react';
import { Steps, Form, message, Button, Spin, Row, Col, Modal } from 'antd';
import { CheckCircleOutlined, FormOutlined, AppstoreOutlined, ExclamationCircleOutlined, CheckOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/store';
import StallDetailsStep from './steps/StallDetailsStep';
import AmenitiesStep from './steps/AmenitiesStep';
import ReviewStep from './steps/ReviewStep';
import { StyledModal, StepsNav, StepContent, StyledButton } from './styles';

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
      confirm({
        title: 'Discard changes?',
        icon: <ExclamationCircleOutlined />,
        content: 'You have unsaved changes. Are you sure you want to close this form?',
        onOk() {
          onCancel();
        },
      });
    } else {
      onCancel();
    }
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
        
        // Combine with all accumulated form values
        const finalValues = { ...formValues, ...values, ...currentExhibitorInfo };
        
        // Log the final submission values
        console.log('Submitting booking with values:', finalValues);
        
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
  );
};

export default PublicStallBookingForm; 