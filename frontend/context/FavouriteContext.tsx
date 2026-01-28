import React, { createContext, useContext, useState } from "react";

type Recipe = {
  _id: string;
  name: string;
  image: string;
  rating: number;
  cookTimeMinutes: number;
  difficulty: string;
  caloriesPerServing: number;
  cuisine: string;
  tags: string[];
};

type FavoritesContextType = {
  favorites: Recipe[];
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      const exists = prev.find((r) => r._id === recipe._id);
      if (exists) {
        return prev.filter((r) => r._id !== recipe._id);
      }
      return [...prev, recipe];
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some((r) => r._id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
};
