import React, { useEffect, useState } from 'react';
import { Card, App } from 'antd';
import { useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import { fetchExhibition, updateExhibition } from '../../../store/slices/exhibitionSlice';
import ExhibitionForm from '../../../components/exhibition/common/ExhibitionForm';
import dayjs, { Dayjs } from 'dayjs';
import { getExhibitionUrl } from '../../../utils/url';

interface ExhibitionFormData {
  // Basic Information
  name: string;
  description: string;
  venue: string;
  dateRange: [Dayjs, Dayjs];
  status: 'draft' | 'published' | 'completed';
  isActive: boolean;
  invoicePrefix?: string;
  stallRates: Array<{ stallTypeId: string; rate: number }>;

  // Tax and Discount Configuration
  taxConfig?: Array<{
    name: string;
    rate: number;
    isActive: boolean;
  }>;
  discountConfig?: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
  }>;
  publicDiscountConfig?: Array<{
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    isActive: boolean;
  }>;

  // Company Details
  companyName?: string;
  companyContactNo?: string;
  companyEmail?: string;
  companyAddress?: string;
  companyWebsite?: string;
  companyPAN?: string;
  companyGST?: string;
  companySAC?: string;
  companyCIN?: string;
  termsAndConditions?: string;
  piInstructions?: string;

  // Bank Details
  bankName?: string;
  bankBranch?: string;
  bankIFSC?: string;
  bankAccountName?: string;
  bankAccount?: string;

  // Header settings
  headerTitle?: string;
  headerSubtitle?: string;
  headerDescription?: string;
  headerLogo?: string;
  sponsorLogos?: Array<string>;

  // Footer settings
  footerText?: string;
  footerLogo?: string;
  contactEmail?: string;
  contactPhone?: string;
  footerLinks?: Array<{
    label: string;
    url: string;
  }>;

  // Amenities settings
  amenities?: Array<{
    type: 'facility' | 'service' | 'equipment' | 'other';
    name: string;
    description: string;
    rate: number;
  }>;
  
  // Basic amenities are included with stall booking - calculated based on stall size
  basicAmenities?: Array<{
    type: 'facility' | 'service' | 'equipment' | 'other';
    name: string;
    description: string;
    perSqm: number; // How many square meters per 1 unit (e.g., 1 table per 9 sqm)
    quantity: number; // The default quantity to provide per calculation
  }>;
  
  specialRequirements?: string;

  // Letter Settings
  letterSettings?: {
    // Stand Possession Letter
    standPossessionLetter?: {
      isEnabled: boolean;
      template: string;
      subject: string;
      automaticSending?: {
        isEnabled: boolean;
        daysBeforeExhibition: number;
      };
    };
    
    // Transport Letter
    transportLetter?: {
      isEnabled: boolean;
      template: string;
      subject: string;
      automaticSending?: {
        isEnabled: boolean;
        daysBeforeExhibition: number;
      };
    };
  };
}

const ExhibitionEdit: React.FC = () => {
  const { message } = App.useApp();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const exhibitionId = location.state?.exhibitionId;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentExhibition, loading, error } = useSelector((state: RootState) => state.exhibition);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeComponent = async () => {
      if (!exhibitionId) {
        message.error('Exhibition ID not found');
        navigate('/exhibition');
        return;
      }

      try {
        await dispatch(fetchExhibition(exhibitionId)).unwrap();
      } catch (err: any) {
        message.error(err.message || 'Failed to fetch exhibition');
        navigate('/exhibition');
      } finally {
        setInitialized(true);
      }
    };

    initializeComponent();
  }, [exhibitionId, dispatch, message, navigate]);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error, message]);

  const handleSubmit = async (values: any) => {
    if (!exhibitionId || !currentExhibition) return;

    try {
      // Handle dateRange properly
      const [startDate, endDate] = values.dateRange || [null, null];
      
      // Validate amenities data before processing
      const validateAmenities = (amenities: any[], type: string) => {
        if (!amenities || !Array.isArray(amenities)) {
          return [];
        }
        
        return amenities.filter((amenity) => {
          return amenity && 
            amenity.type && 
            amenity.name && 
            amenity.description &&
            (type === 'extra' ? (typeof amenity.rate === 'number' && amenity.rate >= 0) : 
             (typeof amenity.perSqm === 'number' && amenity.perSqm > 0 && 
              typeof amenity.quantity === 'number' && amenity.quantity > 0));
        });
      };
      
      // Validate and clean amenities
      const validatedAmenities = validateAmenities(values.amenities, 'extra');
      const validatedBasicAmenities = validateAmenities(values.basicAmenities, 'basic');

      const exhibitionData = {
        // Basic Information
        name: values.name,
        description: values.description,
        venue: values.venue,
        startDate: startDate ? startDate.toISOString() : currentExhibition.startDate,
        endDate: endDate ? endDate.toISOString() : currentExhibition.endDate,
        status: values.status,
        isActive: values.isActive,
        invoicePrefix: values.invoicePrefix,
        dimensions: currentExhibition.dimensions,
        stallRates: values.stallRates?.map((rate: any) => ({
          stallTypeId: rate.stallTypeId,
          rate: rate.rate
        })) || [],
        
        // Tax and Discount Configuration
        taxConfig: values.taxConfig?.map((tax: any) => ({
          name: tax.name,
          rate: tax.rate,
          isActive: tax.isActive
        })) || [],
        discountConfig: values.discountConfig?.map((discount: any) => ({
          name: discount.name,
          type: discount.type,
          value: discount.value,
          isActive: discount.isActive
        })) || [],
        publicDiscountConfig: values.publicDiscountConfig?.map((discount: any) => ({
          name: discount.name,
          type: discount.type,
          value: discount.value,
          isActive: discount.isActive
        })) || [],
        
        // Company Details
        companyName: values.companyName,
        companyContactNo: values.companyContactNo,
        companyEmail: values.companyEmail,
        companyAddress: values.companyAddress,
        companyWebsite: values.companyWebsite,
        companyPAN: values.companyPAN,
        companyGST: values.companyGST,
        companySAC: values.companySAC,
        companyCIN: values.companyCIN,
        termsAndConditions: values.termsAndConditions,
        piInstructions: values.piInstructions,
        
        // Bank Details
        bankName: values.bankName,
        bankBranch: values.bankBranch,
        bankIFSC: values.bankIFSC,
        bankAccountName: values.bankAccountName,
        bankAccount: values.bankAccount,
        
        // Header settings
        headerTitle: values.headerTitle,
        headerSubtitle: values.headerSubtitle,
        headerDescription: values.headerDescription,
        headerLogo: values.headerLogo,
        sponsorLogos: values.sponsorLogos,
        
        // Footer settings
        footerText: values.footerText,
        footerLogo: values.footerLogo,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        footerLinks: values.footerLinks || [],

        // Amenities settings - Use validated data
        amenities: validatedAmenities.map(amenity => ({
          type: amenity.type,
          name: amenity.name.trim(),
          description: amenity.description.trim(),
          rate: Number(amenity.rate)
        })),
        basicAmenities: validatedBasicAmenities.map(amenity => ({
          type: amenity.type,
          name: amenity.name.trim(),
          description: amenity.description.trim(),
          perSqm: Number(amenity.perSqm),
          quantity: Number(amenity.quantity)
        })),
        specialRequirements: values.specialRequirements,
        // Letter Settings
        letterSettings: values.letterSettings
      };

      await dispatch(updateExhibition({ id: exhibitionId, data: exhibitionData })).unwrap();
      message.success('Exhibition updated successfully');
      navigate(getExhibitionUrl(currentExhibition), { state: { exhibitionId } });
    } catch (error: any) {
      console.error('Exhibition update error:', error);
      message.error(error.message || 'Failed to update exhibition');
    }
  };

  if (!initialized) {
    return <Card loading />;
  }

  if (!exhibitionId) {
    return <Navigate to="/exhibition" replace />;
  }

  if (loading || !currentExhibition) {
    return <Card loading />;
  }

  const initialValues = {
    name: currentExhibition.name,
    description: currentExhibition.description,
    venue: currentExhibition.venue,
    dateRange: [
      dayjs(currentExhibition.startDate),
      dayjs(currentExhibition.endDate)
    ],
    status: currentExhibition.status,
    isActive: currentExhibition.isActive,
    invoicePrefix: currentExhibition.invoicePrefix,
    stallRates: currentExhibition.stallRates || [],

    // Tax and Discount Configuration
    taxConfig: currentExhibition.taxConfig || [],
    discountConfig: currentExhibition.discountConfig || [],
    publicDiscountConfig: currentExhibition.publicDiscountConfig || [],

    // Company Details
    companyName: currentExhibition.companyName,
    companyContactNo: currentExhibition.companyContactNo,
    companyEmail: currentExhibition.companyEmail,
    companyAddress: currentExhibition.companyAddress,
    companyWebsite: currentExhibition.companyWebsite,
    companyPAN: currentExhibition.companyPAN,
    companyGST: currentExhibition.companyGST,
    companySAC: currentExhibition.companySAC,
    companyCIN: currentExhibition.companyCIN,
    termsAndConditions: currentExhibition.termsAndConditions,
    piInstructions: currentExhibition.piInstructions,

    // Bank Details
    bankName: currentExhibition.bankName,
    bankBranch: currentExhibition.bankBranch,
    bankIFSC: currentExhibition.bankIFSC,
    bankAccountName: currentExhibition.bankAccountName,
    bankAccount: currentExhibition.bankAccount,

    // Header settings
    headerTitle: currentExhibition.headerTitle,
    headerSubtitle: currentExhibition.headerSubtitle,
    headerDescription: currentExhibition.headerDescription,
    headerLogo: currentExhibition.headerLogo,
    sponsorLogos: currentExhibition.sponsorLogos || [],

    // Footer settings
    footerText: currentExhibition.footerText,
    footerLogo: currentExhibition.footerLogo,
    contactEmail: currentExhibition.contactEmail,
    contactPhone: currentExhibition.contactPhone,
    footerLinks: currentExhibition.footerLinks || [],

    // Amenities settings
    amenities: currentExhibition.amenities || [],
    basicAmenities: currentExhibition.basicAmenities || [],
    specialRequirements: currentExhibition.specialRequirements,
    // Letter Settings
    letterSettings: currentExhibition.letterSettings
  };

  return (
    <Card 
      title="Edit Exhibition"
      extra={
        <a onClick={() => navigate(getExhibitionUrl(currentExhibition), { state: { exhibitionId } })}>Back to Details</a>
      }
    >
      <ExhibitionForm 
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitText="Update Exhibition"
      />
    </Card>
  );
};

export default ExhibitionEdit;