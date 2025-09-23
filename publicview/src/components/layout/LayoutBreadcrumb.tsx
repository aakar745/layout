import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Building2, Layout } from 'lucide-react';
import { ExhibitionWithStats } from '@/lib/types/exhibitions';

interface LayoutBreadcrumbProps {
  exhibition: ExhibitionWithStats;
}

export default function LayoutBreadcrumb({ exhibition }: LayoutBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link 
        href="/" 
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      <ChevronRight className="h-4 w-4 text-gray-400" />
      
      <Link 
        href="/exhibitions" 
        className="hover:text-blue-600 transition-colors"
      >
        Exhibitions
      </Link>
      
      <ChevronRight className="h-4 w-4 text-gray-400" />
      
      <Link 
        href={`/exhibitions/${exhibition._id}`}
        className="hover:text-blue-600 transition-colors line-clamp-1"
      >
        {exhibition.name}
      </Link>
      
      <ChevronRight className="h-4 w-4 text-gray-400" />
      
      <div className="flex items-center space-x-1 text-gray-900 font-medium">
        <Layout className="h-4 w-4" />
        <span>Interactive Layout</span>
      </div>
    </nav>
  );
}
