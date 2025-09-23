import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { 
  formatDateRange, 
  getExhibitionStatus 
} from '@/lib/utils/exhibitions';

interface BookingHeaderProps {
  exhibition: ExhibitionWithStats;
}

export default function BookingHeader({ exhibition }: BookingHeaderProps) {
  const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Link href={`/exhibitions/${exhibition._id}/layout`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Layout
          </Button>
        </Link>
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/exhibitions" className="hover:text-blue-600">
            Exhibitions
          </Link>
          <span>•</span>
          <Link href={`/exhibitions/${exhibition._id}`} className="hover:text-blue-600">
            {exhibition.name}
          </Link>
          <span>•</span>
          <span className="text-gray-900 font-medium">Booking</span>
        </nav>
      </div>

      {/* Main Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Exhibition Info */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Complete Your Booking
              </h1>
              <Badge 
                style={{ 
                  backgroundColor: status.bgColor,
                  color: status.textColor,
                  border: `1px solid ${status.color}20`
                }}
              >
                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </Badge>
            </div>
            
            <h2 className="text-xl text-gray-700 mb-3">
              {exhibition.name}
            </h2>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-500" />
                <span>{formatDateRange(exhibition.startDate, exhibition.endDate)}</span>
              </div>
              
              {exhibition.venue && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <span>{exhibition.venue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
            <div className="flex items-center space-x-2 text-green-600 mb-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Secure Checkout</span>
            </div>
            <div className="text-xs text-gray-500">
              SSL encrypted • PCI compliant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
