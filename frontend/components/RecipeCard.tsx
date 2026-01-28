import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';


export type Recipe = {
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

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <Link href={`/recipe/${recipe._id}`} asChild>
      <TouchableOpacity className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden border border-gray-100">
        <Image 
          source={{ uri: recipe.image }} 
          className="w-full h-48 object-cover"
        />
        <View className="p-4">
          <View className="flex-row justify-between items-start">
            <Text className="text-xl font-bold text-gray-900 flex-1 mr-2" numberOfLines={1}>{recipe.name}</Text>
            <View className="bg-orange-100 px-2 py-1 rounded-md">
              <Text className="text-orange-600 font-bold text-xs">{recipe.rating} ★</Text>
            </View>
          </View>
          
          <View className="flex-row mt-2 space-x-4">
            <Text className="text-gray-500 text-sm">⏱ {recipe.cookTimeMinutes} min</Text>
            <Text className="text-gray-500 text-sm">🔥 {recipe.caloriesPerServing} cal</Text>
          </View>
          
          <View className="flex-row mt-3 flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <View key={index} className="bg-gray-100 px-2 py-1 rounded-full">
                <Text className="text-gray-600 text-xs capitalize">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
