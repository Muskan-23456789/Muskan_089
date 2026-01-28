import { View, Text, FlatList, Image, TouchableOpacity, StatusBar, Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";
import api from "../../utils/api";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";

export default function Favorites() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const bgColor = isDark ? "bg-neutral-900" : "bg-gray-50";
  const cardBgColor = isDark ? "bg-neutral-800" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryTextColor = isDark ? "text-neutral-400" : "text-gray-600";
  const iconBgColor = isDark ? "bg-neutral-700" : "bg-gray-200";  
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/favorites");
      if (res.data?.data?.recipes) {
        setRecipes(res.data.data.recipes);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.log("Error loading favorites:", err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (recipeId: string) => {
    try {
      await api.delete(`/users/favorites/${recipeId}`);
      setRecipes(recipes.filter(r => r._id !== recipeId));
      Alert.alert("Success", "Removed from favorites");
    } catch (err) {
      console.log("Error removing favorite:", err);
      Alert.alert("Error", "Failed to remove from favorites");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className={`${cardBgColor} rounded-2xl mb-4 overflow-hidden shadow-sm ${isDark ? "shadow-black/50" : "shadow-gray-300/50"} flex-row`}
      onPress={() => router.push(`/recipe/${item._id}`)}
      activeOpacity={0.8}
    >
      {/* Image */}
      <View className="w-24 h-24 relative">
        {item.image ? (
          <Image source={{ uri: item.image }} className="w-full h-full" />
        ) : (
          <View className={`w-full h-full ${iconBgColor} items-center justify-center`}>
            <Ionicons name="restaurant" size={30} color={isDark ? "#525252" : "#999"} />
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1 p-3 justify-between">
        <View>
          <Text className={`${textColor} text-base font-bold`} numberOfLines={1}>{item.name}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="time-outline" size={12} color={isDark ? "#a3a3a3" : "#999"} />
            <Text className={`${secondaryTextColor} text-xs ml-1`}>{item.time || 'N/A'}</Text>
          </View>
        </View>
        
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="star" size={12} color="#fbbf24" />
            <Text className={`${textColor} text-xs font-bold ml-1`}>{item.rating}</Text>
            <View className="ml-2 bg-indigo-500/20 px-2 py-0.5 rounded-full">
              <Text className="text-indigo-400 text-xs font-medium">{item.cuisine}</Text>
            </View>
          </View>
          
          <TouchableOpacity onPress={() => removeFavorite(item._id)}>
            <Ionicons name="trash-outline" size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${bgColor}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View className="px-6 pt-4 pb-2">
        <Text className={`${textColor} text-2xl font-bold`}>My Favorites</Text>
        <Text className={secondaryTextColor}>
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={recipes}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
        onRefresh={loadFavorites}
        refreshing={loading}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="heart-outline" size={64} color={isDark ? "#525252" : "#ccc"} />
            <Text className={`${textColor} text-lg font-bold mt-4`}>No Favorites Yet</Text>
            <Text className={secondaryTextColor + " mt-2"}>Add recipes to your favorites to see them here</Text>
            <TouchableOpacity
              className="bg-indigo-500 px-6 py-3 rounded-xl mt-6"
              onPress={() => router.push("/(tabs)")}
            >
              <Text className="text-white font-bold">Explore Recipes</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}




























































