import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Movie title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Movie description is required']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Movie duration is required']
  },
  genre: {
    type: [String],
    required: [true, 'At least one genre is required']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Release date is required']
  },
  cast: {
    type: [String],
    required: [true, 'Cast information is required']
  },
  language: {
    type: String,
    required: [true, 'Language is required']
  },
  posterUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop'
  }
}, {
  timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
