import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="space-y-8"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              y: [0, -5, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-red-500"
          >
            <AlertTriangle size={120} strokeWidth={1.5} />
          </motion.div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-black text-gray-900">
            404
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-4">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Oops! Lost in the Cinema?</h1>
          <p className="text-gray-500 font-medium">
            The page you are looking for doesn't exist or has been moved to a different theater.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/">
            <Button size="lg" className="gap-2 px-8">
              <Home size={20} /> Back to Home
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-100 rounded-full blur-3xl opacity-30 -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10"></div>
    </div>
  );
};

export default NotFound;
