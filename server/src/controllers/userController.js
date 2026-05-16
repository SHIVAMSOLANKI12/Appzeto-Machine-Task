import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all movies with optional filtering
 * @route   GET /api/movies
 * @query   genre, language
 * @access  Public
 */
export const getAllMovies = asyncHandler(async (req, res) => {
  const { genre, language } = req.query;
  const filter = {};

  if (genre) {
    filter.genre = genre;
  }

  if (language) {
    filter.language = { $regex: language, $options: 'i' };
  }

  const movies = await Movie.find(filter).sort({ releaseDate: -1 });
  
  res.json({
    success: true,
    count: movies.length,
    data: movies
  });
});

/**
 * @desc    Get movie details by ID
 * @route   GET /api/movies/:id
 * @access  Public
 */
export const getMovieById = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }
  res.json({
    success: true,
    data: movie
  });
});

/**
 * @desc    Get all shows for a specific movie
 * @route   GET /api/shows/:movieId
 * @access  Public
 */
export const getShowsByMovie = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  // Check if movie exists
  const movie = await Movie.findById(movieId);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  const shows = await Show.find({ 
    movieId,
    time: { $gte: new Date() } // Only future shows
  })
  .populate('movieId', 'title language duration genre')
  .sort({ time: 1 });

  res.json({
    success: true,
    count: shows.length,
    data: shows
  });
});

/**
 * @desc    Get show details with seats
 * @route   GET /api/shows/details/:id
 * @access  Public
 */
export const getShowDetails = asyncHandler(async (req, res) => {
  const show = await Show.findById(req.params.id).populate('movieId', 'title duration language');
  if (!show) {
    res.status(404);
    throw new Error('Show not found');
  }
  res.json({
    success: true,
    data: show
  });
});
