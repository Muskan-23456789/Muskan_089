import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { FavoritesProvider } from "../context/FavouriteContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
