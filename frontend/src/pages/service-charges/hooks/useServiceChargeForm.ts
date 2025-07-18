import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, App } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import publicServiceChargeService from '../../../services/publicServiceCharge';
import { 
  ExhibitionConfig, 
  ServiceChargeStall, 
  FormData, 
  PaymentResult, 
  PaymentStatus 
} from '../types';

export const useServiceChargeForm = () => {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  
  // Main state
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exhibition, setExhibition] = useState<ExhibitionConfig | null>(null);
  const [stalls, setStalls] = useState<ServiceChargeStall[]>([]);
  const [selectedStall, setSelectedStall] = useState<ServiceChargeStall | null>(null);
  const [formData, setFormData] = useState<FormData>({
    vendorName: '',
    companyName: '',
    exhibitorCompanyName: '',
    vendorPhone: '',
    stallNumber: '',
    stallArea: 0,
    serviceType: '',
    uploadedImage: '',
  });

  // Payment state
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [failedServiceChargeId, setFailedServiceChargeId] = useState<string | null>(null);

  // Upload state
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Fetch exhibition configuration
  const fetchExhibitionConfig = async () => {
    try {
      setLoading(true);
      const response = await publicServiceChargeService.getServiceChargeConfig(exhibitionId!);
      setExhibition(response.data.data);
    } catch (error) {
      console.error('Error fetching exhibition config:', error);
      message.error('Failed to load exhibition configuration');
    } finally {
      setLoading(false);
    }
  };

  // Fetch available stalls for the exhibition
  const fetchStalls = async () => {
    try {
      const response = await fetch(`/api/public/service-charge/stalls/${exhibitionId}`);
      if (response.ok) {
        const data = await response.json();
        setStalls(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching stalls:', error);
      // Don't show error message here as it's not critical for backward compatibility
    }
  };

  // Handle stall selection and auto-fill
  const handleStallSelection = (stallNumber: string) => {
    const stall = stalls.find(s => s.stallNumber === stallNumber);
    if (stall) {
      setSelectedStall(stall);
      // Auto-fill exhibitor company name and set stall number in form
      form.setFieldsValue({
        stallNumber: stallNumber,
        exhibitorCompanyName: stall.exhibitorCompanyName
      });
      setFormData(prev => ({
        ...prev,
        stallNumber: stallNumber,
        exhibitorCompanyName: stall.exhibitorCompanyName,
        stallArea: stall.stallArea
      }));
    } else {
      setSelectedStall(null);
      // Clear auto-filled data if manual entry
      if (stalls.length > 0) {
        form.setFieldsValue({
          stallNumber: stallNumber,
          exhibitorCompanyName: ''
        });
        setFormData(prev => ({
          ...prev,
          stallNumber: stallNumber,
          exhibitorCompanyName: '',
          stallArea: 0
        }));
      }
    }
  };

  // Handle navigation
  const handleNext = async () => {
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      // Additional validation for stall-based pricing
      if (stalls.length > 0 && !selectedStall) {
        message.warning('Please select a stall to proceed.');
        return;
      }
      
      // Additional validation for legacy service type
      if (stalls.length === 0 && exhibition?.config.serviceTypes && !values.serviceType) {
        message.warning('Please select a service type to proceed.');
        return;
      }
      
      // Preserve the uploadedImage file when updating formData
      setFormData({ ...formData, ...values, uploadedImage: formData.uploadedImage });
      setCurrentStep(currentStep + 1);
    } catch (errorInfo) {
      console.log('Form validation failed:', errorInfo);
      message.error('Please fill in all required fields correctly.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  // Cancel payment and reset form
  const handleCancelPayment = () => {
    console.log('[Cancel Payment] User clicked cancel, resetting form and navigating to original form URL');
    
    // ✅ CRITICAL FIX: Navigate back to original form URL instead of just clearing query params
    // This prevents the payment redirect logic from triggering
    if (exhibitionId) {
      navigate(`/exhibitions/${exhibitionId}/service-charge`, { replace: true });
    } else {
      // Fallback: go to home page if no exhibition ID
      navigate('/', { replace: true });
    }
    
    // Reset all states
    setPaymentStatus('idle');
    setFailedServiceChargeId(null);
    setSelectedStall(null);
    setPaymentResult(null);
    setPaymentVerified(false);
    setVerificationInProgress(false);
    
    // Reset form data
    setFormData({
      vendorName: '',
      companyName: '',
      exhibitorCompanyName: '',
      vendorPhone: '',
      stallNumber: '',
      stallArea: 0,
      serviceType: '',
      uploadedImage: '',
    });
    
    // Reset form fields
    form.resetFields();
    
    // Go back to first step
    setCurrentStep(0);
    
    // Clear any existing messages
    message.destroy();
  };

  // Check if payment already completed manually
  const handleManualPaymentCheck = async () => {
    try {
      setSubmitting(true);
      message.loading('Checking payment status...', 0);
      
      // Check if we have a service charge ID in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const serviceChargeId = urlParams.get('serviceChargeId');
      
      if (!serviceChargeId) {
        message.destroy();
        message.error('No payment ID found. Please initiate payment first.');
        return;
      }

      // Fetch the service charge status
      const statusResponse = await publicServiceChargeService.getServiceChargeStatus(serviceChargeId);
      
      if (statusResponse.data.success) {
        const serviceCharge = statusResponse.data.data;
        
        if (serviceCharge.paymentStatus === 'paid') {
          message.destroy();
          message.success('Payment found! Redirecting to success page...');
          
                     // Prepare payment result data
           const paymentData = {
             serviceChargeId: serviceCharge._id,
             receiptNumber: serviceCharge.receiptNumber,
             paymentId: serviceCharge.phonePeTransactionId,
             amount: serviceCharge.amount,
             paidAt: serviceCharge.paidAt,
             receiptGenerated: serviceCharge.receiptGenerated,
             receiptDownloadUrl: serviceCharge.receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id}` : undefined,
             state: 'COMPLETED'
           };
          
          setPaymentResult(paymentData);
          setCurrentStep(2);
          setPaymentVerified(true); // Mark payment as verified
        } else {
          message.destroy();
          message.info(`Payment status: ${serviceCharge.paymentStatus}. Please try again if you have completed the payment.`);
        }
      } else {
        message.destroy();
        message.error('Could not check payment status. Please try again.');
      }
    } catch (error) {
      message.destroy();
      console.error('Error checking payment status:', error);
      message.error('Error checking payment status. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  // Initialize form on mount
  useEffect(() => {
    if (exhibitionId) {
      fetchExhibitionConfig();
      fetchStalls();
    }
  }, [exhibitionId]);

  // Clear message notifications on mount
  useEffect(() => {
    message.destroy();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setVerificationInProgress(false);
      setPaymentVerified(false);
      message.destroy();
    };
  }, []);

  // Clear notifications when in payment failed state
  useEffect(() => {
    if (paymentStatus === 'failed') {
      message.destroy();
    }
  }, [paymentStatus]);

  return {
    // State
    exhibitionId,
    currentStep,
    setCurrentStep,
    loading,
    setLoading,
    submitting,
    setSubmitting,
    exhibition,
    setExhibition,
    stalls,
    setStalls,
    selectedStall,
    setSelectedStall,
    formData,
    setFormData,
    paymentResult,
    setPaymentResult,
    verificationInProgress,
    setVerificationInProgress,
    paymentVerified,
    setPaymentVerified,
    paymentStatus,
    setPaymentStatus,
    failedServiceChargeId,
    setFailedServiceChargeId,
    fileList,
    setFileList,
    
    // Form
    form,
    message,
    
    // Navigation
    navigate,
    location,
    
    // Functions
    fetchExhibitionConfig,
    fetchStalls,
    handleStallSelection,
    handleNext,
    handlePrevious,
    handleCancelPayment,
    handleManualPaymentCheck,
  };
}; 