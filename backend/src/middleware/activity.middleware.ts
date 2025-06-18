import { Request, Response, NextFunction } from 'express';
import { logActivity } from '../services/activity.service';

interface ActivityConfig {
  action: string;
  resource: string;
  getDescription: (req: Request, res: Response) => string;
  getResourceId?: (req: Request, res: Response) => string | undefined;
  captureOldValues?: boolean;
  skipLogging?: (req: Request, res: Response) => boolean;
}

/**
 * Middleware to automatically log activities
 */
export const activityLogger = (config: ActivityConfig) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip logging if specified
    if (config.skipLogging && config.skipLogging(req, res)) {
      return next();
    }

    let oldValues: any = undefined;

    // Capture old values if requested (for updates/deletes)
    if (config.captureOldValues && req.params.id) {
      try {
        // Dynamically import the model based on resource
        const modelName = config.resource.charAt(0).toUpperCase() + config.resource.slice(1);
        const Model = require(`../models/${config.resource}.model`).default;
        const existingRecord = await Model.findById(req.params.id);
        if (existingRecord) {
          oldValues = existingRecord.toObject();
          // Remove sensitive fields
          delete oldValues.password;
          delete oldValues.__v;
        }
      } catch (error) {
        console.error('Error capturing old values:', error);
      }
    }

    // Override res.json to capture response and log activity
    const originalJson = res.json.bind(res);
    res.json = function(body: any) {
      // Log the activity after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logActivity(req, {
          action: config.action,
          resource: config.resource,
          resourceId: config.getResourceId ? config.getResourceId(req, res) : req.params.id,
          description: config.getDescription(req, res),
          oldValues,
          newValues: req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' ? req.body : undefined,
          metadata: {
            method: req.method,
            endpoint: req.originalUrl,
            statusCode: res.statusCode
          }
        }).catch(error => console.error('Error logging activity:', error));
      }
      
      return originalJson(body);
    };

    next();
  };
};

/**
 * Pre-configured activity loggers for common operations
 */
export const activityLoggers = {
  // User activities
  userCreated: activityLogger({
    action: 'user_created',
    resource: 'user',
    getDescription: (req) => `Created user "${req.body.username || req.body.name}"`,
    getResourceId: (req, res) => res.locals?.createdId || req.body._id
  }),

  userUpdated: activityLogger({
    action: 'user_updated',
    resource: 'user',
    getDescription: (req) => `Updated user "${req.params.id}"`,
    captureOldValues: true
  }),

  userDeleted: activityLogger({
    action: 'user_deleted',
    resource: 'user',
    getDescription: (req) => `Deleted user "${req.params.id}"`,
    captureOldValues: true
  }),

  // Exhibitor activities
  exhibitorRegistered: activityLogger({
    action: 'exhibitor_registered',
    resource: 'exhibitor',
    getDescription: (req) => `Exhibitor registered: "${req.body.companyName}"`,
    getResourceId: (req, res) => res.locals?.createdId || req.body._id
  }),

  exhibitorUpdated: activityLogger({
    action: 'exhibitor_updated',
    resource: 'exhibitor',
    getDescription: (req) => `Updated exhibitor "${req.params.id}"`,
    captureOldValues: true
  }),

  exhibitorDeleted: activityLogger({
    action: 'exhibitor_deleted',
    resource: 'exhibitor',
    getDescription: (req) => `Deleted exhibitor "${req.params.id}"`,
    captureOldValues: true
  }),

  // Exhibition activities
  exhibitionCreated: activityLogger({
    action: 'exhibition_created',
    resource: 'exhibition',
    getDescription: (req) => `Created exhibition "${req.body.name}"`,
    getResourceId: (req, res) => res.locals?.createdId || req.body._id
  }),

  exhibitionUpdated: activityLogger({
    action: 'exhibition_updated',
    resource: 'exhibition',
    getDescription: (req) => `Updated exhibition "${req.params.id}"`,
    captureOldValues: true
  }),

  exhibitionDeleted: activityLogger({
    action: 'exhibition_deleted',
    resource: 'exhibition',
    getDescription: (req) => `Deleted exhibition "${req.params.id}"`,
    captureOldValues: true
  }),

  // Booking activities
  bookingCreated: activityLogger({
    action: 'booking_created',
    resource: 'booking',
    getDescription: (req) => `Created booking for "${req.body.customerName || req.body.companyName}"`,
    getResourceId: (req, res) => res.locals?.createdId || req.body._id
  }),

  bookingUpdated: activityLogger({
    action: 'booking_updated',
    resource: 'booking',
    getDescription: (req) => `Updated booking "${req.params.id}"`,
    captureOldValues: true
  }),

  bookingStatusChanged: activityLogger({
    action: 'booking_updated',
    resource: 'booking',
    getDescription: (req) => `Changed booking status to "${req.body.status}" for booking "${req.params.id}"`,
    captureOldValues: true
  }),

  bookingCancelled: activityLogger({
    action: 'booking_cancelled',
    resource: 'booking',
    getDescription: (req) => `Cancelled booking "${req.params.id}"`,
    captureOldValues: true
  }),

  bookingDeleted: activityLogger({
    action: 'booking_deleted',
    resource: 'booking',
    getDescription: (req) => `Deleted booking "${req.params.id}"`,
    captureOldValues: true
  }),

  // Invoice activities
  invoiceDownloaded: activityLogger({
    action: 'invoice_downloaded',
    resource: 'invoice',
    getDescription: (req) => `Downloaded invoice "${req.params.id}"`,
    skipLogging: (req) => req.method !== 'GET'
  }),

  // Stall activities
  stallCreated: activityLogger({
    action: 'stall_created',
    resource: 'stall',
    getDescription: (req) => `Created stall "${req.body.number || 'New Stall'}"`,
    getResourceId: (req, res) => res.locals?.createdId || req.body._id
  }),

  stallUpdated: activityLogger({
    action: 'stall_updated',
    resource: 'stall',
    getDescription: (req) => `Updated stall "${req.params.id}"`,
    captureOldValues: true
  }),

  stallDeleted: activityLogger({
    action: 'stall_deleted',
    resource: 'stall',
    getDescription: (req) => `Deleted stall "${req.params.id}"`,
    captureOldValues: true
  })
}; 