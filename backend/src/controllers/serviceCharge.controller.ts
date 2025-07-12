import { Request, Response } from 'express';
import mongoose from 'mongoose';
import ServiceCharge from '../models/serviceCharge.model';
import Exhibition from '../models/exhibition.model';
import User from '../models/user.model';
import { IRole } from '../models/role.model';
import { logActivity } from '../services/activity.service';

/**
 * Get all service charges with pagination and filtering
 */
export const getServiceCharges = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user?._id) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'No user found in request'
      });
    }

    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Parse filter parameters
    const {
      exhibitionId,
      paymentStatus,
      status,
      startDate,
      endDate,
      search,
      serviceType
    } = req.query;

    // Check if user has admin access
    let hasViewAllAccess = false;
    
    if (req.user) {
      const user = await User.findById(req.user._id).populate('role');
      
      if (user && user.role) {
        const userRole = user.role as unknown as IRole;
        
        if (userRole.permissions) {
          hasViewAllAccess = userRole.permissions.some(permission => 
            permission === 'view_service_charges' || 
            permission === 'service_charges_view' ||
            permission === 'admin' ||
            permission === '*'
          );
        }
      }
    }

    // Build query based on permissions and filters
    let query: any = {};

    // If user doesn't have view all access, filter by exhibitions they have access to
    if (!hasViewAllAccess) {
      const accessibleExhibitions = await Exhibition.find({
        $or: [
          { createdBy: req.user._id },
          { assignedUsers: req.user._id }
        ]
      }).select('_id');
      
      query.exhibitionId = { $in: accessibleExhibitions.map(ex => ex._id) };
    }

    // Apply filters
    if (exhibitionId) {
      query.exhibitionId = exhibitionId;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (status) {
      query.status = status;
    }

    if (serviceType) {
      query.serviceType = serviceType;
    }

    if (search) {
      query.$or = [
        { receiptNumber: { $regex: search, $options: 'i' } },
        { vendorName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { vendorPhone: { $regex: search, $options: 'i' } },
        { stallNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate as string);
      }
    }

    // Get total count for pagination
    const totalCount = await ServiceCharge.countDocuments(query);

    // Get service charges with population and pagination
    const serviceCharges = await ServiceCharge.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'exhibitionId',
        select: 'name venue startDate endDate description'
      })
      .lean();

    return res.status(200).json({
      success: true,
      data: serviceCharges,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching service charges:', error);
    return res.status(500).json({
      message: 'Error fetching service charges',
      error: (error as Error).message
    });
  }
};

/**
 * Get service charges by exhibition
 */
export const getServiceChargesByExhibition = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    // Check if user has access to this exhibition
    const exhibition = await Exhibition.findOne({
      _id: exhibitionId,
      $or: [
        { createdBy: req.user?._id },
        { assignedUsers: req.user?._id }
      ]
    });

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found or access denied' });
    }

    const serviceCharges = await ServiceCharge.find({ exhibitionId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'exhibitionId',
        select: 'name venue startDate endDate'
      });

    return res.status(200).json({
      success: true,
      data: serviceCharges
    });
  } catch (error) {
    console.error('Error fetching service charges by exhibition:', error);
    return res.status(500).json({
      message: 'Error fetching service charges',
      error: (error as Error).message
    });
  }
};

/**
 * Update service charge configuration for an exhibition
 */
export const updateServiceChargeConfig = async (req: Request, res: Response) => {
  try {
    const { exhibitionId } = req.params;
    const {
      isEnabled,
      title,
      description,
      serviceTypes,
      pricingRules,
      razorpayKeyId
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(exhibitionId)) {
      return res.status(400).json({ message: 'Invalid exhibition ID' });
    }

    // Check if user has access to this exhibition
    const exhibition = await Exhibition.findOne({
      _id: exhibitionId,
      $or: [
        { createdBy: req.user?._id },
        { assignedUsers: req.user?._id }
      ]
    });

    if (!exhibition) {
      return res.status(404).json({ message: 'Exhibition not found or access denied' });
    }

    // Prepare update data - support both old serviceTypes and new pricingRules
    const updateData: any = {
      'serviceChargeConfig.isEnabled': isEnabled,
      'serviceChargeConfig.title': title,
      'serviceChargeConfig.description': description,
    };

    // Handle pricing rules (new stall-based system)
    if (pricingRules) {
      updateData['serviceChargeConfig.pricingRules'] = pricingRules;
      // Remove old serviceTypes if switching to new system
      updateData['$unset'] = { 'serviceChargeConfig.serviceTypes': '' };
    }
    
    // Handle service types (legacy support)
    if (serviceTypes && !pricingRules) {
      updateData['serviceChargeConfig.serviceTypes'] = serviceTypes;
    }

    if (razorpayKeyId) {
      updateData['serviceChargeConfig.razorpayKeyId'] = razorpayKeyId;
    }

    // Update service charge configuration
    const updatedExhibition = await Exhibition.findByIdAndUpdate(
      exhibitionId,
      updateData,
      { new: true }
    );

    // Log activity
    await logActivity(req, {
      action: 'service_charge_config_update',
      resource: 'exhibition',
      resourceId: exhibitionId,
      description: `Service charge configuration updated for exhibition "${exhibition.name}"`,
      metadata: {
        isEnabled,
        hasPricingRules: !!pricingRules,
        serviceTypesCount: serviceTypes?.length || 0
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Service charge configuration updated successfully',
      data: updatedExhibition?.serviceChargeConfig
    });
  } catch (error) {
    console.error('Error updating service charge config:', error);
    return res.status(500).json({
      message: 'Error updating service charge configuration',
      error: (error as Error).message
    });
  }
};

/**
 * Update service charge status
 */
export const updateServiceChargeStatus = async (req: Request, res: Response) => {
  try {
    const { serviceChargeId } = req.params;
    const { status, adminNotes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(serviceChargeId)) {
      return res.status(400).json({ message: 'Invalid service charge ID' });
    }

    const validStatuses = ['submitted', 'paid', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status',
        validStatuses
      });
    }

    const serviceCharge = await ServiceCharge.findById(serviceChargeId)
      .populate('exhibitionId');

    if (!serviceCharge) {
      return res.status(404).json({ message: 'Service charge not found' });
    }

    // Check if user has access to this exhibition
    const exhibition = await Exhibition.findOne({
      _id: serviceCharge.exhibitionId,
      $or: [
        { createdBy: req.user?._id },
        { assignedUsers: req.user?._id }
      ]
    });

    if (!exhibition) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update status
    serviceCharge.status = status;
    if (adminNotes) {
      serviceCharge.adminNotes = adminNotes;
    }
    await serviceCharge.save();

    // Log activity
    await logActivity(req, {
      action: 'service_charge_status_update',
      resource: 'service_charge',
      resourceId: serviceChargeId,
      description: `Service charge status updated to "${status}" for ${serviceCharge.vendorName}`,
      metadata: {
        oldStatus: serviceCharge.status,
        newStatus: status,
        receiptNumber: serviceCharge.receiptNumber
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Service charge status updated successfully',
      data: serviceCharge
    });
  } catch (error) {
    console.error('Error updating service charge status:', error);
    return res.status(500).json({
      message: 'Error updating service charge status',
      error: (error as Error).message
    });
  }
};

/**
 * Get service charge statistics
 */
export const getServiceChargeStats = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, period } = req.query;

    // Build base query
    let matchQuery: any = {};

    if (exhibitionId && mongoose.Types.ObjectId.isValid(exhibitionId as string)) {
      matchQuery.exhibitionId = new mongoose.Types.ObjectId(exhibitionId as string);
    } else {
      // If no specific exhibition, filter by exhibitions user has access to
      const accessibleExhibitions = await Exhibition.find({
        $or: [
          { createdBy: req.user?._id },
          { assignedUsers: req.user?._id }
        ]
      }).select('_id');
      
      matchQuery.exhibitionId = { $in: accessibleExhibitions.map(ex => ex._id) };
    }

    // Add date filter based on period
    if (period) {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0); // All time
      }

      matchQuery.createdAt = { $gte: startDate };
    }

    // Aggregate statistics
    const stats = await ServiceCharge.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalCharges: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$amount', 0]
            }
          },
          pendingAmount: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'pending'] }, '$amount', 0]
            }
          },
          paidCount: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0]
            }
          },
          pendingCount: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'pending'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get breakdown by service type
    const serviceTypeBreakdown = await ServiceCharge.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$serviceType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          paidAmount: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$amount', 0]
            }
          }
        }
      }
    ]);

    // Get recent activity
    const recentActivity = await ServiceCharge.find(matchQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('exhibitionId', 'name')
      .select('vendorName amount paymentStatus serviceType createdAt exhibitionId');

    const result = {
      overview: stats[0] || {
        totalCharges: 0,
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        paidCount: 0,
        pendingCount: 0
      },
      serviceTypeBreakdown,
      recentActivity
    };

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching service charge stats:', error);
    return res.status(500).json({
      message: 'Error fetching statistics',
      error: (error as Error).message
    });
  }
};

/**
 * Export service charges to CSV
 */
export const exportServiceCharges = async (req: Request, res: Response) => {
  try {
    const { exhibitionId, paymentStatus, startDate, endDate } = req.query;

    // Build query
    let query: any = {};

    if (exhibitionId && mongoose.Types.ObjectId.isValid(exhibitionId as string)) {
      query.exhibitionId = exhibitionId;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate as string);
      }
    }

    // Get service charges
    const serviceCharges = await ServiceCharge.find(query)
      .populate('exhibitionId', 'name venue')
      .sort({ createdAt: -1 });

    // Convert to CSV format
    const csvData = serviceCharges.map(charge => ({
      'Receipt Number': charge.receiptNumber,
      'Exhibition': (charge.exhibitionId as any)?.name || '',
      'Vendor Name': charge.vendorName,
      'Company': charge.companyName,
      'Phone': charge.vendorPhone,
      'Service Type': charge.serviceType,
      'Amount': charge.amount,
      'Payment Status': charge.paymentStatus,
      'Status': charge.status,
      'Created Date': charge.createdAt.toISOString().split('T')[0],
      'Payment Date': charge.paidAt ? charge.paidAt.toISOString().split('T')[0] : '',
      'Stall Number': charge.stallNumber || '',
      'Uploaded Image': charge.uploadedImage || ''
    }));

    // Log activity
    await logActivity(req, {
      action: 'service_charges_export',
      resource: 'service_charge',
      description: `Exported ${csvData.length} service charge records`,
      metadata: {
        recordCount: csvData.length,
        filters: { exhibitionId, paymentStatus, startDate, endDate }
      }
    });

    return res.status(200).json({
      success: true,
      data: csvData,
      count: csvData.length
    });
  } catch (error) {
    console.error('Error exporting service charges:', error);
    return res.status(500).json({
      message: 'Error exporting service charges',
      error: (error as Error).message
    });
  }
};

/**
 * Download service charge receipt
 */
export const downloadReceipt = async (req: Request, res: Response) => {
  try {
    const { serviceChargeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceChargeId)) {
      return res.status(400).json({ message: 'Invalid service charge ID' });
    }

    const serviceCharge = await ServiceCharge.findById(serviceChargeId);

    if (!serviceCharge) {
      return res.status(404).json({ message: 'Service charge not found' });
    }

    if (!serviceCharge.receiptPath) {
      return res.status(404).json({ message: 'Receipt not available' });
    }

    // Check if file exists
    const fs = require('fs');
    if (!fs.existsSync(serviceCharge.receiptPath)) {
      return res.status(404).json({ message: 'Receipt file not found' });
    }

    // Send file
    res.download(serviceCharge.receiptPath, `Receipt-${serviceCharge.receiptNumber}.pdf`);
  } catch (error) {
    console.error('Error downloading receipt:', error);
    return res.status(500).json({
      message: 'Error downloading receipt',
      error: (error as Error).message
    });
  }
};

/**
 * Delete a single service charge
 */
export const deleteServiceCharge = async (req: Request, res: Response) => {
  try {
    const { serviceChargeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(serviceChargeId)) {
      return res.status(400).json({ message: 'Invalid service charge ID' });
    }

    const serviceCharge = await ServiceCharge.findById(serviceChargeId)
      .populate('exhibitionId');

    if (!serviceCharge) {
      return res.status(404).json({ message: 'Service charge not found' });
    }

    // Check if user has access to this exhibition
    const exhibition = await Exhibition.findOne({
      _id: serviceCharge.exhibitionId,
      $or: [
        { createdBy: req.user?._id },
        { assignedUsers: req.user?._id }
      ]
    });

    if (!exhibition) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Store receipt path for cleanup
    const receiptPath = serviceCharge.receiptPath;
    const receiptNumber = serviceCharge.receiptNumber;
    const vendorName = serviceCharge.vendorName;

    // Delete the service charge
    await ServiceCharge.findByIdAndDelete(serviceChargeId);

    // Clean up receipt file if it exists
    if (receiptPath) {
      const fs = require('fs');
      try {
        if (fs.existsSync(receiptPath)) {
          fs.unlinkSync(receiptPath);
        }
      } catch (fileError) {
        console.warn('Could not delete receipt file:', fileError);
        // Don't fail the request if file cleanup fails
      }
    }

    // Log activity
    await logActivity(req, {
      action: 'service_charge_delete',
      resource: 'service_charge',
      resourceId: serviceChargeId,
      description: `Service charge deleted: ${receiptNumber} for ${vendorName}`,
      metadata: {
        receiptNumber,
        vendorName,
        amount: serviceCharge.amount,
        paymentStatus: serviceCharge.paymentStatus
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Service charge deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service charge:', error);
    return res.status(500).json({
      message: 'Error deleting service charge',
      error: (error as Error).message
    });
  }
};

/**
 * Delete all service charges (bulk delete)
 */
export const deleteAllServiceCharges = async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.user?._id) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'No user found in request'
      });
    }

    // Check if user has admin access
    let hasDeleteAllAccess = false;
    
    if (req.user) {
      const user = await User.findById(req.user._id).populate('role');
      
      if (user && user.role) {
        const userRole = user.role as unknown as IRole;
        
        if (userRole.permissions) {
          hasDeleteAllAccess = userRole.permissions.some(permission => 
            permission === 'delete_all_service_charges' || 
            permission === 'admin' ||
            permission === '*'
          );
        }
      }
    }

    if (!hasDeleteAllAccess) {
      return res.status(403).json({ 
        message: 'Access denied - Admin privileges required for bulk deletion' 
      });
    }

    // Build query based on user permissions
    let query: any = {};

    // Get all service charges the user has access to
    const accessibleExhibitions = await Exhibition.find({
      $or: [
        { createdBy: req.user._id },
        { assignedUsers: req.user._id }
      ]
    }).select('_id');
    
    query.exhibitionId = { $in: accessibleExhibitions.map(ex => ex._id) };

    // Get all service charges to be deleted (for cleanup and logging)
    const serviceCharges = await ServiceCharge.find(query);
    
    if (serviceCharges.length === 0) {
      return res.status(404).json({ 
        message: 'No service charges found to delete' 
      });
    }

    // Collect receipt paths for cleanup
    const receiptPaths = serviceCharges
      .filter(sc => sc.receiptPath)
      .map(sc => sc.receiptPath);

    // Delete all service charges
    const deleteResult = await ServiceCharge.deleteMany(query);

    // Clean up receipt files
    const fs = require('fs');
    let cleanupCount = 0;
    receiptPaths.forEach(path => {
      try {
        if (path && fs.existsSync(path)) {
          fs.unlinkSync(path);
          cleanupCount++;
        }
      } catch (fileError) {
        console.warn('Could not delete receipt file:', path, fileError);
        // Don't fail the request if file cleanup fails
      }
    });

    // Log activity
    await logActivity(req, {
      action: 'service_charges_bulk_delete',
      resource: 'service_charge',
      description: `Bulk deleted ${deleteResult.deletedCount} service charges`,
      metadata: {
        deletedCount: deleteResult.deletedCount,
        receiptFilesDeleted: cleanupCount,
        totalAmount: serviceCharges.reduce((sum, sc) => sum + sc.amount, 0)
      }
    });

    return res.status(200).json({
      success: true,
      message: `Successfully deleted ${deleteResult.deletedCount} service charges`,
      deletedCount: deleteResult.deletedCount,
      receiptFilesDeleted: cleanupCount
    });
  } catch (error) {
    console.error('Error deleting all service charges:', error);
    return res.status(500).json({
      message: 'Error deleting service charges',
      error: (error as Error).message
    });
  }
}; 