import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, User, Menu, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-1">
            <div className="bg-red-600 text-white font-black text-2xl px-2 py-0.5 rounded italic">
              BMS
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tighter">LITE++</span>
          </Link>

          <div className="hidden md:flex items-center bg-gray-100 border border-gray-200 rounded-md px-4 py-2 w-96">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for Movies, Events, Plays and more"
              className="bg-transparent border-none outline-none ml-2 w-full text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-1 text-gray-600 hover:text-red-600 cursor-pointer transition-colors">
            <MapPin size={18} />
            <span className="text-sm font-medium">Mumbai</span>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard size={16} />
                    Admin
                  </Button>
                </Link>
              )}
              <div className="group relative">
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 z-50">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Bookings</Link>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
          
          <button className="md:hidden p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="bg-gray-50 border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-10 flex items-center justify-between text-xs font-medium text-gray-700">
          <div className="flex items-center gap-6">
            <Link to="/movies" className="hover:text-red-600 transition-colors">Movies</Link>
            <Link to="/stream" className="hover:text-red-600 transition-colors">Stream</Link>
            <Link to="/events" className="hover:text-red-600 transition-colors">Events</Link>
            <Link to="/plays" className="hover:text-red-600 transition-colors">Plays</Link>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-red-600 cursor-pointer">ListYourShow</span>
            <span className="hover:text-red-600 cursor-pointer">Corporates</span>
            <span className="hover:text-red-600 cursor-pointer">Offers</span>
            <span className="hover:text-red-600 cursor-pointer">Gift Cards</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

