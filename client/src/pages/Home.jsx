import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { movieService } from '../services/movieService';
import { fadeIn, staggerContainer } from '../animations/variants';
import Button from '../components/common/Button';
import { Play, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMovieImage } from '../utils/helpers';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getMovies();
        setMovies((response.data || response || []).slice(0, 4)); // Show top 4
      } catch (error) {
        console.error('Failed to fetch movies:', error);
        setMovies([
          { _id: '1', title: 'The Batman', rating: 8.5, genre: 'Action', posterURL: '' },
          { _id: '2', title: 'Inception', rating: 8.8, genre: 'Sci-Fi', posterURL: '' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
      >
        <img 
          src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200" 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-12">
          <div className="max-w-lg space-y-6">
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              Trending Now
            </motion.span>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-black text-white leading-tight"
            >
              Experience Cinema Like Never Before.
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-200 text-lg"
            >
              Book tickets for the latest blockbusters and exclusive premieres in just a few clicks.
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <Link to="/movies">
                <Button size="lg" className="gap-2">
                  <Play size={20} fill="currentColor" /> Book Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Recommended Movies */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="text-2xl font-bold text-gray-900">Recommended Movies</h3>
          <Link to="/movies" className="text-red-600 font-semibold text-sm flex items-center hover:underline">
            See All <ChevronRight size={16} />
          </Link>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="aspect-[2/3] bg-gray-200 animate-pulse rounded-xl" />)
          ) : movies.map((movie) => (
            <motion.div
              key={movie._id}
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
            >
              <Link to={`/movie/${movie._id}`}>
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-lg group-hover:shadow-red-500/20">
                  <img 
                    src={getMovieImage(movie.title, movie.posterUrl, movie.genre)} 
                    alt={movie.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
                    }}
                  />

                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    {movie.rating || 'N/A'}
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{movie.title}</h4>
                <p className="text-sm text-gray-500">{movie.genre}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
