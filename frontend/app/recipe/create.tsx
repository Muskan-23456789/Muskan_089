import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import api from "../../utils/api";

export default function CreateRecipe() {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    await api.post("/recipes", {
      name,
      ingredients: ["Test ingredient"],
      instructions: ["Test instruction"],
      prepTimeMinutes: 10,
      cookTimeMinutes: 10,
      servings: 2,
      difficulty: "Easy",
      cuisine: "Indian",
      image: "https://dummyimage.com/300",
    });
  };

  return (
    <View className="flex-1 bg-black px-6 pt-6">
      <Text className="text-white text-xl font-bold mb-4">Create Recipe</Text>

      <TextInput
        className="bg-white rounded-lg px-4 py-3 mb-4"
        placeholder="Recipe Name"
        onChangeText={setName}
      />

      <TouchableOpacity
        className="bg-green-600 py-3 rounded-lg"
        onPress={handleCreate}
      >
        <Text className="text-white text-center font-bold">Create</Text>
      </TouchableOpacity>
    </View>
  );
}
