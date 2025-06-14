import { Request, Response } from 'express';
import Exhibition from '../models/exhibition.model';
import mongoose from 'mongoose';
import { sanitizeHtml } from '../utils/sanitize';
import { generateSlug } from '../utils/url';
import { deleteFile } from '../config/upload';

export const createExhibition = async (req: Request, res: Response) => {
  try {
    const exhibitionData = {
      ...req.body,
      createdBy: req.user?._id,
    };

    // Sanitize HTML content in rich text fields
    if (exhibitionData.termsAndConditions) {
      exhibitionData.termsAndConditions = sanitizeHtml(exhibitionData.termsAndConditions);
    }
    if (exhibitionData.piInstructions) {
      exhibitionData.piInstructions = sanitizeHtml(exhibitionData.piInstructions);
    }

    // Generate slug if not provided
    if (!exhibitionData.slug && exhibitionData.name) {
      exhibitionData.slug = generateSlug(exhibitionData.name);
    }

    const exhibition = await Exhibition.create(exhibitionData);
    res.status(201).json(exhibition);
  } catch (error) {
    res.status(500).json({ message: 'Error creating exhibition', error });
  }
};

export const getExhibitions = async (req: Request, res: Response) => {
  try {
    // Helper function to check if user is admin
    const isAdminUser = async (userId: string): Promise<boolean> => {
      try {
        const User = require('../models/user.model').default;
        const user = await User.findById(userId).populate('role');
        if (!user || !user.role) return false;
        const roleName = typeof user.role === 'string' ? user.role : user.role.name;
        return roleName && roleName.toLowerCase().includes('admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    };

    // Helper function to get accessible exhibitions for a user
    const getUserAccessibleExhibitions = async (userId: string): Promise<string[]> => {
      try {
        const User = require('../models/user.model').default;
        const user = await User.findById(userId).populate('assignedExhibitions');
        
        if (!user || !user.assignedExhibitions) {
          console.log(`No exhibitions assigned to user ${userId}`);
          return [];
        }
        
        return user.assignedExhibitions.map((exhibition: any) => 
          exhibition._id ? exhibition._id.toString() : exhibition.toString()
        );
      } catch (error) {
        console.error('Error getting user accessible exhibitions:', error);
        return [];
      }
    };

    let exhibitions;

    // Check if user is admin - if so, return all exhibitions
    const isAdmin = await isAdminUser(req.user?.id || req.user?._id);
    if (isAdmin) {
      console.log('Admin user detected, returning all exhibitions');
      exhibitions = await Exhibition.find()
        .sort({ createdAt: -1 })
        .populate('createdBy', 'username');
    } else {
      // For non-admin users, filter by assigned exhibitions
      const accessibleExhibitionIds = await getUserAccessibleExhibitions(req.user?.id || req.user?._id);
      
      console.log(`Non-admin user, accessible exhibitions: ${accessibleExhibitionIds.length}`);
      
      if (accessibleExhibitionIds.length === 0) {
        // User has no assigned exhibitions
        return res.json([]);
      }

      exhibitions = await Exhibition.find({
        _id: { $in: accessibleExhibitionIds }
      })
        .sort({ createdAt: -1 })
        .populate('createdBy', 'username');
    }

    // Calculate progress for all exhibitions
    const exhibitionsWithProgress = await calculateExhibitionsProgress(exhibitions);

    res.json(exhibitionsWithProgress);
  } catch (error) {
    console.error('Error fetching exhibitions:', error);
    res.status(500).json({ message: 'Error fetching exhibitions', error });
  }
};

export const getActiveExhibitions = async (req: Request, res: Response) => {
  try {
    // Helper function to check if user is admin
    const isAdminUser = async (userId: string): Promise<boolean> => {
      try {
        const User = require('../models/user.model').default;
        const user = await User.findById(userId).populate('role');
        if (!user || !user.role) return false;
        const roleName = typeof user.role === 'string' ? user.role : user.role.name;
        return roleName && roleName.toLowerCase().includes('admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    };

    // Helper function to get accessible exhibitions for a user
    const getUserAccessibleExhibitions = async (userId: string): Promise<string[]> => {
      try {
        const User = require('../models/user.model').default;
        const user = await User.findById(userId).populate('assignedExhibitions');
        
        if (!user || !user.assignedExhibitions) {
          console.log(`No exhibitions assigned to user ${userId}`);
          return [];
        }
        
        return user.assignedExhibitions.map((exhibition: any) => 
          exhibition._id ? exhibition._id.toString() : exhibition.toString()
        );
      } catch (error) {
        console.error('Error getting user accessible exhibitions:', error);
        return [];
      }
    };

    let exhibitions;

    // Check if user is admin - if so, return all active exhibitions
    const isAdmin = await isAdminUser(req.user?.id || req.user?._id);
    if (isAdmin) {
      exhibitions = await Exhibition.find({ isActive: true })
        .sort({ createdAt: -1 })
        .populate('createdBy', 'username');
    } else {
      // For non-admin users, filter by assigned exhibitions and active status
      const accessibleExhibitionIds = await getUserAccessibleExhibitions(req.user?.id || req.user?._id);
      
      if (accessibleExhibitionIds.length === 0) {
        // User has no assigned exhibitions
        return res.json([]);
      }

      exhibitions = await Exhibition.find({
        _id: { $in: accessibleExhibitionIds },
        isActive: true
      })
        .sort({ createdAt: -1 })
        .populate('createdBy', 'username');
    }

    res.json(exhibitions);
  } catch (error) {
    console.error('Error fetching active exhibitions:', error);
    res.status(500).json({ message: 'Error fetching active exhibitions', error });
  }
};

export const getExhibition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let exhibition;

    // Check if id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      exhibition = await Exhibition.findById(id)
        .populate('createdBy', 'username');
    } else {
      // If not a valid ObjectId, try to find by slug
      exhibition = await Exhibition.findOne({ slug: id })
        .populate('createdBy', 'username');
    }
    
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }
    
    res.json(exhibition);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exhibition', error });
  }
};

export const updateExhibition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    // Check if id is valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    // Get the current exhibition to compare changes
    const currentExhibition = await Exhibition.findById(id);
    if (!currentExhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    // Validate amenities data
    if (updateData.amenities !== undefined) {
      if (!Array.isArray(updateData.amenities)) {
        updateData.amenities = [];
      } else {
        // Validate each amenity
        updateData.amenities = updateData.amenities.filter((amenity: any) => {
          return amenity && 
            amenity.type && 
            amenity.name && 
            amenity.description &&
            typeof amenity.rate === 'number' && 
            amenity.rate >= 0;
        });
      }
    }

    // Validate basic amenities data
    if (updateData.basicAmenities !== undefined) {
      if (!Array.isArray(updateData.basicAmenities)) {
        updateData.basicAmenities = [];
      } else {
        // Validate each basic amenity
        updateData.basicAmenities = updateData.basicAmenities.filter((amenity: any) => {
          return amenity && 
            amenity.type && 
            amenity.name && 
            amenity.description &&
            typeof amenity.perSqm === 'number' && 
            amenity.perSqm > 0 &&
            typeof amenity.quantity === 'number' && 
            amenity.quantity > 0;
        });
      }
    }

    // Extract status and isActive
    const { status, isActive, ...restUpdateData } = updateData;

    // Sanitize HTML content in rich text fields
    if (restUpdateData.termsAndConditions) {
      restUpdateData.termsAndConditions = sanitizeHtml(restUpdateData.termsAndConditions);
    }
    if (restUpdateData.piInstructions) {
      restUpdateData.piInstructions = sanitizeHtml(restUpdateData.piInstructions);
    }

    // Handle header logo deletion
    if (restUpdateData.headerLogo === null || restUpdateData.headerLogo === '') {
      // Check if we need to delete an existing file
      if (currentExhibition.headerLogo) {
        deleteFile(currentExhibition.headerLogo);
      }
      restUpdateData.headerLogo = '';
    }
    
    // Handle sponsor logos - could be array or complex object from frontend
    if (restUpdateData.sponsorLogos) {
      let newSponsorLogos: string[] = [];
      
      if (Array.isArray(restUpdateData.sponsorLogos)) {
        // Already an array, keep as is
        newSponsorLogos = restUpdateData.sponsorLogos;
      } else if (typeof restUpdateData.sponsorLogos === 'object') {
        // Complex object structure from frontend
        try {
          // If it has a fileList property with items
          if (restUpdateData.sponsorLogos.fileList && Array.isArray(restUpdateData.sponsorLogos.fileList)) {
            // Extract paths from response.path in each fileList item
            newSponsorLogos = restUpdateData.sponsorLogos.fileList
              .filter((file: any) => file.status === 'done' && file.response?.path)
              .map((file: any) => file.response.path);
          }
        } catch (err) {
          console.error('Error processing sponsorLogos:', err);
          newSponsorLogos = [];
        }
      }
      
      // Check for removed sponsor logos and delete their files
      if (currentExhibition.sponsorLogos && Array.isArray(currentExhibition.sponsorLogos)) {
        const removedLogos = currentExhibition.sponsorLogos.filter(oldPath => 
          !newSponsorLogos.includes(oldPath)
        );
        
        // Delete each removed logo file
        for (const logoPath of removedLogos) {
          deleteFile(logoPath);
        }
      }
      
      // Update the value in the database
      restUpdateData.sponsorLogos = newSponsorLogos;
    }

    // Generate slug if name is being updated but slug isn't provided
    if (restUpdateData.name && !restUpdateData.slug) {
      // Check if this is a name change by getting the current exhibition
      const currentExhibition = await Exhibition.findById(id);
      if (currentExhibition && currentExhibition.name !== restUpdateData.name) {
        restUpdateData.slug = generateSlug(restUpdateData.name);
      }
    }

    // Prepare update data
    const finalUpdateData = {
      ...restUpdateData,
      ...(status !== undefined && { status }),
      ...(isActive !== undefined && { isActive })
    };

    const exhibition = await Exhibition.findByIdAndUpdate(
      id,
      finalUpdateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    res.json(exhibition);
  } catch (error) {
    console.error('Error updating exhibition:', error);
    res.status(500).json({ message: 'Error updating exhibition', error });
  }
};

export const deleteExhibition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if id is valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    const exhibition = await Exhibition.findByIdAndDelete(id);
    
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    res.json({ message: 'Exhibition deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exhibition', error });
  }
};

export const updateExhibitionStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Check if id is valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    const exhibition = await Exhibition.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    res.json(exhibition);
  } catch (error) {
    res.status(500).json({ message: 'Error updating exhibition status', error });
  }
};

/**
 * Assign users to an exhibition (Admin only)
 */
export const assignUsersToExhibition = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userIds } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'User IDs array is required' });
    }

    // Validate all user IDs
    for (const userId of userIds) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: `Invalid user ID: ${userId}` });
      }
    }

    const exhibition = await Exhibition.findByIdAndUpdate(
      id,
      { $addToSet: { assignedUsers: { $each: userIds } } },
      { new: true, runValidators: true }
    ).populate('assignedUsers', 'username name email')
     .populate('assignedUsers.role', 'name');

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    res.json({ 
      message: 'Users assigned successfully',
      assignedUsers: exhibition.assignedUsers 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning users to exhibition', error });
  }
};

/**
 * Unassign a user from an exhibition (Admin only)
 */
export const unassignUserFromExhibition = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const exhibition = await Exhibition.findByIdAndUpdate(
      id,
      { $pull: { assignedUsers: userId } },
      { new: true, runValidators: true }
    ).populate('assignedUsers', 'username name email')
     .populate('assignedUsers.role', 'name');

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    res.json({ 
      message: 'User unassigned successfully',
      assignedUsers: exhibition.assignedUsers 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error unassigning user from exhibition', error });
  }
};

/**
 * Get assigned users for an exhibition (Admin only)
 */
export const getAssignedUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    const exhibition = await Exhibition.findById(id)
      .select('assignedUsers')
      .populate('assignedUsers', 'username email name role');

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    res.json({
      success: true,
      data: exhibition.assignedUsers || []
    });
  } catch (error) {
    console.error('Error fetching assigned users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assigned users',
      error
    });
  }
};

/**
 * Get all exhibitions for admin user management (no access control filtering)
 * This endpoint is specifically for user assignment and should only be accessible by admins
 */
export const getAllExhibitionsForAssignment = async (req: Request, res: Response) => {
  try {
    // This endpoint should only be accessible by admins for user assignment purposes
    const exhibitions = await Exhibition.find()
      .sort({ createdAt: -1 })
      .select('_id name venue startDate endDate status isActive')
      .populate('createdBy', 'username');
    
    res.json(exhibitions);
  } catch (error) {
    console.error('Error fetching exhibitions for assignment:', error);
    res.status(500).json({ message: 'Error fetching exhibitions for assignment', error });
  }
};

/**
 * Get exhibition progress based on stall bookings
 */
export const getExhibitionProgress = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    // Get exhibition
    const exhibition = await Exhibition.findById(id);
    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found' });
    }

    // Get stall statistics
    const Stall = require('../models/stall.model').default;
    const Booking = require('../models/booking.model').default;

    const [totalStalls, bookedStalls, confirmedBookings] = await Promise.all([
      Stall.countDocuments({ exhibitionId: id }),
      Stall.countDocuments({ exhibitionId: id, status: { $in: ['booked', 'reserved'] } }),
      Booking.countDocuments({ exhibitionId: id, status: { $in: ['confirmed', 'approved'] } })
    ]);

    // Calculate progress metrics
    const stallBookingProgress = totalStalls > 0 ? Math.round((bookedStalls / totalStalls) * 100) : 0;
    
    // Time-based progress (for reference)
    const now = new Date();
    const start = new Date(exhibition.startDate);
    const end = new Date(exhibition.endDate);
    let timeProgress = 0;
    
    if (now >= start && now <= end) {
      const total = end.getTime() - start.getTime();
      const current = now.getTime() - start.getTime();
      timeProgress = Math.round((current / total) * 100);
    } else if (now > end) {
      timeProgress = 100;
    }

    // Combined progress (weighted: 70% stall booking, 30% timeline)
    const combinedProgress = Math.round((stallBookingProgress * 0.7) + (timeProgress * 0.3));

    const progressData = {
      stallBookingProgress,
      timeProgress,
      combinedProgress,
      stats: {
        totalStalls,
        bookedStalls,
        availableStalls: totalStalls - bookedStalls,
        confirmedBookings,
        bookingRate: totalStalls > 0 ? Math.round((bookedStalls / totalStalls) * 100) : 0
      }
    };

    res.json(progressData);
  } catch (error) {
    console.error('Error calculating exhibition progress:', error);
    res.status(500).json({ message: 'Error calculating exhibition progress', error });
  }
};

/**
 * Calculate progress for multiple exhibitions
 */
const calculateExhibitionsProgress = async (exhibitions: any[]) => {
  const Stall = require('../models/stall.model').default;
  
  const exhibitionsWithProgress = await Promise.all(
    exhibitions.map(async (exhibition) => {
      try {
        const [totalStalls, bookedStalls] = await Promise.all([
          Stall.countDocuments({ exhibitionId: exhibition._id }),
          Stall.countDocuments({ exhibitionId: exhibition._id, status: { $in: ['booked', 'reserved'] } })
        ]);

        // Calculate stall booking progress
        const stallBookingProgress = totalStalls > 0 ? Math.round((bookedStalls / totalStalls) * 100) : 0;
        
        // Time-based progress
        const now = new Date();
        const start = new Date(exhibition.startDate);
        const end = new Date(exhibition.endDate);
        let timeProgress = 0;
        
        if (now >= start && now <= end) {
          const total = end.getTime() - start.getTime();
          const current = now.getTime() - start.getTime();
          timeProgress = Math.round((current / total) * 100);
        } else if (now > end) {
          timeProgress = 100;
        }

        // Combined progress (weighted: 70% stall booking, 30% timeline)
        const combinedProgress = Math.round((stallBookingProgress * 0.7) + (timeProgress * 0.3));

        return {
          ...exhibition.toObject(),
          progress: {
            stallBookingProgress,
            timeProgress,
            combinedProgress
          },
          stats: {
            totalStalls,
            bookedStalls,
            availableStalls: totalStalls - bookedStalls,
            bookingRate: stallBookingProgress
          }
        };
      } catch (error) {
        console.error(`Error calculating progress for exhibition ${exhibition._id}:`, error);
        return {
          ...exhibition.toObject(),
          progress: {
            stallBookingProgress: 0,
            timeProgress: 0,
            combinedProgress: 0
          },
          stats: {
            totalStalls: 0,
            bookedStalls: 0,
            availableStalls: 0,
            bookingRate: 0
          }
        };
      }
    })
  );

  return exhibitionsWithProgress;
}; 