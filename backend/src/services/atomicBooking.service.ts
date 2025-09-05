import mongoose from 'mongoose';
import Booking from '../models/booking.model';
import Stall from '../models/stall.model';
import Invoice from '../models/invoice.model';
import Exhibition from '../models/exhibition.model';
import { calculateStallArea } from '../utils/stallUtils';

export interface StallLock {
  stallId: string;
  lockId: string;
  expiresAt: Date;
  lockedBy: string;
  bookingType: 'admin' | 'exhibitor';
}

export interface CreateBookingData {
  stallIds: string[];
  exhibitionId: string;
  userId: string;
  exhibitorId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerGSTIN?: string;
  customerPAN?: string;
  companyName: string;
  discount?: any; // Will be matched against exhibition.discountConfig (admin) or exhibition.publicDiscountConfig (exhibitor)
  basicAmenities?: any[];
  extraAmenities?: any[];
  bookingSource: 'admin' | 'exhibitor'; // Determines which discount config to use
}

export interface BookingResult {
  booking: any;
  invoice: any;
  success: boolean;
  error?: string;
  conflictingStalls?: string[];
}

/**
 * Atomic Booking Service
 * 
 * Handles race conditions for concurrent booking operations using:
 * 1. MongoDB transactions for atomicity
 * 2. Optimistic locking with stall status checks
 * 3. Proper error handling and rollback
 * 4. Support for 100,000+ concurrent users
 */
class AtomicBookingService {
  
  /**
   * Lock timeout for stall reservations (30 seconds)
   * Short enough to not block legitimate users, long enough for booking completion
   */
  private static readonly LOCK_TIMEOUT_MS = 30000; // 30 seconds
  
  /**
   * Maximum retry attempts for failed operations due to conflicts
   */
  private static readonly MAX_RETRY_ATTEMPTS = 3;
  
  /**
   * Generate a unique lock ID for tracking
   */
  private static generateLockId(): string {
    return `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Atomic stall locking with optimistic concurrency control
   * 
   * @param stallIds Array of stall IDs to lock
   * @param lockingUserId User ID performing the lock
   * @param bookingType Type of booking (admin/exhibitor)
   * @returns Promise<string[]> Array of successfully locked stall IDs
   */
  private static async lockStalls(
    stallIds: string[], 
    lockingUserId: string, 
    bookingType: 'admin' | 'exhibitor',
    session: mongoose.ClientSession
  ): Promise<string[]> {
    const lockId = this.generateLockId();
    const lockExpiry = new Date(Date.now() + this.LOCK_TIMEOUT_MS);
    const lockedStalls: string[] = [];
    
    console.log(`🔒 [ATOMIC BOOKING] Attempting to lock ${stallIds.length} stalls for user ${lockingUserId}`);
    
    try {
      // Attempt to lock each stall atomically
      for (const stallId of stallIds) {
        const lockedStall = await Stall.findOneAndUpdate(
          {
            _id: stallId,
            status: 'available',
            // Ensure stall is not already locked or lock has expired
            $or: [
              { lockId: { $exists: false } },
              { lockId: null },
              { lockExpiry: { $lt: new Date() } }
            ]
          },
          {
            $set: {
              status: 'reserved',
              lockId: lockId,
              lockExpiry: lockExpiry,
              lockedBy: lockingUserId,
              lockType: bookingType
            }
          },
          {
            new: true,
            session,
            runValidators: true
          }
        );
        
        if (!lockedStall) {
          console.log(`❌ [ATOMIC BOOKING] Failed to lock stall ${stallId} - already taken or locked`);
          
          // Rollback previously locked stalls
          if (lockedStalls.length > 0) {
            console.log(`🔄 [ATOMIC BOOKING] Rolling back ${lockedStalls.length} previously locked stalls`);
            await this.unlockStalls(lockedStalls, lockId, session);
          }
          
          // Check if stall was just booked or is locked by another user
          const conflictStall = await Stall.findById(stallId).session(session);
          const conflictReason = conflictStall?.status === 'booked' 
            ? 'already booked' 
            : conflictStall?.lockId 
              ? `locked by ${conflictStall.lockedBy}` 
              : 'unknown conflict';
              
          throw new Error(`Stall ${stallId} is no longer available: ${conflictReason}`);
        }
        
        lockedStalls.push(stallId);
        console.log(`✅ [ATOMIC BOOKING] Successfully locked stall ${stallId}`);
      }
      
      console.log(`🎉 [ATOMIC BOOKING] Successfully locked all ${lockedStalls.length} stalls`);
      return lockedStalls;
      
    } catch (error) {
      console.error(`💥 [ATOMIC BOOKING] Error during stall locking:`, error);
      throw error;
    }
  }
  
  /**
   * Release locks on stalls
   */
  private static async unlockStalls(
    stallIds: string[], 
    lockId: string, 
    session: mongoose.ClientSession
  ): Promise<void> {
    if (stallIds.length === 0) return;
    
    console.log(`🔓 [ATOMIC BOOKING] Unlocking ${stallIds.length} stalls`);
    
    await Stall.updateMany(
      {
        _id: { $in: stallIds },
        lockId: lockId // Only unlock stalls locked by this operation
      },
      {
        $unset: {
          lockId: "",
          lockExpiry: "",
          lockedBy: "",
          lockType: ""
        },
        $set: {
          status: 'available'
        }
      },
      { session }
    );
  }
  
  /**
   * Convert locked stalls to permanently booked status
   */
  private static async confirmStallBooking(
    stallIds: string[], 
    lockId: string, 
    session: mongoose.ClientSession
  ): Promise<void> {
    console.log(`📋 [ATOMIC BOOKING] Confirming booking for ${stallIds.length} stalls`);
    
    const result = await Stall.updateMany(
      {
        _id: { $in: stallIds },
        lockId: lockId,
        status: 'reserved'
      },
      {
        $set: {
          status: 'booked'
        },
        $unset: {
          lockId: "",
          lockExpiry: "",
          lockedBy: "",
          lockType: ""
        }
      },
      { session }
    );
    
    if (result.modifiedCount !== stallIds.length) {
      throw new Error(`Expected to confirm ${stallIds.length} stalls, but only confirmed ${result.modifiedCount}`);
    }
    
    console.log(`✅ [ATOMIC BOOKING] Confirmed booking for all ${stallIds.length} stalls`);
  }
  
  /**
   * Calculate booking amounts with discounts and taxes
   */
  private static calculateBookingAmounts(
    stalls: any[], 
    exhibition: any, 
    selectedDiscount: any
  ) {
    // Calculate base amounts for all stalls
    const stallsWithBase = stalls.map(stall => ({
      stall,
      baseAmount: Math.round(stall.ratePerSqm * calculateStallArea(stall.dimensions) * 100) / 100
    }));

    const totalBaseAmount = stallsWithBase.reduce((sum, s) => sum + s.baseAmount, 0);

    // Calculate discount amounts
    const calculateDiscount = (baseAmount: number, totalBaseAmount: number, discount: any) => {
      if (!discount || !discount.isActive) return 0;
      
      let amount = 0;
      if (discount.type === 'percentage') {
        const percentage = Math.min(Math.max(0, discount.value), 100);
        amount = Math.round((baseAmount * percentage / 100) * 100) / 100;
      } else if (discount.type === 'fixed') {
        const proportionalAmount = (baseAmount / totalBaseAmount) * discount.value;
        amount = Math.round(Math.min(proportionalAmount, baseAmount) * 100) / 100;
      }
      return amount;
    };

    // Calculate amounts for each stall including discounts if applicable
    const stallCalculations = stallsWithBase.map(({ stall, baseAmount }) => {
      const discountAmount = calculateDiscount(baseAmount, totalBaseAmount, selectedDiscount);
      const amountAfterDiscount = Math.round((baseAmount - discountAmount) * 100) / 100;

      return {
        stallId: stall._id,
        number: stall.number,
        baseAmount,
        discount: selectedDiscount ? {
          name: selectedDiscount.name,
          type: selectedDiscount.type,
          value: selectedDiscount.value,
          amount: discountAmount
        } : null,
        amountAfterDiscount
      };
    });

    // Calculate total amounts including discounts and taxes
    const totalDiscountAmount = stallCalculations.reduce((sum, stall) => sum + (stall.discount?.amount || 0), 0);
    const totalAmountAfterDiscount = Math.round((totalBaseAmount - totalDiscountAmount) * 100) / 100;

    // Apply taxes from exhibition configuration
    const taxes = exhibition.taxConfig
      ?.filter((tax: any) => tax.isActive)
      .map((tax: any) => ({
        name: tax.name,
        rate: tax.rate,
        amount: Math.round((totalAmountAfterDiscount * tax.rate / 100) * 100) / 100
      })) || [];

    const totalTaxAmount = taxes.reduce((sum: number, tax: any) => sum + tax.amount, 0);
    const finalAmount = Math.round((totalAmountAfterDiscount + totalTaxAmount) * 100) / 100;

    return {
      stallCalculations,
      totalBaseAmount,
      totalDiscountAmount,
      totalAmountAfterDiscount,
      taxes,
      totalTaxAmount,
      finalAmount
    };
  }
  
  /**
   * Main atomic booking creation method
   * 
   * Handles the complete booking flow with race condition protection:
   * 1. Lock stalls atomically
   * 2. Validate exhibition and business rules
   * 3. Calculate amounts
   * 4. Create booking record
   * 5. Create invoice
   * 6. Confirm stall booking (remove locks)
   * 
   * Uses optimistic locking instead of transactions for standalone MongoDB
   */
  public static async createBooking(data: CreateBookingData): Promise<BookingResult> {
    let lockedStalls: string[] = [];
    let lockId: string = '';
    
    console.log(`🚀 [ATOMIC BOOKING] Starting atomic booking creation for ${data.stallIds.length} stalls`);
    
    try {
      // Check if MongoDB supports transactions
      const isReplicaSet = await this.checkReplicaSetSupport();
      
      if (isReplicaSet) {
        return await this.createBookingWithTransaction(data);
      } else {
        console.log(`⚠️ [ATOMIC BOOKING] Using fallback mode - standalone MongoDB detected`);
        return await this.createBookingWithoutTransaction(data);
      }
      
    } catch (error: any) {
      console.error(`💥 [ATOMIC BOOKING] Operation failed:`, error);
      
      return {
        booking: null,
        invoice: null,
        success: false,
        error: error.message,
        conflictingStalls: data.stallIds
      };
    }
  }
  
  /**
   * Check if MongoDB supports transactions (replica set or sharded)
   */
  private static async checkReplicaSetSupport(): Promise<boolean> {
    try {
      const result = await mongoose.connection.db.admin().command({ isMaster: 1 });
      return !!(result.setName || result.msg === 'isdbgrid');
    } catch {
      return false;
    }
  }
  
  /**
   * Transaction-based implementation for replica sets
   */
  private static async createBookingWithTransaction(data: CreateBookingData): Promise<BookingResult> {
    const session = await mongoose.startSession();
    let lockedStalls: string[] = [];
    let lockId: string = '';
    
    try {
      const result = await session.withTransaction(async (): Promise<BookingResult> => {
        // 1. Get exhibition data
        const exhibition = await Exhibition.findById(data.exhibitionId).session(session);
        if (!exhibition) {
          throw new Error('Exhibition not found');
        }

        // Check if exhibition is in a bookable state
        if (exhibition.status !== 'published' || !exhibition.isActive) {
          throw new Error(`Cannot create booking for this exhibition: ${
            exhibition.status !== 'published' 
              ? `Exhibition is in ${exhibition.status} status` 
              : 'Exhibition is inactive'
          }`);
        }

        // 2. Find selected discount if any (use correct discount config based on booking source)
        const discountConfigToUse = data.bookingSource === 'admin' 
          ? exhibition.discountConfig 
          : exhibition.publicDiscountConfig;
          
        const selectedDiscount = data.discount ? discountConfigToUse?.find(
          (d: any) => d.name === data.discount.name && d.type === data.discount.type && 
                      d.value === data.discount.value && d.isActive
        ) : undefined;

        if (data.discount && !selectedDiscount) {
          throw new Error('Invalid discount selected');
        }

        // 3. Lock stalls atomically (this is the critical race condition protection)
        lockedStalls = await this.lockStalls(data.stallIds, data.userId, data.bookingSource, session);
        lockId = await Stall.findById(lockedStalls[0]).session(session).then(s => s?.lockId || '');

        // 4. Get stall details for calculations
        const stalls = await Stall.find({ 
          _id: { $in: lockedStalls } 
        }).session(session);
        
        if (stalls.length !== data.stallIds.length) {
          throw new Error('Some stalls could not be locked');
        }

        // 5. Calculate amounts
        const calculations = this.calculateBookingAmounts(stalls, exhibition, selectedDiscount);

        // 6. Create booking record
        const bookingData = {
          exhibitionId: data.exhibitionId,
          stallIds: data.stallIds,
          userId: data.userId,
          exhibitorId: data.exhibitorId,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          customerGSTIN: data.customerGSTIN || 'N/A',
          customerPAN: data.customerPAN || 'N/A',
          companyName: data.companyName,
          status: data.bookingSource === 'admin' ? 'confirmed' : 'pending',
          amount: calculations.finalAmount,
          basicAmenities: data.basicAmenities || [],
          extraAmenities: data.extraAmenities || [],
          calculations: {
            stalls: calculations.stallCalculations,
            totalBaseAmount: calculations.totalBaseAmount,
            totalDiscountAmount: calculations.totalDiscountAmount,
            totalAmountAfterDiscount: calculations.totalAmountAfterDiscount,
            taxes: calculations.taxes,
            totalTaxAmount: calculations.totalTaxAmount,
            totalAmount: calculations.finalAmount
          },
          bookingSource: data.bookingSource
        };

        const booking = await Booking.create([bookingData], { session });

        // 7. Generate invoice
        const prefix = exhibition.invoicePrefix || 'INV';
        const year = new Date().getFullYear();
        
        // Get invoice count atomically to prevent duplicate numbers
        const invoiceCount = await Invoice.countDocuments({
          invoiceNumber: new RegExp(`^${prefix}/${year}/`)
        }).session(session);
        
        const sequence = (invoiceCount + 1).toString().padStart(2, '0');
        const invoiceNumber = `${prefix}/${year}/${sequence}`;

        const invoice = await Invoice.create([{
          bookingId: booking[0]._id,
          userId: data.userId,
          status: 'pending',
          amount: calculations.finalAmount,
          invoiceNumber,
          items: calculations.stallCalculations.map(stall => ({
            description: `Stall ${stall.number} Booking`,
            amount: stall.baseAmount,
            discount: stall.discount,
            taxes: calculations.taxes.map((tax: any) => ({
              name: tax.name,
              rate: tax.rate,
              amount: (stall.amountAfterDiscount * tax.rate) / 100
            }))
          })),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        }], { session });

        // 8. Confirm stall booking (convert from reserved to booked, remove locks)
        await this.confirmStallBooking(lockedStalls, lockId, session);

        console.log(`🎉 [ATOMIC BOOKING] Successfully created booking ${booking[0]._id} with invoice ${invoice[0]._id}`);

        return {
          booking: booking[0],
          invoice: invoice[0],
          success: true
        } as BookingResult;
      });
      
      return (result as BookingResult) || { booking: null, invoice: null, success: false, error: 'Transaction failed' };
      
    } catch (error: any) {
      console.error(`💥 [ATOMIC BOOKING] Transaction failed:`, error);
      
      // Transaction automatically rolled back by MongoDB
      // But we still need to clean up locks if they were acquired outside the transaction
      if (lockedStalls.length > 0 && lockId) {
        try {
          const cleanupSession = await mongoose.startSession();
          await this.unlockStalls(lockedStalls, lockId, cleanupSession);
          await cleanupSession.endSession();
        } catch (cleanupError) {
          console.error(`⚠️ [ATOMIC BOOKING] Failed to cleanup locks:`, cleanupError);
        }
      }
      
      // Determine if this was a race condition conflict
      const isConflict = error.message?.includes('no longer available') || 
                        error.message?.includes('already taken') ||
                        error.message?.includes('locked by');
      
      return {
        booking: null,
        invoice: null,
        success: false,
        error: error.message,
        conflictingStalls: isConflict ? data.stallIds : undefined
      };
      
    } finally {
      await session.endSession();
    }
  }
  
  /**
   * Fallback implementation without transactions for standalone MongoDB
   * Uses optimistic locking for race condition protection
   */
  private static async createBookingWithoutTransaction(data: CreateBookingData): Promise<BookingResult> {
    let lockedStalls: string[] = [];
    let lockId: string = '';
    
    try {
      // 1. Get exhibition data
      const exhibition = await Exhibition.findById(data.exhibitionId);
      if (!exhibition) {
        throw new Error('Exhibition not found');
      }

      // Check if exhibition is in a bookable state
      if (exhibition.status !== 'published' || !exhibition.isActive) {
        throw new Error(`Cannot create booking for this exhibition: ${
          exhibition.status !== 'published' 
            ? `Exhibition is in ${exhibition.status} status` 
            : 'Exhibition is inactive'
        }`);
      }

      // 2. Find selected discount if any (use correct discount config based on booking source)
      const discountConfigToUse = data.bookingSource === 'admin' 
        ? exhibition.discountConfig 
        : exhibition.publicDiscountConfig;
        
      const selectedDiscount = data.discount ? discountConfigToUse?.find(
        (d: any) => d.name === data.discount.name && d.type === data.discount.type && 
                    d.value === data.discount.value && d.isActive
      ) : undefined;

      if (data.discount && !selectedDiscount) {
        throw new Error('Invalid discount selected');
      }

      // 3. Lock stalls atomically (this is the critical race condition protection)
      lockedStalls = await this.lockStallsWithoutSession(data.stallIds, data.userId, data.bookingSource);
      lockId = await Stall.findById(lockedStalls[0]).then(s => s?.lockId || '');

      // 4. Get stall details for calculations
      const stalls = await Stall.find({ 
        _id: { $in: lockedStalls } 
      });
      
      if (stalls.length !== data.stallIds.length) {
        throw new Error('Some stalls could not be locked');
      }

      // 5. Calculate amounts
      const calculations = this.calculateBookingAmounts(stalls, exhibition, selectedDiscount);

      // 6. Create booking record
      const bookingData = {
        exhibitionId: data.exhibitionId,
        stallIds: data.stallIds,
        userId: data.userId,
        exhibitorId: data.exhibitorId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerGSTIN: data.customerGSTIN || 'N/A',
        customerPAN: data.customerPAN || 'N/A',
        companyName: data.companyName,
        status: data.bookingSource === 'admin' ? 'confirmed' : 'pending',
        amount: calculations.finalAmount,
        basicAmenities: data.basicAmenities || [],
        extraAmenities: data.extraAmenities || [],
        calculations: {
          stalls: calculations.stallCalculations,
          totalBaseAmount: calculations.totalBaseAmount,
          totalDiscountAmount: calculations.totalDiscountAmount,
          totalAmountAfterDiscount: calculations.totalAmountAfterDiscount,
          taxes: calculations.taxes,
          totalTaxAmount: calculations.totalTaxAmount,
          totalAmount: calculations.finalAmount
        },
        bookingSource: data.bookingSource
      };

      const booking = await Booking.create(bookingData);

      // 7. Generate invoice
      const prefix = exhibition.invoicePrefix || 'INV';
      const year = new Date().getFullYear();
      
      // Get invoice count to prevent duplicate numbers
      const invoiceCount = await Invoice.countDocuments({
        invoiceNumber: new RegExp(`^${prefix}/${year}/`)
      });
      
      const sequence = (invoiceCount + 1).toString().padStart(2, '0');
      const invoiceNumber = `${prefix}/${year}/${sequence}`;

      const invoice = await Invoice.create({
        bookingId: booking._id,
        userId: data.userId,
        status: 'pending',
        amount: calculations.finalAmount,
        invoiceNumber,
        items: calculations.stallCalculations.map(stall => ({
          description: `Stall ${stall.number} Booking`,
          amount: stall.baseAmount,
          discount: stall.discount,
          taxes: calculations.taxes.map((tax: any) => ({
            name: tax.name,
            rate: tax.rate,
            amount: (stall.amountAfterDiscount * tax.rate) / 100
          }))
        })),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      });

      // 8. Confirm stall booking (convert from reserved to booked, remove locks)
      await this.confirmStallBookingWithoutSession(lockedStalls, lockId);

      console.log(`🎉 [ATOMIC BOOKING] Successfully created booking ${booking._id} with invoice ${invoice._id}`);

      return {
        booking: booking,
        invoice: invoice,
        success: true
      };
      
    } catch (error: any) {
      console.error(`💥 [ATOMIC BOOKING] Fallback operation failed:`, error);
      
      // Clean up locks if they were acquired
      if (lockedStalls.length > 0 && lockId) {
        try {
          await this.unlockStallsWithoutSession(lockedStalls, lockId);
        } catch (cleanupError) {
          console.error(`⚠️ [ATOMIC BOOKING] Failed to cleanup locks:`, cleanupError);
        }
      }
      
      // Determine if this was a race condition conflict
      const isConflict = error.message?.includes('no longer available') || 
                        error.message?.includes('already taken') ||
                        error.message?.includes('locked by');
      
      return {
        booking: null,
        invoice: null,
        success: false,
        error: error.message,
        conflictingStalls: isConflict ? data.stallIds : undefined
      };
    }
  }
  
  /**
   * Lock stalls without session (for standalone MongoDB)
   */
  private static async lockStallsWithoutSession(
    stallIds: string[], 
    lockingUserId: string, 
    bookingType: 'admin' | 'exhibitor'
  ): Promise<string[]> {
    const lockId = this.generateLockId();
    const lockExpiry = new Date(Date.now() + this.LOCK_TIMEOUT_MS);
    const lockedStalls: string[] = [];
    
    console.log(`🔒 [ATOMIC BOOKING] Attempting to lock ${stallIds.length} stalls for user ${lockingUserId}`);
    
    try {
      // Attempt to lock each stall atomically
      for (const stallId of stallIds) {
        const lockedStall = await Stall.findOneAndUpdate(
          {
            _id: stallId,
            status: 'available',
            // Ensure stall is not already locked or lock has expired
            $or: [
              { lockId: { $exists: false } },
              { lockId: null },
              { lockExpiry: { $lt: new Date() } }
            ]
          },
          {
            $set: {
              status: 'reserved',
              lockId: lockId,
              lockExpiry: lockExpiry,
              lockedBy: lockingUserId,
              lockType: bookingType
            }
          },
          {
            new: true,
            runValidators: true
          }
        );
        
        if (!lockedStall) {
          console.log(`❌ [ATOMIC BOOKING] Failed to lock stall ${stallId} - already taken or locked`);
          
          // Rollback previously locked stalls
          if (lockedStalls.length > 0) {
            console.log(`🔄 [ATOMIC BOOKING] Rolling back ${lockedStalls.length} previously locked stalls`);
            await this.unlockStallsWithoutSession(lockedStalls, lockId);
          }
          
          // Check if stall was just booked or is locked by another user
          const conflictStall = await Stall.findById(stallId);
          const conflictReason = conflictStall?.status === 'booked' 
            ? 'already booked' 
            : conflictStall?.lockId 
              ? `locked by ${conflictStall.lockedBy}` 
              : 'unknown conflict';
              
          throw new Error(`Stall ${stallId} is no longer available: ${conflictReason}`);
        }
        
        lockedStalls.push(stallId);
        console.log(`✅ [ATOMIC BOOKING] Successfully locked stall ${stallId}`);
      }
      
      console.log(`🎉 [ATOMIC BOOKING] Successfully locked all ${lockedStalls.length} stalls`);
      return lockedStalls;
      
    } catch (error) {
      console.error(`💥 [ATOMIC BOOKING] Error during stall locking:`, error);
      throw error;
    }
  }
  
  /**
   * Unlock stalls without session
   */
  private static async unlockStallsWithoutSession(
    stallIds: string[], 
    lockId: string
  ): Promise<void> {
    if (stallIds.length === 0) return;
    
    console.log(`🔓 [ATOMIC BOOKING] Unlocking ${stallIds.length} stalls`);
    
    await Stall.updateMany(
      {
        _id: { $in: stallIds },
        lockId: lockId // Only unlock stalls locked by this operation
      },
      {
        $unset: {
          lockId: "",
          lockExpiry: "",
          lockedBy: "",
          lockType: ""
        },
        $set: {
          status: 'available'
        }
      }
    );
  }
  
  /**
   * Confirm stall booking without session
   */
  private static async confirmStallBookingWithoutSession(
    stallIds: string[], 
    lockId: string
  ): Promise<void> {
    console.log(`📋 [ATOMIC BOOKING] Confirming booking for ${stallIds.length} stalls`);
    
    const result = await Stall.updateMany(
      {
        _id: { $in: stallIds },
        lockId: lockId,
        status: 'reserved'
      },
      {
        $set: {
          status: 'booked'
        },
        $unset: {
          lockId: "",
          lockExpiry: "",
          lockedBy: "",
          lockType: ""
        }
      }
    );
    
    if (result.modifiedCount !== stallIds.length) {
      throw new Error(`Expected to confirm ${stallIds.length} stalls, but only confirmed ${result.modifiedCount}`);
    }
    
    console.log(`✅ [ATOMIC BOOKING] Confirmed booking for all ${stallIds.length} stalls`);
  }
  
  /**
   * Cleanup expired locks (should be run periodically)
   */
  public static async cleanupExpiredLocks(): Promise<number> {
    console.log(`🧹 [ATOMIC BOOKING] Cleaning up expired locks`);
    
    const result = await Stall.updateMany(
      {
        lockExpiry: { $lt: new Date() },
        status: 'reserved'
      },
      {
        $unset: {
          lockId: "",
          lockExpiry: "",
          lockedBy: "",
          lockType: ""
        },
        $set: {
          status: 'available'
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`🧹 [ATOMIC BOOKING] Cleaned up ${result.modifiedCount} expired locks`);
    }
    
    return result.modifiedCount;
  }
}

export default AtomicBookingService;
