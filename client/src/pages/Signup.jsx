import { useState } from 'react';
import { motion } from 'framer-motion';
import { scaleUp } from '../animations/variants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);
    
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password
      });

      if (response.data.success) {
        login(response.data.data);
        toast.success(`Account created successfully! Welcome, ${response.data.data.name}`);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <motion.div
        variants={scaleUp}
        initial="initial"
        animate="animate"
        className="w-full max-w-md bg-white p-10 rounded-2xl shadow-2xl border border-gray-100"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join BMS Lite++ for the best experience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input 
            label="Full Name" 
            name="name"
            placeholder="Enter your name"
            type="text"
            required
            value={name}
            onChange={handleChange}
          />

          <Input 
            label="Email Address" 
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            value={email}
            onChange={handleChange}
          />
          
          <Input 
            label="Password" 
            name="password"
            placeholder="••••••••"
            type="password"
            required
            value={password}
            onChange={handleChange}
          />

          <Input 
            label="Confirm Password" 
            name="confirmPassword"
            placeholder="••••••••"
            type="password"
            required
            value={confirmPassword}
            onChange={handleChange}
          />

          <Button 
            type="submit" 
            className="w-full py-4 text-lg mt-2" 
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Already have an account? <Link to="/login" className="text-red-600 font-bold hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
