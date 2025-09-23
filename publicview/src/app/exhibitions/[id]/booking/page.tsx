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
    
    // Don't make API call during build to prevent ECONNREFUSED errors
    if (process.env.NODE_ENV !== 'production') {
      return {
        title: 'Complete Your Booking | Exhibition Management',
        description: 'Complete your stall booking with our secure checkout process.',
        robots: {
          index: false,
          follow: false,
        },
      };
    }
    
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
    console.warn('Failed to generate booking metadata, using fallback:', error);
    return {
      title: 'Complete Your Booking | Exhibition Management',
      description: 'Complete your stall booking with our secure checkout process.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  
  // Move API calls to client-side to prevent ECONNREFUSED errors during build
  const exhibition: ExhibitionWithStats | null = null;
  const error: string | null = null;

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
