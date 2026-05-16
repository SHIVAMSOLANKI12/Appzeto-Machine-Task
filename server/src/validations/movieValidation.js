import { body } from 'express-validator';

export const movieValidation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('description').notEmpty().withMessage('Description is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive integer'),
  body('genre').isArray({ min: 1 }).withMessage('At least one genre is required'),
  body('releaseDate').isISO8601().withMessage('Valid release date is required'),
  body('cast').isArray({ min: 1 }).withMessage('At least one cast member is required'),
  body('language').notEmpty().withMessage('Language is required').trim(),
];
