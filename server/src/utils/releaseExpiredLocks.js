import Show from '../models/Show.js';

/**
 * Releases seat locks that have expired
 * This can be run as a cron job or called periodically
 */
const releaseExpiredLocks = async () => {
  try {
    const now = new Date();
    
    // Find shows where at least one seat is locked and expired
    const result = await Show.updateMany(
      { 'seats.lockExpiry': { $lt: now } },
      { 
        $set: { 
          'seats.$[elem].lockedBy': null,
          'seats.$[elem].lockExpiry': null
        } 
      },
      { 
        arrayFilters: [{ 'elem.lockExpiry': { $lt: now }, 'elem.isBooked': false }],
        multi: true 
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`Released ${result.modifiedCount} expired seat locks.`);
    }
  } catch (error) {
    console.error('Error releasing expired locks:', error);
  }
};

export default releaseExpiredLocks;
