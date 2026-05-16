import express from 'express';
import { 
  getAllMovies, 
  getMovieById
} from '../controllers/userController.js';

const router = express.Router();

// Get all movies (with filtering)
router.get('/', getAllMovies);

// Get single movie details
router.get('/:id', getMovieById);

export default router;
