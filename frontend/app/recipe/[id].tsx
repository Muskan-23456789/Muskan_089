import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTheme } from "../../context/ThemeContext";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const recipe = {
    title: "Beef Bulgogi",
    image:
      "https://images.unsplash.com/photo-1604908177522-4323c7d5e9a3",
    rating: 4.8,
    cuisine: "Korean",
    time: "30 mins",
    calories: "450 kcal",
    servings: "2 People",
    ingredients: [
      "Beef slices",
      "Soy sauce",
      "Garlic",
      "Sesame oil",
      "Onion",
    ],
    steps: [
      "Marinate the beef with sauce.",
      "Heat pan and add oil.",
      "Cook beef until brown.",
      "Add onion and cook 5 mins.",
      "Serve hot.",
    ],
  };

  const isDark = theme === "dark";

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#fff" },
      ]}
    >
      {/* 1️⃣ IMAGE + TITLE */}
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
        {recipe.title}
      </Text>

      {/* 2️⃣ INFO SECTION */}
      <View style={styles.infoRow}>
        <Text style={styles.badge}>⭐ {recipe.rating}</Text>
        <Text style={styles.badge}>{recipe.cuisine}</Text>
        <Text style={styles.badge}>⏱ {recipe.time}</Text>
      </View>

      {/* 3️⃣ INGREDIENTS */}
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {recipe.ingredients.map((item, index) => (
        <Text key={index} style={styles.text}>
          • {item}
        </Text>
      ))}

      {/* 4️⃣ STEPS */}
      <Text style={styles.sectionTitle}>Steps</Text>
      {recipe.steps.map((step, index) => (
        <Text key={index} style={styles.text}>
          {index + 1}. {step}
        </Text>
      ))}

      {/* 5️⃣ EXTRA INFO */}
      <View style={styles.extraBox}>
        <Text style={styles.extraText}>🔥 Calories: {recipe.calories}</Text>
        <Text style={styles.extraText}>🍽 Servings: {recipe.servings}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#333",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#ff8c00",
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: "#999",
  },
  extraBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#1c1c1c",
  },
  extraText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
  },
});
