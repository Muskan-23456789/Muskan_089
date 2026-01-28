import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../utils/api";

type Recipe = {
  _id: string;
  name: string;
  image: string;
  rating: number;
  cookTimeMinutes?: number;
  difficulty?: string;
  caloriesPerServing?: number;
  cuisine?: string;
  tags?: string[];
  time?: string;
};

type FavoritesContextType = {
  favoriteIds: string[];
  favoriteRecipes: Recipe[];
  toggleFavorite: (recipe: Recipe) => Promise<void>;
  addFavorite: (recipe: Recipe) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  loadFavorites: () => Promise<void>;
  loading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/favorites");
      if (response.data?.data?.recipes) {
        const recipes = response.data.data.recipes;
        setFavoriteRecipes(recipes);
        setFavoriteIds(recipes.map((r: any) => r._id));
        console.log("✅ Loaded favorites:", recipes.length);
      }
    } catch (err) {
      console.log("⚠️ Could not load from API:", err);
    }
    setLoading(false);
  };

  const addFavorite = async (recipe: Recipe) => {
    setFavoriteIds((prev) => [...prev, recipe._id]);
    setFavoriteRecipes((prev) => [...prev, recipe]);
    console.log(" Added to favorites:", recipe._id);

    try {
      const response = await api.post(`/users/favorites/${recipe._id}`);
      console.log(" API confirmed add:", response.data);
    } catch (err) {
      console.log("⚠️ API error adding favorite:", err);
    }
  };

  const removeFavorite = async (id: string) => {
    // Optimistic update
    setFavoriteIds((prev) => prev.filter((fav) => fav !== id));
    setFavoriteRecipes((prev) => prev.filter((r) => r._id !== id));
    console.log("💔 Removed from favorites:", id);

    try {
      const response = await api.delete(`/users/favorites/${id}`);
      console.log("API confirmed remove:", response.data);
    } catch (err) {
      console.log("⚠️ API error removing favorite:", err);
    }
  };

  const toggleFavorite = async (recipe: Recipe) => {
    const isFav = favoriteIds.includes(recipe._id);
    console.log(`🔄 Toggle favorite: ${recipe._id}, Current: ${isFav}`);

    if (isFav) {
      await removeFavorite(recipe._id);
    } else {
      await addFavorite(recipe);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteRecipes,
        toggleFavorite,
        addFavorite,
        removeFavorite,
        loadFavorites,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
};
