'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  X,
  MapPin
} from 'lucide-react';
import { useLayoutStore } from '@/store/layoutStore';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';

interface LayoutSelectionBarProps {
  exhibition: ExhibitionWithStats;
}

export default function LayoutSelectionBar({ exhibition }: LayoutSelectionBarProps) {
  const {
    selectedStalls,
    clearSelection,
    getSelectedStallsTotal
  } = useLayoutStore();

  const selectedTotal = getSelectedStallsTotal();

  const handleBookNow = () => {
    if (selectedStalls.length > 0) {
      const stallIds = selectedStalls.map(stall => stall._id).join(',');
      window.location.href = `/exhibitions/${exhibition._id}/booking?stalls=${stallIds}`;
    }
  };

  // Only show when stalls are selected
  if (selectedStalls.length === 0) {
    return null;
  }

  return (
    <Card className="rounded-lg shadow-md border border-gray-200/50 bg-white/80 backdrop-blur-sm">
      <div className="px-4 sm:px-6 py-3 sm:py-3.5">
        {/* Selected stalls - compact horizontal layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          {/* Left side - Selection info and stalls */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-1.5 mr-2.5">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-blue-700 text-sm">Selection ({selectedStalls.length})</span>
                <p className="text-xs text-blue-600">Stalls selected</p>
              </div>
            </div>

            {/* Selected stalls horizontal list */}
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
              <div className="flex gap-2">
                {selectedStalls.slice(0, 4).map((stall) => (
                  <div 
                    key={stall._id} 
                    className="flex items-center bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1.5 rounded-md text-sm whitespace-nowrap shadow-sm"
                  >
                    <span className="font-semibold">{stall.stallNumber}</span>
                    <span className="mx-1.5 text-blue-400">•</span>
                    <span className="font-medium">₹{stall.price.toLocaleString()}</span>
                  </div>
                ))}
                {selectedStalls.length > 4 && (
                  <div className="flex items-center bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-md text-sm font-medium">
                    +{selectedStalls.length - 4} more
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Total and actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">
            <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 w-full sm:w-auto">
              <p className="text-xs font-medium text-green-600 uppercase tracking-wide">Total</p>
              <p className="font-bold text-lg text-green-700">₹{selectedTotal.toLocaleString()}</p>
            </div>
            
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={clearSelection} className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex-1 sm:flex-none text-xs px-3">
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
              <Button onClick={handleBookNow} size="sm" className="bg-blue-600 hover:bg-blue-700 px-4 flex-1 sm:flex-none text-xs">
                <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />
                Book Now ({selectedStalls.length})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
