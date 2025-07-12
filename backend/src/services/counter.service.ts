import Counter from '../models/counter.model';

export class CounterService {
  /**
   * Get next sequence number atomically
   * This prevents race conditions by using MongoDB's atomic operations
   */
  static async getNextSequence(name: string): Promise<number> {
    const currentYear = new Date().getFullYear();
    
    try {
      // Use findOneAndUpdate with upsert for atomic operation
      // This ensures only one document gets the next sequence number
      const counter = await Counter.findOneAndUpdate(
        { 
          _id: name, 
          year: currentYear 
        },
        { 
          $inc: { sequence: 1 },
          $setOnInsert: { year: currentYear }
        },
        { 
          new: true, 
          upsert: true,
          // Use write concern for extra safety in high-concurrency scenarios
          writeConcern: { w: 'majority', j: true }
        }
      );

      return counter.sequence;
    } catch (error) {
      console.error('Error getting next sequence:', error);
      throw error;
    }
  }

  /**
   * Generate receipt number with atomic counter
   */
  static async generateReceiptNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    const sequence = await this.getNextSequence('serviceCharge');
    
    // Format: SC2025000001, SC2025000002, etc.
    return `SC${currentYear}${String(sequence).padStart(6, '0')}`;
  }

  /**
   * Reset counter for new year (optional maintenance function)
   */
  static async resetYearlyCounter(name: string, year: number): Promise<void> {
    await Counter.findOneAndUpdate(
      { _id: name, year },
      { sequence: 0 },
      { upsert: true }
    );
  }

  /**
   * Get current counter status (for monitoring)
   */
  static async getCounterStatus(name: string): Promise<{ sequence: number; year: number } | null> {
    const currentYear = new Date().getFullYear();
    const counter = await Counter.findOne({ _id: name, year: currentYear });
    
    if (!counter) {
      return { sequence: 0, year: currentYear };
    }
    
    return {
      sequence: counter.sequence,
      year: counter.year
    };
  }
}

export default CounterService; 