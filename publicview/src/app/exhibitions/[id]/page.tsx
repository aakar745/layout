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
    const exhibitions = await getExhibitions();
    // Generate static pages for the first 10 exhibitions
    return exhibitions.slice(0, 10).map((exhibition) => ({
      id: exhibition.slug || exhibition._id,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
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
    return {
      title: 'Exhibition Not Found',
      description: 'The requested exhibition could not be found.',
    };
  }
}

export default async function ExhibitionDetailsPage({ params }: Props) {
  const { id } = await params;
  let exhibition: ExhibitionWithStats | null = null;
  let error: string | null = null;

  try {
    exhibition = await getExhibition(id);
  } catch (err) {
    console.error(`Failed to fetch exhibition ${id}:`, err);
    
    // If it's a 404, show the not found page
    if (err instanceof Error && err.message.includes('404')) {
      notFound();
    }
    
    error = err instanceof Error ? err.message : 'Failed to load exhibition';
  }

  // If no exhibition and no error (shouldn't happen, but just in case)
  if (!exhibition && !error) {
    notFound();
  }

  return (
    <ExhibitionDetailsClient 
      exhibition={exhibition}
      error={error}
    />
  );
}
