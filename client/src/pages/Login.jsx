import { useState } from 'react';
import { motion } from 'framer-motion';
import { scaleUp } from '../animations/variants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });

      if (response.data.success) {
        login(response.data.data);
        toast.success(`Welcome back, ${response.data.data.name}!`);
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        variants={scaleUp}
        initial="initial"
        animate="animate"
        className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900">Sign In</h2>
          <p className="text-gray-500 mt-2">Unlock a world of entertainment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Address" 
            placeholder="Enter your email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Input 
            label="Password" 
            placeholder="••••••••"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-red-600 font-semibold hover:underline">Forgot password?</a>
          </div>

          <Button 
            type="submit" 
            className="w-full py-4 text-lg" 
            isLoading={isLoading}
          >
            Sign In
          </Button>

        </form>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Don't have an account? <Link to="/signup" className="text-red-600 font-bold hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
