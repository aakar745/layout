import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Info, 
  ShoppingBag,
  MapPin,
  CalendarCheck
} from 'lucide-react';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { 
  getExhibitionDuration, 
  calculateDaysInfo,
  getExhibitionStatus,
  formatExhibitionDate
} from '@/lib/utils/exhibitions';

interface ExhibitionStatsProps {
  exhibition: ExhibitionWithStats;
  compact?: boolean;
}

export default function ExhibitionStats({ exhibition, compact = false }: ExhibitionStatsProps) {
  const duration = getExhibitionDuration(exhibition.startDate, exhibition.endDate);
  const daysInfo = calculateDaysInfo(exhibition.startDate, exhibition.endDate);
  const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);

  if (compact) {
    // Sidebar version for details page
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Key Information
        </h3>
        
        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center space-x-3">
            <div 
              className="h-10 w-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${status.color}20` }}
            >
              <Info className="h-5 w-5" style={{ color: status.color }} />
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-medium text-gray-900">
                {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
              </div>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Start Date</div>
              <div className="font-medium text-gray-900">
                {formatExhibitionDate(exhibition.startDate, { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">End Date</div>
              <div className="font-medium text-gray-900">
                {formatExhibitionDate(exhibition.endDate, { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Venue */}
          {exhibition.venue && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Venue</div>
                <div className="font-medium text-gray-900">
                  {exhibition.venue}
                </div>
              </div>
            </div>
          )}

          {/* Stall Availability */}
          {exhibition.stallStats && exhibition.stallStats.total > 0 && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Stall Availability</div>
                <div className="font-medium text-gray-900">
                  {exhibition.stallStats.available} of {exhibition.stallStats.total} available
                </div>
                <div className="text-xs text-gray-500">
                  {exhibition.stallStats.booked} already booked
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  // Main stats cards for details page
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
      {/* Duration */}
      <Card className="p-6 text-center bg-white shadow-xl">
        <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-3">
          <Calendar className="h-6 w-6 text-blue-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">{duration}</div>
        <div className="text-sm text-gray-500">Days Duration</div>
      </Card>

      {/* Countdown/Status */}
      <Card className="p-6 text-center bg-white shadow-xl">
        <div 
          className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: `${status.color}20` }}
        >
          <Clock className="h-6 w-6" style={{ color: status.color }} />
        </div>
        <div className="text-2xl font-bold text-gray-900">{daysInfo.count}</div>
        <div className="text-sm text-gray-500">{daysInfo.label.replace(/^\d+\s/, '')}</div>
      </Card>

      {/* Status */}
      <Card className="p-6 text-center bg-white shadow-xl">
        <div 
          className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: `${status.color}20` }}
        >
          <Info className="h-6 w-6" style={{ color: status.color }} />
        </div>
        <div 
          className="text-2xl font-bold" 
          style={{ color: status.color }}
        >
          {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
        </div>
        <div className="text-sm text-gray-500">Current Status</div>
      </Card>

      {/* Stall Availability */}
      <Card className="p-6 text-center bg-white shadow-xl">
        <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-3">
          <ShoppingBag className="h-6 w-6 text-green-600" />
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {exhibition.stallStats?.available || 0}
        </div>
        <div className="text-sm text-gray-500">Available Stalls</div>
        {exhibition.stallStats && exhibition.stallStats.total > 0 && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${exhibition.stallStats.percentage}%` 
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {exhibition.stallStats.percentage}% available
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
