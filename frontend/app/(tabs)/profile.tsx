import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Animated, StatusBar, Modal, TextInput, ActivityIndicator } from "react-native";
import { useEffect, useState, useRef } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from 'expo-image-picker';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ recipes: 12, followers: 45, saved: 108 });
  const [modals, setModals] = useState({ edit: false, password: false });
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState({ visible: false, message: "" });

  const { isDark, toggleTheme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const theme = {
    bg: isDark ? "bg-neutral-900" : "bg-white",
    card: isDark ? "bg-neutral-800/50" : "bg-gray-50",
    text: isDark ? "text-white" : "text-gray-900",
    subText: isDark ? "text-neutral-400" : "text-gray-600",
    border: isDark ? "border-neutral-700" : "border-gray-200",
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const local = await AsyncStorage.getItem("user");
      if (local) {
        const parsed = JSON.parse(local);
        setUser(parsed);
        setFormData(prev => ({ ...prev, name: parsed.firstName || "User" }));
      } else {
        // Set default if no user in storage
        setUser({ firstName: "User", lastName: "", email: "user@example.com" });
      }
    } catch (err) { 
      console.log("Load error:", err);
      setUser({ firstName: "User", lastName: "", email: "user@example.com" });
    }
    
    // Always stop loading immediately
    setLoading(false);
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    
    // Fetch fresh data in background
    try {
      const res = await api.get("/users/profile");
      if (res.data?.data) {
        setUser(res.data.data);
        setFormData(prev => ({ ...prev, name: res.data.data.firstName }));
      }
    } catch (err) {
      console.log("API error:", err);
    }
  };

  const triggerToast = (msg: string) => {
    setNotification({ visible: true, message: msg });
    Animated.sequence([
      Animated.spring(successAnim, { toValue: 1, useNativeDriver: true }),
      Animated.delay(2000),
      Animated.spring(successAnim, { toValue: 0, useNativeDriver: true })
    ]).start(() => setNotification({ ...notification, visible: false }));
  };

  const handleUpdate = async (type: 'profile' | 'password') => {
    const isPass = type === 'password';
    if (isPass && formData.password.length < 6) return Alert.alert("Error", "Min 6 chars");

    try {
      const payload = isPass ? { password: formData.password } : { firstName: formData.name };
      await api.put("/users/profile", payload);
      
      if (!isPass) {
        const updated = { ...user, firstName: formData.name };
        setUser(updated);
        await AsyncStorage.setItem("user", JSON.stringify(updated));
      }
      
      setModals({ edit: false, password: false });
      setFormData(prev => ({ ...prev, password: "" }));
      triggerToast(isPass ? "✅ Password Updated!" : "✅ Profile Updated!");
    } catch (err) { Alert.alert("Error", "Update failed"); }
  };

  if (!user) return (
    <View className={`flex-1 items-center justify-center ${theme.bg}`}>
      <ActivityIndicator size="large" color="#4f46e5" />
    </View>
  );

  return (
    <View className={`flex-1 ${theme.bg}`}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {notification.visible && (
        <Animated.View style={{ opacity: successAnim, transform: [{ translateY: successAnim.interpolate({inputRange:[0,1], outputRange:[-20, 0]}) }] }}
          className="absolute top-12 self-center z-50 bg-green-500 rounded-2xl px-6 py-3 shadow-xl flex-row items-center">
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text className="text-white font-bold ml-2">{notification.message}</Text>
        </Animated.View>
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      
        <Animated.View style={{ opacity: fadeAnim }} className="items-center pt-10 pb-6 border-b border-gray-100 dark:border-neutral-800">
          <TouchableOpacity onPress={async () => {
            const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1] });
            if (!res.canceled) setUser({ ...user, avatar: res.assets[0].uri });
          }} className="mb-4">
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} className="w-28 h-28 rounded-full border-4 border-indigo-500" />
            ) : (
              <View className="w-28 h-28 rounded-full border-4 border-indigo-500 bg-indigo-100 dark:bg-indigo-900 items-center justify-center">
                <Ionicons name="person" size={48} color="#6366f1" />
              </View>
            )}
            <View className="absolute bottom-0 right-0 bg-indigo-500 p-2 rounded-full border-2 border-white">
              <Ionicons name="camera" size={16} color="white" />
            </View>
          </TouchableOpacity>
          <Text className={`${theme.text} text-2xl font-bold`}>{user.firstName} {user.lastName}</Text>
          <Text className={theme.subText}>{user.email}</Text>
        </Animated.View>
        <View className="flex-row justify-around py-6">
          {Object.entries(stats).map(([label, value]) => (
            <View key={label} className="items-center">
              <Text className={`${theme.text} text-xl font-bold`}>{value}</Text>
              <Text className={`${theme.subText} text-xs uppercase`}>{label}</Text>
            </View>
          ))}
        </View>
        <View className="px-6 gap-3">
          <SettingItem icon="person" label="Edit Profile" sub="Update details" theme={theme} onPress={() => setModals({ ...modals, edit: true })} />
          <SettingItem icon="key" label="Password" sub="Change security" theme={theme} onPress={() => setModals({ ...modals, password: true })} />
          <SettingItem icon={isDark ? "moon" : "sunny"} label="Appearance" sub={isDark ? "Dark Mode" : "Light Mode"} theme={theme} onPress={toggleTheme} isToggle />
          
          <TouchableOpacity onPress={() => Alert.alert("Logout", "Sure?", [{text: "No"}, {text: "Yes", onPress: () => router.replace("/login")}])}
            className="mt-6 bg-red-50 p-4 rounded-2xl items-center flex-row justify-center border border-red-100">
            <Ionicons name="log-out" size={20} color="#ef4444" />
            <Text className="text-red-500 font-bold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <EntryModal 
        visible={modals.edit || modals.password} 
        onClose={() => setModals({ edit: false, password: false })}
        title={modals.edit ? "Edit Profile" : "Change Password"}
        theme={theme}
      >
        {modals.edit ? (
          <>
            <TextInput 
              className={`${theme.text} ${theme.card} p-4 rounded-xl mb-4 border border-gray-300`}
              placeholder="First Name"
              placeholderTextColor="#999"
              value={formData.name}
              onChangeText={(v) => setFormData({...formData, name: v})}
            />
            <TouchableOpacity onPress={() => handleUpdate('profile')} className="bg-indigo-500 p-4 rounded-xl">
              <Text className="text-white text-center font-bold">Save Changes</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View className="relative mb-4">
              <TextInput 
                className={`${theme.text} ${theme.card} p-4 rounded-xl border border-gray-300 pr-12`}
                placeholder="New Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(v) => setFormData({...formData, password: v})}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4"
              >
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#6366f1" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleUpdate('password')} className="bg-indigo-500 p-4 rounded-xl">
              <Text className="text-white text-center font-bold">Change Password</Text>
            </TouchableOpacity>
          </>
        )}
      </EntryModal>
    </View>
  );
}
const SettingItem = ({ icon, label, sub, theme, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className={`${theme.card} p-4 rounded-2xl flex-row items-center border ${theme.border}`}>
    <View className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg items-center justify-center mr-4">
      <Ionicons name={icon} size={20} color="#6366f1" />
    </View>
    <View className="flex-1">
      <Text className={`${theme.text} font-semibold`}>{label}</Text>
      <Text className={`${theme.subText} text-xs`}>{sub}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color="#999" />
  </TouchableOpacity>
);

const EntryModal = ({ visible, onClose, title, children, theme }: any) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View className={`flex-1 justify-end bg-black/50`}>
      <View className={`${theme.bg} p-6 rounded-t-3xl`}>
        <View className="flex-row justify-between mb-6">
          <Text className={`${theme.text} text-xl font-bold`}>{title}</Text>
          <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color={theme.text.includes("white") ? "white" : "black"} /></TouchableOpacity>
        </View>
        {children}
      </View>
    </View>
  </Modal>
);