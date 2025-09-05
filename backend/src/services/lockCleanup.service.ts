import AtomicBookingService from './atomicBooking.service';

/**
 * Lock Cleanup Service
 * 
 * Handles periodic cleanup of expired stall locks to prevent stalls from being
 * permanently locked due to failed booking operations or client disconnections.
 * 
 * Runs every 30 seconds to ensure optimal system performance.
 */
class LockCleanupService {
  private static cleanupInterval: NodeJS.Timeout | null = null;
  private static readonly CLEANUP_INTERVAL_MS = 30000; // 30 seconds
  private static isRunning = false;

  /**
   * Start the periodic lock cleanup process
   */
  public static start(): void {
    if (this.isRunning) {
      console.log('🧹 [LOCK CLEANUP] Service already running');
      return;
    }

    console.log('🚀 [LOCK CLEANUP] Starting periodic lock cleanup service');
    this.isRunning = true;

    // Run initial cleanup
    this.runCleanup();

    // Schedule periodic cleanup
    this.cleanupInterval = setInterval(() => {
      this.runCleanup();
    }, this.CLEANUP_INTERVAL_MS);
  }

  /**
   * Stop the periodic lock cleanup process
   */
  public static stop(): void {
    if (!this.isRunning) {
      console.log('🧹 [LOCK CLEANUP] Service not running');
      return;
    }

    console.log('🛑 [LOCK CLEANUP] Stopping periodic lock cleanup service');
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    this.isRunning = false;
  }

  /**
   * Execute a single cleanup cycle
   */
  private static async runCleanup(): Promise<void> {
    try {
      const cleanedCount = await AtomicBookingService.cleanupExpiredLocks();
      
      if (cleanedCount > 0) {
        console.log(`🧹 [LOCK CLEANUP] Cleaned up ${cleanedCount} expired locks`);
      }
    } catch (error) {
      console.error('❌ [LOCK CLEANUP] Error during cleanup cycle:', error);
      // Continue running despite errors
    }
  }

  /**
   * Force an immediate cleanup cycle (useful for testing or manual intervention)
   */
  public static async forceCleanup(): Promise<number> {
    console.log('🔧 [LOCK CLEANUP] Running forced cleanup cycle');
    
    try {
      const cleanedCount = await AtomicBookingService.cleanupExpiredLocks();
      console.log(`🧹 [LOCK CLEANUP] Force cleanup completed: ${cleanedCount} locks cleaned`);
      return cleanedCount;
    } catch (error) {
      console.error('❌ [LOCK CLEANUP] Error during forced cleanup:', error);
      throw error;
    }
  }

  /**
   * Get service status
   */
  public static getStatus(): {
    isRunning: boolean;
    intervalMs: number;
    nextCleanupInMs?: number;
  } {
    return {
      isRunning: this.isRunning,
      intervalMs: this.CLEANUP_INTERVAL_MS,
      nextCleanupInMs: this.isRunning ? this.CLEANUP_INTERVAL_MS : undefined
    };
  }
}

export default LockCleanupService;
