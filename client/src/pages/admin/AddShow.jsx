import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { fadeIn } from '../../animations/variants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { ChevronLeft, Calendar, Save, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddShow = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingMovies, setFetchingMovies] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      movieId: '',
      time: '',
      totalSeats: 30 // Fixed as per requirements
    }
  });

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setFetchingMovies(true);
        const response = await adminService.getAllMovies();
        setMovies(response.data || response || []);
      } catch (error) {
        toast.error('Failed to load movies for selection');
      } finally {
        setFetchingMovies(false);
      }
    };
    loadMovies();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await adminService.addShow(data);
      toast.success('Show scheduled successfully!');
      navigate('/admin/shows');
    } catch (error) {
      toast.error(error.message || 'Failed to schedule show');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeIn}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-4">
        <Link to="/admin/shows">
          <Button variant="ghost" size="sm" className="p-2">
            <ChevronLeft size={24} />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Schedule Show</h2>
          <p className="text-gray-500 text-sm">Assign a movie to a time slot</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 flex items-center gap-2">
            <Calendar size={18} className="text-red-600" /> Show Details
          </h3>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Select Movie</label>
            <select
              {...register('movieId', { required: 'Please select a movie' })}
              className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white transition-all outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 ${errors.movieId ? 'border-red-500' : ''}`}
              disabled={fetchingMovies}
            >
              <option value="">{fetchingMovies ? 'Loading movies...' : 'Choose a movie'}</option>
              {movies.map(movie => (
                <option key={movie._id} value={movie._id}>{movie.title}</option>
              ))}
            </select>
            {errors.movieId && <p className="text-sm text-red-500">{errors.movieId.message}</p>}
          </div>

          <Input 
            label="Show Start Time" 
            type="datetime-local"
            {...register('time', { required: 'Start time is required' })}
            error={errors.time?.message}
          />

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
            <AlertCircle className="text-blue-500 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-700">
              <p className="font-bold">Note on Seats</p>
              <p>Total seats for all shows are currently fixed at <strong>30</strong> for this version of the application.</p>
            </div>
          </div>
          
          {/* Hidden input for fixed totalSeats */}
          <input type="hidden" {...register('totalSeats')} />
        </div>

        <div className="flex justify-end gap-4">
          <Link to="/admin/shows">
            <Button variant="outline" type="button" disabled={isLoading}>Cancel</Button>
          </Link>
          <Button type="submit" isLoading={isLoading} className="px-10">
            Schedule Show
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddShow;
