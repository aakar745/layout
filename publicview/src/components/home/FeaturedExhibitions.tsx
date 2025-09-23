'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { Exhibition } from '@/lib/types';
import { exhibitionApi } from '@/lib/api';

export default function FeaturedExhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        // For demo purposes, using mock data
        // In real implementation, uncomment the line below:
        // const response = await exhibitionApi.getFeaturedExhibitions(6);
        
        // Mock data for demonstration
        const mockExhibitions: Exhibition[] = [
          {
            _id: '1',
            name: 'India Tech Expo 2025',
            description: 'Showcase cutting-edge technology solutions and innovations from leading tech companies across India.',
            venue: 'Pragati Maidan, New Delhi',
            startDate: '2025-03-15',
            endDate: '2025-03-18',
            headerLogo: '/exhibitions/tech-expo.jpg',
            status: 'published',
            isActive: true
          },
          {
            _id: '2',
            name: 'Mumbai Business Summit',
            description: 'Connect with industry leaders and explore business opportunities in Mumbai\'s thriving commercial landscape.',
            venue: 'Bombay Exhibition Centre, Mumbai',
            startDate: '2025-04-20',
            endDate: '2025-04-23',
            headerLogo: '/exhibitions/business-summit.jpg',
            status: 'published',
            isActive: true
          },
          {
            _id: '3',
            name: 'South India Trade Fair',
            description: 'Premier trade fair showcasing products and services from across South India\'s diverse industries.',
            venue: 'HITEX, Hyderabad',
            startDate: '2025-05-10',
            endDate: '2025-05-13',
            headerLogo: '/exhibitions/trade-fair.jpg',
            status: 'published',
            isActive: true
          }
        ];
        
        setExhibitions(mockExhibitions);
      } catch (error) {
        console.error('Failed to fetch exhibitions:', error);
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

  const getDaysUntil = (startDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Featured Events
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Upcoming
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Exhibitions
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't miss out on these exciting opportunities to showcase your business 
            and connect with potential customers across India.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </Card>
            ))}
          </div>
        )}

        {/* Exhibitions Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {exhibitions.map((exhibition) => {
              const daysUntil = getDaysUntil(exhibition.startDate);
              
              return (
                <Card 
                  key={exhibition._id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                    {/* Placeholder gradient since we don't have actual images */}
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                      {daysUntil > 0 && (
                        <Badge className="bg-white/90 text-blue-600 hover:bg-white">
                          <Clock className="h-3 w-3 mr-1" />
                          {daysUntil} days
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{exhibition.name}</h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {exhibition.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                        {formatDate(exhibition.startDate)} - {formatDate(exhibition.endDate)}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2 text-red-500" />
                        {exhibition.venue}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button asChild className="w-full">
                      <Link href={`/exhibitions/${exhibition._id}`}>
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/exhibitions">
              View All Exhibitions
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
