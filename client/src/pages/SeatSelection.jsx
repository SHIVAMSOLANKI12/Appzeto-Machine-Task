import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Armchair, 
  ChevronLeft, 
  CreditCard, 
  Timer, 
  Info, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Lock
} from 'lucide-react';
import Button from '../components/common/Button';
import { formatCurrency, formatTime } from '../utils/formatters';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  
  const timerRef = useRef(null);

  const fetchShowDetails = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const response = await axiosInstance.get(`${API_ENDPOINTS.SHOWS}/details/${showId}`);
      const foundShow = response.data || response;
      if (!foundShow) throw new Error('Show not found');
      setShow(foundShow);

    } catch (error) {
      toast.error('Failed to load seats. Returning to home.');
      navigate('/');
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, [showId, navigate]);

  useEffect(() => {
    fetchShowDetails();
    // Auto-refresh every 30 seconds to keep seats in sync
    const interval = setInterval(() => fetchShowDetails(true), 30000);
    return () => clearInterval(interval);
  }, [fetchShowDetails]);

  // Countdown Timer Logic
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isLocked) {
      setIsLocked(false);
      setSelectedSeats([]);
      toast.error('Seat lock expired! Please select seats again.');
      fetchShowDetails(true);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, isLocked, fetchShowDetails]);

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 10) {
        toast.error('Maximum 10 seats allowed');
        return;
      }
      setSelectedSeats(prev => [...prev, seatNumber]);
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatNum) => {
      if (seatNum <= 10) return total + 150;
      if (seatNum <= 20) return total + 180;
      return total + 200;
    }, 0);
  };

  const handleBookingFlow = async () => {
    if (!user) {
      toast.error('Please login to continue');
      return;
    }

    try {
      setBooking(true);
      
      // Step 1: Attempt to Lock Seats
      if (!isLocked) {
        await axiosInstance.post(API_ENDPOINTS.SEATS.LOCK, {
          showId,
          seats: selectedSeats,
          userId: user?._id || 'user_001'
        });
        setIsLocked(true);
        setTimeLeft(120); // 2 minutes lock
        toast.success('Seats locked for 2 minutes!');
      } else {
        // Step 2: Finalize Booking
        const response = await axiosInstance.post(API_ENDPOINTS.BOOK, {
          showId,
          seats: selectedSeats,
          userId: user?._id || 'user_001'
        });
        
        toast.success('Tickets booked successfully!');
        navigate('/booking-success', { state: { booking: response.data } });
      }
    } catch (error) {
      if (error.response?.status === 409) {
        const conflicting = error.response.data.conflictingSeats || [];
        toast.error(`Seats ${conflicting.join(', ')} are no longer available.`);
        fetchShowDetails(true);
        setSelectedSeats([]);
        setIsLocked(false);
        setTimeLeft(0);
      } else {
        toast.error(error.response?.data?.message || 'Booking failed');
      }
    } finally {
      setBooking(false);
    }
  };

  const getSeatColor = (seat) => {
    if (seat.isBooked) return 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50';
    if (seat.isLocked && !selectedSeats.includes(seat.seatNumber)) return 'bg-amber-100 text-amber-600 border-amber-300 border-2 cursor-not-allowed';
    if (selectedSeats.includes(seat.seatNumber)) return 'bg-primary-600 text-white shadow-xl shadow-primary-200 -translate-y-1';
    return 'bg-white text-slate-600 border-slate-200 border hover:border-primary-400 hover:text-primary-600';
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh] text-primary-600 font-black animate-pulse">PREPARING CINEMA...</div>;

  if (!show) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <p className="text-slate-500 font-bold">Show data not found or failed to load.</p>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
            <ChevronLeft size={24} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 leading-none mb-2">{show.movieId.title}</h1>
            <div className="flex items-center gap-3 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <span>{show.movieId.language}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
              <span>{formatTime(show.time)}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 px-6 border-l-0 md:border-l border-slate-100">
           {[
             { label: 'Available', color: 'bg-white border-slate-200' },
             { label: 'Selected', color: 'bg-primary-600' },
             { label: 'Locked', color: 'bg-amber-100 border-amber-300' },
             { label: 'Booked', color: 'bg-slate-800' }
           ].map(item => (
             <div key={item.label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-md shadow-sm ${item.color} ${item.color.includes('border') ? 'border' : ''}`}></div>
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{item.label}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Theater View */}
        <div className="lg:col-span-8 space-y-12 bg-white rounded-[3rem] p-10 md:p-16 border border-slate-200 shadow-sm overflow-x-auto">
          {/* Screen */}
          <div className="relative mb-24 px-12">
            <div className="h-2 w-full bg-slate-800 rounded-full shadow-[0_15px_40px_rgba(2,132,199,0.4)] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-primary-600/50 via-white/20 to-primary-600/50"></div>
            </div>
            <p className="text-center text-[11px] font-black uppercase tracking-[0.6em] text-slate-400 mt-6 opacity-60">This is the Screen</p>
          </div>

          {/* Seat Grid */}
          <div className="max-w-[600px] mx-auto">
            <div className="grid grid-cols-10 gap-4">
              {show.seats.map((seat) => (
                <motion.button
                  key={seat.seatNumber}
                  whileHover={!seat.isBooked && !seat.isLocked ? { scale: 1.1 } : {}}
                  whileTap={!seat.isBooked && !seat.isLocked ? { scale: 0.95 } : {}}
                  disabled={seat.isBooked || (seat.isLocked && !selectedSeats.includes(seat.seatNumber))}
                  onClick={() => toggleSeat(seat.seatNumber)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative group ${getSeatColor(seat)}`}
                >
                  <Armchair size={20} className={seat.isBooked ? 'opacity-30' : ''} />
                  <span className="text-[9px] font-black mt-1">{seat.seatNumber}</span>
                  
                  {/* Category Indicator */}
                  <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${
                    seat.seatNumber <= 10 ? 'bg-emerald-400' : seat.seatNumber <= 20 ? 'bg-indigo-400' : 'bg-primary-500'
                  }`}></div>

                  {/* Tooltip */}
                  {!seat.isBooked && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap">
                      {seat.seatNumber <= 10 ? 'Classic - ₹150' : seat.seatNumber <= 20 ? 'Prime - ₹180' : 'Recliner - ₹200'}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-wrap gap-8 justify-center border-t border-slate-100 pt-10">
            {[
              { label: 'Classic', price: 150, color: 'bg-emerald-400' },
              { label: 'Prime', price: 180, color: 'bg-indigo-400' },
              { label: 'Recliner', price: 200, color: 'bg-primary-500' }
            ].map(tier => (
              <div key={tier.label} className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${tier.color}`}></div>
                <span className="text-sm font-black text-slate-700">{tier.label} <span className="text-slate-400 ml-1">₹{tier.price}</span></span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-24">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <CreditCard className="text-primary-400" />
              Checkout
            </h2>

            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-2">Selected Seats</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.length > 0 ? (
                      selectedSeats.sort((a,b)=>a-b).map(num => (
                        <span key={num} className="px-3 py-1 bg-white/10 rounded-lg text-sm font-black border border-white/5">
                          {num}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 font-bold italic">No seats selected</span>
                    )}
                  </div>
                </div>
                {isLocked && (
                  <div className="flex flex-col items-end">
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.1em] mb-2">Time Left</p>
                    <div className="flex items-center gap-2 text-amber-400 font-black text-xl">
                      <Timer size={18} />
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] font-black text-primary-400 uppercase tracking-[0.2em] mb-2">Total Amount</p>
                <p className="text-5xl font-black text-white">
                  {formatCurrency(calculateTotal())}
                </p>
              </div>

              <div className="space-y-4 pt-6">
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                   <ShieldCheck className="text-emerald-400 shrink-0" size={20} />
                   <p className="text-[11px] font-medium leading-relaxed opacity-60">
                     Seats will be locked for {isLocked ? 'the remainder of the timer' : '2 minutes'} once you proceed.
                   </p>
                </div>

                <Button 
                  onClick={handleBookingFlow}
                  className={`w-full h-16 text-lg font-black shadow-2xl ${isLocked ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  loading={booking}
                  disabled={selectedSeats.length === 0}
                >
                  {isLocked ? (
                    <>CONFIRM PAYMENT <CheckCircle2 size={22} className="ml-2" /></>
                  ) : (
                    <>LOCK & PROCEED <Lock size={20} className="ml-2" /></>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 flex items-start gap-4">
             <AlertCircle className="text-primary-600 shrink-0" size={24} />
             <div>
               <p className="text-sm font-black text-slate-800 mb-1">Double-Booking Protection</p>
               <p className="text-xs text-slate-500 font-bold leading-relaxed">
                 Our atomic transaction system ensures that once you lock your seats, no one else can grab them.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
