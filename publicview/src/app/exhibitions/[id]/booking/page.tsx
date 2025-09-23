import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookingPageClient from '@/components/booking/BookingPageClient';
import { getExhibition } from '@/lib/api/exhibitions';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    stalls?: string;
  }>;
}

// Generate dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const exhibition = await getExhibition(id);
    
    return {
      title: `Book Stalls - ${exhibition.name} | Secure Your Space`,
      description: `Complete your stall booking for ${exhibition.name}. Secure checkout with multiple payment options.`,
      keywords: `${exhibition.name}, stall booking, exhibition booking, secure payment`,
      robots: {
        index: false, // Don't index booking pages
        follow: false,
      },
    };
  } catch (error) {
    return {
      title: 'Complete Your Booking | Exhibition Management',
      description: 'Complete your stall booking with our secure checkout process.',
    };
  }
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  let exhibition: ExhibitionWithStats | null = null;
  let error: string | null = null;

  try {
    exhibition = await getExhibition(id);
  } catch (err) {
    console.error(`Failed to fetch exhibition ${id}:`, err);
    
    // If exhibition doesn't exist, show 404
    if (err instanceof Error && err.message.includes('404')) {
      notFound();
    }
    
    error = err instanceof Error ? err.message : 'Failed to load exhibition';
  }

  if (!exhibition && !error) {
    notFound();
  }

  // Parse selected stall IDs from URL
  const selectedStallIds = resolvedSearchParams.stalls 
    ? resolvedSearchParams.stalls.split(',').filter(Boolean)
    : [];
    
  console.log('🔍 [BOOKING PAGE] URL stalls param:', resolvedSearchParams.stalls);
  console.log('🔍 [BOOKING PAGE] Parsed selectedStallIds:', selectedStallIds);

  if (selectedStallIds.length === 0) {
    // Redirect back to layout if no stalls selected
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            No Stalls Selected
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Please select stalls from the layout before proceeding with booking.
          </p>
          <a
            href={`/exhibitions/${id}/layout`}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Layout
          </a>
        </div>
      </div>
    );
  }

  return (
    <BookingPageClient 
      exhibition={exhibition!}
      selectedStallIds={selectedStallIds}
      error={error}
    />
  );
}
