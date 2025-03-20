'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getMovieDetails, getMovieImageUrl } from '@/services/tmdb';
import Layout from '@/components/Layout';
import { StarIcon } from '@heroicons/react/20/solid';

export default function MovieDetail({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await getMovieDetails(parseInt(params.id));
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.includes(parseInt(params.id)));
  }, [params.id]);

  const handleFavoriteToggle = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const newFavorites = isFavorite
      ? favorites.filter((id: number) => id !== parseInt(params.id))
      : [...favorites, parseInt(params.id)];
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
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
            <img
              src={getMovieImageUrl(movie.poster_path, 'original')}
              alt={movie.title}
              className="rounded-lg object-cover w-full h-full"
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
              <p><span className="font-semibold">Genres:</span> {movie.genres.map((genre: any) => genre.name).join(', ')}</p>
            </div>
            <button
              onClick={handleFavoriteToggle}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium ${
                isFavorite
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 