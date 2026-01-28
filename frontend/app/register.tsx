import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Animated, StatusBar } from "react-native";
import { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../utils/api";
import { useTheme } from "../context/ThemeContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Validation", "Please fill all fields");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Validation", "Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation", "Passwords don't match");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Validation", "Please enter a valid email");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      Alert.alert("Success", "Account created! Please login.", [
        { text: "OK", onPress: () => router.replace("/login") }
      ]);
    } catch (error: any) {
      Alert.alert("Registration Failed", error?.response?.data?.message || "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <SafeAreaView className={`flex-1 ${bgColor}`}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40 }}>
          <Animated.View style={[{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]} className="px-6">
            
            {/* Header */}
            <View className="items-center mb-12">
              <View className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl items-center justify-center mb-8 shadow-2xl" style={{ shadowColor: '#a855f7', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16 }}>
                <Ionicons name="person-add" size={48} color="white" />
              </View>
              <Text className={`${textColor} text-4xl font-bold tracking-tight`}>Join Us!</Text>
              <Text className={`${secondaryTextColor} mt-3 text-base text-center`}>Create your cooking account and start your journey</Text>
            </View>

            {/* Name Input */}
            <View className="mb-5">
              <Text className={`${secondaryTextColor} mb-3 ml-2 text-sm font-semibold uppercase tracking-wider`}>Full Name</Text>
              <View className={`${inputBgColor} rounded-2xl px-5 py-4 border-2 ${borderColor} flex-row items-center`}>
                <Ionicons name="person" size={22} color="#a855f7" />
                <TextInput
                  className={`flex-1 ${textColor} text-base ml-3 font-medium`}
                  placeholder="John Doe"
                  placeholderTextColor={placeholderColor}
                  onChangeText={setName}
                  value={name}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Email Input */}
            <View className="mb-5">
              <Text className={`${secondaryTextColor} mb-3 ml-2 text-sm font-semibold uppercase tracking-wider`}>Email Address</Text>
              <View className={`${inputBgColor} rounded-2xl px-5 py-4 border-2 ${borderColor} flex-row items-center`}>
                <Ionicons name="mail" size={22} color="#a855f7" />
                <TextInput
                  className={`flex-1 ${textColor} text-base ml-3 font-medium`}
                  placeholder="user@example.com"
                  placeholderTextColor={placeholderColor}
                  onChangeText={setEmail}
                  value={email}
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-5">
              <Text className={`${secondaryTextColor} mb-3 ml-2 text-sm font-semibold uppercase tracking-wider`}>Password</Text>
              <View className={`${inputBgColor} rounded-2xl px-5 py-4 border-2 ${borderColor} flex-row items-center`}>
                <Ionicons name="lock-closed" size={22} color="#a855f7" />
                <TextInput
                  className={`flex-1 ${textColor} text-base ml-3 font-medium`}
                  placeholder="••••••••"
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={!showPassword}
                  onChangeText={setPassword}
                  value={password}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye" : "eye-off"} size={22} color="#a855f7" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View className="mb-8">
              <Text className={`${secondaryTextColor} mb-3 ml-2 text-sm font-semibold uppercase tracking-wider`}>Confirm Password</Text>
              <View className={`${inputBgColor} rounded-2xl px-5 py-4 border-2 ${borderColor} flex-row items-center`}>
                <Ionicons name="lock-closed" size={22} color="#a855f7" />
                <TextInput
                  className={`flex-1 ${textColor} text-base ml-3 font-medium`}
                  placeholder="••••••••"
                  placeholderTextColor={placeholderColor}
                  secureTextEntry={!showConfirmPassword}
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  editable={!loading}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? "eye" : "eye-off"} size={22} color="#a855f7" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              className={`py-4 rounded-2xl shadow-xl mb-6 ${loading ? "bg-purple-600" : "bg-gradient-to-r from-purple-500 to-pink-500"}`}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-bold text-lg">
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className={`flex-1 h-px ${isDark ? "bg-neutral-700" : "bg-gray-300"}`} />
              <Text className={`${secondaryTextColor} mx-3 text-sm`}>or</Text>
              <View className={`flex-1 h-px ${isDark ? "bg-neutral-700" : "bg-gray-300"}`} />
            </View>

            {/* Terms & Conditions */}
            <Text className={`${secondaryTextColor} text-xs text-center mb-6`}>
              By signing up, you agree to our <Text className="text-purple-500 font-semibold">Terms</Text> and <Text className="text-purple-500 font-semibold">Privacy Policy</Text>
            </Text>

            {/* Login Link */}
            <View className="flex-row justify-center items-center">
              <Text className={secondaryTextColor}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/login")} disabled={loading}>
                <Text className="text-purple-500 font-bold text-base">Login</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
