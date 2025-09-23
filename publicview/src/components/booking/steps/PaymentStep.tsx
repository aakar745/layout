'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { ArrowLeft, CheckCircle, Clock, User, AlertCircle } from 'lucide-react';
import { bookStallsAsExhibitor, bookStallsAsGuest } from '@/lib/api/layout';
import { useRouter } from 'next/navigation';

interface PaymentStepProps {
  exhibition: ExhibitionWithStats;
}

export default function PaymentStep({ exhibition }: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  const router = useRouter();
  
  const { 
    formData, 
    summary, 
    selectedStalls,
    exhibitionId,
    goToPreviousStep,
    updateFormData,
    validateStep,
    setLoading,
    resetBooking
  } = useBookingStore();

  const { isAuthenticated, exhibitor, token } = useAuthStore();

  // Calculate the correct total exactly like Order Summary sidebar
  const correctTotal = useMemo(() => {
    if (!selectedStalls || selectedStalls.length === 0) {
      return 0;
    }

    // Base amount from all selected stalls
    const baseAmount = selectedStalls.reduce((sum, stall) => sum + stall.price, 0);

    // Find active public discounts and calculate total discount
    const activeDiscounts = exhibition?.publicDiscountConfig?.filter(d => d.isActive) || [];
    const totalDiscountAmount = activeDiscounts.reduce((sum: number, discount) => {
      const amount = discount.type === 'percentage' 
        ? baseAmount * (Math.min(Math.max(0, discount.value), 100) / 100)
        : Math.min(discount.value, baseAmount);
      return sum + amount;
    }, 0);

    const amountAfterDiscount = baseAmount - totalDiscountAmount;

    // Find active taxes and calculate total tax
    const activeTaxes = exhibition?.taxConfig?.filter(t => t.isActive) || [];
    const totalTaxAmount = activeTaxes.reduce((sum: number, tax) => {
      const amount = amountAfterDiscount * (Math.min(Math.max(0, tax.rate), 100) / 100);
      return sum + amount;
    }, 0);

    const stallsTotal = amountAfterDiscount + totalTaxAmount;
    const amenitiesTotal = summary?.amenitiesTotal || 0;
    
    return stallsTotal + amenitiesTotal;
  }, [selectedStalls, exhibition, summary?.amenitiesTotal]);

  const handleCompleteBooking = async () => {
    const validations = validateStep(2); // Step 2 since we're skipping payment validation
    if (validations.some(v => !v.isValid)) return;

    if (!formData.termsAccepted) {
      setBookingError('Please accept the terms and conditions to continue');
      return;
    }

    setIsProcessing(true);
    setLoading(true);
    setBookingError(null);
    
    try {
      // Prepare booking data exactly like old frontend and backend expects
      // Prepare stallIds for booking
      const stallIds = selectedStalls.map(stall => stall._id || stall.id).filter(Boolean) as string[];
      
      // Find active discount from exhibition config (exactly like old frontend)
      const activeDiscounts = exhibition?.publicDiscountConfig?.filter(d => d.isActive) || [];
      const selectedDiscount = activeDiscounts.length > 0 ? activeDiscounts[0] : null;
      
      // Calculate total stall area for amenities
      const totalStallArea = selectedStalls.reduce((total, stall) => {
        return total + (stall.dimensions.width * stall.dimensions.height);
      }, 0);

      const bookingData = {
        // Core booking fields - exactly as backend expects
        stallIds,
        customerInfo: {
          name: exhibitor?.contactPerson || 'Guest User',
          email: exhibitor?.email || '',
          phone: exhibitor?.phone || '',
          address: exhibitor?.address || 'N/A',
          gstin: exhibitor?.gstNumber || 'N/A',
          pan: exhibitor?.panNumber || 'N/A',
          companyName: exhibitor?.companyName || ''
        },
        
        // Discount data (backend expects 'discountId' field name)
        discountId: selectedDiscount ? {
          name: selectedDiscount.name,
          type: selectedDiscount.type,
          value: selectedDiscount.value
        } : null,
        
        // Optional fields
        notes: formData.notes || '',
        
        // Basic amenities: calculated exactly like old frontend (lines 194-213)
        basicAmenities: exhibition?.basicAmenities?.filter(basicAmenity => {
          const calculatedQuantity = Math.floor(totalStallArea / basicAmenity.perSqm) * basicAmenity.quantity;
          return calculatedQuantity > 0;
        }).map(basicAmenity => {
          const calculatedQuantity = Math.floor(totalStallArea / basicAmenity.perSqm) * basicAmenity.quantity;
          return {
            name: basicAmenity.name,
            type: basicAmenity.type,
            perSqm: basicAmenity.perSqm,
            quantity: basicAmenity.quantity,
            calculatedQuantity: calculatedQuantity,
            description: basicAmenity.description || ''
          };
        }) || [],
        
        // Extra amenities: full objects with all details (like old frontend lines 218-233)
        extraAmenities: formData.amenities?.map(amenity => {
          const fullAmenity = exhibition?.amenities?.find(a => 
            String(a._id || a.id) === String(amenity.id)
          );
          
          if (!fullAmenity) return null;
          
          return {
            id: fullAmenity._id || fullAmenity.id, // ✅ Keep as ObjectId, don't convert to String
            name: fullAmenity.name,
            type: fullAmenity.type,
            rate: fullAmenity.rate,
            quantity: amenity.quantity || 1,
            description: fullAmenity.description || ''
          };
        }).filter(Boolean) || [],
        
        // Total amount for reference
        totalAmount: correctTotal
      };


      // Submit booking with prepared data

      if (isAuthenticated && exhibitor && token) {
        // Use authenticated exhibitor booking API
        await bookStallsAsExhibitor(exhibitionId!, bookingData, token);
      } else {
        // Use guest booking API
        await bookStallsAsGuest(exhibitionId!, bookingData);
      }

      
      setBookingComplete(true);
      
      // Redirect to success page after short delay
      setTimeout(() => {
        resetBooking();
        router.push(`/exhibitions/${exhibition._id}?booking=success`);
      }, 2000);
      
    } catch (error) {
      console.error('❌ [BOOKING] Booking failed:', error);
      setBookingError(
        error instanceof Error 
          ? error.message 
          : 'Failed to complete booking. Please try again.'
      );
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  // Show success state
  if (bookingComplete) {
    return (
      <div className="p-8 text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Submitted!</h2>
          <p className="text-gray-600">Your booking has been submitted for admin approval.</p>
        </div>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="text-left space-y-2">
              <p>• Your stalls are now <strong>reserved</strong></p>
              <p>• Admin will review and approve your booking</p>
              <p>• You&apos;ll receive an email notification once approved</p>
              <p>• Payment will be required after approval</p>
            </div>
          </AlertDescription>
        </Alert>
        
        <p className="text-sm text-gray-500">Redirecting to exhibition page...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Booking</h2>
        <p className="text-gray-600">Review and confirm your booking details.</p>
      </div>

      {/* Exhibitor Information */}
      {isAuthenticated && exhibitor && (
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            Exhibitor Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Contact Person:</span>
              <div className="font-medium">{exhibitor.contactPerson}</div>
            </div>
            <div>
              <span className="text-gray-500">Company:</span>
              <div className="font-medium">{exhibitor.companyName}</div>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <div className="font-medium">{exhibitor.email}</div>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <div className="font-medium">{exhibitor.phone}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Final Amount - Simple Total Only */}
      <Card className="p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Final Amount</h3>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Total Amount</span>
          <span className="text-2xl font-bold text-blue-600">₹{correctTotal.toLocaleString()}</span>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          See detailed breakdown in Order Summary →
        </p>
      </Card>

      {/* Terms & Conditions */}
      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => updateFormData({ termsAccepted: e.target.checked })}
              className="mt-1"
            />
            <span className="text-sm">
              I accept the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
              <a href="#" className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
            </span>
          </label>
          
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={formData.marketingConsent}
              onChange={(e) => updateFormData({ marketingConsent: e.target.checked })}
              className="mt-1"
            />
            <span className="text-sm">
              I agree to receive marketing communications (optional)
            </span>
          </label>
        </div>
      </Card>

      {/* Booking Error */}
      {bookingError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{bookingError}</AlertDescription>
        </Alert>
      )}

      {/* Payment Coming Soon */}
      <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200 mb-6">
        <div className="text-center">
          <div className="flex justify-center space-x-2 mb-4">
            <Clock className="h-6 w-6 text-orange-500" />
            <span className="font-medium text-gray-700">Payment Integration</span>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p>Payment gateway integration is <strong>coming soon</strong></p>
            <p>Your booking will be submitted for admin approval</p>
            <p>Payment will be required after approval</p>
          </div>
        </div>
      </Card>

      {/* Complete Booking Button */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="text-center">          
          <Button
            onClick={handleCompleteBooking}
            disabled={!formData.termsAccepted || isProcessing}
            size="lg"
            className="w-full max-w-md px-12 py-4 text-lg"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Submitting Booking...
              </div>
            ) : (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Booking
              </div>
            )}
          </Button>
          
          <p className="text-xs text-gray-500 mt-2">
            Your booking will be submitted for admin approval
          </p>
        </div>
      </Card>

      <div className="flex justify-between items-center mt-8">
        <Button variant="outline" onClick={goToPreviousStep}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-sm text-gray-500">Step 3 of 3 • Complete Booking</div>
        <div></div>
      </div>
    </div>
  );
}
