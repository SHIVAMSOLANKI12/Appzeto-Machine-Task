import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { fadeIn, staggerContainer } from '../../animations/variants';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';
import { Plus, Trash2, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMovieImage } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ShowList = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShows();
  }, []);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllShows();
      setShows(response.data || response || []);
    } catch (error) {
      console.error('Failed to fetch shows:', error);
      // Mock data
      setShows([
        { _id: '1', movieId: { title: 'The Batman' }, time: '2026-05-20T18:00:00.000Z', totalSeats: 30, availableSeats: 25 },
        { _id: '2', movieId: { title: 'Inception' }, time: '2026-05-20T21:00:00.000Z', totalSeats: 30, availableSeats: 10 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this show?')) {
      try {
        await adminService.deleteShow(id);
        toast.success('Show deleted successfully');
        setShows(shows.filter(s => s._id !== id));
      } catch (error) {
        toast.error('Failed to delete show');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Shows</h2>
          <p className="text-gray-500 text-sm">Schedule and monitor movie screenings</p>
        </div>
        <Link to="/admin/shows/add">
          <Button className="gap-2">
            <Plus size={20} /> Schedule New Show
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Movie</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Seats</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-40" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-5 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-8 w-8 ml-auto" /></td>
                </tr>
              ))
            ) : shows.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-gray-500">
                  No shows scheduled yet
                </td>
              </tr>
            ) : (
              shows.map((show) => (
                <tr key={show._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img src={getMovieImage(show.movieId?.title, show.movieId?.posterUrl, show.movieId?.genre)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-gray-900">{show.movieId?.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(show.time).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 font-medium text-gray-900">
                        <Clock size={14} className="text-gray-400" />
                        {new Date(show.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-400" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{show.availableSeats} / {show.totalSeats}</span>
                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${show.availableSeats < 5 ? 'bg-red-500' : 'bg-green-500'}`} 
                            style={{ width: `${(show.availableSeats / show.totalSeats) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="p-2"
                      onClick={() => handleDelete(show._id)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowList;
