'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPopularMovies, searchMovies } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import Layout from '@/components/Layout';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    const favorites = localStorage.getItem('favorites');
    if (favorites) {
      setFavoriteIds(JSON.parse(favorites));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['movies', debouncedSearch],
    queryFn: ({ pageParam = 1 }) =>
      debouncedSearch
        ? searchMovies(debouncedSearch, pageParam)
        : getPopularMovies(pageParam),
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

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.pages?.map((page) =>
            page?.results?.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={favoriteIds.includes(movie.id)}
              />
            ))
          )}
        </div>

        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading more...' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
