import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const movieService = {
  getMovies: () => axiosInstance.get(API_ENDPOINTS.MOVIES),
  getMovieDetails: (id) => axiosInstance.get(`${API_ENDPOINTS.MOVIES}/${id}`),
};
