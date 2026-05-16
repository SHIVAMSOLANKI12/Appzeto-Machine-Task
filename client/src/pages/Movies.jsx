import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { movieService } from '../services/movieService';
import { fadeIn, staggerContainer } from '../animations/variants';
import Skeleton from '../components/common/Skeleton';
import { Star, Filter, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMovieImage } from '../utils/helpers';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');

  const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller'];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await movieService.getMovies();
      setMovies(response.data || response || []);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      setMovies([
        { _id: '1', title: 'The Batman', rating: 8.5, genre: 'Action', posterURL: '', language: 'English' },
        { _id: '2', title: 'Inception', rating: 8.8, genre: 'Sci-Fi', posterURL: '', language: 'English' },
        { _id: '3', title: 'Interstellar', rating: 8.7, genre: 'Sci-Fi', posterURL: '', language: 'English' },
        { _id: '4', title: 'Joker', rating: 8.4, genre: 'Drama', posterURL: '', language: 'English' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = activeGenre === 'All' 
    ? movies 
    : movies.filter(m => m.genre?.includes(activeGenre));

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Movies In Mumbai</h1>
          <p className="text-gray-500 mt-1">Discover the latest blockbusters hitting the big screen</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap
                ${activeGenre === genre 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-red-600 hover:text-red-600'}
              `}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-lg italic">No movies found in this category.</p>
          <button 
            onClick={() => setActiveGenre('All')}
            className="text-red-600 font-bold mt-2 hover:underline"
          >
            Show all movies
          </button>
        </div>
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {filteredMovies.map((movie) => (
            <motion.div
              key={movie._id}
              variants={fadeIn}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
            >
              <Link to={`/movie/${movie._id}`}>
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-2xl transition-all duration-300">
                  <img 
                    src={getMovieImage(movie.title, movie.posterURL)} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
                    }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-white text-xs font-bold bg-red-600 self-start px-2 py-1 rounded mb-2">BOOK NOW</p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md p-2 flex items-center justify-center gap-1">
                    <Star size={14} className="text-red-500 fill-red-500" />
                    <span className="text-white text-sm font-bold">{movie.rating || 'N/A'}/10</span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-500">{movie.language} • {movie.genre}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Movies;
