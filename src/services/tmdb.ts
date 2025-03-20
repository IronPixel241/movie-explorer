import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_API_URL,
  params: {
    api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  },
});

export const getPopularMovies = async (page = 1) => {
  const response = await api.get('/movie/popular', {
    params: { page },
  });
  return response.data;
};

export const searchMovies = async (query: string, page = 1) => {
  const response = await api.get('/search/movie', {
    params: { query, page },
  });
  return response.data;
};

export const getMovieDetails = async (id: string, page = 1) => {
  const response = await api.get(`/movie/${id}`, {
    params: { page },
  });
  return response.data;
};

export const getMovieCredits = async (id: string, page = 1) => {
  const response = await api.get(`/movie/${id}/credits`, {
    params: { page },
  });
  return response.data;
};

export const getMovieReviews = async (id: string, page = 1) => {
  const response = await api.get(`/movie/${id}/reviews`, {
    params: { page },
  });
  return response.data;
};

export const getMovieImageUrl = (path: string, size: 'w500' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}; 