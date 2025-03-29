'use client';

import { useEffect, useState } from 'react';
import { getMovieDetails, getMovieImageUrl } from '@/services/tmdb';
import Layout from '@/components/Layout';
import { StarIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { useFavorites } from '@/contexts/FavoritesContext';

interface Genre {
  id: number;
  name: string;
}

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Genre[];
}

export default function MovieDetail({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const movieId = parseInt(params.id);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleFavoriteToggle = async () => {
    if (isFavorite(movieId)) {
      await removeFromFavorites(movieId);
    } else {
      await addToFavorites(movieId);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Movie not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-[500px]">
            <Image
              src={getMovieImageUrl(movie.poster_path, 'original')}
              alt={movie.title}
              fill
              className="rounded-lg object-cover"
              priority
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{movie.title}</h1>
            <div className="flex items-center space-x-2">
              <StarIcon className="h-5 w-5 text-yellow-400" />
              <span className="text-lg text-gray-600">{movie.vote_average.toFixed(1)}</span>
            </div>
            <p className="text-gray-600">{movie.overview}</p>
            <div className="space-y-2">
              <p><span className="font-semibold">Release Date:</span> {movie.release_date}</p>
              <p><span className="font-semibold">Runtime:</span> {movie.runtime} minutes</p>
              <p><span className="font-semibold">Genres:</span> {movie.genres.map((genre) => genre.name).join(', ')}</p>
            </div>
            <button
              onClick={handleFavoriteToggle}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                isFavorite(movieId)
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              {isFavorite(movieId) ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 