import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Animated, ScrollView, StatusBar } from "react-native";
import { useState, useRef } from "react";
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
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const bgColor = isDark ? "bg-neutral-900" : "bg-white";
  const inputBgColor = isDark ? "bg-neutral-800" : "bg-gray-100";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryTextColor = isDark ? "text-neutral-400" : "text-gray-600";
  const borderColor = isDark ? "border-neutral-700" : "border-gray-300";
  const placeholderColor = isDark ? "#525252" : "#999";

  useState(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })
    ]).start();
  });

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Validation", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      if (res.data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      }
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Login Failed", error?.response?.data?.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <SafeAreaView className={`flex-1 ${bgColor}`}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]} className="flex-1 justify-center px-6">
            
            {/* Header with Gradient Effect */}
            <View className="items-center mb-12">
              <View className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl items-center justify-center mb-8 shadow-2xl" style={{ shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 }}>
                <Ionicons name="restaurant" size={48} color="white" />
              </View>
              <Text className={`${textColor} text-4xl font-bold tracking-tight`}>Welcome Back!</Text>
              <Text className={`${secondaryTextColor} mt-3 text-base text-center`}>Login to your cooking adventure</Text>
            </View>

            {/* Email Input */}
            <View className="mb-5">
              <Text className={`${secondaryTextColor} mb-3 ml-2 text-sm font-semibold uppercase tracking-wider`}>Email Address</Text>
              <View className={`${inputBgColor} rounded-2xl px-5 py-4 border-2 ${borderColor} flex-row items-center`}>
                <Ionicons name="mail" size={22} color="#4f46e5" />
                <TextInput
                  placeholder="your@email.com"
                  placeholderTextColor={placeholderColor}
                  className={`flex-1 ${textColor} text-base ml-3 font-medium`}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-8">
              <Text className={`${secondaryTextColor} mb-3 ml-2 text-sm font-semibold uppercase tracking-wider`}>Password</Text>
              <View className={`${inputBgColor} rounded-2xl px-5 py-4 border-2 ${borderColor} flex-row items-center`}>
                <Ionicons name="lock-closed" size={22} color="#4f46e5" />
                <TextInput
                  placeholder="••••••••"
                  placeholderTextColor={placeholderColor}
                  className={`flex-1 ${textColor} text-base ml-3 font-medium`}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color="#4f46e5" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity className="mb-8">
              <Text className="text-indigo-500 text-right font-semibold">Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={`py-4 rounded-2xl shadow-xl mb-6 ${loading ? "bg-indigo-600" : "bg-gradient-to-r from-indigo-500 to-purple-600"}`}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-lg">
                {loading ? "Logging In..." : "Login"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className={`flex-1 h-px ${isDark ? "bg-neutral-700" : "bg-gray-300"}`} />
              <Text className={`${secondaryTextColor} mx-3 text-sm`}>or</Text>
              <View className={`flex-1 h-px ${isDark ? "bg-neutral-700" : "bg-gray-300"}`} />
            </View>

            {/* Social Login */}
            <View className="flex-row gap-4 mb-8">
              <TouchableOpacity className={`flex-1 py-3 rounded-xl border-2 ${borderColor} items-center`}>
                <Text className="text-2xl">👤</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`flex-1 py-3 rounded-xl border-2 ${borderColor} items-center`}>
                <Text className="text-2xl">🔵</Text>
              </TouchableOpacity>
              <TouchableOpacity className={`flex-1 py-3 rounded-xl border-2 ${borderColor} items-center`}>
                <Text className="text-2xl">🍎</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center">
              <Text className={secondaryTextColor}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/register")} disabled={loading}>
                <Text className="text-indigo-500 font-bold text-base">Sign Up</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
