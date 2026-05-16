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
import Signup from '../pages/Signup';
import BookingSuccess from '../pages/BookingSuccess';
import BookingHistory from '../pages/BookingHistory';


// Admin Pages
import MovieList from '../pages/admin/MovieList';
import AddMovie from '../pages/admin/AddMovie';
import ShowList from '../pages/admin/ShowList';
import AddShow from '../pages/admin/AddShow';
import AdminDashboard from '../pages/admin/AdminDashboard';
import NotFound from '../pages/NotFound';



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
        <Route path="/signup" element={<Signup />} />

        <Route path="/booking-success" element={
          <ProtectedRoute>
            <BookingSuccess />
          </ProtectedRoute>
        } />

        {/* User Protected Routes */}
        <Route path="/bookings" element={
          <ProtectedRoute>
            <BookingHistory />
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
