import { Request } from 'express';
import Activity, { IActivity } from '../models/activity.model';
import User from '../models/user.model';
import Exhibitor from '../models/exhibitor.model';

interface ActivityLogData {
  action: string;
  resource: string;
  resourceId?: string;
  description: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  success?: boolean;
  errorMessage?: string;
}

interface UserInfo {
  userId?: string;
  exhibitorId?: string;
  username?: string;
  email?: string;
  type: 'user' | 'exhibitor' | 'system';
}

/**
 * Get user information from request
 */
const getUserFromRequest = async (req: Request): Promise<UserInfo> => {
  // Check for admin user
  if (req.user?._id) {
    try {
      const user = await User.findById(req.user._id).populate('role');
      return {
        userId: req.user._id,
        username: user?.username || user?.name,
        email: user?.email,
        type: 'user'
      };
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  // Check for exhibitor
  if (req.exhibitor?.id) {
    try {
      const exhibitor = await Exhibitor.findById(req.exhibitor.id);
      return {
        exhibitorId: req.exhibitor.id,
        username: exhibitor?.contactPerson,
        email: exhibitor?.email,
        type: 'exhibitor'
      };
    } catch (error) {
      console.error('Error fetching exhibitor:', error);
    }
  }

  return { type: 'system' };
};

/**
 * Extract IP address from request
 */
const getIpAddress = (req: Request): string => {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         'unknown';
};

/**
 * Log an activity
 */
export const logActivity = async (
  req: Request,
  data: ActivityLogData
): Promise<IActivity | null> => {
  try {
    const userInfo = await getUserFromRequest(req);
    
    const activityData: Partial<IActivity> = {
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId ? data.resourceId as any : undefined,
      details: {
        description: data.description,
        oldValues: data.oldValues,
        newValues: data.newValues,
        metadata: {
          ...data.metadata,
          performedBy: userInfo.username || 'System',
          performedByEmail: userInfo.email,
          performedByType: userInfo.type,
        }
      },
      ipAddress: getIpAddress(req),
      userAgent: req.headers['user-agent'],
      method: req.method as any,
      endpoint: req.originalUrl,
      success: data.success !== false,
      errorMessage: data.errorMessage,
    };

    // Set user or exhibitor ID
    if (userInfo.userId) {
      activityData.userId = userInfo.userId as any;
    } else if (userInfo.exhibitorId) {
      activityData.exhibitorId = userInfo.exhibitorId as any;
    }

    const activity = await Activity.create(activityData);
    return activity;
  } catch (error) {
    console.error('Error logging activity:', error);
    return null;
  }
};

/**
 * Log system activity (without request context)
 */
export const logSystemActivity = async (
  action: string,
  resource: string,
  description: string,
  metadata?: Record<string, any>
): Promise<IActivity | null> => {
  try {
    const activity = await Activity.create({
      action,
      resource,
      details: {
        description,
        metadata: {
          ...metadata,
          performedBy: 'System',
          performedByType: 'system',
        }
      },
      method: 'POST',
      endpoint: '/system',
      success: true,
    });
    return activity;
  } catch (error) {
    console.error('Error logging system activity:', error);
    return null;
  }
};

/**
 * Get activities with filtering and pagination
 */
export const getActivities = async (options: {
  page?: number;
  limit?: number;
  action?: string;
  resource?: string;
  userId?: string;
  exhibitorId?: string;
  startDate?: Date;
  endDate?: Date;
  success?: boolean;
  search?: string;
}) => {
  const {
    page = 1,
    limit = 50,
    action,
    resource,
    userId,
    exhibitorId,
    startDate,
    endDate,
    success,
    search
  } = options;

  const query: any = {};

  // Build filters
  if (action) query.action = action;
  if (resource) query.resource = resource;
  if (userId) query.userId = userId;
  if (exhibitorId) query.exhibitorId = exhibitorId;
  if (success !== undefined) query.success = success;

  // Date range filter
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = startDate;
    if (endDate) query.timestamp.$lte = endDate;
  }

  // Search filter
  if (search) {
    query.$or = [
      { 'details.description': { $regex: search, $options: 'i' } },
      { action: { $regex: search, $options: 'i' } },
      { resource: { $regex: search, $options: 'i' } },
      { endpoint: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    Activity.find(query)
      .populate('userId', 'username name email')
      .populate('exhibitorId', 'contactPerson email companyName')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit),
    Activity.countDocuments(query)
  ]);

  return {
    activities,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get activity statistics
 */
export const getActivityStats = async (days: number = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const stats = await Activity.aggregate([
    {
      $match: {
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          action: '$action',
          resource: '$resource',
          success: '$success'
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  const totalActivities = await Activity.countDocuments({
    timestamp: { $gte: startDate }
  });

  const successfulActivities = await Activity.countDocuments({
    timestamp: { $gte: startDate },
    success: true
  });

  const failedActivities = totalActivities - successfulActivities;

  return {
    totalActivities,
    successfulActivities,
    failedActivities,
    successRate: totalActivities > 0 ? (successfulActivities / totalActivities) * 100 : 0,
    breakdown: stats
  };
};

/**
 * Clear activity logs from database
 */
export const clearActivityLogs = async (options?: {
  beforeDate?: Date;
  keepDays?: number;
}) => {
  try {
    let query: any = {};
    
    // If beforeDate is specified, only delete logs before that date
    if (options?.beforeDate) {
      query.timestamp = { $lt: options.beforeDate };
    }
    // If keepDays is specified, delete logs older than that many days
    else if (options?.keepDays) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - options.keepDays);
      query.timestamp = { $lt: cutoffDate };
    }
    // If no options specified, delete all logs (dangerous!)
    
    // Get count before deletion for reporting
    const countBeforeDeletion = await Activity.countDocuments(query);
    
    // Perform the deletion
    const result = await Activity.deleteMany(query);
    
    return {
      deletedCount: result.deletedCount,
      totalCount: countBeforeDeletion,
      success: true
    };
  } catch (error) {
    console.error('Error clearing activity logs:', error);
    return {
      deletedCount: 0,
      totalCount: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}; 