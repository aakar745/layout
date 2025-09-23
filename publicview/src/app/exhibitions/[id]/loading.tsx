import { ExhibitionDetailsSkeleton } from '@/components/exhibitions/shared/ExhibitionSkeleton';

export default function ExhibitionDetailsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExhibitionDetailsSkeleton />
      </div>
    </div>
  );
}
