'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useBookingStore } from '@/store/bookingStore';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { ArrowRight, ArrowLeft, Package, Info } from 'lucide-react';

interface AmenitiesStepProps {
  exhibition: ExhibitionWithStats;
}

// Calculate stall area utility function
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
  
  return dimensions.width * dimensions.height;
};

interface BasicAmenity {
  _id?: string;
  id?: string;
  type: 'facility' | 'service' | 'equipment' | 'other';
  name: string;
  description: string;
  perSqm: number;
  quantity: number;
  calculatedQuantity?: number;
}

interface ExtraAmenity {
  _id?: string;
  id?: string;
  type: 'facility' | 'service' | 'equipment' | 'other';
  name: string;
  description: string;
  rate: number;
  quantity?: number;
}

export default function AmenitiesStep({ exhibition }: AmenitiesStepProps) {
  const { 
    selectedStalls, 
    formData, 
    updateFormData,
    goToNextStep, 
    goToPreviousStep 
  } = useBookingStore();

  // State for selected extra amenities with quantities
  const [selectedExtraAmenities, setSelectedExtraAmenities] = useState<string[]>(
    formData.amenities?.map(a => a.id) || []
  );
  const [amenityQuantities, setAmenityQuantities] = useState<Record<string, number>>(() => {
    const quantities: Record<string, number> = {};
    formData.amenities?.forEach(amenity => {
      quantities[amenity.id] = amenity.quantity || 1;
    });
    return quantities;
  });

  // Calculate total area of selected stalls
  const totalStallArea = useMemo(() => {
    return selectedStalls.reduce((total, stall) => {
      return total + calculateStallArea(stall.dimensions);
    }, 0);
  }, [selectedStalls]);

  // Calculate basic amenities based on total stall area
  const basicAmenitiesWithQuantities = useMemo(() => {
    if (!exhibition?.basicAmenities || !exhibition.basicAmenities.length || totalStallArea === 0) {
      return [];
    }

    return exhibition.basicAmenities.map((amenity: BasicAmenity) => {
      // Calculate quantity based on square meters and perSqm rate
      const calculatedQuantity = Math.floor(totalStallArea / amenity.perSqm) * amenity.quantity;
      
      return {
        ...amenity,
        calculatedQuantity: calculatedQuantity > 0 ? calculatedQuantity : 0,
        key: amenity._id || amenity.id
      };
    });
  }, [exhibition?.basicAmenities, totalStallArea]);

  // Get amenity ID safely
  const getAmenityId = (amenity: ExtraAmenity): string => {
    return (amenity._id || amenity.id || '').toString();
  };

  // Handle extra amenity selection
  const handleExtraAmenityToggle = (amenityId: string) => {
    const isSelected = selectedExtraAmenities.includes(amenityId);
    
    if (isSelected) {
      // Remove amenity
      setSelectedExtraAmenities(prev => prev.filter(id => id !== amenityId));
      setAmenityQuantities(prev => {
        const updated = { ...prev };
        delete updated[amenityId];
        return updated;
      });
    } else {
      // Add amenity with quantity 1
      setSelectedExtraAmenities(prev => [...prev, amenityId]);
      setAmenityQuantities(prev => ({
        ...prev,
        [amenityId]: 1
      }));
    }
  };

  // Handle quantity change
  const handleQuantityChange = (amenityId: string, quantity: number) => {
    setAmenityQuantities(prev => ({
      ...prev,
      [amenityId]: Math.max(1, quantity)
    }));
  };

  // Get selected extra amenities details
  const selectedExtraAmenitiesDetails = useMemo(() => {
    if (!exhibition?.amenities) return [];
    
    return exhibition.amenities
      .filter((amenity: ExtraAmenity) => selectedExtraAmenities.includes(getAmenityId(amenity)))
      .map((amenity: ExtraAmenity) => ({
        ...amenity,
        key: getAmenityId(amenity),
        quantity: amenityQuantities[getAmenityId(amenity)] || 1
      }));
  }, [exhibition?.amenities, selectedExtraAmenities, amenityQuantities]);

  // Calculate total cost for extra amenities
  const totalExtraAmenityCost = useMemo(() => {
    return selectedExtraAmenitiesDetails.reduce((total, amenity) => {
      return total + (amenity.rate * amenity.quantity);
    }, 0);
  }, [selectedExtraAmenitiesDetails]);

  const handleContinue = () => {
    // Update form data with selected amenities
    const amenitiesData = selectedExtraAmenitiesDetails.map(amenity => ({
      id: amenity.key,
      quantity: amenity.quantity
    }));
    
    updateFormData({ amenities: amenitiesData });
    goToNextStep();
  };

  const handleBack = () => {
    goToPreviousStep();
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      facility: 'bg-blue-50 text-blue-700 border-blue-200',
      service: 'bg-green-50 text-green-700 border-green-200',
      equipment: 'bg-purple-50 text-purple-700 border-purple-200',
      other: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Stall Amenities
        </h2>
        <p className="text-gray-600">
          Review included amenities and select additional amenities for your exhibition stalls.
        </p>
      </div>

      {/* Selected Stalls Summary */}
      <Card className="mb-8 p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-blue-900">
              {selectedStalls.length} stall(s) selected
            </span>
          </div>
          <div className="text-sm text-blue-700">
            Total area: {totalStallArea} sqm
          </div>
        </div>
      </Card>

      {/* Basic Amenities (Included) */}
      <Card className="mb-8">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <h3 className="text-lg font-semibold text-gray-900">Included Amenities</h3>
          </div>
          
          {basicAmenitiesWithQuantities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Type</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Quantity</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {basicAmenitiesWithQuantities
                    .filter(amenity => amenity.calculatedQuantity > 0)
                    .map((amenity) => (
                    <tr key={amenity.key} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{amenity.name}</div>
                          <div className="text-sm text-gray-500">{amenity.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className={getTypeColor(amenity.type)}>
                          {amenity.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {amenity.calculatedQuantity} {amenity.calculatedQuantity === 1 ? 'unit' : 'units'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center text-sm text-gray-600">
                          <Info className="h-4 w-4 mr-1" />
                          1 {amenity.quantity > 1 ? `set of ${amenity.quantity}` : 'unit'} per {amenity.perSqm} sqm
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {basicAmenitiesWithQuantities.every(a => a.calculatedQuantity === 0) && (
                <Alert>
                  <AlertDescription>
                    Your stall area is too small to qualify for any basic amenities.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No basic amenities have been configured for this exhibition.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Extra Amenities */}
      <Card className="mb-8">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Amenities (Extra Charges)
          </h3>
          
          {exhibition?.amenities && exhibition.amenities.length > 0 ? (
            <div className="space-y-4">
              {/* Available Amenities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exhibition.amenities.map((amenity: ExtraAmenity) => {
                  const amenityId = getAmenityId(amenity);
                  const isSelected = selectedExtraAmenities.includes(amenityId);
                  
                  return (
                    <div
                      key={amenityId}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      onClick={() => handleExtraAmenityToggle(amenityId)}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => handleExtraAmenityToggle(amenityId)}
                          className="mt-0.5"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">
                                {amenity.name}
                              </h4>
                              <Badge variant="outline" className={getTypeColor(amenity.type)}>
                                {amenity.type}
                              </Badge>
                            </div>
                            <span className="font-bold text-blue-600">
                              {formatCurrency(amenity.rate)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">
                            {amenity.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Amenities Table */}
              {selectedExtraAmenitiesDetails.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Selected Amenities</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Name</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-900">Rate</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-900">Quantity</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedExtraAmenitiesDetails.map((amenity) => (
                          <tr key={amenity.key} className="border-b border-gray-100">
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{amenity.name}</span>
                                <Badge variant="outline" className={getTypeColor(amenity.type)}>
                                  {amenity.type}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500">{amenity.description}</div>
                            </td>
                            <td className="py-4 px-4 text-center font-medium text-blue-600">
                              {formatCurrency(amenity.rate)}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Input
                                type="number"
                                min="1"
                                value={amenity.quantity}
                                onChange={(e) => handleQuantityChange(amenity.key, parseInt(e.target.value) || 1)}
                                className="w-20 text-center"
                              />
                            </td>
                            <td className="py-4 px-4 text-right font-semibold text-blue-600">
                              {formatCurrency(amenity.rate * amenity.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Total Cost Summary */}
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between text-lg font-bold">
                      <span>Total Additional Amenities Cost:</span>
                      <span className="text-green-600">
                        {formatCurrency(totalExtraAmenityCost)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No additional amenities are available for this exhibition.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handleBack}
          size="lg"
          className="px-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Review
        </Button>
        
        <div className="text-sm text-gray-500">
          Step 2 of 3 • Select amenities
        </div>
        
        <Button 
          onClick={handleContinue}
          size="lg"
          className="px-8"
        >
          Continue to Payment
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}