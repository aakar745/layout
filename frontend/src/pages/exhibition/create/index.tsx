import React from 'react';
import { Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { createExhibition } from '../../../store/slices/exhibitionSlice';
import ExhibitionForm from '../../../components/exhibition/common/ExhibitionForm';
import type { Dayjs } from 'dayjs';
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

const ExhibitionCreate: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (values: ExhibitionFormData) => {
    try {
      const [startDate, endDate] = values.dateRange;
      const exhibitionData = {
        name: values.name,
        description: values.description,
        venue: values.venue,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: values.status || 'draft',
        isActive: values.isActive ?? true,
        invoicePrefix: values.invoicePrefix,
        stallRates: values.stallRates || [],
        dimensions: {
          width: 100,
          height: 100
        },
        // Tax and Discount Configuration
        taxConfig: values.taxConfig || [],
        discountConfig: values.discountConfig || [],
        publicDiscountConfig: values.publicDiscountConfig || [],
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
        sponsorLogos: values.sponsorLogos || [],
        // Footer settings
        footerText: values.footerText,
        footerLogo: values.footerLogo,
        contactEmail: values.contactEmail,
        contactPhone: values.contactPhone,
        footerLinks: values.footerLinks || [],
        // Amenities settings
        amenities: values.amenities?.map(amenity => ({
          type: amenity.type,
          name: amenity.name,
          description: amenity.description,
          rate: amenity.rate
        })) || [],
        basicAmenities: values.basicAmenities?.map(amenity => ({
          type: amenity.type,
          name: amenity.name,
          description: amenity.description,
          perSqm: amenity.perSqm,
          quantity: amenity.quantity
        })) || [],
        specialRequirements: values.specialRequirements,
        // Letter Settings
        letterSettings: values.letterSettings
      };

      const result = await dispatch(createExhibition(exhibitionData)).unwrap();
      message.success('Exhibition created successfully');
      
      const exhibitionId = result._id || result.id;
      if (exhibitionId) {
        navigate(getExhibitionUrl({ _id: exhibitionId, id: exhibitionId, name: exhibitionData.name }), { 
          state: { exhibitionId } 
        });
      } else {
        message.error('Exhibition ID not found in response');
        navigate('/exhibition');
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to create exhibition');
      console.error('Error creating exhibition:', error);
    }
  };

  return (
    <Card title="Create New Exhibition">
      <ExhibitionForm onSubmit={handleSubmit} submitText="Create Exhibition" />
    </Card>
  );
};

export default ExhibitionCreate; 