import { View, Text, TouchableOpacity, FlatList, Image, StatusBar, Alert, ScrollView, Animated, ActivityIndicator } from "react-native";
import { useEffect, useState, useRef, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavouriteContext";
import "@/global.css"

export default function Home() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const bgColor = isDark ? "bg-neutral-900" : "bg-gray-50";
  const cardBgColor = isDark ? "bg-neutral-800" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryTextColor = isDark ? "text-neutral-400" : "text-gray-600";
  const iconBgColor = isDark ? "bg-neutral-700" : "bg-gray-200";
  const sectionBgColor = isDark ? "bg-neutral-800/50" : "bg-white/50";

  const mockRecipes = [
    { _id: '1', name: 'Butter Chicken', cuisine: 'Indian', rating: 4.9, time: '40 min', category: 'featured', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { _id: '2', name: 'Margherita Pizza', cuisine: 'Italian', rating: 4.8, time: '35 min', category: 'popular', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { _id: '3', name: 'Thai Green Curry', cuisine: 'Thai', rating: 4.7, time: '50 min', category: 'trending', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1455521459494-eb3007ca4d1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { _id: '4', name: 'Grilled Salmon', cuisine: 'Seafood', rating: 4.9, time: '30 min', category: 'popular', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { _id: '5', name: 'Biryani Rice', cuisine: 'Indian', rating: 4.8, time: '60 min', category: 'featured', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { _id: '6', name: 'Pad Thai', cuisine: 'Thai', rating: 4.6, time: '25 min', category: 'quick', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { _id: '7', name: 'Spaghetti Carbonara', cuisine: 'Italian', rating: 4.7, time: '20 min', category: 'quick', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1612874742237-415c69f18313?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    { _id: '8', name: 'Fish Tacos', cuisine: 'Mexican', rating: 4.5, time: '30 min', category: 'trending', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  ];

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/recipes");
      if(response.data?.data?.recipes) {
        setRecipes(response.data.data.recipes);
      } else {
        setRecipes(mockRecipes);
      }
    } catch (err) {
      console.log("API Error (using mock):", err);
      setRecipes(mockRecipes);
    }
    setLoading(false);
  };

  const getRecipesByCategory = useCallback((category: string) => {
    return recipes.filter(r => r.category === category || (category === 'all' && recipes)).slice(0, 5);
  }, [recipes]);

  const handleToggleFavorite = useCallback((item: any) => {
    console.log("🔄 Clicking heart for:", item.name, "ID:", item._id);
    toggleFavorite(item);
  }, [toggleFavorite]);

  const RecipeCardComponent = ({ item, containerStyle }: { item: any, containerStyle?: any }) => {
    const isFav = favoriteIds.includes(item._id);
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, containerStyle]}>
        <TouchableOpacity
          className={`${cardBgColor} rounded-3xl overflow-hidden shadow-lg ${isDark ? "shadow-black/40" : "shadow-gray-400/30"} mb-4`}
          onPress={() => router.push(`/recipe/${item._id}`)}
          activeOpacity={0.7}
          onPressIn={() => {
            Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start();
          }}
          onPressOut={() => {
            Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
          }}
        >
          <View className={`h-40 ${iconBgColor} w-full relative overflow-hidden`}>
            {item.image ? (
              <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
            ) : (
              <View className={`w-full h-full items-center justify-center ${iconBgColor}`}>
                <Ionicons name="restaurant" size={40} color={isDark ? "#525252" : "#999"} />
              </View>
            )}
            
            {/* Rating Badge */}
            <View className={`absolute top-3 right-3 ${isDark ? "bg-black/70" : "bg-white/80"} px-3 py-1.5 rounded-full flex-row items-center backdrop-blur-md`}>
              <Ionicons name="star" size={13} color="#fbbf24" />
              <Text className={`${textColor} text-xs font-bold ml-1`}>{item.rating || 'N/A'}</Text>
            </View>

            {/* Difficulty Badge */}
            <View className={`absolute top-3 left-3 ${
              item.difficulty === 'Easy' ? 'bg-green-500/80' : 
              item.difficulty === 'Medium' ? 'bg-yellow-500/80' : 
              'bg-red-500/80'
            } px-2 py-1 rounded-full`}>
              <Text className="text-white text-xs font-semibold">{item.difficulty}</Text>
            </View>

            {/* Favorite Button */}
            <TouchableOpacity
              className={`absolute bottom-3 right-3 ${isFav ? "bg-red-500" : "bg-white/40"} p-2.5 rounded-full`}
              onPress={(e) => {
                e.stopPropagation();
                handleToggleFavorite(item);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name={isFav ? "heart" : "heart-outline"} size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          <View className="p-4">
            {/* ID Badge */}
            <View className={`mb-2 ${isDark ? "bg-neutral-700/50" : "bg-gray-100/70"} px-2 py-1 rounded-lg self-start`}>
              <Text className={`${secondaryTextColor} text-xs font-semibold`}>ID: {item._id}</Text>
            </View>

            <View className="flex-row justify-between items-start">
              <View className="flex-1 mr-2">
                <Text className={`${textColor} text-lg font-bold mb-1`} numberOfLines={1}>{item.name}</Text>
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={13} color={isDark ? "#a3a3a3" : "#999"} />
                  <Text className={`${secondaryTextColor} text-xs ml-1.5`}>{item.time || 'N/A'}</Text>
                </View>
              </View>
              <View className="bg-indigo-500/20 px-3 py-1 rounded-full">
                <Text className="text-indigo-400 text-xs font-medium">{item.cuisine}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const SectionHeader = ({ title, icon }: { title: string, icon: string }) => (
    <View className="flex-row items-center mb-4 mt-6 px-4">
      <Ionicons name={icon as any} size={24} color={isDark ? "#f5f5f5" : "#1f2937"} />
      <Text className={`${textColor} text-2xl font-bold ml-3`}>{title}</Text>
    </View>
  );

  return (
    <ScrollView className={`flex-1 ${bgColor}`} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Loading State */}
      {loading && (
        <View className="items-center justify-center py-12">
          <ActivityIndicator size="large" color={isDark ? "#a78bfa" : "#4f46e5"} />
          <Text className={`${textColor} mt-4 font-semibold`}>Loading recipes...</Text>
        </View>
      )}
      
      {!loading && (
        <>
      {/* Header Section */}
      <View className="pt-6 px-4 pb-2">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className={secondaryTextColor + " text-sm font-medium"}>Welcome back,</Text>
            <Text className={textColor + " text-3xl font-bold mt-1"}>Let's cook!</Text>
          </View>
          <TouchableOpacity className={`${isDark ? "bg-neutral-800" : "bg-gray-200"} p-3 rounded-full border ${isDark ? "border-neutral-700" : "border-gray-300"}`}>
            <Ionicons name="notifications-outline" size={24} color={isDark ? "white" : "black"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar Section */}
      <View className="px-4 mb-4 mt-2">
        <View className={`${isDark ? "bg-neutral-800" : "bg-gray-200"} flex-row items-center rounded-2xl px-4 py-3 border ${isDark ? "border-neutral-700" : "border-gray-300"}`}>
          <Ionicons name="search" size={20} color={isDark ? "#a3a3a3" : "#999"} />
          <Text className={`${secondaryTextColor} ml-3 flex-1`}>Search recipes...</Text>
        </View>
      </View>

      {/* 1️⃣ Featured Recipes Section */}
      {getRecipesByCategory('featured').length > 0 && (
        <>
          <SectionHeader title="⭐ Featured Recipes" icon="star" />
          <View className="px-4">
            {getRecipesByCategory('featured').map((item, index) => (
              <RecipeCardComponent key={item._id} item={item} />
            ))}
          </View>
        </>
      )}

      {/* 2️⃣ Popular Recipes Section */}
      {getRecipesByCategory('popular').length > 0 && (
        <>
          <SectionHeader title="🔥 Popular This Week" icon="flame" />
          <View className="px-4">
            {getRecipesByCategory('popular').map((item) => (
              <RecipeCardComponent key={item._id} item={item} />
            ))}
          </View>
        </>
      )}

      {/* 3️⃣ Trending Recipes Section */}
      {getRecipesByCategory('trending').length > 0 && (
        <>
          <SectionHeader title="📈 Trending Now" icon="trending-up" />
          <View className="px-4">
            {getRecipesByCategory('trending').map((item) => (
              <RecipeCardComponent key={item._id} item={item} />
            ))}
          </View>
        </>
      )}

      {/* 4️⃣ Quick & Easy Section */}
      {getRecipesByCategory('quick').length > 0 && (
        <>
          <SectionHeader title="⚡ Quick & Easy" icon="flash" />
          <View className="px-4">
            {getRecipesByCategory('quick').map((item) => (
              <RecipeCardComponent key={item._id} item={item} />
            ))}
          </View>
        </>
      )}

      {/* 5️⃣ All Recipes Section */}
      <>
        <SectionHeader title="🍽️ All Recipes" icon="restaurant" />
        <View className="px-4 pb-10">
          {recipes.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Ionicons name="restaurant-outline" size={48} color={isDark ? "#525252" : "#999"} />
              <Text className={`${secondaryTextColor} mt-3 text-center`}>No recipes found.</Text>
            </View>
          ) : (
            recipes.map((item) => (
              <RecipeCardComponent key={item._id} item={item} />
            ))
          )}
        </View>
      </>
        </>
      )}
    </ScrollView>
  );
}
