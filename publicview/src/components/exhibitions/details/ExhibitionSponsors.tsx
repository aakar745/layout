import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { getImageUrl } from '@/lib/api/exhibitions';

interface ExhibitionSponsorsProps {
  sponsors: string[];
}

export default function ExhibitionSponsors({ sponsors }: ExhibitionSponsorsProps) {
  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <Card className="p-8 mb-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-4">
          <div className="flex-1 h-px bg-gray-300" />
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Proudly Sponsored By
          </h3>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {sponsors.map((sponsor, index) => {
          const imageUrl = getImageUrl(sponsor, 'sponsor');
          
          return (
            <div 
              key={index}
              className="group relative aspect-[3/2] bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-md overflow-hidden"
            >
              <Image
                src={imageUrl}
                alt={`Sponsor ${index + 1}`}
                fill
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
