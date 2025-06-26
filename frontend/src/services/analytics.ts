import api from './api';

export interface AnalyticsData {
  exhibition: {
    id: string;
    name: string;
    status: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    venue: string;
  };
  stalls: {
    total: number;
    booked: number;
    available: number;
    reserved: number;
    occupancyRate: number;
    typeBreakdown: Record<string, {
      total: number;
      booked: number;
      available: number;
      reserved: number;
      totalArea: number;
      bookedArea: number;
      ratePerSqm: number;
      totalValue: number;
      bookedValue: number;
      occupancyRate: number;
    }>;
  };
  area: {
    totalSQM: number;
    bookedSQM: number;
    availableSQM: number;
    utilizationRate: number;
  };
  halls: Record<string, {
    hallId: string;
    name: string;
    dimensions: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    stalls: {
      total: number;
      booked: number;
      available: number;
      reserved: number;
      occupancyRate: number;
    };
    area: {
      totalSQM: number;
      bookedSQM: number;
      availableSQM: number;
      utilizationRate: number;
      hallArea: number;
    };
    revenue: number;
    averageRate: number;
    bookings: number;
  }>;
  bookings: {
    total: number;
    statusBreakdown: {
      pending: number;
      confirmed: number;
      approved: number;
      cancelled: number;
      rejected: number;
    };
    recentTrend: Record<string, number>;
    confirmedBookings: number;
  };
  financial: {
    totalRevenue: number;
    totalBaseAmount: number;
    totalDiscountAmount: number;
    totalTaxAmount: number;
    averageBookingValue: number;
    revenueByStatus: {
      confirmed: number;
      approved: number;
      pending: number;
    };
  };
  exhibitors: {
    total: number;
    uniqueExhibitorsInExhibition: number;
    statusBreakdown: {
      pending: number;
      approved: number;
      rejected: number;
      active: number;
      inactive: number;
    };
  };
  users: {
    total: number;
    statusBreakdown: {
      active: number;
      inactive: number;
      admin: number;
      regular: number;
    };
  };
}

export interface ExhibitionOverview {
  exhibition: {
    id: string;
    name: string;
    status: string;
    isActive: boolean;
    startDate: string;
    endDate: string;
    venue: string;
  };
  stats: {
    totalBookings: number;
    totalStalls: number;
    bookedStalls: number;
    occupancyRate: number;
    totalRevenue: number;
  };
}

const analyticsService = {
  /**
   * Get analytics overview for all exhibitions
   */
  getAnalyticsOverview: async (): Promise<ExhibitionOverview[]> => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  /**
   * Get detailed analytics for a specific exhibition
   */
  getExhibitionAnalytics: async (exhibitionId: string): Promise<AnalyticsData> => {
    const response = await api.get(`/analytics/exhibition/${exhibitionId}`);
    return response.data;
  }
};

export default analyticsService; 