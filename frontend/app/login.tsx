import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/context/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { isDark } = useTheme();

  const bgColor = isDark ? "bg-neutral-900" : "bg-gray-50";
  const inputBgColor = isDark ? "bg-neutral-800" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryTextColor = isDark ? "text-neutral-400" : "text-gray-600";
  const borderColor = isDark ? "border-neutral-700" : "border-gray-300";
  const placeholderColor = isDark ? "#525252" : "#999";

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      console.log("LOGIN CLICKED");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN SUCCESS 👉", res.data);

      await AsyncStorage.setItem("token", res.data.token);
      if (res.data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      }
      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("LOGIN ERROR 👉", error);

      Alert.alert(
        "Login Failed",
        error?.response?.data?.message || error?.message || "Server not reachable"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <SafeAreaView className={`flex-1 ${bgColor}`}>
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-indigo-500 rounded-2xl items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
              <Ionicons name="log-in" size={40} color="white" />
            </View>
            <Text className={`${textColor} text-3xl font-bold`}>Welcome Back</Text>
            <Text className={`${secondaryTextColor} mt-2`}>Login to your account</Text>
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className={`${secondaryTextColor} mb-2 ml-1 text-sm font-medium`}>Email Address</Text>
            <View className={`${inputBgColor} rounded-xl px-4 py-3 border ${borderColor} flex-row items-center`}>
              <Ionicons name="mail-outline" size={20} color={placeholderColor} />
              <TextInput
                placeholder="your@email.com"
                placeholderTextColor={placeholderColor}
                className={`flex-1 ${textColor} text-base ml-3`}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>
          <View className="mb-6">
            <Text className={`${secondaryTextColor} mb-2 ml-1 text-sm font-medium`}>Password</Text>
            <View className={`${inputBgColor} rounded-xl px-4 py-3 border ${borderColor} flex-row items-center`}>
              <Ionicons name="lock-closed-outline" size={20} color={placeholderColor} />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor={placeholderColor}
                className={`flex-1 ${textColor} text-base ml-3`}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color={placeholderColor} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className={`py-4 rounded-xl shadow-lg shadow-indigo-500/20 ${loading ? "bg-indigo-600" : "bg-indigo-500"}`}
          >
            <Text className="text-white text-center font-bold text-lg">
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-6">
            <Text className={secondaryTextColor}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")} disabled={loading}>
              <Text className="text-indigo-400 font-bold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
