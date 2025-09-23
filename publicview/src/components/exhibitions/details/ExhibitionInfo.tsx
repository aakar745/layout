import React from 'react';
import { Card } from '@/components/ui/card';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';

interface ExhibitionInfoProps {
  exhibition: ExhibitionWithStats;
}

export default function ExhibitionInfo({ exhibition }: ExhibitionInfoProps) {
  return (
    <Card className="p-8">
      <div className="space-y-6">
        {/* Main Title */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative">
            About This Exhibition
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-blue-600 rounded-full" />
          </h2>
        </div>

        {/* Main Description */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed text-lg">
            {exhibition.description}
          </p>
        </div>

        {/* Extended Description */}
        {exhibition.headerDescription && exhibition.headerDescription !== exhibition.description && (
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {exhibition.headerDescription}
            </p>
          </div>
        )}

        {/* Subtitle Section */}
        {exhibition.headerSubtitle && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {exhibition.headerSubtitle}
            </h3>
          </div>
        )}

        {/* Additional Info */}
        {exhibition.headerTitle && exhibition.headerTitle !== exhibition.name && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-medium text-blue-900 mb-2">
              Event Highlight
            </h4>
            <p className="text-blue-800">
              {exhibition.headerTitle}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
