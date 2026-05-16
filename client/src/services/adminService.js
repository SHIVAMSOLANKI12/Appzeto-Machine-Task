import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const adminService = {
  // Movies
  getAllMovies: () => axiosInstance.get(API_ENDPOINTS.ADMIN.MOVIES),
  addMovie: (movieData) => axiosInstance.post(API_ENDPOINTS.ADMIN.MOVIES, movieData),
  updateMovie: (id, movieData) => axiosInstance.put(`${API_ENDPOINTS.ADMIN.MOVIES}/${id}`, movieData),
  deleteMovie: (id) => axiosInstance.delete(`${API_ENDPOINTS.ADMIN.MOVIES}/${id}`),

  // Shows
  getAllShows: () => axiosInstance.get(API_ENDPOINTS.ADMIN.SHOWS),
  addShow: (showData) => axiosInstance.post(API_ENDPOINTS.ADMIN.SHOWS, showData),
  deleteShow: (id) => axiosInstance.delete(`${API_ENDPOINTS.ADMIN.SHOWS}/${id}`),
};
