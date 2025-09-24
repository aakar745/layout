'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { Exhibition } from '@/lib/types/exhibitions';
import { getExhibitions, getImageUrl } from '@/lib/api/exhibitions';
import { getExhibitionStatus, calculateDaysInfo } from '@/lib/utils/exhibitions';

export default function FeaturedExhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        // Bypass cache for client-side calls to get fresh data
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/public/exhibitions?t=${Date.now()}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store', // Always fetch fresh data for homepage
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const allExhibitions = await response.json() as Exhibition[];
        
        
        // Filter for upcoming exhibitions - public API only returns published/active exhibitions
        const upcomingExhibitions = allExhibitions
          .filter((exhibition: Exhibition) => {
            // Use same status logic as exhibition page
            const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
            return status.status === 'upcoming';
          })
          .sort((a: Exhibition, b: Exhibition) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
          .slice(0, 6);+
          

        setExhibitions(upcomingExhibitions);
      } catch (error) {
        console.error('Failed to fetch exhibitions:', error);
        // Keep empty array on error, component will show empty state
        setExhibitions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntil = (startDate: string, endDate: string) => {
    const daysInfo = calculateDaysInfo(startDate, endDate);
    return daysInfo.isActive ? 0 : daysInfo.count;
  };

  const handleImageError = (exhibitionId: string) => {
    setImageErrors(prev => new Set(prev).add(exhibitionId));
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Badge variant="secondary" className="mb-3 sm:mb-4 text-xs sm:text-sm">
            Featured Events
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
            Upcoming
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Exhibitions
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
            Don't miss out on these exciting opportunities to showcase your business 
            and connect with potential customers across India.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="p-4 sm:p-6 animate-pulse rounded-md">
                <div className="h-40 sm:h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        )}

        {/* Exhibitions Grid */}
        {!loading && exhibitions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {exhibitions.map((exhibition) => {
              const daysUntil = getDaysUntil(exhibition.startDate, exhibition.endDate);
              
              return (
                <Card 
                  key={exhibition._id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md rounded-md"
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-200">
                    {exhibition.headerLogo && !imageErrors.has(exhibition._id) ? (
                      <img
                        src={getImageUrl(exhibition.headerLogo, 'background')}
                        alt={exhibition.name}
                        className="absolute inset-0 w-full h-full object-contain object-center"
                        onError={() => handleImageError(exhibition._id)}
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 z-10"></div>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      {daysUntil > 0 && (
                        <Badge className="bg-white/90 text-blue-600 hover:bg-white text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {daysUntil} days
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white pr-2">
                      <h3 className="text-lg sm:text-xl font-bold mb-1 text-shadow-sm leading-tight">{exhibition.name}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <p className="text-gray-600 mb-3 sm:mb-4 line-clamp-2 text-sm sm:text-base leading-relaxed">
                      {exhibition.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}</span>
                      </div>
                      <div className="flex items-center text-xs sm:text-sm text-gray-500">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-red-500 flex-shrink-0" />
                        <span className="truncate">{exhibition.venue}</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <Button asChild className="w-full text-sm sm:text-base">
                      <Link href={`/exhibitions/${exhibition._id}`}>
                        View Details
                        <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && exhibitions.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">🎪</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No Upcoming Exhibitions
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                We're working on bringing you exciting new exhibitions. 
                Check back soon or explore our complete exhibitions list.
              </p>
              <Button asChild variant="outline" className="text-sm sm:text-base">
                <Link href="/exhibitions">
                  Browse All Exhibitions
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* View All CTA */}
        {!loading && exhibitions.length > 0 && (
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/exhibitions">
                View All Exhibitions
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
