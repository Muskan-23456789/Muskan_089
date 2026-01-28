import { View, Text, FlatList, Image, TouchableOpacity, StatusBar, Alert, Animated, ScrollView, ActivityIndicator } from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import api from "../../utils/api";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavouriteContext";
export default function Favorites() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const { isDark } = useTheme();
  const { favoriteRecipes, removeFavorite: removeFav, loadFavorites: loadFavs } = useFavorites();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const bgColor = isDark ? "bg-neutral-900" : "bg-gray-50";
  const cardBgColor = isDark ? "bg-neutral-800" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryTextColor = isDark ? "text-neutral-400" : "text-gray-600";
  const iconBgColor = isDark ? "bg-neutral-700" : "bg-gray-200";  

  useFocusEffect(
    useCallback(() => {
      loadFavoritesFromContext();
    }, [])
  );

  const loadFavoritesFromContext = async () => {
    setPageLoading(true);
    try {
      await loadFavs();
      setRecipes(favoriteRecipes);
    } catch (err) {
      console.log("Error loading favorites:", err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    setRecipes(favoriteRecipes);
  }, [favoriteRecipes]);

  const handleRemoveFavorite = async (recipeId: string) => {
    try {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.8, duration: 300, useNativeDriver: true })
      ]).start();
      
      setTimeout(async () => {
        await removeFav(recipeId);
        setRecipes(recipes.filter(r => r._id !== recipeId));
        Alert.alert("Success", "Removed from favorites");
        Animated.parallel([
          Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start();
      }, 300);
    } catch (err) {
      console.log("Error removing favorite:", err);
      Alert.alert("Error", "Failed to remove from favorites");
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true })
      ]).start();
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        className={`${cardBgColor} rounded-3xl mb-4 overflow-hidden shadow-lg ${isDark ? "shadow-black/40" : "shadow-gray-400/30"} flex-row`}
        onPress={() => router.push(`/recipe/${item._id}`)}
        activeOpacity={0.7}
        onPressIn={() => {
          Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
        }}
        onPressOut={() => {
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
        }}
      >
        
        <View className="w-28 h-28 relative overflow-hidden">
          {item.image ? (
            <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
          ) : (
            <View className={`w-full h-full ${iconBgColor} items-center justify-center`}>
              <Ionicons name="restaurant" size={32} color={isDark ? "#525252" : "#999"} />
            </View>
          )}
          <View className={`absolute bottom-1 left-1 ${isDark ? "bg-black/60" : "bg-white/70"} px-1.5 py-0.5 rounded-md`}>
            <Text className={`${secondaryTextColor} text-xs font-semibold`}>ID: {item._id}</Text>
          </View>
        </View>
        <View className="flex-1 p-3 justify-between">
          <View>
            <View className={`mb-1 ${isDark ? "bg-neutral-700/50" : "bg-gray-100/70"} px-2 py-1 rounded-lg self-start`}>
              <Text className={`${secondaryTextColor} text-xs font-semibold`}>ID: {item._id?.slice(0, 12)}...</Text>
            </View>
            <Text className={`${textColor} text-base font-bold`} numberOfLines={1}>{item.name}</Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="time-outline" size={12} color={isDark ? "#a3a3a3" : "#999"} />
              <Text className={`${secondaryTextColor} text-xs ml-1`}>{item.time || 'N/A'}</Text>
              <Ionicons name="flame" size={12} color="#f97316" style={{ marginLeft: 8 }} />
              <Text className={`${secondaryTextColor} text-xs ml-1`}>{item.difficulty || 'N/A'}</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="star" size={13} color="#fbbf24" />
              <Text className={`${textColor} text-xs font-bold`}>{item.rating}</Text>
              <View className="ml-1 bg-indigo-500/20 px-2 py-0.5 rounded-full">
                <Text className="text-indigo-400 text-xs font-medium">{item.cuisine}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              onPress={() => handleRemoveFavorite(item._id)}
              className="bg-red-500/10 p-2 rounded-full"
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ScrollView className={`flex-1 ${bgColor}`} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />     
      {pageLoading ? (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator size="large" color={isDark ? "#a78bfa" : "#4f46e5"} />
          <Text className={`${textColor} mt-4 font-semibold`}>Loading favorites...</Text>
        </View>
      ) : (
        <>      <View className="px-6 pt-6 pb-4">
        <Text className={`${textColor} text-4xl font-bold`}>My Favorites</Text>
        <Text className={secondaryTextColor + " mt-2"}>
          {recipes.length} recipe{recipes.length !== 1 ? 's' : ''} saved
        </Text>
      </View> 
      {recipes.length > 0 && (
        <View className="px-6 py-6 border-t border-neutral-700/20">
          <View className="flex-row items-center mb-4">
            <Ionicons name="list" size={24} color={isDark ? "#60a5fa" : "#3b82f6"} />
            <Text className={`${textColor} text-2xl font-bold ml-3`}>Your Recipes</Text>
          </View>
          <View className="gap-4">
            {recipes.map(recipe => renderItem({item: recipe}))}
          </View>
        </View>
      )}
      {recipes.length === 0 && (
        <View className="items-center justify-center py-24 px-6">
          <Ionicons name="heart-outline" size={72} color={isDark ? "#404040" : "#e5e7eb"} />
          <Text className={`${textColor} text-xl font-bold mt-6`}>No Favorites Yet</Text>
          <Text className={secondaryTextColor + " mt-3 text-center text-sm"}>
            Add recipes to your favorites to see them here
          </Text>
          <TouchableOpacity
            className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3 rounded-2xl mt-8 shadow-lg"
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-white font-bold">Explore Recipes</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="h-8" />
        </>
      )}
    </ScrollView>
  );
}




























































