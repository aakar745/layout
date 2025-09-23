import { Exhibition, ExhibitionStatus } from '@/lib/types/exhibitions';

/**
 * Calculate exhibition status based on dates
 */
export function getExhibitionStatus(startDate: string, endDate: string): ExhibitionStatus {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) {
    return {
      status: 'upcoming',
      color: '#722ED1',
      bgColor: '#F9F0FF',
      textColor: '#722ED1'
    };
  } else if (now > end) {
    return {
      status: 'completed',
      color: '#8C8C8C',
      bgColor: '#F5F5F5',
      textColor: '#8C8C8C'
    };
  } else {
    return {
      status: 'active',
      color: '#52C41A',
      bgColor: '#F6FFED',
      textColor: '#52C41A'
    };
  }
}

/**
 * Format date to readable string
 */
export function formatExhibitionDate(
  dateString: string, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }
): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', options);
  } catch {
    console.error('Invalid date string:', dateString);
    return 'Invalid Date';
  }
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = formatExhibitionDate(startDate);
  const end = formatExhibitionDate(endDate);
  
  // If same month/year, show abbreviated format
  const startMonth = new Date(startDate).getMonth();
  const endMonth = new Date(endDate).getMonth();
  const startYear = new Date(startDate).getFullYear();
  const endYear = new Date(endDate).getFullYear();
  
  if (startYear === endYear && startMonth === endMonth) {
    const startDay = new Date(startDate).getDate();
    const endDay = new Date(endDate).getDate();
    const monthYear = formatExhibitionDate(startDate, { month: 'short', year: 'numeric' });
    return `${startDay}-${endDay} ${monthYear}`;
  }
  
  return `${start} - ${end}`;
}

/**
 * Calculate days until exhibition starts or days since it ended
 */
export function calculateDaysInfo(startDate: string, endDate: string): {
  count: number;
  label: string;
  isPast: boolean;
  isActive: boolean;
} {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) {
    // Upcoming
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      count: diffDays,
      label: `${diffDays} day${diffDays !== 1 ? 's' : ''} until start`,
      isPast: false,
      isActive: false
    };
  } else if (now > end) {
    // Past
    const diffTime = now.getTime() - end.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      count: diffDays,
      label: `Ended ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`,
      isPast: true,
      isActive: false
    };
  } else {
    // Active
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return {
      count: diffDays,
      label: `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`,
      isPast: false,
      isActive: true
    };
  }
}

/**
 * Calculate exhibition duration in days
 */
export function getExhibitionDuration(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
}

/**
 * Generate exhibition URL (handles both ID and slug)
 */
export function getExhibitionUrl(exhibition: Exhibition): string {
  return `/exhibitions/${exhibition.slug || exhibition._id}`;
}

/**
 * Filter exhibitions based on criteria
 */
export function filterExhibitions(
  exhibitions: Exhibition[],
  filters: {
    status?: 'all' | 'upcoming' | 'active' | 'completed';
    search?: string;
  }
): Exhibition[] {
  let filtered = [...exhibitions];
  
  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(exhibition => {
      const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
      return status.status === filters.status;
    });
  }
  
  // Filter by search term
  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase().trim();
    filtered = filtered.filter(exhibition =>
      exhibition.name.toLowerCase().includes(searchTerm) ||
      exhibition.description.toLowerCase().includes(searchTerm) ||
      exhibition.venue?.toLowerCase().includes(searchTerm)
    );
  }
  
  return filtered;
}

/**
 * Sort exhibitions by different criteria
 */
export function sortExhibitions(
  exhibitions: Exhibition[],
  sortBy: 'date' | 'name' | 'status' = 'date',
  order: 'asc' | 'desc' = 'asc'
): Exhibition[] {
  const sorted = [...exhibitions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        break;
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'status':
        const statusA = getExhibitionStatus(a.startDate, a.endDate);
        const statusB = getExhibitionStatus(b.startDate, b.endDate);
        const statusOrder = { upcoming: 0, active: 1, completed: 2 };
        comparison = statusOrder[statusA.status] - statusOrder[statusB.status];
        break;
    }
    
    return order === 'desc' ? -comparison : comparison;
  });
  
  return sorted;
}

/**
 * Get exhibition statistics summary
 */
export function getExhibitionsSummary(exhibitions: Exhibition[]) {
  const total = exhibitions.length;
  const upcoming = exhibitions.filter(ex => {
    const status = getExhibitionStatus(ex.startDate, ex.endDate);
    return status.status === 'upcoming';
  }).length;
  const active = exhibitions.filter(ex => {
    const status = getExhibitionStatus(ex.startDate, ex.endDate);
    return status.status === 'active';
  }).length;
  const completed = exhibitions.filter(ex => {
    const status = getExhibitionStatus(ex.startDate, ex.endDate);
    return status.status === 'completed';
  }).length;
  
  return { total, upcoming, active, completed };
}

/**
 * Check if exhibition is bookable
 */
export function isExhibitionBookable(exhibition: Exhibition): boolean {
  const status = getExhibitionStatus(exhibition.startDate, exhibition.endDate);
  return status.status === 'upcoming' || status.status === 'active';
}

/**
 * Generate sharing data for exhibition
 */
export function getExhibitionSharingData(exhibition: Exhibition) {
  return {
    title: exhibition.name,
    text: `Check out ${exhibition.name} - ${exhibition.description}`,
    url: typeof window !== 'undefined' ? `${window.location.origin}/exhibitions/${exhibition.slug || exhibition._id}` : '',
  };
}

/**
 * Generate calendar event data for exhibition
 */
export function getCalendarEventData(exhibition: Exhibition) {
  const startDate = new Date(exhibition.startDate);
  const endDate = new Date(exhibition.endDate);
  
  const formatDateForCalendar = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  return {
    title: exhibition.name,
    start: formatDateForCalendar(startDate),
    end: formatDateForCalendar(endDate),
    description: exhibition.description,
    location: exhibition.venue || '',
  };
}
