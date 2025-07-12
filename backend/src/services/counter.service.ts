import Counter from '../models/counter.model';
import mongoose from 'mongoose';

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
          // Add retry logic for production
          maxTimeMS: 10000
        }
      );

      if (!counter) {
        throw new Error('Failed to generate sequence number - counter is null');
      }

      console.log(`[Counter Service] Generated sequence ${counter.sequence} for ${name} year ${currentYear}`);
      return counter.sequence;
    } catch (error: any) {
      console.error('[Counter Service] Error in atomic sequence generation:', error);
      
      // Enhanced fallback with retries
      let lastError = error;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`[Counter Service] Attempting fallback method (attempt ${attempt}/3)...`);
          
          // Wait between attempts
          if (attempt > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
          
          const existingCounter = await Counter.findOne({ _id: name, year: currentYear });
          
          if (existingCounter) {
            // Try to update existing counter
            const result = await Counter.findOneAndUpdate(
              { _id: name, year: currentYear, sequence: existingCounter.sequence },
              { $inc: { sequence: 1 } },
              { new: true }
            );
            
            if (result) {
              console.log(`[Counter Service] Fallback successful on attempt ${attempt}: ${result.sequence}`);
              return result.sequence;
            } else {
              // Counter was updated by another process, try again
              continue;
            }
          } else {
            // Create new counter
            const newCounter = new Counter({
              _id: name,
              year: currentYear,
              sequence: 1
            });
            
            try {
              await newCounter.save();
              console.log(`[Counter Service] New counter created on attempt ${attempt}: sequence 1`);
              return 1;
            } catch (saveError: any) {
              if (saveError.code === 11000) {
                // Duplicate key error - counter was created by another process
                console.log(`[Counter Service] Counter created by another process, retrying...`);
                continue;
              }
              throw saveError;
            }
          }
        } catch (fallbackError: any) {
          console.error(`[Counter Service] Fallback attempt ${attempt} failed:`, fallbackError);
          lastError = fallbackError;
          
          if (attempt === 3) {
            break;
          }
        }
      }
      
      // Final fallback: timestamp-based sequence
      console.error('[Counter Service] All retry attempts failed, using timestamp fallback');
      const timestamp = Date.now();
      const timestampSequence = parseInt(timestamp.toString().slice(-6));
      console.log(`[Counter Service] Using timestamp-based fallback sequence: ${timestampSequence}`);
      return timestampSequence;
    }
  }

  /**
   * Generate receipt number with atomic counter
   */
  static async generateReceiptNumber(): Promise<string> {
    const currentYear = new Date().getFullYear();
    
    try {
      const sequence = await this.getNextSequence('serviceCharge');
      
      // Format: SC2025000001, SC2025000002, etc.
      const receiptNumber = `SC${currentYear}${String(sequence).padStart(6, '0')}`;
      console.log(`[Counter Service] Generated receipt number: ${receiptNumber}`);
      return receiptNumber;
    } catch (error) {
      console.error('[Counter Service] Error generating receipt number:', error);
      
      // Emergency fallback: use timestamp + random
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const fallbackNumber = `SC${currentYear}${String(timestamp % 1000000).padStart(6, '0')}`;
      console.log(`[Counter Service] Using emergency fallback receipt number: ${fallbackNumber}`);
      return fallbackNumber;
    }
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
    
    try {
      const counter = await Counter.findOne({ _id: name, year: currentYear });
      
      if (!counter) {
        return { sequence: 0, year: currentYear };
      }
      
      return {
        sequence: counter.sequence,
        year: counter.year
      };
    } catch (error) {
      console.error('[Counter Service] Error getting counter status:', error);
      return { sequence: 0, year: currentYear };
    }
  }

  /**
   * Initialize counter for year if not exists
   */
  static async initializeCounter(name: string, year?: number): Promise<void> {
    const currentYear = year || new Date().getFullYear();
    
    try {
      const existingCounter = await Counter.findOne({ _id: name, year: currentYear });
      
      if (!existingCounter) {
        const newCounter = new Counter({
          _id: name,
          year: currentYear,
          sequence: 0
        });
        
        await newCounter.save();
        console.log(`[Counter Service] Initialized counter for ${name} year ${currentYear}`);
      }
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error - counter already exists
        console.log(`[Counter Service] Counter for ${name} year ${currentYear} already exists`);
      } else {
        console.error(`[Counter Service] Error initializing counter:`, error);
      }
    }
  }
}

export default CounterService; 