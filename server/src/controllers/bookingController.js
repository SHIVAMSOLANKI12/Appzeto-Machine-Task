import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import asyncHandler from '../utils/asyncHandler.js';
import { calculateTotalPrice } from '../utils/seatPricing.js';

/**
 * @desc    Lock seats for a show (Pre-booking)
 * @route   POST /api/bookings/lock
 * @access  Private
 */
export const lockSeats = asyncHandler(async (req, res) => {
  const { showId, seats } = req.body;
  const userId = req.user?._id || '60d0fe4f5311236168a109ca'; // Mock user for now if no auth middleware

  const show = await Show.findById(showId);
  if (!show) {
    res.status(404);
    throw new Error('Show not found');
  }

  // Check if any requested seat is already booked or locked by someone else
  const now = new Date();
  const unavailableSeats = show.seats.filter(s => 
    seats.includes(s.seatNumber) && 
    (s.isBooked || (s.lockedBy && s.lockedBy.toString() !== userId.toString() && s.lockExpiry > now))
  );

  if (unavailableSeats.length > 0) {
    res.status(400);
    throw new Error(`Seats ${unavailableSeats.map(s => s.seatNumber).join(', ')} are unavailable`);
  }

  // Lock the seats (expiry 10 minutes from now)
  const lockExpiry = new Date(now.getTime() + 10 * 60000);
  
  await Show.updateOne(
    { _id: showId },
    { 
      $set: { 
        'seats.$[elem].lockedBy': userId,
        'seats.$[elem].lockExpiry': lockExpiry
      } 
    },
    { 
      arrayFilters: [{ 'elem.seatNumber': { $in: seats } }]
    }
  );

  res.json({
    success: true,
    message: 'Seats locked for 10 minutes',
    lockExpiry
  });
});

/**
 * @desc    Process and create a new booking
 * @route   POST /api/book
 * @access  Public (In production this would be Private)
 */
export const createBooking = asyncHandler(async (req, res) => {
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

  // 2. Fetch Show and Movie details
  const show = await Show.findById(showId);
  if (!show) {
    res.status(404);
    throw new Error('Show not found');
  }

  // 3. Conflict Rules & Availability Check
  const now = new Date();
  const unavailableSeats = show.seats.filter(s => 
    seats.includes(s.seatNumber) && 
    (
      s.isBooked || 
      (s.lockedBy && s.lockedBy.toString() !== userId.toString() && s.lockExpiry > now)
    )
  );

  if (unavailableSeats.length > 0) {
    return res.status(409).json({
      success: false,
      message: 'Some seats are unavailable',
      unavailableSeats: unavailableSeats.map(s => s.seatNumber)
    });
  }

  // 4. Calculate Total Price (Backend only)
  const totalPrice = calculateTotalPrice(seats);

  // 5. Atomic Update to mark seats as booked
  // This ensures no one else booked them in the meantime
  const updatedShow = await Show.findOneAndUpdate(
    { 
      _id: showId,
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
        'seats.$[elem].isBooked': true,
        'seats.$[elem].lockedBy': null,
        'seats.$[elem].lockExpiry': null
      } 
    },
    { 
      arrayFilters: [{ 'elem.seatNumber': { $in: seats } }],
      new: true
    }
  );

  if (!updatedShow) {
    return res.status(409).json({
      success: false,
      message: 'Booking failed: Seats were taken by another user'
    });
  }

  // 6. Create Booking Record
  const booking = await Booking.create({
    showId,
    movieId: show.movieId,
    userId,
    seats,
    totalPrice
  });

  // 7. Return populated booking summary
  const populatedBooking = await Booking.findById(booking._id)
    .populate('movieId', 'title language duration')
    .populate('showId', 'time');

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully',
    data: populatedBooking
  });
});

/**
 * @desc    Get user's booking history
 * @route   GET /api/bookings/:userId
 * @access  Public (In production this would be Private)
 */
export const getBookingHistory = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Booking.countDocuments({ userId });
  const bookings = await Booking.find({ userId })
    .populate('movieId', 'title language duration genre')
    .populate('showId', 'time')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    count: bookings.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit
    },
    data: bookings
  });
});
