'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, Building, User, Phone, Upload, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ServiceChargeExhibition, 
  ServiceChargeStall, 
  ServiceChargeFormData 
} from '@/lib/types/serviceCharge';
import ImageUpload from '../ImageUpload';
import Link from 'next/link';

const formSchema = z.object({
  vendorName: z.string().min(1, 'Vendor name is required').max(100, 'Vendor name must be less than 100 characters'),
  companyName: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  exhibitorCompanyName: z.string().optional(),
  vendorPhone: z.string()
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number must be 10 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
  stallNumber: z.string().min(1, 'Stall number is required'),
  serviceType: z.string().optional(),
  uploadedImage: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface VendorDetailsStepProps {
  exhibition: ServiceChargeExhibition;
  stalls: ServiceChargeStall[];
  selectedStall: ServiceChargeStall | null;
  formData: ServiceChargeFormData;
  onStallSelection: (stallNumber: string) => void;
  onSubmit: (data: ServiceChargeFormData) => void;
}

export default function VendorDetailsStep({
  exhibition,
  stalls,
  selectedStall,
  formData,
  onStallSelection,
  onSubmit,
}: VendorDetailsStepProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadedImage, setUploadedImage] = useState(formData.uploadedImage || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorName: formData.vendorName,
      companyName: formData.companyName,
      exhibitorCompanyName: formData.exhibitorCompanyName,
      vendorPhone: formData.vendorPhone,
      stallNumber: formData.stallNumber,
      serviceType: formData.serviceType,
      uploadedImage: uploadedImage,
    },
  });

  // Filter stalls based on search
  const filteredStalls = stalls.filter(stall =>
    stall.stallNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stall.exhibitorCompanyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate service charge amount
  const calculateAmount = (): number => {
    if (selectedStall && exhibition.config.pricingRules) {
      const { smallStallThreshold, smallStallPrice, largeStallPrice } = exhibition.config.pricingRules;
      return selectedStall.stallArea <= smallStallThreshold ? smallStallPrice : largeStallPrice;
    }

    if (form.watch('serviceType') && exhibition.config.serviceTypes) {
      const serviceType = exhibition.config.serviceTypes.find(st => st.type === form.watch('serviceType'));
      return serviceType?.amount || 0;
    }

    return 0;
  };

  // Maintain focus on search input when dropdown is open
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      const timeoutId = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isDropdownOpen, searchTerm]);

  const handleStallSelect = (stallNumber: string) => {
    onStallSelection(stallNumber);
    form.setValue('stallNumber', stallNumber);
    
    const stall = stalls.find(s => s.stallNumber === stallNumber);
    if (stall) {
      form.setValue('exhibitorCompanyName', stall.exhibitorCompanyName);
    }
    
    // Clear search term after selection
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Keep focus on input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent dropdown from closing when typing
    if (e.key !== 'Escape' && e.key !== 'Enter' && e.key !== 'Tab') {
      e.stopPropagation();
    }
  };

  const handleSubmit = (data: FormData) => {
    const submissionData: ServiceChargeFormData = {
      ...data,
      exhibitorCompanyName: data.exhibitorCompanyName || '',
      stallArea: selectedStall?.stallArea || 0,
      serviceType: data.serviceType || (selectedStall ? 'Stall Service Charge' : ''),
      uploadedImage: uploadedImage,
    };
    
    onSubmit(submissionData);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Service Details</h2>
        <p className="text-gray-600 text-sm md:text-base">
          Please provide your vendor details and select your stall to calculate service charges.
        </p>
      </div>

      {/* Exhibition Info */}
      <div className="mb-6">
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>{exhibition.config.title}</strong><br />
            {exhibition.config.description}
          </AlertDescription>
        </Alert>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Vendor Information */}
        <Card className="p-4 sm:p-5 lg:p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Vendor Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="md:col-span-2 lg:col-span-1">
              <Label htmlFor="vendorName" className="text-sm font-medium text-gray-700 mb-2 block">
                Vendor Name *
              </Label>
              <Input
                id="vendorName"
                {...form.register('vendorName')}
                placeholder="Enter vendor name"
                className="h-11 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.vendorName && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.vendorName.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 mb-2 block">
                Vendor Company Name *
              </Label>
              <Input
                id="companyName"
                {...form.register('companyName')}
                placeholder="Enter vendor company name"
                className="h-11 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.companyName && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.companyName.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-1">
              <Label htmlFor="vendorPhone" className="text-sm font-medium text-gray-700 mb-2 block">
                Mobile Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="vendorPhone"
                  {...form.register('vendorPhone')}
                  placeholder="Enter 10-digit mobile number"
                  className="pl-10 h-11 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                  maxLength={10}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '');
                  }}
                />
              </div>
              {form.formState.errors.vendorPhone && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.vendorPhone.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Image Upload */}
        <Card className="p-4 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Supporting Document (Optional)
          </h3>
          
          <ImageUpload
            value={uploadedImage}
            onChange={setUploadedImage}
          />
        </Card>

        {/* Stall Information */}
        <Card className="p-4 sm:p-5 lg:p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Stall Information
          </h3>

          {stalls.length > 0 ? (
            <div className="space-y-4">
              {/* Stall Selection with Built-in Search */}
              <div>
                <Label htmlFor="stallNumber" className="text-sm font-medium text-gray-700 mb-1 block">
                  Stall Number *
                </Label>
                <Select 
                  value={form.watch('stallNumber')} 
                  onValueChange={handleStallSelect}
                  onOpenChange={setIsDropdownOpen}
                >
                  <SelectTrigger className="h-11 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Search and select a stall..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-md w-full max-w-sm sm:max-w-md" onCloseAutoFocus={(e) => e.preventDefault()}>
                    {/* Built-in Search Input */}
                    <div className="sticky top-0 p-2 bg-white border-b z-10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          ref={searchInputRef}
                          placeholder="Search stalls..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onKeyDown={handleKeyDown}
                          className="pl-10 h-9 text-sm border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    {/* Stall Options */}
                    <div className="max-h-48 sm:max-h-64 overflow-auto" onMouseDown={(e) => e.preventDefault()}>
                      {filteredStalls.length > 0 ? (
                        filteredStalls.map((stall) => (
                          <SelectItem key={stall._id} value={stall.stallNumber} className="text-sm cursor-pointer">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-1">
                              <span className="font-medium">{stall.stallNumber}</span>
                              <span className="text-xs text-gray-500 truncate">
                                {stall.exhibitorCompanyName} ({stall.stallArea} sqm)
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-gray-500 text-center">
                          No stalls found matching "{searchTerm}"
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
                {form.formState.errors.stallNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.stallNumber.message}
                  </p>
                )}
              </div>

              {/* Exhibitor Company Name - Auto-populated from selected stall */}
              <div>
                <Label htmlFor="exhibitorCompanyName" className="text-sm font-medium text-gray-700 mb-1 block">
                  <span className="block sm:inline">Exhibitor Company Name</span>
                  {selectedStall && <Badge variant="secondary" className="ml-0 sm:ml-2 mt-1 sm:mt-0 text-xs">Auto-filled</Badge>}
                </Label>
                <Input
                  id="exhibitorCompanyName"
                  {...form.register('exhibitorCompanyName')}
                  placeholder={selectedStall ? "Auto-filled from selected stall" : "Select a stall to auto-fill"}
                  readOnly
                  className={`h-10 text-sm rounded-md ${
                    selectedStall 
                      ? 'bg-green-50 border-green-200 text-green-800' 
                      : 'bg-gray-50 border-gray-200 text-gray-500'
                  }`}
                />
              </div>

              {/* Selected Stall Details */}
              {selectedStall && (
                <Card className="p-4 bg-blue-50 border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3 text-sm">Selected Stall Details</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs md:text-sm">
                    <div>
                      <span className="text-gray-600">Stall Number</span>
                      <div className="font-medium">{selectedStall.stallNumber}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Area</span>
                      <div className="font-medium">{selectedStall.stallArea} sqm</div>
                    </div>
                    {selectedStall.dimensions && (
                      <div>
                        <span className="text-gray-600">Dimensions</span>
                        <div className="font-medium">
                          {selectedStall.dimensions.width} × {selectedStall.dimensions.height}m
                        </div>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Service Charge</span>
                      <div className="font-medium text-blue-600">
                        ₹{calculateAmount().toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Pricing Information */}
              {!selectedStall && exhibition.config.pricingRules && (
                <Card className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Service Charge Pricing</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-md border text-sm">
                      <div className="font-medium">Small Stalls</div>
                      <div className="text-xs text-gray-600 mb-2">
                        (≤{exhibition.config.pricingRules.smallStallThreshold} sqm)
                      </div>
                      <div className="text-base font-bold text-blue-600">
                        ₹{exhibition.config.pricingRules.smallStallPrice.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-md border text-sm">
                      <div className="font-medium">Large Stalls</div>
                      <div className="text-xs text-gray-600 mb-2">
                        (&gt;{exhibition.config.pricingRules.smallStallThreshold} sqm)
                      </div>
                      <div className="text-base font-bold text-blue-600">
                        ₹{exhibition.config.pricingRules.largeStallPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            // Legacy service type selection
            <div>
              <Label htmlFor="stallNumber" className="text-sm font-medium text-gray-700 mb-1 block">
                Stall Number *
              </Label>
              <Input
                id="stallNumber"
                {...form.register('stallNumber')}
                placeholder="Enter stall number"
                className="h-11 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
              />
              {form.formState.errors.stallNumber && (
                <p className="text-xs text-red-500 mt-1">
                  {form.formState.errors.stallNumber.message}
                </p>
              )}

              {exhibition.config.serviceTypes && (
                <div className="mt-4">
                  <Label htmlFor="serviceType" className="text-sm font-medium text-gray-700 mb-1 block">
                    Service Type *
                  </Label>
                  <Select 
                    value={form.watch('serviceType') || ''} 
                    onValueChange={(value) => form.setValue('serviceType', value)}
                  >
                    <SelectTrigger className="h-10 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-md">
                      {exhibition.config.serviceTypes.map((service) => (
                        <SelectItem key={service.type} value={service.type} className="text-sm">
                          {service.type} - ₹{service.amount.toLocaleString()} (Incl. GST)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200">
          <Link 
            href={`/exhibitions/${exhibition._id}/service-charge/check-payment`}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium underline underline-offset-2 text-center sm:text-left order-2 sm:order-1 py-2"
          >
            Already made a payment? Check status here →
          </Link>
          
          <Button type="submit" size="lg" className="w-full sm:w-auto min-w-40 h-12 px-6 text-sm font-medium rounded-md order-1 sm:order-2">
            Next: Review Payment
          </Button>
        </div>
      </form>
    </div>
  );
}
