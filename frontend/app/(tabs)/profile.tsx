import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import api from "../../utils/api";
import { useTheme } from "../../context/ThemeContext";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ recipes: 12, followers: 45, saved: 108 });
  const { theme, toggleTheme, isDark } = useTheme();

  const bgColor = isDark ? "bg-neutral-900" : "bg-gray-50";
  const headerBgColor = isDark ? "bg-neutral-800" : "bg-white";
  const cardBgColor = isDark ? "bg-neutral-800" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryTextColor = isDark ? "text-neutral-400" : "text-gray-600";
  const borderColor = isDark ? "border-neutral-700" : "border-gray-200";

  useEffect(() => {
    setUser({ username: "Muskan_Singh", email: "muskan@example.com", name: "Muskan Singh", avatar: null });

    api.get("/users/profile").then(res => {
        if(res.data?.data) {
             setUser(res.data.data);
             if(res.data.data.recipesCount || res.data.data.followersCount || res.data.data.savedCount) {
               setStats({
                 recipes: res.data.data.recipesCount || 10,
                 followers: res.data.data.followersCount || 35,
                 saved: res.data.data.savedCount || 100
               });
             }
        }
    }).catch(err => console.log("API Error (using mock)", err));
  }, []);

  if (!user) {
      return (
          <View className="flex-1 bg-neutral-900 justify-center items-center">
              <Text className="text-white">Loading...</Text>
          </View>
      );
  }
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => router.replace("/login") },
    ]);
  };
  return (
    <View className={`flex-1 ${bgColor}`}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <View className={`items-center pt-12 pb-8 ${headerBgColor} rounded-b-[40px] shadow-lg shadow-black/20`}>
                <View className="relative">
                    <View className={`w-28 h-28 ${isDark ? "bg-neutral-700" : "bg-gray-200"} rounded-full items-center justify-center border-4 ${isDark ? "border-neutral-900" : "border-gray-50"}`}>
                         {user.avatar ? (
                            <Image source={{ uri: user.avatar }} className="w-full h-full rounded-full" />
                         ) : (
                             <Ionicons name="person" size={50} color={isDark ? "#525252" : "#999"} />
                         )}
                    </View>
                    <View className="absolute bottom-2 right-2 w-5 h-5 bg-indigo-500 rounded-full border-3 border-neutral-800" />
                    <TouchableOpacity className="absolute bottom-0 right-0 bg-indigo-500 p-2 rounded-full border-2 border-neutral-900" onPress={() => router.push("/profile/edit")}>
                        <Ionicons name="pencil" size={16} color="white" />
                    </TouchableOpacity>
                </View>
                
                <Text className={`${textColor} text-2xl font-bold mt-4`}>{user.username}</Text>
                <Text className={secondaryTextColor}>{user.email}</Text>

                <View className="flex-row mt-6 space-x-12">
                    <View className="items-center">
                        <Text className={`${textColor} font-bold text-lg`}>{stats.recipes}</Text>
                        <Text className={`${isDark ? "text-neutral-500" : "text-gray-500"} text-xs uppercase tracking-wider`}>Recipes</Text>
                    </View>
                    <View className="items-center">
                        <Text className={`${textColor} font-bold text-lg`}>{stats.followers}</Text>
                        <Text className={`${isDark ? "text-neutral-500" : "text-gray-500"} text-xs uppercase tracking-wider`}>Followers</Text>
                    </View>
                    <View className="items-center">
                        <Text className={`${textColor} font-bold text-lg`}>{stats.saved}</Text>
                        <Text className={`${isDark ? "text-neutral-500" : "text-gray-500"} text-xs uppercase tracking-wider`}>Saved</Text>
                    </View>
                </View>
            </View>

            {/* Settings Section */}
            <View className="px-6 mt-8 space-y-4">
                <Text className={`${secondaryTextColor} text-sm font-medium ml-2 mb-2 uppercase tracking-widest`}>Settings</Text>
                
                {/* Theme Toggle */}
                <TouchableOpacity className={`flex-row items-center ${cardBgColor} p-4 rounded-xl border ${borderColor}`} onPress={toggleTheme}>
                    <View className="w-10 h-10 bg-indigo-500/10 items-center justify-center rounded-lg mr-4">
                         <Ionicons name={isDark ? "moon" : "sunny"} size={20} color="#6366f1" />
                    </View>
                    <Text className={`flex-1 ${textColor} font-medium text-base`}>{isDark ? "Dark Mode" : "Light Mode"}</Text>
                    <Ionicons name={isDark ? "moon" : "sunny"} size={20} color="#6366f1" />
                </TouchableOpacity>

                <TouchableOpacity className={`flex-row items-center ${cardBgColor} p-4 rounded-xl border ${borderColor}`} onPress={() => router.push("/profile/edit")}>
                    <View className="w-10 h-10 bg-indigo-500/10 items-center justify-center rounded-lg mr-4">
                         <Ionicons name="person-outline" size={20} color="#6366f1" />
                    </View>
                    <Text className={`flex-1 ${textColor} font-medium text-base`}>Edit Profile</Text>
                    <Ionicons name="chevron-forward" size={20} color={isDark ? "#525252" : "#ccc"} />
                </TouchableOpacity>

                <TouchableOpacity className={`flex-row items-center ${cardBgColor} p-4 rounded-xl border ${borderColor}`}>
                    <View className="w-10 h-10 bg-indigo-500/10 items-center justify-center rounded-lg mr-4">
                         <Ionicons name="notifications-outline" size={20} color="#6366f1" />
                    </View>
                    <Text className={`flex-1 ${textColor} font-medium text-base`}>Notifications</Text>
                    <Ionicons name="chevron-forward" size={20} color={isDark ? "#525252" : "#ccc"} />
                </TouchableOpacity>

                <TouchableOpacity className={`flex-row items-center ${cardBgColor} p-4 rounded-xl border ${borderColor}`}>
                    <View className="w-10 h-10 bg-indigo-500/10 items-center justify-center rounded-lg mr-4">
                         <Ionicons name="shield-checkmark-outline" size={20} color="#6366f1" />
                    </View>
                    <Text className={`flex-1 ${textColor} font-medium text-base`}>Privacy & Security</Text>
                    <Ionicons name="chevron-forward" size={20} color={isDark ? "#525252" : "#ccc"} />
                </TouchableOpacity>

                 <TouchableOpacity 
                    className={`flex-row items-center bg-red-500/10 p-4 rounded-xl mt-4 border ${borderColor}`}
                    onPress={handleLogout}
                >
                    <View className="w-10 h-10 bg-red-500/10 items-center justify-center rounded-lg mr-4">
                         <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                    </View>
                    <Text className="flex-1 text-red-500 font-medium text-base">Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
  );
}

