'use client';

import React from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import ReviewStep from './ReviewStep';
import CustomerStep from './CustomerStep';
import AmenitiesStep from './AmenitiesStep';
import PaymentStep from './PaymentStep';

interface BookingStepsProps {
  exhibition: ExhibitionWithStats;
}

export default function BookingSteps({ exhibition }: BookingStepsProps) {
  const { currentStep } = useBookingStore();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ReviewStep exhibition={exhibition} />;
      case 1:
        return <AmenitiesStep exhibition={exhibition} />;
      case 2:
        return <PaymentStep exhibition={exhibition} />;
      default:
        return <ReviewStep exhibition={exhibition} />;
    }
  };

  return (
    <div className="min-h-[500px]">
      {renderStep()}
    </div>
  );
}
