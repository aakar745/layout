'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Calendar, Clock, CheckCircle } from 'lucide-react';

interface FilterOptions {
  status: 'all' | 'upcoming' | 'active' | 'completed';
  search: string;
}

interface ExhibitionFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  exhibitionCounts: {
    total: number;
    upcoming: number;
    active: number;
    completed: number;
  };
}

export default function ExhibitionFilters({ 
  onFiltersChange, 
  exhibitionCounts 
}: ExhibitionFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    search: ''
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFiltersChange]);

  const handleStatusChange = (status: FilterOptions['status']) => {
    setFilters(prev => ({ ...prev, status }));
    setShowMobileFilters(false);
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const clearFilters = () => {
    setFilters({ status: 'all', search: '' });
  };

  const statusFilters = [
    {
      key: 'all' as const,
      label: 'All Events',
      count: exhibitionCounts.total,
      icon: null,
      color: 'text-gray-600'
    },
    {
      key: 'upcoming' as const,
      label: 'Upcoming',
      count: exhibitionCounts.upcoming,
      icon: <Clock className="h-3 w-3" />,
      color: 'text-purple-600'
    },
    {
      key: 'active' as const,
      label: 'Active Now',
      count: exhibitionCounts.active,
      icon: <Calendar className="h-3 w-3" />,
      color: 'text-green-600'
    },
    {
      key: 'completed' as const,
      label: 'Completed',
      count: exhibitionCounts.completed,
      icon: <CheckCircle className="h-3 w-3" />,
      color: 'text-gray-500'
    },
  ];

  const hasActiveFilters = filters.status !== 'all' || filters.search.trim() !== '';

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search exhibitions, venues, or descriptions..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4 py-3 text-sm"
        />
        {filters.search && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Desktop Filters */}
        <div className="hidden sm:flex flex-wrap gap-2">
          {statusFilters.map((filter) => {
            const isActive = filters.status === filter.key;
            return (
              <Button
                key={filter.key}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange(filter.key)}
                className={`flex items-center gap-2 text-xs transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                {filter.icon}
                <span>{filter.label}</span>
                <Badge 
                  variant="secondary" 
                  className={`ml-1 text-xs ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {filter.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="sm:hidden w-full">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>
                {filters.status === 'all' 
                  ? 'All Events' 
                  : statusFilters.find(f => f.key === filters.status)?.label
                }
              </span>
              <Badge variant="secondary" className="text-xs">
                {statusFilters.find(f => f.key === filters.status)?.count || 0}
              </Badge>
            </div>
          </Button>
          
          {showMobileFilters && (
            <div className="mt-2 p-3 border rounded-lg bg-white shadow-sm space-y-2">
              {statusFilters.map((filter) => (
                <Button
                  key={filter.key}
                  variant={filters.status === filter.key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleStatusChange(filter.key)}
                  className="w-full justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    {filter.icon}
                    <span>{filter.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {filter.count}
                  </Badge>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active Search/Filter Indicators */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span>Filters:</span>
          {filters.search && (
            <Badge variant="outline" className="text-xs">
              Search: "{filters.search}"
              <button
                onClick={() => handleSearchChange('')}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant="outline" className="text-xs">
              Status: {statusFilters.find(f => f.key === filters.status)?.label}
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
