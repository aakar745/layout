'use client';

import React, { useState, useMemo } from 'react';
import { Exhibition } from '@/lib/types/exhibitions';
import { filterExhibitions, sortExhibitions } from '@/lib/utils/exhibitions';
import ExhibitionGrid from './ExhibitionGrid';
import ExhibitionFilters from './ExhibitionFilters';

interface ExhibitionListClientProps {
  initialExhibitions: Exhibition[];
  initialError: string | null;
  exhibitionCounts: {
    total: number;
    upcoming: number;
    active: number;
    completed: number;
  };
}

export default function ExhibitionListClient({
  initialExhibitions,
  initialError,
  exhibitionCounts
}: ExhibitionListClientProps) {
  const [filters, setFilters] = useState({
    status: 'all' as const,
    search: ''
  });

  // Filter and sort exhibitions
  const filteredExhibitions = useMemo(() => {
    let filtered = filterExhibitions(initialExhibitions, filters);
    
    // Sort by date (upcoming first, then active, then completed)
    filtered = sortExhibitions(filtered, 'date', 'asc');
    
    return filtered;
  }, [initialExhibitions, filters]);

  // Update counts based on current filter
  const currentCounts = useMemo(() => {
    if (filters.search.trim() || filters.status !== 'all') {
      const searchFiltered = filterExhibitions(initialExhibitions, { search: filters.search });
      return {
        ...exhibitionCounts,
        total: searchFiltered.length,
        // Note: We keep the original counts for status filters to show total available
      };
    }
    return exhibitionCounts;
  }, [initialExhibitions, filters, exhibitionCounts]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <ExhibitionFilters
        onFiltersChange={setFilters}
        exhibitionCounts={currentCounts}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {filters.search || filters.status !== 'all' ? (
            <>
              Showing <span className="font-semibold">{filteredExhibitions.length}</span> of{' '}
              <span className="font-semibold">{initialExhibitions.length}</span> exhibitions
              {filters.search && (
                <span> matching "{filters.search}"</span>
              )}
              {filters.status !== 'all' && (
                <span> · {filters.status} events</span>
              )}
            </>
          ) : (
            <>
              Showing <span className="font-semibold">{filteredExhibitions.length}</span> exhibitions
            </>
          )}
        </div>
      </div>

      {/* Exhibition Grid */}
      <ExhibitionGrid
        exhibitions={filteredExhibitions}
        loading={false}
        error={initialError}
      />

      {/* Empty State for Filtered Results */}
      {!initialError && filteredExhibitions.length === 0 && initialExhibitions.length > 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No exhibitions match your criteria
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find more results.
            </p>
            <button
              onClick={() => setFilters({ status: 'all', search: '' })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
