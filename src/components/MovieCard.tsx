'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getMovieImageUrl } from '@/services/tmdb';
import { StarIcon } from '@heroicons/react/20/solid';

interface MovieCardProps {
  movie: Movie;
  onFavoriteToggle?: (movieId: number) => void;
  isFavorite?: boolean;
}

export default function MovieCard({ movie, onFavoriteToggle, isFavorite }: MovieCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button
    if (onFavoriteToggle) {
      onFavoriteToggle(movie.id);
    }
  };

  return (
    <Link href={`/movie/${movie.id}`} className="block">
      <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="aspect-w-2 aspect-h-3 relative h-[300px]">
          <Image
            src={getMovieImageUrl(movie.poster_path)}
            alt={movie.title}
            fill
            className="object-cover group-hover:opacity-75 transition-opacity duration-200"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-indigo-600">
            {movie.title}
          </h3>
          <div className="mt-2 flex items-center">
            <StarIcon className="h-5 w-5 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">
              {movie.vote_average?.toFixed(1) || 'N/A'}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{movie.overview || 'No description available'}</p>
          {onFavoriteToggle && (
            <button
              onClick={handleFavoriteClick}
              className={`mt-4 w-full py-2 px-4 rounded-md text-sm font-medium ${
                isFavorite
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              }`}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
} 