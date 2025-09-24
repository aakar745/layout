import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Building2, Layout } from 'lucide-react';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';

interface LayoutBreadcrumbProps {
  exhibition: ExhibitionWithStats;
}

export default function LayoutBreadcrumb({ exhibition }: LayoutBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 overflow-x-auto">
      <Link 
        href="/" 
        className="flex items-center hover:text-blue-600 transition-colors flex-shrink-0"
      >
        <Home className="h-3 w-3 sm:h-4 sm:w-4" />
      </Link>
      
      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
      
      <Link 
        href="/exhibitions" 
        className="hover:text-blue-600 transition-colors flex-shrink-0 hidden sm:inline"
      >
        Exhibitions
      </Link>
      
      {/* Mobile: Skip "Exhibitions" step */}
      <span className="sm:hidden text-gray-400">...</span>
      
      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
      
      <Link 
        href={`/exhibitions/${exhibition._id}`}
        className="hover:text-blue-600 transition-colors truncate max-w-[100px] sm:max-w-[200px]"
        title={exhibition.name}
      >
        {exhibition.name}
      </Link>
      
      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
      
      <div className="flex items-center space-x-1 text-gray-900 font-medium flex-shrink-0">
        <Layout className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Interactive Layout</span>
        <span className="sm:hidden">Layout</span>
      </div>
    </nav>
  );
}
