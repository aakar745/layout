'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  X
} from 'lucide-react';
import { useLayoutStore } from '@/store/layoutStore';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';

interface LayoutSidebarProps {
  exhibition: ExhibitionWithStats;
}

export default function LayoutSidebar({ exhibition }: LayoutSidebarProps) {
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

  return (
    <div className="space-y-6">
      {/* Selection Card */}
      <Card>
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              Selection ({selectedStalls.length})
            </span>
          </div>
        </div>

        <div className="p-4">
          <SelectionTab
            selectedStalls={selectedStalls}
            selectedTotal={selectedTotal}
            onClearSelection={clearSelection}
            onBookNow={handleBookNow}
          />
        </div>
      </Card>
    </div>
  );
}

// Selection Tab Component
function SelectionTab({ 
  selectedStalls, 
  selectedTotal, 
  onClearSelection, 
  onBookNow 
}: {
  selectedStalls: any[];
  selectedTotal: number;
  onClearSelection: () => void;
  onBookNow: () => void;
}) {
  if (selectedStalls.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No stalls selected</p>
        <p className="text-xs mt-1">Click on available stalls to select them</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Selected Stalls</h4>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {selectedStalls.map((stall) => (
          <div key={stall._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="font-medium text-sm">{stall.stallNumber}</div>
              <div className="text-xs text-gray-500">
                {stall.dimensions.width}×{stall.dimensions.height}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-sm">₹{stall.price.toLocaleString()}</div>
              {stall.category && (
                <Badge variant="outline" className="text-xs">
                  {stall.category}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium">Total:</span>
          <span className="font-bold text-lg">₹{selectedTotal.toLocaleString()}</span>
        </div>
        
        <Button 
          onClick={onBookNow} 
          className="w-full"
          size="lg"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Book Now ({selectedStalls.length} stalls)
        </Button>
      </div>
    </div>
  );
}
