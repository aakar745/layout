/**
 * Payment Queue Service
 * Handles concurrent payment requests with queue management
 * Supports 100 simultaneous payments, queues additional requests
 */

interface PaymentQueueItem {
  id: string;
  timestamp: number;
  resolve: (result: any) => void;
  reject: (error: any) => void;
  paymentProcessor: () => Promise<any>;
}

export class PaymentQueueService {
  private static instance: PaymentQueueService;
  private queue: PaymentQueueItem[] = [];
  private activePayments: Map<string, boolean> = new Map();
  private readonly MAX_CONCURRENT_PAYMENTS = 100;
  private readonly QUEUE_TIMEOUT = 300000; // 5 minutes

  private constructor() {}

  static getInstance(): PaymentQueueService {
    if (!PaymentQueueService.instance) {
      PaymentQueueService.instance = new PaymentQueueService();
    }
    return PaymentQueueService.instance;
  }

  /**
   * Add payment to queue or process immediately
   */
  async processPayment(paymentId: string, paymentProcessor: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      // Check if we can process immediately
      if (this.activePayments.size < this.MAX_CONCURRENT_PAYMENTS) {
        this.executePayment(paymentId, paymentProcessor, resolve, reject);
      } else {
        // Add to queue
        const queueItem: PaymentQueueItem = {
          id: paymentId,
          timestamp: Date.now(),
          resolve,
          reject,
          paymentProcessor
        };

        this.queue.push(queueItem);
        
        // Set timeout for queued item
        setTimeout(() => {
          this.removeFromQueue(paymentId);
          reject(new Error('Payment queue timeout - please try again later'));
        }, this.QUEUE_TIMEOUT);

        console.log(`[Payment Queue] Payment ${paymentId} queued. Queue size: ${this.queue.length}`);
      }
    });
  }

  /**
   * Execute payment immediately
   */
  private async executePayment(
    paymentId: string,
    paymentProcessor: () => Promise<any>,
    resolve: (result: any) => void,
    reject: (error: any) => void
  ): Promise<void> {
    try {
      // Mark as active
      this.activePayments.set(paymentId, true);
      
      console.log(`[Payment Queue] Processing payment ${paymentId}. Active payments: ${this.activePayments.size}`);
      
      // Execute payment
      const result = await paymentProcessor();
      
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      // Remove from active payments
      this.activePayments.delete(paymentId);
      
      // Process next in queue
      this.processNextInQueue();
    }
  }

  /**
   * Process next payment in queue
   */
  private processNextInQueue(): void {
    if (this.queue.length > 0 && this.activePayments.size < this.MAX_CONCURRENT_PAYMENTS) {
      const nextItem = this.queue.shift();
      if (nextItem) {
        this.executePayment(nextItem.id, nextItem.paymentProcessor, nextItem.resolve, nextItem.reject);
      }
    }
  }

  /**
   * Remove item from queue
   */
  private removeFromQueue(paymentId: string): void {
    const index = this.queue.findIndex(item => item.id === paymentId);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
  }

  /**
   * Get queue status
   */
  getQueueStatus(): { active: number; queued: number; capacity: number } {
    return {
      active: this.activePayments.size,
      queued: this.queue.length,
      capacity: this.MAX_CONCURRENT_PAYMENTS
    };
  }

  /**
   * Clear expired queue items
   */
  clearExpiredItems(): void {
    const now = Date.now();
    this.queue = this.queue.filter(item => {
      const isExpired = now - item.timestamp > this.QUEUE_TIMEOUT;
      if (isExpired) {
        item.reject(new Error('Payment queue timeout'));
      }
      return !isExpired;
    });
  }
}

// Export singleton instance
export const paymentQueueService = PaymentQueueService.getInstance(); 