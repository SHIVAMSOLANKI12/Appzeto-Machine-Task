import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">B</div>
              <span className="text-xl font-bold text-slate-800 hidden sm:block">
                BookMyShow Lite++
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-slate-600 font-medium">Movies</Link>
            {user && <Link to="/bookings" className="text-slate-600 font-medium">My Bookings</Link>}
            {isAdmin && <Link to="/admin" className="text-slate-600 font-medium">Admin</Link>}
            {user ? (
              <button onClick={handleLogout} className="text-red-500 font-medium">Logout</button>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} BookMyShow Lite++. Built for Machine Rounds.
      </footer>
    </div>
  );
};

export default AppLayout;
