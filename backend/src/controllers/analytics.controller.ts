import { Request, Response } from 'express';
import Exhibition from '../models/exhibition.model';
import Booking from '../models/booking.model';
import Stall from '../models/stall.model';
import Hall from '../models/hall.model';
import User from '../models/user.model';
import Exhibitor from '../models/exhibitor.model';
import mongoose from 'mongoose';

/**
 * Get analytics data for a specific exhibition
 */
export const getExhibitionAnalytics = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;

    // Validate exhibition ID
    if (!mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    // Get exhibition details
    const exhibition = await Exhibition.findById(exhibitionId);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    // Get all halls for this exhibition
    const halls = await Hall.find({ exhibitionId });

    // Get all stalls for this exhibition
    const stalls = await Stall.find({ exhibitionId }).populate('stallTypeId').populate('hallId');

    // Get all bookings for this exhibition
    const bookings = await Booking.find({ exhibitionId })
      .populate('exhibitorId', 'companyName status')
      .populate('stallIds');

    // Get all users (for user analytics)
    const users = await User.find().populate('role', 'name');

    // Get all exhibitors
    const exhibitors = await Exhibitor.find();

    // Calculate stall analytics
    const totalStalls = stalls.length;
    const bookedStalls = stalls.filter(stall => stall.status === 'booked').length;
    const availableStalls = stalls.filter(stall => stall.status === 'available').length;
    const reservedStalls = stalls.filter(stall => stall.status === 'reserved').length;

    // Calculate area analytics
    const totalSQM = stalls.reduce((total, stall) => {
      return total + (stall.dimensions.width * stall.dimensions.height);
    }, 0);

    const bookedSQM = stalls
      .filter(stall => stall.status === 'booked')
      .reduce((total, stall) => {
        return total + (stall.dimensions.width * stall.dimensions.height);
      }, 0);

    // Calculate booking status analytics
    const bookingStatusCounts = {
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      rejected: bookings.filter(b => b.status === 'rejected').length
    };

    // Calculate financial analytics
    const totalRevenue = bookings
      .filter(b => ['confirmed', 'approved'].includes(b.status))
      .reduce((total, booking) => total + booking.amount, 0);

    const totalBaseAmount = bookings.reduce((total, booking) => {
      return total + (booking.calculations?.totalBaseAmount || 0);
    }, 0);

    const totalDiscountAmount = bookings.reduce((total, booking) => {
      return total + (booking.calculations?.totalDiscountAmount || 0);
    }, 0);

    const totalTaxAmount = bookings.reduce((total, booking) => {
      return total + (booking.calculations?.totalTaxAmount || 0);
    }, 0);

    // Calculate exhibitor analytics
    const uniqueExhibitors = new Set(
      bookings
        .filter(b => b.exhibitorId)
        .map(b => (b.exhibitorId as any)?._id?.toString())
        .filter(Boolean)
    ).size;

    const exhibitorStatusCounts = {
      pending: exhibitors.filter(e => e.status === 'pending').length,
      approved: exhibitors.filter(e => e.status === 'approved').length,
      rejected: exhibitors.filter(e => e.status === 'rejected').length,
      active: exhibitors.filter(e => e.status === 'approved' && e.isActive).length,
      inactive: exhibitors.filter(e => !e.isActive).length
    };

    // Calculate user analytics
    const userStatusCounts = {
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      admin: users.filter(u => {
        const role = u.role as any;
        return role?.name?.toLowerCase().includes('admin');
      }).length,
      regular: users.filter(u => {
        const role = u.role as any;
        return role?.name?.toLowerCase() === 'user' || 
               (!role?.name?.toLowerCase().includes('admin') && role);
      }).length
    };

    // Calculate stall type breakdown
    const stallTypeBreakdown = stalls.reduce((acc, stall) => {
      const stallType = stall.stallTypeId as any;
      const typeName = stallType?.name || 'Unknown';
      if (!acc[typeName]) {
        acc[typeName] = {
          total: 0,
          booked: 0,
          available: 0,
          reserved: 0,
          totalArea: 0,
          bookedArea: 0,
          ratePerSqm: stall.ratePerSqm || 0,
          rates: []
        };
      }
      acc[typeName].total++;
      acc[typeName][stall.status]++;
      const area = stall.dimensions.width * stall.dimensions.height;
      acc[typeName].totalArea += area;
      if (stall.status === 'booked') {
        acc[typeName].bookedArea += area;
      }
      
      // Collect all rates for this stall type to calculate average if needed
      if (stall.ratePerSqm && !acc[typeName].rates.includes(stall.ratePerSqm)) {
        acc[typeName].rates.push(stall.ratePerSqm);
      }
      
      // Update rate if this is the first stall or if rates are consistent
      if (acc[typeName].total === 1) {
        acc[typeName].ratePerSqm = stall.ratePerSqm || 0;
      } else if (acc[typeName].rates.length === 1) {
        // All stalls have the same rate
        acc[typeName].ratePerSqm = acc[typeName].rates[0];
      } else if (acc[typeName].rates.length > 1) {
        // Multiple rates exist, calculate average
        acc[typeName].ratePerSqm = Math.round(
          (acc[typeName].rates.reduce((sum: number, rate: number) => sum + rate, 0) / acc[typeName].rates.length) * 100
        ) / 100;
      }
      
      return acc;
    }, {} as Record<string, any>);
    
    // Clean up the rates array from the final result since we only need the calculated rate
    Object.keys(stallTypeBreakdown).forEach(type => {
      delete stallTypeBreakdown[type].rates;
    });

    // Calculate hall breakdown
    const hallBreakdown = halls.reduce((acc, hall) => {
      const hallStalls = stalls.filter(stall => {
        const stallHall = stall.hallId as any;
        return stallHall?._id?.toString() === hall._id.toString();
      });

      const hallBookings = bookings.filter(booking => {
        return booking.stallIds.some((stallId: any) => {
          const stall = stalls.find(s => s._id.toString() === stallId.toString());
          if (!stall) return false;
          const stallHall = stall.hallId as any;
          return stallHall?._id?.toString() === hall._id.toString();
        });
      });

      const totalStallsInHall = hallStalls.length;
      const bookedStallsInHall = hallStalls.filter(stall => stall.status === 'booked').length;
      const availableStallsInHall = hallStalls.filter(stall => stall.status === 'available').length;
      const reservedStallsInHall = hallStalls.filter(stall => stall.status === 'reserved').length;

      const totalAreaInHall = hallStalls.reduce((sum, stall) => {
        return sum + (stall.dimensions.width * stall.dimensions.height);
      }, 0);

      const bookedAreaInHall = hallStalls
        .filter(stall => stall.status === 'booked')
        .reduce((sum, stall) => {
          return sum + (stall.dimensions.width * stall.dimensions.height);
        }, 0);

      const hallRevenue = hallBookings
        .filter(b => ['confirmed', 'approved'].includes(b.status))
        .reduce((sum, booking) => sum + booking.amount, 0);

      const averageRateInHall = hallStalls.length > 0 
        ? hallStalls.reduce((sum, stall) => sum + stall.ratePerSqm, 0) / hallStalls.length 
        : 0;

      acc[hall.name] = {
        hallId: hall._id,
        name: hall.name,
        dimensions: hall.dimensions,
        stalls: {
          total: totalStallsInHall,
          booked: bookedStallsInHall,
          available: availableStallsInHall,
          reserved: reservedStallsInHall,
          occupancyRate: totalStallsInHall > 0 ? Math.round((bookedStallsInHall / totalStallsInHall) * 100) : 0
        },
        area: {
          totalSQM: Math.round(totalAreaInHall * 100) / 100,
          bookedSQM: Math.round(bookedAreaInHall * 100) / 100,
          availableSQM: Math.round((totalAreaInHall - bookedAreaInHall) * 100) / 100,
          utilizationRate: totalAreaInHall > 0 ? Math.round((bookedAreaInHall / totalAreaInHall) * 100) : 0,
          hallArea: Math.round((hall.dimensions.width * hall.dimensions.height) * 100) / 100
        },
        revenue: Math.round(hallRevenue * 100) / 100,
        averageRate: Math.round(averageRateInHall * 100) / 100,
        bookings: hallBookings.length
      };

      return acc;
    }, {} as Record<string, any>);

    // Calculate recent bookings trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentBookings = bookings.filter(b => 
      new Date((b as any).createdAt) >= thirtyDaysAgo
    );

    const bookingTrend = recentBookings.reduce((acc, booking) => {
      const date = new Date((booking as any).createdAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate average booking value
    const confirmedBookings = bookings.filter(b => 
      ['confirmed', 'approved'].includes(b.status)
    );
    const averageBookingValue = confirmedBookings.length > 0 
      ? totalRevenue / confirmedBookings.length 
      : 0;

    const analytics = {
      exhibition: {
        id: exhibition._id,
        name: exhibition.name,
        status: exhibition.status,
        isActive: exhibition.isActive,
        startDate: exhibition.startDate,
        endDate: exhibition.endDate,
        venue: exhibition.venue
      },
      stalls: {
        total: totalStalls,
        booked: bookedStalls,
        available: availableStalls,
        reserved: reservedStalls,
        occupancyRate: totalStalls > 0 ? Math.round((bookedStalls / totalStalls) * 100) : 0,
        typeBreakdown: stallTypeBreakdown
      },
      area: {
        totalSQM: Math.round(totalSQM * 100) / 100,
        bookedSQM: Math.round(bookedSQM * 100) / 100,
        availableSQM: Math.round((totalSQM - bookedSQM) * 100) / 100,
        utilizationRate: totalSQM > 0 ? Math.round((bookedSQM / totalSQM) * 100) : 0
      },
      halls: hallBreakdown,
      bookings: {
        total: bookings.length,
        statusBreakdown: bookingStatusCounts,
        recentTrend: bookingTrend,
        confirmedBookings: confirmedBookings.length
      },
      financial: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalBaseAmount: Math.round(totalBaseAmount * 100) / 100,
        totalDiscountAmount: Math.round(totalDiscountAmount * 100) / 100,
        totalTaxAmount: Math.round(totalTaxAmount * 100) / 100,
        averageBookingValue: Math.round(averageBookingValue * 100) / 100,
        revenueByStatus: {
          confirmed: Math.round(bookings
            .filter(b => b.status === 'confirmed')
            .reduce((sum, b) => sum + b.amount, 0) * 100) / 100,
          approved: Math.round(bookings
            .filter(b => b.status === 'approved')
            .reduce((sum, b) => sum + b.amount, 0) * 100) / 100,
          pending: Math.round(bookings
            .filter(b => b.status === 'pending')
            .reduce((sum, b) => sum + b.amount, 0) * 100) / 100
        }
      },
      exhibitors: {
        total: exhibitors.length,
        uniqueExhibitorsInExhibition: uniqueExhibitors,
        statusBreakdown: exhibitorStatusCounts
      },
      users: {
        total: users.length,
        statusBreakdown: userStatusCounts
      }
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching exhibition analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data', error });
  }
};

/**
 * Get analytics overview for all exhibitions
 */
export const getAnalyticsOverview = async (req: Request, res: Response) => {
  try {
    // Get all exhibitions
    const exhibitions = await Exhibition.find()
      .select('name status isActive startDate endDate venue')
      .sort({ createdAt: -1 });

    // Get quick stats for each exhibition
    const exhibitionStats = await Promise.all(
      exhibitions.map(async (exhibition) => {
        const bookingCount = await Booking.countDocuments({ 
          exhibitionId: exhibition._id 
        });
        const stallCount = await Stall.countDocuments({ 
          exhibitionId: exhibition._id 
        });
        const bookedStallCount = await Stall.countDocuments({ 
          exhibitionId: exhibition._id,
          status: 'booked'
        });
        
        const revenue = await Booking.aggregate([
          { 
            $match: { 
              exhibitionId: exhibition._id,
              status: { $in: ['confirmed', 'approved'] }
            }
          },
          { 
            $group: { 
              _id: null, 
              total: { $sum: '$amount' } 
            } 
          }
        ]);

        return {
          exhibition: {
            id: exhibition._id,
            name: exhibition.name,
            status: exhibition.status,
            isActive: exhibition.isActive,
            startDate: exhibition.startDate,
            endDate: exhibition.endDate,
            venue: exhibition.venue
          },
          stats: {
            totalBookings: bookingCount,
            totalStalls: stallCount,
            bookedStalls: bookedStallCount,
            occupancyRate: stallCount > 0 ? Math.round((bookedStallCount / stallCount) * 100) : 0,
            totalRevenue: revenue.length > 0 ? Math.round(revenue[0].total * 100) / 100 : 0
          }
        };
      })
    );

    res.json(exhibitionStats);
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ message: 'Error fetching analytics overview', error });
  }
}; 