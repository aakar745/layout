import React from 'react';
import { Card } from '@/components/ui/card';

export function ExhibitionCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        {/* Image Section Skeleton */}
        <div className="bg-gray-200 h-48 md:h-auto min-h-[200px]">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
        </div>

        {/* Content Section Skeleton */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded-md w-3/4" />
            <div className="h-6 bg-gray-200 rounded-md w-1/2" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-28" />
            </div>
          </div>

          {/* Button */}
          <div className="h-10 bg-gray-200 rounded-md w-full" />
        </div>
      </div>
    </Card>
  );
}

export function ExhibitionListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ExhibitionCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ExhibitionDetailsSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-32" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="relative h-96 bg-gray-300 rounded-lg mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 animate-pulse rounded-lg" />
        <div className="absolute bottom-8 left-8 space-y-4">
          <div className="h-10 bg-white/20 rounded w-72" />
          <div className="h-6 bg-white/20 rounded w-96" />
          <div className="flex space-x-4 mt-6">
            <div className="h-12 bg-white/20 rounded w-32" />
            <div className="h-12 bg-white/20 rounded w-28" />
          </div>
        </div>
      </div>

      {/* Stats Section Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-lg" />
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-8">
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-32" />
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-32" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
