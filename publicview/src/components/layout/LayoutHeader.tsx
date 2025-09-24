import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLayoutStore } from '@/store/layoutStore';
import { 
  Calendar, 
  MapPin, 
  Users, 
  ShoppingBag, 
  Wifi, 
  WifiOff,
  ArrowLeft,
  Share,
  Download
} from 'lucide-react';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { LayoutStats } from '@/lib/types/layout';
import { 
  formatDateRange, 
  getExhibitionStatus,
  getExhibitionUrl
} from '@/lib/utils/exhibitions';

interface LayoutHeaderProps {
  exhibition: ExhibitionWithStats;
  stats: LayoutStats | null;
  isConnected: boolean;
}

export default function LayoutHeader({ 
  exhibition, 
  stats, 
  isConnected 
}: LayoutHeaderProps) {
  const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
  
  const handleShare = async () => {
    const shareData = {
      title: `${exhibition.name} - Interactive Layout`,
      text: `Check out the interactive layout for ${exhibition.name}`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        await navigator.clipboard.writeText(shareData.url);
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
    }
  };

  const handleDownload = async () => {
    try {
      await useLayoutStore.getState().exportCanvasAsImage();
    } catch (error) {
      console.error('Failed to download layout:', error);
      alert('Failed to download layout. Please try again.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Navigation & Actions - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link href={getExhibitionUrl(exhibition)}>
            <Button variant="outline" size="sm" className="px-2 sm:px-3">
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Back to Details</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
            {isConnected ? (
              <>
                <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                <span className="text-green-600 hidden sm:inline">Live Updates</span>
                <span className="text-green-600 sm:hidden">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                <span className="text-red-600 hidden sm:inline">Offline</span>
                <span className="text-red-600 sm:hidden">Offline</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="px-2 sm:px-3">
            <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="px-2 sm:px-3">
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {/* Main Header - Improved Layout */}
      <Card className="p-3 sm:p-4 lg:p-6 rounded-md">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
          {/* Left Side: Exhibition Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
              <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-gray-900 line-clamp-2">
                {exhibition.name}
              </h1>
              <Badge 
                className="self-start sm:self-center rounded-md"
                style={{ 
                  backgroundColor: status.bgColor,
                  color: status.textColor,
                  border: `1px solid ${status.color}20`
                }}
              >
                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-purple-500 flex-shrink-0" />
                <span className="truncate">{formatDateRange(exhibition.startDate, exhibition.endDate)}</span>
              </div>
              
              {exhibition.venue && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <span className="truncate">{exhibition.venue}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Stats Counter */}
          {stats && (
            <div className="flex-shrink-0">
              <div className="grid grid-cols-4 gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600">{stats.totalStalls}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-green-600">{stats.availableStalls}</div>
                  <div className="text-xs text-gray-500">Available</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-orange-600">{stats.bookedStalls}</div>
                  <div className="text-xs text-gray-500">Booked</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-purple-600">
                    {stats.occupancyRate.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500">Occupied</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
