import express from 'express';
import { getShowsByMovie, getShowDetails } from '../controllers/userController.js';

const router = express.Router();

// Get all shows for a movie
router.get('/:movieId', getShowsByMovie);

// Get specific show details (including seats)
router.get('/details/:id', getShowDetails);

export default router;
