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

export default function LayoutPage({ params }: Props) {
  // Move API calls to client-side to prevent ECONNREFUSED errors during build
  const exhibition: ExhibitionWithStats | null = null;
  const layout: Layout | null = null;
  const error: string | null = null;

  // Always show the layout client component which will handle API calls client-side
  return (
    <LayoutViewer 
      exhibition={null}
      layout={null}
      error={null}
    />
  );
}
