import axios from 'axios';
import { Movie, MovieResponse, MovieDetails } from '@/types/movie';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getPopularMovies = async (page: number = 1): Promise<MovieResponse> => {
  const response = await tmdbApi.get('/movie/popular', {
    params: { page },
  });
  return response.data;
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query, page },
  });
  return response.data;
};

export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const response = await tmdbApi.get(`/movie/${movieId}`);
  return response.data;
};

export const getMovieImageUrl = (path: string, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}; 