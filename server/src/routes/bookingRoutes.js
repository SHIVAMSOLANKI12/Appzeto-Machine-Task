import express from 'express';
import { 
  createBooking, 
  getBookingHistory 
} from '../controllers/bookingController.js';

const router = express.Router();

/**
 * @desc    Process and create a new booking
 * @route   POST /api/book
 */
router.post('/book', createBooking);

/**
 * @desc    Get user's booking history
 * @route   GET /api/bookings/:userId
 */
router.get('/bookings/:userId', getBookingHistory);

export default router;
