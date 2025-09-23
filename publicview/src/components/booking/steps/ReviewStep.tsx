'use client';

import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { ArrowRight, Trash2, AlertCircle, Info, User, Building, Mail, Phone } from 'lucide-react';

interface ReviewStepProps {
  exhibition: ExhibitionWithStats;
}

// Calculate stall area utility function
const calculateStallArea = (dimensions: { 
  shapeType?: string; 
  width: number; 
  height: number; 
  radius?: number;
  lShape?: {
    rect1Width: number;
    rect1Height: number;
    rect2Width: number;
    rect2Height: number;
  };
}) => {
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

export default function ReviewStep({ exhibition }: ReviewStepProps) {
  const { selectedStalls, goToNextStep, removeStall } = useBookingStore();
  const { isAuthenticated, exhibitor, openLoginModal } = useAuthStore();

  // Calculate comprehensive booking summary
  const bookingSummary = useMemo(() => {
    if (!selectedStalls.length) {
      return {
        baseAmount: 0,
        discounts: [],
        totalDiscountAmount: 0,
        amountAfterDiscount: 0,
        taxes: [],
        totalTaxAmount: 0,
        total: 0,
        totalArea: 0
      };
    }

    // Base amount from all stalls
    const baseAmount = selectedStalls.reduce((sum, stall) => sum + stall.price, 0);
    
    // Calculate total area
    const totalArea = selectedStalls.reduce((sum, stall) => 
      sum + calculateStallArea(stall.dimensions), 0);

    // Apply discounts from exhibition config
    const activeDiscounts = exhibition?.publicDiscountConfig?.filter(d => d.isActive) || [];
    const discounts = activeDiscounts.map(discount => {
      const amount = discount.type === 'percentage' 
        ? baseAmount * (Math.min(Math.max(0, discount.value), 100) / 100)
        : Math.min(discount.value, baseAmount);
      return {
        name: discount.name,
        type: discount.type,
        value: discount.value,
        amount
      };
    });

    const totalDiscountAmount = discounts.reduce((sum: number, d) => sum + d.amount, 0);
    const amountAfterDiscount = baseAmount - totalDiscountAmount;

    // Apply taxes
    const taxes = exhibition?.taxConfig
      ?.filter(tax => tax.isActive)
      ?.map(tax => ({
        name: tax.name,
        rate: tax.rate,
        amount: amountAfterDiscount * (tax.rate / 100)
      })) || [];

    const totalTaxAmount = taxes.reduce((sum: number, tax) => sum + tax.amount, 0);
    const total = amountAfterDiscount + totalTaxAmount;

    return {
      baseAmount,
      discounts,
      totalDiscountAmount,
      amountAfterDiscount,
      taxes,
      totalTaxAmount,
      total,
      totalArea
    };
  }, [selectedStalls, exhibition]);

  const handleContinue = () => {
    goToNextStep();
  };

  const handleRemoveStall = (stallId: string) => {
    removeStall(stallId);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Handle authentication requirement
  if (!isAuthenticated || !exhibitor) {
    return (
      <div className="p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-4">
              <p>Please log in to continue with your booking.</p>
              <Button onClick={() => openLoginModal('stall-booking')}>
                Log In to Continue
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (selectedStalls.length === 0) {
    return (
      <div className="p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No stalls selected. Please go back and select at least one stall to book.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-8 pb-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Summary
        </h2>
        <p className="text-gray-600">
          Please review your booking details before proceeding.
        </p>
      </div>

      {/* Exhibitor Information */}
      <Card className="mb-8">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Exhibitor Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Contact Person</div>
                <div className="font-medium text-gray-900">{exhibitor.contactPerson || "Not provided"}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Building className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Company</div>
                <div className="font-medium text-gray-900">{exhibitor.companyName || "Not provided"}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div className="font-medium text-gray-900">{exhibitor.phone || "Not provided"}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium text-gray-900">{exhibitor.email || "Not provided"}</div>
              </div>
            </div>
          </div>
          
          {exhibitor.gstNumber && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-500">GST Number:</div>
                <div className="font-medium text-gray-900">{exhibitor.gstNumber}</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Selected Stalls */}
      <Card className="mb-8">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Stalls</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Stall</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Hall</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Type</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Dimensions</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Rate</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Price</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedStalls.map((stall) => {
                  const area = calculateStallArea(stall.dimensions);
                  const dimensionText = stall.dimensions.shapeType === 'l-shape' 
                    ? 'L-Shape' 
                    : `${stall.dimensions.width}M×${stall.dimensions.height}M`;
                  
                  return (
                    <tr key={stall._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">
                          {stall.stallNumber}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {stall.hallName || `Hall ${stall.hallId || 1}`}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {stall.type || 'Standard'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="text-sm">
                          <div className="font-medium">{dimensionText}</div>
                          <div className="text-gray-500">{area} sqm</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        {formatCurrency(stall.ratePerSqm || 0)}/sqm
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                          {formatCurrency(stall.price)}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveStall(stall._id || '')}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">
              Total Base Amount: {formatCurrency(bookingSummary.baseAmount)}
            </div>
          </div>
        </div>
      </Card>

      {/* Included Basic Amenities */}
      {exhibition?.basicAmenities && exhibition.basicAmenities.length > 0 && (
        <Card className="mt-8 mb-8">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-gray-900">Included Basic Amenities</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              The following amenities are included based on your total stall area of {bookingSummary.totalArea} sqm.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Quantity</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Allocation</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exhibition.basicAmenities.map((amenity, index: number) => {
                    const calculatedQuantity = Math.floor(bookingSummary.totalArea / amenity.perSqm) * amenity.quantity;
                    if (calculatedQuantity === 0) return null;
                    
                    return (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium text-gray-900">{amenity.name}</div>
                            <div className="text-sm text-gray-500">{amenity.description}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {amenity.type}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {calculatedQuantity} {calculatedQuantity === 1 ? 'unit' : 'units'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center text-sm text-gray-600">
                            <Info className="h-4 w-4 mr-1" />
                            1 {amenity.quantity > 1 ? `set of ${amenity.quantity}` : 'unit'} per {amenity.perSqm} sqm
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-green-600 font-medium">Included</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}


      {/* Important Information */}
      <Alert className="mt-8 mb-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-1">
            <p>• Additional services and amenities can be added in the next step</p>
            <p>• Your selection will be held for 15 minutes to complete booking</p>
            <p>• Payment must be completed to confirm your booking</p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <div className="text-sm text-gray-500">
          Step 1 of 3 • Review your selection
        </div>
        
        <Button 
          onClick={handleContinue}
          size="lg"
          className="px-8"
        >
          Continue to Amenities
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
