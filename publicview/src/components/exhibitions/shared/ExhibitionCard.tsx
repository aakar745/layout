'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { Exhibition } from '@/lib/types/exhibitions';
import { 
  getExhibitionStatus, 
  formatDateRange, 
  calculateDaysInfo,
  getExhibitionUrl
} from '@/lib/utils/exhibitions';
import { getImageUrl } from '@/lib/api/exhibitions';

interface ExhibitionCardProps {
  exhibition: Exhibition;
  priority?: boolean; // For image loading priority
  className?: string;
}

export default function ExhibitionCard({ 
  exhibition, 
  priority = false,
  className = '' 
}: ExhibitionCardProps) {
  const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
  const daysInfo = calculateDaysInfo(exhibition.startDate, exhibition.endDate);
  const exhibitionUrl = getExhibitionUrl(exhibition);
  const imageUrl = getImageUrl(exhibition.headerLogo, 'logo');

  return (
    <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-200 bg-white h-full ${className}`}>
      {/* Status Badge */}
      <Badge 
        className="absolute top-4 right-4 z-10 px-3 py-1 text-xs font-medium shadow-sm"
        style={{ 
          backgroundColor: status.bgColor,
          color: status.textColor,
          border: `1px solid ${status.color}20`
        }}
      >
        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
      </Badge>

      <div className="flex flex-col h-full">
        {/* Image Section */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
          <div className="relative w-full h-32">
            <Image
              src={imageUrl}
              alt={`${exhibition.name} logo`}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between flex-1">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {exhibition.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
              {exhibition.description}
            </p>

            <div className="space-y-3 mb-6">
              {/* Date Range */}
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-3 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">
                    {formatDateRange(exhibition.startDate, exhibition.endDate)}
                  </div>
                  <div className="text-xs text-gray-500">{daysInfo.label}</div>
                </div>
              </div>

              {/* Venue */}
              {exhibition.venue && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-3 text-red-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 line-clamp-1">
                      {exhibition.venue}
                    </div>
                    <div className="text-xs text-gray-500">Venue location</div>
                  </div>
                </div>
              )}

              {/* Stats */}
              {(exhibition as any).stallStats && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-3 text-green-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {(exhibition as any).stallStats.total || 0} stalls
                    </div>
                    <div className="text-xs text-gray-500">
                      {(exhibition as any).stallStats.available || 0} available
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href={`${exhibitionUrl}/layout`} className="block">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                disabled={status.status === 'completed'}
              >
                {status.status === 'completed' ? 'Exhibition Ended' : 'View Layout & Book'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <Link href={exhibitionUrl} className="block">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              >
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
