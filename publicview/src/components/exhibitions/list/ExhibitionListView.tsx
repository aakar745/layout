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
  Clock, 
  ArrowRight, 
  Users, 
  Building2,
  ExternalLink,
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

interface ExhibitionListItemProps {
  exhibition: Exhibition;
  priority?: boolean;
}

function ExhibitionListItem({ exhibition, priority = false }: ExhibitionListItemProps) {
  const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
  const daysInfo = calculateDaysInfo(exhibition.startDate, exhibition.endDate);
  const exhibitionUrl = getExhibitionUrl(exhibition);
  const imageUrl = getImageUrl(exhibition.headerLogo, 'logo');

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-blue-200 bg-white">
      <div className="p-6">
        <div className="flex items-start space-x-6">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border-2 border-gray-100">
              <Image
                src={imageUrl}
                alt={`${exhibition.name} logo`}
                fill
                className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                priority={priority}
                sizes="96px"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0 mr-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                  {exhibition.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {exhibition.description}
                </p>
              </div>
              
              {/* Status Badge */}
              <Badge 
                className="flex-shrink-0 px-3 py-1 text-xs font-medium"
                style={{ 
                  backgroundColor: status.bgColor,
                  color: status.textColor,
                  border: `1px solid ${status.color}20`
                }}
              >
                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Date Info */}
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">
                    {formatDateRange(exhibition.startDate, exhibition.endDate)}
                  </div>
                  <div className="text-xs text-gray-500">{daysInfo.label}</div>
                </div>
              </div>

              {/* Venue Info */}
              {exhibition.venue && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-red-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900 line-clamp-1">
                      {exhibition.venue}
                    </div>
                    <div className="text-xs text-gray-500">Venue</div>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">
                    {(exhibition as any).stallStats?.total || 'N/A'} Stalls
                  </div>
                  <div className="text-xs text-gray-500">
                    {(exhibition as any).stallStats?.available || 'N/A'} available
                  </div>
                </div>
              </div>
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                {status.status === 'active' && (
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-green-500" />
                    <span>Live Now</span>
                  </div>
                )}
                
                {(exhibition as any).stallStats?.percentage && (
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1 text-blue-500" />
                    <span>{Math.round((exhibition as any).stallStats.percentage)}% occupied</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Link href={exhibitionUrl}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                  >
                    View Details
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
                
                {status.status !== 'completed' && (
                  <Link href={`${exhibitionUrl}/layout`}>
                    <Button 
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    >
                      Book Stalls
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface ExhibitionListViewProps {
  exhibitions: Exhibition[];
  loading?: boolean;
  error?: string | null;
}

export default function ExhibitionListView({ 
  exhibitions, 
  loading = false,
  error = null 
}: ExhibitionListViewProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
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
    <div className="space-y-4">
      {exhibitions.map((exhibition, index) => (
        <ExhibitionListItem
          key={exhibition._id}
          exhibition={exhibition}
          priority={index < 3}
        />
      ))}
    </div>
  );
}
