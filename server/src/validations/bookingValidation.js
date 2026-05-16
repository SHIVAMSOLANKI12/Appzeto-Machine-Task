import { body } from 'express-validator';

export const bookingValidation = [
  body('showId').isMongoId().withMessage('Valid Show ID is required'),
  body('seats').isArray({ min: 1 }).withMessage('At least one seat must be selected')
    .custom((value) => {
      if (value.some(seat => seat < 1 || seat > 30)) {
        throw new Error('Seat numbers must be between 1 and 30');
      }
      return true;
    }),
];
