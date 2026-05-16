import express from 'express';
import { 
  addMovie, 
  getAllMovies, 
  addShow, 
  getAllShows, 
  deleteMovie 
} from '../controllers/adminController.js';
import { movieValidation } from '../validations/movieValidation.js';
import { showValidation } from '../validations/showValidation.js';
import validate from '../middlewares/validateMiddleware.js';

const router = express.Router();

// Movie routes
router.get('/movies', getAllMovies);
router.post('/movies', movieValidation, validate, addMovie);
router.delete('/movies/:id', deleteMovie);

// Show routes
router.get('/shows', getAllShows);
router.post('/shows', showValidation, validate, addShow);

export default router;
