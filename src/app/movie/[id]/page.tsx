'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getMovieDetails, getMovieCredits, getMovieReviews } from '@/services/tmdb';
import Layout from '@/components/Layout';
import Image from 'next/image';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Review {
  id: string;
  author: string;
  content: string;
  rating: number;
  created_at: string;
}

export default function MoviePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      setFavoriteIds(JSON.parse(favorites));
    }
  }, []);

  const { data: movieData, isLoading: isLoadingMovie } = useInfiniteQuery({
    queryKey: ['movie', params.id],
    queryFn: ({ pageParam = 1 }) => getMovieDetails(params.id, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const { data: creditsData, isLoading: isLoadingCredits } = useInfiniteQuery({
    queryKey: ['movieCredits', params.id],
    queryFn: ({ pageParam = 1 }) => getMovieCredits(params.id, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const { data: reviewsData, isLoading: isLoadingReviews } = useInfiniteQuery({
    queryKey: ['movieReviews', params.id],
    queryFn: ({ pageParam = 1 }) => getMovieReviews(params.id, pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const handleFavoriteToggle = (movieId: number) => {
    const newFavorites = favoriteIds.includes(movieId)
      ? favoriteIds.filter((id) => id !== movieId)
      : [...favoriteIds, movieId];
    setFavoriteIds(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  if (isLoadingMovie || isLoadingCredits || isLoadingReviews) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  const movie = movieData?.pages[0].results as MovieDetails;
  const credits = creditsData?.pages[0].results as { cast: CastMember[] };
  const reviews = reviewsData?.pages[0].results as Review[];

  return (
    <Layout>
      <div className="space-y-8">
        <div className="relative h-[400px] w-full">
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h1 className="text-4xl font-bold">{movie.title}</h1>
            <p className="mt-2 text-lg">{movie.overview}</p>
            <div className="mt-4 flex items-center space-x-4">
              <span>Release Date: {new Date(movie.release_date).toLocaleDateString()}</span>
              <span>Rating: {movie.vote_average.toFixed(1)}/10</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {credits?.cast.slice(0, 8).map((cast) => (
                <div key={cast.id} className="text-center">
                  <div className="relative h-48 w-32 mx-auto">
                    <Image
                      src={
                        cast.profile_path
                          ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
                          : '/placeholder.png'
                      }
                      alt={cast.name}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <p className="mt-2 font-medium">{cast.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{cast.character}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-4">
              {reviews?.slice(0, 3).map((review) => (
                <div key={review.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{review.author}</p>
                    <span className="text-yellow-500">★ {review.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 