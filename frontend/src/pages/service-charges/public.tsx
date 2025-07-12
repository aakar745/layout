import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Steps, 
  Card, 
  Row, 
  Col, 
  Typography, 
  message, 
  Divider, 
  Space, 
  Alert,
  Descriptions,
  Spin,
  Result,
  Tag,
  Layout,
  Upload,
  App
} from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import heic2any from 'heic2any';
import api from '../../services/api';
import { 
  ShoppingCartOutlined, 
  CreditCardOutlined, 
  CheckCircleOutlined, 
  PhoneOutlined, 
  MailOutlined, 
  HomeOutlined, 
  BankOutlined,
  LoadingOutlined,
  InfoCircleOutlined,
  LockOutlined,
  UploadOutlined
} from '@ant-design/icons';
import publicServiceChargeService from '../../services/publicServiceCharge';
import GlobalHeader from '../../components/layout/GlobalHeader';
import GlobalFooter from '../../components/layout/GlobalFooter';
import './ServiceCharges.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;
const { Content } = Layout;

interface ServiceChargeStall {
  _id: string;
  stallNumber: string;
  exhibitorCompanyName: string;
  stallArea: number;
  dimensions?: {
    width: number;
    height: number;
  };
  isActive: boolean;
}

interface ExhibitionConfig {
  _id: string;
  name: string;
  venue: string;
  startDate: string;
  endDate: string;
  config: {
    isEnabled: boolean;
    title: string;
    description: string;
    // Support both old and new pricing systems
    serviceTypes?: {
      type: string;
      amount: number;
    }[];
    pricingRules?: {
      smallStallThreshold: number;
      smallStallPrice: number;
      largeStallPrice: number;
    };
    paymentGateway: 'phonepe';
    phonePeConfig: {
      clientId: string;
      env: 'SANDBOX' | 'PRODUCTION';
    };
  };
}

interface FormData {
  vendorName: string;
  companyName: string;
  exhibitorCompanyName?: string;
  vendorPhone: string;
  stallNumber: string;
  stallArea?: number;
  serviceType?: string; // Keep for backward compatibility
  uploadedImage?: string;
}

const PublicServiceChargeForm: React.FC = () => {
  const { exhibitionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  
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
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Upload props for service charge image
  const uploadProps: UploadProps = {
    name: 'uploadedImage',
    action: `${api.defaults.baseURL}/public/service-charge/upload`,
    headers: {
      // No authorization needed for public uploads
    },
    accept: 'image/*,.heic,.HEIC',
    maxCount: 1,
    fileList,
    listType: 'picture-card',
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
    onPreview: (file) => {
      const imageUrl = file.url || file.thumbUrl;
      if (imageUrl) {
        window.open(imageUrl, '_blank');
      }
    },
    customRequest: async (options) => {
      const { file, onSuccess, onError, onProgress } = options;
      
      // Ensure we have a File object
      if (typeof file === 'string') {
        onError?.(new Error('Invalid file type'));
        return;
      }
      
      let fileToUpload = file as File;
      const originalName = (file as any).name || fileToUpload.name;
      
      // Check if this is a HEIC file and convert it
      if (originalName && originalName.toLowerCase().endsWith('.heic')) {
        try {
          console.log('[HEIC Conversion] Converting HEIC to JPEG...');
          message.loading('Converting HEIC to JPEG...', 0);
          
          const convertedBlob = await heic2any({
            blob: fileToUpload,
            toType: 'image/jpeg',
            quality: 0.8
          }) as Blob;
          
          fileToUpload = new File(
            [convertedBlob], 
            originalName.replace(/\.heic$/i, '.jpg'), 
            { type: 'image/jpeg' }
          );
          
          console.log('[HEIC Conversion] Successfully converted to JPEG');
          message.destroy();
        } catch (error) {
          console.error('[HEIC Conversion] Error:', error);
          message.destroy();
          message.error('Failed to convert HEIC file. Please try a different image.');
          onError?.(error as Error);
          return;
        }
      }
      
      // Upload the file (original or converted)
      const formData = new FormData();
      formData.append('uploadedImage', fileToUpload);
      
      try {
        const response = await fetch(`${api.defaults.baseURL}/public/service-charge/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
          onSuccess?.(result, fileToUpload);
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } catch (error) {
        console.error('[Upload Error]:', error);
        onError?.(error as Error);
      }
    },
    beforeUpload: (file) => {
      console.log('[Frontend Upload] File details:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      // Check file size - 10MB limit
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('Image must be smaller than 10MB!');
        return false;
      }
      
      // Check file extension (more reliable than MIME type for HEIC)
      const fileName = file.name.toLowerCase();
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.heic'];
      const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
      
      // Check MIME type for non-HEIC files (HEIC files can have various MIME types)
      const isStandardImage = file.type.startsWith('image/');
      const isHeicFile = fileName.endsWith('.heic');
      
      if (!hasValidExtension) {
        message.error('Please upload a valid image file (JPG, PNG, GIF, SVG, HEIC)!');
        return false;
      }
      
      // For non-HEIC files, also check MIME type
      if (!isHeicFile && !isStandardImage) {
        message.error('Invalid file type. Please upload an image file!');
        return false;
      }
      
      console.log('[Frontend Upload] File validation passed:', fileName);
      return true;
    },
    onChange(info) {
      const { status, name, response } = info.file;
      
      if (status === 'uploading') {
        setFileList([...info.fileList]);
        return;
      }
      
      if (status === 'done' && response && response.success) {
        console.log('[File Upload] Upload successful:', response);
        
        // Create the file list item with proper URL for display
        const fileListItem = {
          uid: info.file.uid,
          name,
          status: 'done' as const,
          response,
          // Always set the URL since HEIC files are now converted to JPEG
          url: `${api.defaults.baseURL}/public/uploads/${response.path}`,
          thumbUrl: `${api.defaults.baseURL}/public/uploads/${response.path}`
        };
        
        setFileList([fileListItem]);
        setFormData(prev => ({ ...prev, uploadedImage: response.path }));
        
        // Show specific message for HEIC files that were converted
        if (name.toLowerCase().includes('heic') && name.toLowerCase().endsWith('.jpg')) {
          message.success(`HEIC file uploaded successfully! Converted to JPEG for web display.`);
        } else {
          message.success(`${name} uploaded successfully`);
        }
      } else if (status === 'error') {
        console.error('[Upload Error] Details:', {
          name,
          response,
          error: info.file.error
        });
        
        // Handle structured error responses from backend
        if (response?.error === 'LIMIT_FILE_SIZE') {
          message.error(`${name} is too large. Maximum file size is 10MB.`);
        } else if (response?.error === 'INVALID_FILE_TYPE') {
          message.error(`${name} is not a supported file type. Please upload JPG, PNG, GIF, SVG, or HEIC files.`);
        } else if (response?.message) {
          // Use the specific error message from backend
          message.error(response.message);
        } else {
          // Fallback for other errors
          message.error(`${name} upload failed. Please try again.`);
        }
        setFileList([]);
      } else if (status === 'removed') {
        setFileList([]);
        setFormData(prev => ({ ...prev, uploadedImage: '' }));
      }
    },
    onRemove() {
      setFileList([]);
      setFormData(prev => ({ ...prev, uploadedImage: '' }));
      return true;
    }
  };

  // Check if we're on payment result page (handle multiple possible paths)
  const isPaymentResultPage = location.pathname === '/service-charge/payment-result' || 
                              location.pathname === '/service-charge/payment-success' ||
                              location.search.includes('serviceChargeId=');
  
  useEffect(() => {
    console.log('[Payment Redirect] useEffect triggered:', {
      isPaymentResultPage,
      pathname: location.pathname,
      search: location.search,
      exhibitionId
    });
    
    if (isPaymentResultPage) {
      // Handle payment redirect (but not if we're already in success step or payment is verified)
      if (currentStep !== 2 && !paymentVerified) {
        console.log('[Payment Redirect] Handling payment redirect');
        handlePaymentRedirect();
      } else {
        console.log('[Payment Redirect] Already in success step or payment verified, skipping redirect handling', {
          currentStep,
          paymentVerified
        });
      }
    } else if (exhibitionId) {
      console.log('[Payment Redirect] Fetching exhibition config for:', exhibitionId);
      fetchExhibitionConfig();
    } else {
      console.log('[Payment Redirect] No action taken - missing exhibitionId or not payment result page');
    }
  }, [exhibitionId, isPaymentResultPage, currentStep, paymentVerified]);

  // Cleanup effect to reset verification states when component unmounts
  useEffect(() => {
    return () => {
      setVerificationInProgress(false);
      setPaymentVerified(false);
    };
  }, []);

  const restoreFormDataFromServiceCharge = async () => {
    try {
      console.log('[Payment Redirect] Restoring form data from service charge');
      
      const urlParams = new URLSearchParams(location.search);
      const serviceChargeId = urlParams.get('serviceChargeId');
      
      if (!serviceChargeId) {
        console.error('[Payment Redirect] No service charge ID found for form restoration');
        return;
      }
      
      // Fetch the service charge details
      const statusResponse = await publicServiceChargeService.getServiceChargeStatus(serviceChargeId);
      
      if (statusResponse.data.success) {
        const serviceCharge = statusResponse.data.data;
        
        console.log('[Payment Redirect] Service charge data retrieved for form restoration:', serviceCharge);
        
        // Restore form data from service charge record
        const restoredFormData = {
          vendorName: serviceCharge.vendorName || '',
          companyName: serviceCharge.companyName || '',
          exhibitorCompanyName: serviceCharge.exhibitorCompanyName || '',
          vendorPhone: serviceCharge.vendorPhone || '',
          stallNumber: serviceCharge.stallNumber || '',
          serviceType: serviceCharge.serviceType || '',
        };
        
        console.log('[Payment Redirect] Restoring form data:', restoredFormData);
        
        // Set the form data
        setFormData(restoredFormData);
        
        // Restore exhibition config if not already loaded
        if (!exhibition && serviceCharge.exhibitionId) {
          const exhibitionId = typeof serviceCharge.exhibitionId === 'string' 
            ? serviceCharge.exhibitionId 
            : serviceCharge.exhibitionId._id || serviceCharge.exhibitionId.id;
          
          console.log('[Payment Redirect] Loading exhibition config for restored form:', exhibitionId);
          
          try {
            const exhibitionResponse = await publicServiceChargeService.getServiceChargeConfig(exhibitionId);
            if (exhibitionResponse.data.success) {
              setExhibition(exhibitionResponse.data.data);
              console.log('[Payment Redirect] Exhibition config loaded for restored form');
            }
          } catch (exhibitionError) {
            console.error('[Payment Redirect] Failed to load exhibition config for restored form:', exhibitionError);
          }
        }
        
        // Update the form fields with restored data
        form.setFieldsValue(restoredFormData);
        
        console.log('[Payment Redirect] Form data restoration completed');
      } else {
        console.error('[Payment Redirect] Failed to fetch service charge for form restoration');
      }
    } catch (error) {
      console.error('[Payment Redirect] Error restoring form data:', error);
    }
  };

  const handlePaymentRedirect = async () => {
    // Prevent multiple verification attempts
    if (verificationInProgress || paymentVerified) {
      console.log('[Payment Redirect] Verification already in progress or completed, skipping', {
        verificationInProgress,
        paymentVerified
      });
      return;
    }

    try {
      setVerificationInProgress(true);
      
      const urlParams = new URLSearchParams(location.search);
      const serviceChargeId = urlParams.get('serviceChargeId');
      const gateway = urlParams.get('gateway');
      
      console.log('[Payment Redirect] Starting payment verification:', {
        serviceChargeId,
        gateway,
        currentPath: location.pathname,
        allUrlParams: Object.fromEntries(urlParams.entries())
      });
      
      if (!serviceChargeId) {
        console.error('[Payment Redirect] Missing service charge ID');
        message.error('Payment verification failed: Missing service charge ID');
        
        // Try to extract from URL in case it's in a different format
        const urlPath = location.pathname;
        const urlSearchParams = new URLSearchParams(location.search);
        console.log('[Payment Redirect] URL details:', {
          pathname: urlPath,
          searchParams: Object.fromEntries(urlSearchParams.entries()),
          fullUrl: window.location.href
        });
        
        navigate('/');
        return;
      }

      setLoading(true);
      
      // Get service charge details using the service method
      const statusResponse = await publicServiceChargeService.getServiceChargeStatus(serviceChargeId);
      
      if (!statusResponse.data.success) {
        console.error('[Payment Redirect] Status fetch failed:', statusResponse.data);
        throw new Error(statusResponse.data.message || 'Failed to get service charge details');
      }

      const serviceCharge = statusResponse.data.data;
      
      // Ensure we have exhibition config loaded
      if (!exhibition && serviceCharge.exhibitionId) {
        try {
          // Handle both string ID and populated object
          const exhibitionId = typeof serviceCharge.exhibitionId === 'string' 
            ? serviceCharge.exhibitionId 
            : serviceCharge.exhibitionId._id || serviceCharge.exhibitionId.id;
          
          console.log('[Payment Redirect] Loading exhibition config for ID:', exhibitionId);
          
          const exhibitionResponse = await publicServiceChargeService.getServiceChargeConfig(exhibitionId);
          if (exhibitionResponse.data.success) {
            setExhibition(exhibitionResponse.data.data);
            console.log('[Payment Redirect] Exhibition config loaded successfully');
          }
        } catch (configError) {
          console.warn('[Payment Redirect] Failed to load exhibition config:', configError);
        }
      }
      
      // Check if payment is already verified
      if (serviceCharge.paymentStatus === 'paid') {
        console.log('[Payment Redirect] Payment already verified, showing success');
        // Ensure we have all the required data for the success step
        const paymentData = {
          serviceChargeId: serviceCharge._id || serviceCharge.id,
          receiptNumber: serviceCharge.receiptNumber,
          paymentId: serviceCharge.phonePeTransactionId || serviceCharge.paymentId,
          amount: serviceCharge.amount,
          paidAt: serviceCharge.paidAt,
          receiptGenerated: serviceCharge.receiptGenerated,
          receiptDownloadUrl: serviceCharge.receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id || serviceCharge.id}` : null
        };
        
        setPaymentResult(paymentData);
        setCurrentStep(2);
        setPaymentVerified(true); // Mark payment as verified to prevent re-verification
        setLoading(false); // Stop loading immediately when payment is verified
        // Success message removed - the success step UI itself is the confirmation
        return;
      }

      // Handle PhonePe payment verification
      if (gateway === 'phonepe') {
        console.log('[Payment Redirect] Processing PhonePe payment verification');
        
        let merchantTransactionId = serviceCharge.phonePeMerchantTransactionId || serviceCharge.receiptNumber;
        
        if (!merchantTransactionId) {
          console.error('[Payment Redirect] Missing PhonePe merchant transaction ID');
          message.error('Payment verification failed: Missing PhonePe transaction details');
          setCurrentStep(1);
          return;
        }
        
        console.log('[Payment Redirect] Verifying PhonePe payment for merchant ID:', merchantTransactionId);
        // Only show loading message if no other loading message is active
        message.destroy(); // Clear any existing messages first
        message.loading('Verifying payment with PhonePe...', 0);
        
        // Add retry mechanism for payment verification
        const verifyPaymentWithRetry = async (retryCount = 0): Promise<void> => {
          const maxRetries = 3;
          const retryDelay = 2000; // 2 seconds
          
          try {
            console.log(`[Payment Verification] Attempt ${retryCount + 1}/${maxRetries + 1} for merchant ID:`, merchantTransactionId);
            
            const verifyResponse = await publicServiceChargeService.verifyPhonePePayment({
              merchantTransactionId: merchantTransactionId
            });

            console.log('[Payment Verification] Full response:', verifyResponse);
            console.log('[Payment Verification] Response data:', verifyResponse.data);
            console.log('[Payment Verification] Response success:', verifyResponse.data?.success);
            
            // Check if verification was successful
            if (verifyResponse.data && verifyResponse.data.success) {
              console.log('[Payment Verification] PhonePe payment verified successfully');
              console.log('[Payment Verification] Payment result data:', verifyResponse.data.data);
              
              message.destroy();
              setPaymentResult(verifyResponse.data.data);
              setCurrentStep(2);
              setPaymentVerified(true); // Mark payment as verified to prevent re-verification
              setLoading(false); // Stop loading immediately when payment is verified
              // Success message removed to prevent duplication - payment already verified above
              return;
            } 
            
            // Check if payment is still pending (might need retry)
            const state = verifyResponse.data?.data?.state;
            const isPending = state === 'PENDING' || state === 'PROCESSING';
            
            if (isPending && retryCount < maxRetries) {
              console.log(`[Payment Verification] Payment still pending (${state}), retrying in ${retryDelay}ms...`);
              message.destroy();
              message.loading(`Payment is being processed... (Attempt ${retryCount + 2}/${maxRetries + 1})`, 0);
              
              setTimeout(() => {
                verifyPaymentWithRetry(retryCount + 1);
              }, retryDelay);
              return;
            }
            
            // Payment failed or max retries reached
            console.error('[Payment Verification] PhonePe payment verification failed:', {
              response: verifyResponse.data,
              state,
              retryCount,
              maxRetries
            });
            
            message.destroy();
            const errorMessage = verifyResponse.data?.message || 
              (retryCount >= maxRetries ? 'Payment verification timeout. Please check your payment status.' : 'Payment verification failed');
            message.error(errorMessage);
            
            // Restore form data from service charge record before going back to payment step
            await restoreFormDataFromServiceCharge();
            
            // Small delay to ensure form and exhibition data are loaded
            setTimeout(() => {
              setCurrentStep(1);
            }, 500);
            
          } catch (verifyError: any) {
            console.error(`[Payment Verification] Error on attempt ${retryCount + 1}:`, verifyError);
            
            // If it's a network error and we haven't exhausted retries
            if (retryCount < maxRetries && (verifyError.code === 'NETWORK_ERROR' || verifyError.message?.includes('fetch'))) {
              console.log(`[Payment Verification] Network error, retrying in ${retryDelay}ms...`);
              message.destroy();
              message.loading(`Connection error, retrying... (Attempt ${retryCount + 2}/${maxRetries + 1})`, 0);
              
              setTimeout(() => {
                verifyPaymentWithRetry(retryCount + 1);
              }, retryDelay);
              return;
            }
            
            // Final error - no more retries
            message.destroy();
            console.error('[Payment Verification] Final verification error:', verifyError);
            message.error('Payment verification failed. Please use the "Check Payment Status" button if you completed the payment.');
            
            // Restore form data from service charge record before going back to payment step
            await restoreFormDataFromServiceCharge();
            
            // Small delay to ensure form and exhibition data are loaded
            setTimeout(() => {
              setCurrentStep(1);
            }, 500);
          }
        };
        
        // Start verification with retry (add small delay to ensure callback is processed)
        setTimeout(() => {
          verifyPaymentWithRetry();
        }, 1000); // 1 second delay
      }
    } catch (error: any) {
      console.error('[Payment Redirect] Error:', error);
      
      // Check if it's a 404 error (service charge not found)
      if (error.response?.status === 404 || error.message?.includes('404')) {
        message.error('Payment record not found. Please contact support if you completed the payment.');
        navigate('/');
      } else if (error.response?.status === 400) {
        message.error('Invalid payment details. Please try again.');
        navigate('/');
      } else {
        message.error('Payment verification failed. Please try again or contact support.');
        // Try to restore form data before navigating away
        try {
          await restoreFormDataFromServiceCharge();
          // If restoration is successful, stay on the page and go to payment step
          setTimeout(() => {
            setCurrentStep(1);
          }, 500);
        } catch (restoreError) {
          console.error('[Payment Redirect] Failed to restore form data, navigating to home:', restoreError);
          navigate('/');
        }
      }
    } finally {
      setLoading(false);
      setVerificationInProgress(false);
    }
  };

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

  useEffect(() => {
    if (exhibitionId) {
      fetchExhibitionConfig();
      fetchStalls(); // Fetch stalls when component mounts
    }
  }, [exhibitionId]);

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
      // Auto-fill exhibitor company name
      form.setFieldsValue({
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

  // Calculate service charge amount based on stall area or service type
  const calculateServiceCharge = () => {
    if (!exhibition?.config) return 0;

    // New stall-based pricing system - use default pricing rules if stalls are available
    if (stalls.length > 0 && (selectedStall || formData.stallArea)) {
      const stallArea = selectedStall?.stallArea || formData.stallArea || 0;
      // Use default pricing rules: ≤50 sqm = ₹2000, >50 sqm = ₹2500
      const smallStallThreshold = 50;
      const smallStallPrice = 2000;
      const largeStallPrice = 2500;
      
      return stallArea <= smallStallThreshold ? smallStallPrice : largeStallPrice;
    }

    // Legacy service type system
    if (exhibition.config.serviceTypes && formData.serviceType) {
      const selectedService = exhibition.config.serviceTypes.find(
        service => service.type === formData.serviceType
      );
      return selectedService ? selectedService.amount : 0;
    }

    return 0;
  };

  const handleNext = () => {
    form.validateFields().then(() => {
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
    });
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePayment = async () => {
    try {
      setSubmitting(true);
      
      const serviceChargeAmount = calculateServiceCharge();
      
      if (!serviceChargeAmount) {
        message.error('Unable to calculate service charge. Please try again.');
        return;
      }

      // Prepare payment data for both new and legacy systems
      const paymentData = {
        exhibitionId: exhibition?._id || '',
        vendorName: formData.vendorName,
        vendorPhone: formData.vendorPhone,
        companyName: formData.companyName,
        exhibitorCompanyName: formData.exhibitorCompanyName || '',
        stallNumber: formData.stallNumber,
        stallArea: selectedStall?.stallArea || formData.stallArea || 0,
        serviceType: formData.serviceType || 'Stall Service Charge',
        amount: serviceChargeAmount.toString(),
        uploadedImage: formData.uploadedImage || ''
      };

      console.log('[Payment] Payment data structure:', {
        ...paymentData,
        isStallBased: !!(selectedStall || formData.stallArea),
        calculatedAmount: serviceChargeAmount
      });

      console.log('[Payment] Creating PhonePe payment order with data:', paymentData);
      
      const orderResponse = await publicServiceChargeService.createPaymentOrder(paymentData);
      
      if (orderResponse.data.success) {
        const orderData = orderResponse.data;
        console.log('[Payment] PhonePe order created:', orderData);
        
        // PhonePe redirects to payment page
        if (orderData.data.redirectUrl) {
          console.log('[Payment] Redirecting to PhonePe payment page:', orderData.data.redirectUrl);
          window.location.href = orderData.data.redirectUrl;
        } else {
          throw new Error('PhonePe redirect URL not received');
        }
      } else {
        throw new Error(orderResponse.data.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('[Payment] Error creating payment order:', error);
      message.error('Failed to initiate payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getSelectedServiceAmount = () => {
    return calculateServiceCharge();
  };

  const formatDimensions = (dimensions?: { width: number; height: number }) => {
    if (!dimensions) return 'Not specified';
    return `${dimensions.width}m × ${dimensions.height}m`;
  };

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
            receiptDownloadUrl: serviceCharge.receiptPath ? `/api/public/service-charge/receipt/${serviceCharge._id}` : null,
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

  const renderVendorDetailsStep = () => (
    <Card className="step-card">
      <div className="step-header">
        <ShoppingCartOutlined className="step-icon" />
        <Title level={3}>Service Details</Title>
        <Paragraph type="secondary">
          Please provide your vendor details and select your stall.
        </Paragraph>
      </div>

      <Form form={form} layout="vertical" initialValues={formData}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="vendorName"
              label="Vendor Name"
              rules={[{ required: true, message: 'Please enter vendor name' }]}
            >
              <Input placeholder="Enter vendor name" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="companyName"
              label="Vendor Company Name"
              rules={[{ required: true, message: 'Please enter vendor company name' }]}
            >
              <Input placeholder="Enter vendor company name" size="large" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="vendorPhone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please enter phone number' },
                { pattern: /^[0-9+\-\s()]{10,}$/, message: 'Please enter a valid phone number' }
              ]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Enter phone number" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="stallNumber"
              label="Stall Number"
              rules={[{ required: true, message: 'Please enter stall number' }]}
            >
              {stalls.length > 0 ? (
                <Select 
                  placeholder="Choose your stall number"
                  showSearch
                  allowClear
                  size="large"
                  onChange={handleStallSelection}
                  filterOption={(input, option) =>
                    (option?.children && option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0) || false
                  }
                >
                  {stalls.map(stall => (
                    <Option key={stall.stallNumber} value={stall.stallNumber}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span><strong>{stall.stallNumber}</strong></span>
                        <Tag color="blue" style={{ marginLeft: '8px' }}>{stall.stallArea} sqm</Tag>
                      </div>
                    </Option>
                  ))}
                </Select>
              ) : (
                <Input 
                  placeholder="Enter stall number" 
                  size="large"
                  onChange={(e) => handleStallSelection(e.target.value)}
                />
              )}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              name="exhibitorCompanyName"
              label={
                <span>
                  Exhibitor Company Name
                  {selectedStall && (
                    <Tag color="green" style={{ marginLeft: '8px', fontSize: '10px' }}>
                      Auto-filled
                    </Tag>
                  )}
                </span>
              }
              tooltip={stalls.length > 0 ? "This field is auto-filled when you select a stall" : "The company name of the exhibitor"}
            >
              <Input 
                placeholder="Enter exhibitor company name" 
                size="large"
                readOnly={selectedStall !== null}
                style={{ 
                  backgroundColor: selectedStall ? '#f6ffed' : 'white',
                  borderColor: selectedStall ? '#b7eb8f' : '#d9d9d9',
                  cursor: selectedStall ? 'not-allowed' : 'text'
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Form.Item
              label="Upload Image"
              tooltip="Upload an image related to the service (optional)"
            >
              <Upload {...uploadProps}>
                {fileList.length < 1 && (
                  <div style={{ width: '100%', textAlign: 'center', padding: '20px' }}>
                    <UploadOutlined style={{ fontSize: '24px', color: '#999', marginBottom: '8px' }} />
                    <div style={{ color: '#666' }}>Click to upload image</div>
                  </div>
                )}
              </Upload>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                Supported formats: JPG, PNG, GIF, SVG, HEIC (Max size: 10MB)
              </Text>
            </Form.Item>
          </Col>
        </Row>

        {/* Show stall details if selected */}
        {selectedStall && (
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24}>
              <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px', fontSize: '16px' }} />
                  <Title level={5} style={{ margin: 0, color: '#389e0d' }}>Stall Details</Title>
                </div>
                <Row gutter={[16, 8]}>
                  <Col xs={24} sm={12} md={6}>
                    <Text strong>Stall Number:</Text>
                    <br />
                    <Text>{selectedStall.stallNumber}</Text>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Text strong>Area:</Text>
                    <br />
                    <Text>{selectedStall.stallArea} sqm</Text>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Text strong>Dimensions:</Text>
                    <br />
                    <Text>{formatDimensions(selectedStall.dimensions)}</Text>
                  </Col>
                  <Col xs={24} sm={12} md={6}>
                    <Text strong>Service Charge:</Text>
                    <br />
                    <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
                      ₹{calculateServiceCharge().toLocaleString()}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '10px', color: '#666' }}>
                      (Inclusive of GST)
                    </Text>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}

        {/* Show pricing info if no stall selected but stalls are available */}
        {!selectedStall && stalls.length > 0 && (
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24}>
              <Alert
                message="Service Charge Information"
                description={
                  <div>
                                         <p>• Stalls with area ≤ 50 sqm: <strong>₹2,000</strong></p>
                     <p style={{ margin: 0 }}>• Stalls with area &gt; 50 sqm: <strong>₹2,500</strong></p>
                     <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}><em>(All prices inclusive of GST)</em></p>
                  </div>
                }
                type="info"
                showIcon
              />
            </Col>
          </Row>
        )}

        {/* Legacy service type selection - show only if no stalls available */}
        {stalls.length === 0 && exhibition?.config.serviceTypes && (
          <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
            <Col xs={24}>
              <Form.Item
                name="serviceType"
                label="Service Type"
                rules={[{ required: true, message: 'Please select service type' }]}
              >
                <Select placeholder="Select service type" size="large">
                  {exhibition.config.serviceTypes?.map(service => (
                    <Option key={service.type} value={service.type}>
                      {service.type} - ₹{service.amount.toLocaleString()} (Incl. GST)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>

      <div className="step-actions" style={{ textAlign: 'center', marginTop: '32px' }}>
        <Button 
          type="primary" 
          onClick={handleNext} 
          size="large"
          style={{ minWidth: '120px' }}
        >
          Next
        </Button>
      </div>
    </Card>
  );

  const renderPaymentStep = () => {
    // Show loading if exhibition data is not loaded yet
    if (!exhibition) {
      return (
        <Card className="step-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '16px' }}>Loading exhibition details...</div>
          </div>
        </Card>
      );
    }

    // Calculate service charge amount
    const serviceChargeAmount = getSelectedServiceAmount();

    // Show error if unable to calculate service charge
    if (!serviceChargeAmount) {
      return (
        <Card className="step-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Alert
              message="Unable to Calculate Service Charge"
              description="Please go back and ensure all required information is provided."
              type="warning"
              showIcon
              action={
                <Button onClick={handlePrevious} type="primary">
                  Go Back
                </Button>
              }
            />
          </div>
        </Card>
      );
    }

    const isDevelopmentMode = exhibition.config.phonePeConfig?.clientId === 'phonepe_test_development_mode';

    console.log('[Payment Step] Rendering payment step:', {
      exhibition: !!exhibition,
      formData: formData,
      serviceChargeAmount: serviceChargeAmount,
      isDevelopmentMode: isDevelopmentMode
    });

    return (
      <Card className="step-card payment-step-card">
        <div className="step-header">
          <CreditCardOutlined className="step-icon" />
          <Title level={3}>Payment Details</Title>
          <Paragraph type="secondary">
            Review your details and proceed with payment.
          </Paragraph>
        </div>

        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Vendor Name">{formData.vendorName}</Descriptions.Item>
          <Descriptions.Item label="Company Name">{formData.companyName}</Descriptions.Item>
          {formData.exhibitorCompanyName && (
            <Descriptions.Item label="Exhibitor Company">{formData.exhibitorCompanyName}</Descriptions.Item>
          )}
          <Descriptions.Item label="Stall Number">{formData.stallNumber}</Descriptions.Item>
          {selectedStall && (
            <>
              <Descriptions.Item label="Stall Area">{selectedStall.stallArea} sqm</Descriptions.Item>
              <Descriptions.Item label="Stall Dimensions">{formatDimensions(selectedStall.dimensions)}</Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="Phone">{formData.vendorPhone}</Descriptions.Item>
          {formData.uploadedImage && (
            <Descriptions.Item label="Uploaded Image">
              <div style={{ marginTop: '8px' }}>
                <img
                  src={formData.uploadedImage.startsWith('http') ? formData.uploadedImage : `${api.defaults.baseURL}/public/uploads/${formData.uploadedImage}`}
                  alt="Service charge attachment"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '150px',
                    objectFit: 'contain',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                  onClick={() => {
                    window.open(`${api.defaults.baseURL}/public/uploads/${formData.uploadedImage}`, '_blank');
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div style="
                          color: #ff4d4f; 
                          padding: 16px; 
                          border: 1px dashed #ff4d4f; 
                          border-radius: 6px; 
                          text-align: center;
                          background-color: #fff2f0;
                          font-size: 12px;
                        ">
                          ❌ Image preview unavailable
                        </div>
                      `;
                    }
                  }}
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.border = '1px solid #52c41a';
                  }}
                />
                <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                  📱 Click to view full size
                  {formData.uploadedImage.toLowerCase().includes('heic') && (
                    <span style={{ color: '#1890ff', marginLeft: '4px' }}>
                      (Originally HEIC, converted to JPEG)
                    </span>
                  )}
                </Text>
              </div>
            </Descriptions.Item>
          )}
          {/* Show service type only for legacy systems */}
          {formData.serviceType && stalls.length === 0 && (
            <Descriptions.Item label="Service Type">{formData.serviceType}</Descriptions.Item>
          )}
          <Descriptions.Item label="Service Charge">
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
              ₹{serviceChargeAmount.toLocaleString()}
            </Text>
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '11px', color: '#666' }}>
                (Inclusive of GST)
              </Text>
            </div>
            {selectedStall && (
              <div style={{ marginTop: '4px' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {selectedStall.stallArea <= 50 ? 'Small stall pricing (≤50 sqm)' : 'Large stall pricing (>50 sqm)'}
                </Text>
              </div>
            )}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          {isDevelopmentMode ? (
            <Alert
              message="Development Mode"
              description="This is running in development mode. PhonePe payment will be simulated - no actual payment will be processed."
              type="warning"
              icon={<InfoCircleOutlined />}
              style={{ marginBottom: 16 }}
              showIcon
            />
          ) : (
            <Alert
              message="Secure Payment"
              description="Your payment is processed securely through PhonePe. You will receive a receipt via email after successful payment."
              type="info"
              icon={<LockOutlined />}
              style={{ marginBottom: 16 }}
            />
          )}
        </div>

        <div className="step-actions">
          <Space>
            <Button onClick={handlePrevious} size="large">
              Previous
            </Button>
            <Button
              type="primary"
              size="large"
              loading={submitting}
              onClick={handlePayment}
              icon={<BankOutlined />}
            >
              {isDevelopmentMode
                ? `Simulate PhonePe Payment ₹${serviceChargeAmount.toLocaleString()} (Incl. GST)`
                : `Pay via PhonePe ₹${serviceChargeAmount.toLocaleString()} (Incl. GST)`}
            </Button>
          </Space>
        </div>
        
        <div className="payment-help" style={{ marginTop: '16px', textAlign: 'center' }}>
          <Alert
            message="Already completed payment?"
            description={
              <div>
                If you've completed the payment but it's not reflecting, click the button below to check your payment status.
                <br />
                <Button 
                  type="link" 
                  size="small" 
                  onClick={handleManualPaymentCheck}
                  loading={submitting}
                  style={{ marginTop: '8px' }}
                >
                  Check Payment Status
                </Button>
              </div>
            }
            type="info"
            showIcon
          />
        </div>
      </Card>
    );
  };

  const renderSuccessStep = () => (
    <Card className="step-card success-card">
      <Result
        status="success"
        title="Payment Successful!"
        subTitle={`Your service charge payment of ₹${paymentResult?.amount?.toLocaleString()} (inclusive of GST) has been processed successfully.`}
        extra={[
          <div key="details" style={{ textAlign: 'left', margin: '20px 0' }}>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Receipt Number">
                <Tag color="blue">{paymentResult?.receiptNumber}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment ID">
                {paymentResult?.paymentId || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Amount">
                ₹{paymentResult?.amount?.toLocaleString()} <Text type="secondary" style={{ fontSize: '11px' }}>(Incl. GST)</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Date">
                {paymentResult?.paidAt ? new Date(paymentResult.paidAt).toLocaleString() : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color="green">Paid</Tag>
              </Descriptions.Item>
              {paymentResult?.state && (
                <Descriptions.Item label="PhonePe Status">
                  <Tag color="green">{paymentResult.state}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>,
          <div key="actions">
            <Space>
              {paymentResult?.receiptDownloadUrl && (
                <Button
                  type="primary"
                  href={paymentResult.receiptDownloadUrl}
                  target="_blank"
                  download
                >
                  Download Receipt
                </Button>
              )}
              <Button onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </Space>
          </div>,
          <div key="help" style={{ marginTop: '16px' }}>
            <Alert
              message="Need Help?"
              description="If you don't see your receipt or have any issues, please save your Receipt Number and contact support."
              type="info"
              showIcon
              style={{ textAlign: 'left' }}
            />
          </div>
        ]}
      />
    </Card>
  );

  const steps = [
    {
      title: 'Service Details',
      content: renderVendorDetailsStep(),
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Payment',
      content: renderPaymentStep(),
      icon: <CreditCardOutlined />
    },
    {
      title: 'Success',
      content: renderSuccessStep(),
      icon: <CheckCircleOutlined />
    }
  ];

  if (loading) {
    console.log('[Payment Redirect] Component loading state:', {
      isPaymentResultPage,
      pathname: location.pathname,
      search: location.search,
      exhibitionId
    });
    
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh' 
          }}>
            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  // Handle payment result page even if exhibition is not loaded yet
  if (isPaymentResultPage && !exhibition && currentStep !== 2) {
    console.log('[Payment Redirect] Payment result page loading - exhibition config not loaded yet');
    
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh' 
          }}>
            <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  if (!exhibition && currentStep !== 2) {
    console.log('[Payment Redirect] Exhibition not found and not payment result page');
    
    return (
      <Layout>
        <GlobalHeader />
        <Content style={{ paddingTop: '64px' }}>
          <div style={{ padding: '50px' }}>
            <Result
              status="404"
              title="Exhibition Not Found"
              subTitle="The exhibition you're looking for doesn't exist or service charges are not enabled."
              extra={<Button type="primary" onClick={() => navigate('/')}>Back Home</Button>}
            />
          </div>
        </Content>
        <GlobalFooter />
      </Layout>
    );
  }

  return (
    <Layout>
      <GlobalHeader />
      <Content style={{ paddingTop: '64px', background: '#f5f5f5' }}>
        <div className="public-service-charge-form">
          <div className="form-container">
            {exhibition && (
              <Card className="header-card">
                <div style={{ textAlign: 'center' }}>
                  <Title level={2}>{exhibition.config.title}</Title>
                  <Paragraph>{exhibition.config.description}</Paragraph>
                  <Space>
                    <InfoCircleOutlined />
                    <Text strong>{exhibition.name}</Text>
                    <Divider type="vertical" />
                    <Text>{exhibition.venue}</Text>
                  </Space>
                </div>
              </Card>
            )}

            <Card className="steps-card">
              <Steps 
                current={currentStep} 
                items={steps.map(step => ({
                  title: step.title,
                  icon: step.icon
                }))}
              />
            </Card>

            {steps[currentStep].content}
          </div>
        </div>
      </Content>
      <GlobalFooter />
    </Layout>
  );
};

export default PublicServiceChargeForm; 