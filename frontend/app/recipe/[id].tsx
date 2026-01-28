import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Animated, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { useFavorites } from "../../context/FavouriteContext";
import { Ionicons } from "@expo/vector-icons";
import { useState, useRef, useEffect } from "react";
import api from "../../utils/api";
export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isDark } = useTheme();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${id}`);
      if (response.data?.data) {
        setRecipe(response.data.data);
      }
    } 
    catch (err) {
      console.log("Error fetching recipe:", err);
    }
     finally {
      setLoading(false);
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }
  };
  const handleToggleFavorite = async () => {
    if (recipe) {
      await toggleFavorite(recipe);
    }
  };
  const isFav = recipe && favoriteIds.includes(recipe._id);
  if (loading || !recipe) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#0a0a0a' : '#f9fafb' }}>
        <Ionicons name="restaurant-outline" size={48} color={isDark ? "#525252" : "#999"} />
        <Text style={{ marginTop: 12, color: isDark ? "#fff" : "#000" }}>Loading recipe...</Text>
      </View>
    );
  }

  const mockRecipe = {
    ...recipe,
    ingredients: recipe.ingredients || ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
    steps: recipe.steps || ["Step 1: Prepare", "Step 2: Cook", "Step 3: Serve"],
    caloriesPerServing: recipe.caloriesPerServing || 450,
    servings: recipe.servings || 2,
  };

  return (
    <Animated.ScrollView
      style={{
        flex: 1,
        backgroundColor: isDark ? "#0a0a0a" : "#f9fafb",
        opacity: fadeAnim,
      }}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
    
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => router.back()} className={`${isDark ? "bg-neutral-800" : "bg-white"} p-2 rounded-full`}>
          <Ionicons name="chevron-back" size={28} color={isDark ? "white" : "black"} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleToggleFavorite}
          onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.8, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()}
          className={`${isFav ? "bg-red-500" : isDark ? "bg-neutral-800" : "bg-white"} p-3 rounded-full`}
        >
          <Ionicons name={isFav ? "heart" : "heart-outline"} size={24} color={isFav ? "white" : isDark ? "white" : "black"} />
        </TouchableOpacity>
      </View>
      <View style={{ marginHorizontal: 16, marginBottom: 20, borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }}>
        <Image source={{ uri: mockRecipe.image }} style={{ width: '100%', height: 300, objectFit: 'cover' }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <View style={{ backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={{ marginLeft: 4, fontWeight: 'bold', color: '#1f2937' }}>{mockRecipe.rating || 'N/A'}</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(79, 70, 229, 0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>{mockRecipe.cuisine}</Text>
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: isDark ? '#fff' : '#000', marginBottom: 8 }}>{mockRecipe.name}</Text>
        <View style={{ backgroundColor: isDark ? '#1f2937' : '#f3f4f6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, alignSelf: 'flex-start' }}>
          <Text style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: 12, fontWeight: '600' }}>ID: {mockRecipe._id}</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16, marginBottom: 24, flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1, backgroundColor: isDark ? '#1f2937' : '#f3f4f6', padding: 16, borderRadius: 16, alignItems: 'center' }}>
          <Ionicons name="time-outline" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
          <Text style={{ color: isDark ? '#fff' : '#000', fontWeight: '700', marginTop: 8 }}>{mockRecipe.time}</Text>
          <Text style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: 12, marginTop: 4 }}>Cook Time</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: isDark ? '#1f2937' : '#f3f4f6', padding: 16, borderRadius: 16, alignItems: 'center' }}>
          <Ionicons name="flame" size={24} color="#f97316" />
          <Text style={{ color: isDark ? '#fff' : '#000', fontWeight: '700', marginTop: 8 }}>{mockRecipe.caloriesPerServing}</Text>
          <Text style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: 12, marginTop: 4 }}>Calories</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: isDark ? '#1f2937' : '#f3f4f6', padding: 16, borderRadius: 16, alignItems: 'center' }}>
          <Ionicons name="people" size={24} color="#10b981" />
          <Text style={{ color: isDark ? '#fff' : '#000', fontWeight: '700', marginTop: 8 }}>{mockRecipe.servings}</Text>
          <Text style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: 12, marginTop: 4 }}>Servings</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Ionicons name="list" size={24} color={isDark ? '#fff' : '#000'} />
          <Text style={{ fontSize: 22, fontWeight: '800', color: isDark ? '#fff' : '#000', marginLeft: 10 }}>Ingredients</Text>
        </View>
        {mockRecipe.ingredients.map((item: string, index: number) => (
          <View key={index} style={{ backgroundColor: isDark ? '#1f2937' : '#f3f4f6', padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4f46e5', marginRight: 12 }} />
            <Text style={{ color: isDark ? '#e5e7eb' : '#374151', fontSize: 16, flex: 1 }}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Ionicons name="checkmark-done" size={24} color={isDark ? '#fff' : '#000'} />
          <Text style={{ fontSize: 22, fontWeight: '800', color: isDark ? '#fff' : '#000', marginLeft: 10 }}>Instructions</Text>
        </View>
        {mockRecipe.steps.map((step: string, index: number) => (
          <View key={index} style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>{index + 1}</Text>
            </View>
            <Text style={{ color: isDark ? '#e5e7eb' : '#374151', fontSize: 16, flex: 1, marginTop: 8 }}>{step}</Text>
          </View>
        ))}
      </View>
      <View style={{ paddingHorizontal: 16, marginBottom: 40 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: isDark ? '#fff' : '#000', marginBottom: 12 }}>Details</Text>
        <View style={{ backgroundColor: isDark ? '#1f2937' : '#f3f4f6', padding: 16, borderRadius: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Difficulty:</Text>
            <View style={{ backgroundColor: '#fbbf24', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: '#000', fontWeight: '600', fontSize: 12 }}>{mockRecipe.difficulty || 'Medium'}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Cuisine:</Text>
            <Text style={{ color: isDark ? '#fff' : '#000', fontWeight: '600' }}>{mockRecipe.cuisine}</Text>
          </View>
        </View>
      </View>
    </Animated.ScrollView>
  );
}

