import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ExhibitionDetailsClient from '@/components/exhibitions/details/ExhibitionDetailsClient';
import { getExhibition, getExhibitions } from '@/lib/api/exhibitions';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

// Generate static params for popular exhibitions (optional optimization)
export async function generateStaticParams() {
  try {
    // Only generate static params in production and when API is accessible
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    
    const exhibitions = await getExhibitions();
    // Generate static pages for the first 10 exhibitions
    return exhibitions.slice(0, 10).map((exhibition) => ({
      id: exhibition.slug || exhibition._id,
    }));
  } catch (error) {
    console.warn('API not accessible during build, skipping static generation:', error instanceof Error ? error.message : error);
    return [];
  }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const exhibition = await getExhibition(id);
    
    return {
      title: `${exhibition.name} | Exhibition Details`,
      description: exhibition.description,
      keywords: `${exhibition.name}, exhibition, trade show, business event, ${exhibition.venue}`,
      openGraph: {
        title: exhibition.name,
        description: exhibition.description,
        type: 'website',
        images: exhibition.headerLogo ? [
          {
            url: exhibition.headerLogo,
            width: 1200,
            height: 630,
            alt: exhibition.name,
          }
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: exhibition.name,
        description: exhibition.description,
        images: exhibition.headerLogo ? [exhibition.headerLogo] : [],
      },
    };
  } catch (error) {
    console.warn('Failed to generate metadata, using fallback:', error);
    return {
      title: 'Exhibition Details | Exhibition Management System',
      description: 'View exhibition details and book your stalls.',
    };
  }
}

export default function ExhibitionDetailsPage({ params }: Props) {
  // Move API calls to client-side to prevent ECONNREFUSED errors during build
  const exhibition: ExhibitionWithStats | null = null;
  const error: string | null = null;

  return (
    <ExhibitionDetailsClient 
      exhibition={exhibition}
      error={error}
    />
  );
}
