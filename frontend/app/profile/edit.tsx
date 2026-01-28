import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import api from "../../utils/api";

export default function EditProfile() {
  const [bio, setBio] = useState("");
  const saveProfile = async () => {
    await api.put("/users/profile", { bio });
  };
return (
    <View className="flex-1 bg-black px-6 pt-6">
      <Text className="text-white text-xl font-bold mb-4">Edit Profile</Text>

      <TextInput
        className="bg-white rounded-lg px-4 py-3 mb-4"
        placeholder="Bio"
        onChangeText={setBio}
      />

      <TouchableOpacity
        className="bg-green-600 py-3 rounded-lg"
        onPress={saveProfile}
      >
        <Text className="text-white text-center font-bold">Save</Text>
      </TouchableOpacity>
    </View>
  );
}




























