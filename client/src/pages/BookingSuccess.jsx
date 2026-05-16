import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Ticket, ChevronRight, Home, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import { formatDate, formatTime, formatCurrency } from '../utils/formatters';

const BookingSuccess = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) return <Navigate to="/" replace />;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden"
      >
        {/* Header Branding */}
        <div className="bg-primary-600 p-10 text-center text-white relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/30"
          >
            <CheckCircle size={40} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-black mb-2">Booking Confirmed!</h1>
          <p className="text-primary-100 font-bold opacity-80 uppercase tracking-widest text-xs">Order ID: #{booking._id.slice(-8)}</p>
          
          {/* Confetti-like shapes */}
          <div className="absolute top-4 left-4 w-12 h-12 border-4 border-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 right-10 w-16 h-16 border-4 border-white/10 rounded-3xl rotate-12 animate-bounce"></div>
        </div>

        <div className="p-8 md:p-12 space-y-10">
          {/* Movie Info Card */}
          <div className="flex items-center gap-6">
            <img 
              src={booking.showId?.movieId?.posterUrl || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200'} 
              className="w-24 h-32 rounded-2xl object-cover shadow-lg border border-slate-100" 
              alt="Poster" 
            />
            <div>
              <h2 className="text-2xl font-black text-slate-800">{booking.showId?.movieId?.title}</h2>
              <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mt-1">
                <Calendar size={14} className="text-primary-600" />
                {formatDate(booking.showId?.time)} • {formatTime(booking.showId?.time)}
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">
                <MapPin size={14} />
                Main Theater • Hall A
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 border-y border-slate-100 py-8">
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Seats</p>
              <div className="flex items-center gap-2 text-slate-800">
                <Ticket size={18} className="text-primary-600" />
                <span className="font-black text-lg">{booking.seats.join(', ')}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Amount Paid</p>
              <p className="text-2xl font-black text-primary-600">{formatCurrency(booking.totalPrice)}</p>
            </div>
          </div>

          <div className="space-y-4">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600 shrink-0">
                  <Ticket size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">E-Ticket Ready</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    A confirmation email has been sent to your registered address. You can also show this screen at the cinema entrance.
                  </p>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/bookings" className="flex-1">
              <Button variant="outline" className="w-full h-14 font-black">
                View All Bookings
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full h-14 font-black">
                Back to Home
                <Home size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
