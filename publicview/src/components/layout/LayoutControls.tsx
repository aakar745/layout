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
  Ruler,
  Hash,
  Building2,
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
    updateViewConfig({ showHallGrids: !viewConfig.showHallGrids });
  };

  const toggleStallNumbers = () => {
    updateViewConfig({ showStallNumbers: !viewConfig.showStallNumbers });
  };

  const toggleDimensions = () => {
    updateViewConfig({ showDimensions: !viewConfig.showDimensions });
  };

  const toggleFixtures = () => {
    updateViewConfig({ showFixtures: !viewConfig.showFixtures });
  };

  const selectedTotal = getSelectedStallsTotal();

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          {/* Zoom Controls - Mobile optimized */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <div className="flex items-center bg-gray-100 rounded-lg touch-manipulation">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                className="rounded-r-none px-2 sm:px-3 h-9 sm:h-8 touch-manipulation active:scale-95"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <div className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium min-w-[50px] sm:min-w-[60px] text-center bg-white border-y border-gray-200">
                {(canvas.scale * 100).toFixed(0)}%
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                className="rounded-l-none px-2 sm:px-3 h-9 sm:h-8 touch-manipulation active:scale-95"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitToScreen}
              title="Fit to screen"
              className="px-2 sm:px-3"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>

          {/* View Options - Mobile optimized */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto w-full sm:w-auto">
            <Button
              variant={viewConfig.showHallGrids ? "default" : "outline"}
              size="sm"
              onClick={toggleGrid}
              title="Toggle hall grids"
              className="px-2 sm:px-3 flex-shrink-0"
            >
              <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant={viewConfig.showStallNumbers ? "default" : "outline"}
              size="sm"
              onClick={toggleStallNumbers}
              title="Toggle stall numbers"
              className="px-2 sm:px-3 flex-shrink-0"
            >
              <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant={viewConfig.showDimensions ? "default" : "outline"}
              size="sm"
              onClick={toggleDimensions}
              title="Toggle dimensions (width x height)"
              className="px-2 sm:px-3 flex-shrink-0"
            >
              <Ruler className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant={viewConfig.showFixtures ? "default" : "outline"}
              size="sm"
              onClick={toggleFixtures}
              title="Toggle fixtures (stages, pillars, displays)"
              className="px-2 sm:px-3 flex-shrink-0"
            >
              <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>

          {/* Selection Info - Mobile optimized */}
          {selectedStalls.length > 0 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <div className="text-xs sm:text-sm">
                <span className="font-medium">{selectedStalls.length}</span> stalls selected
              </div>
              
              <div className="flex items-center space-x-2">
                {selectedTotal > 0 && (
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    ₹{selectedTotal.toLocaleString()}
                  </Badge>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  className="px-2 sm:px-3 text-xs sm:text-sm"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Legend - Mobile optimized */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-2 sm:w-4 sm:h-3 bg-green-100 border border-green-500 rounded"></div>
              <span className="text-xs">Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-2 sm:w-4 sm:h-3 bg-red-100 border border-red-500 rounded"></div>
              <span className="text-xs">Booked</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-2 sm:w-4 sm:h-3 bg-yellow-100 border border-yellow-500 rounded"></div>
              <span className="text-xs">Reserved</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-2 sm:w-4 sm:h-3 bg-gray-100 border border-gray-500 rounded"></div>
              <span className="text-xs">Unavailable</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-2 sm:w-4 sm:h-3 bg-blue-500 border border-blue-700 rounded"></div>
              <span className="text-xs">Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
