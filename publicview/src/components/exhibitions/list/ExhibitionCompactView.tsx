'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Building2,
  Zap
} from 'lucide-react';
import { Exhibition } from '@/lib/types/exhibitions';
import { 
  getExhibitionStatus, 
  formatDateRange, 
  calculateDaysInfo,
  getExhibitionUrl
} from '@/lib/utils/exhibitions';
import { getImageUrl } from '@/lib/api/exhibitions';

interface ExhibitionCompactCardProps {
  exhibition: Exhibition;
  priority?: boolean;
}

function ExhibitionCompactCard({ exhibition, priority = false }: ExhibitionCompactCardProps) {
  const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
  const daysInfo = calculateDaysInfo(exhibition.startDate, exhibition.endDate);
  const exhibitionUrl = getExhibitionUrl(exhibition);
  const imageUrl = getImageUrl(exhibition.headerLogo, 'logo');

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200 bg-white h-full">
      {/* Status Badge */}
      <Badge 
        className="absolute top-3 right-3 z-10 px-2 py-1 text-xs font-medium"
        style={{ 
          backgroundColor: status.bgColor,
          color: status.textColor,
          border: `1px solid ${status.color}20`
        }}
      >
        {status.status === 'active' && <Zap className="h-3 w-3 mr-1" />}
        {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
      </Badge>

      <div className="p-4 h-full flex flex-col">
        {/* Logo and Title */}
        <div className="flex items-start space-x-3 mb-3">
          <div className="flex-shrink-0">
            <div className="relative w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={imageUrl}
                alt={`${exhibition.name} logo`}
                fill
                className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                priority={priority}
                sizes="48px"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
              {exhibition.name}
            </h3>
            <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
              {exhibition.description}
            </p>
          </div>
        </div>

        {/* Key Info */}
        <div className="space-y-2 mb-4 flex-1">
          {/* Date */}
          <div className="flex items-center text-xs text-gray-600">
            <Calendar className="h-3 w-3 mr-2 text-blue-500 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900 text-xs">
                {formatDateRange(exhibition.startDate, exhibition.endDate)}
              </div>
              <div className="text-xs text-gray-500">{daysInfo.label}</div>
            </div>
          </div>

          {/* Venue */}
          {exhibition.venue && (
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="h-3 w-3 mr-2 text-red-500 flex-shrink-0" />
              <span className="font-medium text-gray-900 line-clamp-1 text-xs">
                {exhibition.venue}
              </span>
            </div>
          )}

          {/* Stalls Info */}
          <div className="flex items-center text-xs text-gray-600">
            <Building2 className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" />
            <span className="text-xs">
              <span className="font-medium text-gray-900">
                {(exhibition as any).stallStats?.total || 'N/A'}
              </span> stalls
              {(exhibition as any).stallStats?.available && (
                <span className="text-gray-500 ml-1">
                  · {(exhibition as any).stallStats.available} available
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Link href={exhibitionUrl} className="block">
            <Button 
              variant="outline" 
              size="sm"
              className="w-full text-xs border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
            >
              <span>View Details</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

interface ExhibitionCompactViewProps {
  exhibitions: Exhibition[];
  loading?: boolean;
  error?: string | null;
}

export default function ExhibitionCompactView({ 
  exhibitions, 
  loading = false,
  error = null 
}: ExhibitionCompactViewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse h-48">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to Load Exhibitions
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (exhibitions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Exhibitions Found
          </h3>
          <p className="text-gray-600">
            There are currently no exhibitions available. Check back later for new events!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {exhibitions.map((exhibition, index) => (
        <ExhibitionCompactCard
          key={exhibition._id}
          exhibition={exhibition}
          priority={index < 5}
        />
      ))}
    </div>
  );
}
