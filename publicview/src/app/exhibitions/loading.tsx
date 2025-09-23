import { ExhibitionListSkeleton } from '@/components/exhibitions/shared/ExhibitionSkeleton';

export default function ExhibitionsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg w-96 mx-auto" />
            <div className="h-6 bg-gray-200 rounded-lg w-full max-w-3xl mx-auto" />
            <div className="h-6 bg-gray-200 rounded-lg w-2/3 max-w-2xl mx-auto" />
            
            {/* Stats Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="space-y-4 mb-8">
          <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse" />
          <div className="flex space-x-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Exhibition Grid Skeleton */}
        <ExhibitionListSkeleton count={6} />
      </div>
    </div>
  );
}
