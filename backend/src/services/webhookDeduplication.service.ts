import crypto from 'crypto';
import WebhookEvent from '../models/webhookEvent.model';
import ServiceCharge from '../models/serviceCharge.model';

export interface WebhookEventData {
  merchantTransactionId: string;
  transactionId?: string;
  state: string;
  responseCode: string;
  rawPayload: any;
  eventType: 'phonepe_callback' | 'phonepe_verify';
  ipAddress?: string;
  userAgent?: string;
}

export interface DeduplicationResult {
  isProcessed: boolean;
  eventId: string;
  existingEvent?: any;
  shouldProcess: boolean;
  reason: string;
}

export class WebhookDeduplicationService {
  /**
   * Generate idempotency key for webhook event
   */
  generateEventId(eventData: WebhookEventData): string {
    // Create deterministic hash from key fields
    const keyFields = {
      merchantTransactionId: eventData.merchantTransactionId,
      transactionId: eventData.transactionId || '',
      state: eventData.state,
      responseCode: eventData.responseCode,
      eventType: eventData.eventType
    };
    
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(keyFields))
      .digest('hex');
    
    // Format: PHONEPE_WEBHOOK_<first 16 chars of hash>_<timestamp>
    const timestamp = Date.now();
    return `PHONEPE_WEBHOOK_${hash.substring(0, 16)}_${timestamp}`;
  }

  /**
   * Check if webhook event has already been processed (idempotency check)
   */
  async checkDuplication(eventData: WebhookEventData): Promise<DeduplicationResult> {
    try {
      console.log('🔍 [DEDUP] Checking webhook deduplication...');
      
      const eventId = this.generateEventId(eventData);
      console.log('🔍 [DEDUP] Generated event ID:', eventId);
      
      // Check for exact duplicate by event ID
      const existingEvent = await WebhookEvent.findOne({ eventId });
      
      if (existingEvent) {
        console.log('🔍 [DEDUP] Exact duplicate found by event ID:', existingEvent._id);
        return {
          isProcessed: true,
          eventId,
          existingEvent,
          shouldProcess: false,
          reason: 'Exact duplicate event already processed'
        };
      }
      
      // Check for similar events (same transaction, different timing)
      const similarEvents = await WebhookEvent.find({
        merchantTransactionId: eventData.merchantTransactionId,
        state: eventData.state,
        responseCode: eventData.responseCode,
        eventType: eventData.eventType,
        createdAt: {
          $gte: new Date(Date.now() - 5 * 60 * 1000) // Within last 5 minutes
        }
      }).sort({ createdAt: -1 }).limit(5);
      
      if (similarEvents.length > 0) {
        console.log(`🔍 [DEDUP] Found ${similarEvents.length} similar events in last 5 minutes`);
        
        // Check if the latest similar event is very recent (< 30 seconds)
        const latestSimilar = similarEvents[0];
        const timeDiff = Date.now() - latestSimilar.createdAt.getTime();
        
        if (timeDiff < 30000) { // 30 seconds
          console.log('🔍 [DEDUP] Very recent similar event found, treating as duplicate');
          return {
            isProcessed: true,
            eventId,
            existingEvent: latestSimilar,
            shouldProcess: false,
            reason: `Similar event processed ${Math.round(timeDiff/1000)} seconds ago`
          };
        }
      }
      
      console.log('✅ [DEDUP] No duplicates found, event should be processed');
      return {
        isProcessed: false,
        eventId,
        shouldProcess: true,
        reason: 'New unique event'
      };
      
    } catch (error) {
      console.error('❌ [DEDUP] Error checking deduplication:', error);
      
      // In case of error, allow processing but with a warning
      return {
        isProcessed: false,
        eventId: this.generateEventId(eventData),
        shouldProcess: true,
        reason: 'Deduplication check failed, allowing processing'
      };
    }
  }

  /**
   * Record webhook event processing
   */
  async recordEvent(
    eventData: WebhookEventData, 
    eventId: string, 
    processingStatus: 'processed' | 'failed' | 'skipped',
    serviceChargeId?: string
  ): Promise<void> {
    try {
      console.log('📝 [DEDUP] Recording webhook event:', { eventId, processingStatus });
      
      const webhookEvent = new WebhookEvent({
        eventId,
        eventType: eventData.eventType,
        merchantTransactionId: eventData.merchantTransactionId,
        transactionId: eventData.transactionId,
        state: eventData.state,
        responseCode: eventData.responseCode,
        rawPayload: eventData.rawPayload,
        processingStatus,
        serviceChargeId: serviceChargeId ? serviceChargeId : undefined,
        ipAddress: eventData.ipAddress,
        userAgent: eventData.userAgent,
        retryCount: 0
      });
      
      await webhookEvent.save();
      console.log('✅ [DEDUP] Webhook event recorded successfully');
      
    } catch (error) {
      console.error('❌ [DEDUP] Error recording webhook event:', error);
      
      // Don't throw error - recording failure shouldn't break webhook processing
      // But log it for monitoring
      console.error('❌ [DEDUP] Webhook event recording failed but processing continues');
    }
  }

  /**
   * Update existing event with retry information
   */
  async updateEventRetry(eventId: string): Promise<void> {
    try {
      await WebhookEvent.findOneAndUpdate(
        { eventId },
        { 
          $inc: { retryCount: 1 },
          $set: { processedAt: new Date() }
        }
      );
      
      console.log('🔄 [DEDUP] Updated retry count for event:', eventId);
      
    } catch (error) {
      console.error('❌ [DEDUP] Error updating retry count:', error);
    }
  }

  /**
   * Get webhook event statistics
   */
  async getEventStats(merchantTransactionId: string): Promise<any> {
    try {
      const stats = await WebhookEvent.aggregate([
        { $match: { merchantTransactionId } },
        {
          $group: {
            _id: '$processingStatus',
            count: { $sum: 1 },
            totalRetries: { $sum: '$retryCount' }
          }
        }
      ]);
      
      return stats;
      
    } catch (error) {
      console.error('❌ [DEDUP] Error getting event stats:', error);
      return [];
    }
  }

  /**
   * Clean up old webhook events (called by cleanup service)
   */
  async cleanupOldEvents(daysOld: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      
      const result = await WebhookEvent.deleteMany({
        createdAt: { $lt: cutoffDate }
      });
      
      console.log(`🧹 [DEDUP] Cleaned up ${result.deletedCount} old webhook events`);
      return result.deletedCount;
      
    } catch (error) {
      console.error('❌ [DEDUP] Error cleaning up old events:', error);
      return 0;
    }
  }
}

// Export singleton instance
export const webhookDeduplicationService = new WebhookDeduplicationService();
