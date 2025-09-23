import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

  const handleDownload = () => {
    // This would trigger layout export functionality
    console.log('Download layout as image');
  };

  return (
    <div className="space-y-6">
      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={getExhibitionUrl(exhibition)}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Details
            </Button>
          </Link>
          
          {/* Connection Status */}
          <div className="flex items-center space-x-2 text-sm">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-green-600">Live Updates</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-red-600">Offline</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Main Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Exhibition Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {exhibition.name}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
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

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalStalls}</div>
                <div className="text-xs text-gray-500">Total Stalls</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.availableStalls}</div>
                <div className="text-xs text-gray-500">Available</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.bookedStalls}</div>
                <div className="text-xs text-gray-500">Booked</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.occupancyRate.toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500">Occupied</div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
