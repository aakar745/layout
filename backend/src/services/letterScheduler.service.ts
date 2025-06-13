import Exhibition from '../models/exhibition.model';
import { sendLettersForExhibition } from './exhibitionLetter.service';
import mongoose from 'mongoose';

/**
 * Check and send automatic letters for exhibitions
 */
export const checkAndSendAutomaticLetters = async (): Promise<void> => {
  try {
    console.log('[LETTER_SCHEDULER] Starting automatic letter check...');
    
    const now = new Date();
    
    // Find exhibitions that might need letters sent
    const exhibitions = await Exhibition.find({
      status: 'published',
      isActive: true,
      startDate: { $gt: now }, // Only future exhibitions
      $or: [
        { 'letterSettings.standPossessionLetter.automaticSending.isEnabled': true },
        { 'letterSettings.transportLetter.automaticSending.isEnabled': true }
      ]
    });

    if (exhibitions.length === 0) {
      console.log('[LETTER_SCHEDULER] No exhibitions found with automatic letter sending enabled');
      return;
    }

    console.log(`[LETTER_SCHEDULER] Found ${exhibitions.length} exhibitions with automatic letter sending enabled`);

    for (const exhibition of exhibitions) {
      try {
        await processExhibitionLetters(exhibition);
      } catch (error) {
        console.error(`[LETTER_SCHEDULER] Error processing exhibition ${exhibition._id}:`, error);
      }
    }

    console.log('[LETTER_SCHEDULER] Automatic letter check completed');
  } catch (error) {
    console.error('[LETTER_SCHEDULER] Error in automatic letter check:', error);
  }
};

/**
 * Process letters for a specific exhibition
 */
const processExhibitionLetters = async (exhibition: any): Promise<void> => {
  const now = new Date();
  const startDate = new Date(exhibition.startDate);
  const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  console.log(`[LETTER_SCHEDULER] Processing exhibition "${exhibition.name}" - ${daysUntilStart} days until start`);

  // Check Stand Possession Letter
  const standPossessionConfig = exhibition.letterSettings?.standPossessionLetter;
  if (standPossessionConfig?.automaticSending?.isEnabled && standPossessionConfig.isEnabled) {
    const targetDays = standPossessionConfig.automaticSending.daysBeforeExhibition;
    
    if (daysUntilStart <= targetDays && daysUntilStart > (targetDays - 1)) {
      console.log(`[LETTER_SCHEDULER] Sending stand possession letters for exhibition "${exhibition.name}"`);
      
      try {
        const result = await sendLettersForExhibition(
          exhibition._id.toString(),
          'standPossession',
          'automatic'
        );
        
        console.log(`[LETTER_SCHEDULER] Stand possession letters sent for "${exhibition.name}": ${result.sent} sent, ${result.failed} failed, ${result.total} total`);
      } catch (error) {
        console.error(`[LETTER_SCHEDULER] Error sending stand possession letters for "${exhibition.name}":`, error);
      }
    }
  }

  // Check Transport Letter
  const transportConfig = exhibition.letterSettings?.transportLetter;
  if (transportConfig?.automaticSending?.isEnabled && transportConfig.isEnabled) {
    const targetDays = transportConfig.automaticSending.daysBeforeExhibition;
    
    if (daysUntilStart <= targetDays && daysUntilStart > (targetDays - 1)) {
      console.log(`[LETTER_SCHEDULER] Sending transport letters for exhibition "${exhibition.name}"`);
      
      try {
        const result = await sendLettersForExhibition(
          exhibition._id.toString(),
          'transport',
          'automatic'
        );
        
        console.log(`[LETTER_SCHEDULER] Transport letters sent for "${exhibition.name}": ${result.sent} sent, ${result.failed} failed, ${result.total} total`);
      } catch (error) {
        console.error(`[LETTER_SCHEDULER] Error sending transport letters for "${exhibition.name}":`, error);
      }
    }
  }
};

/**
 * Initialize the letter scheduler service
 */
export const initializeLetterScheduler = (): void => {
  try {
    console.log('[LETTER_SCHEDULER] Initializing letter scheduler service...');
    
    // Run initial check on startup
    checkAndSendAutomaticLetters()
      .then(() => {
        console.log('[LETTER_SCHEDULER] Initial letter check completed successfully');
      })
      .catch(error => {
        console.error('[LETTER_SCHEDULER] Initial letter check failed:', error);
      });
    
    // Schedule to run every 6 hours
    const SIX_HOURS = 6 * 60 * 60 * 1000;
    
    setInterval(() => {
      checkAndSendAutomaticLetters()
        .then(() => {
          console.log('[LETTER_SCHEDULER] Scheduled letter check completed successfully');
        })
        .catch(error => {
          console.error('[LETTER_SCHEDULER] Scheduled letter check failed:', error);
        });
    }, SIX_HOURS);
    
    // Also schedule to run at specific times (8 AM and 2 PM)
    const scheduleAtTime = (hour: number) => {
      const now = new Date();
      const scheduledTime = new Date(now);
      scheduledTime.setHours(hour, 0, 0, 0);
      
      // If the time has already passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }
      
      const timeUntilScheduled = scheduledTime.getTime() - now.getTime();
      
      setTimeout(() => {
        checkAndSendAutomaticLetters()
          .then(() => {
            console.log(`[LETTER_SCHEDULER] ${hour}:00 letter check completed successfully`);
          })
          .catch(error => {
            console.error(`[LETTER_SCHEDULER] ${hour}:00 letter check failed:`, error);
          });
        
        // Schedule for the next day
        setInterval(() => {
          checkAndSendAutomaticLetters()
            .then(() => {
              console.log(`[LETTER_SCHEDULER] Daily ${hour}:00 letter check completed successfully`);
            })
            .catch(error => {
              console.error(`[LETTER_SCHEDULER] Daily ${hour}:00 letter check failed:`, error);
            });
        }, 24 * 60 * 60 * 1000); // 24 hours
      }, timeUntilScheduled);
      
      console.log(`[LETTER_SCHEDULER] Scheduled daily letter check at ${hour}:00 (next run: ${scheduledTime.toISOString()})`);
    };
    
    // Schedule at 8 AM and 2 PM
    scheduleAtTime(8);  // 8 AM
    scheduleAtTime(14); // 2 PM
    
    console.log('[LETTER_SCHEDULER] Letter scheduler service initialized successfully');
  } catch (error) {
    console.error('[LETTER_SCHEDULER] Failed to initialize letter scheduler service:', error);
  }
};

/**
 * Get upcoming letter schedules for monitoring
 */
export const getUpcomingLetterSchedules = async (): Promise<any[]> => {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const exhibitions = await Exhibition.find({
      status: 'published',
      isActive: true,
      startDate: { $gt: now, $lt: thirtyDaysFromNow },
      $or: [
        { 'letterSettings.standPossessionLetter.automaticSending.isEnabled': true },
        { 'letterSettings.transportLetter.automaticSending.isEnabled': true }
      ]
    }).select('name startDate letterSettings');

    const schedules = [];

    for (const exhibition of exhibitions) {
      const startDate = new Date(exhibition.startDate);
      const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Stand Possession Letter
      const standPossessionConfig = exhibition.letterSettings?.standPossessionLetter;
      if (standPossessionConfig?.automaticSending?.isEnabled && standPossessionConfig.isEnabled) {
        const targetDays = standPossessionConfig.automaticSending.daysBeforeExhibition;
        const scheduledDate = new Date(startDate.getTime() - (targetDays * 24 * 60 * 60 * 1000));
        
        schedules.push({
          exhibitionId: exhibition._id,
          exhibitionName: exhibition.name,
          letterType: 'standPossession',
          scheduledDate,
          daysUntilStart,
          status: daysUntilStart <= targetDays ? 'due' : 'scheduled'
        });
      }

      // Transport Letter
      const transportConfig = exhibition.letterSettings?.transportLetter;
      if (transportConfig?.automaticSending?.isEnabled && transportConfig.isEnabled) {
        const targetDays = transportConfig.automaticSending.daysBeforeExhibition;
        const scheduledDate = new Date(startDate.getTime() - (targetDays * 24 * 60 * 60 * 1000));
        
        schedules.push({
          exhibitionId: exhibition._id,
          exhibitionName: exhibition.name,
          letterType: 'transport',
          scheduledDate,
          daysUntilStart,
          status: daysUntilStart <= targetDays ? 'due' : 'scheduled'
        });
      }
    }

    return schedules.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
  } catch (error) {
    console.error('Error getting upcoming letter schedules:', error);
    throw error;
  }
}; 