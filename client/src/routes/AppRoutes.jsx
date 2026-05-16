import { Routes, Route, Navigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Movies from '../pages/Movies';
import MovieDetails from '../pages/MovieDetails';
import SeatSelection from '../pages/SeatSelection';


// Admin Pages
import MovieList from '../pages/admin/MovieList';
import AddMovie from '../pages/admin/AddMovie';
import ShowList from '../pages/admin/ShowList';
import AddShow from '../pages/admin/AddShow';

const Bookings = () => <div className="text-3xl font-bold">My Bookings</div>;


const AdminDashboard = () => (
  <div className="space-y-8">
    <div className="bg-red-600 text-white p-10 rounded-3xl shadow-xl shadow-red-200">
      <h2 className="text-4xl font-black mb-2">Welcome, Admin!</h2>
      <p className="text-red-100">Manage your theater operations with ease.</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link to="/admin/movies" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
        <h3 className="text-xl font-bold mb-2 group-hover:text-red-600">Movies Management</h3>
        <p className="text-gray-500">Add, edit and delete movies from the catalog.</p>
      </Link>
      <Link to="/admin/shows" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
        <h3 className="text-xl font-bold mb-2 group-hover:text-red-600">Shows Scheduling</h3>
        <p className="text-gray-500">Schedule movies to theaters and manage seats.</p>
      </Link>
    </div>
  </div>
);
const NotFound = () => <div className="text-3xl font-bold text-center py-20">404 - Page Not Found</div>;



const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/book/:showId" element={
          <ProtectedRoute>
            <SeatSelection />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />

        
        {/* User Protected Routes */}
        <Route path="/bookings" element={
          <ProtectedRoute>
            <Bookings />
          </ProtectedRoute>
        } />
      </Route>

      {/* Admin Protected Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<MovieList />} />
        <Route path="movies/add" element={<AddMovie />} />
        <Route path="shows" element={<ShowList />} />
        <Route path="shows/add" element={<AddShow />} />
        <Route path="users" element={<div>Manage Users</div>} />
      </Route>


      {/* Fallback */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
