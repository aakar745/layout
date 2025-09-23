'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBookingStore } from '@/store/bookingStore';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Shield, 
  Clock,
  Users,
  Phone,
  Mail
} from 'lucide-react';

interface BookingSidebarProps {
  exhibition: ExhibitionWithStats;
}

export default function BookingSidebar({ exhibition }: BookingSidebarProps) {
  const { selectedStalls, summary, formData } = useBookingStore();

  // Calculate booking summary exactly like old frontend StallDetailsStep.tsx lines 127-185
  const calculations = React.useMemo(() => {
    if (!selectedStalls || selectedStalls.length === 0) {
      return {
        baseAmount: 0,
        discounts: [],
        totalDiscountAmount: 0,
        amountAfterDiscount: 0,
        taxes: [],
        totalTaxAmount: 0,
        total: 0
      };
    }

    // Base amount from all selected stalls
    const baseAmount = selectedStalls.reduce((sum, stall) => sum + stall.price, 0);

    // Find active public discounts and calculate total discount
    const activeDiscounts = exhibition?.publicDiscountConfig?.filter((d: any) => d.isActive) || [];
    const discounts = activeDiscounts.map((discount: any) => {
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

    const totalDiscountAmount = discounts.reduce((sum: number, d: any) => sum + d.amount, 0);
    const amountAfterDiscount = baseAmount - totalDiscountAmount;

    // Calculate taxes based on exhibition configuration (applied to discounted amount)
    const taxes = exhibition?.taxConfig
      ?.filter((tax: any) => tax.isActive)
      ?.map((tax: any) => ({
        name: tax.name,
        rate: tax.rate,
        amount: amountAfterDiscount * (tax.rate / 100)
      })) || [];

    const totalTaxAmount = taxes.reduce((sum: number, tax: any) => sum + tax.amount, 0);
    const total = amountAfterDiscount + totalTaxAmount;

    return {
      baseAmount,
      discounts,
      totalDiscountAmount,
      amountAfterDiscount,
      taxes,
      totalTaxAmount,
      total
    };
  }, [selectedStalls, exhibition?.publicDiscountConfig, exhibition?.taxConfig]);

  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <ShoppingBag className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
        </div>

        {/* Selected Stalls */}
        <div className="space-y-3 mb-6">
          <div className="text-sm font-medium text-gray-700">
            Selected Stalls ({selectedStalls.length})
          </div>
          
          {summary.breakdown.map((item) => (
            <div key={item.stallId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-sm text-gray-900">
                  Stall {item.stallNumber}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                ₹{item.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Add-on Services */}
        {summary.amenityBreakdown.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="text-sm font-medium text-gray-700">
              Add-on Services
            </div>
            
            {summary.amenityBreakdown.map((amenity) => (
              <div key={amenity.amenityId} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{amenity.name}</span>
                <span className="font-medium">₹{amenity.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}

        <Separator className="my-4" />

        {/* Price Breakdown - Exact same structure as old frontend */}
        <div className="space-y-2">
          {/* Base Amount */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Amount</span>
            <span>₹{calculations.baseAmount.toLocaleString()}</span>
          </div>
          
          {/* Each discount separately (like old frontend lines 419-429) */}
          {calculations.discounts.map((discount: any, index: number) => (
            <div key={`discount-${index}`} className="flex justify-between text-sm text-green-600">
              <span>
                {discount.name}
                {discount.type === 'percentage' ? ` (${discount.value}%)` : ''}
              </span>
              <span>-₹{discount.amount.toLocaleString()}</span>
            </div>
          ))}
          
          {/* Amount after Discount (like old frontend lines 431-436) */}
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-700">Amount after Discount</span>
            <span>₹{calculations.amountAfterDiscount.toLocaleString()}</span>
          </div>
          
          {/* Add-ons if any */}
          {summary.amenitiesTotal > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Add-ons Subtotal</span>
              <span>₹{summary.amenitiesTotal.toLocaleString()}</span>
            </div>
          )}
          
          {/* Each tax separately (like old frontend lines 438-447) */}
          {calculations.taxes.map((tax: any, index: number) => (
            <div key={`tax-${index}`} className="flex justify-between text-sm text-orange-600">
              <span>{tax.name} ({tax.rate}%)</span>
              <span>+₹{tax.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Total (like old frontend lines 449-462) */}
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-blue-600">
            ₹{(calculations.total + (summary.amenitiesTotal || 0)).toLocaleString()}
          </span>
        </div>

        {/* Security Features */}
        <div className="mt-6 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 text-green-700 mb-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
          <div className="text-xs text-green-600">
            • SSL encrypted checkout<br/>
            • PCI DSS compliant<br/>
            • Powered by PhonePe
          </div>
        </div>
      </Card>

      {/* Contact Information */}
      {(formData.customerInfo.name || formData.customerInfo.email || formData.customerInfo.phone) && (
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
          </div>

          <div className="space-y-3">
            {formData.customerInfo.name && (
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{formData.customerInfo.name}</span>
              </div>
            )}
            
            {formData.customerInfo.email && (
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{formData.customerInfo.email}</span>
              </div>
            )}
            
            {formData.customerInfo.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{formData.customerInfo.phone}</span>
              </div>
            )}
            
            {formData.customerInfo.companyName && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-700">{formData.customerInfo.companyName}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Support Information */}
      <Card className="p-6 mt-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <p>Our support team is available to assist you with your booking.</p>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+91-9876543210</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>support@example.com</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Available: Monday - Friday, 9 AM - 6 PM IST
          </div>
        </div>
      </Card>
    </div>
  );
}
