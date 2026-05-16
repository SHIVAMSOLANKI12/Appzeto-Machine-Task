import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { fadeIn, staggerContainer } from '../../animations/variants';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';
import { Plus, Edit, Trash2, Film, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMovieImage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllMovies();
      // Adjust depending on API response structure. Assuming { success: true, data: [...] }
      setMovies(response.data || response || []);
    } catch (error) {
      console.error('Failed to fetch movies:', error);
      // Mock data for development if API fails
      setMovies([
        { _id: '1', title: 'The Batman', genre: 'Action', duration: 176, rating: 8.5, posterURL: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=200' },
        { _id: '2', title: 'Inception', genre: 'Sci-Fi', duration: 148, rating: 8.8, posterURL: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=200' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await adminService.deleteMovie(id);
        toast.success('Movie deleted successfully');
        setMovies(movies.filter(m => m._id !== id));
      } catch (error) {
        toast.error('Failed to delete movie');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Movies</h2>
          <p className="text-gray-500 text-sm">Add, edit or remove movies from the catalog</p>
        </div>
        <Link to="/admin/movies/add">
          <Button className="gap-2">
            <Plus size={20} /> Add New Movie
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <Skeleton className="aspect-[2/3] w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-100">
          <Film className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900">No movies found</h3>
          <p className="text-gray-500 mb-6">Start by adding your first movie</p>
          <Link to="/admin/movies/add">
            <Button variant="outline">Add Movie</Button>
          </Link>
        </div>
      ) : (
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie._id}
              variants={fadeIn}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="relative aspect-[2/3]">
                <img 
                  src={getMovieImage(movie.title, movie.posterUrl, movie.genre)} 
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button variant="secondary" size="sm" className="bg-white text-gray-900 hover:bg-gray-100 border-none">
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    className="bg-red-500 text-white hover:bg-red-600 border-none"
                    onClick={() => handleDelete(movie._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {movie.genre}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-gray-900 truncate mb-1">{movie.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-700">{movie.rating || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{movie.duration} mins</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MovieList;
