import { Request, Response } from 'express';
import { getActivities, getActivityStats, clearActivityLogs, logActivity } from '../services/activity.service';
import Activity from '../models/activity.model';

/**
 * Get all activities with filtering and pagination
 */
export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '50',
      action,
      resource,
      userId,
      exhibitorId,
      startDate,
      endDate,
      success,
      search
    } = req.query;

    const options: any = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10)
    };

    // Only add filters if they have values
    if (action) options.action = action as string;
    if (resource) options.resource = resource as string;
    if (userId) options.userId = userId as string;
    if (exhibitorId) options.exhibitorId = exhibitorId as string;
    if (search) options.search = search as string;
    if (startDate) options.startDate = new Date(startDate as string);
    if (endDate) options.endDate = new Date(endDate as string);
    if (success !== undefined) {
      options.success = success === 'true' ? true : success === 'false' ? false : undefined;
    }

    console.log('Activity filter options:', options);

    const result = await getActivities(options);
    res.json(result);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error });
  }
};

/**
 * Get activity statistics
 */
export const getStats = async (req: Request, res: Response) => {
  try {
    const { days = '30' } = req.query;
    const stats = await getActivityStats(parseInt(days as string, 10));
    res.json(stats);
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({ message: 'Error fetching activity stats', error });
  }
};

/**
 * Get unique actions and resources for filters
 */
export const getFilters = async (req: Request, res: Response) => {
  try {
    const [actions, resources] = await Promise.all([
      Activity.distinct('action'),
      Activity.distinct('resource')
    ]);

    res.json({
      actions: actions.sort(),
      resources: resources.sort()
    });
  } catch (error) {
    console.error('Error fetching activity filters:', error);
    res.status(500).json({ message: 'Error fetching activity filters', error });
  }
};

/**
 * Clear activity logs from database
 */
export const clearLogs = async (req: Request, res: Response) => {
  try {
    const { beforeDate, keepDays, confirmText } = req.body;

    // Security check: Require confirmation text
    if (confirmText !== 'CLEAR ALL LOGS') {
      return res.status(400).json({ 
        message: 'Invalid confirmation text. Please type "CLEAR ALL LOGS" to confirm.' 
      });
    }

    // Get current count for logging
    const currentCount = await Activity.countDocuments({});

    // Log this action BEFORE clearing (important!)
    await logActivity(req, {
      action: 'bulk_operation',
      resource: 'system',
      description: `Admin initiated clearing of activity logs. Total logs before clearing: ${currentCount}`,
      metadata: {
        beforeDate,
        keepDays,
        totalLogsBeforeClearing: currentCount,
        operationType: 'clear_logs'
      },
      success: true
    });

    // Parse options
    const options: any = {};
    if (beforeDate) {
      options.beforeDate = new Date(beforeDate);
    } else if (keepDays) {
      options.keepDays = parseInt(keepDays, 10);
    }

    // Clear the logs
    const result = await clearActivityLogs(options);

    if (result.success) {
      res.json({
        message: 'Activity logs cleared successfully',
        deletedCount: result.deletedCount,
        totalCount: result.totalCount
      });
    } else {
      res.status(500).json({
        message: 'Failed to clear activity logs',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error clearing activity logs:', error);
    res.status(500).json({ message: 'Error clearing activity logs', error });
  }
}; 