import { Metadata } from 'next';
import ExhibitionListClient from '@/components/exhibitions/list/ExhibitionListClient';
import { getExhibitions } from '@/lib/api/exhibitions';
import { getExhibitionsSummary } from '@/lib/utils/exhibitions';
import { Exhibition } from '@/lib/types/exhibitions';

export const metadata: Metadata = {
  title: 'Exhibitions | Find Your Perfect Event',
  description: 'Discover upcoming trade shows, exhibitions, and business events across India. Book your stall space and grow your business.',
  keywords: 'exhibitions, trade shows, business events, stall booking, India',
  openGraph: {
    title: 'Exhibitions | Find Your Perfect Event',
    description: 'Discover upcoming trade shows, exhibitions, and business events across India.',
    type: 'website',
  },
};

export default function ExhibitionsPage() {
  // Move API calls to client-side to prevent ECONNREFUSED errors during build
  const exhibitions: Exhibition[] = [];
  const error: string | null = null;

  // Summary with no data initially - will be updated client-side
  const summary = {
    total: 0,
    upcoming: 0, 
    active: 0,
    completed: 0
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-24">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Amazing
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Exhibitions
            </span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Explore trade shows, business events, and exhibitions happening across India. 
            Find the perfect opportunity to showcase your products and grow your business.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.total}</div>
              <div className="text-sm text-gray-500">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{summary.upcoming}</div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summary.active}</div>
              <div className="text-sm text-gray-500">Active Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{summary.completed}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Client Component for Interactive Features */}
        <ExhibitionListClient 
          initialExhibitions={exhibitions}
          initialError={error}
          exhibitionCounts={summary}
        />
      </div>
    </div>
  );
}
