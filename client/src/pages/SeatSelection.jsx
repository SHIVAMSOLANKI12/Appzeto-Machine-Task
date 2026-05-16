import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Armchair, 
  ChevronLeft, 
  CreditCard, 
  Timer, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  Lock,
  XCircle,
  Info
} from 'lucide-react';
import Button from '../components/common/Button';
import { formatCurrency, formatTime } from '../utils/formatters';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { SEAT_PRICES, getSeatPrice, getSeatTier } from '../constants/seatPricing';

// Reusable Seat Component
const Seat = ({ seat, isSelected, onToggle, disabled }) => {
  const getStatusColor = () => {
    if (seat.isBooked) return 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-40';
    if (seat.isLocked && !isSelected) return 'bg-amber-100 text-amber-600 border-amber-300 border-2 cursor-not-allowed';
    if (isSelected) return 'bg-primary-600 text-white shadow-[0_0_20px_rgba(2,132,199,0.5)] -translate-y-1';
    return 'bg-white text-slate-600 border-slate-200 border hover:border-primary-400 hover:text-primary-600 hover:shadow-lg';
  };

  const getTierColor = () => {
    const tier = getSeatTier(seat.seatNumber);
    if (tier === 'Classic') return 'bg-emerald-400';
    if (tier === 'Prime') return 'bg-indigo-400';
    return 'bg-rose-400';
  };

  return (
    <motion.button
      whileHover={!disabled && !seat.isBooked && !seat.isLocked ? { scale: 1.15 } : {}}
      whileTap={!disabled && !seat.isBooked && !seat.isLocked ? { scale: 0.9 } : {}}
      disabled={disabled || seat.isBooked || (seat.isLocked && !isSelected)}
      onClick={() => onToggle(seat.seatNumber)}
      className={`relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-500 group ${getStatusColor()}`}
    >
      <Armchair size={22} className={seat.isBooked ? 'opacity-20' : ''} />
      <span className="text-[10px] font-black mt-1">{seat.seatNumber}</span>
      
      {/* Tier Indicator Dot */}
      <div className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${getTierColor()}`}></div>

      {/* Modern Tooltip */}
      {!seat.isBooked && !seat.isLocked && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-xl">
          {getSeatTier(seat.seatNumber)} • ₹{getSeatPrice(seat.seatNumber)}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
        </div>
      )}
    </motion.button>
  );
};

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
  const [conflictingSeats, setConflictingSeats] = useState([]);
  
  const timerRef = useRef(null);

  const fetchShowDetails = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const response = await axiosInstance.get(`${API_ENDPOINTS.SHOWS}/details/${showId}`);
      const foundShow = response.data || response;
      if (!foundShow) throw new Error('Show not found');
      setShow(foundShow);
    } catch (error) {
      toast.error('Failed to load cinema layout.');
      navigate('/');
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, [showId, navigate]);

  useEffect(() => {
    fetchShowDetails();
    const interval = setInterval(() => fetchShowDetails(true), 20000);
    return () => clearInterval(interval);
  }, [fetchShowDetails]);

  // Countdown Logic
  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isLocked) {
      setIsLocked(false);
      setSelectedSeats([]);
      toast.error('Session expired. Seats have been released.');
      fetchShowDetails(true);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, isLocked, fetchShowDetails]);

  const toggleSeat = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatNumber));
    } else {
      if (selectedSeats.length >= 8) {
        toast.error('You can select up to 8 seats only.');
        return;
      }
      setSelectedSeats(prev => [...prev, seatNumber]);
    }
  };

  const totals = useMemo(() => {
    const total = selectedSeats.reduce((acc, num) => acc + getSeatPrice(num), 0);
    return { amount: total, count: selectedSeats.length };
  }, [selectedSeats]);

  const handleBookingFlow = async () => {
    if (!user) {
      toast.error('Identity required. Please login.');
      return;
    }

    try {
      setBooking(true);
      setConflictingSeats([]);
      
      if (!isLocked) {
        // Step 1: Lock
        await axiosInstance.post(API_ENDPOINTS.SEATS.LOCK, {
          showId,
          seats: selectedSeats,
          userId: user?._id
        });
        setIsLocked(true);
        setTimeLeft(180); // 3 minutes
        toast.success('Seats secured! Complete payment now.');
      } else {
        // Step 2: Book
        const response = await axiosInstance.post(API_ENDPOINTS.BOOK, {
          showId,
          seats: selectedSeats,
          userId: user?._id
        });
        
        toast.success('Great! Your tickets are confirmed.');
        navigate('/booking-success', { state: { booking: response.data } });
      }
    } catch (error) {
      if (error.response?.status === 409) {
        const conflict = error.response.data.conflictingSeats || [];
        setConflictingSeats(conflict);
        toast.error('Some seats were just taken. Layout refreshed.');
        fetchShowDetails(true);
        setSelectedSeats([]);
        setIsLocked(false);
        setTimeLeft(0);
      } else {
        toast.error(error.response?.data?.message || 'Transaction failed. Try again.');
      }
    } finally {
      setBooking(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
      <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Synchronizing Theater...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Header */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <button onClick={() => navigate(-1)} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all hover:scale-110 active:scale-95">
            <ChevronLeft size={28} className="text-slate-600" />
          </button>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{show.movieId.title}</h1>
            <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5"><Info size={14} /> {show.movieId.language}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
              <span className="text-primary-600">{formatTime(show.time)}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-8 py-4 px-8 bg-slate-50/50 rounded-3xl border border-slate-100">
           {[
             { label: 'Available', color: 'bg-white border-slate-200' },
             { label: 'Your Pick', color: 'bg-primary-600' },
             { label: 'Locked', color: 'bg-amber-100 border-amber-300' },
             { label: 'Reserved', color: 'bg-slate-800 opacity-40' }
           ].map(item => (
             <div key={item.label} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-lg shadow-sm ${item.color} ${item.color.includes('border') ? 'border' : ''}`}></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
        {/* Cinema Hall */}
        <div className="xl:col-span-8 space-y-16 bg-white rounded-[4rem] p-12 md:p-24 border border-slate-200 shadow-2xl relative overflow-hidden group/theater">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>

          {/* Premium Curved Screen */}
          <div className="relative mb-32">
            <div className="h-3 w-full bg-slate-900 rounded-[50%] blur-[2px] shadow-[0_20px_50px_rgba(2,132,199,0.6)] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-primary-600/30 via-white/40 to-primary-600/30 animate-pulse"></div>
            </div>
            <div className="text-center mt-10">
              <span className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.8em] rounded-full shadow-xl">The Stage</span>
            </div>
          </div>

          {/* Seat Layout */}
          <div className="max-w-[650px] mx-auto relative z-10">
            <div className="grid grid-cols-10 gap-5 md:gap-6">
              {show.seats.map((seat) => (
                <Seat 
                  key={seat.seatNumber}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.seatNumber)}
                  onToggle={toggleSeat}
                  disabled={booking || isLocked}
                />
              ))}
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="mt-20 flex flex-wrap gap-12 justify-center pt-12 border-t border-slate-100">
            {[
              { label: 'Classic', price: SEAT_PRICES.CLASSIC, color: 'bg-emerald-400', desc: 'Rows 1-10' },
              { label: 'Prime', price: SEAT_PRICES.PRIME, color: 'bg-indigo-400', desc: 'Rows 11-20' },
              { label: 'Recliner', price: SEAT_PRICES.RECLINER, color: 'bg-rose-400', desc: 'Rows 21-30' }
            ].map(tier => (
              <div key={tier.label} className="flex flex-col items-center gap-2 group/tier">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ring-4 ring-slate-50 transition-all group-hover/tier:scale-125 ${tier.color}`}></div>
                  <span className="text-sm font-black text-slate-800">{tier.label}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">₹{tier.price} • {tier.desc}</span>
              </div>
            ))}
          </div>

          {/* Conflict Notification */}
          <AnimatePresence>
            {conflictingSeats.length > 0 && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-rose-50 border border-rose-100 p-5 rounded-3xl flex items-center gap-4 shadow-xl z-50"
              >
                <XCircle className="text-rose-500 shrink-0" size={32} />
                <div>
                  <p className="text-sm font-black text-rose-900">Seat Conflict Detected!</p>
                  <p className="text-xs text-rose-700 font-bold">Seats {conflictingSeats.join(', ')} were booked by someone else.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side Summary */}
        <div className="xl:col-span-4 space-y-8 h-full">
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden xl:sticky xl:top-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <h2 className="text-2xl font-black mb-10 flex items-center gap-4">
              <CreditCard className="text-primary-400" size={28} />
              Summary
            </h2>

            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-[11px] font-black text-primary-400 uppercase tracking-[0.25em]">Your Selection</p>
                <div className="flex flex-wrap gap-3">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.sort((a,b)=>a-b).map(num => (
                      <motion.span 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }}
                        key={num} 
                        className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-sm font-black border border-white/10"
                      >
                        {num}
                      </motion.span>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full py-8 opacity-30 gap-2 border-2 border-dashed border-white/10 rounded-3xl">
                      <Armchair size={32} />
                      <p className="text-xs font-bold uppercase tracking-widest">Select your seats</p>
                    </div>
                  )}
                </div>
              </div>

              {isLocked && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3 text-amber-400">
                    <Timer size={20} />
                    <span className="text-[11px] font-black uppercase tracking-widest">Secured Timer</span>
                  </div>
                  <div className={`text-2xl font-black ${timeLeft < 30 ? 'text-rose-500 animate-pulse' : 'text-amber-400'}`}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </div>
                </motion.div>
              )}

              <div className="pt-8 border-t border-white/5">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[11px] font-black text-primary-400 uppercase tracking-[0.25em] mb-2">Grand Total</p>
                    <p className="text-5xl font-black text-white tracking-tighter">
                      {formatCurrency(totals.amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{totals.count} Tickets</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                     <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                     <p className="text-[11px] font-medium leading-relaxed opacity-60">
                       Encrypted Transaction. Once you lock, your seats are reserved exclusively for you.
                     </p>
                  </div>

                  <Button 
                    onClick={handleBookingFlow}
                    className={`w-full h-20 text-xl font-black rounded-3xl shadow-[0_20px_50px_rgba(2,132,199,0.3)] ${isLocked ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                    loading={booking}
                    disabled={selectedSeats.length === 0}
                  >
                    {isLocked ? (
                      <span className="flex items-center gap-3">CONFIRM & PAY <CheckCircle2 size={24} /></span>
                    ) : (
                      <span className="flex items-center gap-3">LOCK SEATS <Lock size={20} /></span>
                    )}
                  </Button>
                  
                  {isLocked && (
                    <button 
                      onClick={() => { setIsLocked(false); setSelectedSeats([]); setTimeLeft(0); }}
                      className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Cancel & Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-200 flex items-start gap-5 group">
             <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:rotate-12 transition-transform">
               <AlertCircle className="text-primary-600" size={24} />
             </div>
             <div>
               <p className="text-sm font-black text-slate-800 mb-1 tracking-tight">Need Help?</p>
               <p className="text-xs text-slate-500 font-bold leading-relaxed">
                 Selected too many? Just click a selected seat again to remove it from your selection.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
