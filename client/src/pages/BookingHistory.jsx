import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { motion } from 'framer-motion';
import { Ticket, Calendar, Clock, MapPin, Receipt, ChevronRight, Filter } from 'lucide-react';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters';
import { getMovieImage } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const BookingHistory = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, page]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const userId = user?._id || 'user_001';
      const response = await axiosInstance.get(`${API_ENDPOINTS.BOOKINGS}/${userId}?page=${page}&limit=5`);
      setBookings(response.data || []);
      setTotalPages(response.pagination?.pages || 1);
    } catch (error) {
      toast.error('Failed to load booking history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800">My Bookings</h1>
          <p className="text-slate-500 font-bold mt-2">Manage your movie tickets and past experiences.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
          <Filter size={18} className="text-primary-600" />
          <span className="text-sm font-black text-slate-700">All Time</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 w-full bg-slate-100 rounded-[2rem] animate-pulse"></div>
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div 
              key={booking._id}
              className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="flex flex-col md:flex-row">
                {/* Movie Poster & Basic Info */}
                <div className="p-6 md:p-8 flex gap-6 md:w-3/5 border-b md:border-b-0 md:border-r border-slate-100">
                   <div className="w-24 h-32 md:w-32 md:h-44 rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                     <img 
                        src={getMovieImage(booking.movieId?.title, booking.movieId?.posterUrl)} 
                        className="w-full h-full object-cover" 
                        alt="Poster" 
                     />
                   </div>
                   <div className="flex flex-col justify-center">
                     <div className="mb-4">
                        <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight mb-1">
                          {booking.movieId?.title || 'Unknown Movie'}
                        </h2>
                        <p className="text-xs font-black text-primary-600 uppercase tracking-widest">
                          {booking.movieId?.language || 'English'}
                        </p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                          <Calendar size={16} className="text-primary-400" />
                          {formatDate(booking.showId?.time)}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                          <Clock size={16} className="text-primary-400" />
                          {formatTime(booking.showId?.time)}
                        </div>
                     </div>
                   </div>
                </div>

                {/* Seat & Price Breakdown */}
                <div className="p-6 md:p-8 bg-slate-50/50 flex flex-col justify-between md:w-2/5">
                   <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seat Numbers</p>
                          <div className="flex items-center gap-2 text-slate-800 font-black">
                            <Ticket size={16} className="text-primary-600" />
                            {booking.seats.join(', ')}
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase tracking-widest">
                          Confirmed
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Price</p>
                        <p className="text-2xl font-black text-slate-800">{formatCurrency(booking.totalPrice)}</p>
                      </div>
                   </div>

                   <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-white rounded-xl border border-slate-200 text-slate-600 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                     View E-Ticket
                     <ChevronRight size={14} />
                   </button>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-8">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-black transition-all ${
                    page === i + 1 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:border-primary-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <Receipt className="mx-auto text-slate-200 mb-6" size={80} />
          <h3 className="text-2xl font-black text-slate-800">No bookings yet</h3>
          <p className="text-slate-500 font-bold mt-2">Your movie adventures will appear here.</p>
          <button className="mt-8 px-8 py-4 bg-primary-600 text-white rounded-2xl font-black shadow-xl shadow-primary-100 hover:-translate-y-1 transition-transform">
            Browse Movies
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
