'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Layout, 
  ShoppingBag, 
  Share, 
  CalendarPlus,
  ExternalLink
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { 
  formatDateRange, 
  calculateDaysInfo, 
  getExhibitionStatus,
  getExhibitionUrl,
  getCalendarEventData,
  getExhibitionSharingData
} from '@/lib/utils/exhibitions';
import { getImageUrl } from '@/lib/api/exhibitions';
import ExhibitionStatus from '../shared/ExhibitionStatus';

interface ExhibitionHeroProps {
  exhibition: ExhibitionWithStats;
}

export default function ExhibitionHero({ exhibition }: ExhibitionHeroProps) {
  const { openLoginModal } = useAuthStore();
  const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
  const daysInfo = calculateDaysInfo(exhibition.startDate, exhibition.endDate);
  const backgroundImage = getImageUrl(exhibition.headerBackground, 'background');
  
  const handleShare = async () => {
    const shareData = getExhibitionSharingData(exhibition);
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // Fallback to copying URL
        await navigator.clipboard.writeText(shareData.url);
        // Could add a toast notification here
      }
    } else {
      // Fallback to copying URL
      await navigator.clipboard.writeText(shareData.url);
      // Could add a toast notification here
    }
  };

  const handleAddToCalendar = () => {
    const calendarData = getCalendarEventData(exhibition);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarData.title)}&dates=${calendarData.start}/${calendarData.end}&details=${encodeURIComponent(calendarData.description)}&location=${encodeURIComponent(calendarData.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="relative overflow-hidden w-full">
      {/* Animated RGB Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient-xy">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 via-purple-600/30 to-pink-600/40 animate-pulse-glow"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400/20 via-blue-500/30 to-purple-600/20 animate-bounce-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-emerald-500/10 via-blue-400/20 to-violet-500/15 animate-pulse"></div>
      </div>
      
      {/* Enhanced Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/50" />
      
      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl">
          {/* Status Badge */}
          <div className="mb-6 animate-float">
            <ExhibitionStatus
              startDate={exhibition.startDate}
              endDate={exhibition.endDate}
              variant="pill"
              size="md"
            />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-float-reverse">
            {exhibition.name}
          </h1>

          {/* Subtitle */}
          {exhibition.headerTitle && exhibition.headerTitle !== exhibition.name && (
            <h2 className="text-xl md:text-2xl text-white/90 mb-6 font-light">
              {exhibition.headerTitle}
            </h2>
          )}

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-white/90">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-300 flex-shrink-0" />
              <span className="text-sm md:text-base">
                {formatDateRange(exhibition.startDate, exhibition.endDate)}
              </span>
            </div>
            
            {exhibition.venue && (
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-red-300 flex-shrink-0" />
                <span className="text-sm md:text-base line-clamp-1">
                  {exhibition.venue}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-yellow-300 flex-shrink-0" />
              <span className="text-sm md:text-base">
                {daysInfo.label}
              </span>
            </div>
          </div>

          {/* Description */}
          {exhibition.headerDescription && (
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl leading-relaxed">
              {exhibition.headerDescription}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 animate-float">
            <Link href={`${getExhibitionUrl(exhibition)}/layout`}>
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 px-6 py-3 text-base shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Layout className="h-5 w-5 mr-2" />
                View Layout & Book Stalls
              </Button>
            </Link>

            {status.status !== 'completed' && (
              <Button 
                variant="outline"
                size="lg"
                onClick={() => openLoginModal()}
                className="border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-3 text-base font-medium bg-white/10 hover:border-white/60 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Exhibitor Portal
              </Button>
            )}

            <Button 
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-3 text-base font-medium bg-white/10 hover:border-white/60 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Share className="h-5 w-5 mr-2" />
              Share
            </Button>

            <Button 
              variant="outline"
              size="lg"
              onClick={handleAddToCalendar}
              className="border-white/40 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-3 text-base font-medium bg-white/10 hover:border-white/60 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <CalendarPlus className="h-5 w-5 mr-2" />
              Add to Calendar
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
