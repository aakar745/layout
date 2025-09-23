import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import LayoutViewer from '@/components/layout/LayoutViewer';
import { getExhibition } from '@/lib/api/exhibitions';
import { getExhibitionLayout } from '@/lib/api/layout';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';
import { Layout } from '@/lib/types/layout';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const exhibition = await getExhibition(id);
    
    return {
      title: `${exhibition.name} - Interactive Layout | Book Your Stall`,
      description: `Explore the interactive layout of ${exhibition.name}. View available stalls, select your preferred location, and book directly online.`,
      keywords: `${exhibition.name}, stall layout, interactive map, stall booking, exhibition floor plan`,
      openGraph: {
        title: `${exhibition.name} - Interactive Layout`,
        description: `Explore available stalls and book your space at ${exhibition.name}`,
        type: 'website',
        images: exhibition.headerLogo ? [
          {
            url: exhibition.headerLogo,
            width: 1200,
            height: 630,
            alt: `${exhibition.name} layout`,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${exhibition.name} - Interactive Layout`,
        description: `Explore available stalls and book your space at ${exhibition.name}`,
        images: exhibition.headerLogo ? [exhibition.headerLogo] : [],
      },
    };
  } catch (error) {
    console.warn('Failed to generate layout metadata, using fallback:', error);
    return {
      title: 'Exhibition Layout | Interactive Stall Booking',
      description: 'Explore the interactive exhibition layout and book your stall online.',
    };
  }
}

export default async function LayoutPage({ params }: Props) {
  const { id } = await params;
  let exhibition: ExhibitionWithStats | null = null;
  let layout: Layout | null = null;
  let error: string | null = null;

  try {
    // Fetch exhibition and layout data in parallel
    const [exhibitionData, layoutData] = await Promise.allSettled([
      getExhibition(id),
      getExhibitionLayout(id)
    ]);

    if (exhibitionData.status === 'fulfilled') {
      exhibition = exhibitionData.value;
    } else {
      console.error('Failed to fetch exhibition:', exhibitionData.reason);
    }

    if (layoutData.status === 'fulfilled') {
      layout = layoutData.value;
    } else {
      console.error('Failed to fetch layout:', layoutData.reason);
      // Layout might not exist for all exhibitions
    }

    // If exhibition doesn't exist, show 404
    if (!exhibition) {
      notFound();
    }

  } catch (err) {
    console.error(`Failed to fetch data for exhibition ${id}:`, err);
    error = err instanceof Error ? err.message : 'Failed to load exhibition data';
  }

  // If no layout available, show message
  if (exhibition && !layout && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🏗️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Layout Coming Soon
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The interactive layout for <strong>{exhibition.name}</strong> is currently being prepared. 
              Please check back later or contact us for more information.
            </p>
            <div className="space-y-4">
              <Link
                href={`/exhibitions/${id}`}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-4"
              >
                Back to Exhibition Details
              </Link>
              <Link
                href="/exhibitions"
                className="inline-block px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse Other Exhibitions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LayoutViewer 
      exhibition={exhibition!}
      layout={layout!}
      error={error}
    />
  );
}
