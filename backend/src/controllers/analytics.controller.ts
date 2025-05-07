import { Request, Response } from 'express';
import Booking from '../models/booking.model';
import Exhibition from '../models/exhibition.model';
import Stall from '../models/stall.model';
import Exhibitor from '../models/exhibitor.model';
import dayjs from 'dayjs';
import mongoose from 'mongoose';

// Define interfaces for the data structures
interface BookingData {
  _id: string;
  status: string;
  stallIds: any[];
  createdAt: Date;
  exhibitionId: any;
  exhibitorId: any;
  customerName?: string;
  calculations: {
    totalAmount: number;
    stalls: any[];
  };
}

/**
 * Get overall analytics dashboard statistics
 */
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get filter parameters
    const { startDate, endDate, exhibitionId } = req.query;
    
    // Build filter object for Mongoose queries
    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const exhibitionFilter: any = {};
    if (exhibitionId && exhibitionId !== 'all') {
      // Ensure valid ObjectId for MongoDB queries
      exhibitionFilter.exhibitionId = mongoose.Types.ObjectId.isValid(exhibitionId as string) 
        ? new mongoose.Types.ObjectId(exhibitionId as string)
        : exhibitionId;
      
      console.log('Filtering by exhibition:', exhibitionFilter.exhibitionId);
    }

    // Combine filters
    const filter = {
      ...dateFilter,
      ...exhibitionFilter
    };

    console.log('Full dashboard filter:', JSON.stringify(filter));

    // Get booking statistics - add .lean() to get plain JS objects
    const bookings = await Booking.find(filter).lean();
    console.log(`Found ${bookings.length} bookings matching filter`);
    
    // Calculate statistics with bookings as any[]
    const bookingsData = bookings as any[];
    const totalBookings = bookingsData.length;
    const approvedBookings = bookingsData.filter(b => b.status === 'approved').length;
    const pendingBookings = bookingsData.filter(b => b.status === 'pending').length;
    const rejectedBookings = bookingsData.filter(b => b.status === 'rejected').length;
    
    // Calculate total revenue from approved bookings
    const totalRevenue = bookingsData
      .filter(b => b.status === 'approved')
      .reduce((sum, booking) => sum + (booking.calculations?.totalAmount || 0), 0);
    
    // Count total stalls booked
    const totalStallsBooked = bookingsData.reduce((sum, booking) => {
      return sum + (booking.stallIds?.length || 0);
    }, 0);

    // Calculate average booking value
    const averageBookingValue = approvedBookings > 0 ? totalRevenue / approvedBookings : 0;

    // Only return sample data if explicitly requested or if no exhibitionId filter is applied
    if (totalBookings === 0 && (!exhibitionId || exhibitionId === 'all')) {
      console.log('No real data found, returning sample data');
      // Return sample data for demonstration purposes
      return res.json({
        totalBookings: 156,
        approvedBookings: 98,
        pendingBookings: 42,
        rejectedBookings: 16,
        totalRevenue: 1250000,
        totalStallsBooked: 203,
        averageBookingValue: 12755,
        isSampleData: true
      });
    }

    // Return the real statistics
    res.json({
      totalBookings,
      approvedBookings,
      pendingBookings,
      rejectedBookings,
      totalRevenue,
      totalStallsBooked,
      averageBookingValue,
      isSampleData: false
    });
    
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Error fetching analytics data', error });
  }
};

/**
 * Get booking trends over time
 */
export const getBookingTrends = async (req: Request, res: Response) => {
  try {
    // Get filter parameters
    const { days = 30, exhibitionId } = req.query;
    
    // Calculate start date based on days parameter
    const startDate = dayjs().subtract(Number(days), 'day').startOf('day').toDate();
    
    // Build filter object
    const filter: any = {
      createdAt: { $gte: startDate }
    };
    
    if (exhibitionId && exhibitionId !== 'all') {
      // Ensure valid ObjectId for MongoDB queries
      filter.exhibitionId = mongoose.Types.ObjectId.isValid(exhibitionId as string) 
        ? new mongoose.Types.ObjectId(exhibitionId as string)
        : exhibitionId;
      
      console.log('Filtering trends by exhibition:', filter.exhibitionId);
    }
    
    console.log('Full trends filter:', JSON.stringify(filter, (key, value) => 
      key === '_id' || key === 'exhibitionId' ? value.toString() : value));
    
    // Get bookings within the date range - use .lean() to get plain JS objects
    const bookings = await Booking.find(filter).sort('createdAt').lean() as any[];
    console.log(`Found ${bookings.length} bookings for trends`);
    
    // Initialize result array with each day
    const result: Array<{date: string, bookings: number, revenue: number}> = [];
    for (let i = 0; i < Number(days); i++) {
      const date = dayjs().subtract(Number(days) - 1 - i, 'day');
      result.push({
        date: date.format('YYYY-MM-DD'),
        bookings: 0,
        revenue: 0
      });
    }
    
    // Populate result with actual booking data
    bookings.forEach(booking => {
      const bookingDate = dayjs(booking.createdAt).format('YYYY-MM-DD');
      const day = result.find(d => d.date === bookingDate);
      
      if (day) {
        day.bookings += 1;
        if (booking.status === 'approved' && booking.calculations?.totalAmount) {
          day.revenue += booking.calculations.totalAmount;
        }
      }
    });
    
    // IMPORTANT: For a specific exhibition selection, NEVER return sample data - even if empty
    if (exhibitionId && exhibitionId !== 'all') {
      console.log('Exhibition specified - returning actual data (could be all zeros)');
      // Add flag to indicate real data
      const resultWithFlag = result.map(item => ({
        ...item,
        isSampleData: false
      }));
      return res.json(resultWithFlag);
    }
    
    // If there's no data and no specific exhibition selected, return sample data
    const hasData = result.some(day => day.bookings > 0);
    if (!hasData && (!exhibitionId || exhibitionId === 'all')) {
      console.log('No real trend data found, returning sample data');
      // Generate sample data
      const sampleData = result.map((day, index) => {
        // Create a pattern that increases toward the current date
        const factor = Math.min(1, index / 15);  // Ramp up over half the period
        const randomBookings = Math.floor(Math.random() * 3 * factor) + (index > 20 ? 1 : 0);
        const randomRevenue = randomBookings * (Math.floor(Math.random() * 15000) + 5000);
        
        return {
          ...day,
          bookings: randomBookings,
          revenue: randomRevenue,
          isSampleData: true
        };
      });
      return res.json(sampleData);
    }
    
    // Add flag to indicate real data
    const resultWithFlag = result.map(item => ({
      ...item,
      isSampleData: false
    }));
    
    res.json(resultWithFlag);
    
  } catch (error) {
    console.error('Error fetching booking trends:', error);
    res.status(500).json({ message: 'Error fetching booking trends', error });
  }
};

/**
 * Get revenue by exhibition
 */
export const getRevenueByExhibition = async (req: Request, res: Response) => {
  try {
    // Get filter parameters
    const { startDate, endDate, exhibitionId } = req.query;
    
    // Build date filter
    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    
    // Add exhibition filter if provided
    const filter: any = {
      ...dateFilter,
      status: 'approved'
    };
    
    if (exhibitionId && exhibitionId !== 'all') {
      // Ensure valid ObjectId for MongoDB queries
      filter.exhibitionId = mongoose.Types.ObjectId.isValid(exhibitionId as string) 
        ? new mongoose.Types.ObjectId(exhibitionId as string)
        : exhibitionId;
      
      console.log('Filtering revenue by exhibition:', filter.exhibitionId);
    }
    
    console.log('Full revenue filter:', JSON.stringify(filter, (key, value) => 
      key === '_id' || key === 'exhibitionId' ? value.toString() : value));
    
    // Get all approved bookings within date range - use .lean() for plain JS objects
    const bookings = await Booking.find(filter)
      .populate('exhibitionId', 'name')
      .lean() as any[];
      
    console.log(`Found ${bookings.length} approved bookings for revenue calculation`);
    
    // Group by exhibition and sum revenue
    const exhibitionRevenue: { [key: string]: { exhibition: string, revenue: number } } = {};
    
    bookings.forEach(booking => {
      if (booking.exhibitionId && booking.calculations?.totalAmount) {
        const exhibitionId = typeof booking.exhibitionId === 'object' ? 
          booking.exhibitionId._id.toString() : 
          String(booking.exhibitionId);
          
        const exhibitionName = typeof booking.exhibitionId === 'object' ? 
          booking.exhibitionId.name : 
          'Unknown Exhibition';
        
        if (!exhibitionRevenue[exhibitionId]) {
          exhibitionRevenue[exhibitionId] = {
            exhibition: exhibitionName,
            revenue: 0
          };
        }
        
        exhibitionRevenue[exhibitionId].revenue += booking.calculations.totalAmount;
      }
    });
    
    // IMPORTANT: For a specific exhibition selection, return an empty array if no data is found
    if (exhibitionId && exhibitionId !== 'all') {
      console.log('Exhibition specified - returning actual revenue data (could be empty array)');
      
      // If no data for this specific exhibition, return an empty array with isSampleData: false
      if (Object.keys(exhibitionRevenue).length === 0) {
        console.log('No revenue data for this exhibition');
        return res.json([]);
      }
      
      // Format data for this specific exhibition
      const result = Object.values(exhibitionRevenue)
        .sort((a, b) => b.revenue - a.revenue)
        .map(item => ({
          ...item,
          isSampleData: false
        }));
      
      return res.json(result);
    }
    
    // If no specific exhibition is selected and we have no data, return sample
    if (Object.keys(exhibitionRevenue).length === 0 && (!exhibitionId || exhibitionId === 'all')) {
      console.log('No real revenue data found, returning sample data');
      // Return sample data for demonstration
      return res.json([
        { exhibition: 'Tech Expo 2023', revenue: 450000, isSampleData: true },
        { exhibition: 'Home & Living Fair', revenue: 320000, isSampleData: true },
        { exhibition: 'Business Summit 2023', revenue: 280000, isSampleData: true },
        { exhibition: 'Art & Design Show', revenue: 200000, isSampleData: true }
      ]);
    }
    
    // Convert to array and sort by revenue (descending)
    const result = Object.values(exhibitionRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .map(item => ({
        ...item,
        isSampleData: false
      }));
    
    res.json(result);
    
  } catch (error) {
    console.error('Error fetching revenue by exhibition:', error);
    res.status(500).json({ message: 'Error fetching revenue by exhibition', error });
  }
};

/**
 * Get bookings by status
 */
export const getBookingsByStatus = async (req: Request, res: Response) => {
  try {
    // Get filter parameters
    const { startDate, endDate, exhibitionId } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }
    
    if (exhibitionId && exhibitionId !== 'all') {
      // Ensure valid ObjectId for MongoDB queries
      filter.exhibitionId = mongoose.Types.ObjectId.isValid(exhibitionId as string) 
        ? new mongoose.Types.ObjectId(exhibitionId as string)
        : exhibitionId;
      
      console.log('Filtering status by exhibition:', filter.exhibitionId);
    }
    
    console.log('Full status filter:', JSON.stringify(filter, (key, value) => 
      key === '_id' || key === 'exhibitionId' ? value.toString() : value));
    
    // Get counts by status
    const counts = await Promise.all([
      Booking.countDocuments({ ...filter, status: 'approved' }),
      Booking.countDocuments({ ...filter, status: 'pending' }),
      Booking.countDocuments({ ...filter, status: 'rejected' })
    ]);
    
    console.log('Status counts:', counts);
    
    // IMPORTANT: For a specific exhibition selection, NEVER return sample data - even if counts are zeros
    if (exhibitionId && exhibitionId !== 'all') {
      console.log('Exhibition specified - returning actual status counts (could be all zeros)');
      // Format the result with real data (even if all zeros)
      const result = [
        { status: 'Approved', value: counts[0], isSampleData: false },
        { status: 'Pending', value: counts[1], isSampleData: false },
        { status: 'Rejected', value: counts[2], isSampleData: false }
      ];
      return res.json(result);
    }
    
    // Check if we have any bookings when no specific exhibition is selected
    const totalBookings = counts.reduce((a, b) => a + b, 0);
    if (totalBookings === 0 && (!exhibitionId || exhibitionId === 'all')) {
      console.log('No real status data found, returning sample data');
      // Return sample data
      return res.json([
        { status: 'Approved', value: 98, isSampleData: true },
        { status: 'Pending', value: 42, isSampleData: true },
        { status: 'Rejected', value: 16, isSampleData: true }
      ]);
    }
    
    // Format the result with real data
    const result = [
      { status: 'Approved', value: counts[0], isSampleData: false },
      { status: 'Pending', value: counts[1], isSampleData: false },
      { status: 'Rejected', value: counts[2], isSampleData: false }
    ];
    
    res.json(result);
    
  } catch (error) {
    console.error('Error fetching bookings by status:', error);
    res.status(500).json({ message: 'Error fetching bookings by status', error });
  }
};

/**
 * Get recent bookings
 */
export const getRecentBookings = async (req: Request, res: Response) => {
  try {
    // Get filter parameters
    const { limit = 5, exhibitionId } = req.query;
    
    // Build filter object
    const filter: any = {};
    if (exhibitionId && exhibitionId !== 'all') {
      // Ensure valid ObjectId for MongoDB queries
      filter.exhibitionId = mongoose.Types.ObjectId.isValid(exhibitionId as string) 
        ? new mongoose.Types.ObjectId(exhibitionId as string)
        : exhibitionId;
      
      console.log('Filtering recent bookings by exhibition:', filter.exhibitionId);
    }
    
    console.log('Full recent bookings filter:', JSON.stringify(filter));
    
    // Get recent bookings - use .lean() to get plain JS objects
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('exhibitionId', 'name')
      .populate('exhibitorId', 'companyName')
      .lean() as any[];
    
    console.log(`Found ${bookings.length} recent bookings`);
    
    // Format the results
    const result = bookings.map(booking => ({
      id: booking._id,
      exhibitionName: typeof booking.exhibitionId === 'object' ? booking.exhibitionId.name : 'Unknown Exhibition',
      exhibitorName: typeof booking.exhibitorId === 'object' ? booking.exhibitorId.companyName : booking.customerName || 'Unknown Exhibitor',
      stallCount: booking.stallIds?.length || 0,
      status: booking.status,
      bookingDate: dayjs(booking.createdAt).format('YYYY-MM-DD'),
      amount: booking.calculations?.totalAmount || 0,
      isSampleData: false
    }));
    
    res.json(result);
    
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({ message: 'Error fetching recent bookings', error });
  }
}; 