'use client';

import React from 'react';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { ExhibitionDetailsSkeleton } from '../shared/ExhibitionSkeleton';
import ExhibitionHero from './ExhibitionHero';
import ExhibitionStats from './ExhibitionStats';
import ExhibitionInfo from './ExhibitionInfo';
import ExhibitionServiceCharges from './ExhibitionServiceCharges';
import ExhibitionSponsors from './ExhibitionSponsors';
import ExhibitionBreadcrumb from './ExhibitionBreadcrumb';

interface ExhibitionDetailsClientProps {
  exhibition: ExhibitionWithStats | null;
  error: string | null;
}

export default function ExhibitionDetailsClient({
  exhibition,
  error
}: ExhibitionDetailsClientProps) {
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Exhibition Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The exhibition you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/exhibitions"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Exhibitions
          </a>
        </div>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ExhibitionDetailsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb - contained */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ExhibitionBreadcrumb exhibition={exhibition} />
      </div>

      {/* Hero Section - Full Width */}
      <ExhibitionHero exhibition={exhibition} />

      {/* Content Section - contained */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div className="mb-16">
          <ExhibitionStats exhibition={exhibition} />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ExhibitionInfo exhibition={exhibition} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Key Information Card - moved to sidebar for better layout */}
            <ExhibitionStats exhibition={exhibition} compact />
          </div>
        </div>

        {/* Sponsors Section */}
        {exhibition.sponsorLogos && exhibition.sponsorLogos.length > 0 && (
          <ExhibitionSponsors sponsors={exhibition.sponsorLogos} />
        )}

        {/* Service Charges Section */}
        <ExhibitionServiceCharges exhibition={exhibition} />
      </div>
    </div>
  );
}
