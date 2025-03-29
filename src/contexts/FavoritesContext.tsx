import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

type FavoritesContextType = {
  favorites: number[];
  isLoading: boolean;
  addToFavorites: (movieId: number) => Promise<void>;
  removeFromFavorites: (movieId: number) => Promise<void>;
  isFavorite: (movieId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (status === 'loading') return;

      if (status === 'authenticated' && !useLocalStorage) {
        try {
          const response = await axios.get('/api/favorites');
          if (response.status === 200) {
            setFavorites(response.data.favorites || []);
          } else {
            // If API returns an error, fallback to localStorage
            fallbackToLocalStorage();
          }
        } catch (error) {
          console.error('Error fetching favorites:', error);
          // If API call fails, fallback to localStorage
          fallbackToLocalStorage();
        }
      } else {
        // If not logged in or explicitly using localStorage, get from localStorage
        fallbackToLocalStorage();
      }
      setIsLoading(false);
    };

    const fallbackToLocalStorage = () => {
      setUseLocalStorage(true);
      const localFavorites = localStorage.getItem('favorites');
      if (localFavorites) {
        setFavorites(JSON.parse(localFavorites));
      }
    };

    fetchFavorites();
  }, [status, useLocalStorage]);

  const addToFavorites = async (movieId: number) => {
    if (status === 'authenticated' && !useLocalStorage) {
      try {
        const response = await axios.post('/api/favorites', { movieId });
        if (response.status === 200) {
          setFavorites(response.data.favorites);
        } else {
          // Fallback to localStorage on API error
          addToLocalStorage(movieId);
        }
      } catch (error) {
        console.error('Error adding to favorites:', error);
        // Fallback to localStorage on API error
        addToLocalStorage(movieId);
      }
    } else {
      // If not authenticated or explicitly using localStorage
      addToLocalStorage(movieId);
    }
  };

  const addToLocalStorage = (movieId: number) => {
    if (!favorites.includes(movieId)) {
      const newFavorites = [...favorites, movieId];
      setFavorites(newFavorites);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = async (movieId: number) => {
    if (status === 'authenticated' && !useLocalStorage) {
      try {
        const response = await axios.delete(`/api/favorites?movieId=${movieId}`);
        if (response.status === 200) {
          setFavorites(response.data.favorites);
        } else {
          // Fallback to localStorage on API error
          removeFromLocalStorage(movieId);
        }
      } catch (error) {
        console.error('Error removing from favorites:', error);
        // Fallback to localStorage on API error
        removeFromLocalStorage(movieId);
      }
    } else {
      // If not authenticated or explicitly using localStorage
      removeFromLocalStorage(movieId);
    }
  };

  const removeFromLocalStorage = (movieId: number) => {
    const newFavorites = favorites.filter(id => id !== movieId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (movieId: number) => {
    return favorites.includes(movieId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 