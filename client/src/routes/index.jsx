import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';

import Home from '../pages/Home';

import MovieDetails from '../pages/MovieDetails';
import SeatSelection from '../pages/SeatSelection';
import BookingSuccess from '../pages/BookingSuccess';
import BookingHistory from '../pages/BookingHistory';

import AdminLayout from '../pages/admin/AdminLayout';
import MovieListAdmin from '../pages/admin/MovieList';
import AddMovie from '../pages/admin/AddMovie';
import ShowList from '../pages/admin/ShowList';
import AddShow from '../pages/admin/AddShow';

// Mock components for now (will be implemented in next steps)
const Login = () => <div className="text-2xl font-bold">Login coming soon...</div>;
const Register = () => <div className="text-2xl font-bold">Register coming soon...</div>;

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen text-primary-600 font-bold">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="movie/:id" element={<MovieDetails />} />
        <Route path="login" element={<Login />} />

        {/* User Protected Routes */}
        <Route
          path="shows/:showId"
          element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="booking-success"
          element={
            <ProtectedRoute>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings"
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MovieListAdmin />} />
          <Route path="movies" element={<MovieListAdmin />} />
          <Route path="add-movie" element={<AddMovie />} />
          <Route path="shows" element={<ShowList />} />
          <Route path="add-show" element={<AddShow />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
