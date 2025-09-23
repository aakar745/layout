'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Grid3X3, 
  Eye, 
  EyeOff,
  DollarSign,
  Hash,
  MapPin,
  Palette
} from 'lucide-react';
import { useLayoutStore } from '@/store/layoutStore';

export default function LayoutControls() {
  const {
    canvas,
    viewConfig,
    selectedStalls,
    setScale,
    updateViewConfig,
    clearSelection,
    getSelectedStallsTotal
  } = useLayoutStore();

  const handleZoomIn = () => {
    setScale(Math.min(canvas.scale * 1.15, 20)); // Match LayoutCanvas zoom factor and max scale
  };

  const handleZoomOut = () => {
    setScale(Math.max(canvas.scale / 1.15, 0.1)); // Match LayoutCanvas zoom factor and min scale
  };

  const handleFitToScreen = () => {
    // Trigger the keyboard shortcut to activate fitToCanvas in LayoutCanvas
    const event = new KeyboardEvent('keydown', {
      key: '0',
      ctrlKey: true,
      bubbles: true
    });
    window.dispatchEvent(event);
  };

  const toggleGrid = () => {
    updateViewConfig({ showGrid: !viewConfig.showGrid });
  };

  const toggleStallNumbers = () => {
    updateViewConfig({ showStallNumbers: !viewConfig.showStallNumbers });
  };

  const togglePrices = () => {
    updateViewConfig({ showPrices: !viewConfig.showPrices });
  };

  const toggleAmenities = () => {
    updateViewConfig({ showAmenities: !viewConfig.showAmenities });
  };

  const selectedTotal = getSelectedStallsTotal();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="rounded-r-none"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <div className="px-3 py-1 text-sm font-medium min-w-[60px] text-center">
                {(canvas.scale * 100).toFixed(0)}%
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="rounded-l-none"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitToScreen}
              title="Fit to screen (Ctrl+0)"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>

          {/* View Options */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewConfig.showGrid ? "default" : "outline"}
              size="sm"
              onClick={toggleGrid}
              title="Toggle grid"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>

            <Button
              variant={viewConfig.showStallNumbers ? "default" : "outline"}
              size="sm"
              onClick={toggleStallNumbers}
              title="Toggle stall numbers"
            >
              <Hash className="h-4 w-4" />
            </Button>

            <Button
              variant={viewConfig.showPrices ? "default" : "outline"}
              size="sm"
              onClick={togglePrices}
              title="Toggle prices"
            >
              <DollarSign className="h-4 w-4" />
            </Button>

            <Button
              variant={viewConfig.showAmenities ? "default" : "outline"}
              size="sm"
              onClick={toggleAmenities}
              title="Toggle amenities"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>

          {/* Selection Info */}
          {selectedStalls.length > 0 && (
            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <span className="font-medium">{selectedStalls.length}</span> stalls selected
              </div>
              
              {selectedTotal > 0 && (
                <Badge variant="secondary" className="text-sm">
                  ₹{selectedTotal.toLocaleString()}
                </Badge>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-3 bg-green-100 border border-green-500 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-3 bg-red-100 border border-red-500 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-3 bg-yellow-100 border border-yellow-500 rounded"></div>
              <span>Reserved</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-3 bg-gray-100 border border-gray-500 rounded"></div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-3 bg-blue-500 border border-blue-700 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
