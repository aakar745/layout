import api from './api';

export interface DashboardStats {
  userCount: number;
  bookingCount: number;
  totalRevenue: number;
  exhibitionCount: number;
  recentBookings: any[];
  recentUsers: any[];
}

/**
 * Service for dashboard-related API calls
 */
const dashboardService = {
  /**
   * Get all dashboard statistics in one call
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      // Fetch users
      const usersResponse = await api.get('/users');
      const users = usersResponse.data || [];
      
      // Fetch bookings
      const bookingsResponse = await api.get('/bookings');
      // Handle both paginated and non-paginated response formats
      const bookings = bookingsResponse.data?.data || bookingsResponse.data || [];
      
      // Fetch exhibitions
      const exhibitionsResponse = await api.get('/exhibitions');
      const exhibitions = exhibitionsResponse.data || [];
      
      // Calculate total revenue from approved and confirmed bookings
      const totalRevenue = bookings
        .filter((b: any) => b.status === 'confirmed' || b.status === 'approved')
        .reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
      
      // Sort and limit for recent items
      const recentBookings = [...bookings]
        .sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);
      
      const recentUsers = [...users]
        .sort((a: any, b: any) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5);
      
      return {
        userCount: users.length,
        bookingCount: bookings.length,
        totalRevenue,
        exhibitionCount: exhibitions.length,
        recentBookings,
        recentUsers
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return empty data on error
      return {
        userCount: 0,
        bookingCount: 0,
        totalRevenue: 0,
        exhibitionCount: 0,
        recentBookings: [],
        recentUsers: []
      };
    }
  },
  
  /**
   * Get recent activities (bookings, users, exhibitions)
   */
  getRecentActivity: async () => {
    try {
      // This could be replaced with a dedicated API endpoint in the future
      const { recentBookings, recentUsers } = await dashboardService.getDashboardStats();
      
      // Combine and sort activities
      const activities = [
        ...recentBookings.map((booking: any) => ({
          id: booking._id,
          type: 'booking',
          title: `New booking ${booking._id.substring(0, 8)}`,
          timestamp: booking.createdAt,
          data: booking
        })),
        ...recentUsers.map((user: any) => ({
          id: user._id,
          type: 'user',
          title: `User ${user.username || 'unknown'}`,
          timestamp: user.createdAt,
          data: user
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      return activities;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return [];
    }
  }
};

export default dashboardService; 