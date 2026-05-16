import express from 'express';
import { lockSeats } from '../controllers/seatController.js';
import { bookingValidation } from '../validations/bookingValidation.js';
import validate from '../middlewares/validateMiddleware.js';

const router = express.Router();

/**
 * @desc    Lock seats for a show
 * @route   POST /api/seats/lock
 */
router.post('/lock', lockSeats);

export default router;
