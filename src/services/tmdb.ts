import axios from 'axios';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!TMDB_API_KEY) {
  console.error('TMDB API key is not set in environment variables');
}

const api = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('TMDB API authentication failed. Please check your API key.');
    }
    return Promise.reject(error);
  }
);

interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export const getPopularMovies = async (page = 1): Promise<MovieResponse> => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured');
    }
    const response = await api.get<MovieResponse>('/movie/popular', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1): Promise<MovieResponse> => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured');
    }
    const response = await api.get<MovieResponse>('/search/movie', {
      params: { query, page }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id: string): Promise<Movie> => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured');
    }
    const response = await api.get<Movie>(`/movie/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMovieCredits = async (id: string) => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured');
    }
    const response = await api.get(`/movie/${id}/credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
};

export const getMovieReviews = async (id: string) => {
  try {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key is not configured');
    }
    const response = await api.get(`/movie/${id}/reviews`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    throw error;
  }
};

export const getMovieImageUrl = (path: string, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}; 