import api from './api';

export interface Activity {
  _id: string;
  userId?: {
    _id: string;
    username: string;
    name?: string;
    email: string;
  };
  exhibitorId?: {
    _id: string;
    contactPerson: string;
    email: string;
    companyName: string;
  };
  action: string;
  resource: string;
  resourceId?: string;
  details: {
    description: string;
    oldValues?: Record<string, any>;
    newValues?: Record<string, any>;
    metadata?: Record<string, any>;
  };
  ipAddress?: string;
  userAgent?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityStats {
  totalActivities: number;
  successfulActivities: number;
  failedActivities: number;
  successRate: number;
  breakdown: Array<{
    _id: {
      action: string;
      resource: string;
      success: boolean;
    };
    count: number;
  }>;
}

export interface ActivityFilters {
  actions: string[];
  resources: string[];
}

export interface GetActivitiesParams {
  page?: number;
  limit?: number;
  action?: string;
  resource?: string;
  userId?: string;
  exhibitorId?: string;
  startDate?: string;
  endDate?: string;
  success?: boolean;
  search?: string;
}

export interface GetActivitiesResponse {
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const activityService = {
  /**
   * Get all activities with filtering and pagination
   */
  getActivities: async (params: GetActivitiesParams = {}): Promise<GetActivitiesResponse> => {
    const response = await api.get('/activities', { params });
    return response.data;
  },

  /**
   * Get activity statistics
   */
  getStats: async (days: number = 30): Promise<ActivityStats> => {
    const response = await api.get('/activities/stats', { params: { days } });
    return response.data;
  },

  /**
   * Get available filters
   */
  getFilters: async (): Promise<ActivityFilters> => {
    const response = await api.get('/activities/filters');
    return response.data;
  },

  /**
   * Clear activity logs
   */
  clearLogs: async (options: {
    confirmText: string;
    beforeDate?: string;
    keepDays?: number;
  }): Promise<{
    message: string;
    deletedCount: number;
    totalCount: number;
  }> => {
    const response = await api.delete('/activities/clear', { data: options });
    return response.data;
  }
};

export default activityService; 