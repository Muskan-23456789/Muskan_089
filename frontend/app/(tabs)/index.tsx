import { View, Text, TouchableOpacity, FlatList, Image, StatusBar, Alert } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";
import "@/global.css"

export default function Home() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { isDark } = useTheme();

  const bgColor = isDark ? "bg-neutral-900" : "bg-gray-50";
  const cardBgColor = isDark ? "bg-neutral-800" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryTextColor = isDark ? "text-neutral-400" : "text-gray-600";
  const iconBgColor = isDark ? "bg-neutral-700" : "bg-gray-200";

  useEffect(() => {
     const mockRecipes = [
        { _id: '1', name: 'Butter Chicken', cuisine: 'Indian', rating: 4.9, time: '40 min', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { _id: '2', name: 'Margherita Pizza', cuisine: 'Italian', rating: 4.8, time: '35 min', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { _id: '3', name: 'Thai Green Curry', cuisine: 'Thai', rating: 4.7, time: '50 min', image: 'https://images.unsplash.com/photo-1455521459494-eb3007ca4d1f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { _id: '4', name: 'Grilled Salmon', cuisine: 'Seafood', rating: 4.9, time: '30 min', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
        { _id: '5', name: 'Biryani Rice', cuisine: 'Indian', rating: 4.8, time: '60 min', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ];
    setRecipes(mockRecipes);
    
    api.get("/recipes").then(res => {
        if(res.data?.data?.recipes) {
             setRecipes(res.data.data.recipes)
        }
    }).catch(err => console.log("API Error (using mock):", err));
    api.get("/users/favorites").then(res => {
      if(res.data?.data?.recipes) {
        setFavorites(res.data.data.recipes.map((r: any) => r._id));
      }
    }).catch(err => console.log("Error loading favorites:", err));
  }, []);
  const toggleFavorite = async (recipeId: string) => {
    const isFav = favorites.includes(recipeId);
    try {
      if (isFav) {
        await api.delete(`/users/favorites/${recipeId}`);
        setFavorites(favorites.filter(id => id !== recipeId));
      } else {
        await api.post(`/users/favorites/${recipeId}`);
        setFavorites([...favorites, recipeId]);
      }
    } catch (err) {
      console.log("Error toggling favorite:", err);
      Alert.alert("Error", "Failed to update favorites");
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isFav = favorites.includes(item._id);
    return (
      <TouchableOpacity
        className={`${cardBgColor} rounded-2xl mb-4 overflow-hidden shadow-sm ${isDark ? "shadow-black/50" : "shadow-gray-300/50"}`}
        onPress={() => router.push(`/recipe/${item._id}`)}
        activeOpacity={0.8}
      >
        <View className={`h-40 ${iconBgColor} w-full relative`}>
            {item.image ? (
                <Image source={{ uri: item.image }} className="w-full h-full object-cover" />
            ) : (
                  <View className={`w-full h-full items-center justify-center ${iconBgColor}`}>
                      <Ionicons name="restaurant" size={40} color={isDark ? "#525252" : "#999"} />
                  </View>
            )}
            <View className={`absolute top-3 right-3 ${isDark ? "bg-black/60" : "bg-white/70"} px-2 py-1 rounded-lg flex-row items-center backdrop-blur-md`}>
              <Ionicons name="star" size={12} color="#fbbf24" />
              <Text className={`${textColor} text-xs font-bold ml-1`}>{item.rating || 'N/A'}</Text>
            </View>
            <TouchableOpacity
              className={`absolute bottom-3 right-3 ${isFav ? "bg-red-500" : "bg-white/30"} p-2 rounded-full`}
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(item._id);
              }}
            >
              <Ionicons name={isFav ? "heart" : "heart-outline"} size={16} color="white" />
            </TouchableOpacity>
        </View>
        
        <View className="p-4">
          <View className="flex-row justify-between items-start">
              <View className="flex-1 mr-2">
                  <Text className={`${textColor} text-lg font-bold mb-1`} numberOfLines={1}>{item.name}</Text>
                  <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={14} color={isDark ? "#a3a3a3" : "#999"} />
                      <Text className={`${secondaryTextColor} text-xs ml-1 mr-3`}>{item.time || 'N/A'}</Text>
                  </View>
              </View>
               <View className="bg-indigo-500/20 px-3 py-1 rounded-full">
                  <Text className="text-indigo-400 text-xs font-medium">{item.cuisine}</Text>
              </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className={`flex-1 ${bgColor} pt-12 px-4`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View className="flex-row justify-between items-center mb-6">
        <View>
            <Text className={secondaryTextColor + " text-sm font-medium"}>Welcome back,</Text>
            <Text className={textColor + " text-2xl font-bold"}>Let's cook something delicious!</Text>
        </View>
        <TouchableOpacity className={`${isDark ? "bg-neutral-800" : "bg-gray-200"} p-2 rounded-full border ${isDark ? "border-neutral-700" : "border-gray-300"}`}>
            <Ionicons name="notifications-outline" size={24} color={isDark ? "white" : "black"} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={recipes}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
            <View className="items-center justify-center py-20">
                <Text className={secondaryTextColor}>No recipes found.</Text>
            </View>
        }
      />
    </View>
  );
}
