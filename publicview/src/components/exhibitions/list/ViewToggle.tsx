'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, List, LayoutGrid } from 'lucide-react';

export type ViewType = 'list' | 'grid' | 'compact';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  totalCount: number;
}

export default function ViewToggle({ currentView, onViewChange, totalCount }: ViewToggleProps) {
  const views: { type: ViewType; icon: React.ReactNode; label: string; description: string }[] = [
    { 
      type: 'list', 
      icon: <List className="h-4 w-4" />, 
      label: 'List View',
      description: 'Detailed information in rows'
    },
    { 
      type: 'grid', 
      icon: <LayoutGrid className="h-4 w-4" />, 
      label: 'Grid View',
      description: 'Cards in a grid layout'
    },
    { 
      type: 'compact', 
      icon: <Grid3X3 className="h-4 w-4" />, 
      label: 'Compact View',
      description: 'Dense grid with essential info'
    },
  ];

  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center space-x-4">
        <div className="text-sm font-medium text-gray-900">
          View Options
        </div>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {views.map((view) => (
            <Button
              key={view.type}
              onClick={() => onViewChange(view.type)}
              variant={currentView === view.type ? 'default' : 'ghost'}
              size="sm"
              className={`
                h-8 px-3 rounded-md transition-all duration-200
                ${currentView === view.type 
                  ? 'bg-white shadow-sm text-blue-600 border border-blue-200' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              title={view.description}
            >
              {view.icon}
              <span className="ml-1.5 hidden sm:inline">{view.label.split(' ')[0]}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="hidden md:block">
          {totalCount} {totalCount === 1 ? 'exhibition' : 'exhibitions'}
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs">Live updates</span>
        </div>
      </div>
    </div>
  );
}
