import { body } from 'express-validator';

export const showValidation = [
  body('movieId').isMongoId().withMessage('Valid Movie ID is required'),
  body('time').isISO8601().withMessage('Valid show time is required')
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error('Show time cannot be in the past');
      }
      return true;
    }),
];
