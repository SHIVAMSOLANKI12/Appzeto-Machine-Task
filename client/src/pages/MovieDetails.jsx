import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { movieService } from '../services/movieService';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { fadeIn, scaleUp } from '../animations/variants';
import Button from '../components/common/Button';
import Skeleton from '../components/common/Skeleton';
import { Star, Clock, Calendar, Globe, Play, User, Ticket } from 'lucide-react';
import { formatTime, formatDate } from '../utils/formatters';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Fetch Movie Details
        const movieRes = await movieService.getMovieDetails(id);
        setMovie(movieRes.data || movieRes);

        // Fetch Shows for this movie using the specific movie endpoint
        const showsRes = await axiosInstance.get(`${API_ENDPOINTS.SHOWS}/${id}`);
        setShows(showsRes.data || showsRes || []);

      } catch (error) {
        console.error('Failed to fetch details:', error);
        // Fallback mock
        setMovie({
          _id: id,
          title: 'The Batman',
          description: 'When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
          rating: 8.5,
          genre: 'Action, Crime, Drama',
          duration: 176,
          language: 'English',
          releaseDate: '2022-03-04',
          posterURL: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=400',
          bannerURL: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200',
          cast: [
            { name: 'Robert Pattinson', role: 'Bruce Wayne / Batman', image: 'https://ui-avatars.com/api/?name=RP' },
            { name: 'Zoë Kravitz', role: 'Selina Kyle / Catwoman', image: 'https://ui-avatars.com/api/?name=ZK' }
          ]
        });
        setShows([
          { _id: 'show_001', startTime: new Date().setHours(18, 0, 0, 0), totalSeats: 30, availableSeats: 25 },
          { _id: 'show_002', startTime: new Date().setHours(21, 0, 0, 0), totalSeats: 30, availableSeats: 10 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const scrollToShows = () => {
    const element = document.getElementById('available-shows');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-12">
        <Skeleton className="h-[400px] w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      className="space-y-12 pb-20"
    >
      {/* Banner Section */}
      <section className="relative h-[450px] -mx-4 sm:-mx-6 lg:-mx-8 lg:h-[500px] overflow-hidden">
        <img 
          src={movie.bannerURL || movie.posterURL} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-end">
            <motion.div 
              variants={scaleUp}
              className="w-48 lg:w-64 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 hidden md:block"
            >
              <img src={movie.posterURL} alt={movie.title} className="w-full h-full object-cover" />
            </motion.div>
            
            <div className="flex-grow space-y-4">
              <div className="flex flex-wrap gap-2">
                {movie.genre?.split(',').map(g => (
                  <span key={g} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-wider border border-white/10">
                    {g.trim()}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-white">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-300 font-medium">
                <div className="flex items-center gap-2">
                  <Star size={20} className="text-red-500 fill-red-500" />
                  <span className="text-white text-xl font-bold">{movie.rating}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{movie.duration} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={18} />
                  <span>{movie.language}</span>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <Button size="lg" className="px-12 h-14 text-lg" onClick={scrollToShows}>Book Tickets</Button>
                <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-14">
                  <Play size={20} className="mr-2" /> Watch Trailer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Shows Section */}
          <section id="available-shows" className="space-y-6 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Ticket size={24} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Available Shows</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {shows.length > 0 ? (
                shows.map(show => (
                  <Link 
                    key={show._id} 
                    to={`/book/${show._id}`}
                    className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all flex justify-between items-center"
                  >
                    <div>
                      <p className="text-lg font-black text-gray-900">{formatTime(show.startTime)}</p>
                      <p className="text-sm text-gray-500 font-medium">{formatDate(show.startTime)}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${show.availableSeats < 5 ? 'text-red-500' : 'text-green-600'}`}>
                        {show.availableSeats} Seats Left
                      </p>
                      <Button variant="ghost" size="sm" className="group-hover:bg-red-600 group-hover:text-white transition-colors">
                        Select
                      </Button>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                  <p className="text-gray-500 font-bold">No shows available for this movie currently.</p>
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">About the Movie</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {movie.description}
            </p>
          </section>

          {movie.cast && movie.cast.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Cast & Crew</h2>
              <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar">
                {movie.cast.map((person, idx) => (
                  <div key={idx} className="flex-shrink-0 text-center space-y-3 group">
                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-red-600 transition-colors">
                      <img src={person.image || `https://ui-avatars.com/api/?name=${person.name}`} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-500 uppercase font-semibold tracking-tighter">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar / Offers */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <User size={18} className="text-red-600" /> Applicable Offers
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase mb-1">ICICI Bank Offer</p>
                <p className="text-sm text-gray-700">Get 20% off up to ₹150 on your first booking.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Filmy Pass</p>
                <p className="text-sm text-gray-700">Save ₹75 on your next 3 movie bookings.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetails;
