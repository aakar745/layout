'use client';

import React, { useState } from 'react';
import { Exhibition } from '@/lib/types/exhibitions';
import ExhibitionCard from '../shared/ExhibitionCard';
import ExhibitionListView from './ExhibitionListView';
import ExhibitionCompactView from './ExhibitionCompactView';
import ViewToggle, { ViewType } from './ViewToggle';
import { ExhibitionListSkeleton } from '../shared/ExhibitionSkeleton';

interface ExhibitionGridProps {
  exhibitions: Exhibition[];
  loading?: boolean;
  error?: string | null;
}

export default function ExhibitionGrid({ 
  exhibitions, 
  loading = false,
  error = null 
}: ExhibitionGridProps) {
  const [currentView, setCurrentView] = useState<ViewType>('list');

  // Render view toggle and current view
  const renderContent = () => {
    const commonProps = { exhibitions, loading, error };

    switch (currentView) {
      case 'list':
        return <ExhibitionListView {...commonProps} />;
      case 'compact':
        return <ExhibitionCompactView {...commonProps} />;
      case 'grid':
      default:
        if (loading) {
          return <ExhibitionListSkeleton count={6} />;
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exhibitions.map((exhibition, index) => (
              <ExhibitionCard
                key={exhibition._id}
                exhibition={exhibition}
                priority={index < 3} // Prioritize first 3 images for faster loading
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <ViewToggle 
        currentView={currentView}
        onViewChange={setCurrentView}
        totalCount={exhibitions.length}
      />

      {/* Content */}
      {renderContent()}
    </div>
  );
}
