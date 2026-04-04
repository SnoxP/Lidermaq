import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/mockData';
import { useAuth } from './AuthContext';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().favorites) {
            setFavorites(docSnap.data().favorites);
          } else {
            setFavorites([]);
          }
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      } else {
        // Load from local storage if not logged in
        const stored = localStorage.getItem('lidermaq_favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      }
    };
    loadFavorites();
  }, [user]);

  const saveFavorites = async (newFavorites: Product[]) => {
    setFavorites(newFavorites);
    if (user) {
      try {
        const docRef = doc(db, 'users', user.id);
        await setDoc(docRef, { favorites: newFavorites }, { merge: true });
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    } else {
      localStorage.setItem('lidermaq_favorites', JSON.stringify(newFavorites));
    }
  };

  const addToFavorites = (product: Product) => {
    if (!favorites.some(f => f.id === product.id)) {
      saveFavorites([...favorites, product]);
    }
  };

  const removeFromFavorites = (productId: string) => {
    saveFavorites(favorites.filter(f => f.id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.some(f => f.id === productId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
