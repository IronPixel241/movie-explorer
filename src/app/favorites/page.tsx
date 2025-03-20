'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getMovieDetails } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import Layout from '@/components/Layout';
import { Movie } from '@/types/movie';

export default function FavoritesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavoriteIds(favorites);
  }, []);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        const movies = await Promise.all(
          favoriteIds.map((id) => getMovieDetails(id))
        );
        setFavoriteMovies(movies.filter((movie): movie is Movie => movie !== null));
      } catch (error) {
        console.error('Error fetching favorite movies:', error);
      } finally {
        setLoading(false);
      }
    };

    if (favoriteIds.length > 0) {
      fetchFavoriteMovies();
    } else {
      setLoading(false);
    }
  }, [favoriteIds]);

  const handleFavoriteToggle = (movieId: number) => {
    const newFavorites = favoriteIds.filter((id) => id !== movieId);
    setFavoriteIds(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setFavoriteMovies(favoriteMovies.filter((movie) => movie.id !== movieId));
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Favorite Movies</h1>
        {favoriteMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">You haven&apos;t added any movies to your favorites yet.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={true}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 