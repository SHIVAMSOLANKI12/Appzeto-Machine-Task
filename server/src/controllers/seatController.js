import Show from '../models/Show.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Lock seats for a show (Pre-booking)
 * @route   POST /api/seats/lock
 * @access  Public (In production this would be Private)
 */
export const lockSeats = asyncHandler(async (req, res) => {
  const { showId, seats, userId } = req.body;

  // 1. Basic Validations
  if (!showId || !seats || !Array.isArray(seats) || seats.length === 0 || !userId) {
    res.status(400);
    throw new Error('showId, seats array, and userId are required');
  }

  if (seats.some(seat => seat < 1 || seat > 30)) {
    res.status(400);
    throw new Error('Seat numbers must be between 1 and 30');
  }

  const show = await Show.findById(showId);
  if (!show) {
    res.status(404);
    throw new Error('Show not found');
  }

  // 2. Conflict Rules
  const now = new Date();
  const unavailableSeats = show.seats.filter(s => 
    seats.includes(s.seatNumber) && 
    (s.isBooked || (s.lockedBy && s.lockedBy.toString() !== userId.toString() && s.lockExpiry > now))
  );

  if (unavailableSeats.length > 0) {
    return res.status(409).json({
      success: false,
      message: 'Some seats are unavailable',
      unavailableSeats: unavailableSeats.map(s => s.seatNumber)
    });
  }

  // 3. Locking Logic (Atomic update)
  // Lock for exactly 2 minutes
  const lockExpiry = new Date(now.getTime() + 2 * 60000);
  
  // Using findOneAndUpdate to ensure atomicity and get the updated document if needed
  // We use arrayFilters for precise seat updates
  const updatedShow = await Show.findOneAndUpdate(
    { 
      _id: showId,
      // Double check availability within the query for atomic safety
      'seats': {
        $elemMatch: {
          seatNumber: { $in: seats },
          isBooked: false,
          $or: [
            { lockedBy: null },
            { lockedBy: userId },
            { lockExpiry: { $lte: now } }
          ]
        }
      }
    },
    { 
      $set: { 
        'seats.$[elem].lockedBy': userId,
        'seats.$[elem].lockExpiry': lockExpiry
      } 
    },
    { 
      arrayFilters: [{ 'elem.seatNumber': { $in: seats } }],
      new: true
    }
  );

  if (!updatedShow) {
    // If update failed, it means someone else might have locked it between our check and update
    // Fetch again to find exactly which seats are now unavailable
    const recheckedShow = await Show.findById(showId);
    const recheckedUnavailable = recheckedShow.seats.filter(s => 
      seats.includes(s.seatNumber) && 
      (s.isBooked || (s.lockedBy && s.lockedBy.toString() !== userId.toString() && s.lockExpiry > now))
    );

    return res.status(409).json({
      success: false,
      message: 'Some seats are unavailable',
      unavailableSeats: recheckedUnavailable.map(s => s.seatNumber)
    });
  }

  res.json({
    success: true,
    message: 'Seats locked successfully',
    lockedSeats: seats,
    expiresAt: lockExpiry
  });
});
