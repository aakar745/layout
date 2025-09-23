'use client';

import React, { useEffect, useState } from 'react';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { Stall } from '@/lib/types/layout';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { getExhibitionLayout } from '@/lib/api/layout';
import BookingHeader from './BookingHeader';
import BookingProgress from './BookingProgress';
import BookingSteps from './steps/BookingSteps';
import BookingSidebar from './BookingSidebar';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { AlertTriangle, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

interface BookingPageClientProps {
  exhibition: ExhibitionWithStats;
  selectedStallIds: string[];
  error: string | null;
}

export default function BookingPageClient({
  exhibition,
  selectedStallIds,
  error
}: BookingPageClientProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(error);
  
  const {
    initializeBooking,
    selectedStalls,
    currentStep,
    isLoading: bookingLoading
  } = useBookingStore();

  const { 
    isAuthenticated, 
    exhibitor,
    openLoginModal,
    isApproved 
  } = useAuthStore();

  // Load stall data and initialize booking
  useEffect(() => {
    const loadStallData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch layout to get stall details
        const layout = await getExhibitionLayout(exhibition._id);
        
        // Find selected stalls
        const allStalls = layout.halls.flatMap(hall => hall.stalls || []);
        
        // Find selected stalls that are available for booking
        const stalls = allStalls.filter(stall => {
          const stallId = stall._id || stall.id || '';
          const isSelected = selectedStallIds.includes(stallId);
          const isAvailable = stall.status === 'available';
          return isSelected && isAvailable;
        });
        
        if (stalls.length === 0) {
          setLoadError('Selected stalls are no longer available');
          return;
        }
        
        if (stalls.length !== selectedStallIds.length) {
          console.warn('Some selected stalls are not available');
        }
        
        // Initialize booking store
        initializeBooking(exhibition._id, stalls);
        
      } catch (err) {
        console.error('Failed to load stall data:', err);
        setLoadError(err instanceof Error ? err.message : 'Failed to load booking data');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedStallIds.length > 0) {
      loadStallData();
    } else {
      setIsLoading(false);
    }
  }, [exhibition._id, selectedStallIds, initializeBooking]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 mt-4">Loading booking information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Error
          </h1>
          <p className="text-gray-600 mb-6">{loadError}</p>
          <div className="space-y-3">
            <Link href={`/exhibitions/${exhibition._id}/layout`}>
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Layout
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authentication check - user must be logged in and approved
  if (!isAuthenticated || !exhibitor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <Lock className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to proceed with your stall booking.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => openLoginModal('stall-booking')}
              className="w-full"
            >
              Login to Continue
            </Button>
            <Link href={`/exhibitions/${exhibition._id}/layout`}>
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Layout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Account approval check
  if (!isApproved()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Pending Approval
          </h1>
          <div className="space-y-4">
            {exhibitor.status === 'pending' && (
              <Alert>
                <AlertDescription>
                  Your account is currently pending approval from our admin team. 
                  You'll receive an email notification once your account is approved and you can proceed with bookings.
                </AlertDescription>
              </Alert>
            )}
            {exhibitor.status === 'rejected' && (
              <Alert variant="destructive">
                <AlertDescription>
                  Your registration has been rejected. 
                  {exhibitor.rejectionReason && (
                    <div className="mt-2">
                      <strong>Reason:</strong> {exhibitor.rejectionReason}
                    </div>
                  )}
                  Please contact the administrator for more details.
                </AlertDescription>
              </Alert>
            )}
            {!exhibitor.isActive && (
              <Alert variant="destructive">
                <AlertDescription>
                  Your account has been deactivated. Please contact the administrator for assistance.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="mt-6">
            <Link href={`/exhibitions/${exhibition._id}/layout`}>
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Layout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <BookingHeader exhibition={exhibition} />

        {/* Progress Indicator */}
        <div className="mt-8">
          <BookingProgress />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Booking Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <BookingSteps exhibition={exhibition} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar exhibition={exhibition} />
          </div>
        </div>
      </div>
    </div>
  );
}
